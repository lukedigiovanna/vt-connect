import atexit
from flask import Flask, send_from_directory, abort, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2 import pool
from dotenv import load_dotenv
import os
import json
import bcrypt
import base64
import io
from functools import wraps
import boto3
from werkzeug.utils import secure_filename
import traceback

load_dotenv()

print("Connecting to database...")

user, password = "rhbtxrau", "UEb8xzkihXobALYy_FVbOuP9OGmpIgGq"

print(
    f'Loaded user, password: ({user}, {password[0:3] + "*" * (len(password) - 3)})')

db_pool = pool.SimpleConnectionPool(
    minconn=1,
    maxconn=10,
    host="peanut.db.elephantsql.com",
    database="rhbtxrau",
    user=user,
    password=password
)

if db_pool.closed:
    print("FATAL ERROR: could not connect to the database")
    exit(1)

# cursor = conn.cursor()

print("Successfully connected to database!")

print("Setting up flask app...")
app = Flask(__name__, static_folder="static")
    
# Enable CORS to allow requests from any origin
CORS(app)

def with_db_connection(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        conn = db_pool.getconn()
        try:
            with conn.cursor() as cursor:
                return f(conn, cursor, *args, **kwargs)
        finally:
            db_pool.putconn(conn)
    return decorated_function


"""
Returns the public HTML of the page
"""
@app.route('/')
def root():
    return send_from_directory(app.static_folder, "index.html")


def snake_case_to_camel_case(string):
    tokens = string.split('_')
    tokens = [tokens[0]] + \
        list(map(lambda s: s[0].upper() + s[1:], tokens[1:]))
    return ''.join(tokens)


def has_all_fields(object, fields, require_content=True):
    return len(list(filter(lambda f: f not in object or (require_content and len(object[f]) == 0), fields))) == 0


"""
Returns a dictionary/JSON representation of the query results, which
is useful for returning and processing the results on the frontend.
"""
def get_formatted_query_results(cursor):
    results = cursor.fetchall()
    column_names = [desc[0] for desc in cursor.description]

    def format(result):
        return {snake_case_to_camel_case(column_names[i]): result[i] for i in range(len(column_names))}
    formatted_results = list(map(format, results))
    return formatted_results


def get_user(cursor, pid):
    cursor.execute(f"SELECT * FROM user_account WHERE pid='{pid}'")
    results = get_formatted_query_results(cursor)
    if len(results) == 0:
        return None
    else:
        return results[0]


"""
Checks if a user with the given PID already exists.
"""
def user_exists(cursor, pid):
    cursor.execute(f"SELECT * FROM user_account WHERE pid='{pid}'")
    result = cursor.fetchall()
    return len(result) > 0


def get_optional_attrib(body, name):
    field = body[name]
    if field is None or len(field) == 0:
        return None
    else:
        return body[name]


def get_admin_attrib(body):
    admin = body.get('admin')
    return bool(admin) if admin is not None else None

"""
Takes in pid and major to update the major of an user based on 
the passed in PID
"""
@app.route('/api/update-user', methods=["POST"])
@with_db_connection
def update_user(conn, cursor):
    try:
        body = request.get_json()
        pid = body['pid']
        major = body['major']

        bio = body['bio']

        # update user's major in the database
        cursor.execute(
            "UPDATE user_account SET major = %s, bio = %s WHERE pid = %s", (major, bio, pid))
        conn.commit()

        # check the number of rows affected
        if cursor.rowcount == 0:
            return jsonify({'message': 'User not found or no update needed'}), 404

        return jsonify({'message': 'User updated successfully'}), 200

    except Exception as e:
        print(str(e))  # log the error for debugging purposes
        return jsonify({'message': 'An error occurred while updating the user'}), 500


"""""
Given a user'd pid number, return all their events they are subscribed to 
"""""


@app.route("/api/display_event_from_id", methods=['POST'])
@with_db_connection
def display_events_from_user(conn, cursor):
    try:
        body = request.get_json()
        pid = body["pid"]


        cursor.execute(
    "SELECT event.* FROM event_attendee JOIN event ON event_attendee.event_id = event.id WHERE event_attendee.user_pid = %s",
    (pid,)
)

        # Fetch all rows as a list of dictionaries
        events = cursor.fetchall()

        column_names = [desc[0] for desc in cursor.description]

        events_list = []
        for event in events:
            event_name = event[column_names.index('title')]  # Replace 'title' with the actual column name for event name
            host_pid = event[column_names.index('host_pid')]  # Replace 'host_pid' with the actual column name for host pid
            events_list.append((event_name, host_pid))



        conn.commit()

        # Convert the list of tuples to a list of dictionaries

        return jsonify(events_list), 200

    except Exception as e:
        print("Error " + str(e))
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500


"""""
Deletes event which only admins can do 
"""""
@app.route("/api/deleteEvent", methods=['POST'])
@with_db_connection
def delete_event(conn, cursor):
    try:
        body = request.get_json()
        event_id = body['eventId']

        cursor.execute(
            "DELETE FROM event_attendee WHERE event_id=%s", event_id)
        cursor.execute("DELETE FROM event WHERE id=%s", event_id)

        conn.commit()

        return jsonify({'message': 'Event deleted successfully'}), 200
    except Exception as e:
        print("Error " + str(e))
        return jsonify({'message': 'An error occured when attempting to delete the event'}), 500


"""
Takes in the pid of a user and removes them from the database
"""
@app.route('/api/deleteUser', methods=["POST"])
@with_db_connection
def delete_user(conn, cursor):
    try:
        body = request.get_json()
        pid = body['pid']

        # check if the user exists before attempting to delete
        cursor.execute("SELECT * FROM user_account WHERE pid = %s", (pid,))
        if cursor.fetchone() is None:
            return jsonify({'message': 'User not found'}), 404

        # delete user from the database
        cursor.execute("DELETE FROM user_account WHERE pid = %s", (pid,))
        conn.commit()

        return jsonify({'message': 'User deleted successfully'}), 200

    except Exception as e:
        # log the error for debugging
        print(str(e))
        return jsonify({'message': 'An error occurred while deleting the user'}), 500


"""
Takes all user information necessary to sign the user up or uses
default values when necessary.

Will return an error status if any fields are not given
"""
@app.route('/api/signup', methods=["POST"])
@with_db_connection
def signup(conn, cursor):
    body = json.loads(request.data.decode())

    necessary_fields = ['pid', 'password', 'firstName', 'lastName']

    if not has_all_fields(body, necessary_fields):
        print("no fields ")
        return 'Missing a required request parameter', 400

    pid, password, firstName, lastName = body['pid'], body['password'], body['firstName'], body['lastName']

    if user_exists(cursor, pid):
        print("Happening here ")
        return 'A user with that pid already exists', 400
    
    major, bio, is_admin = get_optional_attrib(
        body, 'major'), get_optional_attrib(body, 'bio'), get_admin_attrib(body)

    hash = bcrypt.hashpw(password.encode('utf-8'),
                         bcrypt.gensalt()).decode('utf-8')

    cursor.execute("""INSERT INTO user_account (pid, hash, email, first_name, last_name, major, bio, is_admin)
                      VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
                   (pid, hash, f"{pid}@vt.edu", firstName, lastName, major, bio, is_admin))

    conn.commit()
    user = get_user(cursor, pid)
    if not bcrypt.checkpw(password.encode('utf-8'), user['hash'].encode('utf-8')):
        return 'Wrong password', 400
    return user


def get_optional_boolean(body, name):
    field = body.get(name)
    return field if isinstance(field, bool) else None


@app.route('/api/login', methods=["POST"])
@with_db_connection
def login(conn, cursor):
    # expect a pid and a password
    body = json.loads(request.data.decode())

    necessary_fields = ['pid', 'password']

    if not has_all_fields(body, necessary_fields):
        return 'Missing a required request parameter', 400

    pid, password = body['pid'], body['password']
    admin_request = get_optional_boolean(body, 'isAdmin')

    user = get_user(cursor, pid)

    if user is None:
        return 'No user exists with that PID', 400

    # otherwise compare the password against that users hash
    if not bcrypt.checkpw(password.encode('utf-8'), user['hash'].encode('utf-8')):
        return 'Wrong password', 400

    if admin_request:
        if user.get("isAdmin") is None:
            return 'Unauthorized client', 401

    return jsonify(user), 200


@app.route('/api/signup-admin', methods=['POST'])
@with_db_connection
def signup_admin(conn, cursor):
    body = json.loads(request.data.decode())

    necessary_fields = ['pid', 'password', 'major', 'firstName', 'lastName']

    if not has_all_fields(body, necessary_fields):
        return 'Missing a required request', 400

    pid, password, firstName, lastName = body['pid'], body['password'], body['firstName'], body['lastName']

    major, bio = get_optional_attrib(
        body, 'major'), get_optional_attrib(body, 'bio')

    hash = bcrypt.hashpw(password.encode('utf-8'),
                         bcrypt.gensalt()).decode('utf-8')


"""
Ability to change password 
"""
@app.route("/api/change-password", methods=['POST'])
@with_db_connection
def change_password(conn, cursor):
    body = json.loads(request.data.decode())

    necessary_fields = ['pid', 'new_password']
    if not has_all_fields(body, necessary_fields):
        return 'Missing a required request parameter', 400

    pid, new_password = body['pid'], body['new_password']
    user = get_user(pid)

    if user is None:
        return 'No user exists with that pid', 400

    # Now update the current user's password with the new password
    new_hashed_password = bcrypt.hashpw(new_password.encode(
        'utf-8'), bcrypt.gensalt()).decode('utf-8')

    try:
        cursor.execute("""UPDATE user_account 
                            SET hash = %s 
                            WHERE pid = %s""",
                       (new_hashed_password, pid))
        conn.commit()
        return jsonify({'message': 'Password updated successfully'}), 200

    except Exception as e:
        print("Error updating passowrd")
        conn.rollback()
        return 'Error updating password', 500


"""
Gets a JSON array of all registered users
"""
@app.route('/api/users', methods=["GET"])
@with_db_connection
def users(conn, cursor):
    # get up to 300 users
    cursor.execute('SELECT * FROM user_account LIMIT 300 OFFSET 0')
    return get_formatted_query_results(cursor)


"""
Gets JSON of a given user's PID
"""
@app.route('/api/user', methods=["GET"])
@with_db_connection
def user_with_id(conn, cursor):
    pid = request.args.get('pid')
    if pid == None:
        return "Must specify a user pid", 400

    user = get_user(cursor, pid)
    if user == None:
        return "User does not exist", 400
    else:
        return user


"""
Gets a JSON array of the next events sorted by start time in ascending order (oldest first)
"""
@app.route('/api/events', methods=["GET"])
@with_db_connection
def events(conn, cursor):
    pid = request.args.get('hostedBy')
    if pid is not None:
        cursor.execute(
            "SELECT * FROM event WHERE host_pid=%s ORDER BY start_time LIMIT 300 OFFSET 0",
            (pid,)
        )
    else:
        cursor.execute(
            'SELECT * FROM event ORDER BY start_time LIMIT 300 OFFSET 0')
    return get_formatted_query_results(cursor)


"""
GET:
Gets a particular event from the query params
Expected to call as /api/event?id=<id>
Example: /api/event?id=3uudiwo32093jfdalwo3io

POST:
creates an event with the given information
"""
@app.route('/api/event', methods=["GET", "POST"])
@with_db_connection
def event(conn, cursor):
    if request.method == "GET":
        event_id = request.args.get('id')

        if event_id is None:
            return "Must specify an event id to query", 400
        

        cursor.execute('SELECT * FROM event WHERE id=%s', (event_id,))
        results = get_formatted_query_results(cursor)
        if len(results) == 0:
            return "No event found", 400

        return results[0]
    elif request.method == "POST":
        body = json.loads(request.data.decode())

        necessary_fields = ["title", "startTime", "hostId"]


'''
POST:
Adding an event to the database that a user creates 
'''
@app.route('/api/addEvent', methods=["POST"])
@with_db_connection
def addEvent(conn, cursor):
    # TODO: if not post, we should throw an error
    if request.method == "POST":
        body = json.loads(request.data.decode())

        title = body['title']
        description = body['description']
        start = body['start']
        end = body['end']
        imageURL = body['imageURL']
        user = body['user']

        sql_query = """
    INSERT INTO event (title, description, start_time, end_time, image_url, host_pid, location_id) 
    VALUES (%s, %s, %s, %s, %s, %s, %s)"""

        # Execute the query with parameters from the request body
        cursor.execute(sql_query, (title, description,
                       start, end, imageURL, "test", "0"))

        # Commit the transaction to save changes
        conn.commit()

    return user


@app.route('/api/admin/statistics', methods=["GET"])
@with_db_connection
def admin_statistics(conn, cursor):
    try:
        cursor.execute('SELECT COUNT(*) as user_count FROM user_account')
        user_count = cursor.fetchone()[0]

        cursor.execute('SELECT COUNT(*) as event_count FROM event')
        event_count = cursor.fetchone()[0]

        cursor.execute(
            'SELECT major, COUNT(*) as count FROM user_account GROUP BY major')
        major_distribution = get_formatted_query_results(cursor)

        # Query to get the count of events per month
        cursor.execute("""
            SELECT EXTRACT(MONTH FROM start_time) as month, COUNT(*) as count 
            FROM event 
            GROUP BY EXTRACT(MONTH FROM start_time)
        """)
        events_per_month = get_formatted_query_results(cursor)

        return jsonify({
            'userCount': user_count,
            'eventCount': event_count,
            'majorDistribution': major_distribution,
            'eventsPerMonth': events_per_month  # Include the new data in the response
        })
    except Exception as e:
        print(str(e))
        return jsonify({'message': 'Error fetching statistics'}), 500


@app.route('/api/event-attendee', methods=['POST'])
@with_db_connection
def sign_up_for_event(conn, cursor):
    try:
        body = request.get_json()
        print(body)
        user_pid = body['userPid']
        event_id = body['eventId']

        if not user_exists(cursor, user_pid):
            return jsonify({'message': 'User not found'}), 404

        # Check if the event exists
        cursor.execute("SELECT * FROM event WHERE id = %s", (event_id,))
        if cursor.fetchone() is None:
            return jsonify({'message': 'Event not found'}), 404

        # Check if the user is already signed up for the event
        cursor.execute(
            "SELECT * FROM event_attendee WHERE user_pid = %s AND event_id = %s", (user_pid, event_id))
        if cursor.fetchone() is not None:
            return jsonify({'message': 'User already signed up for this event'}), 400

        # Sign up the user for the event
        cursor.execute(
            "INSERT INTO event_attendee (user_pid, event_id) VALUES (%s, %s)", (user_pid, event_id))
        conn.commit()

        return jsonify({'message': 'Successfully signed up for the event'}), 200

    except Exception as e:
        print(str(e))
        conn.rollback()
        return jsonify({'message': 'An error occurred while signing up for the event'}), 500

@app.route('/api/saveImage', methods=["POST"])
def saveImage(): 
    try:
        # Check if the post request has the image data
        if 'image' not in request.json:
            return jsonify({"error": "No image data"}), 400

        image_data = request.json['image']
        # Split the string to separate the metadata from the image data
        header, encoded = image_data.split(",", 1)
        # Decode the image data
        decoded = base64.b64decode(encoded)

        # Generate a filename (this should be more unique in a real application)
        filename = request.json['file_name']  # You might want to generate this dynamically

        # Upload to S3
        s3 = boto3.client(
            's3',
            aws_access_key_id='AKIAX5FFWW5URC7YQ3UG',
            aws_secret_access_key='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',
            region_name='us-east-2'
        )
   
        try:
            s3.upload_fileobj(
                io.BytesIO(decoded),
                "dbms-final",
                filename, 
                ExtraArgs={'ACL': 'public-read'}
            )
        except Exception as e:
            print("An error occurred during file upload.")
            print(str(e))
            print(traceback.format_exc()) 
  
        file_url = f'https://dbms-final.s3.amazonaws.com/{filename}'

        return jsonify({"message": "File uploaded successfully", "file_url": file_url, "file_name":filename})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Safely close connections/resources when the server is shutdown for any reason

def shutdown():
    print("Flask is shutting down...")
    db_pool.closeall()


atexit.register(shutdown)

if __name__ == "__main__":
    app.run()

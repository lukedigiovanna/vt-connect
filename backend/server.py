import atexit
from flask import Flask, send_from_directory, abort, request
from flask_cors import CORS
import psycopg2
from dotenv import load_dotenv
import os
import json
import bcrypt

load_dotenv()

print("Connecting to database...")

user, password = os.getenv("ELEPHANT_SQL_USERNAME"), os.getenv("ELEPHANT_SQL_PASSWORD")

print(f'Loaded user, password: ({user}, {password[0:3] + "*" * (len(password) - 3)})')

conn = psycopg2.connect(
    host="peanut.db.elephantsql.com",
    database="rhbtxrau",
    user=user,
    password=password
)

if conn == None:
    print("FATAL ERROR: could not connect to the database")
    exit()

cursor = conn.cursor()

if cursor == None:
    print("FATAL ERROR: could not connect a cursor to the database")
    exit()

print("Successfully connected to database!")

print("Setting up flask app...")
app = Flask(__name__, static_folder="static")

# Enable CORS to allow requests from any origin
CORS(app)

"""
Returns the public HTML of the page
"""
@app.route('/')
def root():
    return send_from_directory(app.static_folder, "index.html")

def snake_case_to_camel_case(string):
    tokens = string.split('_')
    tokens = [tokens[0]] + list(map(lambda s: s[0].upper() + s[1:], tokens[1:]))
    return ''.join(tokens)

"""
Returns a dictionary/JSON representation of the query results, which
is useful for returning and processing the results on the frontend.
"""
def get_formatted_query_results():
    results = cursor.fetchall()
    column_names = [desc[0] for desc in cursor.description]
    def format(result):
        return {snake_case_to_camel_case(column_names[i]): result[i] for i in range(len(column_names))}
    formatted_results = list(map(format, results))
    return formatted_results

def get_user(pid):
    cursor.execute(f"SELECT * FROM user_account WHERE pid='{pid}'")
    results = get_formatted_query_results()
    if len(results) == 0:
        return None
    else:
        return results[0]

"""
Checks if a user with the given PID already exists.
"""
def user_exists(pid):
    cursor.execute(f"SELECT * FROM user_account WHERE pid='{pid}'")
    result = cursor.fetchall()
    return len(result) > 0

def get_optional_attrib(body, name):
    field = body[name]
    if field is None or len(field) == 0:
        return None
    else:
        return body[name]

"""
Takes all user information necessary to sign the user up or uses
default values when necessary.

Will return an error status if any fields are not given
"""
@app.route('/api/signup', methods=["POST"])
def signup():
    body = json.loads(request.data.decode())

    necessary_fields = ['pid', 'password', 'firstName', 'lastName']

    if len(list(filter(lambda f: f not in body or len(body[f]) == 0, necessary_fields))) > 0:
        return 'Missing a required request parameter', 400

    pid, password, firstName, lastName = body['pid'], body['password'], body['firstName'], body['lastName']

    if user_exists(pid):
        return 'A user with that pid already exists', 400
    
    # check for optional fields: major, bio
    major, bio = get_optional_attrib(body, 'major'), get_optional_attrib(body, 'bio')

    hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    cursor.execute("""INSERT INTO user_account (pid, hash, email, first_name, last_name, major, bio, is_admin)
                      VALUES (%s, %s, %s, %s, %s, %s, %s, false)""",
                      (pid, hash, f"{pid}@vt.edu", firstName, lastName, major, bio))
    conn.commit()

    return 'Made user', 200

"""
Performs authentication to return a JWT that the client
can then use for protected tasks
"""
@app.route('/api/login', methods=["POST"])
def login():
    # expect a pid and a password
    body = json.loads(request.data.decode())

    necessary_fields = ['pid', 'password']

    if len(list(filter(lambda f: f not in body or len(body[f]) == 0, necessary_fields))) > 0:
        return 'Missing a required request parameter', 400

    pid, password = body['pid'], body['password']

    user = get_user(pid)

    if user is None:
        return 'No user exists with that PID', 400
    
    # otherwise compare the password against that users hash
    if not bcrypt.checkpw(password.encode('utf-8'), user['hash'].encode('utf-8')):
        return 'Wrong password', 400

    return user

"""
Gets a JSON array of all registered users
"""
@app.route('/api/users', methods=["GET"])
def users():
    # get up to 300 users
    cursor.execute('SELECT * FROM user_account LIMIT 300 OFFSET 0')
    return get_formatted_query_results()

"""
Gets a JSON array of the next events sorted by start time in ascending order (oldest first)
"""
@app.route('/api/events', methods=["GET"])
def events():
    cursor.execute('SELECT * FROM event ORDER BY start_time LIMIT 300 OFFSET 0')
    return get_formatted_query_results()

"""
Gets a particular event from the query params
Expected to call as /api/event?id=<id>
Example: /api/event?id=3uudiwo32093jfdalwo3io
"""
@app.route('/api/event', methods=["GET"])
def event():
    event_id = request.args.get('id')

    if event_id is None:
        return "Must specify an event id to query", 400

    cursor.execute('SELECT * FROM event WHERE id=%s', (event_id))
    results = get_formatted_query_results()
    if len(results) == 0:
        return "No event found", 400

    return results[0]

# Safely close connections/resources when the server is shutdown for any reason
def shutdown():
    print("Flask is shutting down...")
    cursor.close()
    conn.close()

atexit.register(shutdown)

if __name__ == "__main__":
    app.run()


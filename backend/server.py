import atexit
from flask import Flask, send_from_directory, abort, request
import psycopg2
from dotenv import load_dotenv
import os
import json

load_dotenv()

print("connecting to database")

user, password = os.getenv("ELEPHANT_SQL_USERNAME"), os.getenv("ELEPHANT_SQL_PASSWORD")

print(f'Loaded user, password: ({user}, {password})')

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

print("setting up flask app")
app = Flask(__name__, static_folder="static")

"""
Returns the public HTML of the page
"""
@app.route('/')
def root():
    return send_from_directory(app.static_folder, "index.html")

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
        return "NULL"
    else:
        return f"'{body[name]}'"

"""
Takes all user information necessary to sign the user up or uses
default values when necessary.

Will return an error status if any fields are not given
"""
@app.route('/api/signup', methods=["POST"])
def signup():
    body = json.loads(request.data.decode())['body']

    necessary_fields = ['pid', 'password', 'firstName', 'lastName']

    if len(list(filter(lambda f: f in body and len(body[f]) > 0, necessary_fields))) == 0:
        return 'Missing a required request parameter', 400

    pid, password, firstName, lastName = body['pid'], body['password'], body['firstName'], body['lastName']

    if user_exists(pid):
        return 'A user with that pid already exists', 400
    
    # check for optional fields: major, bio
    major, bio = get_optional_attrib(body, 'major'), get_optional_attrib(body, 'bio')

    cursor.execute("""INSERT INTO user_account (pid, email, first_name, last_name, major, bio, is_admin)
                      VALUES (%s, %s, %s, %s, %s, %s, false)""",
                      (pid, f"{pid}@vt.edu", firstName, lastName, major, bio))

    return 'Made user', 200

"""
Performs authentication to return a JWT that the client
can then use for protected tasks
"""
@app.route('/api/login', methods=["POST"])
def login():
    return 'NOT_IMPLEMENTED'

"""
Gets a JSON array of all registered users
"""
@app.route('/api/users', methods=["GET"])
def users():
    # get up to 300 users
    cursor.execute('SELECT * FROM user_account LIMIT 300 OFFSET 0')
    result = cursor.fetchall()
    return result

"""
Gets a JSON array of the next events sorted by start time in decreasing order
"""
@app.route('/api/events', methods=["GET"])
def events():
    cursor.execute('SELECT * FROM event ORDER BY start_time DESC LIMIT 300 OFFSET 0')
    result = cursor.fetchall()
    return result


# Safely close connections/resources when the server is shutdown for any reason
def shutdown():
    print("Flask is shutting down...")
    cursor.close()
    conn.close()

atexit.register(shutdown)

if __name__ == "__main__":
    app.run()


import atexit
from flask import Flask, send_from_directory, abort, request
import psycopg2
from dotenv import load_dotenv
import os

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
Takes all user information necessary to sign the user up or uses
default values when necessary.

Will return an error status if any fields are not given
"""
@app.route('/api/signup', methods=["POST"])
def signup():
    return 'NOT IMPLEMENTED'

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


# Safely close connections/resources when the server is shutdown for any reason
def shutdown():
    print("Flask is shutting down...")
    cursor.close()
    conn.close()

atexit.register(shutdown)

if __name__ == "__main__":
    app.run()


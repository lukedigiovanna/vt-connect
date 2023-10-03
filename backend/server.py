import atexit
from flask import Flask
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

cursor = conn.cursor()

print("setting up flask app")
app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello, World!'

# Safely close connections/resources when the server is shutdown for any reason
def shutdown():
    print("Flask is shutting down...")
    cursor.close()
    conn.close()

atexit.register(shutdown)


app.run()


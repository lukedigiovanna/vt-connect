# Backend

## Installing / Setup

The following is written for an M1 mac, idk how it might change for other environments

### Setting up Python environment

It is recommended to run this server within a python virtual environment to avoid conflicts with an existing Python installation. Do the following steps to set this up:

1. CD into this directory, `backend`
2. Create a virtual python environment using `$ python3 -m venv env`
3. Activate the environment using `$ source env/bin/activate`
4. Install dependencies using `$ pip3 install -r requirements.txt`
5. Add `.env` file for database credentials
6. Run as `$ python3 server.py`

(At least on my machine navigating to `localhost:5000` does not work for whatever reason, instead use the given URL when running, probably `http://127.0.0.1:5000`)

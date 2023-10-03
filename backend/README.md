# Backend

## Installing / Setup

It is recommended to run this server within a python virtual environment to avoid conflicts with an existing Python installation. Do the following steps to set this up:

1. CD into this directory, `backend`
2. Create a virtual python environment using `$ python3 -m venv env`
3. Activate the environment using `$ source project_env/bin/activate`
4. Install dependencies using `$ pip3 install -r requirements.txt`
5. Set up environment variables for Flask
   1. `$ export FLASK_APP=server`
   2. `$ export FLASK_ENV=development`
6. Run the server using `$ flask run`


(At least on my machine navigating to `localhost:5000` does not work for whatever reason, instead use the given URL when running, probably `http://127.0.0.1:5000`)
-- This file contains the SQL code to initialize the VT Connect database

-- Note this is called user_account and not "user" because user is a reserved word in Postgres
CREATE TABLE user_account (
    pid VARCHAR(25) NOT NULL,
    email VARCHAR(80),
    first_name VARCHAR(25),
    last_name VARCHAR(25),
    major VARCHAR(250),
    bio VARCHAR(1024),
    is_admin BOOLEAN,

    PRIMARY KEY (pid)
);

-- Used for user authentication, merely stores the hash and salt for a user
-- Note: this data could be stored in the user_account table but it is instead
--       put separate for isolation because this data is only relevant to authentication
CREATE TABLE user_authentication (
    pid VARCHAR(25) REFERENCES user_account(pid),
    salt VARCHAR(25) NOT NULL,
    hash VARCHAR(100) NOT NULL
);

CREATE TABLE event (
    id INT NOT NULL AUTO INCREMENT,
    start_time TIMESTAMP NOT NULL, -- always require a start time
    end_time TIMESTAMP, -- end time is optional
    title VARCHAR(250),
    description VARCHAR(1000),
    image_url VARCHAR(1000),
    host_pid VARCHAR(250),
    location_id INT REFERENCES location(id),

    PRIMARY KEY (id)
);

CREATE TABLE event_attendee (
    user_pid VARCHAR(25) REFERENCES user_account(pid),
    event_id INT REFERENCES event(id)
);

CREATE TYPE rating_type AS ENUM ('dislike', 'neutral', 'like');

CREATE TABLE rating (
    user_pid VARCHAR(25) REFERENCES user_account(pid),
    event_id INT REFERENCES event(id),
    rating rating_type,
    time TIMESTAMP
);

CREATE TABLE location (
    id INT NOT NULL,
    address VARCHAR(255),
    name VARCHAR(255) NOT NULL,

    PRIMARY KEY (id)
);
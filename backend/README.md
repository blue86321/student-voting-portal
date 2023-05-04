# Backend of Student Voting Portal


## Run

### Run venv and install dependencies
```shell
# activate venv
python -m venv venv
source venv/bin/activate
# install dependencies
python -m pip install -r requirements.txt
```

### Sync database
- Database settings
  - Run a mysql database locally
  - Create a mysql user
    - username: `student_voting_portal`
    - password: `student_voting_portal`
  - Create a schema: `student_voting_portal`
- Ps. If you do not want to run a mysql
  - Go to `settings/dev.py`
  - In `DATABASES`, comment `mysql` part and uncomment `sqlite3` part

```shell
# Sync database
python manage.py makemigrations
python manage.py migrate
```

### Run the server
```shell
# Run the server
python manage.py runserver
```

### Exit venv
```shell
deactivate
```


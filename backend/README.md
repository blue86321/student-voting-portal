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

### Sync database and Run the server
```shell
# Sync database
python manage.py makemigration
python manage.py migrate

# Run the server
python manage.py runserver
```

### Exit venv
```shell
deactivate
```


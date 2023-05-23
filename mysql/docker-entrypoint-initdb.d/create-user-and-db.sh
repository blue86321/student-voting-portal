#!/bin/bash

# Create the initial database and user
mysql -u"root" -p"$MYSQL_ROOT_PASSWORD" -e "CREATE USER IF NOT EXISTS '$MYSQL_USER'@'%' IDENTIFIED BY '$MYSQL_PASSWORD';"
# Python Django RESTful Framework 
mysql -u"root" -p"$MYSQL_ROOT_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE_PREFIX}_py;"
mysql -u"root" -p"$MYSQL_ROOT_PASSWORD" -e "GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE_PREFIX}_py.* TO $MYSQL_USER@'%';"
# Python Django RESTful Framework test database
mysql -u"root" -p"$MYSQL_ROOT_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS test_${MYSQL_DATABASE_PREFIX}_py;"
mysql -u"root" -p"$MYSQL_ROOT_PASSWORD" -e "GRANT ALL PRIVILEGES ON test_${MYSQL_DATABASE_PREFIX}_py.* TO $MYSQL_USER@'%';"
# Java SpringBoot
mysql -u"root" -p"$MYSQL_ROOT_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE_PREFIX}_java;"
mysql -u"root" -p"$MYSQL_ROOT_PASSWORD" -e "GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE_PREFIX}_java.* TO $MYSQL_USER@'%';"

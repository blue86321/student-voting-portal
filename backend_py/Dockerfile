FROM python:3.9-slim-bullseye

WORKDIR /app

COPY requirements.txt ./

RUN apt-get update && apt-get install -y gcc default-libmysqlclient-dev

RUN pip install --no-cache-dir --upgrade pip \
  && pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

RUN chmod 777 ./docker-entrypoint.sh
ENTRYPOINT [ "./docker-entrypoint.sh" ]
# Base image for both dev and production
FROM python:3.11-slim AS base
WORKDIR /app
RUN pip install --no-cache-dir pipenv

# Install dependencies in a separate stage
# FROM base AS dependencies
# COPY Pipfile Pipfile.lock /app/
# RUN pipenv install --deploy --ignore-pipfile

# Development stage
FROM base AS dev
COPY ./app/. /app/
RUN apt update
RUN apt install -y build-essential cargo
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# Production stage
FROM base AS prod
COPY ./app/. /app/
RUN apt update
RUN apt install -y build-essential cargo
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
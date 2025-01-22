# To start

Install requirements

    pip install -r requirements.txt

Create database structure

    python app.py createtables

Create base user

    python app.py createuser

Start the app

    uvicorn app:app --reload --host 0.0.0.0 --port 8000

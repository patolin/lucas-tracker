from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

from datetime import datetime

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import desc, func

from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
import argparse
import subprocess
from models import Usuarios, TipoTarea, Actividad, Tareas, init_db, get_db, SessionLocal
from pydantic import BaseModel, Field, validator
from typing import Optional

from config import JWT_SECRET

# JWT Configurations
SECRET_KEY = JWT_SECRET
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


# FastAPI App Instance
app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# pydantic models


class TareaRequest(BaseModel):
    fecha: str = Field(min_length=1)
    id_actividad: int = Field(gt=0)
    cantidad: Optional[float] = None
    observaciones: Optional[str] = None

# Utility Functions


def get_user(db: Session, username: str):
    return db.query(Usuarios).filter(Usuarios.username == username).first()


def create_user(db: Session, username: str, password: str, full_name: str, email: str, role: str = "user"):
    hashed_password = pwd_context.hash(password)
    db_user = Usuarios(usuario=username, contrasena=hashed_password,
                       nombre=full_name, email=email, rol=role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Login Endpoint


@app.post("/api/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = get_user(db, form_data.username)
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=401, detail="Usuario o contrasena incorrectos")
    if not user.active:
        raise HTTPException(status_code=400, detail="Usuario inactivo")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/api/tipos-tareas")
def get_tipos_tareas(db: Session = Depends(get_db)):
    tipos = db.query(TipoTarea).all()
    return tipos


@app.get("/api/actividades")
def get_actividades(db: Session = Depends(get_db)):
    tipos = db.query(Actividad).order_by(Actividad.nombre).all()
    return tipos


# @app.get("/api/tareas")
# def get_tareas(db: Session = Depends(get_db)):
#     tareas = db.query(Tareas).order_by(desc(Tareas.fecha)).all()
#     return tareas
@app.get("/api/tareas")
def get_tareas(
    db: Session = Depends(get_db),
    fecha: Optional[str] = None,
    id_tipo: Optional[int] = None
):

    # Build the base query with a join to Actividad
    query = db.query(Tareas).join(
        Actividad, Tareas.id_actividad == Actividad.id)

    # Filter by fecha if provided
    if fecha:
        try:
            # Parse the input date string to a date object
            fecha_date = datetime.strptime(fecha, "%Y-%m-%d").date()
            # Compare the date part of Tareas.fecha
            query = query.filter(func.date(Tareas.fecha) == fecha_date)
        except ValueError:
            # Handle invalid date format (FastAPI will return a 422 error)
            pass

    # Filter by id_tipo if provided
    if id_tipo is not None:
        query = query.filter(Actividad.id_tipo == id_tipo)

    # Order by fecha descending and execute the query
    tareas = query.order_by(desc(Tareas.fecha)).all()
    return tareas


@app.post("/api/tareas")
def post_tareas(payload: TareaRequest, db: Session = Depends(get_db)):
    tarea = Tareas(fecha=payload.fecha, id_actividad=payload.id_actividad,
                   cantidad=payload.cantidad or None, observaciones=payload.observaciones or None)
    db.add(tarea)
    db.commit()
    db.refresh(tarea)
    return {"mensaje": "Tarea agregada con éxito", "id": tarea.id}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--createuser", action="store_true",
                        help="Create a new user")
    parser.add_argument("--createtables", action="store_true",
                        help="Create database tables")
    args = parser.parse_args()

    if args.createuser:
        db = SessionLocal()
        username = input("Usuario: ")
        email = input("email: ")
        full_name = input("Nombre completo: ")
        password = input("Contrasena: ")
        create_user(db, username, password, full_name, email)
        print(f"Usuario: {username} creado con éxito!")

    if args.createtables:
        # Base.metadata.create_all(bind=engine)
        init_db()
        print("Tablas creadas correctamente!")

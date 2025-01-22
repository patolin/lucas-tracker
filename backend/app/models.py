from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import relationship
from sqlalchemy.orm import sessionmaker, Session

from datetime import datetime, timedelta
from config import DATABASE

# SQLAlchemy Setup
DATABASE_URL = f"mysql+pymysql://{DATABASE['USER']}:{DATABASE['PASS']}@{DATABASE['HOST']}/{DATABASE['BASE']}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class Usuarios(Base):
    __tablename__ = "lucas_usuarios"
    id = Column(Integer, primary_key=True, index=True)
    usuario = Column(String(50), unique=True, index=True)
    contrasena = Column(String(255))
    nombre = Column(String(100))
    rol = Column(String(50))
    email = Column(String(100), unique=True, index=True)
    activo = Column(Boolean, default=True)
    creado_en = Column(DateTime, default=datetime.utcnow)


class TipoTarea(Base):
    __tablename__ = "lucas_tipo_tarea"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    creado_en = Column(DateTime, default=datetime.utcnow)


class Actividad(Base):
    __tablename__ = "lucas_actividades"
    id = Column(Integer, primary_key=True, index=True)
    id_tipo = mapped_column(ForeignKey("lucas_tipo_tarea.id"))
    activo = Column(Boolean, default=True)
    nombre = Column(String(100))
    repetir_cada = Column(Integer, default=8)
    creado_en = Column(DateTime, default=datetime.utcnow)


class Tareas(Base):
    __tablename__ = "lucas_tareas"
    id = Column(Integer, primary_key=True, index=True)
    fecha = Column(DateTime, default=datetime.utcnow)
    id_actividad = mapped_column(ForeignKey("lucas_actividades.id"))
    cantidad = Column(Float, default=0.0)
    observaciones = Column(String(100))


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Carrega as variáveis do arquivo .env (se existir)
load_dotenv()

# 2. Pega a URL do ambiente. Se não tiver, usa o SQLite como padrão (fallback)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./catalog.db")

# 3. Cria o Engine
# O argumento check_same_thread só deve ser usado se o banco for SQLite.
# Se for PostgreSQL (no futuro), isso quebraria o código, então filtramos aqui.
connect_args = {}
if "sqlite" in SQLALCHEMY_DATABASE_URL:
    connect_args = {"check_same_thread": False}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args=connect_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
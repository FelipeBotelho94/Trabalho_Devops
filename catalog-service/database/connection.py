from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# URL de conexão (SQLite por enquanto)
SQLALCHEMY_DATABASE_URL = "sqlite:///./catalog.db"

# Cria o motor
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Cria a fábrica de sessões
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para os Models herdarem
Base = declarative_base()

# Dependência (Dependency) para entregar a sessão para a API
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
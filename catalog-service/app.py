from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session

# Buscando da pasta database
from database.connection import get_db
from database.models import ProductModel

# CONTRATO DA API (Schemas - Pydantic)
class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None

class ProductResponse(ProductCreate):
    id: int
    class Config:
        from_attributes = True

# ROTAS DA API
app = FastAPI(title="Catalog Service")

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/products/", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = ProductModel(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.get("/products/", response_model=list[ProductResponse]) 
def read_products(db: Session = Depends(get_db)):
    return db.query(ProductModel).all()

# Rota Health Check
@app.get("/")
def read_root():
    return {"message": "Catalog Service UP"}

# Forçando o deploy para testar o Linux
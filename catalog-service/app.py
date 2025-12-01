from fastapi import FastAPI, Depends, Request
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
import logging
import time
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST

# Buscando da pasta database
from database.connection import get_db
from database.models import ProductModel

# Configuração de logging estruturado
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Métricas Prometheus
http_requests_total = Counter(
    'http_requests_total',
    'Total de requisições HTTP',
    ['method', 'endpoint', 'status']
)

http_request_duration_seconds = Histogram(
    'http_request_duration_seconds',
    'Duração das requisições HTTP em segundos',
    ['method', 'endpoint']
)

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

# Middleware para métricas e logging
@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    start_time = time.time()
    method = request.method
    path = request.url.path
    
    # Processa a requisição
    response = await call_next(request)
    
    # Calcula duração
    duration = time.time() - start_time
    status_code = response.status_code
    
    # Registra métricas
    http_requests_total.labels(method=method, endpoint=path, status=status_code).inc()
    http_request_duration_seconds.labels(method=method, endpoint=path).observe(duration)
    
    # Log estruturado
    logger.info(
        f"Request: {method} {path} - Status: {status_code} - Duration: {duration:.3f}s"
    )
    
    return response

@app.post("/products/", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    logger.info(f"Criando produto: {product.name}")
    db_product = ProductModel(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    logger.info(f"Produto criado com sucesso: ID {db_product.id}")
    return db_product

@app.get("/products/", response_model=list[ProductResponse]) 
def read_products(db: Session = Depends(get_db)):
    logger.info("Listando todos os produtos")
    products = db.query(ProductModel).all()
    logger.info(f"Retornados {len(products)} produtos")
    return products

# Rota Health Check
@app.get("/")
def read_root():
    logger.info("Health check executado")
    return {"message": "Catalog Service UP"}

# Endpoint de métricas para Prometheus
@app.get("/metrics")
async def metrics():
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)
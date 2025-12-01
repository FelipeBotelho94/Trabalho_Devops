from fastapi.testclient import TestClient
from app import app 
from database.connection import Base, engine
from database.models import ProductModel  # noqa: F401

# Antes de testar, cria as tabelas no banco (SQLite) desse ambiente
Base.metadata.create_all(bind=engine)

client = TestClient(app)

# Teste 1: Verificar se a API está de pé (Health Check)
def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    # Verifica se a mensagem de retorno é a que definimos no app.py
    assert response.json() == {"message": "Catalog Service UP"}

# Teste 2: Criar um Produto (Cenário de Sucesso)
def test_create_product():
    payload = {
        "name": "Mouse Gamer",
        "description": "DPI 20000",
        "price": 150.0,
        "image_url": "http://teste.com/mouse.jpg"
    }
    
    response = client.post("/products/", json=payload)
    
    # Validações
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == payload["name"]
    assert "id" in data # Garante que o banco gerou um ID

# Teste 3: Listar Produtos
def test_list_products():
    response = client.get("/products/")
    
    assert response.status_code == 200
    data = response.json()
    
    # Garante que voltou uma lista
    assert isinstance(data, list)
    
    # Como rodamos o create antes, a lista deve ter pelo menos 1 item
    assert len(data) >= 1 
    # Verifica se o primeiro item tem o campo 'name'
    assert "name" in data[0]
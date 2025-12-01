from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schema import Order
from app.order_queue import publish_order, get_queue_items

app = FastAPI()

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health():
    return {"status": "order-service OK"}

@app.post("/orders")
def create_order(order: Order):
    order_dict = order.dict()
    publish_order(order_dict)
    return {"message": "Order recebido e enviado para fila.", "order": order_dict}

@app.get("/orders/queue")
def get_queue():
    """Retorna todos os pedidos na fila sem removê-los"""
    queue_items = get_queue_items()
    return {"queue": queue_items, "count": len(queue_items)}

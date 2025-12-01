from fastapi import FastAPI
from app.schema import Order
from app.order_queue import publish_order

app = FastAPI()

@app.get("/")
def health():
    return {"status": "order-service OK"}

@app.post("/orders")
def create_order(order: Order):
    order_dict = order.dict()
    publish_order(order_dict)
    return {"message": "Order recebido e enviado para fila.", "order": order_dict}

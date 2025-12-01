from pydantic import BaseModel
class Order(BaseModel):
    product_id: int
    quantity: int
    user_id: int

from sqlalchemy import Column, Integer, String, Float, Text
from .connection import Base

class ProductModel(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    price = Column(Float)
    image_url = Column(String, nullable=True)
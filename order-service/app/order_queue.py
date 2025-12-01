import redis
import json

redis_client = redis.Redis(host="redis", port=6379, db=0)

QUEUE_NAME = "order_queue"

def publish_order(order: dict):
    redis_client.lpush(QUEUE_NAME, json.dumps(order))

def get_queue_items():
    """Retorna todos os itens da fila sem removê-los"""
    items = redis_client.lrange(QUEUE_NAME, 0, -1)
    return [json.loads(item) for item in items]

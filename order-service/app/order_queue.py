import redis
import json

redis_client = redis.Redis(host="redis", port=6379, db=0)

QUEUE_NAME = "order_queue"

def publish_order(order: dict):
    redis_client.lpush(QUEUE_NAME, json.dumps(order))

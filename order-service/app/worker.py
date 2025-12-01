import redis, json, time

redis_client = redis.Redis(host="redis", port=6379, db=0)
QUEUE_NAME = "order_queue"

print("Worker aguardando pedidos...")

while True:
    item = redis_client.brpop(QUEUE_NAME)
    if item:
        _, value = item
        order = json.loads(value)
        print(f"[WORKER] Processando pedido: {order}")
        time.sleep(2)

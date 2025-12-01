import redis, json, time

redis_client = redis.Redis(host="redis", port=6379, db=0)
QUEUE_NAME = "order_queue"

print("Worker aguardando pedidos...")

while True:
    # Usa timeout de 5 segundos para não bloquear indefinidamente
    item = redis_client.brpop(QUEUE_NAME, timeout=5)
    if item:
        _, value = item
        order = json.loads(value)
        print(f"[WORKER] Processando pedido: {order}")
        # Aumenta o tempo de processamento para permitir visualização na fila
        time.sleep(30)  # Processa por 10 segundos para permitir visualização
    else:
        # Se não houver pedidos, aguarda um pouco antes de tentar novamente
        time.sleep(1)

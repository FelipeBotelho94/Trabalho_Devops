# 1. Estágio "Builder" (Cozinha): Instala dependências e compila o que precisa
# 2. Estágio "Final" (Prato Pronto): Pega só o necessário do Builder e joga fora o resto

# Resultado: Imagem menor (economiza espaço) e sem ferramentas de build (mais segura)

# Estágio 1: BUILDER (Preparação)
# Usamos a imagem Python para baixar e preparar as bibliotecas
FROM python:3.11.9-slim AS builder

WORKDIR /app

COPY requirements.txt .

# Instalamos as dependências numa pasta separada (/install) para facilitar a cópia depois
# O --prefix garante que tudo fique num lugar só
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# Estágio 2: RUNTIME (Imagem Final)
# Aqui começa o "Reset". Iniciamos uma imagem ZERO, limpa.
# Por isso repetimos o FROM: para garantir que não sobrou lixo do estágio anterior.
FROM python:3.11.9-slim

# Repetimos o WORKDIR porque, como é uma imagem nova, a pasta /app ainda não existe aqui.
WORKDIR /app

# SEGURANÇA (Best Practice):
# Criamos um usuário comum (appuser) para não rodar como Root (Administrador).
# Se um hacker invadir o container, ele não terá poderes totais no sistema.
RUN useradd -m appuser && chown -R appuser /app

# Copiamos APENAS as bibliotecas instaladas no estágio 'builder'.
# O resto (cache do pip, compiladores) fica para trás e não ocupa espaço aqui.
COPY --from=builder /install /usr/local

# Copiamos o código fonte da aplicação para dentro do container
COPY . .

# Trocamos para o usuário seguro antes de iniciar
USER appuser

EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
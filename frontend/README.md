# Frontend - Interface React para DevOps

Interface web moderna desenvolvida em React para interagir com os serviços Catalog Service e Order Service.

## 🚀 Funcionalidades

- **Visualização de Produtos**: Lista todos os produtos cadastrados no Catalog Service
- **Cadastro de Produtos**: Formulário para criar novos produtos
- **Criação de Pedidos**: Interface para criar pedidos no Order Service
- **Design Responsivo**: Interface moderna e responsiva usando Tailwind CSS

## 📋 Pré-requisitos

- Node.js 18+ e npm/yarn
- Catalog Service rodando em `http://localhost:8000`
- Order Service rodando em `http://localhost:8002`

## 🛠️ Instalação

1. Navegue até a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

## 🏃 Executando

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📦 Build para Produção

Para criar um build de produção:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

## 🏗️ Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/
│   │   ├── ProductList.jsx    # Lista de produtos
│   │   ├── ProductForm.jsx     # Formulário de cadastro
│   │   └── OrderForm.jsx       # Formulário de pedidos
│   ├── services/
│   │   └── api.js              # Serviços de API
│   ├── App.jsx                 # Componente principal
│   ├── main.jsx                # Entry point
│   └── index.css               # Estilos globais
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🔌 APIs Utilizadas

### Catalog Service (http://localhost:8000)
- `GET /products/` - Lista todos os produtos
- `POST /products/` - Cria um novo produto
- `GET /` - Health check

### Order Service (http://localhost:8002)
- `POST /orders` - Cria um novo pedido
- `GET /` - Health check

## 🎨 Tecnologias

- **React 18** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **Axios** - Cliente HTTP para requisições


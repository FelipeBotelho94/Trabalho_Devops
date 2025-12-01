import { useState } from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import OrderForm from './components/OrderForm';
import OrderQueue from './components/OrderQueue';

function App() {
  const [activeTab, setActiveTab] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleProductCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleOrderCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setActiveTab('orders');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            DevOps - Gerenciamento de Produtos e Pedidos
          </h1>
          <p className="mt-2 text-gray-600">
            Interface para gerenciar produtos (Catalog Service) e criar pedidos (Order Service)
          </p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('products');
                setSelectedProduct(null);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Produtos
            </button>
            <button
              onClick={() => {
                setActiveTab('create-product');
                setSelectedProduct(null);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create-product'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cadastrar Produto
            </button>
            <button
              onClick={() => {
                setActiveTab('orders');
                setSelectedProduct(null);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Criar Pedido
            </button>
            <button
              onClick={() => {
                setActiveTab('queue');
                setSelectedProduct(null);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'queue'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Fila de Pedidos
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'products' && (
          <ProductList
            key={refreshKey}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activeTab === 'create-product' && (
          <div className="max-w-2xl mx-auto">
            <ProductForm onProductCreated={handleProductCreated} />
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="max-w-2xl mx-auto">
            {selectedProduct && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800">
                  <strong>Produto selecionado:</strong> {selectedProduct.name} - R${' '}
                  {selectedProduct.price.toFixed(2)}
                </p>
              </div>
            )}
            <OrderForm
              selectedProduct={selectedProduct}
              onOrderCreated={handleOrderCreated}
            />
          </div>
        )}

        {activeTab === 'queue' && (
          <OrderQueue />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            Catalog Service: http://localhost:8000 | Order Service: http://localhost:8002
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;


import { useState, useEffect } from 'react';
import { orderService, catalogService } from '../services/api';

export default function OrderQueue() {
  const [queue, setQueue] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadProducts();
    loadQueue();
    
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadQueue();
      }, 1000); // Atualiza a cada 1 segundo para capturar pedidos antes do worker processar
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadProducts = async () => {
    try {
      const data = await catalogService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    }
  };

  const loadQueue = async () => {
    try {
      setError(null);
      const data = await orderService.getQueue();
      setQueue(data.queue || []);
    } catch (err) {
      setError('Erro ao carregar fila de pedidos. Verifique se o order-service está rodando.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : `Produto ID: ${productId}`;
  };

  const getProductPrice = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.price : 0;
  };

  const calculateTotal = (order) => {
    const price = getProductPrice(order.product_id);
    return price * order.quantity;
  };

  if (loading && queue.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Fila de Pedidos</h2>
          <p className="text-gray-600 mt-1">
            {queue.length === 0 
              ? 'Nenhum pedido na fila' 
              : `${queue.length} pedido${queue.length > 1 ? 's' : ''} aguardando processamento`}
          </p>
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Atualização automática</span>
          </label>
          <button
            onClick={loadQueue}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Atualizar
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
          <button
            onClick={loadQueue}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {queue.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="mt-4 text-gray-600">A fila está vazia</p>
          <p className="text-sm text-gray-500 mt-1">
            Os pedidos criados aparecerão aqui antes de serem processados
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {queue.map((order, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      #{index + 1} na fila
                    </span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      Aguardando processamento
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Produto</p>
                      <p className="font-semibold text-gray-800">
                        {getProductName(order.product_id)}
                      </p>
                      <p className="text-sm text-gray-500">
                        ID: {order.product_id}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Quantidade</p>
                      <p className="font-semibold text-gray-800 text-xl">
                        {order.quantity}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Usuário</p>
                      <p className="font-semibold text-gray-800">
                        ID: {order.user_id}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Preço unitário:</span>
                      <span className="font-semibold text-gray-800">
                        R$ {getProductPrice(order.product_id).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-lg font-semibold text-gray-800">Total:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        R$ {calculateTotal(order).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


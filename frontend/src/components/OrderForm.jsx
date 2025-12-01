import { useState, useEffect } from 'react';
import { orderService, catalogService } from '../services/api';

export default function OrderForm({ selectedProduct, onOrderCreated }) {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product_id: selectedProduct?.id || '',
    quantity: 1,
    user_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setFormData((prev) => ({
        ...prev,
        product_id: selectedProduct.id,
      }));
    }
    loadProducts();
  }, [selectedProduct]);

  const loadProducts = async () => {
    try {
      const data = await catalogService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'product_id' ? parseInt(value) || '' : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const orderData = {
        product_id: parseInt(formData.product_id),
        quantity: parseInt(formData.quantity),
        user_id: parseInt(formData.user_id),
      };

      await orderService.createOrder(orderData);
      setSuccess(true);
      setFormData({
        product_id: '',
        quantity: 1,
        user_id: '',
      });

      if (onOrderCreated) {
        onOrderCreated();
      }
    } catch (err) {
      setError('Erro ao criar pedido. Verifique se o order-service está rodando.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedProductData = products.find((p) => p.id === parseInt(formData.product_id));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Criar Novo Pedido</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-800">Pedido criado com sucesso e enviado para a fila!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="product_id" className="block text-sm font-medium text-gray-700 mb-1">
            Produto *
          </label>
          <select
            id="product_id"
            name="product_id"
            value={formData.product_id}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecione um produto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - R$ {product.price.toFixed(2)}
              </option>
            ))}
          </select>
          {selectedProductData && (
            <p className="mt-2 text-sm text-gray-600">
              Preço unitário: R$ {selectedProductData.price.toFixed(2)}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Quantidade *
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {selectedProductData && (
            <p className="mt-2 text-sm text-gray-600">
              Total: R$ {(selectedProductData.price * formData.quantity).toFixed(2)}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-1">
            ID do Usuário *
          </label>
          <input
            type="number"
            id="user_id"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 1"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
        >
          {loading ? 'Criando pedido...' : 'Criar Pedido'}
        </button>
      </form>
    </div>
  );
}


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([
    // Mock cart data - in a real app this would come from context or state management
    {
      id: 1,
      title: 'Wireless Bluetooth Headphones',
      price: 49.99,
      originalPrice: 89.99,
      quantity: 2,
      image: 'https://via.placeholder.com/100x100/3B82F6/FFFFFF?text=Headphones'
    },
    {
      id: 3,
      title: 'Designer T-Shirt',
      price: 24.99,
      originalPrice: 49.99,
      quantity: 1,
      image: 'https://via.placeholder.com/100x100/EC4899/FFFFFF?text=T-Shirt'
    }
  ]);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalSavings = () => {
    return cart.reduce((total, item) => total + ((item.originalPrice - item.price) * item.quantity), 0);
  };

  const getTotal = () => {
    return getSubtotal();
  };

  const handleCheckout = () => {
    // In a real app, this would redirect to a checkout page or payment processor
    alert('Proceeding to checkout...');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any deals to your cart yet.</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Categories
              </button>
              <button
                onClick={() => navigate('/feed')}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                View All Deals
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Cart Items ({cart.length})</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-bold text-gray-900">${item.price}</span>
                        <span className="text-gray-500 line-through">${item.originalPrice}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 text-sm hover:text-red-800 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Total Savings</span>
                  <span className="font-semibold">-${getTotalSavings().toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium mt-6"
              >
                Proceed to Checkout
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Free shipping on orders over $50
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart; 
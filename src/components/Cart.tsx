import React from 'react';
import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, getTotalAmount, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-dark flex items-center space-x-2">
              <ShoppingCart size={24} />
              <span>Keranjang Belanja</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          {cartItems.length > 0 && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">{cartItems.length} item(s)</span>
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
              >
                <Trash2 size={14} />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Keranjang Anda Kosong</h3>
              <p className="text-gray-500 mb-6">Tambahkan item dari menu untuk mulai berbelanja</p>
              <button
                onClick={onClose}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.menu_item.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start space-x-3">
                    <img
                      src={item.menu_item.image_url}
                      alt={item.menu_item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-dark">{item.menu_item.name}</h3>
                        <button
                          onClick={() => removeFromCart(item.menu_item.id)}
                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Rp {item.menu_item.price.toLocaleString('id-ID')} per item
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 bg-white rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.menu_item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.menu_item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-primary">
                            Rp {(item.menu_item.price * item.quantity).toLocaleString('id-ID')}
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

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-6 bg-white sticky bottom-0">
            <div className="space-y-4">
              {/* Total */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">Rp {getTotalAmount().toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">Rp {getTotalAmount().toLocaleString('id-ID')}</span>
                </div>
              </div>
              
              {/* Info Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-700 text-center">
                  Untuk melakukan pemesanan, silakan hubungi kami langsung di kedai atau melalui WhatsApp.
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={onClose}
                  className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Lanjut Belanja</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
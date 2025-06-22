import React from 'react';
import { ArrowLeft, Star, Clock, Users, Plus } from 'lucide-react';
import { MenuItem } from '../types';
import { useCart } from '../hooks/useCart';

interface MenuDetailProps {
  item: MenuItem;
  onBack: () => void;
}

const MenuDetail: React.FC<MenuDetailProps> = ({ item, onBack }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  const [isAdded, setIsAdded] = React.useState(false);

  const handleAddToCart = () => {
    addToCart(item, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-secondary pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Menu</span>
        </button>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative h-96 lg:h-full">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              {item.featured && (
                <div className="absolute top-6 right-6 bg-primary text-white px-4 py-2 rounded-full flex items-center space-x-2">
                  <Star size={16} fill="currentColor" />
                  <span className="font-medium">Featured Item</span>
                </div>
              )}
              <div className="absolute top-6 left-6 bg-black/20 backdrop-blur-sm text-white px-3 py-2 rounded-full">
                <span className="font-medium capitalize">{item.category}</span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 lg:p-12">
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-dark mb-4">{item.name}</h1>
                  <p className="text-gray-600 text-lg leading-relaxed">{item.description}</p>
                </div>

                <div className="bg-primary/5 rounded-2xl p-6">
                  <div className="text-3xl font-bold text-primary mb-2">
                    Rp {item.price.toLocaleString('id-ID')}
                  </div>
                  <p className="text-gray-600">Price per serving</p>
                </div>

                {/* Quantity Selector */}
                {/* <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-dark mb-4">Quantity</h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    Subtotal: <span className="font-semibold text-primary">
                      Rp {(item.price * quantity).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div> */}

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Clock className="text-primary mx-auto mb-2" size={24} />
                    <p className="text-sm font-medium text-gray-900">Prep Time</p>
                    <p className="text-xs text-gray-600">5-10 minutes</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Users className="text-primary mx-auto mb-2" size={24} />
                    <p className="text-sm font-medium text-gray-900">Serving</p>
                    <p className="text-xs text-gray-600">1 person</p>
                  </div>
                </div>

                {/* Action Buttons */}
                {/* <div className="space-y-3">
                  <button 
                    onClick={handleAddToCart}
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center space-x-2 ${
                      isAdded 
                        ? 'bg-green-500 text-white' 
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    <Plus size={20} />
                    <span>{isAdded ? 'Added to Cart!' : 'Add to Cart'}</span>
                  </button>
                  <button className="w-full border-2 border-primary text-primary py-4 rounded-xl font-semibold text-lg hover:bg-primary hover:text-white transition-colors">
                    Add to Favorites
                  </button>
                </div> */}

                {/* Additional Details */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-dark mb-3">About this item</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Made with premium quality ingredients</p>
                    <p>• Freshly prepared when you order</p>
                    <p>• Available for dine-in and takeaway</p>
                    {item.category === 'coffee' && <p>• Can be customized (hot/cold, sugar level)</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDetail;
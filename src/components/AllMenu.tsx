import React, { useState } from 'react';
import { useAllMenu } from '../hooks/useAllMenu';
import { Star, ArrowLeft, Filter, Plus } from 'lucide-react';
import { MenuItem } from '../types';
import { useCart } from '../hooks/useCart';

interface AllMenuProps {
  onBack: () => void;
  onViewDetail: (item: MenuItem) => void;
}

const AllMenu: React.FC<AllMenuProps> = ({ onBack, onViewDetail }) => {
  const { menuItems, loading } = useAllMenu();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'coffee', label: 'Coffee' },
    { id: 'food', label: 'Food' },
    { id: 'dessert', label: 'Dessert' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const handleAddToCart = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(item);
    // Show a brief success message
    const button = e.target as HTMLElement;
    const originalText = button.textContent;
    button.textContent = 'Added!';
    setTimeout(() => {
      button.textContent = originalText;
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading menu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
          <h1 className="text-3xl font-bold text-dark">Complete Menu</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Filter size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-dark">Filter by Category</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
            >
              <div className="relative overflow-hidden" onClick={() => onViewDetail(item)}>
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {item.featured && (
                  <div className="absolute top-3 right-3 bg-primary text-white px-2 py-1 rounded-full flex items-center space-x-1">
                    <Star size={12} fill="currentColor" />
                    <span className="text-xs font-medium">Featured</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-black/20 backdrop-blur-sm text-white px-2 py-1 rounded-full">
                  <span className="text-xs font-medium capitalize">{item.category}</span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-dark mb-2 group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-primary">
                    Rp {item.price.toLocaleString('id-ID')}
                  </span>
                  <div className="flex space-x-2">
                    {/* <button
                      onClick={(e) => handleAddToCart(item, e)}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center space-x-1"
                    >
                      <Plus size={14} />
                      <span>Add</span>
                    </button> */}
                    <button 
                      onClick={() => onViewDetail(item)}
                      className="bg-primary text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No items found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllMenu;
import React from 'react';
import { useMenu } from '../hooks/useMenu';
import { Star, Plus } from 'lucide-react';
import { useCart } from '../hooks/useCart';

interface MenuHighlightProps {
  onViewAllMenu?: () => void;
  onViewMenuDetail?: (item: any) => void;
}

const MenuHighlight: React.FC<MenuHighlightProps> = ({ onViewAllMenu, onViewMenuDetail }) => {
  const { menuItems, loading } = useMenu();
  const { addToCart } = useCart();

  const handleAddToCart = (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(item);
    
    // Visual feedback
    const button = e.currentTarget as HTMLElement;
    const originalText = button.textContent;
    const originalBg = button.className;
    
    button.textContent = 'Added!';
    button.className = button.className.replace('bg-primary/10 text-primary hover:bg-primary hover:text-white', 'bg-green-500 text-white');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.className = originalBg;
    }, 1500);
  };

  if (loading) {
    return (
      <section id="menu" className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading menu...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-dark mb-4">Menu Favorit</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cicipi pilihan terbaik dari menu kami yang dibuat dengan bahan berkualitas tinggi
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              <div 
                className="relative overflow-hidden"
                onClick={() => onViewMenuDetail?.(item)}
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full flex items-center space-x-1">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm font-medium">Featured</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-6">
                <h3 
                  className="text-xl font-bold text-dark mb-2 group-hover:text-primary transition-colors cursor-pointer"
                  onClick={() => onViewMenuDetail?.(item)}
                >
                  {item.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">
                    Rp {item.price.toLocaleString('id-ID')}
                  </span>
                  <div className="flex space-x-2">
                    {/* <button
                      onClick={(e) => handleAddToCart(item, e)}
                      className="bg-primary/10 text-primary px-3 py-2 rounded-lg hover:bg-primary hover:text-white transition-all duration-300 flex items-center space-x-1 transform hover:scale-105"
                    >
                      <Plus size={16} />
                      <span>Add</span>
                    </button> */}
                    <button 
                      onClick={() => onViewMenuDetail?.(item)}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={onViewAllMenu}
            className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors transform hover:scale-105"
          >
            Lihat Menu Lengkap
          </button>
        </div>
      </div>
    </section>
  );
};

export default MenuHighlight;
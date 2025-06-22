import React from 'react';
import { Coffee, Menu, X, Gift } from 'lucide-react';

interface HeaderProps {
  onViewMyPromoClaims?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onViewMyPromoClaims }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <img 
              src="/image.png" 
              alt="Uncle Bagonk Logo" 
              className="h-10 w-10 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-primary">Uncle Bagonk</h1>
              <p className="text-xs text-gray-600">Kedai Kopi</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-dark hover:text-primary transition-colors">Home</a>
            <a href="#menu" className="text-dark hover:text-primary transition-colors">Menu</a>
            <a href="#about" className="text-dark hover:text-primary transition-colors">About</a>
            <a href="#promo" className="text-dark hover:text-primary transition-colors">Promo</a>
            <a href="#blog" className="text-dark hover:text-primary transition-colors">Blog</a>
            <a href="#contact" className="text-dark hover:text-primary transition-colors">Contact</a>
            {/* <button
              onClick={onViewMyPromoClaims}
              className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors font-medium"
            >
              <Gift size={16} />
              <span>My Promos</span>
            </button> */}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <a href="#home" className="text-dark hover:text-primary transition-colors">Home</a>
              <a href="#menu" className="text-dark hover:text-primary transition-colors">Menu</a>
              <a href="#about" className="text-dark hover:text-primary transition-colors">About</a>
              <a href="#promo" className="text-dark hover:text-primary transition-colors">Promo</a>
              <a href="#blog" className="text-dark hover:text-primary transition-colors">Blog</a>
              <a href="#contact" className="text-dark hover:text-primary transition-colors">Contact</a>
              {/* <button
                onClick={() => {
                  onViewMyPromoClaims?.();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors font-medium text-left"
              >
                <Gift size={16} />
                <span>My Promos</span>
              </button> */}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
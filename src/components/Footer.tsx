import React from 'react';
import { Coffee, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/image.png" 
                alt="Uncle Bagonk Logo" 
                className="h-10 w-10 object-contain"
              />
              <div>
                <h3 className="text-xl font-bold">Uncle Bagonk</h3>
                <p className="text-sm text-gray-400">Kedai Kopi</p>
              </div>
            </div>
            <p className="text-gray-400">
              Nikmati kopi berkualitas dan makanan lezat di tempat yang nyaman dan ramah.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Jam Operasional</h4>
            <div className="space-y-2 text-gray-400">
              <p>Senin - Jumat: 10.00 - 22.00</p>
              <p>Sabtu - Minggu: 10.00 - 22.30</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="space-y-2">
              <a href="#menu" className="block text-gray-400 hover:text-white transition-colors">Menu</a>
              <a href="#about" className="block text-gray-400 hover:text-white transition-colors">About Us</a>
              <a href="#promo" className="block text-gray-400 hover:text-white transition-colors">Promo</a>
              <a href="#contact" className="block text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 flex items-center justify-center space-x-2">
            <span>&copy; 2024 Kedai Kopi Uncle Bagonk. Made with</span>
            <Heart size={16} className="text-red-500" fill="currentColor" />
            <span>in Indonesia</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
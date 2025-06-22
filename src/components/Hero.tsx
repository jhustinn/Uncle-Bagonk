import React from 'react';
import { Coffee, Clock } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="pt-16 bg-gradient-to-br from-primary to-primary/90 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                BREW
                <span className="block text-secondary">&</span>
                BITE
              </h1>
              <p className="text-xl text-white/90 max-w-md">
                Nikmati kopi berkualitas dan makanan lezat di Kedai Kopi Uncle Bagonk
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-secondary transition-colors transform hover:scale-105">
                Order Now
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
                See Menu
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-3">
              <div className="flex items-center space-x-2">
                <Clock className="text-secondary" size={20} />
                <h3 className="font-semibold text-lg">Jam Operasional</h3>
              </div>
              <div className="space-y-1 text-white/90">
                <p>Senin - Jumat: 10.00 - 22.00</p>
                <p>Sabtu - Minggu: 10.00 - 22.30</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <img
                src="https://lxhnhzgibgzutbrffgon.supabase.co/storage/v1/object/public/promo-images/public/1750473374221.jpg"
                alt="Coffee and food"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-secondary text-primary p-4 rounded-full shadow-lg">
              <Coffee size={32} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
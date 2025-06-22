import React from 'react';
import { usePromos } from '../hooks/usePromos';
import { Calendar, Tag } from 'lucide-react';

interface PromoProps {
  onViewAllPromos?: () => void;
  onViewPromoDetail?: (promo: any) => void;
}

const Promo: React.FC<PromoProps> = ({ onViewAllPromos, onViewPromoDetail }) => {
  const { promos, loading } = usePromos();

  if (loading) {
    return (
      <section id="promo" className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">Loading promos...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="promo" className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-dark mb-4">Promo Spesial</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Jangan lewatkan penawaran menarik dari Uncle Bagonk
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
              onClick={() => onViewPromoDetail?.(promo)}
            >
              <div className="relative">
                <img
                  src={promo.image_url}
                  alt={promo.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center space-x-1">
                  <Tag size={14} />
                  <span className="text-sm font-medium">PROMO</span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-dark mb-2">{promo.title}</h3>
                <p className="text-gray-600 mb-4">{promo.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar size={16} className="mr-2" />
                  <span>Berlaku hingga {new Date(promo.valid_until).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={onViewAllPromos}
            className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Lihat Semua Promo
          </button>
        </div>
      </div>
    </section>
  );
};

export default Promo;
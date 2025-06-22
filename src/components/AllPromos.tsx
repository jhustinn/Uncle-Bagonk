import React from 'react';
import { useAllPromos } from '../hooks/useAllPromos';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { Promo } from '../types';
import ShareButton from './ShareButton';

interface AllPromosProps {
  onBack: () => void;
  onViewDetail: (promo: Promo) => void;
}

const AllPromos: React.FC<AllPromosProps> = ({ onBack, onViewDetail }) => {
  const { promos, loading } = useAllPromos();

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading promos...</p>
          </div>
        </div>
      </div>
    );
  }

  const activePromos = promos.filter(promo => promo.active && new Date(promo.valid_until) >= new Date());
  const expiredPromos = promos.filter(promo => !promo.active || new Date(promo.valid_until) < new Date());

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
          <h1 className="text-3xl font-bold text-dark">All Promotions</h1>
          <div className="w-20"></div>
        </div>

        {/* Active Promos */}
        {activePromos.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-dark mb-6 flex items-center space-x-2">
              <Tag className="text-green-500" size={24} />
              <span>Active Promotions</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePromos.map((promo) => (
                <PromoCard key={promo.id} promo={promo} onViewDetail={onViewDetail} isActive={true} />
              ))}
            </div>
          </div>
        )}

        {/* Expired Promos */}
        {expiredPromos.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-500 mb-6 flex items-center space-x-2">
              <Tag className="text-gray-400" size={24} />
              <span>Past Promotions</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expiredPromos.map((promo) => (
                <PromoCard key={promo.id} promo={promo} onViewDetail={onViewDetail} isActive={false} />
              ))}
            </div>
          </div>
        )}

        {promos.length === 0 && (
          <div className="text-center py-20">
            <Tag className="text-gray-400 mx-auto mb-4" size={48} />
            <p className="text-gray-600 text-lg">No promotions available at the moment.</p>
            <p className="text-gray-500">Check back later for exciting offers!</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface PromoCardProps {
  promo: Promo;
  onViewDetail: (promo: Promo) => void;
  isActive: boolean;
}

const PromoCard: React.FC<PromoCardProps> = ({ promo, onViewDetail, isActive }) => {
  const daysLeft = Math.ceil((new Date(promo.valid_until).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group ${
        !isActive ? 'opacity-75' : ''
      }`}
    >
      <div className="relative cursor-pointer" onClick={() => onViewDetail(promo)}>
        <img
          src={promo.image_url}
          alt={promo.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full flex items-center space-x-1 ${
          isActive ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'
        }`}>
          <Tag size={14} />
          <span className="text-sm font-medium">{isActive ? 'ACTIVE' : 'EXPIRED'}</span>
        </div>
        {isActive && daysLeft <= 7 && daysLeft > 0 && (
          <div className="absolute top-4 right-4 bg-orange-500 text-white px-2 py-1 rounded-full">
            <span className="text-xs font-medium">Ending Soon!</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 
          className={`text-xl font-bold mb-2 group-hover:text-primary transition-colors cursor-pointer ${
            isActive ? 'text-dark' : 'text-gray-500'
          }`}
          onClick={() => onViewDetail(promo)}
        >
          {promo.title}
        </h3>
        <p className={`text-sm mb-4 line-clamp-2 ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
          {promo.description}
        </p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar size={16} className="mr-2" />
            <span>Until {new Date(promo.valid_until).toLocaleDateString('id-ID')}</span>
          </div>
          <ShareButton
            url={`/promo/${promo.id}`}
            title={`${promo.title} - Uncle Bagonk Coffee`}
            description={promo.description}
            image={promo.image_url}
            variant="minimal"
            size="sm"
          />
        </div>
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onViewDetail(promo)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-primary/10 text-primary hover:bg-primary hover:text-white' 
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            View Details
          </button>
          {isActive && daysLeft > 0 && (
            <div className="text-xs text-green-600 font-medium">
              {daysLeft} days remaining
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllPromos;
import React, { useState } from 'react';
import { ArrowLeft, Calendar, Tag, Clock, Gift } from 'lucide-react';
import { Promo } from '../types';
import PromoClaimModal from './PromoClaimModal';
import PromoSuccessModal from './PromoSuccessModal';

interface PromoDetailProps {
  promo: Promo;
  onBack: () => void;
}

const PromoDetail: React.FC<PromoDetailProps> = ({ promo, onBack }) => {
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [claimCode, setClaimCode] = useState('');

  const isExpired = new Date(promo.valid_until) < new Date();
  const daysLeft = Math.ceil((new Date(promo.valid_until).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const handleClaimSuccess = (code: string) => {
    setClaimCode(code);
    setShowSuccessModal(true);
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
          <span>Back to Promos</span>
        </button>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative h-96 lg:h-full">
              <img
                src={promo.image_url}
                alt={promo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded-full flex items-center space-x-2">
                <Tag size={16} />
                <span className="font-medium">PROMO</span>
              </div>
              {!isExpired && promo.active && (
                <div className="absolute bottom-6 left-6 bg-green-500 text-white px-4 py-2 rounded-full">
                  <span className="font-medium">Active</span>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-8 lg:p-12">
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-dark mb-4">{promo.title}</h1>
                  <p className="text-gray-600 text-lg leading-relaxed">{promo.description}</p>
                </div>

                {/* Validity Info */}
                <div className={`rounded-2xl p-6 ${isExpired ? 'bg-red-50' : 'bg-green-50'}`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <Calendar className={isExpired ? 'text-red-500' : 'text-green-500'} size={24} />
                    <h3 className={`font-semibold ${isExpired ? 'text-red-700' : 'text-green-700'}`}>
                      {isExpired ? 'Expired' : 'Valid Until'}
                    </h3>
                  </div>
                  <p className={`text-lg font-bold ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
                    {new Date(promo.valid_until).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  {!isExpired && daysLeft > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      {daysLeft} days remaining
                    </p>
                  )}
                </div>

                {/* Promo Details */}
                {/* <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-dark mb-4">How to Claim</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
                      <p>Klik tombol "Klaim Promo" dan isi data diri Anda</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
                      <p>Simpan kode klaim yang diberikan</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
                      <p>Datang ke Uncle Bagonk dan tunjukkan kode klaim</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</div>
                      <p>Nikmati promo Anda!</p>
                    </div>
                  </div>
                </div> */}

                {/* Action Buttons */}
                <div className="space-y-3">
                  {!isExpired && promo.active ? (
                    <>
                      {/* <button 
                        onClick={() => setShowClaimModal(true)}
                        className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Gift size={20} />
                        <span>Klaim Promo</span>
                      </button> */}
                      <button className="w-full border-2 border-primary text-primary py-4 rounded-xl font-semibold text-lg hover:bg-primary hover:text-white transition-colors">
                        Share with Friends
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-red-600 font-medium">This promo is no longer available</p>
                      <p className="text-gray-500 text-sm mt-1">
                        {isExpired ? 'This promo has expired' : 'This promo is currently inactive'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Terms & Conditions */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-dark mb-3">Terms & Conditions</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Valid only at Uncle Bagonk coffee shop</p>
                    <p>• Cannot be combined with other promotions</p>
                    <p>• One promo per customer per visit</p>
                    <p>• Show claim code when ordering</p>
                    <p>• Management reserves the right to modify terms</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PromoClaimModal
        promo={promo}
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        onSuccess={handleClaimSuccess}
      />

      <PromoSuccessModal
        claimCode={claimCode}
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default PromoDetail;
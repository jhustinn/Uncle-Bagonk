import React, { useState } from 'react';
import { X, Gift, Phone, User, Mail, Loader } from 'lucide-react';
import { usePromoClaims } from '../hooks/usePromoClaims';
import { Promo } from '../types';

interface PromoClaimModalProps {
  promo: Promo;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (claimCode: string) => void;
}

const PromoClaimModal: React.FC<PromoClaimModalProps> = ({ 
  promo, 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { claimPromo } = usePromoClaims();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const { data, error: claimError } = await claimPromo({
      promo_id: promo.id,
      ...formData,
    });

    if (claimError) {
      setError(claimError);
    } else if (data) {
      onSuccess(data.claim_code);
      onClose();
      setFormData({ customer_name: '', customer_phone: '', customer_email: '' });
    }

    setIsSubmitting(false);
  };

  const isExpired = new Date(promo.valid_until) < new Date();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <img
            src={promo.image_url}
            alt={promo.title}
            className="w-full h-48 object-cover rounded-t-2xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/40 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white mb-2">{promo.title}</h2>
            <p className="text-white/90 text-sm">{promo.description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isExpired || !promo.active ? (
            <div className="text-center py-8">
              <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-4">
                <p className="font-medium">Promo Tidak Tersedia</p>
                <p className="text-sm mt-1">
                  {isExpired ? 'Promo ini sudah expired' : 'Promo ini sudah tidak aktif'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Tutup
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2 mb-6">
                <Gift className="text-primary" size={24} />
                <h3 className="text-xl font-bold text-dark">Klaim Promo</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="inline mr-2" />
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone size={16} className="inline mr-2" />
                    Nomor WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="08xxxxxxxxxx"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail size={16} className="inline mr-2" />
                    Email (Opsional)
                  </label>
                  <input
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                  <p className="font-medium mb-1">Syarat & Ketentuan:</p>
                  <ul className="text-xs space-y-1">
                    <li>• Promo hanya berlaku sampai {new Date(promo.valid_until).toLocaleDateString('id-ID')}</li>
                    <li>• Satu promo per customer</li>
                    <li>• Tunjukkan kode klaim saat datang ke kedai</li>
                    <li>• Tidak dapat digabung dengan promo lain</li>
                  </ul>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="animate-spin mr-2" size={16} />
                        Mengklaim...
                      </>
                    ) : (
                      'Klaim Promo'
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromoClaimModal;
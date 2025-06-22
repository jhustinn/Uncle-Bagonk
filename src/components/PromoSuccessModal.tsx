import React from 'react';
import { CheckCircle, Copy, X, Share2 } from 'lucide-react';

interface PromoSuccessModalProps {
  claimCode: string;
  isOpen: boolean;
  onClose: () => void;
}

const PromoSuccessModal: React.FC<PromoSuccessModalProps> = ({ 
  claimCode, 
  isOpen, 
  onClose 
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(claimCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareViaWhatsApp = () => {
    const message = `Saya sudah mengklaim promo di Uncle Bagonk! Kode klaim: ${claimCode}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>

          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>

          <h2 className="text-2xl font-bold text-dark mb-2">Promo Berhasil Diklaim!</h2>
          <p className="text-gray-600 mb-6">
            Simpan kode klaim di bawah ini dan tunjukkan saat datang ke kedai
          </p>

          <div className="bg-primary/10 border-2 border-dashed border-primary rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Kode Klaim Anda:</p>
            <div className="text-3xl font-bold text-primary mb-4 tracking-wider">
              {claimCode}
            </div>
            <button
              onClick={copyToClipboard}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2 mx-auto"
            >
              <Copy size={16} />
              <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg mb-6 text-sm">
            <p className="font-medium mb-2">Cara Menggunakan:</p>
            <ol className="text-left space-y-1">
              <li>1. Datang ke Uncle Bagonk Coffee Shop</li>
              <li>2. Tunjukkan kode klaim ini ke kasir</li>
              <li>3. Nikmati promo Anda!</li>
            </ol>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={shareViaWhatsApp}
              className="flex-1 bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoSuccessModal;
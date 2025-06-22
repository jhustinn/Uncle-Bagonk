import React, { useState } from 'react';
import { Search, Gift, Calendar, CheckCircle, Clock, XCircle, Phone } from 'lucide-react';
import { usePromoClaims, PromoClaim } from '../hooks/usePromoClaims';

const MyPromoClaims: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const { claims, loading, getClaimsByPhone } = usePromoClaims();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim()) {
      await getClaimsByPhone(phoneNumber.trim());
      setSearchPerformed(true);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'claimed':
        return <Clock className="text-blue-500" size={20} />;
      case 'used':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'expired':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Gift className="text-gray-500" size={20} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'claimed':
        return 'Belum Digunakan';
      case 'used':
        return 'Sudah Digunakan';
      case 'expired':
        return 'Expired';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'claimed':
        return 'bg-blue-100 text-blue-600';
      case 'used':
        return 'bg-green-100 text-green-600';
      case 'expired':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-secondary pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark mb-4">Promo Saya</h1>
          <p className="text-gray-600">
            Cek status promo yang sudah Anda klaim dengan memasukkan nomor WhatsApp
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Masukkan nomor WhatsApp (08xxxxxxxxxx)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <Search size={20} />
              <span>{loading ? 'Mencari...' : 'Cari'}</span>
            </button>
          </form>
        </div>

        {/* Results */}
        {searchPerformed && (
          <div className="space-y-6">
            {claims.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <Gift className="text-gray-400 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Tidak Ada Promo Ditemukan
                </h3>
                <p className="text-gray-600">
                  Belum ada promo yang diklaim dengan nomor WhatsApp ini.
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <p className="text-gray-600">
                    Ditemukan <span className="font-semibold text-primary">{claims.length}</span> promo
                  </p>
                </div>

                <div className="grid gap-6">
                  {claims.map((claim) => (
                    <ClaimCard key={claim.id} claim={claim} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface ClaimCardProps {
  claim: PromoClaim;
}

const ClaimCard: React.FC<ClaimCardProps> = ({ claim }) => {
  const [showCode, setShowCode] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(claim.claim_code);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'claimed':
        return <Clock className="text-blue-500" size={20} />;
      case 'used':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'expired':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Gift className="text-gray-500" size={20} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'claimed':
        return 'Belum Digunakan';
      case 'used':
        return 'Sudah Digunakan';
      case 'expired':
        return 'Expired';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'claimed':
        return 'bg-blue-100 text-blue-600';
      case 'used':
        return 'bg-green-100 text-green-600';
      case 'expired':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="grid md:grid-cols-3 gap-0">
        {/* Promo Image */}
        <div className="relative h-48 md:h-auto">
          {claim.promo?.image_url && (
            <img
              src={claim.promo.image_url}
              alt={claim.promo.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-4 right-4">
            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(claim.status)}`}>
              {getStatusIcon(claim.status)}
              <span>{getStatusText(claim.status)}</span>
            </div>
          </div>
        </div>

        {/* Promo Details */}
        <div className="p-6 md:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-dark mb-2">
                {claim.promo?.title || 'Promo'}
              </h3>
              <p className="text-gray-600 mb-3">
                {claim.promo?.description || 'Deskripsi promo tidak tersedia'}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Diklaim pada:</p>
              <p className="font-medium">
                {new Date(claim.claimed_at).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            {claim.used_at && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Digunakan pada:</p>
                <p className="font-medium">
                  {new Date(claim.used_at).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>

          {claim.promo?.valid_until && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Berlaku hingga:</p>
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-gray-400" />
                <p className="font-medium">
                  {new Date(claim.promo.valid_until).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
          )}

          {/* Claim Code */}
          {claim.status === 'claimed' && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-primary">Kode Klaim:</p>
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="text-primary text-sm hover:underline"
                >
                  {showCode ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
              {showCode && (
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary tracking-wider">
                    {claim.claim_code}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary/90 transition-colors"
                  >
                    Salin
                  </button>
                </div>
              )}
            </div>
          )}

          {claim.notes && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Catatan:</span> {claim.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPromoClaims;
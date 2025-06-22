import React, { useState } from 'react';
import { Search, Eye, Check, X, Trash2, Calendar, User, Phone, Mail } from 'lucide-react';
import { useAdminPromoClaims } from '../../hooks/useAdminPromoClaims';
import { PromoClaim } from '../../hooks/usePromoClaims';

const PromoClaimsManager: React.FC = () => {
  const { claims, loading, updateClaimStatus, deleteClaim, getClaimStats } = useAdminPromoClaims();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedClaim, setSelectedClaim] = useState<PromoClaim | null>(null);
  const [showModal, setShowModal] = useState(false);

  const stats = getClaimStats();

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = 
      claim.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.customer_phone.includes(searchTerm) ||
      claim.claim_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.promo?.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (id: string, status: 'claimed' | 'used' | 'expired') => {
    await updateClaimStatus(id, status);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this claim?')) {
      await deleteClaim(id);
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

  if (loading) {
    return <div className="text-center py-8">Loading promo claims...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Promo Claims Management</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Claims</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <User className="text-white" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Claims</p>
              <p className="text-3xl font-bold text-blue-600">{stats.claimed}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Calendar className="text-white" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Used Claims</p>
              <p className="text-3xl font-bold text-green-600">{stats.used}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Check className="text-white" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expired Claims</p>
              <p className="text-3xl font-bold text-red-600">{stats.expired}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <X className="text-white" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, phone, code, or promo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="claimed">Claimed</option>
            <option value="used">Used</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Claim Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Claimed Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{claim.customer_name}</div>
                      <div className="text-sm text-gray-500">{claim.customer_phone}</div>
                      {claim.customer_email && (
                        <div className="text-sm text-gray-500">{claim.customer_email}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {claim.promo?.title || 'Unknown Promo'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono font-bold text-primary">
                      {claim.claim_code}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(claim.claimed_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => {
                        setSelectedClaim(claim);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye size={16} />
                    </button>
                    {claim.status === 'claimed' && (
                      <button
                        onClick={() => handleStatusUpdate(claim.id, 'used')}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(claim.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredClaims.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-600 text-lg">No claims found matching your criteria.</p>
        </div>
      )}

      {/* Detail Modal */}
      {showModal && selectedClaim && (
        <ClaimDetailModal
          claim={selectedClaim}
          onClose={() => {
            setShowModal(false);
            setSelectedClaim(null);
          }}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

interface ClaimDetailModalProps {
  claim: PromoClaim;
  onClose: () => void;
  onStatusUpdate: (id: string, status: 'claimed' | 'used' | 'expired') => void;
}

const ClaimDetailModal: React.FC<ClaimDetailModalProps> = ({ claim, onClose, onStatusUpdate }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Claim Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <User size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Name:</span>
                  <span className="font-medium">{claim.customer_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Phone:</span>
                  <span className="font-medium">{claim.customer_phone}</span>
                </div>
                {claim.customer_email && (
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="font-medium">{claim.customer_email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Promo Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Promo Information</h4>
              <div className="space-y-2">
                <p><span className="text-gray-600">Title:</span> <span className="font-medium">{claim.promo?.title}</span></p>
                <p><span className="text-gray-600">Description:</span> <span className="font-medium">{claim.promo?.description}</span></p>
                <p><span className="text-gray-600">Valid Until:</span> <span className="font-medium">{claim.promo?.valid_until ? new Date(claim.promo.valid_until).toLocaleDateString('id-ID') : 'N/A'}</span></p>
              </div>
            </div>

            {/* Claim Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Claim Information</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <p><span className="text-gray-600">Claim Code:</span> <span className="font-mono font-bold text-primary">{claim.claim_code}</span></p>
                <p><span className="text-gray-600">Status:</span> <span className="font-medium">{claim.status}</span></p>
                <p><span className="text-gray-600">Claimed At:</span> <span className="font-medium">{new Date(claim.claimed_at).toLocaleString('id-ID')}</span></p>
                {claim.used_at && (
                  <p><span className="text-gray-600">Used At:</span> <span className="font-medium">{new Date(claim.used_at).toLocaleString('id-ID')}</span></p>
                )}
              </div>
              {claim.notes && (
                <div className="mt-4">
                  <p><span className="text-gray-600">Notes:</span> <span className="font-medium">{claim.notes}</span></p>
                </div>
              )}
            </div>

            {/* Actions */}
            {claim.status === 'claimed' && (
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    onStatusUpdate(claim.id, 'used');
                    onClose();
                  }}
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Mark as Used
                </button>
                <button
                  onClick={() => {
                    onStatusUpdate(claim.id, 'expired');
                    onClose();
                  }}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Mark as Expired
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoClaimsManager;
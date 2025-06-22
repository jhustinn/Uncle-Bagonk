import React, { useState } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Upload, Calendar } from 'lucide-react';
import { useAdminPromos } from '../../hooks/useAdminPromos';
import { Promo } from '../../types';
import { supabase } from '../../lib/supabase';

const PromoManager: React.FC = () => {
  const { promos, loading, addPromo, updatePromo, deletePromo } = useAdminPromos();
  const [showForm, setShowForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    valid_until: '',
    active: true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      valid_until: '',
      active: true,
    });
    setFile(null);
    setEditingPromo(null);
    setShowForm(false);
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error } = await supabase.storage
      .from('promo-images')
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase
      .storage
      .from('promo-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.image_url;

      if (file) {
        imageUrl = await uploadImage(file);
      }

      const promoData = { ...formData, image_url: imageUrl };

      if (editingPromo) {
        await updatePromo(editingPromo.id, promoData);
      } else {
        await addPromo(promoData);
      }

      resetForm();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (promo: Promo) => {
    setFormData({
      title: promo.title,
      description: promo.description,
      image_url: promo.image_url,
      valid_until: promo.valid_until,
      active: promo.active,
    });
    setFile(null);
    setEditingPromo(promo);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this promo?')) {
      await deletePromo(id);
    }
  };

  const toggleActive = async (promo: Promo) => {
    await updatePromo(promo.id, { active: !promo.active });
  };

  if (loading) {
    return <div className="text-center py-8">Loading promos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Promo Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-primary/90 transition-colors shadow-lg"
        >
          <Plus size={20} />
          <span>Add Promo</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-900">
            {editingPromo ? 'Edit Promo' : 'Create New Promo'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Promo Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="Enter promo title"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Valid Until</label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    required
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                rows={4}
                placeholder="Describe your promotion in detail..."
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Promo Image</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                />
                <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              {editingPromo && formData.image_url && (
                <div className="mt-3 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-2">Current image:</p>
                  <img src={formData.image_url} alt="Current promo" className="w-32 h-20 object-cover rounded-lg" />
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div>
                  <span className="text-sm font-semibold text-gray-700">Active Promo</span>
                  <p className="text-xs text-gray-500">Enable this promo to show on the website</p>
                </div>
              </label>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : editingPromo ? 'Update Promo' : 'Create Promo'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promos.map((promo) => {
          const isExpired = new Date(promo.valid_until) < new Date();
          const daysLeft = Math.ceil((new Date(promo.valid_until).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <div key={promo.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src={promo.image_url}
                  alt={promo.title}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => toggleActive(promo)}
                  className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                    promo.active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                  }`}
                >
                  {promo.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                </button>
                {isExpired && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    EXPIRED
                  </div>
                )}
                {!isExpired && daysLeft <= 7 && daysLeft > 0 && (
                  <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {daysLeft} days left
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{promo.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{promo.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar size={16} className="mr-2" />
                  <span>Valid until: {new Date(promo.valid_until).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    promo.active && !isExpired
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {promo.active && !isExpired ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(promo)}
                    className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                  >
                    <Edit size={16} className="inline mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(promo.id)}
                    className="flex-1 bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors font-medium"
                  >
                    <Trash2 size={16} className="inline mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PromoManager;
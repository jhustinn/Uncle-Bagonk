import React, { useState } from 'react';
import { Plus, Edit, Trash2, Star, StarOff, Upload } from 'lucide-react';
import { useAdminMenu } from '../../hooks/useAdminMenu';
import { MenuItem } from '../../types';
import { supabase } from '../../lib/supabase';

const MenuManager: React.FC = () => {
  const { menuItems, loading, addMenuItem, updateMenuItem, deleteMenuItem } = useAdminMenu();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: 'coffee' as 'coffee' | 'food' | 'dessert',
    featured: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image_url: '',
      category: 'coffee',
      featured: false,
    });
    setFile(null);
    setEditingItem(null);
    setShowForm(false);
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error } = await supabase.storage
      .from('menu-images')
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase
      .storage
      .from('menu-images')
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

      const itemData = {
        ...formData,
        price: parseInt(formData.price),
        image_url: imageUrl,
      };

      if (editingItem) {
        await updateMenuItem(editingItem.id, itemData);
      } else {
        await addMenuItem(itemData);
      }
      
      resetForm();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      image_url: item.image_url,
      category: item.category,
      featured: item.featured,
    });
    setFile(null);
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      await deleteMenuItem(id);
    }
  };

  const toggleFeatured = async (item: MenuItem) => {
    await updateMenuItem(item.id, { featured: !item.featured });
  };

  if (loading) {
    return <div className="text-center py-8">Loading menu items...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Menu Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-primary/90 transition-colors shadow-lg"
        >
          <Plus size={20} />
          <span>Add Menu Item</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-900">
            {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="Enter menu item name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Price (Rp)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="Enter price"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                rows={4}
                placeholder="Describe your menu item..."
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as 'coffee' | 'food' | 'dessert' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                >
                  <option value="coffee">Coffee</option>
                  <option value="food">Food</option>
                  <option value="dessert">Dessert</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Image Upload</label>
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
                {editingItem && formData.image_url && (
                  <p className="text-sm text-gray-600">
                    Current image: <a href={formData.image_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">View</a>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="featured" className="text-sm font-semibold text-gray-700">
                Featured Item (will appear on homepage)
              </label>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : editingItem ? 'Update Item' : 'Add Item'}
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
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="relative">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => toggleFeatured(item)}
                className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                  item.featured ? 'bg-yellow-500 text-white' : 'bg-white/80 text-gray-600'
                }`}
              >
                {item.featured ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
              </button>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full capitalize font-medium">
                  {item.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
              <p className="text-2xl font-bold text-primary mb-4">
                Rp {item.price.toLocaleString('id-ID')}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                >
                  <Edit size={16} className="inline mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors font-medium"
                >
                  <Trash2 size={16} className="inline mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuManager;
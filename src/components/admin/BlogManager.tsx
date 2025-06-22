import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, Star, StarOff } from 'lucide-react';
import { useAdminBlog } from '../../hooks/useAdminBlog';
import { BlogPost } from '../../types';
import { supabase } from '../../lib/supabase';
import RichTextEditor from '../RichTextEditor';

const BlogManager: React.FC = () => {
  const { blogPosts, categories, loading, addBlogPost, updateBlogPost, deleteBlogPost, addCategory } = useAdminBlog();
  const [showForm, setShowForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image_url: '',
    author: 'Uncle Bagonk Team',
    published: false,
    featured: false,
    slug: '',
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      featured_image_url: '',
      author: 'Uncle Bagonk Team',
      published: false,
      featured: false,
      slug: '',
    });
    setSelectedCategories([]);
    setFile(null);
    setEditingPost(null);
    setShowForm(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase
      .storage
      .from('blog-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.featured_image_url;

      if (file) {
        imageUrl = await uploadImage(file);
      }

      const slug = formData.slug || generateSlug(formData.title);
      const postData = { ...formData, featured_image_url: imageUrl, slug };

      if (editingPost) {
        await updateBlogPost(editingPost.id, postData, selectedCategories);
      } else {
        await addBlogPost(postData, selectedCategories);
      }

      resetForm();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      featured_image_url: post.featured_image_url || '',
      author: post.author,
      published: post.published,
      featured: post.featured,
      slug: post.slug,
    });
    setSelectedCategories(post.categories?.map(cat => cat.id) || []);
    setFile(null);
    setEditingPost(post);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      await deleteBlogPost(id);
    }
  };

  const togglePublished = async (post: BlogPost) => {
    await updateBlogPost(post.id, { published: !post.published }, post.categories?.map(cat => cat.id) || []);
  };

  const toggleFeatured = async (post: BlogPost) => {
    await updateBlogPost(post.id, { featured: !post.featured }, post.categories?.map(cat => cat.id) || []);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = newCategory.slug || generateSlug(newCategory.name);
    await addCategory({ ...newCategory, slug });
    setNewCategory({ name: '', slug: '' });
    setShowCategoryForm(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading blog posts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCategoryForm(true)}
            className="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors"
          >
            Add Category
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-primary/90 transition-colors shadow-lg"
          >
            <Plus size={20} />
            <span>New Article</span>
          </button>
        </div>
      </div>

      {/* Category Form */}
      {showCategoryForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Add New Category</h3>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Category Name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Slug (optional)"
                value={newCategory.slug}
                onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-xl hover:bg-primary/90 transition-colors"
              >
                Add Category
              </button>
              <button
                type="button"
                onClick={() => setShowCategoryForm(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blog Post Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-900">
            {editingPost ? 'Edit Article' : 'Create New Article'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter article title"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="URL slug (auto-generated if empty)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                placeholder="Brief description of the article..."
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Content</label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="Write your article content here... Use the toolbar above for formatting options."
                className="w-full"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Author name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Featured Image</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFile(e.target.files[0]);
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
                {editingPost && formData.featured_image_url && (
                  <p className="text-sm text-gray-600">
                    Current image: <a href={formData.featured_image_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">View</a>
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Categories</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, category.id]);
                        } else {
                          setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                        }
                      }}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-semibold text-gray-700">Published</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-semibold text-gray-700">Featured Article</span>
              </label>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : editingPost ? 'Update Article' : 'Create Article'}
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

      {/* Blog Posts List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            {post.featured_image_url && (
              <div className="relative">
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={() => toggleFeatured(post)}
                    className={`p-2 rounded-full transition-colors ${
                      post.featured ? 'bg-yellow-500 text-white' : 'bg-white/80 text-gray-600'
                    }`}
                  >
                    {post.featured ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
                  </button>
                  <button
                    onClick={() => togglePublished(post)}
                    className={`p-2 rounded-full transition-colors ${
                      post.published ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                    }`}
                  >
                    {post.published ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>
            )}
            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">{post.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {post.categories?.map((category) => (
                  <span key={category.id} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {category.name}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-gray-500">By {post.author}</span>
                <div className="flex space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    post.published ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  {post.featured && (
                    <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(post)}
                  className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                >
                  <Edit size={16} className="inline mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
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

export default BlogManager;
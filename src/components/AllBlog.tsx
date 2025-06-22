import React, { useState } from 'react';
import { useAllBlog } from '../hooks/useAllBlog';
import { ArrowLeft, Calendar, User, Filter, Search } from 'lucide-react';
import { BlogPost } from '../types';
import ShareButton from './ShareButton';

interface AllBlogProps {
  onBack: () => void;
  onViewDetail: (post: BlogPost) => void;
}

const AllBlog: React.FC<AllBlogProps> = ({ onBack, onViewDetail }) => {
  const { blogPosts, categories, loading } = useAllBlog();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || 
      post.categories?.some(cat => cat.id === selectedCategory);
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-dark">Blog & Articles</h1>
          <div className="w-20"></div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <div className="flex items-center space-x-4 mb-3">
                <Filter size={20} className="text-primary" />
                <h3 className="text-lg font-semibold text-dark">Filter by Category</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Articles
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              {post.featured_image_url && (
                <div className="relative overflow-hidden h-48 cursor-pointer" onClick={() => onViewDetail(post)}>
                  <img
                    src={post.featured_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {post.featured && (
                    <div className="absolute top-3 right-3 bg-primary text-white px-2 py-1 rounded-full">
                      <span className="text-xs font-medium">Featured</span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <User size={14} />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{new Date(post.created_at || '').toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
                
                <h3 
                  className="text-xl font-bold text-dark mb-3 group-hover:text-primary transition-colors cursor-pointer"
                  onClick={() => onViewDetail(post)}
                >
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.categories?.map((category) => (
                    <span
                      key={category.id}
                      className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => onViewDetail(post)}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-colors"
                  >
                    Read More
                  </button>
                  <ShareButton
                    url={`/blog/${post.slug}`}
                    title={`${post.title} - Uncle Bagonk Coffee`}
                    description={post.excerpt}
                    image={post.featured_image_url}
                    variant="minimal"
                    size="sm"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No articles found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBlog;
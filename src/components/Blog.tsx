import React from 'react';
import { useBlog } from '../hooks/useBlog';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { BlogPost } from '../types';
import ShareButton from './ShareButton';

interface BlogProps {
  onViewAllBlog?: () => void;
  onViewBlogDetail?: (post: BlogPost) => void;
}

const Blog: React.FC<BlogProps> = ({ onViewAllBlog, onViewBlogDetail }) => {
  const { blogPosts, loading } = useBlog();

  if (loading) {
    return (
      <section id="blog" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">Loading blog posts...</div>
          </div>
        </div>
      </section>
    );
  }

  if (blogPosts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-dark mb-4">Blog & Tips</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Dapatkan tips terbaru seputar kopi, resep, dan cerita menarik dari Uncle Bagonk
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-secondary rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {post.featured_image_url && (
                <div className="relative overflow-hidden h-48 cursor-pointer" onClick={() => onViewBlogDetail?.(post)}>
                  <img
                    src={post.featured_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User size={14} />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{new Date(post.created_at || '').toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                  <ShareButton
                    url={`/blog/${post.slug}`}
                    title={`${post.title} - Uncle Bagonk Coffee`}
                    description={post.excerpt}
                    image={post.featured_image_url}
                    variant="minimal"
                    size="sm"
                  />
                </div>
                
                <h3 
                  className="text-xl font-bold text-dark mb-3 group-hover:text-primary transition-colors cursor-pointer"
                  onClick={() => onViewBlogDetail?.(post)}
                >
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {post.categories?.slice(0, 2).map((category) => (
                      <span
                        key={category.id}
                        className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => onViewBlogDetail?.(post)}
                    className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={onViewAllBlog}
            className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Lihat Semua Artikel
          </button>
        </div>
      </div>
    </section>
  );
};

export default Blog;
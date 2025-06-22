import React from 'react';
import { ArrowLeft, Calendar, User, Share2, Heart } from 'lucide-react';
import { BlogPost } from '../types';
import BlogInteractions from './BlogInteractions';

interface BlogDetailProps {
  post: BlogPost;
  onBack: () => void;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ post, onBack }) => {
  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.startsWith('# ')) {
        return (
          <h1 key={index} className="text-2xl font-bold text-dark mt-8 mb-4">
            {paragraph.replace('# ', '')}
          </h1>
        );
      }
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold text-dark mt-8 mb-4">
            {paragraph.replace('## ', '')}
          </h2>
        );
      }
      if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-bold text-dark mt-6 mb-3">
            {paragraph.replace('### ', '')}
          </h3>
        );
      }
      if (paragraph.startsWith('- ')) {
        return (
          <li key={index} className="text-gray-700 leading-relaxed ml-4">
            {paragraph.replace('- ', '')}
          </li>
        );
      }
      if (paragraph.trim() === '') {
        return <br key={index} />;
      }
      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-4">
          {paragraph}
        </p>
      );
    });
  };

  // Generate the full URL for sharing
  const postUrl = `${window.location.origin}/blog/${post.slug}`;

  return (
    <div className="min-h-screen bg-secondary pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Blog</span>
        </button>

        <article className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
          {/* Featured Image */}
          {post.featured_image_url && (
            <div className="relative h-96">
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.categories?.map((category) => (
                    <span
                      key={category.id}
                      className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
                <div className="flex items-center space-x-6 text-white/90">
                  <div className="flex items-center space-x-2">
                    <User size={16} />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} />
                    <span>{new Date(post.created_at || '').toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-8 lg:p-12">
            {!post.featured_image_url && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.categories?.map((category) => (
                    <span
                      key={category.id}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
                <h1 className="text-4xl font-bold text-dark mb-4">{post.title}</h1>
                <div className="flex items-center space-x-6 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <User size={16} />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} />
                    <span>{new Date(post.created_at || '').toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-xl text-gray-600 mb-8 font-medium leading-relaxed">
                {post.excerpt}
              </div>
              <div className="text-gray-700 leading-relaxed">
                {formatContent(post.content)}
              </div>
            </div>

            {/* Article Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Last updated: {new Date(post.updated_at || post.created_at || '').toLocaleDateString('id-ID')}
              </div>
            </div>
          </div>
        </article>

        {/* Blog Interactions */}
        <BlogInteractions 
          postId={post.id} 
          postTitle={post.title}
          postUrl={postUrl}
        />

        {/* Related Articles */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-dark mb-6">Related Articles</h3>
          <div className="bg-white rounded-2xl p-6">
            <p className="text-gray-600 text-center">More articles coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
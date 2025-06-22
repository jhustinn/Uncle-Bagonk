import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../types';

export const useBlog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            *,
            blog_post_categories (
              blog_categories (
                id,
                name,
                slug
              )
            )
          `)
          .eq('published', true)
          .eq('featured', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        
        const postsWithCategories = data?.map(post => ({
          ...post,
          categories: post.blog_post_categories?.map((bpc: any) => bpc.blog_categories) || []
        })) || [];
        
        setBlogPosts(postsWithCategories);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch blog posts');
        // Fallback data
        setBlogPosts([
          {
            id: '1',
            title: 'Tips Memilih Biji Kopi Terbaik',
            content: 'Memilih biji kopi yang tepat adalah kunci untuk mendapatkan secangkir kopi yang sempurna...',
            excerpt: 'Pelajari cara memilih biji kopi terbaik untuk mendapatkan secangkir kopi yang sempurna.',
            featured_image_url: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=800',
            author: 'Uncle Bagonk Team',
            published: true,
            featured: true,
            slug: 'tips-memilih-biji-kopi-terbaik',
            categories: []
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  return { blogPosts, loading, error };
};
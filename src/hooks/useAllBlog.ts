import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BlogPost, BlogCategory } from '../types';

export const useAllBlog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch blog posts
        const { data: postsData, error: postsError } = await supabase
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
          .order('created_at', { ascending: false });

        if (postsError) throw postsError;

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('blog_categories')
          .select('*')
          .order('name');

        if (categoriesError) throw categoriesError;

        const postsWithCategories = postsData?.map(post => ({
          ...post,
          categories: post.blog_post_categories?.map((bpc: any) => bpc.blog_categories) || []
        })) || [];

        setBlogPosts(postsWithCategories);
        setCategories(categoriesData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch blog data');
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
        setCategories([
          { id: '1', name: 'Coffee Tips', slug: 'coffee-tips' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { blogPosts, categories, loading, error };
};
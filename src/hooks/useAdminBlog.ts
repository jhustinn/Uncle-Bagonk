import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BlogPost, BlogCategory } from '../types';

export const useAdminBlog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const postsWithCategories = data?.map(post => ({
        ...post,
        categories: post.blog_post_categories?.map((bpc: any) => bpc.blog_categories) || []
      })) || [];
      
      setBlogPosts(postsWithCategories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    }
  };

  const addBlogPost = async (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>, categoryIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([post])
        .select()
        .single();

      if (error) throw error;

      // Add category associations
      if (categoryIds.length > 0) {
        const categoryAssociations = categoryIds.map(categoryId => ({
          post_id: data.id,
          category_id: categoryId
        }));

        await supabase
          .from('blog_post_categories')
          .insert(categoryAssociations);
      }

      await fetchBlogPosts();
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to add blog post';
      return { data: null, error };
    }
  };

  const updateBlogPost = async (id: string, updates: Partial<BlogPost>, categoryIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update category associations
      await supabase
        .from('blog_post_categories')
        .delete()
        .eq('post_id', id);

      if (categoryIds.length > 0) {
        const categoryAssociations = categoryIds.map(categoryId => ({
          post_id: id,
          category_id: categoryId
        }));

        await supabase
          .from('blog_post_categories')
          .insert(categoryAssociations);
      }

      await fetchBlogPosts();
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update blog post';
      return { data: null, error };
    }
  };

  const deleteBlogPost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setBlogPosts(prev => prev.filter(post => post.id !== id));
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to delete blog post';
      return { error };
    }
  };

  const addCategory = async (category: Omit<BlogCategory, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .insert([category])
        .select()
        .single();

      if (error) throw error;
      setCategories(prev => [...prev, data]);
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to add category';
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchBlogPosts();
    fetchCategories();
  }, []);

  return {
    blogPosts,
    categories,
    loading,
    error,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    addCategory,
    refetch: fetchBlogPosts,
  };
};
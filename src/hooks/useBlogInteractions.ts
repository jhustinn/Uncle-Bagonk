import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface BlogStats {
  likes_count: number;
  comments_count: number;
  views_count: number;
  shares_count: number;
}

export interface BlogComment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  approved: boolean;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  replies?: BlogComment[];
}

export const useBlogInteractions = (postId: string) => {
  const [stats, setStats] = useState<BlogStats>({
    likes_count: 0,
    comments_count: 0,
    views_count: 0,
    shares_count: 0
  });
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get client IP address (simplified)
  const getClientIP = () => {
    return 'anonymous_' + Math.random().toString(36).substr(2, 9);
  };

  // Fetch blog stats
  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_blog_post_stats', { post_uuid: postId });

      if (error) throw error;
      if (data && data.length > 0) {
        setStats(data[0]);
      }
    } catch (error) {
      console.error('Error fetching blog stats:', error);
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('post_id', postId)
        .eq('approved', true)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch replies for each comment
      const commentsWithReplies = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: replies } = await supabase
            .from('blog_comments')
            .select('*')
            .eq('parent_id', comment.id)
            .eq('approved', true)
            .order('created_at', { ascending: true });

          return { ...comment, replies: replies || [] };
        })
      );

      setComments(commentsWithReplies);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Check if user has liked the post
  const checkLikeStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const ip = getClientIP();

      const { data, error } = await supabase
        .from('blog_likes')
        .select('id')
        .eq('post_id', postId)
        .or(user ? `user_id.eq.${user.id}` : `ip_address.eq.${ip}`)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setIsLiked(!!data);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  // Record view
  const recordView = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const ip = getClientIP();

      await supabase
        .from('blog_views')
        .insert({
          post_id: postId,
          user_id: user?.id || null,
          ip_address: ip,
          user_agent: navigator.userAgent
        });
    } catch (error) {
      // Ignore duplicate view errors
      console.log('View already recorded or error:', error);
    }
  };

  // Toggle like
  const toggleLike = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const ip = getClientIP();

      if (isLiked) {
        // Remove like
        await supabase
          .from('blog_likes')
          .delete()
          .eq('post_id', postId)
          .eq(user ? 'user_id' : 'ip_address', user?.id || ip);
        
        setIsLiked(false);
        setStats(prev => ({ ...prev, likes_count: prev.likes_count - 1 }));
      } else {
        // Add like
        await supabase
          .from('blog_likes')
          .insert({
            post_id: postId,
            user_id: user?.id || null,
            ip_address: ip
          });
        
        setIsLiked(true);
        setStats(prev => ({ ...prev, likes_count: prev.likes_count + 1 }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Add comment
  const addComment = async (authorName: string, authorEmail: string, content: string, parentId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('blog_comments')
        .insert({
          post_id: postId,
          user_id: user?.id || null,
          author_name: authorName,
          author_email: authorEmail,
          content,
          parent_id: parentId || null,
          approved: false // Comments need approval
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh comments after adding
      await fetchComments();
      await fetchStats();

      return { success: true, data };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false, error };
    }
  };

  // Record share
  const recordShare = async (platform: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const ip = getClientIP();

      await supabase
        .from('blog_shares')
        .insert({
          post_id: postId,
          platform,
          user_id: user?.id || null,
          ip_address: ip
        });

      setStats(prev => ({ ...prev, shares_count: prev.shares_count + 1 }));
    } catch (error) {
      console.error('Error recording share:', error);
    }
  };

  // Share functions
  const shareToFacebook = (url: string, title: string) => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    recordShare('facebook');
  };

  const shareToTwitter = (url: string, title: string) => {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    recordShare('twitter');
  };

  const shareToWhatsApp = (url: string, title: string) => {
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
    window.open(shareUrl, '_blank');
    recordShare('whatsapp');
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      recordShare('copy');
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  };

  const shareViaEmail = (url: string, title: string) => {
    const subject = encodeURIComponent(`Check out this article: ${title}`);
    const body = encodeURIComponent(`I thought you might be interested in this article:\n\n${title}\n\n${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    recordShare('email');
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([
        fetchStats(),
        fetchComments(),
        checkLikeStatus(),
        recordView()
      ]);
      setLoading(false);
    };

    if (postId) {
      initializeData();
    }
  }, [postId]);

  return {
    stats,
    comments,
    isLiked,
    loading,
    toggleLike,
    addComment,
    shareToFacebook,
    shareToTwitter,
    shareToWhatsApp,
    copyToClipboard,
    shareViaEmail,
    refreshData: () => {
      fetchStats();
      fetchComments();
    }
  };
};
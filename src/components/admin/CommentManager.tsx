import React, { useState, useEffect } from 'react';
import { Check, X, Eye, Trash2, MessageCircle, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  approved: boolean;
  created_at: string;
  blog_posts: {
    title: string;
  };
}

const CommentManager: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');

  const fetchComments = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('blog_comments')
        .select(`
          *,
          blog_posts (
            title
          )
        `)
        .order('created_at', { ascending: false });

      if (filter === 'pending') {
        query = query.eq('approved', false);
      } else if (filter === 'approved') {
        query = query.eq('approved', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveComment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_comments')
        .update({ approved: true })
        .eq('id', id);

      if (error) throw error;
      await fetchComments();
    } catch (error) {
      console.error('Error approving comment:', error);
    }
  };

  const rejectComment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_comments')
        .update({ approved: false })
        .eq('id', id);

      if (error) throw error;
      await fetchComments();
    } catch (error) {
      console.error('Error rejecting comment:', error);
    }
  };

  const deleteComment = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [filter]);

  if (loading) {
    return <div className="text-center py-8">Loading comments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Comment Management</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'pending'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'approved'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="text-gray-400 mx-auto mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No comments found</h3>
          <p className="text-gray-500">
            {filter === 'pending' ? 'No pending comments to review.' : 'No comments match your filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`bg-white rounded-2xl shadow-sm p-6 border-l-4 ${
                comment.approved ? 'border-green-500' : 'border-orange-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {comment.author_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark">{comment.author_name}</h3>
                      <p className="text-sm text-gray-600">{comment.author_email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {comment.approved ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          Approved
                        </span>
                      ) : (
                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                          <Clock size={12} />
                          <span>Pending</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      On: <span className="font-medium">{comment.blog_posts?.title}</span>
                    </p>
                    <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                  </div>

                  <div className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {!comment.approved ? (
                    <button
                      onClick={() => approveComment(comment.id)}
                      className="bg-green-50 text-green-600 p-2 rounded-lg hover:bg-green-100 transition-colors"
                      title="Approve Comment"
                    >
                      <Check size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => rejectComment(comment.id)}
                      className="bg-orange-50 text-orange-600 p-2 rounded-lg hover:bg-orange-100 transition-colors"
                      title="Unapprove Comment"
                    >
                      <X size={16} />
                    </button>
                  )}
                  
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors"
                    title="Delete Comment"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentManager;
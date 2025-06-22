import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Eye, Facebook, Twitter, Copy, Mail, Send } from 'lucide-react';
import { useBlogInteractions } from '../hooks/useBlogInteractions';

interface BlogInteractionsProps {
  postId: string;
  postTitle: string;
  postUrl: string;
}

const BlogInteractions: React.FC<BlogInteractionsProps> = ({ postId, postTitle, postUrl }) => {
  const {
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
    shareViaEmail
  } = useBlogInteractions(postId);

  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [commentForm, setCommentForm] = useState({
    name: '',
    email: '',
    content: ''
  });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingComment(true);

    const result = await addComment(commentForm.name, commentForm.email, commentForm.content);
    
    if (result.success) {
      setCommentForm({ name: '', email: '', content: '' });
      setShowCommentForm(false);
      alert('Comment submitted successfully! It will be visible after approval.');
    } else {
      alert('Failed to submit comment. Please try again.');
    }
    
    setSubmittingComment(false);
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(postUrl);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Interaction Stats & Buttons */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Eye size={16} />
              <span>{stats.views_count} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart size={16} />
              <span>{stats.likes_count} likes</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle size={16} />
              <span>{stats.comments_count} comments</span>
            </div>
            <div className="flex items-center space-x-1">
              <Share2 size={16} />
              <span>{stats.shares_count} shares</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isLiked
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
              <span>{isLiked ? 'Liked' : 'Like'}</span>
            </button>

            <button
              onClick={() => setShowCommentForm(!showCommentForm)}
              className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <MessageCircle size={18} />
              <span>Comment</span>
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center space-x-2 bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Share2 size={18} />
              <span>Share</span>
            </button>

            {showShareMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border p-2 z-10 min-w-48">
                <button
                  onClick={() => {
                    shareToFacebook(postUrl, postTitle);
                    setShowShareMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Facebook size={16} className="text-blue-600" />
                  <span>Facebook</span>
                </button>
                <button
                  onClick={() => {
                    shareToTwitter(postUrl, postTitle);
                    setShowShareMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Twitter size={16} className="text-blue-400" />
                  <span>Twitter</span>
                </button>
                <button
                  onClick={() => {
                    shareToWhatsApp(postUrl, postTitle);
                    setShowShareMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <MessageCircle size={16} className="text-green-600" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => {
                    shareViaEmail(postUrl, postTitle);
                    setShowShareMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Mail size={16} className="text-gray-600" />
                  <span>Email</span>
                </button>
                <button
                  onClick={() => {
                    handleCopyLink();
                    setShowShareMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Copy size={16} className="text-gray-600" />
                  <span>{copySuccess ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-dark mb-4">Leave a Comment</h3>
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                value={commentForm.name}
                onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={commentForm.email}
                onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <textarea
              placeholder="Write your comment..."
              value={commentForm.content}
              onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={4}
              required
            />
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Your comment will be reviewed before being published.
              </p>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCommentForm(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <Send size={16} />
                  <span>{submittingComment ? 'Submitting...' : 'Submit Comment'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-dark mb-6">
            Comments ({stats.comments_count})
          </h3>
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {comment.author_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-dark">{comment.author_name}</h4>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                    
                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 ml-6 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start space-x-3">
                            <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 font-semibold text-sm">
                                {reply.author_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h5 className="font-medium text-dark text-sm">{reply.author_name}</h5>
                                <span className="text-xs text-gray-500">
                                  {new Date(reply.created_at).toLocaleDateString('id-ID')}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {comments.length === 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <MessageCircle className="text-gray-400 mx-auto mb-3" size={48} />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No comments yet</h3>
          <p className="text-gray-500">Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
};

export default BlogInteractions;
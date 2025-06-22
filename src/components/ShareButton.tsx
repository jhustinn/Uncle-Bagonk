import React, { useState } from 'react';
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  MessageCircle, 
  Copy, 
  Check,
  Mail,
  X
} from 'lucide-react';

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  className?: string;
  variant?: 'button' | 'icon' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
}

const ShareButton: React.FC<ShareButtonProps> = ({
  url,
  title,
  description = '',
  image = '',
  className = '',
  variant = 'button',
  size = 'md'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareOptions = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'bg-blue-700 hover:bg-blue-800'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: fullUrl
        });
        setIsOpen(false);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleSocialShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const sizeClasses = {
    sm: 'p-2 text-sm',
    md: 'p-3 text-base',
    lg: 'p-4 text-lg'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  if (variant === 'minimal') {
    return (
      <div className="relative">
        <button
          onClick={handleNativeShare}
          className={`text-gray-500 hover:text-primary transition-colors ${className}`}
          title="Share"
        >
          <Share2 size={iconSizes[size]} />
        </button>
        
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50 min-w-[280px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Share this content</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-3">
              {shareOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.name}
                    onClick={() => handleSocialShare(option.url)}
                    className={`${option.color} text-white p-3 rounded-lg transition-colors flex flex-col items-center space-y-1`}
                    title={`Share on ${option.name}`}
                  >
                    <Icon size={20} />
                    <span className="text-xs">{option.name}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="border-t pt-3">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <div className="relative">
        <button
          onClick={handleNativeShare}
          className={`${sizeClasses[size]} bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors ${className}`}
          title="Share"
        >
          <Share2 size={iconSizes[size]} />
        </button>
        
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50 min-w-[280px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Share this content</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-3">
              {shareOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.name}
                    onClick={() => handleSocialShare(option.url)}
                    className={`${option.color} text-white p-3 rounded-lg transition-colors flex flex-col items-center space-y-1`}
                    title={`Share on ${option.name}`}
                  >
                    <Icon size={20} />
                    <span className="text-xs">{option.name}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="border-t pt-3">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className={`${sizeClasses[size]} bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors flex items-center space-x-2 ${className}`}
      >
        <Share2 size={iconSizes[size]} />
        <span>Share</span>
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50 min-w-[320px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Share this content</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {shareOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.name}
                    onClick={() => handleSocialShare(option.url)}
                    className={`${option.color} text-white p-3 rounded-lg transition-colors flex items-center space-x-2`}
                    title={`Share on ${option.name}`}
                  >
                    <Icon size={18} />
                    <span className="text-sm">{option.name}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="border-t pt-3">
              <div className="bg-gray-50 rounded-lg p-3 mb-2">
                <p className="text-xs text-gray-600 mb-1">Share URL:</p>
                <p className="text-sm text-gray-800 break-all">{fullUrl}</p>
              </div>
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
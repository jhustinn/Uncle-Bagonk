import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from './LoginForm';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import MenuManager from './MenuManager';
import PromoManager from './PromoManager';
import PromoClaimsManager from './PromoClaimsManager';
import BlogManager from './BlogManager';
import CommentManager from './CommentManager';

const AdminApp: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'menu':
        return <MenuManager />;
      case 'promos':
        return <PromoManager />;
      case 'blog':
        return <BlogManager />;
      case 'comments':
        return <CommentManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AdminLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </AdminLayout>
  );
};

export default AdminApp;
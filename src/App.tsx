import React from 'react';
import { useAuth } from './hooks/useAuth';
import Header from './components/Header';
import Hero from './components/Hero';
import MenuHighlight from './components/MenuHighlight';
import About from './components/About';
import Promo from './components/Promo';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminApp from './components/admin/AdminApp';
import AllMenu from './components/AllMenu';
import MenuDetail from './components/MenuDetail';
import AllPromos from './components/AllPromos';
import PromoDetail from './components/PromoDetail';
import AllBlog from './components/AllBlog';
import BlogDetail from './components/BlogDetail';
import MyPromoClaims from './components/MyPromoClaims';
import { MenuItem, Promo as PromoType, BlogPost } from './types';

type ViewType = 'home' | 'admin' | 'all-menu' | 'menu-detail' | 'all-promos' | 'promo-detail' | 'all-blog' | 'blog-detail' | 'my-promo-claims';

function App() {
  const [currentView, setCurrentView] = React.useState<ViewType>('home');
  const [selectedMenuItem, setSelectedMenuItem] = React.useState<MenuItem | null>(null);
  const [selectedPromo, setSelectedPromo] = React.useState<PromoType | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = React.useState<BlogPost | null>(null);

  // Check if current URL is admin route
  React.useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin' || path.startsWith('/admin/')) {
      setCurrentView('admin');
    } else if (path === '/my-promo-claims') {
      setCurrentView('my-promo-claims');
    }
  }, []);

  // Handle admin route navigation
  React.useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin' || path.startsWith('/admin/')) {
        setCurrentView('admin');
      } else if (path === '/my-promo-claims') {
        setCurrentView('my-promo-claims');
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleViewAllMenu = () => {
    setCurrentView('all-menu');
  };

  const handleViewMenuDetail = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setCurrentView('menu-detail');
  };

  const handleViewAllPromos = () => {
    setCurrentView('all-promos');
  };

  const handleViewPromoDetail = (promo: PromoType) => {
    setSelectedPromo(promo);
    setCurrentView('promo-detail');
  };

  const handleViewAllBlog = () => {
    setCurrentView('all-blog');
  };

  const handleViewBlogDetail = (post: BlogPost) => {
    setSelectedBlogPost(post);
    setCurrentView('blog-detail');
  };

  const handleViewMyPromoClaims = () => {
    window.history.pushState({}, '', '/my-promo-claims');
    setCurrentView('my-promo-claims');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedMenuItem(null);
    setSelectedPromo(null);
    setSelectedBlogPost(null);
    window.history.pushState({}, '', '/');
  };

  const handleBackToAllMenu = () => {
    setCurrentView('all-menu');
    setSelectedMenuItem(null);
  };

  const handleBackToAllPromos = () => {
    setCurrentView('all-promos');
    setSelectedPromo(null);
  };

  const handleBackToAllBlog = () => {
    setCurrentView('all-blog');
    setSelectedBlogPost(null);
  };

  if (currentView === 'admin') {
    return <AdminApp />;
  }

  if (currentView === 'my-promo-claims') {
    return <MyPromoClaims />;
  }

  if (currentView === 'all-menu') {
    return <AllMenu onBack={handleBackToHome} onViewDetail={handleViewMenuDetail} />;
  }

  if (currentView === 'menu-detail' && selectedMenuItem) {
    return <MenuDetail item={selectedMenuItem} onBack={handleBackToAllMenu} />;
  }

  if (currentView === 'all-promos') {
    return <AllPromos onBack={handleBackToHome} onViewDetail={handleViewPromoDetail} />;
  }

  if (currentView === 'promo-detail' && selectedPromo) {
    return <PromoDetail promo={selectedPromo} onBack={handleBackToAllPromos} />;
  }

  if (currentView === 'all-blog') {
    return <AllBlog onBack={handleBackToHome} onViewDetail={handleViewBlogDetail} />;
  }

  if (currentView === 'blog-detail' && selectedBlogPost) {
    return <BlogDetail post={selectedBlogPost} onBack={handleBackToAllBlog} />;
  }

  return (
    <div className="min-h-screen">
      <Header onViewMyPromoClaims={handleViewMyPromoClaims} />
      <Hero />
      <MenuHighlight onViewAllMenu={handleViewAllMenu} onViewMenuDetail={handleViewMenuDetail} />
      <About />
      <Promo onViewAllPromos={handleViewAllPromos} onViewPromoDetail={handleViewPromoDetail} />
      <Blog onViewAllBlog={handleViewAllBlog} onViewBlogDetail={handleViewBlogDetail} />
      <Contact />
      <Footer />
      
      {/* Admin access button - hidden in production */}
      <button
        onClick={() => {
          window.history.pushState({}, '', '/admin');
          setCurrentView('admin');
        }}
        className="fixed bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors z-50"
        title="Admin Access"
      >
        🔧
      </button>
    </div>
  );
}

export default App;
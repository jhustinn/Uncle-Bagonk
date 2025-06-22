import React from 'react';
import { Coffee, Tag, BookOpen, TrendingUp } from 'lucide-react';
import { useAdminMenu } from '../../hooks/useAdminMenu';
import { useAdminPromos } from '../../hooks/useAdminPromos';
import { useAdminBlog } from '../../hooks/useAdminBlog';

const Dashboard: React.FC = () => {
  const { menuItems } = useAdminMenu();
  const { promos } = useAdminPromos();
  const { blogPosts } = useAdminBlog();

  const stats = [
    {
      title: 'Total Menu Items',
      value: menuItems.length,
      icon: Coffee,
      color: 'bg-orange-500',
      subtitle: `${menuItems.filter(item => item.featured).length} featured`,
    },
    {
      title: 'Active Promos',
      value: promos.filter(promo => promo.active).length,
      icon: Tag,
      color: 'bg-pink-500',
      subtitle: `${promos.length} total promos`,
    },
    {
      title: 'Blog Posts',
      value: blogPosts.length,
      icon: BookOpen,
      color: 'bg-indigo-500',
      subtitle: `${blogPosts.filter(post => post.published).length} published`,
    },
    {
      title: 'Featured Content',
      value: menuItems.filter(item => item.featured).length + blogPosts.filter(post => post.featured).length,
      icon: TrendingUp,
      color: 'bg-green-500',
      subtitle: 'Total featured items',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Welcome to Uncle Bagonk Admin</h2>
        <p className="text-primary-100">Manage your coffee shop content and keep everything up to date.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Menu Items */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Menu Items</h3>
          <div className="space-y-3">
            {menuItems.filter(item => item.featured).slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">Rp {item.price.toLocaleString('id-ID')}</p>
                </div>
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  Featured
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Blog Posts</h3>
          <div className="space-y-4">
            {blogPosts.slice(0, 4).map((post) => (
              <div key={post.id} className="border-l-4 border-primary pl-4">
                <p className="font-medium text-gray-900">{post.title}</p>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">{post.excerpt}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    post.published ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  {post.featured && (
                    <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Promos */}
      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Promotions</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {promos.filter(promo => promo.active).slice(0, 4).map((promo) => (
            <div key={promo.id} className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900">{promo.title}</h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{promo.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                Valid until: {new Date(promo.valid_until).toLocaleDateString('id-ID')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
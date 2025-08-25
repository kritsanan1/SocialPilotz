import { useState } from 'react';
import { Settings, User, Bell, Shield, HelpCircle, LogOut, Edit } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export default function Profile() {
  const [notifications, setNotifications] = useState({
    mentions: true,
    comments: true,
    likes: false,
    followers: true,
    posts: true
  });

  const connectedAccounts = [
    { platform: 'LinkedIn', connected: true, followers: '2.4K', color: 'bg-warm-blue' },
    { platform: 'Twitter', connected: true, followers: '1.8K', color: 'bg-black' },
    { platform: 'Instagram', connected: true, followers: '3.2K', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { platform: 'Facebook', connected: false, followers: '0', color: 'bg-blue-600' },
    { platform: 'TikTok', connected: false, followers: '0', color: 'bg-black' }
  ];

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Edit Profile', action: 'edit-profile' },
        { icon: Shield, label: 'Privacy & Security', action: 'privacy' },
        { icon: Bell, label: 'Notifications', action: 'notifications' }
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', action: 'help' },
        { icon: Settings, label: 'Settings', action: 'settings' }
      ]
    }
  ];

  return (
    <Layout>
      <div className="px-4 py-4">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
              alt="Profile" 
              className="w-16 h-16 rounded-xl object-cover"
              data-testid="img-profile-avatar"
            />
            <div className="flex-1">
              <h1 className="text-xl font-bold text-neutral-900" data-testid="text-profile-name">
                John Doe
              </h1>
              <p className="text-neutral-600" data-testid="text-profile-title">
                Social Media Manager
              </p>
              <p className="text-sm text-neutral-500" data-testid="text-profile-email">
                john.doe@example.com
              </p>
            </div>
            <Button variant="outline" size="sm" data-testid="button-edit-profile">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-200">
            <div className="text-center">
              <div className="text-lg font-bold text-neutral-900" data-testid="text-total-posts">
                247
              </div>
              <div className="text-sm text-neutral-600">Total Posts</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-neutral-900" data-testid="text-total-followers">
                7.4K
              </div>
              <div className="text-sm text-neutral-600">Total Followers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-neutral-900" data-testid="text-avg-engagement">
                8.7%
              </div>
              <div className="text-sm text-neutral-600">Avg. Engagement</div>
            </div>
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4 mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Connected Accounts</h2>
          <div className="space-y-3">
            {connectedAccounts.map((account, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg"
                data-testid={`account-${account.platform.toLowerCase()}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${account.color} rounded-lg flex items-center justify-center`}>
                    <span className="text-white font-medium text-sm">
                      {account.platform.substring(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-neutral-900">{account.platform}</div>
                    <div className="text-sm text-neutral-500">
                      {account.connected ? `${account.followers} followers` : 'Not connected'}
                    </div>
                  </div>
                </div>
                <Button 
                  variant={account.connected ? "outline" : "default"}
                  size="sm"
                  className={account.connected ? "" : "bg-warm-blue hover:bg-blue-600"}
                  data-testid={`button-${account.connected ? 'disconnect' : 'connect'}-${account.platform.toLowerCase()}`}
                >
                  {account.connected ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4 mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div 
                key={key}
                className="flex items-center justify-between"
                data-testid={`notification-${key}`}
              >
                <div>
                  <div className="font-medium text-neutral-900 capitalize">
                    {key === 'posts' ? 'Post Reminders' : key}
                  </div>
                  <div className="text-sm text-neutral-500">
                    {key === 'mentions' && 'Get notified when someone mentions you'}
                    {key === 'comments' && 'Get notified about new comments on your posts'}
                    {key === 'likes' && 'Get notified when someone likes your posts'}
                    {key === 'followers' && 'Get notified about new followers'}
                    {key === 'posts' && 'Get reminded about scheduled posts'}
                  </div>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, [key]: checked }))
                  }
                  data-testid={`switch-notification-${key}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <div 
            key={sectionIndex}
            className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4 mb-6"
          >
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">{section.title}</h2>
            <div className="space-y-2">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIndex}
                    className="w-full flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg transition-colors text-left"
                    data-testid={`button-${item.action}`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-neutral-600" />
                      <span className="font-medium text-neutral-900">{item.label}</span>
                    </div>
                    <span className="text-neutral-400">›</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Sign Out */}
        <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4">
          <button 
            className="w-full flex items-center justify-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            data-testid="button-sign-out"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}

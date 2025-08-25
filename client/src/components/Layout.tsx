import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home, 
  Calendar, 
  BarChart3, 
  MessageSquare, 
  User, 
  Bell, 
  Zap,
  Plus,
  Settings
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [notifications] = useState(3);

  const isActive = (path: string) => location === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/inbox', icon: MessageSquare, label: 'Inbox' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Top Navigation */}
      <header className="bg-white shadow-soft border-b border-neutral-200 sticky top-0 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900">SociaLink</h1>
                <p className="text-xs text-neutral-500">Content Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                className="relative p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
                data-testid="button-notifications"
              >
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              <button 
                className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
                data-testid="button-settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                alt="Profile" 
                className="w-9 h-9 rounded-xl object-cover border-2 border-neutral-200"
                data-testid="img-profile"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-4 py-3 z-40">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link key={item.path} href={item.path}>
                <button 
                  className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
                    active ? 'text-warm-blue' : 'text-neutral-600 hover:text-warm-blue'
                  }`}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  <div className="relative">
                    <Icon className="w-5 h-5" />
                    {item.label === 'Inbox' && notifications > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-muted-rose text-white text-xs rounded-full flex items-center justify-center">
                        {notifications}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Floating Action Button */}
      <button 
        className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-30 hover:scale-105"
        data-testid="button-quick-post"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}

import type { UpcomingPost } from '@/types';

export default function CalendarPreview() {
  const upcomingPosts: UpcomingPost[] = [
    {
      id: '1',
      content: 'Weekly industry insights: How AI is transforming customer engagement strategies...',
      scheduledTime: 'Today, 3:00 PM',
      platforms: [
        { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', color: 'bg-warm-blue', selected: true },
        { id: 'twitter', name: 'Twitter', icon: 'twitter', color: 'bg-black', selected: true }
      ],
      status: 'scheduled'
    },
    {
      id: '2',
      content: 'New product feature reveal: Enhanced analytics dashboard with real-time insights 📊',
      scheduledTime: 'Tomorrow, 10:00 AM',
      platforms: [
        { id: 'instagram', name: 'Instagram', icon: 'instagram', color: 'bg-gradient-to-r from-purple-500 to-pink-500', selected: true }
      ],
      status: 'scheduled'
    },
    {
      id: '3',
      content: 'Week in review: Top performing content and key insights from our community',
      scheduledTime: 'Friday, 2:30 PM',
      platforms: [
        { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', color: 'bg-warm-blue', selected: true },
        { id: 'facebook', name: 'Facebook', icon: 'facebook', color: 'bg-blue-600', selected: true }
      ],
      status: 'scheduled'
    }
  ];

  const getStatusColor = (time: string) => {
    if (time.includes('Today')) return 'bg-blue-500';
    if (time.includes('Tomorrow')) return 'bg-emerald-500';
    return 'bg-purple-500';
  };

  return (
    <div className="mt-8 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">Upcoming Posts</h2>
        <button 
          className="text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
          data-testid="button-calendar-view"
        >
          Calendar View
        </button>
      </div>

      <div className="space-y-3">
        {upcomingPosts.map((post) => (
          <div 
            key={post.id}
            className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4"
            data-testid={`card-upcoming-post-${post.id}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 ${getStatusColor(post.scheduledTime)} rounded-full`} />
                <span 
                  className="text-sm font-medium text-neutral-900"
                  data-testid={`text-scheduled-time-${post.id}`}
                >
                  {post.scheduledTime}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                {post.platforms.map((platform) => (
                  <div 
                    key={platform.id}
                    className={`w-5 h-5 ${platform.color} rounded-md flex items-center justify-center`}
                    data-testid={`platform-icon-${platform.id}-${post.id}`}
                  >
                    <span className="text-white text-xs font-medium">
                      {platform.name.substring(0, 1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p 
              className="text-sm text-neutral-700"
              data-testid={`text-post-content-${post.id}`}
            >
              {post.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

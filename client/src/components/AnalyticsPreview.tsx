import { Clock } from 'lucide-react';
import type { AnalyticsData } from '@/types';

export default function AnalyticsPreview() {
  const analytics: AnalyticsData = {
    totalReach: '47.2K',
    reachChange: '↗ 18.5%',
    engagement: '12.8%',
    engagementChange: '↗ 3.2%',
    impressions: '47.2K',
    impressionsChange: '↗ 18.5%',
    engagementRate: '12.8%',
    engagementRateChange: '↗ 3.2%',
    bestTimeToPost: '2:00 PM - 4:00 PM',
    bestDaysToPost: 'Tuesday & Thursday show highest engagement'
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">Analytics Insights</h2>
        <button 
          className="text-sm text-warm-blue font-medium hover:text-blue-600 transition-colors"
          data-testid="button-full-report"
        >
          Full Report
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center" data-testid="analytics-impressions">
            <div className="text-2xl font-bold text-neutral-900 mb-1" data-testid="text-impressions-value">
              {analytics.impressions}
            </div>
            <div className="text-sm text-neutral-600">Impressions</div>
            <div className="text-xs text-emerald-500 font-medium" data-testid="text-impressions-change">
              {analytics.impressionsChange}
            </div>
          </div>
          <div className="text-center" data-testid="analytics-engagement-rate">
            <div className="text-2xl font-bold text-neutral-900 mb-1" data-testid="text-engagement-rate-value">
              {analytics.engagementRate}
            </div>
            <div className="text-sm text-neutral-600">Engagement Rate</div>
            <div className="text-xs text-emerald-500 font-medium" data-testid="text-engagement-rate-change">
              {analytics.engagementRateChange}
            </div>
          </div>
        </div>

        {/* Best Performing Time */}
        <div className="border-t border-neutral-200 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-700">Best Time to Post</span>
            <Clock className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="text-warm-blue font-semibold" data-testid="text-best-time">
            {analytics.bestTimeToPost}
          </div>
          <div className="text-xs text-neutral-500" data-testid="text-best-days">
            {analytics.bestDaysToPost}
          </div>
        </div>
      </div>
    </div>
  );
}

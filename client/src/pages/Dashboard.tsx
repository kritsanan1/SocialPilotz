import Layout from '@/components/Layout';
import StatsOverview from '@/components/StatsOverview';
import PostComposer from '@/components/PostComposer';
import ActivityFeed from '@/components/ActivityFeed';
import AnalyticsPreview from '@/components/AnalyticsPreview';
import CalendarPreview from '@/components/CalendarPreview';

export default function Dashboard() {
  return (
    <Layout>
      <div className="px-4 py-4">
        <StatsOverview />
        <PostComposer />
        <ActivityFeed />
        <AnalyticsPreview />
        <CalendarPreview />
      </div>
    </Layout>
  );
}

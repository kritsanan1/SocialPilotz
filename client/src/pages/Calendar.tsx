import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const days = getDaysInMonth();
  const isCurrentMonth = (date: Date) => date.getMonth() === currentDate.getMonth();
  const isToday = (date: Date) => date.toDateString() === new Date().toDateString();

  return (
    <Layout>
      <div className="px-4 py-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Content Calendar</h1>
            <p className="text-neutral-600">Plan and schedule your social media posts</p>
          </div>
          <Button 
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
            data-testid="button-new-post"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>

        {/* Calendar Navigation */}
        <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                data-testid="button-prev-month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                data-testid="button-next-month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {daysOfWeek.map((day) => (
              <div key={day} className="p-3 text-center text-sm font-medium text-neutral-500">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {days.map((day, index) => (
              <div
                key={index}
                className={`min-h-[80px] p-2 border border-neutral-100 transition-all duration-200 ${
                  isCurrentMonth(day) ? 'bg-white' : 'bg-neutral-50'
                } hover:bg-neutral-50 cursor-pointer`}
                data-testid={`calendar-day-${day.getDate()}`}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isToday(day)
                    ? 'w-6 h-6 bg-warm-blue text-white rounded-full flex items-center justify-center text-xs'
                    : isCurrentMonth(day)
                      ? 'text-neutral-900'
                      : 'text-neutral-400'
                }`}>
                  {day.getDate()}
                </div>

                {/* Sample scheduled posts */}
                {day.getDate() % 7 === 0 && isCurrentMonth(day) && (
                  <div className="bg-warm-blue/10 text-warm-blue p-1 rounded-lg text-xs mb-1 border border-warm-blue/20">
                    <div className="font-medium">LinkedIn Post</div>
                    <div className="text-warm-blue/70">2:00 PM</div>
                  </div>
                )}
                {day.getDate() % 5 === 0 && isCurrentMonth(day) && (
                  <div className="bg-sage/10 text-sage p-1 rounded-lg text-xs border border-sage/20">
                    <div className="font-medium">Instagram</div>
                    <div className="text-sage/70">4:00 PM</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Posts List */}
        <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Upcoming This Week</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
              <div>
                <div className="font-medium text-neutral-900">Industry insights post</div>
                <div className="text-sm text-neutral-600">Today at 3:00 PM • LinkedIn, Twitter</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warm-blue rounded-full" />
                <span className="text-sm text-neutral-500">Scheduled</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
              <div>
                <div className="font-medium text-neutral-900">Product feature announcement</div>
                <div className="text-sm text-neutral-600">Tomorrow at 10:00 AM • Instagram</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-sage rounded-full" />
                <span className="text-sm text-neutral-500">Scheduled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

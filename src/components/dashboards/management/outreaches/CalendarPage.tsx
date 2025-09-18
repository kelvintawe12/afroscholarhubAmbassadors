import React, { useState } from 'react';
import { CalendarIcon, PlusIcon, FilterIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

export const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock events data
  const events = [
    {
      id: 1,
      title: 'School Visit - Lagos Model School',
      date: '2024-01-15',
      time: '10:00 AM',
      type: 'visit',
      ambassador: 'John Kimani',
      status: 'scheduled'
    },
    {
      id: 2,
      title: 'Partnership Meeting - Abuja Academy',
      date: '2024-01-18',
      time: '2:00 PM',
      type: 'meeting',
      ambassador: 'Aisha Mohammed',
      status: 'confirmed'
    },
    {
      id: 3,
      title: 'Workshop - Nairobi Tech Hub',
      date: '2024-01-22',
      time: '9:00 AM',
      type: 'workshop',
      ambassador: 'Grace Mensah',
      status: 'scheduled'
    }
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return events.filter(event => event.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Outreach Calendar</h1>
          <p className="text-sm text-gray-500">Manage and track all outreach activities</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FilterIcon size={16} className="mr-2" />
            Filter
          </button>
          <button className="flex items-center rounded-md bg-ash-teal px-4 py-2 text-sm font-medium text-white hover:bg-ash-teal/90">
            <PlusIcon size={16} className="mr-2" />
            Add Event
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow">
        <button
          onClick={() => navigateMonth('prev')}
          className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <ChevronLeftIcon size={20} />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={() => navigateMonth('next')}
          className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <ChevronRightIcon size={20} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-lg bg-white p-6 shadow">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-px mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-px">
          {days.map((date, index) => {
            const dayEvents = date ? getEventsForDate(date) : [];
            const isToday = date && formatDate(date) === formatDate(new Date());
            const isSelected = date && formatDate(date) === formatDate(selectedDate);

            return (
              <div
                key={index}
                className={`min-h-[120px] border border-gray-200 p-2 ${
                  isSelected ? 'bg-ash-teal/10 border-ash-teal' : 'bg-white'
                } ${isToday ? 'bg-ash-gold/10' : ''}`}
                onClick={() => date && setSelectedDate(date)}
              >
                {date && (
                  <>
                    <div className={`text-sm font-medium ${
                      isToday ? 'text-ash-gold' : isSelected ? 'text-ash-teal' : 'text-gray-900'
                    }`}>
                      {date.getDate()}
                    </div>
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded truncate ${
                            event.type === 'visit' ? 'bg-blue-100 text-blue-800' :
                            event.type === 'meeting' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Events List */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Events for {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </h3>
        <div className="space-y-3">
          {getEventsForDate(selectedDate).length > 0 ? (
            getEventsForDate(selectedDate).map(event => (
              <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    event.type === 'visit' ? 'bg-blue-100' :
                    event.type === 'meeting' ? 'bg-green-100' :
                    'bg-purple-100'
                  }`}>
                    <CalendarIcon size={16} className={
                      event.type === 'visit' ? 'text-blue-600' :
                      event.type === 'meeting' ? 'text-green-600' :
                      'text-purple-600'
                    } />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-500">
                      {event.time} • {event.ambassador}
                    </p>
                  </div>
                </div>
                <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                  event.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {event.status}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No events scheduled for this date</p>
          )}
        </div>
      </div>
    </div>
  );
};

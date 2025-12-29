'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CalendarProps {
  bookings: any[];
  onBookingClick: (booking: any) => void;
}

export function Calendar({ bookings, onBookingClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getBookingsForDate = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.scheduledAt).toDateString();
      return bookingDate === dateStr;
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const days = daysInMonth(currentDate);
  const firstDay = firstDayOfMonth(currentDate);
  const calendarDays = [];

  // Empty cells for days before the first day of month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Days of the month
  for (let day = 1; day <= days; day++) {
    calendarDays.push(day);
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending_payment: 'bg-yellow-500',
      confirmed: 'bg-blue-500',
      completed: 'bg-green-500',
      cancelled: 'bg-red-500',
      reschedule_requested: 'bg-purple-500',
      no_show: 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <Card>
      <CardContent className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Hari Ini
            </Button>
            <Button variant="outline" size="sm" onClick={previousMonth}>
              ←
            </Button>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              →
            </Button>
          </div>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center font-semibold text-sm text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dayBookings = getBookingsForDate(day);
            const today = isToday(day);

            return (
              <div
                key={day}
                className={`min-h-[120px] border rounded-lg p-2 hover:bg-gray-50 transition cursor-pointer ${
                  today ? 'border-primary-500 border-2 bg-primary-50' : 'border-gray-200'
                }`}
              >
                <div className="h-full flex flex-col">
                  <div className={`text-sm font-semibold mb-1 ${today ? 'text-primary-600' : 'text-gray-700'}`}>
                    {day}
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-1">
                    {dayBookings.slice(0, 3).map((booking) => (
                      <div
                        key={booking.id}
                        onClick={() => onBookingClick(booking)}
                        className={`text-xs p-1.5 rounded text-white cursor-pointer ${getStatusColor(booking.status)} hover:opacity-80 transition-opacity`}
                        title={`${new Date(booking.scheduledAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - ${booking.subject.name}\nGuru: ${booking.tutor.user.fullName}\nDurasi: ${booking.duration} jam`}
                      >
                        <div className="font-semibold">
                          {new Date(booking.scheduledAt).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <div className="truncate text-[10px] opacity-90">
                          {booking.subject.name}
                        </div>
                        <div className="truncate text-[10px] opacity-75">
                          {booking.tutor.user.fullName}
                        </div>
                      </div>
                    ))}
                    {dayBookings.length > 3 && (
                      <div className="text-xs text-gray-500 font-semibold">
                        +{dayBookings.length - 3} lagi
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm font-semibold mb-3">Status Booking:</p>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-500"></div>
              <span>Pending Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span>Terkonfirmasi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span>Selesai</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span>Dibatalkan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-500"></div>
              <span>Reschedule</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

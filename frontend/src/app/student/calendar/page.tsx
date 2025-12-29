'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { bookingsApi } from '@/lib/api';

export default function StudentCalendarPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsApi.getAll();
      setBookings(response.data.data.filter((b: any) => 
        b.status === 'confirmed' || b.status === 'pending'
      ));
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const getBookingsForDate = (date: Date) => {
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.scheduledAt);
      return (
        bookingDate.getDate() === date.getDate() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const weekDays = getWeekDays(selectedDate);
  const upcomingBookings = bookings
    .filter((b) => new Date(b.scheduledAt) >= new Date())
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Kalender Kelas</h1>
            <p className="text-gray-600">Jadwal kelas dan booking Anda</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar View */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      {selectedDate.toLocaleDateString('id-ID', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newDate = new Date(selectedDate);
                          newDate.setDate(newDate.getDate() - 7);
                          setSelectedDate(newDate);
                        }}
                      >
                        ← Minggu Lalu
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedDate(new Date())}
                      >
                        Hari Ini
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newDate = new Date(selectedDate);
                          newDate.setDate(newDate.getDate() + 7);
                          setSelectedDate(newDate);
                        }}
                      >
                        Minggu Depan →
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Week View */}
                  <div className="grid grid-cols-7 gap-2">
                    {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                      <div
                        key={day}
                        className="text-center font-semibold text-sm text-gray-600 py-2"
                      >
                        {day}
                      </div>
                    ))}

                    {weekDays.map((day, index) => {
                      const dayBookings = getBookingsForDate(day);
                      const isToday =
                        day.toDateString() === new Date().toDateString();

                      return (
                        <div
                          key={index}
                          className={`min-h-[120px] border rounded-lg p-2 ${
                            isToday
                              ? 'bg-primary-50 border-primary-300'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <div
                            className={`text-sm font-medium mb-2 ${
                              isToday ? 'text-primary-700' : 'text-gray-700'
                            }`}
                          >
                            {day.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayBookings.map((booking) => (
                              <Link
                                key={booking.id}
                                href={`/bookings/${booking.id}`}
                              >
                                <div
                                  className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${
                                    booking.status === 'confirmed'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-yellow-100 text-yellow-700'
                                  }`}
                                >
                                  <div className="font-medium truncate">
                                    {new Date(booking.scheduledAt).toLocaleTimeString(
                                      'id-ID',
                                      {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      }
                                    )}
                                  </div>
                                  <div className="truncate">
                                    {booking.tutor?.user?.fullName}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Classes */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Kelas Mendatang</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingBookings.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingBookings.map((booking) => (
                        <Link key={booking.id} href={`/bookings/${booking.id}`}>
                          <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                            <div className="flex items-start justify-between mb-2">
                              <div className="font-semibold text-sm">
                                {booking.tutor?.user?.fullName}
                              </div>
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  booking.status === 'confirmed'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {booking.status === 'confirmed'
                                  ? 'Confirmed'
                                  : 'Pending'}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 space-y-1">
                              <div>
                                📚 {booking.tutorSubject?.subject?.name}
                              </div>
                              <div>
                                📅{' '}
                                {new Date(booking.scheduledAt).toLocaleDateString(
                                  'id-ID',
                                  {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short',
                                  }
                                )}
                              </div>
                              <div>
                                🕐{' '}
                                {new Date(booking.scheduledAt).toLocaleTimeString(
                                  'id-ID',
                                  {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  }
                                )}{' '}
                                ({booking.duration} jam)
                              </div>
                              <div>
                                {booking.teachingMethod === 'online'
                                  ? '💻 Online'
                                  : '🏠 Offline'}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      Tidak ada kelas mendatang
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Total Kelas Bulan Ini
                      </span>
                      <span className="font-bold text-lg">
                        {
                          bookings.filter((b) => {
                            const bookingDate = new Date(b.scheduledAt);
                            const now = new Date();
                            return (
                              bookingDate.getMonth() === now.getMonth() &&
                              bookingDate.getFullYear() === now.getFullYear()
                            );
                          }).length
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Kelas Mendatang
                      </span>
                      <span className="font-bold text-lg text-primary-600">
                        {upcomingBookings.length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

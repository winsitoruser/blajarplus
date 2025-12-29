'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-green-100 text-green-700',
      completed: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusText = (status: string) => {
    const texts: any = {
      pending: 'Menunggu Konfirmasi',
      confirmed: 'Dikonfirmasi',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
    };
    return texts[status] || status;
  };

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

      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Selamat datang, {user?.fullName}!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-600 mb-1">Total Booking</div>
                <div className="text-3xl font-bold">{bookings.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-600 mb-1">Menunggu</div>
                <div className="text-3xl font-bold text-yellow-600">
                  {bookings.filter(b => b.status === 'pending').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-600 mb-1">Dikonfirmasi</div>
                <div className="text-3xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-600 mb-1">Selesai</div>
                <div className="text-3xl font-bold text-blue-600">
                  {bookings.filter(b => b.status === 'completed').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Aksi Cepat</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/search">
                <Card className="hover:shadow-md transition cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-2">🔍</div>
                    <div className="font-medium">Cari Tutor</div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/bookings">
                <Card className="hover:shadow-md transition cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-2">📅</div>
                    <div className="font-medium">Lihat Booking</div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/chat">
                <Card className="hover:shadow-md transition cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-2">💬</div>
                    <div className="font-medium">Pesan</div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Recent Bookings */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Booking Terbaru</h2>
              <Link href="/bookings">
                <Button variant="outline" size="sm">Lihat Semua</Button>
              </Link>
            </div>

            {bookings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold mb-2">Belum ada booking</h3>
                  <p className="text-gray-600 mb-4">
                    Mulai cari tutor dan buat booking pertama Anda
                  </p>
                  <Link href="/search">
                    <Button>Cari Tutor</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking: any) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            {user?.role === 'student' ? (
                              <span className="text-xl">
                                {booking.tutor.user.fullName.charAt(0)}
                              </span>
                            ) : (
                              <span className="text-xl">
                                {booking.student.fullName.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">
                              {user?.role === 'student' 
                                ? booking.tutor.user.fullName 
                                : booking.student.fullName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {booking.subject.name} • {booking.duration} jam
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(booking.scheduledAt).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(booking.status)}`}>
                            {getStatusText(booking.status)}
                          </span>
                          <div className="mt-2 font-semibold text-primary-500">
                            Rp {booking.totalAmount.toLocaleString('id-ID')}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

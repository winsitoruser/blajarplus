'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BannerCarousel from '@/components/BannerCarousel';
import { bookingsApi, api } from '@/lib/api';

export default function TutorDashboardPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (user.role !== 'tutor') {
      router.push('/dashboard');
      return;
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, earningsRes] = await Promise.all([
        bookingsApi.getAll(),
        api.get('/tutors/earnings/me'),
      ]);

      setBookings(bookingsRes.data.data);
      setStats(earningsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badges[status] || 'bg-gray-100 text-gray-700'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const upcomingBookings = bookings.filter(b => b.status === 'confirmed');
  const completedBookings = bookings.filter(b => b.status === 'completed');

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
          {/* Banner Carousel - Dynamic from Admin */}
          <div className="mb-8">
            <BannerCarousel userRole="tutor" />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard Tutor</h1>
            <p className="text-gray-600">Kelola booking dan lihat performa Anda</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Pending Booking</div>
                    <div className="text-3xl font-bold text-yellow-600">
                      {pendingBookings.length}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⏳</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Upcoming Classes</div>
                    <div className="text-3xl font-bold text-blue-600">
                      {upcomingBookings.length}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📅</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Total Students</div>
                    <div className="text-3xl font-bold text-primary-600">
                      {stats?.totalStudents || 0}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Total Earnings</div>
                    <div className="text-2xl font-bold text-green-600">
                      Rp {(stats?.netEarnings || 0).toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link href="/tutor/earnings">
              <Card className="hover:shadow-md transition cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center text-white text-2xl">
                    💵
                  </div>
                  <div>
                    <div className="font-semibold">Lihat Penghasilan</div>
                    <div className="text-sm text-gray-600">Detail earnings & withdrawal</div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/tutor/profile/edit">
              <Card className="hover:shadow-md transition cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white text-2xl">
                    ✏️
                  </div>
                  <div>
                    <div className="font-semibold">Edit Profile</div>
                    <div className="text-sm text-gray-600">Update info & subjects</div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/chat">
              <Card className="hover:shadow-md transition cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center text-white text-2xl">
                    💬
                  </div>
                  <div>
                    <div className="font-semibold">Messages</div>
                    <div className="text-sm text-gray-600">Chat dengan siswa</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Pending Bookings */}
          {pendingBookings.length > 0 && (
            <Card className="mb-8">
              <CardHeader className="bg-yellow-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">⚠️</span>
                  Booking Menunggu Konfirmasi ({pendingBookings.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {pendingBookings.map((booking: any) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-white border-2 border-yellow-200 rounded-lg hover:shadow-md transition"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-lg">
                          {booking.student?.fullName || 'Student'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {booking.subject?.name} • {new Date(booking.scheduledAt).toLocaleDateString('id-ID', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="text-sm font-medium text-primary-600 mt-1">
                          Rp {booking.totalAmount?.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/bookings/${booking.id}`}>
                          <Button size="sm" className="bg-primary-600 hover:bg-primary-700">
                            Lihat Detail
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Classes */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Kelas Mendatang</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.slice(0, 5).map((booking: any) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="font-semibold">{booking.student?.fullName}</div>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {booking.subject?.name} • {booking.duration} jam • {booking.teachingMethod}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
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
                      <Link href={`/bookings/${booking.id}`}>
                        <Button size="sm" variant="outline">
                          Detail
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Belum ada kelas mendatang
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Completed */}
          <Card>
            <CardHeader>
              <CardTitle>Kelas Selesai Terakhir</CardTitle>
            </CardHeader>
            <CardContent>
              {completedBookings.length > 0 ? (
                <div className="space-y-4">
                  {completedBookings.slice(0, 5).map((booking: any) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="font-semibold">{booking.student?.fullName}</div>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {booking.subject?.name} • Rp {booking.totalAmount?.toLocaleString('id-ID')}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {booking.completedAt && new Date(booking.completedAt).toLocaleDateString('id-ID', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                      <Link href={`/bookings/${booking.id}`}>
                        <Button size="sm" variant="outline">
                          Detail
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Belum ada kelas selesai
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}

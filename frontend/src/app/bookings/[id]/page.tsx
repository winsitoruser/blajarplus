'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { bookingsApi, chatApi } from '@/lib/api';

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);

    fetchBookingDetail();
  }, [params.id]);

  const fetchBookingDetail = async () => {
    try {
      const response = await bookingsApi.getById(params.id as string);
      setBooking(response.data);
    } catch (error: any) {
      setError('Booking tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!confirm('Konfirmasi booking ini?')) return;

    setActionLoading(true);
    try {
      await bookingsApi.confirm(params.id as string);
      alert('Booking berhasil dikonfirmasi!');
      fetchBookingDetail();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal konfirmasi booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!confirm('Tandai booking ini sebagai selesai?')) return;

    setActionLoading(true);
    try {
      await bookingsApi.complete(params.id as string);
      alert('Booking berhasil diselesaikan!');
      fetchBookingDetail();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyelesaikan booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    const reason = prompt('Alasan pembatalan:');
    if (!reason) return;

    setActionLoading(true);
    try {
      await bookingsApi.cancel(params.id as string, { reason });
      alert('Booking berhasil dibatalkan!');
      fetchBookingDetail();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal membatalkan booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartChat = async () => {
    try {
      const otherUserId = currentUser.role === 'tutor' 
        ? booking.student.userId 
        : booking.tutor.userId;

      const response = await chatApi.createConversation({
        participantId: otherUserId,
      });

      router.push(`/chat/${response.data.id}`);
    } catch (err: any) {
      if (err.response?.status === 400) {
        alert('Percakapan sudah ada. Redirect ke chat...');
        router.push('/chat');
      } else {
        alert('Gagal membuat percakapan');
      }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
          <Button onClick={() => router.push('/dashboard')}>Kembali ke Dashboard</Button>
        </div>
      </div>
    );
  }

  const isTutor = currentUser.role === 'tutor';
  const otherParty = isTutor ? booking.student : booking.tutor;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="mb-4"
            >
              ← Kembali
            </Button>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Detail Booking</h1>
              {getStatusBadge(booking.status)}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Booking Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Booking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Mata Pelajaran</div>
                      <div className="font-semibold">{booking.subject.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Tipe Booking</div>
                      <div className="font-semibold capitalize">{booking.bookingType}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Tanggal & Waktu</div>
                      <div className="font-semibold">
                        {new Date(booking.scheduledAt).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                        <br />
                        {new Date(booking.scheduledAt).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Durasi</div>
                      <div className="font-semibold">{booking.duration} jam</div>
                    </div>
                    {booking.bookingType === 'package' && (
                      <>
                        <div>
                          <div className="text-sm text-gray-600">Jumlah Pertemuan</div>
                          <div className="font-semibold">{booking.numberOfSessions}x</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Pertemuan Selesai</div>
                          <div className="font-semibold">{booking.completedSessions}x</div>
                        </div>
                      </>
                    )}
                    <div>
                      <div className="text-sm text-gray-600">Metode</div>
                      <div className="font-semibold capitalize">{booking.teachingMethod}</div>
                    </div>
                    {booking.teachingMethod === 'offline' && booking.location && (
                      <div>
                        <div className="text-sm text-gray-600">Lokasi</div>
                        <div className="font-semibold">{booking.location}</div>
                      </div>
                    )}
                  </div>

                  {booking.notes && (
                    <div className="pt-4 border-t">
                      <div className="text-sm text-gray-600 mb-1">Catatan</div>
                      <div className="text-gray-800">{booking.notes}</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Other Party Info */}
              <Card>
                <CardHeader>
                  <CardTitle>{isTutor ? 'Informasi Siswa' : 'Informasi Tutor'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      {otherParty.user.avatarUrl ? (
                        <img
                          src={otherParty.user.avatarUrl}
                          alt={otherParty.user.fullName}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">
                          {otherParty.user.fullName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{otherParty.user.fullName}</div>
                      <div className="text-sm text-gray-600">{otherParty.user.email}</div>
                      {otherParty.user.phone && (
                        <div className="text-sm text-gray-600">{otherParty.user.phone}</div>
                      )}
                    </div>
                    <Button onClick={handleStartChat}>
                      Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Pembayaran</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Pembayaran</span>
                    <span className="font-semibold">
                      Rp {booking.totalAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                  {booking.payment && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status Pembayaran</span>
                        <span className={`font-semibold ${
                          booking.payment.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {booking.payment.status === 'paid' ? 'Lunas' : 'Pending'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Metode Pembayaran</span>
                        <span className="font-semibold capitalize">
                          {booking.payment.paymentMethod}
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Actions Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Aksi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Pending Status - Tutor can confirm */}
                  {booking.status === 'pending' && isTutor && (
                    <>
                      <Button
                        onClick={handleConfirm}
                        disabled={actionLoading}
                        className="w-full"
                      >
                        Konfirmasi Booking
                      </Button>
                      <Button
                        onClick={handleCancel}
                        disabled={actionLoading}
                        variant="outline"
                        className="w-full"
                      >
                        Tolak Booking
                      </Button>
                    </>
                  )}

                  {/* Confirmed Status - Both can complete */}
                  {booking.status === 'confirmed' && (
                    <>
                      <Button
                        onClick={handleComplete}
                        disabled={actionLoading}
                        className="w-full"
                      >
                        Tandai Selesai
                      </Button>
                      <Button
                        onClick={handleCancel}
                        disabled={actionLoading}
                        variant="outline"
                        className="w-full"
                      >
                        Batalkan
                      </Button>
                    </>
                  )}

                  {/* Completed Status */}
                  {booking.status === 'completed' && !isTutor && (
                    <Link href={`/tutor/${booking.tutor.id}`}>
                      <Button className="w-full">
                        Tulis Review
                      </Button>
                    </Link>
                  )}

                  {/* Chat Button */}
                  <Button
                    onClick={handleStartChat}
                    variant="outline"
                    className="w-full"
                  >
                    💬 Chat
                  </Button>

                  {/* View Profile */}
                  {!isTutor && (
                    <Link href={`/tutor/${booking.tutor.id}`}>
                      <Button variant="outline" className="w-full">
                        Lihat Profile Tutor
                      </Button>
                    </Link>
                  )}

                  {/* Info Box */}
                  <div className="pt-4 border-t space-y-2 text-xs text-gray-600">
                    {booking.status === 'pending' && isTutor && (
                      <p className="flex items-center gap-2">
                        <span className="text-yellow-600">⚠️</span>
                        Konfirmasi atau tolak booking dalam 24 jam
                      </p>
                    )}
                    {booking.status === 'confirmed' && (
                      <p className="flex items-center gap-2">
                        <span className="text-blue-600">ℹ️</span>
                        Tandai selesai setelah kelas selesai
                      </p>
                    )}
                    {booking.status === 'completed' && (
                      <p className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        Booking telah selesai
                      </p>
                    )}
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

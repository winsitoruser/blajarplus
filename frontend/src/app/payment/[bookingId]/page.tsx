'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { bookingsApi, paymentsApi } from '@/lib/api';

declare global {
  interface Window {
    snap: any;
  }
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchBookingDetail();
    loadMidtransScript();
  }, [params.bookingId]);

  const loadMidtransScript = () => {
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '');
    document.body.appendChild(script);
  };

  const fetchBookingDetail = async () => {
    try {
      const response = await bookingsApi.getById(params.bookingId as string);
      setBooking(response.data);
      
      if (response.data.status !== 'pending') {
        router.push('/dashboard');
      }
    } catch (error: any) {
      setError('Booking tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    setError('');

    try {
      const response = await paymentsApi.create({
        bookingId: params.bookingId,
        paymentMethod: 'credit_card',
        callbackUrl: `${window.location.origin}/payment/callback`,
      });

      const { snapToken } = response.data;

      if (window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: function(result: any) {
            console.log('Payment success:', result);
            router.push(`/payment/success?order_id=${result.order_id}`);
          },
          onPending: function(result: any) {
            console.log('Payment pending:', result);
            router.push(`/payment/pending?order_id=${result.order_id}`);
          },
          onError: function(result: any) {
            console.log('Payment error:', result);
            router.push(`/payment/failed?order_id=${result.order_id}`);
          },
          onClose: function() {
            console.log('Payment popup closed');
            setProcessing(false);
          }
        });
      } else {
        setError('Payment gateway belum siap. Silakan refresh halaman.');
        setProcessing(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memproses pembayaran');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
          <Button onClick={() => router.push('/dashboard')}>Kembali ke Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Pembayaran</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detail Booking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      {booking?.tutor?.user?.avatarUrl ? (
                        <img
                          src={booking.tutor.user.avatarUrl}
                          alt={booking.tutor.user.fullName}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">
                          {booking?.tutor?.user?.fullName?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-lg">
                        {booking?.tutor?.user?.fullName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {booking?.subject?.name}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tanggal & Waktu</span>
                      <span className="font-medium">
                        {new Date(booking?.scheduledAt).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durasi</span>
                      <span className="font-medium">{booking?.duration} jam</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipe Booking</span>
                      <span className="font-medium capitalize">{booking?.bookingType}</span>
                    </div>
                    {booking?.bookingType === 'package' && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Jumlah Pertemuan</span>
                        <span className="font-medium">{booking?.numberOfSessions}x</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Metode</span>
                      <span className="font-medium capitalize">{booking?.teachingMethod}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Metode Pembayaran</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border-2 border-primary-500 rounded-lg bg-primary-50">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                          <span className="text-2xl">💳</span>
                        </div>
                        <div>
                          <div className="font-semibold">Midtrans Payment Gateway</div>
                          <div className="text-sm text-gray-600">
                            Credit Card, Bank Transfer, E-Wallet, dll
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex gap-3">
                        <span className="text-blue-600 text-xl">ℹ️</span>
                        <div className="text-sm text-blue-800">
                          <p className="font-semibold mb-1">Pembayaran Aman dengan Escrow</p>
                          <p>
                            Uang Anda akan disimpan dengan aman. Pembayaran hanya diteruskan ke tutor 
                            setelah kelas selesai dan Anda konfirmasi.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <span className="text-red-600 text-xl">⚠️</span>
                    <div className="text-sm text-red-800">
                      <p className="font-semibold mb-1">Terjadi Kesalahan</p>
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Ringkasan Pembayaran</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 pb-4 border-b">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Harga per jam</span>
                      <span>Rp {booking?.tutor?.hourlyRate?.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Durasi</span>
                      <span>{booking?.duration} jam</span>
                    </div>
                    {booking?.bookingType === 'package' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Jumlah pertemuan</span>
                        <span>{booking?.numberOfSessions}x</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Pembayaran</span>
                    <span className="text-primary-600">
                      Rp {booking?.totalAmount?.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <Button
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full"
                    size="lg"
                  >
                    {processing ? 'Memproses...' : 'Bayar Sekarang'}
                  </Button>

                  <div className="pt-4 border-t space-y-2 text-xs text-gray-600">
                    <p className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      Pembayaran aman dengan escrow
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      Gratis pembatalan 24 jam sebelumnya
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      Garansi uang kembali
                    </p>
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

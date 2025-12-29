'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function TutorEarningsPage() {
  const router = useRouter();
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const response = await api.get('/tutors/earnings/me');
      setEarnings(response.data);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
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

      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Penghasilan</h1>
            <p className="text-gray-600">Kelola penghasilan Anda dari mengajar</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-600 mb-2">Total Penghasilan</div>
                <div className="text-3xl font-bold text-gray-900">
                  Rp {earnings?.totalEarnings?.toLocaleString('id-ID') || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Dari {earnings?.completedBookings || 0} kelas selesai
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-600 mb-2">Penghasilan Bersih</div>
                <div className="text-3xl font-bold text-green-600">
                  Rp {earnings?.netEarnings?.toLocaleString('id-ID') || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Setelah komisi 15%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-600 mb-2">Pending</div>
                <div className="text-3xl font-bold text-yellow-600">
                  Rp {earnings?.pendingEarnings?.toLocaleString('id-ID') || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Dari kelas confirmed
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-600 mb-2">Bisa Ditarik</div>
                <div className="text-3xl font-bold text-primary-600">
                  Rp {earnings?.availableForWithdrawal?.toLocaleString('id-ID') || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Siap untuk withdrawal
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Earnings Chart */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Penghasilan Bulanan</CardTitle>
                </CardHeader>
                <CardContent>
                  {earnings?.monthlyEarnings?.length > 0 ? (
                    <div className="space-y-4">
                      {earnings.monthlyEarnings.map((item: any, index: number) => {
                        const maxAmount = Math.max(...earnings.monthlyEarnings.map((e: any) => e.amount));
                        const percentage = (item.amount / maxAmount) * 100;

                        return (
                          <div key={index}>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="font-medium">{item.month}</span>
                              <span className="text-gray-600">
                                Rp {item.amount.toLocaleString('id-ID')}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      Belum ada data penghasilan
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Payments */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Pembayaran Terakhir</CardTitle>
                </CardHeader>
                <CardContent>
                  {earnings?.recentPayments?.length > 0 ? (
                    <div className="space-y-4">
                      {earnings.recentPayments.map((payment: any) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-medium">
                              Rp {payment.amount.toLocaleString('id-ID')}
                            </div>
                            <div className="text-sm text-gray-600">
                              {new Date(payment.date).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            Paid
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      Belum ada pembayaran
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Withdrawal & Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tarik Dana</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Saldo Tersedia</div>
                    <div className="text-2xl font-bold text-primary-600">
                      Rp {earnings?.availableForWithdrawal?.toLocaleString('id-ID') || 0}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    disabled={!earnings?.availableForWithdrawal || earnings.availableForWithdrawal === 0}
                  >
                    Tarik Dana
                  </Button>

                  <div className="text-xs text-gray-500 space-y-1">
                    <p>• Minimal penarikan: Rp 50.000</p>
                    <p>• Proses 1-3 hari kerja</p>
                    <p>• Transfer ke rekening terdaftar</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistik</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Siswa</span>
                    <span className="font-bold text-lg">{earnings?.totalStudents || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Kelas Selesai</span>
                    <span className="font-bold text-lg">{earnings?.completedBookings || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Komisi Platform</span>
                    <span className="font-bold text-lg">15%</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-gray-600">Total Komisi</span>
                    <span className="font-bold text-lg text-red-600">
                      Rp {earnings?.platformCommission?.toLocaleString('id-ID') || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informasi</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 space-y-2">
                  <p>
                    <strong>Cara Kerja:</strong><br />
                    Pembayaran dari siswa akan masuk ke escrow. Setelah kelas selesai, 
                    dana akan otomatis masuk ke saldo Anda.
                  </p>
                  <p>
                    <strong>Komisi:</strong><br />
                    Platform mengambil 15% dari setiap transaksi untuk biaya operasional 
                    dan maintenance.
                  </p>
                  <p>
                    <strong>Penarikan:</strong><br />
                    Anda bisa menarik dana kapan saja dengan minimal Rp 50.000. 
                    Proses transfer 1-3 hari kerja.
                  </p>
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

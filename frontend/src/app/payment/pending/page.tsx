'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { paymentsApi } from '@/lib/api';

export default function PaymentPendingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchPaymentDetail();
    }
  }, [orderId]);

  const fetchPaymentDetail = async () => {
    try {
      const response = await paymentsApi.getByOrderId(orderId!);
      setPayment(response.data);
    } catch (error) {
      console.error('Error fetching payment:', error);
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

      <div className="flex-1 bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center py-12 px-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-6xl">⏳</span>
            </div>

            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              Pembayaran Sedang Diproses
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Pembayaran Anda sedang dalam proses verifikasi.
            </p>

            {payment && (
              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                <h3 className="font-semibold mb-4">Detail Pembayaran</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID</span>
                    <span className="font-medium">{payment.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jumlah</span>
                    <span className="font-medium">
                      Rp {payment.amount?.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                      Pending
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Metode</span>
                    <span className="font-medium capitalize">{payment.paymentMethod}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">Catatan:</span><br />
                Jika Anda menggunakan transfer bank, pembayaran akan dikonfirmasi otomatis setelah 
                kami menerima transfer Anda. Proses ini biasanya memakan waktu 1-2 jam kerja.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Lihat Dashboard
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => window.location.reload()}
              >
                Refresh Status
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t">
              <p className="text-sm text-gray-600">
                Butuh bantuan? <Link href="/contact" className="text-primary-600 hover:underline">Hubungi Support</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    subjectId: '',
    scheduledAt: '',
    duration: 2,
    bookingType: 'single',
    numberOfSessions: 1,
    teachingMethod: 'online',
    notes: '',
    location: '',
  });

  useEffect(() => {
    if (params.tutorId) {
      fetchTutorDetail();
    }
  }, [params.tutorId]);

  const fetchTutorDetail = async () => {
    try {
      const response = await api.get(`/tutors/${params.tutorId}`);
      setTutor(response.data);
      
      // Set default subject if available
      if (response.data.subjects.length > 0) {
        setFormData(prev => ({ ...prev, subjectId: response.data.subjects[0].id }));
      }
    } catch (error) {
      console.error('Error fetching tutor:', error);
      setError('Tutor tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!tutor) return 0;
    return tutor.hourlyRate * formData.duration * formData.numberOfSessions;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const bookingData = {
        tutorId: params.tutorId,
        subjectId: formData.subjectId,
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
        duration: formData.duration,
        bookingType: formData.bookingType,
        numberOfSessions: formData.numberOfSessions,
        teachingMethod: formData.teachingMethod,
        notes: formData.notes,
        location: formData.location,
      };

      const response = await api.post('/bookings', bookingData);
      
      // Redirect to payment page
      router.push(`/payment/${response.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal membuat booking. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tutor tidak ditemukan</h1>
          <Button onClick={() => router.push('/search')}>Kembali ke Pencarian</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Booking Les</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Detail Booking</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                        {error}
                      </div>
                    )}

                    {/* Subject Selection */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Mata Pelajaran *
                      </label>
                      <select
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                        value={formData.subjectId}
                        onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                        required
                      >
                        <option value="">Pilih Mata Pelajaran</option>
                        {tutor.subjects.map((subject: any) => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date & Time */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Tanggal & Waktu *
                      </label>
                      <Input
                        type="datetime-local"
                        value={formData.scheduledAt}
                        onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                        min={new Date().toISOString().slice(0, 16)}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Pilih waktu minimal 24 jam dari sekarang
                      </p>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Durasi (jam) *
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max="8"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                        required
                      />
                    </div>

                    {/* Booking Type */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Tipe Booking *
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, bookingType: 'single', numberOfSessions: 1 })}
                          className={`p-3 border-2 rounded-lg text-center transition ${
                            formData.bookingType === 'single'
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-medium">Single</div>
                          <div className="text-xs text-gray-500">1 pertemuan</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, bookingType: 'package' })}
                          className={`p-3 border-2 rounded-lg text-center transition ${
                            formData.bookingType === 'package'
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-medium">Package</div>
                          <div className="text-xs text-gray-500">Multiple pertemuan</div>
                        </button>
                      </div>
                    </div>

                    {/* Number of Sessions (if package) */}
                    {formData.bookingType === 'package' && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Jumlah Pertemuan *
                        </label>
                        <Input
                          type="number"
                          min="2"
                          max="20"
                          value={formData.numberOfSessions}
                          onChange={(e) => setFormData({ ...formData, numberOfSessions: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                    )}

                    {/* Teaching Method */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Metode Mengajar *
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {tutor.teachingMethods.includes('online') && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, teachingMethod: 'online' })}
                            className={`p-3 border-2 rounded-lg text-center transition ${
                              formData.teachingMethod === 'online'
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            💻 Online
                          </button>
                        )}
                        {tutor.teachingMethods.includes('offline') && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, teachingMethod: 'offline' })}
                            className={`p-3 border-2 rounded-lg text-center transition ${
                              formData.teachingMethod === 'offline'
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            🏠 Offline
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Location (if offline) */}
                    {formData.teachingMethod === 'offline' && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Lokasi Les
                        </label>
                        <Input
                          placeholder="Alamat lengkap untuk les offline"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                      </div>
                    )}

                    {/* Notes */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Catatan untuk Tutor (Opsional)
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={3}
                        placeholder="Contoh: Tolong fokus ke materi trigonometri"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                      {submitting ? 'Memproses...' : 'Lanjut ke Pembayaran'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Ringkasan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Tutor Info */}
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {tutor.user.avatarUrl ? (
                        <img
                          src={tutor.user.avatarUrl}
                          alt={tutor.user.fullName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xl text-gray-400">
                          {tutor.user.fullName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{tutor.user.fullName}</div>
                      <div className="text-sm text-gray-600">
                        ★ {tutor.averageRating.toFixed(1)}
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Harga per jam</span>
                      <span>Rp {tutor.hourlyRate.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durasi</span>
                      <span>{formData.duration} jam</span>
                    </div>
                    {formData.bookingType === 'package' && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Jumlah pertemuan</span>
                        <span>{formData.numberOfSessions}x</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between font-semibold text-base">
                      <span>Total</span>
                      <span className="text-primary-500">
                        Rp {calculateTotal().toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>✓ Pembayaran aman dengan escrow</p>
                      <p>✓ Gratis pembatalan 24 jam sebelumnya</p>
                      <p>✓ Garansi uang kembali</p>
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

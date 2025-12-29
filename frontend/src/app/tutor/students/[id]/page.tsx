'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';

export default function StudentProgressPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchStudentProgress();
  }, [studentId]);

  const fetchStudentProgress = async () => {
    try {
      const response = await api.get(`/tutors/students/${studentId}/progress`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching student progress:', error);
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

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Data tidak ditemukan</h2>
          <Link href="/tutor/students">
            <Button>Kembali ke Daftar Siswa</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { student, stats, bookings, progressLogs, materials } = data;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link href="/tutor/students">
              <Button variant="outline" size="sm" className="mb-4">
                ← Kembali
              </Button>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-primary-200 rounded-full flex items-center justify-center">
                {student.avatarUrl ? (
                  <img
                    src={student.avatarUrl}
                    alt={student.fullName}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-semibold text-primary-700">
                    {student.fullName.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{student.fullName}</h1>
                <p className="text-gray-600">{student.email}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-600 mb-1">Total Kelas</div>
                <div className="text-3xl font-bold text-primary-600">
                  {stats.totalBookings}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-600 mb-1">Kelas Selesai</div>
                <div className="text-3xl font-bold text-green-600">
                  {stats.completedBookings}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-600 mb-1">Progress Logs</div>
                <div className="text-3xl font-bold text-blue-600">
                  {stats.totalProgressLogs}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-600 mb-1">Materi Selesai</div>
                <div className="text-3xl font-bold text-purple-600">
                  {stats.materialsCompleted}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress Logs */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Logs Terakhir</CardTitle>
              </CardHeader>
              <CardContent>
                {progressLogs.length > 0 ? (
                  <div className="space-y-4">
                    {progressLogs.slice(0, 5).map((log: any) => (
                      <div key={log.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold">
                            {log.booking?.tutorSubject?.subject?.name || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(log.createdAt).toLocaleDateString('id-ID')}
                          </div>
                        </div>
                        {log.summary && (
                          <div className="text-sm text-gray-700 mb-2">
                            📝 {log.summary}
                          </div>
                        )}
                        {log.homework && (
                          <div className="text-sm text-gray-700 mb-2">
                            📚 PR: {log.homework}
                          </div>
                        )}
                        {log.nextPlan && (
                          <div className="text-sm text-gray-700">
                            📅 Rencana: {log.nextPlan}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Belum ada progress log
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Kelas</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length > 0 ? (
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking: any) => (
                      <Link key={booking.id} href={`/bookings/${booking.id}`}>
                        <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-sm">
                              {booking.tutorSubject?.subject?.name || 'N/A'}
                            </div>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                booking.status === 'completed'
                                  ? 'bg-green-100 text-green-700'
                                  : booking.status === 'confirmed'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600">
                            📅{' '}
                            {new Date(booking.scheduledAt).toLocaleDateString(
                              'id-ID',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              }
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Belum ada kelas
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Material Progress */}
          {materials.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Progress Materi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {materials.map((sm: any) => (
                    <div key={sm.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{sm.material.title}</div>
                        {sm.notes && (
                          <div className="text-sm text-gray-600 mt-1">
                            {sm.notes}
                          </div>
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-sm ${
                          sm.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : sm.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {sm.status === 'completed'
                          ? '✅ Selesai'
                          : sm.status === 'in_progress'
                          ? '📝 Sedang Belajar'
                          : '⏸️ Belum Mulai'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

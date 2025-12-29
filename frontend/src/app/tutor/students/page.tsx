'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';

export default function TutorStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/tutors/students/me');
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) =>
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h1 className="text-3xl font-bold mb-2">Daftar Siswa</h1>
            <p className="text-gray-600">Kelola dan pantau progress siswa Anda</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Total Siswa</div>
                    <div className="text-3xl font-bold text-primary-600">
                      {students.length}
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
                    <div className="text-sm text-gray-600 mb-1">Total Kelas</div>
                    <div className="text-3xl font-bold text-blue-600">
                      {students.reduce((sum, s) => sum + s.totalBookings, 0)}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Kelas Selesai</div>
                    <div className="text-3xl font-bold text-green-600">
                      {students.reduce((sum, s) => sum + s.completedBookings, 0)}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <Input
                placeholder="Cari siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
            </CardContent>
          </Card>

          {/* Students List */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Siswa ({filteredStudents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredStudents.length > 0 ? (
                <div className="space-y-4">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center">
                          {student.avatarUrl ? (
                            <img
                              src={student.avatarUrl}
                              alt={student.fullName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-xl font-semibold text-primary-700">
                              {student.fullName.charAt(0)}
                            </span>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="font-semibold text-lg mb-1">
                            {student.fullName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {student.email}
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {student.subjects.map((subject: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-gray-600">Total Kelas</div>
                          <div className="text-2xl font-bold text-primary-600">
                            {student.totalBookings}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {student.completedBookings} selesai
                          </div>
                        </div>
                      </div>

                      <div className="ml-4">
                        <Link href={`/tutor/students/${student.id}`}>
                          <Button size="sm">
                            Lihat Progress
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  {searchQuery ? 'Tidak ada siswa ditemukan' : 'Belum ada siswa'}
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

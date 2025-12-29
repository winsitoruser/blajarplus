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

export default function TutorSyllabusPage() {
  const router = useRouter();
  const [syllabi, setSyllabi] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newSyllabus, setNewSyllabus] = useState({
    tutorSubjectId: '',
    title: '',
    description: '',
    topics: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [syllResponse, profileResponse] = await Promise.all([
        api.get('/tutors/syllabus/me'),
        api.get('/tutors/profile/me'),
      ]);
      setSyllabi(syllResponse.data);
      setSubjects(profileResponse.data.subjects || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tutors/syllabus', {
        ...newSyllabus,
        topics: newSyllabus.topics.split(',').map((t) => t.trim()).filter(Boolean),
      });
      setShowModal(false);
      setNewSyllabus({ tutorSubjectId: '', title: '', description: '', topics: '' });
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Gagal membuat silabus');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus silabus ini?')) return;
    try {
      await api.delete(`/tutors/syllabus/${id}`);
      fetchData();
    } catch (error) {
      alert('Gagal menghapus silabus');
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Silabus & Materi</h1>
              <p className="text-gray-600">Kelola kurikulum pengajaran Anda</p>
            </div>
            <Button onClick={() => setShowModal(true)}>
              + Buat Silabus Baru
            </Button>
          </div>

          {/* Syllabi List */}
          {syllabi.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {syllabi.map((syllabus) => (
                <Card key={syllabus.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{syllabus.title}</span>
                      <div className="flex gap-2">
                        <Link href={`/tutor/syllabus/${syllabus.id}`}>
                          <Button size="sm" variant="outline">
                            Kelola
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(syllabus.id)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {syllabus.description && (
                      <p className="text-sm text-gray-600 mb-4">
                        {syllabus.description}
                      </p>
                    )}
                    
                    {syllabus.topics.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm font-medium mb-2">Topik:</div>
                        <div className="flex flex-wrap gap-2">
                          {syllabus.topics.map((topic: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{syllabus.materials?.length || 0} materi</span>
                      <span>
                        {new Date(syllabus.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2">Belum ada silabus</h3>
                <p className="text-gray-600 mb-4">
                  Buat silabus untuk mengorganisir materi pengajaran Anda
                </p>
                <Button onClick={() => setShowModal(true)}>
                  Buat Silabus Pertama
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Buat Silabus Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mata Pelajaran
                  </label>
                  <select
                    className="w-full h-10 px-3 border border-gray-300 rounded-md"
                    value={newSyllabus.tutorSubjectId}
                    onChange={(e) =>
                      setNewSyllabus({ ...newSyllabus, tutorSubjectId: e.target.value })
                    }
                    required
                  >
                    <option value="">Pilih mata pelajaran</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.subject.name} - {subject.level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Judul Silabus
                  </label>
                  <Input
                    placeholder="Contoh: Matematika Dasar SMA Kelas 10"
                    value={newSyllabus.title}
                    onChange={(e) =>
                      setNewSyllabus({ ...newSyllabus, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Deskripsi silabus..."
                    value={newSyllabus.description}
                    onChange={(e) =>
                      setNewSyllabus({ ...newSyllabus, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Topik (pisahkan dengan koma)
                  </label>
                  <Input
                    placeholder="Aljabar, Geometri, Trigonometri"
                    value={newSyllabus.topics}
                    onChange={(e) =>
                      setNewSyllabus({ ...newSyllabus, topics: e.target.value })
                    }
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Buat Silabus
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}

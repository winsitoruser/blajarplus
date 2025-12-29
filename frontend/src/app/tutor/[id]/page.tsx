'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/api';

export default function TutorDetailPage() {
  const params = useParams();
  const [tutor, setTutor] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchTutorDetail();
      fetchReviews();
    }
  }, [params.id]);

  const fetchTutorDetail = async () => {
    try {
      const response = await api.get(`/tutors/${params.id}`);
      setTutor(response.data);
    } catch (error) {
      console.error('Error fetching tutor:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/tutor/${params.id}`);
      setReviews(response.data.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
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
          <Link href="/search">
            <Button>Kembali ke Pencarian</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                        {tutor.user.avatarUrl ? (
                          <img
                            src={tutor.user.avatarUrl}
                            alt={tutor.user.fullName}
                            className="w-32 h-32 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-5xl text-gray-400">
                            {tutor.user.fullName.charAt(0)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h1 className="text-3xl font-bold mb-2">{tutor.user.fullName}</h1>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center">
                          <span className="text-yellow-500 text-xl">★</span>
                          <span className="ml-1 text-lg font-semibold">
                            {tutor.averageRating.toFixed(1)}
                          </span>
                          <span className="ml-1 text-gray-600">
                            ({tutor.totalReviews} ulasan)
                          </span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">
                          {tutor.totalStudents} siswa
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-gray-600 mb-4">
                        <span>📍 {tutor.city}, {tutor.province}</span>
                        <span>
                          {tutor.teachingMethods.includes('online') && '💻 Online'}
                          {tutor.teachingMethods.includes('online') &&
                            tutor.teachingMethods.includes('offline') &&
                            ' • '}
                          {tutor.teachingMethods.includes('offline') && '🏠 Offline'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {tutor.verificationStatus === 'verified' && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            ✓ Terverifikasi
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Tentang Saya</h2>
                  <p className="text-gray-700 whitespace-pre-line">{tutor.bio}</p>
                </CardContent>
              </Card>

              {/* Education & Experience */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Pendidikan & Pengalaman</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Pendidikan</h3>
                      <p className="text-gray-700">{tutor.education}</p>
                    </div>

                    {tutor.experience && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">Pengalaman</h3>
                        <p className="text-gray-700">{tutor.experience}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Subjects */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Mata Pelajaran</h2>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.map((subject: any) => (
                      <span
                        key={subject.id}
                        className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium"
                      >
                        {subject.name}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="font-medium text-gray-900 mb-2">Tingkat Pendidikan</h3>
                    <div className="flex flex-wrap gap-2">
                      {tutor.educationLevels.map((level: string) => (
                        <span
                          key={level}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Ulasan ({tutor.totalReviews})
                  </h2>

                  {reviews.length === 0 ? (
                    <p className="text-gray-600">Belum ada ulasan</p>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review: any) => (
                        <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-gray-600 font-medium">
                                {review.student.fullName.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{review.student.fullName}</span>
                                <span className="text-gray-400">•</span>
                                <div className="flex items-center">
                                  <span className="text-yellow-500">★</span>
                                  <span className="ml-1">{review.rating}</span>
                                </div>
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                {new Date(review.createdAt).toLocaleDateString('id-ID', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-primary-500 mb-2">
                      Rp {tutor.hourlyRate.toLocaleString('id-ID')}
                    </div>
                    <div className="text-gray-600">per jam</div>
                  </div>

                  <Link href={`/booking/${tutor.id}`}>
                    <Button className="w-full mb-3" size="lg">
                      Booking Sekarang
                    </Button>
                  </Link>

                  <Button variant="outline" className="w-full">
                    Kirim Pesan
                  </Button>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold mb-3">Informasi Tambahan</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Metode Mengajar</span>
                        <span className="font-medium">
                          {tutor.teachingMethods.join(', ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lokasi</span>
                        <span className="font-medium">{tutor.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Siswa</span>
                        <span className="font-medium">{tutor.totalStudents}</span>
                      </div>
                    </div>
                  </div>

                  {tutor.teachingPreferences && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Catatan:</span> {tutor.teachingPreferences}
                      </p>
                    </div>
                  )}
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

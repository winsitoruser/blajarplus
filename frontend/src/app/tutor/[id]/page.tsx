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
      // Use mock data if backend is not available
      const mockTutors: any = {
        '1': {
          id: '1',
          user: {
            fullName: 'Budi Santoso',
            avatarUrl: null,
          },
          bio: 'Guru Matematika berpengalaman 10 tahun. Spesialis persiapan UN dan SBMPTN. Metode mengajar yang mudah dipahami dan menyenangkan.\n\nSaya telah membantu ratusan siswa mencapai target nilai mereka dan masuk ke universitas impian. Pendekatan saya fokus pada pemahaman konsep dasar yang kuat, bukan hanya menghafal rumus.',
          education: 'S1 Pendidikan Matematika, Universitas Negeri Jakarta (2010)\nS2 Matematika Terapan, Institut Teknologi Bandung (2014)',
          experience: '10 tahun mengajar Matematika SMA\n5 tahun sebagai tutor persiapan SBMPTN\n3 tahun mengajar di bimbingan belajar ternama',
          hourlyRate: 150000,
          averageRating: 4.8,
          totalReviews: 45,
          totalStudents: 120,
          city: 'Jakarta',
          province: 'DKI Jakarta',
          teachingMethods: ['online', 'offline'],
          verificationStatus: 'verified',
          educationLevels: ['SMP', 'SMA', 'Alumni'],
          teachingPreferences: 'Lebih suka mengajar dengan metode interaktif dan banyak latihan soal',
          offerFreeTrial: true,
          freeTrialDuration: 60,
          subjects: [
            { id: '1', name: 'Matematika' },
            { id: '2', name: 'Fisika' },
          ],
        },
        '2': {
          id: '2',
          user: {
            fullName: 'Siti Nurhaliza',
            avatarUrl: null,
          },
          bio: 'Native English speaker dengan sertifikat TESOL. Berpengalaman mengajar TOEFL, IELTS, dan English conversation untuk semua level.\n\nSaya percaya bahwa belajar bahasa harus fun dan praktis. Metode saya fokus pada speaking dan listening dengan materi yang relevan dengan kehidupan sehari-hari.',
          education: 'Bachelor of Arts in English Literature, University of Melbourne (2012)\nTESOL Certificate, International House London (2013)',
          experience: '8 tahun mengajar English di berbagai negara\n5 tahun sebagai IELTS examiner\nBerpengalaman melatih siswa untuk study abroad',
          hourlyRate: 200000,
          averageRating: 4.9,
          totalReviews: 67,
          totalStudents: 85,
          city: 'Bandung',
          province: 'Jawa Barat',
          teachingMethods: ['online'],
          verificationStatus: 'verified',
          educationLevels: ['SMP', 'SMA', 'University', 'Professional'],
          teachingPreferences: 'Fokus pada conversation dan practical English',
          offerFreeTrial: false,
          freeTrialDuration: null,
          subjects: [
            { id: '5', name: 'Bahasa Inggris' },
          ],
        },
        '3': {
          id: '3',
          user: {
            fullName: 'Andi Wijaya',
            avatarUrl: null,
          },
          bio: 'Lulusan ITB jurusan Fisika. Spesialis Fisika SMA dan persiapan olimpiade. Sudah membimbing 50+ siswa masuk PTN favorit.\n\nPendekatan saya adalah memahami konsep fisika dari dasar, bukan menghafal. Saya suka menggunakan analogi dan contoh real-world untuk menjelaskan konsep yang sulit.',
          education: 'S1 Fisika, Institut Teknologi Bandung (2015)\nS2 Fisika Teoretis, Institut Teknologi Bandung (2018)',
          experience: '7 tahun mengajar Fisika SMA\n4 tahun melatih siswa olimpiade fisika\nPembimbing 50+ siswa yang lolos SBMPTN',
          hourlyRate: 175000,
          averageRating: 4.7,
          totalReviews: 38,
          totalStudents: 95,
          city: 'Surabaya',
          province: 'Jawa Timur',
          teachingMethods: ['online', 'offline'],
          verificationStatus: 'verified',
          educationLevels: ['SMA', 'Alumni'],
          teachingPreferences: 'Suka diskusi interaktif dan problem solving',
          offerFreeTrial: true,
          freeTrialDuration: 90,
          subjects: [
            { id: '2', name: 'Fisika' },
            { id: '1', name: 'Matematika' },
            { id: '3', name: 'Kimia' },
          ],
        },
        '4': {
          id: '4',
          user: {
            fullName: 'Dewi Lestari',
            avatarUrl: null,
          },
          bio: 'Software Engineer dengan 5 tahun pengalaman. Mengajar Python, JavaScript, React, dan Web Development untuk pemula hingga advanced.\n\nSaya passionate dalam mengajar programming dengan cara yang mudah dipahami. Fokus pada project-based learning agar siswa bisa langsung praktik.',
          education: 'S1 Teknik Informatika, Universitas Indonesia (2017)',
          experience: '5 tahun sebagai Full Stack Developer\n3 tahun mengajar programming online\nMentor di berbagai coding bootcamp',
          hourlyRate: 250000,
          averageRating: 5.0,
          totalReviews: 52,
          totalStudents: 78,
          city: 'Jakarta',
          province: 'DKI Jakarta',
          teachingMethods: ['online'],
          verificationStatus: 'verified',
          educationLevels: ['SMA', 'University', 'Professional'],
          teachingPreferences: 'Project-based learning dengan real-world projects',
          offerFreeTrial: true,
          freeTrialDuration: 30,
          subjects: [
            { id: '7', name: 'Programming' },
          ],
        },
        '5': {
          id: '5',
          user: {
            fullName: 'Rudi Hartono',
            avatarUrl: null,
          },
          bio: 'Guru Kimia SMA dengan pengalaman 8 tahun. Metode belajar yang sistematis dan mudah dipahami. Spesialis persiapan UTBK.\n\nSaya mengajar dengan pendekatan yang terstruktur, dari konsep dasar hingga soal-soal sulit. Banyak menggunakan mnemonic dan trik untuk memudahkan hafalan.',
          education: 'S1 Pendidikan Kimia, Universitas Negeri Yogyakarta (2014)',
          experience: '8 tahun mengajar Kimia SMA\n5 tahun di bimbingan belajar\nPembimbing praktikum kimia',
          hourlyRate: 125000,
          averageRating: 4.6,
          totalReviews: 29,
          totalStudents: 65,
          city: 'Yogyakarta',
          province: 'DI Yogyakarta',
          teachingMethods: ['offline'],
          verificationStatus: 'verified',
          educationLevels: ['SMA'],
          teachingPreferences: 'Metode sistematis dengan banyak latihan soal',
          offerFreeTrial: false,
          freeTrialDuration: null,
          subjects: [
            { id: '3', name: 'Kimia' },
            { id: '4', name: 'Biologi' },
          ],
        },
        '6': {
          id: '6',
          user: {
            fullName: 'Maya Sari',
            avatarUrl: null,
          },
          bio: 'Graphic Designer profesional. Mengajar Adobe Photoshop, Illustrator, dan Figma. Portfolio di berbagai brand ternama.\n\nSaya mengajar design dengan pendekatan praktis dan industry-standard. Fokus pada portfolio building dan real client projects.',
          education: 'S1 Desain Komunikasi Visual, Institut Kesenian Jakarta (2016)',
          experience: '6 tahun sebagai Graphic Designer\n4 tahun mengajar design\nKlien: Gojek, Tokopedia, Shopee',
          hourlyRate: 180000,
          averageRating: 4.8,
          totalReviews: 41,
          totalStudents: 92,
          city: 'Bali',
          province: 'Bali',
          teachingMethods: ['online'],
          verificationStatus: 'verified',
          educationLevels: ['SMA', 'University', 'Professional'],
          teachingPreferences: 'Portfolio-based learning dengan real projects',
          offerFreeTrial: false,
          freeTrialDuration: null,
          subjects: [
            { id: '8', name: 'Design Grafis' },
          ],
        },
      };
      setTutor(mockTutors[params.id as string] || null);
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
      // Use mock reviews if backend is not available
      const mockReviews: any = {
        '1': [
          {
            id: '1',
            rating: 5,
            comment: 'Pak Budi sangat sabar dalam mengajar. Penjelasannya mudah dipahami dan selalu siap menjawab pertanyaan. Nilai matematika saya naik drastis!',
            student: { fullName: 'Ahmad Rizki' },
            createdAt: new Date('2024-12-15').toISOString(),
          },
          {
            id: '2',
            rating: 5,
            comment: 'Tutor terbaik! Metode mengajarnya sangat efektif. Saya yang tadinya tidak suka matematika jadi lebih paham dan enjoy.',
            student: { fullName: 'Siti Aminah' },
            createdAt: new Date('2024-12-10').toISOString(),
          },
          {
            id: '3',
            rating: 4,
            comment: 'Bagus, tapi kadang jadwalnya penuh. Overall recommended!',
            student: { fullName: 'Budi Setiawan' },
            createdAt: new Date('2024-12-05').toISOString(),
          },
        ],
        '2': [
          {
            id: '4',
            rating: 5,
            comment: 'Miss Siti is amazing! My IELTS score improved from 6.0 to 7.5 in just 3 months. Highly recommended!',
            student: { fullName: 'Rina Susanti' },
            createdAt: new Date('2024-12-12').toISOString(),
          },
          {
            id: '5',
            rating: 5,
            comment: 'Cara mengajarnya fun dan tidak membosankan. Sekarang saya lebih percaya diri speaking English.',
            student: { fullName: 'Doni Pratama' },
            createdAt: new Date('2024-12-08').toISOString(),
          },
        ],
        '3': [
          {
            id: '6',
            rating: 5,
            comment: 'Penjelasan konsep fisikanya sangat detail dan mudah dimengerti. Recommended untuk persiapan SBMPTN!',
            student: { fullName: 'Eko Prasetyo' },
            createdAt: new Date('2024-12-14').toISOString(),
          },
          {
            id: '7',
            rating: 4,
            comment: 'Bagus, tapi perlu lebih banyak latihan soal. Overall good!',
            student: { fullName: 'Lina Marlina' },
            createdAt: new Date('2024-12-07').toISOString(),
          },
        ],
        '4': [
          {
            id: '8',
            rating: 5,
            comment: 'Best programming tutor ever! Sekarang saya sudah bisa bikin website sendiri. Thank you!',
            student: { fullName: 'Fajar Ramadhan' },
            createdAt: new Date('2024-12-13').toISOString(),
          },
          {
            id: '9',
            rating: 5,
            comment: 'Materinya up-to-date dan langsung praktik. Sangat membantu untuk career switch ke tech.',
            student: { fullName: 'Indah Permata' },
            createdAt: new Date('2024-12-09').toISOString(),
          },
        ],
        '5': [
          {
            id: '10',
            rating: 5,
            comment: 'Pak Rudi mengajar dengan sangat terstruktur. Kimia jadi lebih mudah dipahami.',
            student: { fullName: 'Yoga Aditya' },
            createdAt: new Date('2024-12-11').toISOString(),
          },
        ],
        '6': [
          {
            id: '11',
            rating: 5,
            comment: 'Portfolio saya jadi lebih profesional setelah belajar dengan Kak Maya. Recommended!',
            student: { fullName: 'Putri Ayu' },
            createdAt: new Date('2024-12-16').toISOString(),
          },
          {
            id: '12',
            rating: 4,
            comment: 'Materinya bagus dan praktis. Langsung bisa dipraktikkan untuk freelance.',
            student: { fullName: 'Reza Pahlevi' },
            createdAt: new Date('2024-12-06').toISOString(),
          },
        ],
      };
      setReviews(mockReviews[params.id as string] || []);
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
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold">{tutor.user.fullName}</h1>
                        {tutor.offerFreeTrial && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                            🎁 Free Trial {tutor.freeTrialDuration} menit
                          </span>
                        )}
                      </div>
                      
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
                      {tutor.offerFreeTrial && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-3">
                          <div className="flex items-center gap-2 text-green-700 font-semibold mb-1">
                            🎁 Free Trial Tersedia!
                          </div>
                          <p className="text-xs text-green-600">
                            Coba {tutor.freeTrialDuration} menit gratis untuk pertemuan pertama
                          </p>
                        </div>
                      )}
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

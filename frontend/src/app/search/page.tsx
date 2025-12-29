'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/api';

export default function SearchPage() {
  const [tutors, setTutors] = useState([]);
  const [displayedTutors, setDisplayedTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const TUTORS_PER_PAGE = 3;
  const [filters, setFilters] = useState({
    q: '',
    subject: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'rating',
  });
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchSubjects();
    searchTutors();
  }, []);

  useEffect(() => {
    // Load more tutors when page changes
    if (page > 1) {
      loadMoreTutors();
    }
  }, [page]);

  useEffect(() => {
    // Reset displayed tutors when tutors data changes
    if (tutors.length > 0) {
      setDisplayedTutors(tutors.slice(0, TUTORS_PER_PAGE));
      setPage(1);
      setHasMore(tutors.length > TUTORS_PER_PAGE);
    }
  }, [tutors]);

  useEffect(() => {
    // Infinite scroll handler
    const handleScroll = () => {
      if (loadingMore || !hasMore) return;
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      
      // Load more when user scrolls to 80% of the page
      if (scrollTop + clientHeight >= scrollHeight * 0.8) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore]);

  const loadMoreTutors = () => {
    setLoadingMore(true);
    
    setTimeout(() => {
      const startIndex = page * TUTORS_PER_PAGE;
      const endIndex = startIndex + TUTORS_PER_PAGE;
      const newTutors = tutors.slice(startIndex, endIndex);
      
      if (newTutors.length > 0) {
        setDisplayedTutors(prev => [...prev, ...newTutors]);
        setHasMore(endIndex < tutors.length);
      } else {
        setHasMore(false);
      }
      
      setLoadingMore(false);
    }, 500); // Simulate loading delay
  };

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/tutors/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      // Use mock data if backend is not available
      const mockSubjects = [
        { id: '1', name: 'Matematika' },
        { id: '2', name: 'Fisika' },
        { id: '3', name: 'Kimia' },
        { id: '4', name: 'Biologi' },
        { id: '5', name: 'Bahasa Inggris' },
        { id: '6', name: 'Bahasa Indonesia' },
        { id: '7', name: 'Programming' },
        { id: '8', name: 'Design Grafis' },
      ];
      setSubjects(mockSubjects);
    }
  };

  const searchTutors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await api.get(`/tutors/search?${params.toString()}`);
      setTutors(response.data.data);
    } catch (error) {
      console.error('Error searching tutors:', error);
      // Use mock data if backend is not available
      const mockTutors = [
        {
          id: '1',
          user: {
            fullName: 'Budi Santoso',
            avatarUrl: null,
          },
          bio: 'Guru Matematika berpengalaman 10 tahun. Spesialis persiapan UN dan SBMPTN. Metode mengajar yang mudah dipahami dan menyenangkan.',
          hourlyRate: 150000,
          averageRating: 4.8,
          totalReviews: 45,
          totalStudents: 120,
          city: 'Jakarta',
          teachingMethods: ['online', 'offline'],
          offerFreeTrial: true,
          freeTrialDuration: 60,
          subjects: [
            { id: '1', name: 'Matematika' },
            { id: '2', name: 'Fisika' },
          ],
        },
        {
          id: '2',
          user: {
            fullName: 'Siti Nurhaliza',
            avatarUrl: null,
          },
          bio: 'Native English speaker dengan sertifikat TESOL. Berpengalaman mengajar TOEFL, IELTS, dan English conversation untuk semua level.',
          hourlyRate: 200000,
          averageRating: 4.9,
          totalReviews: 67,
          totalStudents: 85,
          city: 'Bandung',
          teachingMethods: ['online'],
          offerFreeTrial: false,
          freeTrialDuration: null,
          subjects: [
            { id: '5', name: 'Bahasa Inggris' },
          ],
        },
        {
          id: '3',
          user: {
            fullName: 'Andi Wijaya',
            avatarUrl: null,
          },
          bio: 'Lulusan ITB jurusan Fisika. Spesialis Fisika SMA dan persiapan olimpiade. Sudah membimbing 50+ siswa masuk PTN favorit.',
          hourlyRate: 175000,
          averageRating: 4.7,
          totalReviews: 38,
          totalStudents: 95,
          city: 'Surabaya',
          teachingMethods: ['online', 'offline'],
          offerFreeTrial: true,
          freeTrialDuration: 90,
          subjects: [
            { id: '2', name: 'Fisika' },
            { id: '1', name: 'Matematika' },
            { id: '3', name: 'Kimia' },
          ],
        },
        {
          id: '4',
          user: {
            fullName: 'Dewi Lestari',
            avatarUrl: null,
          },
          bio: 'Software Engineer dengan 5 tahun pengalaman. Mengajar Python, JavaScript, React, dan Web Development untuk pemula hingga advanced.',
          hourlyRate: 250000,
          averageRating: 5.0,
          totalReviews: 52,
          totalStudents: 78,
          city: 'Jakarta',
          teachingMethods: ['online'],
          offerFreeTrial: true,
          freeTrialDuration: 30,
          subjects: [
            { id: '7', name: 'Programming' },
          ],
        },
        {
          id: '5',
          user: {
            fullName: 'Rudi Hartono',
            avatarUrl: null,
          },
          bio: 'Guru Kimia SMA dengan pengalaman 8 tahun. Metode belajar yang sistematis dan mudah dipahami. Spesialis persiapan UTBK.',
          hourlyRate: 125000,
          averageRating: 4.6,
          totalReviews: 29,
          totalStudents: 65,
          city: 'Yogyakarta',
          teachingMethods: ['offline'],
          offerFreeTrial: false,
          freeTrialDuration: null,
          subjects: [
            { id: '3', name: 'Kimia' },
            { id: '4', name: 'Biologi' },
          ],
        },
        {
          id: '6',
          user: {
            fullName: 'Maya Sari',
            avatarUrl: null,
          },
          bio: 'Graphic Designer profesional. Mengajar Adobe Photoshop, Illustrator, dan Figma. Portfolio di berbagai brand ternama.',
          hourlyRate: 180000,
          averageRating: 4.8,
          totalReviews: 41,
          totalStudents: 92,
          city: 'Bali',
          teachingMethods: ['online'],
          offerFreeTrial: false,
          freeTrialDuration: null,
          subjects: [
            { id: '8', name: 'Design Grafis' },
          ],
        },
      ];
      
      // Duplicate tutors to create more data for infinite scroll demo
      const allMockTutors = [
        ...mockTutors,
        ...mockTutors.map((t: any, i: number) => ({
          ...t,
          id: `${t.id}-copy-${i}`,
        })),
        ...mockTutors.map((t: any, i: number) => ({
          ...t,
          id: `${t.id}-copy2-${i}`,
        })),
      ];
      
      setTutors(allMockTutors);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchTutors();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Cari Tutor</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-semibold mb-4">Filter</h2>
                  
                  <form onSubmit={handleSearch} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Cari
                      </label>
                      <Input
                        placeholder="Nama atau kata kunci..."
                        value={filters.q}
                        onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Mata Pelajaran
                      </label>
                      <select
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                        value={filters.subject}
                        onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                      >
                        <option value="">Semua Mata Pelajaran</option>
                        {subjects.map((subject: any) => (
                          <option key={subject.id} value={subject.name}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Kota
                      </label>
                      <Input
                        placeholder="Jakarta, Bandung, dll"
                        value={filters.city}
                        onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Harga per Jam
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={filters.minPrice}
                          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={filters.maxPrice}
                          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Urutkan
                      </label>
                      <select
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                        value={filters.sortBy}
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                      >
                        <option value="rating">Rating Tertinggi</option>
                        <option value="price_low">Harga Terendah</option>
                        <option value="price_high">Harga Tertinggi</option>
                        <option value="newest">Terbaru</option>
                      </select>
                    </div>

                    <Button type="submit" className="w-full">
                      Terapkan Filter
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Tutors List */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                  <p className="mt-4 text-gray-600">Mencari tutor...</p>
                </div>
              ) : displayedTutors.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Tidak ada tutor ditemukan</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayedTutors.map((tutor: any) => (
                    <Card key={tutor.id} className="hover:shadow-md transition">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <div className="flex-shrink-0">
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                              {tutor.user.avatarUrl ? (
                                <img
                                  src={tutor.user.avatarUrl}
                                  alt={tutor.user.fullName}
                                  className="w-24 h-24 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-3xl text-gray-400">
                                  {tutor.user.fullName.charAt(0)}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-xl font-semibold">
                                    {tutor.user.fullName}
                                  </h3>
                                  {tutor.offerFreeTrial && (
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                      🎁 Free Trial {tutor.freeTrialDuration} menit
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex items-center">
                                    <span className="text-yellow-500">★</span>
                                    <span className="ml-1 font-medium">
                                      {tutor.averageRating.toFixed(1)}
                                    </span>
                                  </div>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-gray-600">
                                    {tutor.totalReviews} ulasan
                                  </span>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-gray-600">
                                    {tutor.totalStudents} siswa
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-primary-500">
                                  Rp {tutor.hourlyRate.toLocaleString('id-ID')}
                                </div>
                                <div className="text-sm text-gray-600">per jam</div>
                              </div>
                            </div>

                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {tutor.bio}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-3">
                              {tutor.subjects.slice(0, 3).map((subject: any) => (
                                <span
                                  key={subject.id}
                                  className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                                >
                                  {subject.name}
                                </span>
                              ))}
                              {tutor.subjects.length > 3 && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                  +{tutor.subjects.length - 3} lainnya
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>📍 {tutor.city}</span>
                              <span>
                                {tutor.teachingMethods.includes('online') && '💻 Online'}
                                {tutor.teachingMethods.includes('online') &&
                                  tutor.teachingMethods.includes('offline') &&
                                  ' • '}
                                {tutor.teachingMethods.includes('offline') && '🏠 Offline'}
                              </span>
                            </div>

                            <div className="mt-4 flex gap-3">
                              <Link href={`/tutor/${tutor.id}`}>
                                <Button variant="outline">Lihat Profile</Button>
                              </Link>
                              <Link href={`/booking/${tutor.id}`}>
                                <Button>Booking Sekarang</Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Load More Indicator */}
                  {loadingMore && (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                      <p className="mt-2 text-gray-600">Memuat lebih banyak tutor...</p>
                    </div>
                  )}
                  
                  {/* End of Results */}
                  {!hasMore && displayedTutors.length > 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-600">✓ Semua tutor telah ditampilkan ({displayedTutors.length} tutor)</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

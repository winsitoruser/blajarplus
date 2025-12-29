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
  const [loading, setLoading] = useState(true);
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

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/tutors/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
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
              ) : tutors.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Tidak ada tutor ditemukan</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tutors.map((tutor: any) => (
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
                                <h3 className="text-xl font-semibold mb-1">
                                  {tutor.user.fullName}
                                </h3>
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

                            <div className="mt-4">
                              <Link href={`/tutor/${tutor.id}`}>
                                <Button>Lihat Profile</Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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

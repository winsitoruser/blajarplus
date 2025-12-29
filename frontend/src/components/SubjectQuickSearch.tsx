'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

export default function SubjectQuickSearch() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    fetchPopularSubjects();
  }, []);

  const fetchPopularSubjects = async () => {
    try {
      const response = await api.get('/tutors/subjects');
      setSubjects(response.data.slice(0, 12));
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (selectedSubject) params.append('subject', selectedSubject);
    router.push(`/search?${params.toString()}`);
  };

  const handleSubjectClick = (subjectName: string) => {
    router.push(`/search?subject=${encodeURIComponent(subjectName)}`);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-primary-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Cari Tutor Berdasarkan Mata Pelajaran
          </h2>
          <p className="text-gray-600 text-lg">
            Pilih mata pelajaran atau cari tutor yang Anda butuhkan
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Cari mata pelajaran atau nama tutor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 text-lg"
              />
            </div>
            <Button type="submit" size="lg" className="h-14 px-8">
              🔍 Cari
            </Button>
          </form>
        </div>

        {/* Popular Subjects Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer group"
              onClick={() => handleSubjectClick(subject.name)}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center group-hover:from-primary-500 group-hover:to-secondary-500 transition-all">
                  <span className="text-3xl group-hover:scale-110 transition-transform">
                    {getSubjectIcon(subject.name)}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {subject.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {subject._count?.tutorSubjects || 0}+ tutor
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push('/search')}
            className="border-2"
          >
            Lihat Semua Mata Pelajaran →
          </Button>
        </div>
      </div>
    </section>
  );
}

function getSubjectIcon(subjectName: string): string {
  const icons: { [key: string]: string } = {
    'Matematika': '🔢',
    'Fisika': '⚛️',
    'Kimia': '🧪',
    'Biologi': '🧬',
    'Bahasa Inggris': '🇬🇧',
    'Bahasa Indonesia': '📖',
    'Sejarah': '📜',
    'Geografi': '🌍',
    'Ekonomi': '💰',
    'Akuntansi': '📊',
    'Programming': '💻',
    'Design': '🎨',
    'Music': '🎵',
    'Olahraga': '⚽',
  };

  for (const [key, icon] of Object.entries(icons)) {
    if (subjectName.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }

  return '📚';
}

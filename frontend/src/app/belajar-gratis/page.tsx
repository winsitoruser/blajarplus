'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Globe, TrendingUp, Award } from 'lucide-react';

interface Language {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  description: string;
  _count: {
    courses: number;
  };
}

export default function BelajarGratisPage() {
  const router = useRouter();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/language-learning/languages', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLanguages(data);
      }
    } catch (error) {
      console.error('Error fetching languages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLanguage = (languageId: string) => {
    router.push(`/belajar-gratis/${languageId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat bahasa...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Globe className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Belajar Bahasa Gratis
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pelajari bahasa baru dengan metode interaktif seperti Duolingo. 
            Mulai dari pemula hingga expert!
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Pembelajaran Terstruktur</h3>
                  <p className="text-sm text-gray-600">Dari pemula hingga expert</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Gamifikasi</h3>
                  <p className="text-sm text-gray-600">Dapatkan XP & achievement</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Latihan Interaktif</h3>
                  <p className="text-sm text-gray-600">Multiple choice, listening, dll</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Language Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pilih Bahasa yang Ingin Dipelajari</h2>
          
          {languages.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Belum ada bahasa tersedia</p>
                <p className="text-sm text-gray-500 mt-2">Silakan hubungi admin untuk menambahkan bahasa</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {languages.map((language) => (
                <Card
                  key={language.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-400"
                  onClick={() => handleSelectLanguage(language.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-4xl">{language.flag}</span>
                      <Badge variant="secondary">
                        {language._count.courses} Kursus
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl">{language.name}</CardTitle>
                    <CardDescription className="text-lg">
                      {language.nativeName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{language.description}</p>
                    <Button className="w-full" variant="default">
                      Mulai Belajar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">6</div>
                <div className="text-blue-100">Bahasa Tersedia</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-blue-100">Gratis Selamanya</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">∞</div>
                <div className="text-blue-100">Latihan Interaktif</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

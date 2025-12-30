'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, BookOpen, Lock, CheckCircle, Circle } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  icon: string;
  color: string;
  units: Unit[];
  userProgress?: {
    isCompleted: boolean;
    totalXpEarned: number;
  };
}

interface Unit {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  _count: {
    lessons: number;
  };
}

interface Language {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
}

export default function LanguageCoursesPage() {
  const router = useRouter();
  const params = useParams();
  const languageId = params.languageId as string;

  const [language, setLanguage] = useState<Language | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (languageId) {
      fetchLanguageAndCourses();
    }
  }, [languageId]);

  const fetchLanguageAndCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      // Fetch language details
      const langResponse = await fetch(`http://localhost:3000/api/language-learning/languages/${languageId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (langResponse.ok) {
        const langData = await langResponse.json();
        setLanguage(langData);
      }

      // Fetch courses
      const coursesResponse = await fetch(
        `http://localhost:3000/api/language-learning/languages/${languageId}/courses?userId=${userId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        setCourses(coursesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCourse = (courseId: string) => {
    router.push(`/belajar-gratis/${languageId}/${courseId}`);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'bg-green-100 text-green-800';
      case 'ELEMENTARY': return 'bg-blue-100 text-blue-800';
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800';
      case 'UPPER_INTERMEDIATE': return 'bg-orange-100 text-orange-800';
      case 'ADVANCED': return 'bg-red-100 text-red-800';
      case 'EXPERT': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelName = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'Pemula';
      case 'ELEMENTARY': return 'Dasar';
      case 'INTERMEDIATE': return 'Menengah';
      case 'UPPER_INTERMEDIATE': return 'Menengah Atas';
      case 'ADVANCED': return 'Lanjutan';
      case 'EXPERT': return 'Expert';
      default: return level;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat kursus...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/belajar-gratis')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Pilihan Bahasa
          </Button>

          {language && (
            <div className="flex items-center space-x-4">
              <span className="text-6xl">{language.flag}</span>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Belajar {language.name}
                </h1>
                <p className="text-xl text-gray-600">{language.nativeName}</p>
              </div>
            </div>
          )}
        </div>

        {/* Courses */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Kursus Tersedia</h2>

          {courses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Belum ada kursus tersedia untuk bahasa ini</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-400"
                  onClick={() => handleSelectCourse(course.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className="text-4xl p-4 rounded-lg"
                          style={{ backgroundColor: course.color + '20' }}
                        >
                          {course.icon}
                        </div>
                        <div>
                          <CardTitle className="text-2xl">{course.title}</CardTitle>
                          <CardDescription className="text-base mt-1">
                            {course.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={getLevelColor(course.level)}>
                        {getLevelName(course.level)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress */}
                      {course.userProgress && (
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-semibold text-blue-600">
                              {course.userProgress.totalXpEarned} XP
                            </span>
                          </div>
                          {course.userProgress.isCompleted && (
                            <Badge variant="default" className="bg-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Selesai
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Units Preview */}
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          {course.units.length} Unit Pembelajaran
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {course.units.slice(0, 4).map((unit) => (
                            <div
                              key={unit.id}
                              className="p-3 bg-white rounded-lg border text-center"
                            >
                              <div className="text-2xl mb-1">{unit.icon}</div>
                              <p className="text-xs font-medium text-gray-700 truncate">
                                {unit.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {unit._count.lessons} pelajaran
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full" size="lg">
                        {course.userProgress?.isCompleted ? 'Ulangi Kursus' : 'Mulai Belajar'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

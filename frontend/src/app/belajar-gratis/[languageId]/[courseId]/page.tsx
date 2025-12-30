'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Lock, CheckCircle, Circle, Star, Trophy, Zap } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  xpReward: number;
  hearts: number;
  isActive: boolean;
  userProgress?: {
    isCompleted: boolean;
    score: number;
  };
}

interface Unit {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  xpReward: number;
  isActive: boolean;
  lessons: Lesson[];
  userProgress?: {
    isCompleted: boolean;
    completedLessons: number;
    totalLessons: number;
  };
}

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  icon: string;
  color: string;
  language: {
    name: string;
    nativeName: string;
    flag: string;
  };
  units: Unit[];
}

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const languageId = params.languageId as string;
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      const response = await fetch(
        `http://localhost:3000/api/language-learning/courses/${courseId}?userId=${userId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCourse(data);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartLesson = (lessonId: string) => {
    router.push(`/belajar-gratis/${languageId}/${courseId}/${lessonId}`);
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

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">Kursus tidak ditemukan</p>
              <Button
                onClick={() => router.push(`/belajar-gratis/${languageId}`)}
                className="mt-4"
              >
                Kembali
              </Button>
            </CardContent>
          </Card>
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
            onClick={() => router.push(`/belajar-gratis/${languageId}`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>

          <Card className="border-2" style={{ borderColor: course.color }}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className="text-6xl p-4 rounded-lg"
                    style={{ backgroundColor: course.color + '20' }}
                  >
                    {course.language.flag}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <CardTitle className="text-3xl">{course.title}</CardTitle>
                      <Badge className={getLevelColor(course.level)}>
                        {getLevelName(course.level)}
                      </Badge>
                    </div>
                    <CardDescription className="text-lg">
                      {course.description}
                    </CardDescription>
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Trophy className="h-4 w-4 mr-1 text-yellow-600" />
                        {course.units.reduce((sum, unit) => sum + unit.xpReward, 0)} XP Total
                      </span>
                      <span className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-blue-600" />
                        {course.units.length} Units
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Units & Lessons */}
        <div className="space-y-6">
          {course.units.map((unit, unitIndex) => {
            const isUnlocked = unitIndex === 0 || course.units[unitIndex - 1]?.userProgress?.isCompleted;
            const completedLessons = unit.userProgress?.completedLessons || 0;
            const totalLessons = unit.lessons.length;
            const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

            return (
              <Card
                key={unit.id}
                className={`border-2 ${isUnlocked ? 'border-blue-300' : 'border-gray-300 opacity-60'}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                        {unit.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-xl">
                            Unit {unit.order}: {unit.title}
                          </CardTitle>
                          {!isUnlocked && <Lock className="h-5 w-5 text-gray-400" />}
                          {unit.userProgress?.isCompleted && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <CardDescription>{unit.description}</CardDescription>
                        
                        {/* Progress Bar */}
                        {isUnlocked && (
                          <div className="mt-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">
                                {completedLessons} / {totalLessons} Lessons
                              </span>
                              <span className="font-semibold text-blue-600">
                                {unit.xpReward} XP
                              </span>
                            </div>
                            <Progress value={progressPercent} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {isUnlocked && (
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {unit.lessons.map((lesson, lessonIndex) => {
                        const isLessonUnlocked = lessonIndex === 0 || unit.lessons[lessonIndex - 1]?.userProgress?.isCompleted;
                        const isCompleted = lesson.userProgress?.isCompleted || false;

                        return (
                          <Card
                            key={lesson.id}
                            className={`hover:shadow-md transition-shadow ${
                              !isLessonUnlocked ? 'opacity-50' : 'cursor-pointer'
                            }`}
                            onClick={() => isLessonUnlocked && handleStartLesson(lesson.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    {isCompleted ? (
                                      <CheckCircle className="h-5 w-5 text-green-600" />
                                    ) : isLessonUnlocked ? (
                                      <Circle className="h-5 w-5 text-blue-600" />
                                    ) : (
                                      <Lock className="h-5 w-5 text-gray-400" />
                                    )}
                                    <h4 className="font-semibold text-gray-900">
                                      {lesson.title}
                                    </h4>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-3">
                                    {lesson.description}
                                  </p>
                                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                                    <span className="flex items-center">
                                      <Zap className="h-3 w-3 mr-1 text-yellow-600" />
                                      {lesson.xpReward} XP
                                    </span>
                                    <span className="flex items-center">
                                      ❤️ {lesson.hearts} Hearts
                                    </span>
                                  </div>
                                  {isCompleted && lesson.userProgress && (
                                    <div className="mt-2">
                                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                                        Score: {lesson.userProgress.score}%
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {isLessonUnlocked && (
                                <Button
                                  className="w-full mt-3"
                                  size="sm"
                                  variant={isCompleted ? "outline" : "default"}
                                >
                                  {isCompleted ? 'Ulangi' : 'Mulai'}
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                )}

                {!isUnlocked && (
                  <CardContent>
                    <div className="text-center py-6 text-gray-500">
                      <Lock className="h-8 w-8 mx-auto mb-2" />
                      <p>Selesaikan unit sebelumnya untuk membuka unit ini</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

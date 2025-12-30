'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CheckCircle, Circle, Clock, Calendar, Target, TrendingUp, Flag } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  isCompleted: boolean;
  completedAt?: string;
  order: number;
}

interface LearningPath {
  id: string;
  targetDate?: string;
  hoursPerWeek: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CERTIFIED';
  createdAt: string;
  course: {
    title: string;
    estimatedHours?: number;
    language: {
      name: string;
      flag: string;
    };
    units: any[];
  };
  milestones: Milestone[];
}

export default function LearningPathTimeline({ courseId }: { courseId?: string }) {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    courseId: courseId || '',
    hoursPerWeek: 5,
    targetDate: '',
  });

  useEffect(() => {
    fetchLearningPaths();
  }, []);

  const fetchLearningPaths = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        'http://localhost:3000/api/language-learning/learning-paths',
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        setLearningPaths(data);
        if (data.length > 0) {
          setSelectedPath(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching learning paths:', error);
    } finally {
      setLoading(false);
    }
  };

  const createLearningPath = async () => {
    if (!formData.courseId) {
      alert('Please select a course');
      return;
    }

    setCreating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        'http://localhost:3000/api/language-learning/learning-paths',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const newPath = await response.json();
        setLearningPaths(prev => [newPath, ...prev]);
        setSelectedPath(newPath);
        setShowCreateForm(false);
        alert('✅ Learning path berhasil dibuat!');
      }
    } catch (error) {
      console.error('Error creating learning path:', error);
      alert('Gagal membuat learning path');
    } finally {
      setCreating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOT_STARTED': return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CERTIFIED': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'NOT_STARTED': return 'Belum Dimulai';
      case 'IN_PROGRESS': return 'Sedang Berjalan';
      case 'COMPLETED': return 'Selesai';
      case 'CERTIFIED': return 'Tersertifikasi';
      default: return status;
    }
  };

  const calculateProgress = (path: LearningPath) => {
    const completed = path.milestones.filter(m => m.isCompleted).length;
    return path.milestones.length > 0 ? (completed / path.milestones.length) * 100 : 0;
  };

  const getDaysUntil = (dateString: string) => {
    const target = new Date(dateString);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Target className="h-6 w-6 mr-2 text-blue-600" />
            Learning Path & Timeline
          </h2>
          <p className="text-gray-600 mt-1">Rencanakan dan lacak perjalanan belajar Anda</p>
        </div>
        {!showCreateForm && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Buat Learning Path Baru
          </Button>
        )}
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle>Buat Learning Path Baru</CardTitle>
            <CardDescription>Atur target dan jadwal belajar Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Jam Belajar per Minggu</label>
                <Input
                  type="number"
                  min="1"
                  max="40"
                  value={formData.hoursPerWeek}
                  onChange={(e) => setFormData({ ...formData, hoursPerWeek: parseInt(e.target.value) })}
                  placeholder="5"
                />
                <p className="text-xs text-gray-500 mt-1">Rekomendasi: 5-10 jam per minggu</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Target Selesai (Opsional)</label>
                <Input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={createLearningPath}
                  disabled={creating}
                  className="flex-1"
                >
                  {creating ? 'Membuat...' : 'Buat Learning Path'}
                </Button>
                <Button
                  onClick={() => setShowCreateForm(false)}
                  variant="outline"
                >
                  Batal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Paths List */}
      {learningPaths.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Belum ada learning path</p>
            <Button onClick={() => setShowCreateForm(true)}>
              Buat Learning Path Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Paths List */}
          <div className="lg:col-span-1 space-y-3">
            {learningPaths.map((path) => (
              <Card
                key={path.id}
                className={`cursor-pointer transition-all ${
                  selectedPath?.id === path.id
                    ? 'border-2 border-blue-500 shadow-lg'
                    : 'border-2 border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPath(path)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-3xl">{path.course.language.flag}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{path.course.title}</h3>
                      <Badge className={`${getStatusColor(path.status)} mt-2`}>
                        {getStatusText(path.status)}
                      </Badge>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold">{Math.round(calculateProgress(path))}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full transition-all"
                            style={{ width: `${calculateProgress(path)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Timeline Detail */}
          <div className="lg:col-span-2">
            {selectedPath && (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-4xl">{selectedPath.course.language.flag}</span>
                        <Badge className={getStatusColor(selectedPath.status)}>
                          {getStatusText(selectedPath.status)}
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl">{selectedPath.course.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {selectedPath.hoursPerWeek} jam/minggu • {selectedPath.course.estimatedHours || 40} jam total
                      </CardDescription>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedPath.milestones.filter(m => m.isCompleted).length}
                      </div>
                      <div className="text-xs text-gray-600">Milestones Selesai</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(calculateProgress(selectedPath))}%
                      </div>
                      <div className="text-xs text-gray-600">Progress</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedPath.targetDate ? getDaysUntil(selectedPath.targetDate) : '-'}
                      </div>
                      <div className="text-xs text-gray-600">Hari Tersisa</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Flag className="h-5 w-5 mr-2" />
                    Milestones
                  </h3>

                  {/* Timeline */}
                  <div className="space-y-4">
                    {selectedPath.milestones.map((milestone, index) => {
                      const daysUntil = getDaysUntil(milestone.targetDate);
                      const isOverdue = daysUntil < 0 && !milestone.isCompleted;

                      return (
                        <div key={milestone.id} className="flex items-start space-x-4">
                          {/* Timeline Line */}
                          <div className="flex flex-col items-center">
                            <div className={`rounded-full p-2 ${
                              milestone.isCompleted
                                ? 'bg-green-500'
                                : isOverdue
                                ? 'bg-red-500'
                                : 'bg-gray-300'
                            }`}>
                              {milestone.isCompleted ? (
                                <CheckCircle className="h-4 w-4 text-white" />
                              ) : (
                                <Circle className="h-4 w-4 text-white" />
                              )}
                            </div>
                            {index < selectedPath.milestones.length - 1 && (
                              <div className={`w-0.5 h-16 ${
                                milestone.isCompleted ? 'bg-green-500' : 'bg-gray-300'
                              }`} />
                            )}
                          </div>

                          {/* Milestone Content */}
                          <div className="flex-1 pb-8">
                            <Card className={`${
                              milestone.isCompleted
                                ? 'border-green-500 bg-green-50'
                                : isOverdue
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300'
                            } border-2`}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-semibold">{milestone.title}</h4>
                                  {milestone.isCompleted && (
                                    <Badge className="bg-green-600 text-white">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Selesai
                                    </Badge>
                                  )}
                                  {isOverdue && (
                                    <Badge className="bg-red-600 text-white">
                                      Terlambat
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center text-gray-500">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    Target: {new Date(milestone.targetDate).toLocaleDateString()}
                                  </div>
                                  {!milestone.isCompleted && (
                                    <div className={`flex items-center ${isOverdue ? 'text-red-600' : 'text-blue-600'}`}>
                                      <Clock className="h-3 w-3 mr-1" />
                                      {Math.abs(daysUntil)} hari {isOverdue ? 'terlambat' : 'lagi'}
                                    </div>
                                  )}
                                  {milestone.completedAt && (
                                    <div className="flex items-center text-green-600">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      {new Date(milestone.completedAt).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Completion Message */}
                  {selectedPath.status === 'COMPLETED' && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg text-white text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                      <h3 className="font-bold text-lg">🎉 Selamat!</h3>
                      <p className="text-sm">Anda telah menyelesaikan learning path ini!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

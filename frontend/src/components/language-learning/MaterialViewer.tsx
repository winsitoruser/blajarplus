'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Video, Headphones, FileText, CheckCircle, Clock } from 'lucide-react';

interface Material {
  id: string;
  title: string;
  description: string;
  type: 'TEXT' | 'VIDEO' | 'AUDIO' | 'PDF' | 'INTERACTIVE';
  content?: string;
  url?: string;
  fileUrl?: string;
  duration?: number;
  order: number;
  isRequired: boolean;
  userProgress?: {
    isCompleted: boolean;
    progress: number;
    timeSpent: number;
  };
}

interface MaterialViewerProps {
  courseId?: string;
  unitId?: string;
  lessonId?: string;
  onComplete?: () => void;
}

export default function MaterialViewer({ courseId, unitId, lessonId, onComplete }: MaterialViewerProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, [courseId, unitId, lessonId]);

  useEffect(() => {
    if (selectedMaterial) {
      setStartTime(new Date());
    }
  }, [selectedMaterial]);

  const fetchMaterials = async () => {
    try {
      const token = localStorage.getItem('token');
      let url = '';
      
      if (lessonId) {
        url = `http://localhost:3000/api/language-learning/lessons/${lessonId}/materials`;
      } else if (unitId) {
        url = `http://localhost:3000/api/language-learning/units/${unitId}/materials`;
      } else if (courseId) {
        url = `http://localhost:3000/api/language-learning/courses/${courseId}/materials`;
      }

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setMaterials(data);
        if (data.length > 0) {
          setSelectedMaterial(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (newProgress: number) => {
    if (!selectedMaterial || !startTime) return;

    const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    const token = localStorage.getItem('token');
    
    const materialType = lessonId ? 'lesson' : unitId ? 'unit' : 'course';

    try {
      await fetch(`http://localhost:3000/api/language-learning/materials/${selectedMaterial.id}/progress`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          materialType,
          progress: newProgress,
          timeSpent,
        }),
      });

      setProgress(newProgress);

      if (newProgress >= 100) {
        // Update local state
        setMaterials(prev => prev.map(m => 
          m.id === selectedMaterial.id 
            ? { ...m, userProgress: { ...m.userProgress, isCompleted: true, progress: 100 } as any }
            : m
        ));

        // Move to next material if available
        const currentIndex = materials.findIndex(m => m.id === selectedMaterial.id);
        if (currentIndex < materials.length - 1) {
          setTimeout(() => {
            setSelectedMaterial(materials[currentIndex + 1]);
            setProgress(0);
          }, 1000);
        } else if (onComplete) {
          onComplete();
        }
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'TEXT': return <BookOpen className="h-5 w-5" />;
      case 'VIDEO': return <Video className="h-5 w-5" />;
      case 'AUDIO': return <Headphones className="h-5 w-5" />;
      case 'PDF': return <FileText className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const getMaterialColor = (type: string) => {
    switch (type) {
      case 'TEXT': return 'bg-blue-100 text-blue-800';
      case 'VIDEO': return 'bg-red-100 text-red-800';
      case 'AUDIO': return 'bg-green-100 text-green-800';
      case 'PDF': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Belum ada materi tersedia</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Materials List */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Materi Pembelajaran</CardTitle>
            <CardDescription>
              {materials.filter(m => m.userProgress?.isCompleted).length} / {materials.length} selesai
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {materials.map((material, index) => (
              <button
                key={material.id}
                onClick={() => {
                  setSelectedMaterial(material);
                  setProgress(material.userProgress?.progress || 0);
                }}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                  selectedMaterial?.id === material.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2 flex-1">
                    <div className={`p-2 rounded ${getMaterialColor(material.type)}`}>
                      {getMaterialIcon(material.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium truncate">{material.title}</span>
                        {material.userProgress?.isCompleted && (
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                      {material.duration && (
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {material.duration} min
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {material.userProgress && material.userProgress.progress > 0 && !material.userProgress.isCompleted && (
                  <Progress value={material.userProgress.progress} className="h-1 mt-2" />
                )}
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Material Content */}
      <div className="lg:col-span-3">
        {selectedMaterial && (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={getMaterialColor(selectedMaterial.type)}>
                      {selectedMaterial.type}
                    </Badge>
                    {selectedMaterial.isRequired && (
                      <Badge variant="outline">Required</Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl">{selectedMaterial.title}</CardTitle>
                  <CardDescription className="mt-2">{selectedMaterial.description}</CardDescription>
                </div>
              </div>
              {progress > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-blue-600">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </CardHeader>
            <CardContent>
              {/* TEXT Content */}
              {selectedMaterial.type === 'TEXT' && selectedMaterial.content && (
                <div className="prose max-w-none">
                  <div 
                    className="whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: selectedMaterial.content.replace(/\n/g, '<br/>') }}
                  />
                  <div className="mt-8 flex justify-end">
                    <Button
                      onClick={() => updateProgress(100)}
                      disabled={progress >= 100}
                    >
                      {progress >= 100 ? 'Selesai' : 'Tandai Selesai'}
                    </Button>
                  </div>
                </div>
              )}

              {/* VIDEO Content */}
              {selectedMaterial.type === 'VIDEO' && selectedMaterial.url && (
                <div>
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                    <iframe
                      src={selectedMaterial.url.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allowFullScreen
                      onLoad={() => updateProgress(50)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => updateProgress(100)}>
                      Selesai Menonton
                    </Button>
                  </div>
                </div>
              )}

              {/* AUDIO Content */}
              {selectedMaterial.type === 'AUDIO' && selectedMaterial.url && (
                <div>
                  <div className="bg-gray-100 rounded-lg p-8 mb-4">
                    <audio
                      controls
                      className="w-full"
                      onEnded={() => updateProgress(100)}
                      onPlay={() => updateProgress(25)}
                    >
                      <source src={selectedMaterial.url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => updateProgress(100)}>
                      Selesai Mendengarkan
                    </Button>
                  </div>
                </div>
              )}

              {/* PDF Content */}
              {selectedMaterial.type === 'PDF' && selectedMaterial.fileUrl && (
                <div>
                  <div className="border-2 border-gray-300 rounded-lg p-8 text-center mb-4">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">PDF Document</p>
                    <a
                      href={selectedMaterial.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button variant="outline">
                        Download PDF
                      </Button>
                    </a>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => updateProgress(100)}>
                      Selesai Membaca
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Heart, Zap, CheckCircle, XCircle, Lightbulb } from 'lucide-react';

interface Exercise {
  id: string;
  type: string;
  difficulty: string;
  question: string;
  correctAnswer: string;
  options?: string[];
  explanation: string;
  hints?: string[];
  order: number;
  xpReward: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  hearts: number;
  exercises: Exercise[];
}

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const languageId = params.languageId as string;
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [totalXP, setTotalXP] = useState(0);
  const [completedExercises, setCompletedExercises] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lessonStarted, setLessonStarted] = useState(false);

  useEffect(() => {
    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3000/api/language-learning/lessons/${lessonId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLesson(data);
        setHearts(data.hearts);
      }
    } catch (error) {
      console.error('Error fetching lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const startLesson = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(
        `http://localhost:3000/api/language-learning/lessons/${lessonId}/start`,
        {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setLessonStarted(true);
    } catch (error) {
      console.error('Error starting lesson:', error);
      setLessonStarted(true);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!lesson || !userAnswer.trim()) return;

    const currentExercise = lesson.exercises[currentExerciseIndex];
    if (!currentExercise.correctAnswer) {
      console.error('No correct answer found for exercise');
      return;
    }
    
    const correct = userAnswer.toLowerCase().trim() === currentExercise.correctAnswer.toLowerCase().trim();
    
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setTotalXP(prev => prev + currentExercise.xpReward);
      setCompletedExercises(prev => prev + 1);
    } else {
      setHearts(prev => Math.max(0, prev - 1));
    }

    // Submit answer to backend
    try {
      const token = localStorage.getItem('token');
      await fetch(
        `http://localhost:3000/api/language-learning/exercises/${currentExercise.id}/submit`,
        {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            answer: userAnswer,
            isCorrect: correct,
          }),
        }
      );
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handleNext = () => {
    if (!lesson) return;

    if (currentExerciseIndex < lesson.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setUserAnswer('');
      setShowResult(false);
      setShowHint(false);
    } else {
      completeLesson();
    }
  };

  const completeLesson = async () => {
    try {
      const token = localStorage.getItem('token');
      const score = (completedExercises / lesson!.exercises.length) * 100;
      
      await fetch(
        `http://localhost:3000/api/language-learning/lessons/${lessonId}/complete`,
        {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            score: Math.round(score),
            xpEarned: totalXP,
          }),
        }
      );

      router.push(`/belajar-gratis/${languageId}/${courseId}?completed=true&xp=${totalXP}`);
    } catch (error) {
      console.error('Error completing lesson:', error);
      router.push(`/belajar-gratis/${languageId}/${courseId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat pelajaran...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">Pelajaran tidak ditemukan</p>
            <Button onClick={() => router.back()} className="mt-4">
              Kembali
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!lessonStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle className="text-3xl text-center">{lesson.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-gray-600 text-lg">{lesson.description}</p>
            
            <div className="grid grid-cols-3 gap-4 py-6">
              <div className="text-center">
                <div className="text-3xl mb-2">📝</div>
                <div className="text-2xl font-bold text-blue-600">{lesson.exercises.length}</div>
                <div className="text-sm text-gray-600">Exercises</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">❤️</div>
                <div className="text-2xl font-bold text-red-600">{lesson.hearts}</div>
                <div className="text-sm text-gray-600">Hearts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-2xl font-bold text-yellow-600">{lesson.xpReward}</div>
                <div className="text-sm text-gray-600">XP Reward</div>
              </div>
            </div>

            <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Tips:</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>✓ Jawab semua pertanyaan dengan benar untuk mendapat XP maksimal</li>
                <li>✓ Kamu punya {lesson.hearts} hearts - jangan sampai habis!</li>
                <li>✓ Gunakan hint jika kesulitan</li>
              </ul>
            </div>

            <Button 
              onClick={startLesson}
              className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Mulai Belajar
            </Button>
            
            <Button 
              onClick={() => router.back()}
              variant="ghost"
              className="w-full"
            >
              Kembali
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hearts === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-12 text-center space-y-4">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-bold text-gray-900">Hearts Habis!</h2>
            <p className="text-gray-600">Kamu kehabisan hearts. Coba lagi nanti atau ulangi pelajaran.</p>
            <div className="space-y-2">
              <Button onClick={() => router.back()} className="w-full">
                Kembali ke Course
              </Button>
              <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
                Coba Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentExercise = lesson.exercises[currentExerciseIndex];
  const progress = ((currentExerciseIndex + 1) / lesson.exercises.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Exit
            </Button>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {Array.from({ length: hearts }).map((_, i) => (
                  <Heart key={i} className="h-5 w-5 text-red-500 fill-red-500" />
                ))}
                {Array.from({ length: lesson.hearts - hearts }).map((_, i) => (
                  <Heart key={i} className="h-5 w-5 text-gray-300" />
                ))}
              </div>
              <div className="flex items-center space-x-1 bg-yellow-100 px-3 py-1 rounded-full">
                <Zap className="h-4 w-4 text-yellow-600" />
                <span className="font-semibold text-yellow-900">{totalXP} XP</span>
              </div>
            </div>
          </div>
          
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-gray-600 mt-2">
            Pertanyaan {currentExerciseIndex + 1} dari {lesson.exercises.length}
          </p>
        </div>

        {/* Exercise Card */}
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{currentExercise.question}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(!showHint)}
                className="text-blue-600"
              >
                <Lightbulb className="h-4 w-4 mr-1" />
                Hint
              </Button>
            </div>
            {showHint && currentExercise.hints && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-900">
                💡 {typeof currentExercise.hints === 'string' 
                  ? JSON.parse(currentExercise.hints)[0] 
                  : currentExercise.hints[0]}
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Multiple Choice */}
            {currentExercise.type === 'MULTIPLE_CHOICE' && currentExercise.options && (
              <div className="space-y-3">
                {JSON.parse(currentExercise.options as any).map((option: string, index: number) => (
                  <Button
                    key={index}
                    onClick={() => setUserAnswer(option)}
                    variant={userAnswer === option ? "default" : "outline"}
                    className="w-full h-auto py-4 text-left justify-start text-base"
                    disabled={showResult}
                  >
                    <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Button>
                ))}
              </div>
            )}

            {/* Fill in the Blank / Translation */}
            {(currentExercise.type === 'FILL_IN_BLANK' || currentExercise.type === 'TRANSLATION') && (
              <div>
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Ketik jawaban Anda..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                  disabled={showResult}
                  onKeyPress={(e) => e.key === 'Enter' && !showResult && handleSubmitAnswer()}
                />
              </div>
            )}

            {/* Result */}
            {showResult && (
              <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
                <div className="flex items-start space-x-3">
                  {isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-2 ${isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                      {isCorrect ? '🎉 Benar!' : '❌ Salah'}
                    </h3>
                    {!isCorrect && (
                      <p className="text-red-800 mb-2">
                        Jawaban yang benar: <strong>{currentExercise.correctAnswer}</strong>
                      </p>
                    )}
                    <p className={isCorrect ? 'text-green-800' : 'text-red-800'}>
                      {currentExercise.explanation}
                    </p>
                    {isCorrect && (
                      <div className="mt-2 flex items-center space-x-2 text-yellow-700">
                        <Zap className="h-4 w-4" />
                        <span className="font-semibold">+{currentExercise.xpReward} XP</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {!showResult ? (
                <>
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!userAnswer.trim()}
                    className="flex-1 h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Cek Jawaban
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleNext}
                  className="flex-1 h-12 text-lg bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                >
                  {currentExerciseIndex < lesson.exercises.length - 1 ? 'Lanjut' : 'Selesai'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

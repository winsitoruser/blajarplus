'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, TrendingUp, Flame, Star, Trophy, Target, BookOpen, Clock, CreditCard, Calendar } from 'lucide-react';
import api from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Gamification data
  const [userStats, setUserStats] = useState({
    totalXP: 2450,
    level: 12,
    streak: 7,
    longestStreak: 15,
    totalLessons: 24,
    hoursLearned: 48,
    achievements: 8,
    rank: 'Gold'
  });

  const [achievements, setAchievements] = useState([
    { id: 1, name: 'First Step', description: 'Complete your first lesson', icon: '🎯', unlocked: true, date: '2024-12-01' },
    { id: 2, name: 'Week Warrior', description: 'Maintain 7-day streak', icon: '🔥', unlocked: true, date: '2024-12-15' },
    { id: 3, name: 'Knowledge Seeker', description: 'Complete 10 lessons', icon: '📚', unlocked: true, date: '2024-12-20' },
    { id: 4, name: 'Early Bird', description: 'Complete lesson before 8 AM', icon: '🌅', unlocked: true, date: '2024-12-10' },
    { id: 5, name: 'Night Owl', description: 'Complete lesson after 10 PM', icon: '🦉', unlocked: true, date: '2024-12-12' },
    { id: 6, name: 'Perfect Score', description: 'Get 100% in a lesson', icon: '💯', unlocked: true, date: '2024-12-18' },
    { id: 7, name: 'Social Learner', description: 'Study with 5 different tutors', icon: '👥', unlocked: true, date: '2024-12-22' },
    { id: 8, name: 'Dedicated', description: 'Complete 20 lessons', icon: '⭐', unlocked: true, date: '2024-12-25' },
    { id: 9, name: 'Marathon', description: 'Study for 3 hours in one day', icon: '🏃', unlocked: false, date: null },
    { id: 10, name: 'Master', description: 'Reach level 20', icon: '👑', unlocked: false, date: null },
    { id: 11, name: 'Unstoppable', description: 'Maintain 30-day streak', icon: '🚀', unlocked: false, date: null },
    { id: 12, name: 'Scholar', description: 'Complete 50 lessons', icon: '🎓', unlocked: false, date: null }
  ]);

  const [payments, setPayments] = useState([
    { id: 1, date: '2024-12-28', description: 'Matematika - Budi Santoso', amount: 150000, status: 'completed', method: 'GoPay' },
    { id: 2, date: '2024-12-25', description: 'Bahasa Inggris - Siti Nurhaliza', amount: 200000, status: 'completed', method: 'OVO' },
    { id: 3, date: '2024-12-20', description: 'Fisika - Andi Wijaya', amount: 175000, status: 'completed', method: 'Bank Transfer' },
    { id: 4, date: '2024-12-15', description: 'Kimia - Dewi Lestari', amount: 180000, status: 'completed', method: 'GoPay' },
    { id: 5, date: '2024-12-10', description: 'Matematika - Budi Santoso', amount: 150000, status: 'completed', method: 'OVO' }
  ]);

  const [learningHistory, setLearningHistory] = useState([
    { id: 1, date: '2024-12-28', subject: 'Matematika', tutor: 'Budi Santoso', duration: 2, rating: 5, xpEarned: 100, notes: 'Excellent session on calculus' },
    { id: 2, date: '2024-12-27', subject: 'Bahasa Inggris', tutor: 'Siti Nurhaliza', duration: 1.5, rating: 5, xpEarned: 75, notes: 'Great conversation practice' },
    { id: 3, date: '2024-12-26', subject: 'Fisika', tutor: 'Andi Wijaya', duration: 2, rating: 4, xpEarned: 100, notes: 'Good explanation on mechanics' },
    { id: 4, date: '2024-12-25', subject: 'Matematika', tutor: 'Budi Santoso', duration: 2, rating: 5, xpEarned: 100, notes: 'Trigonometry mastered!' },
    { id: 5, date: '2024-12-24', subject: 'Kimia', tutor: 'Dewi Lestari', duration: 1.5, rating: 5, xpEarned: 75, notes: 'Chemical reactions explained well' }
  ]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Redirect tutor to tutor dashboard
      if (parsedUser.role === 'tutor') {
        router.push('/dashboard/tutor');
        return;
      }
    }

    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Use mock data if backend is not available
      const mockBookings = [
        {
          id: '1',
          status: 'confirmed',
          subject: { name: 'Matematika' },
          duration: 2,
          scheduledAt: new Date().toISOString(),
          totalAmount: 150000,
          tutor: {
            user: { fullName: 'Budi Santoso' }
          },
          student: { fullName: 'Ahmad Rizki' }
        },
        {
          id: '2',
          status: 'pending',
          subject: { name: 'Bahasa Inggris' },
          duration: 1.5,
          scheduledAt: new Date(Date.now() + 86400000).toISOString(),
          totalAmount: 100000,
          tutor: {
            user: { fullName: 'Siti Nurhaliza' }
          },
          student: { fullName: 'Dewi Lestari' }
        },
        {
          id: '3',
          status: 'completed',
          subject: { name: 'Fisika' },
          duration: 2,
          scheduledAt: new Date(Date.now() - 86400000).toISOString(),
          totalAmount: 180000,
          tutor: {
            user: { fullName: 'Andi Wijaya' }
          },
          student: { fullName: 'Rina Susanti' }
        }
      ];
      setBookings(mockBookings);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-green-100 text-green-700',
      completed: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusText = (status: string) => {
    const texts: any = {
      pending: 'Menunggu Konfirmasi',
      confirmed: 'Dikonfirmasi',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const getXPForNextLevel = () => {
    return userStats.level * 250;
  };

  const getCurrentLevelXP = () => {
    return userStats.totalXP % 250;
  };

  const getProgressPercentage = () => {
    return (getCurrentLevelXP() / getXPForNextLevel()) * 100;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header with Level & XP */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard Belajar</h1>
                <p className="text-gray-600">
                  Selamat datang kembali, {user?.fullName}! 🎉
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  <span className="text-2xl font-bold text-gray-800">Level {userStats.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium text-gray-600">{userStats.totalXP} XP</span>
                </div>
              </div>
            </div>
            
            {/* XP Progress Bar */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Progress ke Level {userStats.level + 1}</span>
                <span className="text-sm font-bold text-purple-600">{getCurrentLevelXP()} / {getXPForNextLevel()} XP</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 px-2 font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`pb-3 px-2 font-medium transition-colors ${
                  activeTab === 'achievements'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Achievements
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`pb-3 px-2 font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Riwayat Belajar
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`pb-3 px-2 font-medium transition-colors ${
                  activeTab === 'payments'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Pembayaran
              </button>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Gamification Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Flame className="w-8 h-8" />
                      <div className="text-right">
                        <div className="text-3xl font-bold">{userStats.streak}</div>
                        <div className="text-sm opacity-90">Day Streak</div>
                      </div>
                    </div>
                    <div className="text-xs opacity-75 mt-2">Longest: {userStats.longestStreak} days 🔥</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <BookOpen className="w-8 h-8" />
                      <div className="text-right">
                        <div className="text-3xl font-bold">{userStats.totalLessons}</div>
                        <div className="text-sm opacity-90">Total Lessons</div>
                      </div>
                    </div>
                    <div className="text-xs opacity-75 mt-2">Keep learning! 📚</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Clock className="w-8 h-8" />
                      <div className="text-right">
                        <div className="text-3xl font-bold">{userStats.hoursLearned}</div>
                        <div className="text-sm opacity-90">Hours Learned</div>
                      </div>
                    </div>
                    <div className="text-xs opacity-75 mt-2">Time well spent! ⏰</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Award className="w-8 h-8" />
                      <div className="text-right">
                        <div className="text-3xl font-bold">{userStats.achievements}</div>
                        <div className="text-sm opacity-90">Achievements</div>
                      </div>
                    </div>
                    <div className="text-xs opacity-75 mt-2">Rank: {userStats.rank} 🏆</div>
                  </CardContent>
                </Card>
              </div>

              {/* Booking Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-600 mb-1">Total Booking</div>
                <div className="text-3xl font-bold">{bookings.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-600 mb-1">Menunggu</div>
                <div className="text-3xl font-bold text-yellow-600">
                  {bookings.filter(b => b.status === 'pending').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-600 mb-1">Dikonfirmasi</div>
                <div className="text-3xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-600 mb-1">Selesai</div>
                <div className="text-3xl font-bold text-blue-600">
                  {bookings.filter(b => b.status === 'completed').length}
                </div>
              </CardContent>
            </Card>
          </div>

              {/* Recent Achievements */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  Achievement Terbaru
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {achievements.filter(a => a.unlocked).slice(0, 4).map(achievement => (
                    <Card key={achievement.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-4xl mb-2">{achievement.icon}</div>
                        <div className="font-semibold text-sm mb-1">{achievement.name}</div>
                        <div className="text-xs text-gray-600">{achievement.description}</div>
                        <div className="text-xs text-gray-500 mt-2">{new Date(achievement.date!).toLocaleDateString('id-ID')}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Aksi Cepat</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/search">
                <Card className="hover:shadow-md transition cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-2">🔍</div>
                    <div className="font-medium">Cari Tutor</div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/bookings">
                <Card className="hover:shadow-md transition cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-2">📅</div>
                    <div className="font-medium">Lihat Booking</div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/chat">
                <Card className="hover:shadow-md transition cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-2">💬</div>
                    <div className="font-medium">Pesan</div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

              {/* Recent Bookings */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Booking Terbaru</h2>
              <Link href="/bookings">
                <Button variant="outline" size="sm">Lihat Semua</Button>
              </Link>
            </div>

            {bookings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold mb-2">Belum ada booking</h3>
                  <p className="text-gray-600 mb-4">
                    Mulai cari tutor dan buat booking pertama Anda
                  </p>
                  <Link href="/search">
                    <Button>Cari Tutor</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking: any) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            {user?.role === 'student' ? (
                              <span className="text-xl">
                                {booking.tutor.user.fullName.charAt(0)}
                              </span>
                            ) : (
                              <span className="text-xl">
                                {booking.student.fullName.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">
                              {user?.role === 'student' 
                                ? booking.tutor.user.fullName 
                                : booking.student.fullName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {booking.subject.name} • {booking.duration} jam
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(booking.scheduledAt).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(booking.status)}`}>
                            {getStatusText(booking.status)}
                          </span>
                          <div className="mt-2 font-semibold text-primary-500">
                            Rp {booking.totalAmount.toLocaleString('id-ID')}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
            </>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Pencapaian Kamu</h2>
                <p className="text-gray-600">Kumpulkan semua achievement dan raih level tertinggi!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {achievements.map(achievement => (
                  <Card 
                    key={achievement.id} 
                    className={`${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300' 
                        : 'bg-gray-50 opacity-60'
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`text-5xl ${
                          achievement.unlocked ? '' : 'grayscale opacity-50'
                        }`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{achievement.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                          {achievement.unlocked ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                ✓ Unlocked
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(achievement.date!).toLocaleDateString('id-ID')}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-medium">
                              🔒 Locked
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Learning History Tab */}
          {activeTab === 'history' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Riwayat Belajar</h2>
                <p className="text-gray-600">Lihat semua sesi belajar yang sudah kamu selesaikan</p>
              </div>

              <div className="space-y-4">
                {learningHistory.map(session => (
                  <Card key={session.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {session.tutor.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-lg">{session.subject}</h3>
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                                +{session.xpEarned} XP
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">dengan {session.tutor}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(session.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {session.duration} jam
                              </span>
                            </div>
                            {session.notes && (
                              <p className="text-sm text-gray-600 mt-2 italic">"{session.notes}"</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${
                                  i < session.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">{session.rating}/5</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Riwayat Pembayaran</h2>
                <p className="text-gray-600">Semua transaksi pembayaran kamu</p>
              </div>

              {/* Payment Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm opacity-90 mb-1">Total Pengeluaran</div>
                        <div className="text-2xl font-bold">
                          Rp {payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString('id-ID')}
                        </div>
                      </div>
                      <CreditCard className="w-10 h-10 opacity-80" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="text-sm text-gray-600 mb-1">Total Transaksi</div>
                    <div className="text-3xl font-bold">{payments.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="text-sm text-gray-600 mb-1">Rata-rata per Transaksi</div>
                    <div className="text-2xl font-bold">
                      Rp {Math.round(payments.reduce((sum, p) => sum + p.amount, 0) / payments.length).toLocaleString('id-ID')}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment List */}
              <Card>
                <CardHeader>
                  <CardTitle>Daftar Transaksi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {payments.map(payment => (
                      <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium">{payment.description}</div>
                            <div className="text-sm text-gray-600">
                              {new Date(payment.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{payment.method}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-lg text-gray-800">
                            Rp {payment.amount.toLocaleString('id-ID')}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            payment.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {payment.status === 'completed' ? '✓ Berhasil' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

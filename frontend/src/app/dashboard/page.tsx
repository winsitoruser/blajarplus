'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, TrendingUp, Flame, Star, Trophy, Target, BookOpen, Clock, CreditCard, Calendar, User, Camera, Phone, Mail, Lock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import BannerCarousel from '@/components/BannerCarousel';
import api from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    province: '',
    bio: ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Carousel state
  const [currentBanner, setCurrentBanner] = useState(0);
  
  // Banner data
  const banners = [
    {
      id: 1,
      title: 'Tingkatkan Skill Belajarmu!',
      subtitle: 'Belajar dengan tutor profesional dan berpengalaman',
      bgGradient: 'from-blue-500 to-indigo-600',
      icon: '📚',
      cta: 'Cari Tutor',
      link: '/search'
    },
    {
      id: 2,
      title: 'Raih Achievement Baru!',
      subtitle: 'Kumpulkan XP dan unlock badge eksklusif',
      bgGradient: 'from-purple-500 to-pink-600',
      icon: '🏆',
      cta: 'Lihat Achievement',
      link: '#achievements'
    },
    {
      id: 3,
      title: 'Promo Spesial Hari Ini!',
      subtitle: 'Diskon 20% untuk semua paket belajar',
      bgGradient: 'from-orange-500 to-red-600',
      icon: '🎉',
      cta: 'Lihat Promo',
      link: '/search'
    },
    {
      id: 4,
      title: 'Streak 7 Hari Berturut!',
      subtitle: 'Pertahankan konsistensi belajarmu',
      bgGradient: 'from-green-500 to-teal-600',
      icon: '🔥',
      cta: 'Lanjutkan Belajar',
      link: '/search'
    }
  ];
  
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

    fetchUserProfile();
    fetchBookings();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000); // Change banner every 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToBanner = (index: number) => {
    setCurrentBanner(index);
  };

  // Update profile form when user data changes
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || '',
        province: user.province || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/users/me');
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Redirect tutor to tutor dashboard
      if (userData.role === 'tutor') {
        router.push('/dashboard/tutor');
        return;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Fallback to localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await api.put('/users/me', profileData);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      setMessage({ type: 'success', text: 'Profile berhasil diperbarui!' });
      
      // Refresh user data
      await fetchUserProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Gagal memperbarui profile' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Password baru dan konfirmasi tidak cocok' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password minimal 8 karakter' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      await api.post('/users/me/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setMessage({ type: 'success', text: 'Password berhasil diperbarui!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Error updating password:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Gagal memperbarui password' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Ukuran file maksimal 2MB' });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'File harus berupa gambar' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setMessage({ type: 'success', text: 'Foto profile berhasil diupload!' });
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      await fetchUserProfile();
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Gagal mengupload foto' 
      });
    } finally {
      setSaving(false);
    }
  };

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
          {/* Banner Carousel - Dynamic from Admin */}
          <div className="mb-8">
            <BannerCarousel userRole="student" />
          </div>

          {/* Header with Level & XP */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                {/* Profile Avatar */}
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      user?.fullName?.charAt(0) || 'U'
                    )}
                  </div>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition"
                  >
                    <Camera className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-1">Dashboard Belajar</h1>
                  <p className="text-gray-600">
                    Selamat datang kembali, {user?.fullName}! 🎉
                  </p>
                </div>
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
              <button
                onClick={() => setActiveTab('profile')}
                className={`pb-3 px-2 font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile
              </button>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Hero Stats Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Stats Card */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-indigo-100 text-sm font-medium mb-1">Progress Belajar Kamu</p>
                        <h3 className="text-3xl font-bold">Level {userStats.level}</h3>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                        <Trophy className="w-10 h-10" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-indigo-100">Progress ke Level {userStats.level + 1}</span>
                        <span className="font-semibold">{getCurrentLevelXP()} / {getXPForNextLevel()} XP</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2.5">
                        <div 
                          className="bg-white h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${getProgressPercentage()}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 divide-x divide-gray-100">
                    <div className="p-4 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-2">
                        <Flame className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{userStats.streak}</div>
                      <div className="text-xs text-gray-500 mt-1">Day Streak</div>
                    </div>
                    <div className="p-4 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-2">
                        <BookOpen className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{userStats.totalLessons}</div>
                      <div className="text-xs text-gray-500 mt-1">Lessons</div>
                    </div>
                    <div className="p-4 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-2">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{userStats.hoursLearned}</div>
                      <div className="text-xs text-gray-500 mt-1">Hours</div>
                    </div>
                    <div className="p-4 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-2">
                        <Award className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{userStats.achievements}</div>
                      <div className="text-xs text-gray-500 mt-1">Badges</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Aksi Cepat</h3>
                  <div className="space-y-3">
                    <Link href="/search">
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition cursor-pointer group">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition">
                          <span className="text-2xl">🔍</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Cari Tutor</div>
                          <div className="text-xs text-gray-500">Temukan tutor terbaik</div>
                        </div>
                      </div>
                    </Link>
                    <Link href="/bookings">
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition cursor-pointer group">
                        <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition">
                          <span className="text-2xl">📅</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Booking Saya</div>
                          <div className="text-xs text-gray-500">Kelola jadwal belajar</div>
                        </div>
                      </div>
                    </Link>
                    <Link href="/chat">
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition cursor-pointer group">
                        <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition">
                          <span className="text-2xl">💬</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Pesan</div>
                          <div className="text-xs text-gray-500">Chat dengan tutor</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Achievements & Bookings Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Achievements */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      Achievement Terbaru
                    </h3>
                    <button 
                      onClick={() => setActiveTab('achievements')}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Lihat Semua
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {achievements.filter(a => a.unlocked).slice(0, 4).map(achievement => (
                      <div key={achievement.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 text-center hover:scale-105 transition">
                        <div className="text-4xl mb-2">{achievement.icon}</div>
                        <div className="font-semibold text-sm text-gray-900">{achievement.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{new Date(achievement.date!).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Stats */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-5">Statistik Belajar</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Total Pengeluaran</div>
                          <div className="text-lg font-bold text-gray-900">Rp {payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString('id-ID')}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Longest Streak</div>
                          <div className="text-lg font-bold text-gray-900">{userStats.longestStreak} Hari</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Rank</div>
                          <div className="text-lg font-bold text-gray-900">{userStats.rank}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-gray-900">Booking Terbaru</h3>
                  <Link href="/bookings">
                    <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                      Lihat Semua
                    </Button>
                  </Link>
                </div>

                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                      <span className="text-4xl">📚</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Belum ada booking</h4>
                    <p className="text-gray-500 mb-4">Mulai cari tutor dan buat booking pertama Anda</p>
                    <Link href="/search">
                      <Button className="bg-indigo-600 hover:bg-indigo-700">Cari Tutor Sekarang</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.slice(0, 3).map((booking: any) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md">
                            {user?.role === 'student' 
                              ? booking.tutor.user.fullName.charAt(0)
                              : booking.student.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {user?.role === 'student' 
                                ? booking.tutor.user.fullName 
                                : booking.student.fullName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {booking.subject.name} • {booking.duration} jam
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {new Date(booking.scheduledAt).toLocaleDateString('id-ID', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(booking.status)}`}>
                            {getStatusText(booking.status)}
                          </span>
                          <div className="mt-1.5 font-bold text-gray-900">
                            Rp {booking.totalAmount.toLocaleString('id-ID')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
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

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Manajemen Profile</h2>
                <p className="text-gray-600">Kelola informasi pribadi dan keamanan akun Anda</p>
              </div>

              {/* Success/Error Message */}
              {message && (
                <div className={`mb-6 p-4 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Photo Section */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Foto Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col items-center">
                        <div className="relative mb-4">
                          <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                            {user?.avatarUrl ? (
                              <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              user?.fullName?.charAt(0) || 'U'
                            )}
                          </div>
                          <button className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition">
                            <Camera className="w-5 h-5 text-white" />
                          </button>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{user?.fullName}</h3>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="file"
                          id="avatar-upload"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarUpload}
                        />
                        <Button 
                          type="button"
                          onClick={() => document.getElementById('avatar-upload')?.click()}
                          disabled={saving}
                          className="w-full bg-indigo-600 hover:bg-indigo-700"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          {saving ? 'Uploading...' : 'Upload Foto Baru'}
                        </Button>
                        <Button 
                          type="button"
                          variant="outline" 
                          className="w-full"
                          disabled={saving}
                        >
                          Hapus Foto
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        Format: JPG, PNG. Maksimal 2MB
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Personal Information Section */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Basic Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-600" />
                        Informasi Pribadi
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nama Lengkap
                            </label>
                            <Input
                              type="text"
                              value={profileData.fullName}
                              onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                              placeholder="Masukkan nama lengkap"
                              className="w-full"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nomor Handphone
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                type="tel"
                                value={profileData.phone}
                                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                placeholder="+62 812 3456 7890"
                                className="w-full pl-10"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                              placeholder="email@example.com"
                              className="w-full pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Alamat
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <textarea
                              value={profileData.address}
                              onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                              placeholder="Masukkan alamat lengkap"
                              className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              rows={3}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Kota
                            </label>
                            <Input
                              type="text"
                              value={profileData.city}
                              onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                              placeholder="Kota"
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Provinsi
                            </label>
                            <Input
                              type="text"
                              value={profileData.province}
                              onChange={(e) => setProfileData({...profileData, province: e.target.value})}
                              placeholder="Provinsi"
                              className="w-full"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                          </label>
                          <textarea
                            value={profileData.bio}
                            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                            placeholder="Ceritakan tentang diri Anda..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            rows={4}
                          />
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => fetchUserProfile()}
                            disabled={saving}
                          >
                            Batal
                          </Button>
                          <Button 
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700"
                            disabled={saving}
                          >
                            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Security Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Lock className="w-5 h-5 text-indigo-600" />
                        Keamanan Akun
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handlePasswordUpdate} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password Saat Ini
                          </label>
                          <Input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                            placeholder="Masukkan password saat ini"
                            className="w-full"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password Baru
                          </label>
                          <Input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            placeholder="Masukkan password baru"
                            className="w-full"
                            required
                            minLength={8}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Konfirmasi Password Baru
                          </label>
                          <Input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            placeholder="Konfirmasi password baru"
                            className="w-full"
                            required
                            minLength={8}
                          />
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-800">
                            <strong>Tips Keamanan:</strong> Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol. Minimal 8 karakter.
                          </p>
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })}
                            disabled={saving}
                          >
                            Batal
                          </Button>
                          <Button 
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700"
                            disabled={saving}
                          >
                            {saving ? 'Memperbarui...' : 'Update Password'}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

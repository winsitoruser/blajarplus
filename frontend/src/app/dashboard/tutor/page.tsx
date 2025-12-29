'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';

export default function TutorDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Services/Classes State
  const [services, setServices] = useState<any[]>([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  // Testimonials State
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);

  // Wallet State
  const [balance, setBalance] = useState(0);
  const [pendingBalance, setPendingBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalEarnings: 0,
    activeStudents: 0,
    completedSessions: 0,
  });

  // Active Students & Sessions State
  const [activeStudents, setActiveStudents] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);

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
      
      if (parsedUser.role !== 'tutor') {
        router.push('/dashboard');
        return;
      }
    }

    loadMockData();
  }, []);

  const loadMockData = () => {
    // Mock Services
    setServices([
      {
        id: '1',
        subject: 'Matematika',
        level: 'SMA',
        pricePerHour: 150000,
        packagePrices: {
          single: 150000,
          package5: 700000,
          package10: 1300000,
        },
        offerFreeTrial: true,
        freeTrialDuration: 1,
        discount: 10,
        description: 'Belajar matematika SMA dengan metode yang mudah dipahami',
        isActive: true,
      },
      {
        id: '2',
        subject: 'Fisika',
        level: 'SMA',
        pricePerHour: 175000,
        packagePrices: {
          single: 175000,
          package5: 825000,
          package10: 1550000,
        },
        offerFreeTrial: false,
        discount: 0,
        description: 'Fisika SMA dengan pendekatan praktis dan eksperimen',
        isActive: true,
      },
    ]);

    // Mock Testimonials
    setTestimonials([
      {
        id: '1',
        studentName: 'Ahmad Rizki',
        rating: 5,
        comment: 'Guru yang sangat sabar dan menjelaskan dengan detail!',
        date: '2024-12-20',
        subject: 'Matematika',
        isApproved: true,
      },
      {
        id: '2',
        studentName: 'Siti Nurhaliza',
        rating: 4,
        comment: 'Metode mengajarnya bagus, mudah dipahami',
        date: '2024-12-18',
        subject: 'Fisika',
        isApproved: true,
      },
      {
        id: '3',
        studentName: 'Budi Santoso',
        rating: 5,
        comment: 'Sangat membantu dalam memahami materi yang sulit',
        date: '2024-12-25',
        subject: 'Matematika',
        isApproved: false,
      },
    ]);

    // Mock Wallet
    setBalance(2500000);
    setPendingBalance(750000);
    setTransactions([
      {
        id: '1',
        type: 'earning',
        amount: 150000,
        description: 'Pembayaran dari Ahmad Rizki - Matematika',
        date: '2024-12-28',
        status: 'completed',
      },
      {
        id: '2',
        type: 'earning',
        amount: 175000,
        description: 'Pembayaran dari Siti Nurhaliza - Fisika',
        date: '2024-12-27',
        status: 'completed',
      },
      {
        id: '3',
        type: 'withdrawal',
        amount: -500000,
        description: 'Penarikan ke Bank BCA',
        date: '2024-12-26',
        status: 'completed',
      },
      {
        id: '4',
        type: 'earning',
        amount: 300000,
        description: 'Pembayaran dari Dewi Lestari - Matematika (Paket 5)',
        date: '2024-12-25',
        status: 'pending',
      },
    ]);

    // Mock Stats
    setStats({
      totalBookings: 45,
      totalEarnings: 6750000,
      activeStudents: 12,
      completedSessions: 38,
    });

    // Mock Active Students with package details
    setActiveStudents([
      {
        id: '1',
        name: 'Ahmad Rizki',
        email: 'ahmad@example.com',
        avatar: 'AR',
        subject: 'Matematika',
        packageType: 'package10',
        totalSessions: 10,
        completedSessions: 3,
        remainingSessions: 7,
        nextSession: '2024-12-30T10:00:00',
        lastSession: '2024-12-28T10:00:00',
        totalPaid: 1300000,
        status: 'active',
      },
      {
        id: '2',
        name: 'Siti Nurhaliza',
        email: 'siti@example.com',
        avatar: 'SN',
        subject: 'Fisika',
        packageType: 'package5',
        totalSessions: 5,
        completedSessions: 2,
        remainingSessions: 3,
        nextSession: '2024-12-31T14:00:00',
        lastSession: '2024-12-27T14:00:00',
        totalPaid: 825000,
        status: 'active',
      },
      {
        id: '3',
        name: 'Budi Santoso',
        email: 'budi@example.com',
        avatar: 'BS',
        subject: 'Matematika',
        packageType: 'single',
        totalSessions: 1,
        completedSessions: 0,
        remainingSessions: 1,
        nextSession: '2025-01-02T09:00:00',
        lastSession: null,
        totalPaid: 150000,
        status: 'active',
      },
      {
        id: '4',
        name: 'Dewi Lestari',
        email: 'dewi@example.com',
        avatar: 'DL',
        subject: 'Matematika',
        packageType: 'package10',
        totalSessions: 10,
        completedSessions: 8,
        remainingSessions: 2,
        nextSession: '2025-01-03T16:00:00',
        lastSession: '2024-12-29T16:00:00',
        totalPaid: 1300000,
        status: 'active',
      },
      {
        id: '5',
        name: 'Rina Susanti',
        email: 'rina@example.com',
        avatar: 'RS',
        subject: 'Fisika',
        packageType: 'package5',
        totalSessions: 5,
        completedSessions: 1,
        remainingSessions: 4,
        nextSession: '2025-01-04T11:00:00',
        lastSession: '2024-12-26T11:00:00',
        totalPaid: 825000,
        status: 'active',
      },
    ]);

    // Mock Upcoming Sessions
    setUpcomingSessions([
      {
        id: 's1',
        studentName: 'Ahmad Rizki',
        subject: 'Matematika',
        scheduledAt: '2024-12-30T10:00:00',
        duration: 2,
        type: 'online',
        sessionNumber: 4,
        totalSessions: 10,
        meetingLink: 'https://meet.google.com/abc-defg-hij',
      },
      {
        id: 's2',
        studentName: 'Siti Nurhaliza',
        subject: 'Fisika',
        scheduledAt: '2024-12-31T14:00:00',
        duration: 1.5,
        type: 'online',
        sessionNumber: 3,
        totalSessions: 5,
        meetingLink: 'https://meet.google.com/xyz-uvwx-yz',
      },
      {
        id: 's3',
        studentName: 'Budi Santoso',
        subject: 'Matematika',
        scheduledAt: '2025-01-02T09:00:00',
        duration: 2,
        type: 'offline',
        sessionNumber: 1,
        totalSessions: 1,
        location: 'Cafe Kopi, Jakarta Selatan',
      },
      {
        id: 's4',
        studentName: 'Dewi Lestari',
        subject: 'Matematika',
        scheduledAt: '2025-01-03T16:00:00',
        duration: 2,
        type: 'online',
        sessionNumber: 9,
        totalSessions: 10,
        meetingLink: 'https://meet.google.com/klm-nopq-rst',
      },
    ]);

    // Mock Active Sessions (happening today)
    setActiveSessions([
      {
        id: 'as1',
        studentName: 'Ahmad Rizki',
        subject: 'Matematika',
        scheduledAt: new Date().toISOString(),
        duration: 2,
        type: 'online',
        status: 'in-progress',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
      },
    ]);

    setLoading(false);
  };

  const ServiceForm = ({ service, onClose }: any) => {
    const [formData, setFormData] = useState(service || {
      subject: '',
      level: '',
      pricePerHour: 0,
      packagePrices: {
        single: 0,
        package5: 0,
        package10: 0,
      },
      offerFreeTrial: false,
      freeTrialDuration: 1,
      discount: 0,
      description: '',
      isActive: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (service) {
        setServices(services.map(s => s.id === service.id ? { ...formData, id: service.id } : s));
      } else {
        setServices([...services, { ...formData, id: Date.now().toString() }]);
      }
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{service ? 'Edit' : 'Tambah'} Layanan/Kelas</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <span className="text-2xl">×</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mata Pelajaran</label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Matematika, Fisika, dll"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tingkat</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  >
                    <option value="">Pilih Tingkat</option>
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA">SMA</option>
                    <option value="Universitas">Universitas</option>
                  </select>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="font-semibold mb-3">Harga & Paket</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Harga Per Jam</label>
                    <Input
                      type="number"
                      value={formData.pricePerHour}
                      onChange={(e) => {
                        const price = parseInt(e.target.value);
                        setFormData({
                          ...formData,
                          pricePerHour: price,
                          packagePrices: {
                            single: price,
                            package5: price * 5 * 0.95,
                            package10: price * 10 * 0.9,
                          }
                        });
                      }}
                      placeholder="150000"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Paket 5 Sesi (5% off)</label>
                    <Input
                      type="number"
                      value={formData.packagePrices.package5}
                      onChange={(e) => setFormData({
                        ...formData,
                        packagePrices: { ...formData.packagePrices, package5: parseInt(e.target.value) }
                      })}
                      placeholder="700000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Paket 10 Sesi (10% off)</label>
                    <Input
                      type="number"
                      value={formData.packagePrices.package10}
                      onChange={(e) => setFormData({
                        ...formData,
                        packagePrices: { ...formData.packagePrices, package10: parseInt(e.target.value) }
                      })}
                      placeholder="1300000"
                    />
                  </div>
                </div>
              </div>

              {/* Free Trial */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    checked={formData.offerFreeTrial}
                    onChange={(e) => setFormData({ ...formData, offerFreeTrial: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label className="font-semibold">Tawarkan Free Trial</label>
                </div>
                {formData.offerFreeTrial && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Durasi Free Trial (jam)</label>
                      <Input
                        type="number"
                        value={formData.freeTrialDuration}
                        onChange={(e) => setFormData({ ...formData, freeTrialDuration: parseInt(e.target.value) })}
                        min="0.5"
                        step="0.5"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-medium mb-2">Diskon (%)</label>
                <Input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) })}
                  min="0"
                  max="100"
                  placeholder="0"
                />
                <p className="text-sm text-gray-500 mt-1">Diskon akan diterapkan pada semua harga</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  placeholder="Jelaskan tentang kelas/layanan Anda..."
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="font-medium">Aktifkan layanan ini</label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {service ? 'Update' : 'Tambah'} Layanan
                </Button>
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const WithdrawModal = ({ onClose }: any) => {
    const [amount, setAmount] = useState('');
    const [bankAccount, setBankAccount] = useState('');

    const handleWithdraw = (e: React.FormEvent) => {
      e.preventDefault();
      const withdrawAmount = parseInt(amount);
      if (withdrawAmount > balance) {
        alert('Saldo tidak mencukupi');
        return;
      }
      setBalance(balance - withdrawAmount);
      setTransactions([
        {
          id: Date.now().toString(),
          type: 'withdrawal',
          amount: -withdrawAmount,
          description: `Penarikan ke ${bankAccount}`,
          date: new Date().toISOString().split('T')[0],
          status: 'pending',
        },
        ...transactions,
      ]);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Tarik Saldo</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <span className="text-2xl">×</span>
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="text-sm text-blue-600 mb-1">Saldo Tersedia</div>
              <div className="text-2xl font-bold text-blue-700">
                Rp {balance.toLocaleString('id-ID')}
              </div>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Jumlah Penarikan</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="500000"
                  min="50000"
                  max={balance}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Minimal penarikan Rp 50.000</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Rekening Bank</label>
                <select
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Pilih Rekening</option>
                  <option value="Bank BCA - 1234567890">Bank BCA - 1234567890</option>
                  <option value="Bank Mandiri - 0987654321">Bank Mandiri - 0987654321</option>
                  <option value="Bank BNI - 1122334455">Bank BNI - 1122334455</option>
                </select>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-700">
                  Penarikan akan diproses dalam 1-3 hari kerja
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1">Tarik Saldo</Button>
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  Dashboard Tutor
                </h1>
                <p className="text-gray-600 text-lg">Kelola layanan, testimonial, dan keuangan Anda</p>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-600">Selamat datang kembali,</div>
                  <div className="font-semibold text-lg">{user?.fullName}</div>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {user?.fullName?.charAt(0)}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                    +5 bulan ini
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-1 font-medium">Total Booking</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  {stats.totalBookings}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                    Semua waktu
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-1 font-medium">Total Pendapatan</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Rp {stats.totalEarnings.toLocaleString('id-ID')}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                    Bulan ini
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-1 font-medium">Siswa Aktif</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                  {stats.activeStudents}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                    Total
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-1 font-medium">Sesi Selesai</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                  {stats.completedSessions}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="mb-6 bg-white rounded-xl shadow-sm p-2">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-3 px-4 font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <span>📊</span>
                  <span className="hidden sm:inline">Overview</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`flex-1 py-3 px-4 font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'services'
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <span>📚</span>
                  <span className="hidden sm:inline">Layanan</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('testimonials')}
                className={`flex-1 py-3 px-4 font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'testimonials'
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <span>⭐</span>
                  <span className="hidden sm:inline">Testimonial</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('wallet')}
                className={`flex-1 py-3 px-4 font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'wallet'
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <span>💰</span>
                  <span className="hidden sm:inline">Saldo</span>
                </span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Active Sessions Alert */}
              {activeSessions.length > 0 && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">🔴</div>
                      <div className="flex-1">
                        <div className="font-semibold text-blue-900">Sesi Sedang Berlangsung</div>
                        <div className="text-sm text-blue-700">
                          {activeSessions[0].studentName} - {activeSessions[0].subject}
                        </div>
                      </div>
                      <Button 
                        onClick={() => window.open(activeSessions[0].meetingLink, '_blank')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Join Meeting
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Upcoming Sessions */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Sesi Mendatang</CardTitle>
                    <span className="text-sm text-gray-600">{upcomingSessions.length} sesi</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingSessions.slice(0, 4).map(session => (
                      <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-xl">{session.studentName.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-semibold">{session.studentName}</div>
                            <div className="text-sm text-gray-600">{session.subject}</div>
                            <div className="text-sm text-gray-500">
                              Sesi {session.sessionNumber} dari {session.totalSessions} • {session.duration} jam
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {new Date(session.scheduledAt).toLocaleDateString('id-ID', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short'
                            })}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(session.scheduledAt).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            session.type === 'online' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {session.type === 'online' ? '🌐 Online' : '📍 Offline'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Active Students with Package Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Siswa Aktif & Perkiraan Kelas</CardTitle>
                    <span className="text-sm text-gray-600">{activeStudents.length} siswa</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeStudents.map(student => {
                      const progress = (student.completedSessions / student.totalSessions) * 100;
                      const packageName = student.packageType === 'package10' 
                        ? 'Paket 10 Sesi' 
                        : student.packageType === 'package5' 
                        ? 'Paket 5 Sesi' 
                        : 'Single Session';
                      
                      return (
                        <div key={student.id} className="p-4 border rounded-lg hover:shadow-md transition">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {student.avatar}
                              </div>
                              <div>
                                <div className="font-semibold text-lg">{student.name}</div>
                                <div className="text-sm text-gray-600">{student.subject}</div>
                                <div className="text-xs text-gray-500">{packageName}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">Total Dibayar</div>
                              <div className="font-semibold text-green-600">
                                Rp {student.totalPaid.toLocaleString('id-ID')}
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">Progress Kelas</span>
                              <span className="font-medium">{student.completedSessions}/{student.totalSessions} sesi</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div className="bg-blue-50 p-2 rounded">
                              <div className="text-xs text-blue-600 mb-1">Selesai</div>
                              <div className="font-semibold text-blue-700">{student.completedSessions} sesi</div>
                            </div>
                            <div className="bg-green-50 p-2 rounded">
                              <div className="text-xs text-green-600 mb-1">Sisa Kelas</div>
                              <div className="font-semibold text-green-700">{student.remainingSessions} sesi</div>
                            </div>
                            <div className="bg-purple-50 p-2 rounded">
                              <div className="text-xs text-purple-600 mb-1">Perkiraan</div>
                              <div className="font-semibold text-purple-700">
                                {student.remainingSessions * 2} jam
                              </div>
                            </div>
                          </div>

                          {/* Next Session */}
                          {student.nextSession && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="flex items-center justify-between text-sm">
                                <div className="text-gray-600">Sesi Berikutnya:</div>
                                <div className="font-medium">
                                  {new Date(student.nextSession).toLocaleDateString('id-ID', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Last Session */}
                          {student.lastSession && (
                            <div className="text-xs text-gray-500 mt-2">
                              Terakhir: {new Date(student.lastSession).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'services' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Kelola Layanan/Kelas</h2>
                <Button onClick={() => {
                  setEditingService(null);
                  setShowServiceModal(true);
                }}>
                  + Tambah Layanan Baru
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map(service => (
                  <Card key={service.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold">{service.subject}</h3>
                          <p className="text-sm text-gray-600">{service.level}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingService(service);
                              setShowServiceModal(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setServices(services.filter(s => s.id !== service.id))}
                            className="text-red-600 hover:text-red-700"
                          >
                            Hapus
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Harga</div>
                          <div className="font-semibold text-lg">
                            Rp {service.pricePerHour.toLocaleString('id-ID')}/jam
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-xs text-gray-600 mb-1">Paket 5 Sesi</div>
                            <div className="font-semibold">
                              Rp {service.packagePrices.package5.toLocaleString('id-ID')}
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-xs text-gray-600 mb-1">Paket 10 Sesi</div>
                            <div className="font-semibold">
                              Rp {service.packagePrices.package10.toLocaleString('id-ID')}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {service.offerFreeTrial && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                              Free Trial {service.freeTrialDuration} jam
                            </span>
                          )}
                          {service.discount > 0 && (
                            <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                              Diskon {service.discount}%
                            </span>
                          )}
                          <span className={`px-3 py-1 text-sm rounded-full ${
                            service.isActive
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {service.isActive ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {services.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-semibold mb-2">Belum ada layanan</h3>
                    <p className="text-gray-600 mb-4">
                      Tambahkan layanan/kelas pertama Anda untuk mulai menerima booking
                    </p>
                    <Button onClick={() => setShowServiceModal(true)}>
                      Tambah Layanan
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Kelola Testimonial</h2>
                <div className="text-sm text-gray-600">
                  {testimonials.filter(t => !t.isApproved).length} menunggu persetujuan
                </div>
              </div>

              <div className="space-y-4">
                {testimonials.map(testimonial => (
                  <Card key={testimonial.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xl">{testimonial.studentName.charAt(0)}</span>
                            </div>
                            <div>
                              <div className="font-semibold">{testimonial.studentName}</div>
                              <div className="text-sm text-gray-600">{testimonial.subject}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-yellow-500 text-lg">
                              {'⭐'.repeat(testimonial.rating)}
                            </div>
                            <span className="text-sm text-gray-500">{testimonial.date}</span>
                          </div>

                          <p className="text-gray-700 mb-3">{testimonial.comment}</p>

                          <div className="flex gap-2">
                            {!testimonial.isApproved ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => setTestimonials(testimonials.map(t =>
                                    t.id === testimonial.id ? { ...t, isApproved: true } : t
                                  ))}
                                >
                                  Setujui
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setTestimonials(testimonials.filter(t => t.id !== testimonial.id))}
                                  className="text-red-600"
                                >
                                  Tolak
                                </Button>
                              </>
                            ) : (
                              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                                ✓ Disetujui
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {testimonials.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="text-6xl mb-4">⭐</div>
                    <h3 className="text-xl font-semibold mb-2">Belum ada testimonial</h3>
                    <p className="text-gray-600">
                      Testimonial dari siswa akan muncul di sini
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="space-y-6">
              {/* Balance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Saldo Tersedia</div>
                        <div className="text-3xl font-bold text-green-600">
                          Rp {balance.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div className="text-5xl">💰</div>
                    </div>
                    <Button onClick={() => setShowWithdrawModal(true)} className="w-full">
                      Tarik Saldo
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Saldo Pending</div>
                        <div className="text-3xl font-bold text-yellow-600">
                          Rp {pendingBalance.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div className="text-5xl">⏳</div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Akan tersedia setelah sesi selesai
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Transaction History */}
              <Card>
                <CardHeader>
                  <CardTitle>Riwayat Transaksi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.map(transaction => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'earning' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            <span className="text-xl">
                              {transaction.type === 'earning' ? '💵' : '🏦'}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-sm text-gray-600">{transaction.date}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold text-lg ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}Rp {Math.abs(transaction.amount).toLocaleString('id-ID')}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            transaction.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {transaction.status === 'completed' ? 'Selesai' : 'Pending'}
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

      {/* Modals */}
      {showServiceModal && (
        <ServiceForm
          service={editingService}
          onClose={() => {
            setShowServiceModal(false);
            setEditingService(null);
          }}
        />
      )}

      {showWithdrawModal && (
        <WithdrawModal onClose={() => setShowWithdrawModal(false)} />
      )}
    </div>
  );
}

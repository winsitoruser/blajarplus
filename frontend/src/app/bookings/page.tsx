'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/Calendar';
import api from '@/lib/api';
import { transformBackendBookings } from '@/utils/bookingAdapter';

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [selectedStatus, searchQuery, bookings]);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      // Transform backend data to frontend format
      const transformedBookings = transformBackendBookings(response.data.data);
      setBookings(transformedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Use mock data if backend is not available
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const isStudent = user.role === 'student';
      
      const mockBookings = [
        {
          id: '1',
          bookingNumber: 'BKG-2024-001',
          status: 'confirmed',
          subject: { name: 'Matematika' },
          duration: 2,
          scheduledAt: new Date('2024-12-30T10:00:00').toISOString(),
          totalAmount: 300000,
          tutor: {
            user: { fullName: 'Budi Santoso', avatarUrl: null }
          },
          student: { fullName: 'Ahmad Rizki', avatarUrl: null },
          teachingMethod: 'online',
          meetingLink: 'https://meet.google.com/abc-defg-hij',
          notes: 'Fokus pada materi trigonometri',
          createdAt: new Date('2024-12-28T08:00:00').toISOString(),
        },
        {
          id: '2',
          bookingNumber: 'BKG-2024-002',
          status: 'pending_payment',
          subject: { name: 'Bahasa Inggris' },
          duration: 1.5,
          scheduledAt: new Date('2024-12-31T14:00:00').toISOString(),
          totalAmount: 300000,
          tutor: {
            user: { fullName: 'Siti Nurhaliza', avatarUrl: null }
          },
          student: { fullName: 'Dewi Lestari', avatarUrl: null },
          teachingMethod: 'online',
          meetingLink: null,
          notes: 'IELTS speaking practice',
          createdAt: new Date('2024-12-28T10:30:00').toISOString(),
        },
        {
          id: '3',
          bookingNumber: 'BKG-2024-003',
          status: 'completed',
          subject: { name: 'Fisika' },
          duration: 2,
          scheduledAt: new Date('2024-12-27T15:00:00').toISOString(),
          totalAmount: 350000,
          tutor: {
            user: { fullName: 'Andi Wijaya', avatarUrl: null }
          },
          student: { fullName: 'Rina Susanti', avatarUrl: null },
          teachingMethod: 'offline',
          location: 'Jl. Sudirman No. 123, Jakarta',
          notes: 'Persiapan olimpiade fisika',
          createdAt: new Date('2024-12-25T09:00:00').toISOString(),
          completedAt: new Date('2024-12-27T17:00:00').toISOString(),
        },
        {
          id: '4',
          bookingNumber: 'BKG-2024-004',
          status: 'cancelled',
          subject: { name: 'Programming' },
          duration: 2,
          scheduledAt: new Date('2024-12-29T16:00:00').toISOString(),
          totalAmount: 500000,
          tutor: {
            user: { fullName: 'Dewi Lestari', avatarUrl: null }
          },
          student: { fullName: 'Fajar Ramadhan', avatarUrl: null },
          teachingMethod: 'online',
          meetingLink: null,
          notes: 'React hooks dan state management',
          cancelReason: 'Tutor sakit mendadak',
          cancelledBy: 'tutor',
          createdAt: new Date('2024-12-26T11:00:00').toISOString(),
          cancelledAt: new Date('2024-12-28T14:00:00').toISOString(),
        },
        {
          id: '5',
          bookingNumber: 'BKG-2024-005',
          status: 'confirmed',
          subject: { name: 'Kimia' },
          duration: 1.5,
          scheduledAt: new Date('2025-01-02T09:00:00').toISOString(),
          totalAmount: 187500,
          tutor: {
            user: { fullName: 'Rudi Hartono', avatarUrl: null }
          },
          student: { fullName: 'Yoga Aditya', avatarUrl: null },
          teachingMethod: 'offline',
          location: 'Jl. Malioboro No. 45, Yogyakarta',
          notes: 'Materi stoikiometri',
          createdAt: new Date('2024-12-27T15:30:00').toISOString(),
        },
        {
          id: '6',
          bookingNumber: 'BKG-2024-006',
          status: 'reschedule_requested',
          subject: { name: 'Design Grafis' },
          duration: 2,
          scheduledAt: new Date('2024-12-30T13:00:00').toISOString(),
          totalAmount: 360000,
          tutor: {
            user: { fullName: 'Maya Sari', avatarUrl: null }
          },
          student: { fullName: 'Putri Ayu', avatarUrl: null },
          teachingMethod: 'online',
          meetingLink: 'https://zoom.us/j/123456789',
          notes: 'Adobe Illustrator untuk logo design',
          rescheduleReason: 'Ada keperluan mendadak',
          createdAt: new Date('2024-12-28T16:00:00').toISOString(),
        },
        {
          id: '7',
          bookingNumber: 'BKG-2024-007',
          status: 'completed',
          subject: { name: 'Matematika' },
          duration: 2,
          scheduledAt: new Date('2024-12-26T10:00:00').toISOString(),
          totalAmount: 300000,
          tutor: {
            user: { fullName: 'Budi Santoso', avatarUrl: null }
          },
          student: { fullName: 'Ahmad Rizki', avatarUrl: null },
          teachingMethod: 'online',
          meetingLink: 'https://meet.google.com/xyz-abcd-efg',
          notes: 'Limit dan turunan',
          createdAt: new Date('2024-12-24T08:00:00').toISOString(),
          completedAt: new Date('2024-12-26T12:00:00').toISOString(),
        },
        {
          id: '8',
          bookingNumber: 'BKG-2024-008',
          status: 'no_show',
          subject: { name: 'Bahasa Inggris' },
          duration: 1.5,
          scheduledAt: new Date('2024-12-28T11:00:00').toISOString(),
          totalAmount: 300000,
          tutor: {
            user: { fullName: 'Siti Nurhaliza', avatarUrl: null }
          },
          student: { fullName: 'Dewi Lestari', avatarUrl: null },
          teachingMethod: 'online',
          meetingLink: 'https://meet.google.com/no-show-123',
          notes: 'Grammar review',
          noShowBy: 'student',
          createdAt: new Date('2024-12-26T13:00:00').toISOString(),
        },
      ];
      
      setBookings(mockBookings);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(b => b.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(b => 
        b.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tutor.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.student.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      pending_payment: { label: 'Menunggu Pembayaran', color: 'bg-yellow-100 text-yellow-700', icon: '⏳' },
      confirmed: { label: 'Terkonfirmasi', color: 'bg-blue-100 text-blue-700', icon: '✓' },
      completed: { label: 'Selesai', color: 'bg-green-100 text-green-700', icon: '✓✓' },
      cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700', icon: '✕' },
      reschedule_requested: { label: 'Minta Reschedule', color: 'bg-purple-100 text-purple-700', icon: '↻' },
      no_show: { label: 'Tidak Hadir', color: 'bg-gray-100 text-gray-700', icon: '⊘' },
      draft: { label: 'Draft', color: 'bg-gray-100 text-gray-600', icon: '📝' },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  const getStats = () => {
    return {
      total: bookings.length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      pending: bookings.filter(b => b.status === 'pending_payment').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Manajemen Booking</h1>
            <p className="text-gray-600">Kelola semua booking les Anda di satu tempat</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className="hover:shadow-md transition cursor-pointer" onClick={() => setSelectedStatus('all')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Booking</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition cursor-pointer" onClick={() => setSelectedStatus('confirmed')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Terkonfirmasi</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.confirmed}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition cursor-pointer" onClick={() => setSelectedStatus('pending_payment')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⏳</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition cursor-pointer" onClick={() => setSelectedStatus('completed')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Selesai</p>
                    <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✓✓</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition cursor-pointer" onClick={() => setSelectedStatus('cancelled')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Dibatalkan</p>
                    <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✕</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Cari booking number, mata pelajaran, tutor, atau student..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                  {/* View Mode Toggle */}
                  <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      onClick={() => setViewMode('list')}
                      size="sm"
                      className="h-8"
                    >
                      📋 List
                    </Button>
                    <Button
                      variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                      onClick={() => setViewMode('calendar')}
                      size="sm"
                      className="h-8"
                    >
                      📅 Kalender
                    </Button>
                  </div>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedStatus === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedStatus('all')}
                    size="sm"
                  >
                    Semua
                  </Button>
                  <Button
                    variant={selectedStatus === 'confirmed' ? 'default' : 'outline'}
                    onClick={() => setSelectedStatus('confirmed')}
                    size="sm"
                  >
                    Terkonfirmasi
                  </Button>
                  <Button
                    variant={selectedStatus === 'pending_payment' ? 'default' : 'outline'}
                    onClick={() => setSelectedStatus('pending_payment')}
                    size="sm"
                  >
                    Pending
                  </Button>
                  <Button
                    variant={selectedStatus === 'completed' ? 'default' : 'outline'}
                    onClick={() => setSelectedStatus('completed')}
                    size="sm"
                  >
                    Selesai
                  </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bookings List or Calendar View */}
          {viewMode === 'calendar' ? (
            <Calendar 
              bookings={filteredBookings} 
              onBookingClick={(booking) => {
                setSelectedBooking(booking);
                setShowDetailModal(true);
              }}
            />
          ) : filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold mb-2">Tidak ada booking ditemukan</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || selectedStatus !== 'all' 
                    ? 'Coba ubah filter atau kata kunci pencarian'
                    : 'Mulai booking les dengan tutor favorit Anda'}
                </p>
                <Link href="/search">
                  <Button>Cari Tutor</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-lg transition cursor-pointer" onClick={() => {
                  setSelectedBooking(booking);
                  setShowDetailModal(true);
                }}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Left: Avatar & Info */}
                      <div className="flex gap-4 flex-1">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">
                            {booking.tutor.user.fullName.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{booking.tutor.user.fullName}</h3>
                              <p className="text-sm text-gray-600">{booking.subject.name}</p>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
                            <div className="flex items-center gap-1">
                              <span>📅</span>
                              <span>{new Date(booking.scheduledAt).toLocaleDateString('id-ID', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>🕐</span>
                              <span>{new Date(booking.scheduledAt).toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>⏱️</span>
                              <span>{booking.duration} jam</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{booking.teachingMethod === 'online' ? '💻' : '🏠'}</span>
                              <span>{booking.teachingMethod === 'online' ? 'Online' : 'Offline'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Price & Actions */}
                      <div className="flex flex-col items-end justify-between md:w-48">
                        <div className="text-right mb-4">
                          <p className="text-sm text-gray-600 mb-1">Total Pembayaran</p>
                          <p className="text-2xl font-bold text-primary-600">
                            Rp {booking.totalAmount.toLocaleString('id-ID')}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">#{booking.bookingNumber}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(booking);
                          setShowDetailModal(true);
                        }}>
                          Lihat Detail
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Detail Booking</h2>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-gray-700">
                  <span className="text-2xl">×</span>
                </button>
              </div>

              <div className="space-y-6">
                {/* Status */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Status</p>
                  {getStatusBadge(selectedBooking.status)}
                </div>

                {/* Booking Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Booking Number</p>
                    <p className="font-semibold">{selectedBooking.bookingNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tanggal Dibuat</p>
                    <p className="font-semibold">{new Date(selectedBooking.createdAt).toLocaleDateString('id-ID')}</p>
                  </div>
                </div>

                {/* Tutor & Student */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tutor</p>
                    <p className="font-semibold">{selectedBooking.tutor.user.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Student</p>
                    <p className="font-semibold">{selectedBooking.student.fullName}</p>
                  </div>
                </div>

                {/* Subject & Schedule */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Mata Pelajaran</p>
                    <p className="font-semibold">{selectedBooking.subject.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Durasi</p>
                    <p className="font-semibold">{selectedBooking.duration} jam</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Jadwal</p>
                  <p className="font-semibold">
                    {new Date(selectedBooking.scheduledAt).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} • {new Date(selectedBooking.scheduledAt).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {/* Teaching Method */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Metode Mengajar</p>
                  <p className="font-semibold capitalize">{selectedBooking.teachingMethod}</p>
                </div>

                {/* Meeting Link or Location */}
                {selectedBooking.teachingMethod === 'online' && selectedBooking.meetingLink && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Link Meeting</p>
                    <a href={selectedBooking.meetingLink} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline font-semibold">
                      {selectedBooking.meetingLink}
                    </a>
                  </div>
                )}

                {selectedBooking.teachingMethod === 'offline' && selectedBooking.location && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Lokasi</p>
                    <p className="font-semibold">{selectedBooking.location}</p>
                  </div>
                )}

                {/* Notes */}
                {selectedBooking.notes && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Catatan</p>
                    <p className="text-gray-700">{selectedBooking.notes}</p>
                  </div>
                )}

                {/* Cancel/Reschedule Reason */}
                {selectedBooking.cancelReason && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <p className="text-sm text-red-600 mb-1">Alasan Pembatalan</p>
                    <p className="text-red-700">{selectedBooking.cancelReason}</p>
                    <p className="text-xs text-red-600 mt-2">Dibatalkan oleh: {selectedBooking.cancelledBy}</p>
                  </div>
                )}

                {selectedBooking.rescheduleReason && (
                  <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 mb-1">Alasan Reschedule</p>
                    <p className="text-purple-700">{selectedBooking.rescheduleReason}</p>
                  </div>
                )}

                {/* Payment */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">Total Pembayaran</p>
                    <p className="text-2xl font-bold text-primary-600">
                      Rp {selectedBooking.totalAmount.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  {selectedBooking.status === 'pending_payment' && (
                    <Button className="flex-1">Bayar Sekarang</Button>
                  )}
                  {selectedBooking.status === 'confirmed' && selectedBooking.meetingLink && (
                    <Button className="flex-1" onClick={() => window.open(selectedBooking.meetingLink, '_blank')}>
                      Join Meeting
                    </Button>
                  )}
                  {(selectedBooking.status === 'confirmed' || selectedBooking.status === 'pending_payment') && (
                    <Button variant="outline" className="flex-1">Reschedule</Button>
                  )}
                  <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                    Tutup
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

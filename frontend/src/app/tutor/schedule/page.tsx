'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function TutorSchedulePage() {
  const router = useRouter();
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [timeOffs, setTimeOffs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTimeOffModal, setShowTimeOffModal] = useState(false);

  const [newAvailability, setNewAvailability] = useState({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '17:00',
    slotDurationMinutes: 60,
  });

  const [newTimeOff, setNewTimeOff] = useState({
    startAt: '',
    endAt: '',
    reason: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchScheduleData();
  }, []);

  const fetchScheduleData = async () => {
    try {
      const [availRes, timeOffRes] = await Promise.all([
        api.get('/tutors/availability/me'),
        api.get('/tutors/time-off/me'),
      ]);
      setAvailabilities(availRes.data);
      setTimeOffs(timeOffRes.data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tutors/availability', newAvailability);
      setShowAddModal(false);
      setNewAvailability({
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '17:00',
        slotDurationMinutes: 60,
      });
      fetchScheduleData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Gagal menambahkan jadwal');
    }
  };

  const handleDeleteAvailability = async (id: string) => {
    if (!confirm('Hapus jadwal ini?')) return;
    try {
      await api.delete(`/tutors/availability/${id}`);
      fetchScheduleData();
    } catch (error) {
      alert('Gagal menghapus jadwal');
    }
  };

  const handleAddTimeOff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tutors/time-off', newTimeOff);
      setShowTimeOffModal(false);
      setNewTimeOff({ startAt: '', endAt: '', reason: '' });
      fetchScheduleData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Gagal menambahkan time off');
    }
  };

  const handleDeleteTimeOff = async (id: string) => {
    if (!confirm('Hapus time off ini?')) return;
    try {
      await api.delete(`/tutors/time-off/${id}`);
      fetchScheduleData();
    } catch (error) {
      alert('Gagal menghapus time off');
    }
  };

  const groupedAvailabilities = DAYS.map((day, index) => ({
    day,
    dayIndex: index,
    slots: availabilities.filter((a) => a.dayOfWeek === index),
  }));

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

      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Kelola Jadwal</h1>
            <p className="text-gray-600">Atur ketersediaan waktu mengajar Anda</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weekly Availability */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Jadwal Mingguan</CardTitle>
                  <Button onClick={() => setShowAddModal(true)}>
                    + Tambah Jadwal
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {groupedAvailabilities.map(({ day, dayIndex, slots }) => (
                      <div key={dayIndex} className="border-b pb-4 last:border-b-0">
                        <div className="font-semibold text-lg mb-2">{day}</div>
                        {slots.length > 0 ? (
                          <div className="space-y-2">
                            {slots.map((slot) => (
                              <div
                                key={slot.id}
                                className="flex items-center justify-between p-3 bg-primary-50 rounded-lg"
                              >
                                <div>
                                  <div className="font-medium">
                                    {slot.startTime} - {slot.endTime}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Durasi slot: {slot.slotDurationMinutes} menit
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeleteAvailability(slot.id)}
                                  >
                                    Hapus
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm italic">
                            Tidak ada jadwal
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Time Off */}
            <div>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Libur/Cuti</CardTitle>
                  <Button size="sm" onClick={() => setShowTimeOffModal(true)}>
                    + Tambah
                  </Button>
                </CardHeader>
                <CardContent>
                  {timeOffs.length > 0 ? (
                    <div className="space-y-3">
                      {timeOffs.map((timeOff) => (
                        <div
                          key={timeOff.id}
                          className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                        >
                          <div className="font-medium text-sm mb-1">
                            {new Date(timeOff.startAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                            })}{' '}
                            -{' '}
                            {new Date(timeOff.endAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </div>
                          {timeOff.reason && (
                            <div className="text-xs text-gray-600 mb-2">
                              {timeOff.reason}
                            </div>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteTimeOff(timeOff.id)}
                            className="w-full"
                          >
                            Hapus
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      Tidak ada jadwal libur
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="text-sm space-y-2">
                    <div className="font-semibold mb-3">💡 Tips:</div>
                    <div className="flex gap-2">
                      <span>✓</span>
                      <span>Jadwal mingguan akan berulang setiap minggu</span>
                    </div>
                    <div className="flex gap-2">
                      <span>✓</span>
                      <span>Siswa hanya bisa booking pada slot yang tersedia</span>
                    </div>
                    <div className="flex gap-2">
                      <span>✓</span>
                      <span>Gunakan time off untuk libur khusus</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Add Availability Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Tambah Jadwal Ketersediaan</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAvailability} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Hari</label>
                  <select
                    className="w-full h-10 px-3 border border-gray-300 rounded-md"
                    value={newAvailability.dayOfWeek}
                    onChange={(e) =>
                      setNewAvailability({
                        ...newAvailability,
                        dayOfWeek: parseInt(e.target.value),
                      })
                    }
                  >
                    {DAYS.map((day, index) => (
                      <option key={index} value={index}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Jam Mulai
                    </label>
                    <Input
                      type="time"
                      value={newAvailability.startTime}
                      onChange={(e) =>
                        setNewAvailability({
                          ...newAvailability,
                          startTime: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Jam Selesai
                    </label>
                    <Input
                      type="time"
                      value={newAvailability.endTime}
                      onChange={(e) =>
                        setNewAvailability({
                          ...newAvailability,
                          endTime: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Durasi Slot (menit)
                  </label>
                  <select
                    className="w-full h-10 px-3 border border-gray-300 rounded-md"
                    value={newAvailability.slotDurationMinutes}
                    onChange={(e) =>
                      setNewAvailability({
                        ...newAvailability,
                        slotDurationMinutes: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value={30}>30 menit</option>
                    <option value={60}>60 menit</option>
                    <option value={90}>90 menit</option>
                    <option value={120}>120 menit</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Simpan
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Time Off Modal */}
      {showTimeOffModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Tambah Jadwal Libur</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTimeOff} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tanggal Mulai
                  </label>
                  <Input
                    type="datetime-local"
                    value={newTimeOff.startAt}
                    onChange={(e) =>
                      setNewTimeOff({ ...newTimeOff, startAt: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tanggal Selesai
                  </label>
                  <Input
                    type="datetime-local"
                    value={newTimeOff.endAt}
                    onChange={(e) =>
                      setNewTimeOff({ ...newTimeOff, endAt: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Alasan (opsional)
                  </label>
                  <Input
                    type="text"
                    placeholder="Liburan, sakit, dll"
                    value={newTimeOff.reason}
                    onChange={(e) =>
                      setNewTimeOff({ ...newTimeOff, reason: e.target.value })
                    }
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Simpan
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowTimeOffModal(false)}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { tutorsApi, api } from '@/lib/api';

export default function CreateTutorProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    bio: '',
    education: '',
    experience: '',
    subjects: [] as string[],
    educationLevels: [] as string[],
    hourlyRate: '',
    city: '',
    province: '',
    teachingMethods: [] as string[],
    teachingPreferences: '',
  });

  const educationLevelOptions = [
    'SD', 'SMP', 'SMA', 'Kuliah', 'Umum'
  ];

  const teachingMethodOptions = [
    { value: 'online', label: 'Online' },
    { value: 'offline', label: 'Offline' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await tutorsApi.getSubjects();
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubjectToggle = (subjectId: string) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.includes(subjectId)
        ? formData.subjects.filter(id => id !== subjectId)
        : [...formData.subjects, subjectId],
    });
  };

  const handleEducationLevelToggle = (level: string) => {
    setFormData({
      ...formData,
      educationLevels: formData.educationLevels.includes(level)
        ? formData.educationLevels.filter(l => l !== level)
        : [...formData.educationLevels, level],
    });
  };

  const handleTeachingMethodToggle = (method: string) => {
    setFormData({
      ...formData,
      teachingMethods: formData.teachingMethods.includes(method)
        ? formData.teachingMethods.filter(m => m !== method)
        : [...formData.teachingMethods, method],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.subjects.length === 0) {
      setError('Pilih minimal 1 mata pelajaran');
      return;
    }

    if (formData.educationLevels.length === 0) {
      setError('Pilih minimal 1 jenjang pendidikan');
      return;
    }

    if (formData.teachingMethods.length === 0) {
      setError('Pilih minimal 1 metode mengajar');
      return;
    }

    if (parseInt(formData.hourlyRate) < 10000) {
      setError('Harga per jam minimal Rp 10.000');
      return;
    }

    setLoading(true);

    try {
      await api.post('/tutors/profile', {
        bio: formData.bio,
        education: formData.education,
        experience: formData.experience || undefined,
        subjects: formData.subjects,
        educationLevels: formData.educationLevels,
        hourlyRate: parseInt(formData.hourlyRate),
        city: formData.city,
        province: formData.province,
        teachingMethods: formData.teachingMethods,
        teachingPreferences: formData.teachingPreferences || undefined,
      });

      alert('Profile berhasil dibuat! Menunggu verifikasi admin.');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal membuat profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Buat Profile Tutor</h1>
            <p className="text-gray-600">
              Lengkapi informasi Anda untuk mulai menerima siswa
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                {error}
              </div>
            )}

            {/* Bio */}
            <Card>
              <CardHeader>
                <CardTitle>Tentang Anda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bio <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="bio"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={4}
                    placeholder="Ceritakan tentang diri Anda, pengalaman mengajar, dan keahlian..."
                    value={formData.bio}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pendidikan <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="education"
                    placeholder="Contoh: S1 Matematika, Universitas Indonesia"
                    value={formData.education}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pengalaman (Opsional)
                  </label>
                  <textarea
                    name="experience"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                    placeholder="Pengalaman mengajar atau pekerjaan terkait..."
                    value={formData.experience}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Subjects */}
            <Card>
              <CardHeader>
                <CardTitle>Mata Pelajaran</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Pilih mata pelajaran yang Anda kuasai <span className="text-red-500">*</span>
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {subjects.map((subject) => (
                    <label
                      key={subject.id}
                      className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition ${
                        formData.subjects.includes(subject.id)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.subjects.includes(subject.id)}
                        onChange={() => handleSubjectToggle(subject.id)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium">{subject.name}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education Levels */}
            <Card>
              <CardHeader>
                <CardTitle>Jenjang Pendidikan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Pilih jenjang yang bisa Anda ajar <span className="text-red-500">*</span>
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {educationLevelOptions.map((level) => (
                    <label
                      key={level}
                      className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition ${
                        formData.educationLevels.includes(level)
                          ? 'border-secondary-500 bg-secondary-50'
                          : 'border-gray-200 hover:border-secondary-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.educationLevels.includes(level)}
                        onChange={() => handleEducationLevelToggle(level)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium">{level}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Location */}
            <Card>
              <CardHeader>
                <CardTitle>Harga & Lokasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Harga per Jam (Rp) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    name="hourlyRate"
                    placeholder="50000"
                    min="10000"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimal Rp 10.000. Platform mengambil komisi 15%.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Kota <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="city"
                      placeholder="Jakarta"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Provinsi <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="province"
                      placeholder="DKI Jakarta"
                      value={formData.province}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Teaching Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Metode Mengajar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Pilih metode yang Anda tawarkan <span className="text-red-500">*</span>
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {teachingMethodOptions.map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition ${
                        formData.teachingMethods.includes(method.value)
                          ? 'border-accent-500 bg-accent-50'
                          : 'border-gray-200 hover:border-accent-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.teachingMethods.includes(method.value)}
                        onChange={() => handleTeachingMethodToggle(method.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium">{method.label}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Teaching Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Preferensi Mengajar (Opsional)</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  name="teachingPreferences"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Contoh: Lebih suka mengajar di pagi hari, maksimal 3 siswa per hari, dll..."
                  value={formData.teachingPreferences}
                  onChange={handleInputChange}
                />
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
                size="lg"
              >
                {loading ? 'Menyimpan...' : 'Buat Profile'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
                disabled={loading}
                size="lg"
              >
                Batal
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Catatan:</span><br />
                Setelah submit, profile Anda akan direview oleh tim kami dalam 1-2 hari kerja. 
                Anda akan menerima notifikasi email setelah profile diverifikasi.
              </p>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface Banner {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  type: 'info' | 'warning' | 'success' | 'promotion';
  target: 'all' | 'student' | 'tutor';
  isActive: boolean;
  order: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    imageUrl: string;
    linkUrl: string;
    type: 'info' | 'warning' | 'success' | 'promotion';
    target: 'all' | 'student' | 'tutor';
    isActive: boolean;
    order: number;
    startDate: string;
    endDate: string;
  }>({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    type: 'info',
    target: 'all',
    isActive: true,
    order: 0,
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/banners`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingBanner) {
        await axios.patch(`${API_URL}/banners/${editingBanner.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_URL}/banners`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchBanners();
      resetForm();
    } catch (error) {
      console.error('Error saving banner:', error);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description || '',
      imageUrl: banner.imageUrl || '',
      linkUrl: banner.linkUrl || '',
      type: banner.type,
      target: banner.target,
      isActive: banner.isActive,
      order: banner.order,
      startDate: banner.startDate ? banner.startDate.split('T')[0] : '',
      endDate: banner.endDate ? banner.endDate.split('T')[0] : '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus banner ini?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/banners/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/banners/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBanners();
    } catch (error) {
      console.error('Error toggling banner:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      type: 'info',
      target: 'all',
      isActive: true,
      order: 0,
      startDate: '',
      endDate: '',
    });
    setEditingBanner(null);
    setShowForm(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'promotion': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout 
      title="Banner Management"
      subtitle="Kelola banner untuk dashboard student dan tutor"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Banner Management
            </h1>
            <p className="text-gray-600 mt-1">Kelola banner untuk dashboard student dan tutor</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {showForm ? 'Tutup Form' : '+ Tambah Banner'}
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{editingBanner ? 'Edit Banner' : 'Tambah Banner Baru'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Judul Banner *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Promo Spesial Akhir Tahun!"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Order</label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Deskripsi</label>
                  <textarea
                    className="w-full min-h-20 rounded-md border border-gray-300 px-3 py-2 text-sm"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Dapatkan diskon hingga 50%..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">URL Gambar</label>
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/banner.jpg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">URL Link</label>
                    <Input
                      value={formData.linkUrl}
                      onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                      placeholder="https://example.com/promo"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipe</label>
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    >
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="success">Success</option>
                      <option value="promotion">Promotion</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target</label>
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      value={formData.target}
                      onChange={(e) => setFormData({ ...formData, target: e.target.value as any })}
                    >
                      <option value="all">Semua</option>
                      <option value="student">Student</option>
                      <option value="tutor">Tutor</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      value={formData.isActive ? 'active' : 'inactive'}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                    >
                      <option value="active">Aktif</option>
                      <option value="inactive">Tidak Aktif</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tanggal Mulai</label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tanggal Selesai</label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                    {editingBanner ? 'Update Banner' : 'Simpan Banner'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Banner List */}
        <div className="grid gap-4">
          {loading ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                Loading banners...
              </CardContent>
            </Card>
          ) : banners.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                Belum ada banner. Klik tombol "Tambah Banner" untuk membuat banner baru.
              </CardContent>
            </Card>
          ) : (
            banners.map((banner) => (
              <Card key={banner.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{banner.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(banner.type)}`}>
                          {banner.type}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {banner.target === 'all' ? 'Semua' : banner.target === 'student' ? 'Student' : 'Tutor'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          banner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {banner.isActive ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </div>
                      {banner.description && (
                        <p className="text-gray-600 text-sm mb-2">{banner.description}</p>
                      )}
                      <div className="flex gap-4 text-xs text-gray-500">
                        {banner.imageUrl && <span>📷 Gambar</span>}
                        {banner.linkUrl && <span>🔗 Link</span>}
                        <span>Order: {banner.order}</span>
                        {banner.startDate && <span>Mulai: {new Date(banner.startDate).toLocaleDateString('id-ID')}</span>}
                        {banner.endDate && <span>Selesai: {new Date(banner.endDate).toLocaleDateString('id-ID')}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(banner.id)}
                      >
                        {banner.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(banner)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(banner.id)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

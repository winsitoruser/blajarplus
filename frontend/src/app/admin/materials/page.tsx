'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Video, Headphones, FileText, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';

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
  isActive: boolean;
  createdAt: string;
}

interface Course {
  id: string;
  title: string;
  language: {
    name: string;
    flag: string;
  };
}

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'TEXT' as Material['type'],
    content: '',
    url: '',
    fileUrl: '',
    duration: 0,
    order: 1,
    isRequired: false,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchMaterials();
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/language-learning/languages', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const languages = await response.json();
        const allCourses: Course[] = [];
        
        for (const lang of languages) {
          const coursesResponse = await fetch(
            `http://localhost:3000/api/language-learning/languages/${lang.id}/courses`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          if (coursesResponse.ok) {
            const coursesData = await coursesResponse.json();
            allCourses.push(...coursesData);
          }
        }
        
        setCourses(allCourses);
        if (allCourses.length > 0) {
          setSelectedCourse(allCourses[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterials = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3000/api/language-learning/courses/${selectedCourse}/materials`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        setMaterials(data);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real implementation, this would call the backend API
    alert('Material management API endpoint needs to be implemented in backend');
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      type: 'TEXT',
      content: '',
      url: '',
      fileUrl: '',
      duration: 0,
      order: 1,
      isRequired: false,
    });
    setShowCreateForm(false);
    setEditingMaterial(null);
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title,
      description: material.description,
      type: material.type,
      content: material.content || '',
      url: material.url || '',
      fileUrl: material.fileUrl || '',
      duration: material.duration || 0,
      order: material.order,
      isRequired: material.isRequired,
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (materialId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus materi ini?')) return;
    
    alert('Delete API endpoint needs to be implemented');
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

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || material.type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Material Management</h1>
          <p className="text-gray-600">Kelola materi pembelajaran untuk semua kursus</p>
        </div>

        {/* Course Selector */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pilih Course</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedCourse === course.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{course.language.flag}</div>
                  <div className="text-sm font-semibold truncate">{course.title}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters & Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari materi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="ALL">Semua Tipe</option>
              <option value="TEXT">Text</option>
              <option value="VIDEO">Video</option>
              <option value="AUDIO">Audio</option>
              <option value="PDF">PDF</option>
            </select>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Materi
            </Button>
          </div>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <Card className="mb-6 border-2 border-blue-500">
            <CardHeader>
              <CardTitle>{editingMaterial ? 'Edit Materi' : 'Tambah Materi Baru'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Judul</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tipe</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as Material['type'] })}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="TEXT">Text</option>
                      <option value="VIDEO">Video</option>
                      <option value="AUDIO">Audio</option>
                      <option value="PDF">PDF</option>
                      <option value="INTERACTIVE">Interactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Deskripsi</label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                {formData.type === 'TEXT' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Konten</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg min-h-[200px]"
                      placeholder="Masukkan konten materi..."
                    />
                  </div>
                )}

                {(formData.type === 'VIDEO' || formData.type === 'AUDIO') && (
                  <div>
                    <label className="block text-sm font-medium mb-2">URL</label>
                    <Input
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                )}

                {formData.type === 'PDF' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">File URL</label>
                    <Input
                      value={formData.fileUrl}
                      onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Durasi (menit)</label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Order</label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.isRequired}
                        onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">Required</span>
                    </label>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    {editingMaterial ? 'Update' : 'Simpan'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingMaterial(null);
                    }}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Materials List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded ${getMaterialColor(material.type)}`}>
                      {getMaterialIcon(material.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{material.title}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {material.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-3">
                  <Badge className={getMaterialColor(material.type)}>
                    {material.type}
                  </Badge>
                  {material.isRequired && (
                    <Badge variant="outline">Required</Badge>
                  )}
                  <Badge variant={material.isActive ? "default" : "secondary"}>
                    {material.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>Order: {material.order}</span>
                  {material.duration && <span>{material.duration} min</span>}
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleEdit(material)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(material.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Belum ada materi untuk course ini</p>
              <Button onClick={() => setShowCreateForm(true)} className="mt-4">
                Tambah Materi Pertama
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

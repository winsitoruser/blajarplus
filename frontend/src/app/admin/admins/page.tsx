'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/ui/use-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export default function AdminManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const [admins, setAdmins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<any>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    adminRole: 'admin',
  })

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await axios.get(`${API_URL}/admin/admins?page=1&limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setAdmins(response.data.data || [])
    } catch (error) {
      console.error('Error fetching admins:', error)
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: 'Failed to load admins',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      
      await axios.post(`${API_URL}/admin/admins`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      toast({
        variant: 'success',
        title: '✅ Success',
        description: 'Admin created successfully',
      })

      setShowModal(false)
      setFormData({ email: '', password: '', fullName: '', phone: '', adminRole: 'admin' })
      fetchAdmins()
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.response?.data?.message || 'Failed to create admin',
      })
    }
  }

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      
      const updateData: any = {
        fullName: formData.fullName,
        phone: formData.phone,
      }
      
      if (formData.password) {
        updateData.password = formData.password
      }

      await axios.put(`${API_URL}/admin/admins/${editingAdmin.id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      toast({
        variant: 'success',
        title: '✅ Success',
        description: 'Admin updated successfully',
      })

      setShowModal(false)
      setEditingAdmin(null)
      setFormData({ email: '', password: '', fullName: '', phone: '', adminRole: 'admin' })
      fetchAdmins()
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.response?.data?.message || 'Failed to update admin',
      })
    }
  }

  const handleDeleteAdmin = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return

    try {
      const token = localStorage.getItem('token')
      
      await axios.delete(`${API_URL}/admin/admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      toast({
        variant: 'success',
        title: '✅ Success',
        description: 'Admin deleted successfully',
      })

      fetchAdmins()
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.response?.data?.message || 'Failed to delete admin',
      })
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const token = localStorage.getItem('token')
      
      await axios.post(`${API_URL}/admin/admins/${id}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })

      toast({
        variant: 'success',
        title: '✅ Success',
        description: `Admin ${currentStatus === 'active' ? 'suspended' : 'activated'} successfully`,
      })

      fetchAdmins()
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.response?.data?.message || 'Failed to change status',
      })
    }
  }

  const openCreateModal = () => {
    setEditingAdmin(null)
    setFormData({ email: '', password: '', fullName: '', phone: '', adminRole: 'admin' })
    setShowModal(true)
  }

  const openEditModal = (admin: any) => {
    setEditingAdmin(admin)
    setFormData({
      email: admin.email,
      password: '',
      fullName: admin.fullName,
      phone: admin.phone || '',
      adminRole: 'admin',
    })
    setShowModal(true)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <AdminLayout title="Admin Management" subtitle="Manage admin accounts and permissions">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      title="Admin Management"
      subtitle="Manage admin accounts and access control"
      breadcrumbs={[{ label: 'Admins' }]}
      actions={
        <>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all flex items-center gap-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Admin
          </button>
          <button
            onClick={fetchAdmins}
            className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </>
      }
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Admins</p>
              <p className="text-3xl font-bold text-gray-900">{admins.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active</p>
              <p className="text-3xl font-bold text-green-600">
                {admins.filter(a => a.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Suspended</p>
              <p className="text-3xl font-bold text-red-600">
                {admins.filter(a => a.status === 'suspended').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Admin</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {admin.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{admin.fullName}</div>
                        <div className="text-sm text-gray-500">{admin.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{admin.phone || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      admin.status === 'active' ? 'bg-green-100 text-green-800' :
                      admin.status === 'suspended' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {admin.lastLoginAt ? formatDate(admin.lastLoginAt) : 'Never'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(admin.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(admin)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleToggleStatus(admin.id, admin.status)}
                        className={`p-2 rounded-lg transition-colors ${
                          admin.status === 'active' 
                            ? 'text-orange-600 hover:bg-orange-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={admin.status === 'active' ? 'Suspend' : 'Activate'}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {admin.status === 'active' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          )}
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteAdmin(admin.id, admin.fullName)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editingAdmin ? 'Edit Admin' : 'Create New Admin'}
            </h3>
            <form onSubmit={editingAdmin ? handleUpdateAdmin : handleCreateAdmin}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {!editingAdmin && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone (Optional)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password {editingAdmin && '(Leave blank to keep current)'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required={!editingAdmin}
                    minLength={8}
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingAdmin(null)
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
                >
                  {editingAdmin ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

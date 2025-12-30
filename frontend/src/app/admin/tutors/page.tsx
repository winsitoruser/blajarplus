'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import AdminLayout from '@/components/admin/AdminLayout'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export default function AdminTutors() {
  const router = useRouter()
  const [tutors, setTutors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  })
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card')

  useEffect(() => {
    fetchTutors()
  }, [page, filters])

  const fetchTutors = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
      })

      const response = await axios.get(`${API_URL}/admin/tutors?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setTutors(response.data.data || [])
      setTotalPages(response.data.meta?.totalPages || 1)
    } catch (error) {
      console.error('Error fetching tutors:', error)
      setTutors([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const exportToCSV = () => {
    if (tutors.length === 0) {
      alert('No tutors to export')
      return
    }

    const csvData = [
      ['BlajarPlus - Tutors Report'],
      ['Generated:', new Date().toLocaleString('id-ID')],
      ['Filters:', `Status: ${filters.status || 'All'}, Search: ${filters.search || 'None'}`],
      [''],
      ['Tutor ID', 'Full Name', 'Email', 'Phone', 'Status', 'Rating', 'Total Earnings', 'Subjects', 'Joined Date'],
      ...tutors.map(t => [
        t.id || 'N/A',
        t.user?.fullName || 'N/A',
        t.user?.email || 'N/A',
        t.user?.phone || 'N/A',
        t.verificationStatus || 'N/A',
        t.rating || 0,
        formatCurrency(t.totalEarnings || 0),
        t.subjects?.map((s: any) => s.name).join('; ') || 'N/A',
        t.createdAt ? new Date(t.createdAt).toLocaleDateString('id-ID') : 'N/A'
      ])
    ]

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `tutors-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <AdminLayout
      title="Tutor Management"
      subtitle="Monitor and manage all tutors on the platform"
      breadcrumbs={[
        { label: 'Tutors' }
      ]}
      actions={
        <>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
          <div className="flex gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1">
            <button
              onClick={() => setViewMode('card')}
              className={`px-3 py-2 rounded-md transition-all flex items-center gap-2 ${
                viewMode === 'card'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 rounded-md transition-all flex items-center gap-2 ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Table
            </button>
          </div>
          <button
            onClick={() => fetchTutors()}
            className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </>
      }
    >
        {/* Enhanced Filters */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </h2>
            {(filters.status || filters.search) && (
              <button
                onClick={() => setFilters({ status: '', search: '' })}
                className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search by name or email..."
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* View Toggle Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : tutors.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No tutors found
          </div>
        ) : viewMode === 'card' ? (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <div key={tutor.id} className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-300 transform hover:-translate-y-2">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl font-bold text-white">
                          {tutor.user?.fullName?.charAt(0) || 'T'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{tutor.user?.fullName}</h3>
                        <p className="text-sm text-gray-500">{tutor.user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(tutor.verificationStatus || 'pending')}`}>
                        {tutor.verificationStatus || 'pending'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Hourly Rate:</span>
                      <span className="font-medium text-gray-900">{formatCurrency(tutor.hourlyRate || 0)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-medium text-gray-900">{tutor.experienceYears || 0} years</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-medium text-gray-900">
                        ⭐ {tutor.ratingAvg ? Number(tutor.ratingAvg).toFixed(1) : 'N/A'} ({tutor.ratingCount || 0})
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-gray-500">Bookings</p>
                        <p className="text-lg font-bold text-gray-900">{tutor.stats?.totalBookings || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Completed</p>
                        <p className="text-lg font-bold text-green-600">{tutor.stats?.completedBookings || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Earnings</p>
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(tutor.stats?.totalEarnings || 0).replace('Rp', '').trim().substring(0, 6)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Subjects */}
                  {tutor.subjects && Array.isArray(tutor.subjects) && tutor.subjects.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-gray-500 mb-2">Subjects:</p>
                      <div className="flex flex-wrap gap-1">
                        {tutor.subjects.slice(0, 3).map((subject: any, index: number) => (
                          <span key={subject?.id || index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                            {subject?.subject?.name || subject?.name || 'Unknown'}
                          </span>
                        ))}
                        {tutor.subjects.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{tutor.subjects.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t">
                    <button
                      onClick={() => router.push(`/admin/tutors/${tutor.id}`)}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Tutor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Hourly Rate
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Bookings
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Subjects
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tutors.map((tutor) => (
                    <tr key={tutor.id} className="hover:bg-blue-50 transition-colors">
                      {/* Tutor Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-sm font-bold text-white">
                              {tutor.user?.fullName?.charAt(0) || 'T'}
                            </span>
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{tutor.user?.fullName}</div>
                            <div className="text-sm text-gray-500">{tutor.user?.email}</div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(tutor.verificationStatus || 'pending')}`}>
                          {tutor.verificationStatus || 'pending'}
                        </span>
                      </td>
                      
                      {/* Hourly Rate */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-gray-900">{formatCurrency(tutor.hourlyRate || 0)}</span>
                      </td>
                      
                      {/* Experience */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-900">{tutor.experienceYears || 0} years</span>
                      </td>
                      
                      {/* Rating */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="font-semibold text-gray-900">
                            {tutor.ratingAvg ? Number(tutor.ratingAvg).toFixed(1) : 'N/A'}
                          </span>
                          <span className="text-gray-500 text-sm">({tutor.ratingCount || 0})</span>
                        </div>
                      </td>
                      
                      {/* Bookings */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-center">
                          <div className="font-bold text-gray-900">{tutor.stats?.totalBookings || 0}</div>
                          <div className="text-xs text-green-600">{tutor.stats?.completedBookings || 0} completed</div>
                        </div>
                      </td>
                      
                      {/* Subjects */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {tutor.subjects && Array.isArray(tutor.subjects) && tutor.subjects.length > 0 ? (
                            <>
                              {tutor.subjects.slice(0, 2).map((subject: any, index: number) => (
                                <span key={subject?.id || index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                                  {subject?.subject?.name || subject?.name || 'Unknown'}
                                </span>
                              ))}
                              {tutor.subjects.length > 2 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                  +{tutor.subjects.length - 2}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-400 text-xs">No subjects</span>
                          )}
                        </div>
                      </td>
                      
                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => router.push(`/admin/tutors/${tutor.id}`)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all text-sm font-bold shadow-md hover:shadow-lg"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Enhanced Pagination */}
        {!loading && tutors.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-6 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ← Previous
              </button>
              <span className="text-sm font-semibold text-gray-700">
                Page <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded">{page}</span> of{' '}
                <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded">{totalPages}</span>
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-6 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next →
              </button>
            </div>
          </div>
        )}
    </AdminLayout>
  )
}

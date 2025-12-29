'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import AdminLayout from '@/components/admin/AdminLayout'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export default function AdminReports() {
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState(30)

  useEffect(() => {
    fetchReports()
  }, [timeRange])

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await axios.get(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setStats(response.data)
    } catch (error) {
      console.error('Error fetching reports:', error)
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

  if (loading) {
    return (
      <AdminLayout
        title="Reports & Analytics"
        subtitle="Comprehensive business insights and performance metrics"
        breadcrumbs={[{ label: 'Reports' }]}
      >
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      title="Reports & Analytics"
      subtitle="Comprehensive business insights and performance metrics"
      breadcrumbs={[{ label: 'Reports' }]}
      actions={
        <>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-white/50 focus:outline-none transition-all"
          >
            <option value={7} className="text-gray-900">Last 7 days</option>
            <option value={30} className="text-gray-900">Last 30 days</option>
            <option value={90} className="text-gray-900">Last 90 days</option>
          </select>
          <button
            onClick={() => fetchReports()}
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
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Revenue Card */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(stats?.revenue?.total || 0)}</p>
          <p className="text-sm text-gray-600">Platform: {formatCurrency(stats?.revenue?.platform || 0)}</p>
        </div>

        {/* Users Card */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.users?.total || 0}</p>
          <p className="text-sm text-gray-600">{stats?.users?.students || 0} students • {stats?.users?.tutors || 0} tutors</p>
        </div>

        {/* Bookings Card */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.bookings?.total || 0}</p>
          <p className="text-sm text-gray-600">{stats?.bookings?.completed || 0} completed</p>
        </div>

        {/* Tutors Card */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Active Tutors</h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.tutors?.verified || 0}</p>
          <p className="text-sm text-gray-600">{stats?.tutors?.pending || 0} pending review</p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Breakdown */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Revenue Breakdown
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-gray-700">Total Revenue</span>
                <span className="font-bold text-gray-900">{formatCurrency(stats?.revenue?.total || 0)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-gray-700">Platform Commission</span>
                <span className="font-bold text-gray-900">{formatCurrency(stats?.revenue?.platform || 0)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full" style={{ width: `${((stats?.revenue?.platform || 0) / (stats?.revenue?.total || 1)) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-gray-700">Tutor Earnings</span>
                <span className="font-bold text-gray-900">{formatCurrency(stats?.revenue?.tutors || 0)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full" style={{ width: `${((stats?.revenue?.tutors || 0) / (stats?.revenue?.total || 1)) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            User Distribution
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-gray-700">Total Users</span>
                <span className="font-bold text-gray-900">{stats?.users?.total || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-gray-700">Students</span>
                <span className="font-bold text-gray-900">{stats?.users?.students || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full" style={{ width: `${((stats?.users?.students || 0) / (stats?.users?.total || 1)) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-gray-700">Tutors</span>
                <span className="font-bold text-gray-900">{stats?.users?.tutors || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" style={{ width: `${((stats?.users?.tutors || 0) / (stats?.users?.total || 1)) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Key Performance Indicators
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <p className="text-sm font-bold text-blue-700 uppercase mb-2">Booking Completion Rate</p>
            <p className="text-4xl font-bold text-blue-900 mb-2">
              {stats?.bookings?.total > 0 ? Math.round(((stats?.bookings?.completed || 0) / stats.bookings.total) * 100) : 0}%
            </p>
            <p className="text-sm text-blue-600">{stats?.bookings?.completed || 0} of {stats?.bookings?.total || 0} bookings</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <p className="text-sm font-bold text-green-700 uppercase mb-2">Average Revenue per Booking</p>
            <p className="text-4xl font-bold text-green-900 mb-2">
              {formatCurrency(stats?.bookings?.total > 0 ? (stats?.revenue?.total || 0) / stats.bookings.total : 0)}
            </p>
            <p className="text-sm text-green-600">Based on {stats?.bookings?.total || 0} bookings</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <p className="text-sm font-bold text-purple-700 uppercase mb-2">Tutor Verification Rate</p>
            <p className="text-4xl font-bold text-purple-900 mb-2">
              {(stats?.tutors?.verified || 0) + (stats?.tutors?.pending || 0) > 0 
                ? Math.round(((stats?.tutors?.verified || 0) / ((stats?.tutors?.verified || 0) + (stats?.tutors?.pending || 0))) * 100) 
                : 0}%
            </p>
            <p className="text-sm text-purple-600">{stats?.tutors?.verified || 0} verified tutors</p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Export Reports</h3>
            <p className="text-blue-100">Download comprehensive analytics and insights</p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/30 transition-all font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </button>
            <button className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/30 transition-all font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Excel
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import AdminLayout from '@/components/admin/AdminLayout'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export default function AdminWithdrawals() {
  const router = useRouter()
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
  })
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    fetchWithdrawals()
  }, [page, filters])

  const fetchWithdrawals = async () => {
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
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      })

      const response = await axios.get(`${API_URL}/admin/withdrawals?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setWithdrawals(response.data.data || [])
      setTotalPages(response.data.meta?.totalPages || 1)
    } catch (error) {
      console.error('Error fetching withdrawals:', error)
      setWithdrawals([])
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (withdrawalId: string, status: string) => {
    try {
      setProcessingId(withdrawalId)
      const token = localStorage.getItem('token')
      
      await axios.patch(
        `${API_URL}/admin/withdrawals/${withdrawalId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      await fetchWithdrawals()
      alert(`Withdrawal ${status} successfully!`)
    } catch (error) {
      console.error('Error updating withdrawal:', error)
      alert('Failed to update withdrawal status')
    } finally {
      setProcessingId(null)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'rejected':
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'pending':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'processing':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  return (
    <AdminLayout
      title="Withdrawal Management"
      subtitle="Manage tutor withdrawal requests and payouts"
      breadcrumbs={[{ label: 'Withdrawals' }]}
      actions={
        <>
          <button
            onClick={() => fetchWithdrawals()}
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
          {(filters.status || filters.startDate || filters.endDate) && (
            <button
              onClick={() => setFilters({ status: '', startDate: '', endDate: '' })}
              className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Withdrawals List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500 text-lg font-medium">No withdrawal requests found</p>
            <p className="text-gray-400 text-sm mt-2">Withdrawal requests will appear here when tutors request payouts</p>
          </div>
        ) : (
          withdrawals.map((withdrawal) => (
            <div
              key={withdrawal.id}
              className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Tutor Info */}
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-xl font-bold text-white">
                        {withdrawal.tutor?.user?.fullName?.charAt(0) || 'T'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {withdrawal.tutor?.user?.fullName || 'Unknown Tutor'}
                      </h3>
                      <p className="text-sm text-gray-500">{withdrawal.tutor?.user?.email}</p>
                      <p className="text-xs text-gray-400 font-mono mt-1">ID: #{withdrawal.id.substring(0, 8)}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`px-4 py-2 rounded-full border-2 font-bold text-sm flex items-center gap-2 ${getStatusColor(withdrawal.status)}`}>
                    {getStatusIcon(withdrawal.status)}
                    {withdrawal.status.toUpperCase()}
                  </div>
                </div>

                {/* Withdrawal Details */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Amount</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(withdrawal.amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Bank</p>
                    <p className="text-sm font-bold text-gray-900">{withdrawal.bankName || '-'}</p>
                    <p className="text-xs text-gray-500">{withdrawal.accountNumber || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Account Name</p>
                    <p className="text-sm font-bold text-gray-900">{withdrawal.accountName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Requested</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(withdrawal.createdAt)}</p>
                  </div>
                </div>

                {/* Notes */}
                {withdrawal.notes && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700 font-semibold uppercase mb-1">Notes</p>
                    <p className="text-sm text-blue-900">{withdrawal.notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                {withdrawal.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => handleUpdateStatus(withdrawal.id, 'processing')}
                      disabled={processingId === withdrawal.id}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Process
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(withdrawal.id, 'rejected')}
                      disabled={processingId === withdrawal.id}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Reject
                    </button>
                  </div>
                )}

                {withdrawal.status === 'processing' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => handleUpdateStatus(withdrawal.id, 'completed')}
                      disabled={processingId === withdrawal.id}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Mark as Completed
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(withdrawal.id, 'failed')}
                      disabled={processingId === withdrawal.id}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Mark as Failed
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Enhanced Pagination */}
      {!loading && withdrawals.length > 0 && (
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

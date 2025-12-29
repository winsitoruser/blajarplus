'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import AdminLayout from '@/components/admin/AdminLayout'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export default function AdminSubjects() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await axios.get(`${API_URL}/admin/subjects`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setSubjects(response.data)
    } catch (error) {
      console.error('Error fetching subjects:', error)
    } finally {
      setLoading(false)
    }
  }

  const groupedSubjects = subjects.reduce((acc, subject) => {
    const categoryName = subject.category?.name || 'Uncategorized'
    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push(subject)
    return acc
  }, {} as Record<string, any[]>)

  return (
    <AdminLayout
      title="Subjects & Courses"
      subtitle="Monitor all subjects and their performance"
      breadcrumbs={[
        { label: 'Subjects' }
      ]}
      actions={
        <>
          <button
            onClick={() => fetchSubjects()}
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
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedSubjects).map(([categoryName, categorySubjects]) => (
              <div key={categoryName}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{categoryName}</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded-full">
                    {categorySubjects.length} subjects
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categorySubjects.map((subject) => (
                    <div key={subject.id} className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-300 transform hover:-translate-y-2">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{subject.name}</h3>
                            {subject.description && (
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{subject.description}</p>
                            )}
                          </div>
                          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                        </div>

                        {/* Enhanced Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                            <p className="text-xs text-blue-700 font-bold mb-1 uppercase">Total Tutors</p>
                            <p className="text-3xl font-bold text-blue-900">
                              {subject.stats?.totalTutors || 0}
                            </p>
                            <p className="text-xs text-blue-600 mt-1 font-medium">
                              {subject.stats?.activeTutors || 0} active
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                            <p className="text-xs text-green-700 font-bold mb-1 uppercase">Bookings</p>
                            <p className="text-3xl font-bold text-green-900">
                              {subject.stats?.totalBookings || 0}
                            </p>
                            <p className="text-xs text-green-600 mt-1 font-medium">
                              {subject.stats?.completedBookings || 0} completed
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {subject.stats?.totalBookings > 0 && (
                          <div className="mt-4">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Completion Rate</span>
                              <span>
                                {Math.round(
                                  ((subject.stats?.completedBookings || 0) /
                                    (subject.stats?.totalBookings || 1)) *
                                    100
                                )}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full transition-all"
                                style={{
                                  width: `${Math.round(
                                    ((subject.stats?.completedBookings || 0) /
                                      (subject.stats?.totalBookings || 1)) *
                                      100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Popularity Indicator */}
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Popularity</span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= Math.min(5, Math.ceil((subject.stats?.totalBookings || 0) / 10))
                                      ? 'text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {subjects.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No subjects found
              </div>
            )}
          </div>
        )}
    </AdminLayout>
  )
}

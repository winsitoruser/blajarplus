'use client'

import { useRouter, usePathname } from 'next/navigation'
import { ReactNode, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'

interface AdminLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  breadcrumbs?: { label: string; href?: string }[]
  actions?: ReactNode
}

export default function AdminLayout({ 
  children, 
  title, 
  subtitle, 
  breadcrumbs = [],
  actions 
}: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast({
      variant: 'success',
      title: '✅ Logout Successful',
      description: 'You have been logged out successfully',
    })
    setTimeout(() => {
      router.push('/login')
    }, 500)
  }

  const defaultBreadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Admin', href: '/admin/dashboard' },
    ...breadcrumbs
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              {/* Breadcrumb */}
              <nav className="flex mb-3" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  {defaultBreadcrumbs.map((crumb, index) => (
                    <li key={index} className="inline-flex items-center">
                      {index > 0 && (
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                        </svg>
                      )}
                      {crumb.href ? (
                        <button
                          onClick={() => router.push(crumb.href!)}
                          className={`inline-flex items-center text-sm font-medium ${
                            index === defaultBreadcrumbs.length - 1
                              ? 'text-blue-100'
                              : 'text-white hover:text-blue-100'
                          } transition-colors`}
                        >
                          {index === 0 && (
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                            </svg>
                          )}
                          {crumb.label}
                        </button>
                      ) : (
                        <span className={`ml-1 text-sm font-medium ${
                          index === defaultBreadcrumbs.length - 1 ? 'text-blue-100' : 'text-white'
                        } md:ml-2`}>
                          {crumb.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
              
              <h1 className="text-3xl font-bold text-white flex items-center">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 text-sm text-blue-100">{subtitle}</p>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {actions && (
                <div className="flex gap-3">
                  {actions}
                </div>
              )}
              
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">Admin</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          router.push('/admin/admins')
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>Manage Admins</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          router.push('/admin/dashboard')
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>Dashboard</span>
                      </button>
                      <div className="border-t border-gray-200 my-2"></div>
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          handleLogout()
                        }}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  )
}

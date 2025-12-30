'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import MembershipCard from '@/components/membership/MembershipCard'
import { useToast } from '@/components/ui/use-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export default function TutorMembershipPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [plans, setPlans] = useState<any[]>([])
  const [currentSubscription, setCurrentSubscription] = useState<any>(null)
  const [classLimit, setClassLimit] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    fetchMembershipData()
  }, [])

  const fetchMembershipData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const [plansRes, subscriptionRes, limitRes] = await Promise.all([
        axios.get(`${API_URL}/membership/plans`),
        axios.get(`${API_URL}/membership/my-subscription`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/membership/can-create-class`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      setPlans(plansRes.data)
      setCurrentSubscription(subscriptionRes.data)
      setClassLimit(limitRes.data)
    } catch (error) {
      console.error('Error fetching membership data:', error)
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: 'Failed to load membership data',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (planId: string) => {
    setUpgrading(true)
    try {
      const token = localStorage.getItem('token')
      
      // In production, this would redirect to payment gateway
      // For now, we'll simulate the upgrade
      const response = await axios.post(
        `${API_URL}/membership/upgrade`,
        { planId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      toast({
        variant: 'success',
        title: '✅ Upgrade Successful!',
        description: 'Your membership has been upgraded successfully.',
      })

      // Refresh data
      await fetchMembershipData()
    } catch (error: any) {
      console.error('Error upgrading membership:', error)
      toast({
        variant: 'destructive',
        title: '❌ Upgrade Failed',
        description: error.response?.data?.message || 'Failed to upgrade membership',
      })
    } finally {
      setUpgrading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading membership plans...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => router.back()}
            className="mb-4 text-white hover:text-blue-100 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Membership Plans</h1>
          <p className="text-blue-100 text-lg">Choose the plan that fits your teaching needs</p>
        </div>
      </div>

      {/* Current Status Banner */}
      {classLimit && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className={`rounded-xl shadow-lg p-6 ${
            classLimit.allowed 
              ? 'bg-gradient-to-r from-green-500 to-green-600' 
              : 'bg-gradient-to-r from-red-500 to-red-600'
          }`}>
            <div className="flex items-center justify-between text-white">
              <div>
                <h3 className="text-xl font-bold mb-1">Current Status</h3>
                <p className="text-white/90">
                  You have created <span className="font-bold">{classLimit.currentCount}</span> out of{' '}
                  <span className="font-bold">{classLimit.maxClasses}</span> classes allowed in your{' '}
                  <span className="font-bold">{classLimit.plan}</span>
                </p>
              </div>
              {!classLimit.allowed && (
                <div className="text-right">
                  <p className="text-2xl font-bold">⚠️</p>
                  <p className="text-sm font-semibold">Upgrade Required</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <MembershipCard
              key={plan.id}
              plan={plan}
              currentTier={currentSubscription?.plan?.tier}
              onUpgrade={handleUpgrade}
              isLoading={upgrading}
            />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens if I reach my class limit?
              </h3>
              <p className="text-gray-600">
                You won't be able to create new classes until you upgrade your membership or remove existing classes.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I downgrade my membership?
              </h3>
              <p className="text-gray-600">
                Yes, you can downgrade at any time. Your current subscription will remain active until the end of the billing period.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How does billing work?
              </h3>
              <p className="text-gray-600">
                Silver and Gold plans are billed monthly. You'll be charged automatically at the start of each billing cycle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

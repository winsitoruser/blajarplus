'use client'

import { Check } from 'lucide-react'

interface MembershipPlan {
  id: string
  name: string
  tier: string
  maxClasses: number
  price: number
  currency: string
  durationDays: number
  features: string[]
  isActive: boolean
}

interface MembershipCardProps {
  plan: MembershipPlan
  currentTier?: string
  onUpgrade?: (planId: string) => void
  isLoading?: boolean
}

export default function MembershipCard({ plan, currentTier, onUpgrade, isLoading }: MembershipCardProps) {
  const isCurrent = currentTier === plan.tier
  const isBasic = plan.tier === 'BASIC'
  
  const tierColors = {
    BASIC: 'from-gray-500 to-gray-600',
    SILVER: 'from-gray-400 to-gray-500',
    GOLD: 'from-yellow-500 to-yellow-600',
  }

  const tierBadgeColors = {
    BASIC: 'bg-gray-100 text-gray-800',
    SILVER: 'bg-gray-100 text-gray-800',
    GOLD: 'bg-yellow-100 text-yellow-800',
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${isCurrent ? 'ring-4 ring-blue-500' : ''}`}>
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${tierColors[plan.tier as keyof typeof tierColors]} p-6 text-white`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold">{plan.name}</h3>
          {isCurrent && (
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
              Current Plan
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">{formatPrice(plan.price)}</span>
          {!isBasic && <span className="text-white/80">/{plan.durationDays} hari</span>}
        </div>
        {isBasic && <p className="text-white/90 mt-1">Gratis selamanya</p>}
      </div>

      {/* Features */}
      <div className="p-6">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-4 ${tierBadgeColors[plan.tier as keyof typeof tierBadgeColors]}`}>
          <span>Maksimal {plan.maxClasses} kelas</span>
        </div>

        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Action button */}
        {!isCurrent && onUpgrade && (
          <button
            onClick={() => onUpgrade(plan.id)}
            disabled={isLoading || isBasic}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
              isBasic
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? 'Processing...' : isBasic ? 'Current Plan' : 'Upgrade Now'}
          </button>
        )}

        {isCurrent && !isBasic && (
          <div className="text-center py-3 px-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">✓ You're on this plan</p>
          </div>
        )}
      </div>

      {/* Popular badge for Silver */}
      {plan.tier === 'SILVER' && (
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
            POPULAR
          </span>
        </div>
      )}

      {/* Best value badge for Gold */}
      {plan.tier === 'GOLD' && (
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
            BEST VALUE
          </span>
        </div>
      )}
    </div>
  )
}

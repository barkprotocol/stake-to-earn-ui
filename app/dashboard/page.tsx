import { Metadata } from 'next'
import { StakingDashboard } from '@/components/staking/staking-dashboard'
import { RewardsDisplay } from '@/components/staking/rewards-display'

export const metadata: Metadata = {
  title: 'Staking Dashboard | BARK Protocol',
  description: 'Manage your BARK token stakes and view your rewards.',
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Staking Dashboard</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <StakingDashboard />
        <RewardsDisplay />
      </div>
    </div>
  )
}


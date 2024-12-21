import { Hero } from '@/components/ui/layout/hero'
import { Footer } from '@/components/ui/layout/footer'
import { VerifyEligibility } from '@/components/VerifyEligibility'
import { ClaimRewardsForm } from '@/components/ClaimRewardsForm'
import { StakingForm } from '@/components/staking/staking-form'
import { RewardStats } from '@/components/RewardStats'

export default function StakePage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Hero />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h1 className="text-4xl font-bold mb-8 text-center">BARK Staking Platform</h1>
          <p className="text-xl mb-12 text-center text-gray-300">
            Verify your eligibility, stake your BARK tokens, and claim your rewards.
          </p>
          <RewardStats />
          <div className="mt-12 grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Stake BARK Tokens</h2>
              <StakingForm />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Verify Eligibility</h2>
              <VerifyEligibility />
            </div>
          </div>
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Claim Rewards</h2>
            <ClaimRewardsForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}


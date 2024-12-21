'use client'

import { useEffect } from 'react'
import { useStakingPlatform } from '@/hooks/use-staking-platform'

export function RewardStats() {
  const { rewardStats, isLoadingStats, fetchRewardStats } = useStakingPlatform()

  useEffect(() => {
    fetchRewardStats()
  }, [fetchRewardStats])

  if (isLoadingStats) {
    return <div>Loading stats...</div>
  }

  if (!rewardStats) {
    return <div>Failed to load stats. Please try again later.</div>
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-400">Total Distributed</h3>
        <p className="text-2xl font-bold text-white">{rewardStats.totalDistributed} BARK</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-400">Total Claimed</h3>
        <p className="text-2xl font-bold text-white">{rewardStats.totalClaimed} BARK</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-400">Remaining to Claim</h3>
        <p className="text-2xl font-bold text-white">{rewardStats.remainingToClaim} BARK</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-400">Total Participants</h3>
        <p className="text-2xl font-bold text-white">{rewardStats.totalParticipants}</p>
      </div>
    </div>
  )
}


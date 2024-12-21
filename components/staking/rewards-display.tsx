'use client'

import { useStaking } from '@/contexts/StakingContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'
import { BARK_TOKEN_SYMBOL } from '@/config/constants'

export function RewardsDisplay() {
  const { rewardBalance, claimRewards, isClaiming, loadStakingData } = useStaking()

  const handleClaimRewards = async () => {
    try {
      const signature = await claimRewards(rewardBalance);
      toast.success(`Successfully claimed ${rewardBalance} ${BARK_TOKEN_SYMBOL} rewards. Transaction: ${signature}`);
      await loadStakingData(); // Refresh staking and rewards data
    } catch (error) {
      console.error('Claiming rewards error:', error);
      toast.error('Failed to claim rewards. Please try again.');
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rewards</CardTitle>
        <CardDescription>View and claim your staking rewards</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p>Available Rewards: {rewardBalance} {BARK_TOKEN_SYMBOL}</p>
          </div>
          <Button onClick={handleClaimRewards} disabled={isClaiming || rewardBalance <= 0}>
            {isClaiming ? 'Claiming...' : 'Claim Rewards'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


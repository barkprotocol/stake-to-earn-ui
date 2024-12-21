'use client'

import { useState } from 'react'
import { useStaking } from '@/contexts/StakingContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'react-hot-toast'
import { BARK_TOKEN_SYMBOL, MINIMUM_STAKE_AMOUNT } from '@/config/constants'

export function StakingDashboard() {
  const { stakingBalance, stake, unstake, isStaking, isUnstaking, loadStakingData } = useStaking()
  const [amount, setAmount] = useState('')

  const handleStake = async () => {
    if (!amount || parseFloat(amount) < MINIMUM_STAKE_AMOUNT) {
      toast.error(`Minimum stake amount is ${MINIMUM_STAKE_AMOUNT} ${BARK_TOKEN_SYMBOL}`)
      return
    }
    try {
      const signature = await stake(parseFloat(amount));
      toast.success(`Successfully staked ${amount} ${BARK_TOKEN_SYMBOL}. Transaction: ${signature}`);
      setAmount('');
      await loadStakingData(); // Refresh staking data
    } catch (error) {
      console.error('Staking error:', error)
      toast.error('Failed to stake. Please try again.')
    }
  }

  const handleUnstake = async () => {
    if (!amount || parseFloat(amount) > stakingBalance) {
      toast.error(`Invalid unstake amount`)
      return
    }
    try {
      const signature = await unstake(parseFloat(amount));
      toast.success(`Successfully unstaked ${amount} ${BARK_TOKEN_SYMBOL}. Transaction: ${signature}`);
      setAmount('');
      await loadStakingData(); // Refresh staking data
    } catch (error) {
      console.error('Unstaking error:', error)
      toast.error('Failed to unstake. Please try again.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staking</CardTitle>
        <CardDescription>Stake or unstake your {BARK_TOKEN_SYMBOL} tokens</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="stake-amount">Amount</Label>
            <Input
              id="stake-amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={MINIMUM_STAKE_AMOUNT}
              step="0.01"
            />
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleStake} disabled={isStaking || isUnstaking}>
              {isStaking ? 'Staking...' : 'Stake'}
            </Button>
            <Button onClick={handleUnstake} disabled={isStaking || isUnstaking || stakingBalance <= 0}>
              {isUnstaking ? 'Unstaking...' : 'Unstake'}
            </Button>
          </div>
          <div>
            <p>Current Stake: {stakingBalance} {BARK_TOKEN_SYMBOL}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


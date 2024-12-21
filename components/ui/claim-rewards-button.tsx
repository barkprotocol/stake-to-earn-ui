'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useStaking } from '@/contexts/StakingContext'
import { Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ClaimRewardsButton() {
  const { claimRewards, rewardBalance } = useStaking()
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [isClaiming, setIsClaiming] = useState(false)

  const handleClaimRewards = async () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (parseFloat(amount) > rewardBalance) {
      toast.error('Insufficient rewards balance')
      return
    }

    setIsClaiming(true)
    try {
      await claimRewards(parseFloat(amount))
      toast.success(`Successfully claimed ${amount} BARK tokens`)
      setIsOpen(false)
      setAmount('')
    } catch (error) {
      console.error('Error claiming rewards:', error)
      toast.error('Failed to claim rewards. Please try again.')
    } finally {
      setIsClaiming(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Claim Rewards</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Claim Rewards</DialogTitle>
          <DialogDescription>
            Enter the amount of BARK tokens you want to claim from your rewards.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Available rewards: {rewardBalance} BARK
          </p>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleClaimRewards} disabled={isClaiming}>
            {isClaiming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Claiming...
              </>
            ) : (
              'Claim Rewards'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


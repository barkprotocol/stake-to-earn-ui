'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect } from 'react'
import { BARK_TOKEN_SYMBOL, MINIMUM_STAKE_AMOUNT } from '@/config/constants'
import { useStaking } from '@/contexts/StakingContext'
import { toast } from 'react-hot-toast'

const formSchema = z.object({
  amount: z.string().min(1, 'Amount is required').refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= MINIMUM_STAKE_AMOUNT,
    `Amount must be at least ${MINIMUM_STAKE_AMOUNT} ${BARK_TOKEN_SYMBOL}`
  ),
})

export function StakingForm() {
  const { stake, unstake, isStaked, stakingBalance, rewardBalance, loadStakingData } = useStaking()
  const { publicKey } = useWallet()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
    },
  })

  useEffect(() => {
    if (publicKey) {
      loadStakingData()
    }
  }, [publicKey, loadStakingData])

  async function onStake(values: z.infer<typeof formSchema>) {
    try {
      await stake(parseFloat(values.amount))
      form.reset()
      toast.success(`Successfully staked ${values.amount} ${BARK_TOKEN_SYMBOL}`)
    } catch (error) {
      console.error('Staking error:', error)
      toast.error('Failed to stake. Please try again.')
    }
  }

  async function onUnstake(values: z.infer<typeof formSchema>) {
    try {
      await unstake(parseFloat(values.amount))
      form.reset()
      toast.success(`Successfully unstaked ${values.amount} ${BARK_TOKEN_SYMBOL}`)
    } catch (error) {
      console.error('Unstaking error:', error)
      toast.error('Failed to unstake. Please try again.')
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input placeholder="0.00" {...field} type="number" step="0.01" min={MINIMUM_STAKE_AMOUNT} />
              </FormControl>
              <FormDescription>
                Enter the amount of {BARK_TOKEN_SYMBOL} tokens you want to stake or unstake.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-4">
          <Button type="button" onClick={form.handleSubmit(onStake)} disabled={!publicKey}>
            Stake {BARK_TOKEN_SYMBOL} Tokens
          </Button>
          <Button type="button" onClick={form.handleSubmit(onUnstake)} disabled={!publicKey || !isStaked}>
            Unstake {BARK_TOKEN_SYMBOL} Tokens
          </Button>
        </div>
      </form>
      {stakingBalance > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Your Staking Account</h3>
          <p>Staked Amount: {stakingBalance} {BARK_TOKEN_SYMBOL}</p>
          <p>Rewards: {rewardBalance} {BARK_TOKEN_SYMBOL}</p>
        </div>
      )}
    </Form>
  )
}


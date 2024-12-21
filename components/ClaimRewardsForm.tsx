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
import { useStakingPlatform } from '@/hooks/use-staking-platform'
import { useWallet } from '@solana/wallet-adapter-react'
import { BARK_TOKEN_SYMBOL } from '@/config/constants'

const formSchema = z.object({
  amount: z.string().min(1, 'Amount is required').refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    'Amount must be a positive number'
  ),
})

export function ClaimRewardsForm() {
  const { claimRewards, isClaiming, rewards } = useStakingPlatform()
  const { publicKey } = useWallet()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await claimRewards(parseFloat(values.amount))
    if (result) {
      form.reset()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Claim Amount</FormLabel>
              <FormControl>
                <Input placeholder="0.00" {...field} />
              </FormControl>
              <FormDescription>
                Enter the amount of {BARK_TOKEN_SYMBOL} rewards you want to claim.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isClaiming || !publicKey}>
          {isClaiming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Claiming...
            </>
          ) : (
            `Claim ${BARK_TOKEN_SYMBOL} Rewards`
          )}
        </Button>
      </form>
      {rewards && rewards.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Your Rewards</h3>
          <ul>
            {rewards.map((reward) => (
              <li key={reward.id}>
                {reward.amount} {BARK_TOKEN_SYMBOL} - Claimed at: {new Date(reward.claimedAt).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Form>
  )
}


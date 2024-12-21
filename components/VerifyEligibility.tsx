'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { isValidSolanaAddress } from '@/lib/utils';
import { Countdown } from '@/components/ui/countdown';

const formSchema = z.object({
  walletAddress: z
    .string()
    .min(1, 'Wallet address is required')
    .refine(isValidSolanaAddress, {
      message: 'Invalid Solana wallet address',
    }),
});

const NEXT_REWARDS_CLAIM_DATE = '2025-03-31T00:00:00Z';

export function VerifyEligibility() {
  const [isChecking, setIsChecking] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<{
    isEligible: boolean;
    amount?: number;
    eligibleNFTs?: string[];
  } | null>(null);
  const [claimEnded, setClaimEnded] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      walletAddress: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsChecking(true);
    setEligibilityResult(null);

    try {
      const response = await fetch('/api/eligibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: values.walletAddress }),
      });

      if (!response.ok) {
        throw new Error('Failed to check eligibility');
      }

      const data = await response.json();
      setEligibilityResult(data);

      if (data.isEligible) {
        const rewardsMsg = data.amount
          ? `You are eligible for ${data.amount} BARK tokens.`
          : 'You are eligible for staking rewards.';
        const nftMsg = data.eligibleNFTs?.length
          ? `Additionally, the following NFTs are eligible: ${data.eligibleNFTs.join(', ')}.`
          : '';
        toast.success(`${rewardsMsg} ${nftMsg}`);
      } else {
        toast('You are not currently eligible for the BARK rewards.', {
          icon: '🔔',
        });
      }
    } catch (error) {
      console.error('Error checking eligibility:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'An error occurred while checking eligibility. Please try again.'
      );
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8">
        <Countdown
          targetDate={NEXT_REWARDS_CLAIM_DATE}
          className="bg-[#1a1a1a] text-[#d0c8b9] p-4 rounded-lg shadow-lg"
          onComplete={() => setClaimEnded(true)}
          fallback={<div className="text-[#d0c8b9]">Loading countdown...</div>}
        />
      </div>
      {claimEnded ? (
        <div className="text-center p-4 bg-[#1a1a1a] text-[#d0c8b9] rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Rewards Claim Period Ended</h3>
          <p>The BARK token claim period has ended. Thank you for your participation!</p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="walletAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your Solana wallet address"
                      {...field}
                      disabled={isChecking}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your Solana wallet address to check your eligibility for BARK staking rewards or NFT benefits.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isChecking}
              className="w-full bg-[#d0c8b9] text-black transition-all duration-300 focus:ring-4 focus:ring-[#dcd7cc] focus:ring-opacity-50 hover:bg-[#dcd7cc] relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform -translate-x-full bg-gradient-to-r from-[#c0b8a9] to-[#b0a899] group-hover:translate-x-0 group-hover:scale-102"></span>
              <span className="relative">
                {isChecking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                    Checking...
                  </>
                ) : (
                  'Check Eligibility'
                )}
              </span>
            </Button>
          </form>
        </Form>
      )}

      {eligibilityResult && (
        <div className="mt-6 p-6 rounded-xl border border-[#d0c8b9] border-opacity-50 shadow-xl transition-all duration-300 hover:shadow-2xl bg-[#1a1a1a]">
          <h3 className="text-xl font-semibold mb-3 text-[#d0c8b9]">
            {eligibilityResult.isEligible ? 'Congratulations!' : 'Not Eligible'}
          </h3>
          <p className="text-[#dcd7cc]">
            {eligibilityResult.isEligible
              ? `You are eligible for ${eligibilityResult.amount || 'staking rewards'}. ${
                  eligibilityResult.eligibleNFTs?.length
                    ? `Eligible NFTs: ${eligibilityResult.eligibleNFTs.join(', ')}.`
                    : ''
                }`
              : 'You are not currently eligible for the BARK airdrop. Keep an eye out for future opportunities!'}
          </p>
        </div>
      )}
    </div>
  );
}


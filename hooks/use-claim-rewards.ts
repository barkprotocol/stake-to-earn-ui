import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { toast } from 'react-hot-toast'
import { ClaimRewardRequest, ClaimRewardResponse } from '@/types/rewards'

// This is a mock function. Replace with actual API call to your backend.
const claimRewardsAPI = async (request: ClaimRewardRequest): Promise<ClaimRewardResponse> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000))
  // Simulate success (80% of the time) or failure
  const success = Math.random() < 0.8
  return {
    success,
    message: success ? 'Rewards claimed successfully' : 'Failed to claim rewards',
    txSignature: success ? 'mock_tx_signature' : undefined,
  }
}

export function useClaimRewards() {
  const [isClaiming, setIsClaiming] = useState(false)
  const { publicKey, signMessage } = useWallet()

  const claimRewards = async (amount: number) => {
    if (!publicKey || !signMessage) {
      toast.error('Please connect your wallet first')
      return
    }

    setIsClaiming(true)
    try {
      const message = `Claim ${amount} BARK rewards`
      const encodedMessage = new TextEncoder().encode(message)
      const signature = await signMessage(encodedMessage)

      const request: ClaimRewardRequest = {
        userId: publicKey.toString(),
        amount: amount,
        signature: Buffer.from(signature).toString('base64'),
      }

      const response = await claimRewardsAPI(request)
      if (response.success) {
        toast.success(response.message)
        return response
      } else {
        toast.error(response.message)
        return null
      }
    } catch (error) {
      console.error('Claim rewards error:', error)
      toast.error('An error occurred while claiming rewards. Please try again.')
      return null
    } finally {
      setIsClaiming(false)
    }
  }

  return { claimRewards, isClaiming }
}


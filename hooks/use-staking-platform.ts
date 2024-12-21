import { useState, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { toast } from 'react-hot-toast'
import { RewardStats, Reward, ClaimRewardRequest, ClaimRewardResponse } from '@/types/rewards'
import { getStakingAccount, getRewards } from '@/lib/solana-utils'
import { stakeTokens, unstakeTokens } from '@/lib/solana-transaction-utils'
import { PublicKey, Keypair } from '@solana/web3.js'
import { STAKING_API_URL, REWARDS_API_URL, TOAST_DURATION, BARK_TOKEN_SYMBOL, SOLANA_MINT_ADDRESS } from '@/config/constants'
import { User, Stake, Reward as RewardType, StakingPool, Transaction } from '@/app/types/db'

const fetchRewardStatsAPI = async (): Promise<RewardStats> => {
  const response = await fetch(REWARDS_API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch reward statistics');
  }
  return await response.json();
}

const claimRewardsAPI = async (request: ClaimRewardRequest): Promise<ClaimRewardResponse> => {
  const response = await fetch(`${REWARDS_API_URL}/claim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error('Failed to claim rewards');
  }
  return await response.json();
}

export function useStakingPlatform() {
  const [isStaking, setIsStaking] = useState(false)
  const [isUnstaking, setIsUnstaking] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [rewardStats, setRewardStats] = useState<RewardStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [stakingAccount, setStakingAccount] = useState<Stake | null>(null)
  const [rewards, setRewards] = useState<RewardType[] | null>(null)
  const { publicKey, signTransaction, signMessage } = useWallet()

  const fetchStakingAccount = useCallback(async () => {
    if (!publicKey) return

    try {
      const account = await getStakingAccount(publicKey)
      setStakingAccount(account as Stake)
    } catch (error) {
      console.error('Error fetching staking account:', error)
      toast.error('Failed to fetch staking account', { duration: TOAST_DURATION })
    }
  }, [publicKey])

  const stakeTokensHandler = async (amount: number) => {
    if (!publicKey || !signTransaction) {
      toast.error('Please connect your wallet first', { duration: TOAST_DURATION })
      return false
    }

    setIsStaking(true)
    try {
      const stakingPoolAddress = new PublicKey(SOLANA_MINT_ADDRESS)
      const stakingAccountPublicKey = await getStakingAccount(publicKey)
      
      // Create a temporary keypair for the transaction
      // In a real-world scenario, you would use the user's actual keypair
      const tempKeypair = Keypair.generate()
      
      const signature = await stakeTokens(
        tempKeypair,
        stakingAccountPublicKey,
        amount,
        stakingPoolAddress
      )
      
      toast.success(`Successfully staked ${amount} ${BARK_TOKEN_SYMBOL} tokens`, { duration: TOAST_DURATION })
      await fetchStakingAccount()
      return true
    } catch (error) {
      console.error('Staking error:', error)
      toast.error('An error occurred while staking. Please try again.', { duration: TOAST_DURATION })
      return false
    } finally {
      setIsStaking(false)
    }
  }

  const unstakeTokensHandler = async (amount: number) => {
    if (!publicKey || !signTransaction) {
      toast.error('Please connect your wallet first', { duration: TOAST_DURATION })
      return false
    }

    setIsUnstaking(true)
    try {
      const stakingPoolAddress = new PublicKey(SOLANA_MINT_ADDRESS)
      const stakingAccountPublicKey = await getStakingAccount(publicKey)
      
      // Create a temporary keypair for the transaction
      // In a real-world scenario, you would use the user's actual keypair
      const tempKeypair = Keypair.generate()
      
      const signature = await unstakeTokens(
        tempKeypair,
        stakingAccountPublicKey,
        amount,
        stakingPoolAddress
      )
      
      toast.success(`Successfully unstaked ${amount} ${BARK_TOKEN_SYMBOL} tokens`, { duration: TOAST_DURATION })
      await fetchStakingAccount()
      return true
    } catch (error) {
      console.error('Unstaking error:', error)
      toast.error('An error occurred while unstaking. Please try again.', { duration: TOAST_DURATION })
      return false
    } finally {
      setIsUnstaking(false)
    }
  }

  const claimRewards = async (amount: number) => {
    if (!publicKey || !signMessage) {
      toast.error('Please connect your wallet first', { duration: TOAST_DURATION })
      return false
    }

    setIsClaiming(true)
    try {
      const message = `Claim ${amount} ${BARK_TOKEN_SYMBOL} rewards`
      const encodedMessage = new TextEncoder().encode(message)
      const signature = await signMessage(encodedMessage)

      const request: ClaimRewardRequest = {
        userId: publicKey.toString(),
        amount: amount,
        signature: Buffer.from(signature).toString('base64'),
      }

      const response = await claimRewardsAPI(request)
      if (response.success) {
        toast.success(response.message, { duration: TOAST_DURATION })
        await fetchRewards()
        return true
      } else {
        toast.error(response.message, { duration: TOAST_DURATION })
        return false
      }
    } catch (error) {
      console.error('Claim rewards error:', error)
      toast.error('An error occurred while claiming rewards. Please try again.', { duration: TOAST_DURATION })
      return false
    } finally {
      setIsClaiming(false)
    }
  }

  const fetchRewardStats = async () => {
    setIsLoadingStats(true)
    try {
      const stats = await fetchRewardStatsAPI()
      setRewardStats(stats)
    } catch (error) {
      console.error('Error fetching reward stats:', error)
      toast.error('Failed to fetch reward statistics', { duration: TOAST_DURATION })
    } finally {
      setIsLoadingStats(false)
    }
  }

  const fetchRewards = useCallback(async () => {
    if (!publicKey) return

    try {
      const rewardsData = await getRewards(publicKey)
      setRewards(rewardsData as RewardType[])
    } catch (error) {
      console.error('Error fetching rewards:', error)
      toast.error('Failed to fetch rewards', { duration: TOAST_DURATION })
    }
  }, [publicKey])

  return { 
    stakeTokens: stakeTokensHandler, 
    unstakeTokens: unstakeTokensHandler, 
    claimRewards,
    isStaking, 
    isUnstaking, 
    isClaiming,
    rewardStats, 
    isLoadingStats, 
    fetchRewardStats,
    stakingAccount,
    fetchStakingAccount,
    rewards,
    fetchRewards
  }
}


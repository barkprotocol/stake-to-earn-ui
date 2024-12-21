import { Prisma } from '@prisma/client'

// User type
export type User = {
  id: string
  walletAddress: string
  email?: string | null
  name?: string | null
  createdAt: Date
  updatedAt: Date
  stakes: Stake[]
  rewards: Reward[]
}

// Stake type
export type Stake = {
  id: string
  userId: string
  amount: Prisma.Decimal
  startDate: Date
  endDate?: Date | null
  status: 'active' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
  user: User
}

// Reward type
export type Reward = {
  id: string
  userId: string
  amount: Prisma.Decimal
  claimedAt: Date
  transactionHash: string
  createdAt: Date
  updatedAt: Date
  user: User
}

// StakingPool type
export type StakingPool = {
  id: string
  totalStaked: Prisma.Decimal
  rewardRate: Prisma.Decimal
  startDate: Date
  endDate?: Date | null
  status: 'active' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

// Transaction type
export type Transaction = {
  id: string
  userId: string
  type: 'stake' | 'unstake' | 'reward'
  amount: Prisma.Decimal
  status: 'pending' | 'completed' | 'failed'
  transactionHash: string
  createdAt: Date
  updatedAt: Date
  user: User
}

// Define some utility types
export type UserWithStakes = User & { stakes: Stake[] }
export type UserWithRewards = User & { rewards: Reward[] }
export type StakeWithUser = Stake & { user: User }
export type RewardWithUser = Reward & { user: User }


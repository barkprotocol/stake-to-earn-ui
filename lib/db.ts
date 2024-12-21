import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

// Helper function to handle database errors
export function handleDatabaseError(error: unknown, res: NextApiResponse) {
  console.error('Database error:', error)
  res.status(500).json({ error: 'Internal server error' })
}

// Utility function to get user by ID
export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      stakes: true,
      rewards: true,
    },
  })
}

// Utility function to get user by wallet address
export async function getUserByWalletAddress(walletAddress: string) {
  return await prisma.user.findUnique({
    where: { walletAddress },
    include: {
      stakes: true,
      rewards: true,
    },
  })
}

// Utility function to create a new user
export async function createUser(data: { walletAddress: string; name?: string; email?: string }) {
  return await prisma.user.create({
    data,
  })
}

// Utility function to update user
export async function updateUser(id: string, data: { name?: string; email?: string; walletAddress?: string }) {
  return await prisma.user.update({
    where: { id },
    data,
  })
}

// Utility function to create a new stake
export async function createStake(data: { userId: string; amount: number; status: 'active' | 'completed' | 'cancelled' }) {
  return await prisma.stake.create({
    data: {
      ...data,
      startDate: new Date(),
    },
  })
}

// Utility function to update stake status
export async function updateStakeStatus(id: number, status: 'active' | 'completed' | 'cancelled') {
  return await prisma.stake.update({
    where: { id },
    data: {
      status,
      endDate: status === 'completed' || status === 'cancelled' ? new Date() : undefined,
    },
  })
}

// Utility function to get all active stakes for a user
export async function getActiveStakesForUser(userId: string) {
  return await prisma.stake.findMany({
    where: {
      userId,
      status: 'active',
    },
  })
}

// Utility function to create a new reward
export async function createReward(data: { userId: string; amount: number; transactionHash: string }) {
  return await prisma.reward.create({
    data: {
      ...data,
      claimedAt: new Date(),
    },
  })
}

// Utility function to get all rewards for a user
export async function getRewardsForUser(userId: string) {
  return await prisma.reward.findMany({
    where: { userId },
    orderBy: { claimedAt: 'desc' },
  })
}

// Utility function to get total staked amount for a user
export async function getTotalStakedAmountForUser(userId: string) {
  const result = await prisma.stake.aggregate({
    where: {
      userId,
      status: 'active',
    },
    _sum: {
      amount: true,
    },
  })
  return result._sum.amount || 0
}

// Utility function to get total rewards claimed by a user
export async function getTotalRewardsClaimedByUser(userId: string) {
  const result = await prisma.reward.aggregate({
    where: { userId },
    _sum: {
      amount: true,
    },
  })
  return result._sum.amount || 0
}

// Middleware to handle database connections
export function withDatabase(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res)
    } catch (error) {
      handleDatabaseError(error, res)
    } finally {
      await prisma.$disconnect()
    }
  }
}


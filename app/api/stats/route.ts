import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getTotalStakedAmount, getRewardsDistributed } from '@/lib/solana-transaction-utils'
import { SOLANA_MINT_ADDRESS } from '@/config/constants'
import { PublicKey } from '@solana/web3.js'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  if (type === 'platform') {
    return getPlatformStats()
  } else if (type === 'user') {
    return getUserStats(req)
  } else {
    return NextResponse.json({ error: 'Invalid stats type' }, { status: 400 })
  }
}

async function getPlatformStats() {
  try {
    const totalUsers = await prisma.user.count()
    const totalStakes = await prisma.stake.count()
    const totalRewards = await prisma.reward.count()

    const totalStakedAmount = await getTotalStakedAmount(new PublicKey(SOLANA_MINT_ADDRESS))
    const totalRewardsDistributed = await getRewardsDistributed(new PublicKey(SOLANA_MINT_ADDRESS))

    const activeStakes = await prisma.stake.count({
      where: { status: 'active' },
    })

    const stats = {
      totalUsers,
      totalStakes,
      totalRewards,
      totalStakedAmount,
      totalRewardsDistributed,
      activeStakes,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching platform stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getUserStats(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        stakes: true,
        rewards: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const totalStaked = user.stakes.reduce((sum, stake) => sum + stake.amount, 0)
    const totalRewards = user.rewards.reduce((sum, reward) => sum + reward.amount, 0)
    const activeStakes = user.stakes.filter(stake => stake.status === 'active').length

    let currentStakedAmount = 0
    if (user.walletAddress) {
      currentStakedAmount = await getTotalStakedAmount(new PublicKey(user.walletAddress))
    }

    const stats = {
      totalStaked,
      totalRewards,
      activeStakes,
      currentStakedAmount,
      totalStakes: user.stakes.length,
      totalRewardsClaimed: user.rewards.length,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


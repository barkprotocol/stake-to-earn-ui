import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { PublicKey } from '@solana/web3.js'
import { getRewardsBalance, claimRewards } from '@/lib/staking'
import { BARK_TOKEN_SYMBOL } from '@/config/constants'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, walletAddress: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.walletAddress) {
      return NextResponse.json({ error: 'Wallet not connected' }, { status: 400 })
    }

    const rewardsBalance = await getRewardsBalance(new PublicKey(user.walletAddress))

    const claimedRewards = await prisma.reward.findMany({
      where: { userId: user.id },
      orderBy: { claimedAt: 'desc' },
      take: 10,
    })

    return NextResponse.json({
      currentRewards: rewardsBalance,
      claimedRewards,
    })
  } catch (error) {
    console.error('Error fetching rewards data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { amount } = body

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, walletAddress: true },
    })

    if (!user || !user.walletAddress) {
      return NextResponse.json({ error: 'User or wallet not found' }, { status: 404 })
    }

    const claimAmount = parseFloat(amount)
    const userPublicKey = new PublicKey(user.walletAddress)

    const signature = await claimRewards(userPublicKey, claimAmount)

    const claimedReward = await prisma.reward.create({
      data: {
        userId: user.id,
        amount: claimAmount,
        transactionHash: signature,
      },
    })

    return NextResponse.json({
      message: `Successfully claimed ${claimAmount} ${BARK_TOKEN_SYMBOL}`,
      claimedReward,
    })
  } catch (error) {
    console.error('Error claiming rewards:', error)
    return NextResponse.json({ error: 'Failed to claim rewards' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  if (type === 'stats') {
    return getRewardStats(req)
  }

  // If no type is specified, return the user's rewards (handled by the previous GET function)
  return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
}

async function getRewardStats(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const totalRewardsDistributed = await prisma.reward.aggregate({
      _sum: {
        amount: true,
      },
    })

    const totalParticipants = await prisma.user.count({
      where: {
        rewards: {
          some: {},
        },
      },
    })

    const averageRewardPerUser = totalRewardsDistributed._sum.amount
      ? totalRewardsDistributed._sum.amount / totalParticipants
      : 0

    return NextResponse.json({
      totalRewardsDistributed: totalRewardsDistributed._sum.amount || 0,
      totalParticipants,
      averageRewardPerUser,
    })
  } catch (error) {
    console.error('Error fetching reward stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


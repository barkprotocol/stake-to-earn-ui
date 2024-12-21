import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { claimRewards, getRewardsBalance } from '@/lib/solana-transaction-utils'
import { PublicKey } from '@solana/web3.js'
import { SOLANA_MINT_ADDRESS, MINIMUM_CLAIM_AMOUNT } from '@/config/constants'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        rewards: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.walletAddress) {
      return NextResponse.json({ error: 'Wallet address not set' }, { status: 400 })
    }

    const rewardsBalance = await getRewardsBalance(new PublicKey(user.walletAddress))

    return NextResponse.json({
      rewards: user.rewards,
      rewardsBalance,
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

  const body = await req.json()
  const { action, amount } = body

  if (action !== 'claim' || !amount || isNaN(parseFloat(amount))) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (parseFloat(amount) < MINIMUM_CLAIM_AMOUNT) {
    return NextResponse.json({ error: `Minimum claim amount is ${MINIMUM_CLAIM_AMOUNT}` }, { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user || !user.walletAddress) {
      return NextResponse.json({ error: 'User wallet not found' }, { status: 404 })
    }

    const walletPublicKey = new PublicKey(user.walletAddress)
    const tokenMintPublicKey = new PublicKey(SOLANA_MINT_ADDRESS)

    const transaction = await claimRewards(walletPublicKey, parseFloat(amount), tokenMintPublicKey)

    // In a real-world scenario, you would send this transaction to be signed by the user's wallet
    // and then submit it to the Solana network. For this example, we'll just simulate success.

    // Record the reward claim in the database
    const claimedReward = await prisma.reward.create({
      data: {
        userId: user.id,
        amount: parseFloat(amount),
        transactionHash: 'simulated_transaction_hash', // In reality, this would be the actual transaction hash
      },
    })

    return NextResponse.json({
      message: 'Rewards claimed successfully',
      reward: claimedReward,
    })
  } catch (error) {
    console.error('Error claiming rewards:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { action, data } = body

  if (!action || !data) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  try {
    let updatedUser

    switch (action) {
      case 'updateProfile':
        updatedUser = await prisma.user.update({
          where: { id: session.user.id },
          data: {
            name: data.name,
            email: data.email,
          },
        })
        break

      case 'updateWallet':
        if (!data.walletAddress) {
          return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
        }
        updatedUser = await prisma.user.update({
          where: { id: session.user.id },
          data: { walletAddress: data.walletAddress },
        })
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


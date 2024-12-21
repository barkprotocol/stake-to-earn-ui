import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { stakeTokens, unstakeTokens, getStakingAccount } from '@/lib/solana-transaction-utils'
import { PublicKey } from '@solana/web3.js'
import { SOLANA_MINT_ADDRESS, MINIMUM_STAKE_AMOUNT } from '@/config/constants'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        stakes: {
          where: { status: 'active' },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.walletAddress) {
      return NextResponse.json({ error: 'Wallet address not set' }, { status: 400 })
    }

    const stakingAccount = await getStakingAccount(new PublicKey(user.walletAddress))

    return NextResponse.json({
      stakes: user.stakes,
      stakingAccount,
    })
  } catch (error) {
    console.error('Error fetching staking data:', error)
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

  if (!action || !amount || isNaN(parseFloat(amount))) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (parseFloat(amount) < MINIMUM_STAKE_AMOUNT) {
    return NextResponse.json({ error: `Minimum stake amount is ${MINIMUM_STAKE_AMOUNT}` }, { status: 400 })
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

    let transaction
    if (action === 'stake') {
      transaction = await stakeTokens(walletPublicKey, parseFloat(amount), tokenMintPublicKey)
    } else if (action === 'unstake') {
      transaction = await unstakeTokens(walletPublicKey, parseFloat(amount), tokenMintPublicKey)
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // In a real-world scenario, you would send this transaction to be signed by the user's wallet
    // and then submit it to the Solana network. For this example, we'll just simulate success.

    // Update the user's stake in the database
    const updatedStake = await prisma.stake.create({
      data: {
        userId: user.id,
        amount: parseFloat(amount),
        status: action === 'stake' ? 'active' : 'completed',
      },
    })

    return NextResponse.json({
      message: `${action === 'stake' ? 'Staking' : 'Unstaking'} successful`,
      stake: updatedStake,
    })
  } catch (error) {
    console.error(`Error ${action === 'stake' ? 'staking' : 'unstaking'}:`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { stakeId, newStatus } = body

  if (!stakeId || !newStatus) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  try {
    const updatedStake = await prisma.stake.update({
      where: { id: stakeId, userId: session.user.id },
      data: { status: newStatus },
    })

    return NextResponse.json({
      message: 'Stake status updated successfully',
      stake: updatedStake,
    })
  } catch (error) {
    console.error('Error updating stake status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


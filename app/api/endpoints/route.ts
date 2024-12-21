import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { stakeTokens, unstakeTokens } from '@/lib/solana-transaction-utils'
import { PublicKey } from '@solana/web3.js'
import { SOLANA_MINT_ADDRESS } from '@/config/constants'

export async function GET(req: Request) {
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

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { action, amount } = body

  if (!action || !amount || isNaN(parseFloat(amount))) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
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
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        stakes: {
          create: {
            amount: parseFloat(amount),
            status: action === 'stake' ? 'active' : 'completed',
          },
        },
      },
      include: {
        stakes: true,
      },
    })

    return NextResponse.json({
      message: `${action === 'stake' ? 'Staking' : 'Unstaking'} successful`,
      user: updatedUser,
    })
  } catch (error) {
    console.error(`Error ${action === 'stake' ? 'staking' : 'unstaking'}:`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { walletAddress } = body

  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { walletAddress },
    })

    return NextResponse.json({
      message: 'Wallet address updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Error updating wallet address:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


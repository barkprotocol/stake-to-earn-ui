import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// Email validation schema
const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate the email
    const result = emailSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const { email } = result.data

    // Check if the email already exists
    const existingSubscription = await prisma.subscription.findUnique({
      where: { email },
    })

    if (existingSubscription) {
      return NextResponse.json({ message: 'Email already subscribed' }, { status: 200 })
    }

    // Create new subscription
    const newSubscription = await prisma.subscription.create({
      data: { email },
    })

    return NextResponse.json({ 
      message: 'Subscription successful', 
      subscription: newSubscription 
    }, { status: 201 })

  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 })
  }

  try {
    const subscription = await prisma.subscription.findUnique({
      where: { email },
    })

    if (subscription) {
      return NextResponse.json({ subscribed: true })
    } else {
      return NextResponse.json({ subscribed: false })
    }
  } catch (error) {
    console.error('Subscription check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 })
  }

  try {
    await prisma.subscription.delete({
      where: { email },
    })

    return NextResponse.json({ message: 'Unsubscribed successfully' })
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


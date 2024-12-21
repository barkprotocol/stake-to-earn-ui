import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { walletAddress } = await request.json()

  // This is a mock implementation. Replace with actual reward claiming logic.
  const success = Math.random() > 0.2 // 80% success rate for demonstration

  if (success) {
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ success: false }, { status: 400 })
  }
}


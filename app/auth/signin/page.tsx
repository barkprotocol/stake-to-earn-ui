'use client'

import { signIn } from 'next-auth/react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function SignIn() {
  const { publicKey, signMessage } = useWallet()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const router = useRouter()

  const handleSignIn = async () => {
    if (!publicKey || !signMessage) {
      toast.error('Please connect your wallet first')
      return
    }

    setIsSigningIn(true)
    try {
      const message = `Sign in to BARK Protocol\nNonce: ${Date.now()}`
      const messageBytes = new TextEncoder().encode(message)
      const signature = await signMessage(messageBytes)

      const result = await signIn('credentials', {
        message,
        signature: Buffer.from(signature).toString('base64'),
        publicKey: Buffer.from(publicKey.toBytes()).toString('base64'),
        redirect: false,
      })

      if (result?.error) {
        toast.error('Failed to sign in')
      } else {
        toast.success('Successfully signed in')
        router.push('/')
      }
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error('Failed to sign in')
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-gray-900 p-6 text-center">
        <h1 className="text-3xl font-bold text-white">Sign In to BARK Protocol</h1>
        <p className="text-gray-400">
          Connect your wallet and sign a message to authenticate
        </p>
        <Button
          onClick={handleSignIn}
          disabled={!publicKey || isSigningIn}
          className="w-full"
        >
          {isSigningIn ? 'Signing In...' : 'Sign In with Wallet'}
        </Button>
      </div>
    </div>
  )
}


'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-gray-900 p-6 text-center">
        <h1 className="text-3xl font-bold text-white">Authentication Error</h1>
        <p className="text-red-400">
          {error || 'An error occurred during authentication'}
        </p>
        <Button asChild>
          <Link href="/auth/signin">Try Again</Link>
        </Button>
      </div>
    </div>
  )
}


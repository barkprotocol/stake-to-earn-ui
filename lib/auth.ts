import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { verifyMessage } from '@solana/web3.js'
import { getCsrfToken } from 'next-auth/react'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Solana',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
        },
        signature: {
          label: 'Signature',
          type: 'text',
        },
        publicKey: {
          label: 'Public Key',
          type: 'text',
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.message || !credentials?.signature || !credentials?.publicKey) {
            throw new Error('Missing credentials')
          }

          // Verify the signature
          const messageUint8 = new TextEncoder().encode(credentials.message)
          const signatureUint8 = new Uint8Array(Buffer.from(credentials.signature, 'base64'))
          const publicKeyUint8 = new Uint8Array(Buffer.from(credentials.publicKey, 'base64'))

          const isValid = verifyMessage(messageUint8, signatureUint8, publicKeyUint8)

          if (!isValid) {
            throw new Error('Invalid signature')
          }

          // Return the user object
          return {
            id: credentials.publicKey,
            name: credentials.publicKey,
          }
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
}

// Helper function to get CSRF token
export async function getAuthToken(req?: Request) {
  if (req) {
    const csrfToken = await getCsrfToken({ req })
    return csrfToken
  }
  return await getCsrfToken()
}

// Types
export interface AuthSession {
  user: {
    id: string
    name: string
  }
}


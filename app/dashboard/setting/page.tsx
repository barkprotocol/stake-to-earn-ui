import { Metadata } from 'next'
import { UserSettings } from '@/components/users/settings'
import React from 'react'

export const metadata: Metadata = {
  title: 'User Settings | BARK Protocol',
  description: 'Manage your account settings for BARK Protocol',
}

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      <UserSettings />
    </div>
  )
}


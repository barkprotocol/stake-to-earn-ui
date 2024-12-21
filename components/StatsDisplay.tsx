'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

interface PlatformStats {
  totalUsers: number
  totalStakes: number
  totalRewards: number
  totalStakedAmount: number
  totalRewardsDistributed: number
  activeStakes: number
}

interface UserStats {
  totalStaked: number
  totalRewards: number
  activeStakes: number
  currentStakedAmount: number
  totalStakes: number
  totalRewardsClaimed: number
}

export function StatsDisplay() {
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const platformResponse = await fetch('/api/stats?type=platform')
        const platformData = await platformResponse.json()
        setPlatformStats(platformData)

        if (session) {
          const userResponse = await fetch('/api/stats?type=user')
          const userData = await userResponse.json()
          setUserStats(userData)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [session])

  if (loading) {
    return <Skeleton className="w-full h-48" />
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Platform Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          {platformStats && (
            <ul>
              <li>Total Users: {platformStats.totalUsers}</li>
              <li>Total Stakes: {platformStats.totalStakes}</li>
              <li>Active Stakes: {platformStats.activeStakes}</li>
              <li>Total Staked: {platformStats.totalStakedAmount} BARK</li>
              <li>Total Rewards Distributed: {platformStats.totalRewardsDistributed} BARK</li>
            </ul>
          )}
        </CardContent>
      </Card>
      {session && userStats && (
        <Card>
          <CardHeader>
            <CardTitle>Your Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              <li>Total Staked: {userStats.totalStaked} BARK</li>
              <li>Current Staked Amount: {userStats.currentStakedAmount} BARK</li>
              <li>Active Stakes: {userStats.activeStakes}</li>
              <li>Total Rewards: {userStats.totalRewards} BARK</li>
              <li>Total Stakes: {userStats.totalStakes}</li>
              <li>Total Rewards Claimed: {userStats.totalRewardsClaimed}</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


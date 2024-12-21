// Add this function to the existing api.ts file
export async function claimRewards(walletAddress: string): Promise<{ success: boolean }> {
  try {
    const response = await fetch('/api/claim-rewards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletAddress }),
    })

    if (!response.ok) {
      throw new Error('Failed to claim rewards')
    }

    return await response.json()
  } catch (error) {
    console.error('Error claiming rewards:', error)
    return { success: false }
  }
}


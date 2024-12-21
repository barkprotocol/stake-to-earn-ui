export const config = {
  app: {
    name: 'BARK Protocol',
    description: 'Stake your BARK tokens and earn rewards',
  },
  staking: {
    minStakeAmount: 1, // Minimum amount of BARK tokens that can be staked
    rewardRate: 0.05, // 5% annual reward rate
    compoundingFrequency: 'daily', // How often rewards are compounded
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  },
  solana: {
    network: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet',
    rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  },
}


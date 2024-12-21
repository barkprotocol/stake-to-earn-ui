import { PublicKey } from '@solana/web3.js';

// The public key of the token program
export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXkQd5J8X8wnF8MPzYx');

// API Endpoints
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.staking.barkprotocol.com'; // Default or env-specific API URL
export const STAKING_API_URL = `${API_URL}/staking`;
export const REWARDS_API_URL = `${API_URL}/rewards`;

// Solana Config
export const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet'; // Can be 'mainnet', 'devnet', or 'testnet'
export const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
export const SOLANA_MINT_ADDRESS = process.env.NFT_PROGRAM_ID || '2NTvEssJ2i998V2cMGT4Fy3JhyFnAzHFonDo9dbAkVrg';

export const STAKING_PROGRAM_ID = new PublicKey('2NTvEssJ2i998V2cMGT4Fy3JhyFnAzHFonDo9dbAkVrg');
export const STAKING_POOL_PROGRAM_ID = new PublicKey('SPoo1Ku8WFXoNDMHPsrGSTSG1Y47rzgn41SLUNakuHy');
export const BARK_TOKEN_MINT_ADDRESS = new PublicKey('2NTvEssJ2i998V2cMGT4Fy3JhyFnAzHFonDo9dbAkVrg');

// Token Configurations
export const BARK_TOKEN_SYMBOL = 'BARK';
export const TOKEN_DECIMALS = 9; // Solana tokens typically use 9 decimals

// Staking Configurations
export const MINIMUM_STAKE_AMOUNT = 1; // Minimum amount of tokens for staking
export const REWARD_FREQUENCY = 'hourly'; // Frequency of reward distribution (e.g., daily, weekly, etc.)
export const REWARD_RATE = 0.05; // Reward rate for staking (e.g., 5%)

// User Configurations
export const USER_PROFILE_URL = '/api/users/profile'; // API endpoint for user profiles
export const USER_WALLET_ADDRESS = process.env.DEFAULT_WALLET_ADDRESS || 'default_wallet_address'; // Default wallet address for testing

// Error Tracking
export const ERROR_TRACKING_URL = process.env.ERROR_TRACKING_SERVICE_URL || 'https://errors.example.com/report';

// Token Minting API
export const NFT_MINT_API_URL = process.env.NEXT_PUBLIC_MINT_API_URL || 'https://api.minting.example.com/mint';

// Social Media and Contact
export const DISCORD_URL = 'https://discord.gg/bark-protocol';
export const X_URL = 'https://x.com/bark_protocol';

// Metadata
export const FAQ_PAGE_TITLE = 'Frequently Asked Questions - BARK Token';
export const FAQ_PAGE_DESCRIPTION = 'Find answers to common questions about the BARK Token ($BARK) and how to stake or earn rewards.';

// Other Configurations
export const DEFAULT_LANGUAGE = 'en'; // Default language for the application
export const THEME_COLOR = '#1A202C'; // Default theme color for the application (dark gray)
export const LIGHT_THEME_COLOR = '#F7FAFC'; // Light theme background color

// Environment Settings
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Toast Notifications
export const TOAST_DURATION = 5000; // Duration for toast notifications in milliseconds


import { Prisma } from '@prisma/client';

// Rewards type based on the Prisma model
export type Reward = Prisma.RewardsGetPayload<{
  select: {
    id: true;
    userId: true;
    amount: true;
    claimedAt: true;
  };
}>;

// Define a type for the payload of a claim request
export interface ClaimRewardRequest {
  userId: string;  // User making the claim
  amount: number;  // Amount of rewards the user is claiming
  signature: string;  // Signed message to verify the claim
}

// Define a type for the response when claiming rewards
export interface ClaimRewardResponse {
  success: boolean;  // Whether the claim was successful
  message: string;   // Message detailing the outcome
  txSignature?: string; // Optional transaction signature (if applicable)
}

// Define a type for the reward statistics (e.g., total rewards, claimed rewards)
export interface RewardStats {
  totalDistributed: string;  // Total rewards distributed
  totalClaimed: string;     // Total rewards claimed by users
  remainingToClaim: string; // Rewards that are still available for claim
  totalParticipants: number;  // Total number of participants in the staking program
}

// Define a type for the pagination of rewards (if you need to paginate through rewards data)
export interface PaginatedRewards {
  rewards: Reward[];  // Array of rewards for the current page
  totalCount: number; // Total number of rewards records (for pagination)
  currentPage: number; // The current page number
  totalPages: number;  // The total number of pages for pagination
}


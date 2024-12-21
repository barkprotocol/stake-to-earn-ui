import { supabase } from '@/lib/supabase'
import { 
  PublicKey, 
  Connection, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  TransactionInstruction,
  sendAndConfirmTransaction
} from '@solana/web3.js'
import { 
  TOKEN_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID, 
  getAssociatedTokenAddress, 
  createAssociatedTokenAccountInstruction, 
  createTransferInstruction 
} from '@solana/spl-token'
import { 
  SOLANA_RPC_URL, 
  BARK_TOKEN_MINT, 
  STAKING_PROGRAM_ID,
  REWARDS_DISTRIBUTION_PUBKEY
} from '@/config/constants'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { buildAndSendTransaction, isTransactionSuccessful } from './solana-transactions';
import BN from 'bn.js';

const connection = new Connection(SOLANA_RPC_URL, 'confirmed')

export interface StakingData {
  id: number
  userId: string
  amount: number
  startDate: Date
  endDate?: Date
  status: 'active' | 'completed' | 'cancelled'
}

export async function getStakingData(userId: string): Promise<StakingData[]> {
  const { data, error } = await supabase
    .from('staking')
    .select('*')
    .eq('userId', userId)

  if (error) throw new Error(`Failed to fetch staking data: ${error.message}`)
  return data || []
}

export async function createStake(userId: string, amount: number): Promise<StakingData> {
  const { data, error } = await supabase
    .from('staking')
    .insert({
      userId,
      amount,
      startDate: new Date().toISOString(),
      status: 'active'
    })
    .single()

  if (error) throw new Error(`Failed to create stake: ${error.message}`)
  return data
}

export async function updateStakeStatus(stakeId: number, status: 'completed' | 'cancelled'): Promise<void> {
  const { error } = await supabase
    .from('staking')
    .update({ status, endDate: new Date().toISOString() })
    .eq('id', stakeId)

  if (error) throw new Error(`Failed to update stake status: ${error.message}`)
}

export async function getTotalStakedAmount(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('staking')
    .select('amount')
    .eq('userId', userId)
    .eq('status', 'active')

  if (error) throw new Error(`Failed to fetch total staked amount: ${error.message}`)
  return data?.reduce((sum, stake) => sum + stake.amount, 0) || 0
}

export async function stakeTokens(
  wallet: WalletContextState,
  amount: number
): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  const userPublicKey = wallet.publicKey;
  const stakingProgramId = new PublicKey(STAKING_PROGRAM_ID);
  const barkTokenMint = new PublicKey(BARK_TOKEN_MINT);

  const userTokenAccount = await getAssociatedTokenAddress(barkTokenMint, userPublicKey);
  const stakingTokenAccount = await getAssociatedTokenAddress(barkTokenMint, stakingProgramId, true);

  const transaction = new Transaction();

  // Check if the staking program's associated token account exists
  const stakingAccountInfo = await connection.getAccountInfo(stakingTokenAccount);
  if (!stakingAccountInfo) {
    transaction.add(
      createAssociatedTokenAccountInstruction(
        userPublicKey,
        stakingTokenAccount,
        stakingProgramId,
        barkTokenMint
      )
    );
  }

  // Add the transfer instruction
  transaction.add(
    createTransferInstruction(
      userTokenAccount,
      stakingTokenAccount,
      userPublicKey,
      amount * LAMPORTS_PER_SOL
    )
  );

  // Add the staking instruction
  const stakeInstruction = new TransactionInstruction({
    keys: [
      { pubkey: userPublicKey, isSigner: true, isWritable: true },
      { pubkey: stakingTokenAccount, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    programId: stakingProgramId,
    data: Buffer.from([0, ...new BN(amount).toArray('le', 8)]) // 0 represents the "stake" instruction
  });
  transaction.add(stakeInstruction);

  try {
    const signature = await buildAndSendTransaction([transaction], [wallet.payer], userPublicKey);
    
    if (await isTransactionSuccessful(signature)) {
      console.log('Staking transaction successful:', signature);
      return signature;
    } else {
      throw new Error('Staking transaction failed');
    }
  } catch (error) {
    console.error('Error staking tokens:', error);
    throw new Error('Failed to stake tokens');
  }
}

export async function unstakeTokens(
  wallet: WalletContextState,
  amount: number
): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  const userPublicKey = wallet.publicKey;
  const stakingProgramId = new PublicKey(STAKING_PROGRAM_ID);
  const barkTokenMint = new PublicKey(BARK_TOKEN_MINT);

  const userTokenAccount = await getAssociatedTokenAddress(barkTokenMint, userPublicKey);
  const stakingTokenAccount = await getAssociatedTokenAddress(barkTokenMint, stakingProgramId, true);

  const unstakeInstruction = new TransactionInstruction({
    keys: [
      { pubkey: userPublicKey, isSigner: true, isWritable: true },
      { pubkey: stakingTokenAccount, isSigner: false, isWritable: true },
      { pubkey: userTokenAccount, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    programId: stakingProgramId,
    data: Buffer.from([1, ...new BN(amount).toArray('le', 8)]) // 1 represents the "unstake" instruction
  });

  try {
    const signature = await buildAndSendTransaction([unstakeInstruction], [wallet.payer], userPublicKey);
    
    if (await isTransactionSuccessful(signature)) {
      console.log('Unstaking transaction successful:', signature);
      return signature;
    } else {
      throw new Error('Unstaking transaction failed');
    }
  } catch (error) {
    console.error('Error unstaking tokens:', error);
    throw new Error('Failed to unstake tokens');
  }
}

export async function getRewardsBalance(userPublicKey: PublicKey): Promise<number> {
  const stakingProgramId = new PublicKey(STAKING_PROGRAM_ID)
  const barkTokenMint = new PublicKey(BARK_TOKEN_MINT)

  const userRewardsAccount = await getAssociatedTokenAddress(barkTokenMint, userPublicKey)
  const accountInfo = await connection.getTokenAccountBalance(userRewardsAccount)

  return accountInfo.value.uiAmount || 0
}

export async function claimRewards(
  wallet: WalletContextState,
  amount: number
): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  const userPublicKey = wallet.publicKey;
  const stakingProgramId = new PublicKey(STAKING_PROGRAM_ID);
  const barkTokenMint = new PublicKey(BARK_TOKEN_MINT);
  const rewardsDistributionPubkey = new PublicKey(REWARDS_DISTRIBUTION_PUBKEY);

  const userTokenAccount = await getAssociatedTokenAddress(barkTokenMint, userPublicKey);
  const rewardsTokenAccount = await getAssociatedTokenAddress(barkTokenMint, rewardsDistributionPubkey, true);

  const claimRewardsInstruction = new TransactionInstruction({
    keys: [
      { pubkey: userPublicKey, isSigner: true, isWritable: true },
      { pubkey: rewardsTokenAccount, isSigner: false, isWritable: true },
      { pubkey: userTokenAccount, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: rewardsDistributionPubkey, isSigner: false, isWritable: false },
    ],
    programId: stakingProgramId,
    data: Buffer.from([2, ...new BN(amount).toArray('le', 8)]) // 2 represents the "claim rewards" instruction
  });

  try {
    const signature = await buildAndSendTransaction([claimRewardsInstruction], [wallet.payer], userPublicKey);
    
    if (await isTransactionSuccessful(signature)) {
      console.log('Claim rewards transaction successful:', signature);
      return signature;
    } else {
      throw new Error('Claim rewards transaction failed');
    }
  } catch (error) {
    console.error('Error claiming rewards:', error);
    throw new Error('Failed to claim rewards');
  }
}

export async function getStakingStats(userPublicKey: PublicKey): Promise<{
  totalStaked: number,
  totalRewards: number,
  apr: number
}> {
  const totalStaked = await getTotalStakedAmount(userPublicKey.toBase58())
  const totalRewards = await getRewardsBalance(userPublicKey)
  
  // Calculate APR (this is a simplified calculation and should be adjusted based on your specific staking model)
  const apr = totalStaked > 0 ? (totalRewards / totalStaked) * 100 : 0

  return { totalStaked, totalRewards, apr }
}


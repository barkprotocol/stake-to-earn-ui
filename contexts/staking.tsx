import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  Keypair,
} from '@solana/web3.js';
import {
  SOLANA_RPC_URL,
  BARK_TOKEN_MINT_ADDRESS,
  TOKEN_PROGRAM_ID,
  MINIMUM_STAKE_AMOUNT,
  BARK_TOKEN_SYMBOL,
  STAKING_PROGRAM_ID,
} from '@/config/constants';
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from '@solana/spl-token';
import BN from 'bn.js';

// Initialize Solana connection
const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

// Helper: Fetch staking data
export const getStakingAccount = async (userPublicKey: PublicKey) => {
  try {
    const response = await fetch(`/api/staking/get-staking-data?address=${userPublicKey.toBase58()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch staking data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching staking data:', error);
    throw new Error('Failed to fetch staking data');
  }
};

// Helper: Create a transaction to initialize an associated token account if it doesn't exist
const ensureTokenAccountExists = async (
  userPublicKey: PublicKey,
  mint: PublicKey,
  owner: PublicKey
): Promise<TransactionInstruction[]> => {
  const instructions: TransactionInstruction[] = [];
  const associatedTokenAddress = await getAssociatedTokenAddress(mint, owner, true);
  const accountInfo = await connection.getAccountInfo(associatedTokenAddress);

  if (!accountInfo) {
    instructions.push(
      createAssociatedTokenAccountInstruction(userPublicKey, associatedTokenAddress, owner, mint)
    );
  }
  return instructions;
};

// Stake tokens
export const stakeToken = async (userPublicKey: PublicKey, amount: number): Promise<Transaction> => {
  try {
    if (amount < MINIMUM_STAKE_AMOUNT) {
      throw new Error(`Minimum staking amount is ${MINIMUM_STAKE_AMOUNT} ${BARK_TOKEN_SYMBOL}`);
    }

    const transaction = new Transaction();
    const stakingProgramId = new PublicKey(STAKING_PROGRAM_ID);
    const barkTokenMint = new PublicKey(BARK_TOKEN_MINT_ADDRESS);
    const userTokenAccount = await getAssociatedTokenAddress(barkTokenMint, userPublicKey);
    const stakingTokenAccount = await getAssociatedTokenAddress(barkTokenMint, stakingProgramId, true);

    // Ensure staking token account exists
    const initAccountInstructions = await ensureTokenAccountExists(userPublicKey, barkTokenMint, stakingProgramId);
    transaction.add(...initAccountInstructions);

    // Add transfer instruction
    transaction.add(
      createTransferInstruction(
        userTokenAccount,
        stakingTokenAccount,
        userPublicKey,
        amount * 1e9 // Convert to smallest unit
      )
    );

    // Add staking program instruction
    transaction.add(
      new TransactionInstruction({
        keys: [
          { pubkey: userPublicKey, isSigner: true, isWritable: true },
          { pubkey: stakingTokenAccount, isSigner: false, isWritable: true },
          { pubkey: new PublicKey(TOKEN_PROGRAM_ID), isSigner: false, isWritable: false },
        ],
        programId: stakingProgramId,
        data: Buffer.from([0, ...new BN(amount).toArray('le', 8)]), // 0 represents "stake" instruction
      })
    );

    return transaction;
  } catch (error) {
    console.error('Error creating staking transaction:', error);
    throw new Error('Failed to create staking transaction');
  }
};

// Unstake tokens
export const unstakeToken = async (
  userPublicKey: PublicKey,
  amount: number
): Promise<Transaction> => {
  try {
    if (amount <= 0) {
      throw new Error('Invalid unstaking amount');
    }

    const transaction = new Transaction();
    const stakingProgramId = new PublicKey(STAKING_PROGRAM_ID);
    const barkTokenMint = new PublicKey(BARK_TOKEN_MINT_ADDRESS);
    const userTokenAccount = await getAssociatedTokenAddress(barkTokenMint, userPublicKey);
    const stakingTokenAccount = await getAssociatedTokenAddress(barkTokenMint, stakingProgramId, true);

    // Add unstake instruction
    transaction.add(
      new TransactionInstruction({
        keys: [
          { pubkey: userPublicKey, isSigner: true, isWritable: true },
          { pubkey: stakingTokenAccount, isSigner: false, isWritable: true },
          { pubkey: userTokenAccount, isSigner: false, isWritable: true },
          { pubkey: new PublicKey(TOKEN_PROGRAM_ID), isSigner: false, isWritable: false },
        ],
        programId: stakingProgramId,
        data: Buffer.from([1, ...new BN(amount).toArray('le', 8)]), // 1 represents "unstake" instruction
      })
    );

    return transaction;
  } catch (error) {
    console.error('Error creating unstaking transaction:', error);
    throw new Error('Failed to create unstaking transaction');
  }
};

// Claim rewards
export const claimRewards = async (
  userPublicKey: PublicKey,
  amount: number
): Promise<Transaction> => {
  try {
    if (amount <= 0) {
      throw new Error('Invalid claim amount');
    }

    const transaction = new Transaction();
    const stakingProgramId = new PublicKey(STAKING_PROGRAM_ID);
    const barkTokenMint = new PublicKey(BARK_TOKEN_MINT_ADDRESS);
    const userTokenAccount = await getAssociatedTokenAddress(barkTokenMint, userPublicKey);
    const rewardsTokenAccount = await getAssociatedTokenAddress(barkTokenMint, stakingProgramId, true);

    // Add claim rewards instruction
    transaction.add(
      new TransactionInstruction({
        keys: [
          { pubkey: userPublicKey, isSigner: true, isWritable: true },
          { pubkey: rewardsTokenAccount, isSigner: false, isWritable: true },
          { pubkey: userTokenAccount, isSigner: false, isWritable: true },
          { pubkey: new PublicKey(TOKEN_PROGRAM_ID), isSigner: false, isWritable: false },
        ],
        programId: stakingProgramId,
        data: Buffer.from([2, ...new BN(amount).toArray('le', 8)]), // 2 represents "claim rewards" instruction
      })
    );

    return transaction;
  } catch (error) {
    console.error('Error creating claim rewards transaction:', error);
    throw new Error('Failed to create claim rewards transaction');
  }
};

// Helper: Send and confirm transaction
export const sendAndConfirmTransaction = async (
  transaction: Transaction,
  signers: Keypair[]
): Promise<string> => {
  try {
    const signature = await connection.sendTransaction(transaction, signers);
    await connection.confirmTransaction(signature, 'confirmed');
    return signature;
  } catch (error) {
    console.error('Error sending and confirming transaction:', error);
    throw new Error('Failed to send and confirm transaction');
  }
};

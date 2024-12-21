import { Connection, PublicKey, Transaction, TransactionInstruction, Keypair } from '@solana/web3.js';
import { SOLANA_RPC_URL, BARK_TOKEN_MINT_ADDRESS, TOKEN_PROGRAM_ID, MINIMUM_STAKE_AMOUNT, BARK_TOKEN_SYMBOL, STAKING_PROGRAM_ID } from '@/config/constants';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } from '@solana/spl-token';
import BN from 'bn.js';

// Initialize Solana connection
const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

// Fetch staking data for a user
export const getStakingAccount = async (userPublicKey: PublicKey) => {
  try {
    const response = await fetch(`/api/staking/get-staking-data?address=${userPublicKey.toBase58()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch staking data');
    }
    const stakingData = await response.json();
    return stakingData;
  } catch (error) {
    console.error('Error fetching staking data:', error);
    throw new Error('Failed to fetch staking data');
  }
};

// Stake tokens to a staking program
export const stakeToken = async (userPublicKey: PublicKey, amount: number): Promise<Transaction> => {
  try {
    if (amount < MINIMUM_STAKE_AMOUNT) {
      throw new Error(`Minimum staking amount is ${MINIMUM_STAKE_AMOUNT} ${BARK_TOKEN_SYMBOL}`);
    }

    const transaction = new Transaction();
    
    const stakingProgramId = new PublicKey(STAKING_PROGRAM_ID);
    const tokenProgramId = new PublicKey(TOKEN_PROGRAM_ID);
    const barkTokenMint = new PublicKey(BARK_TOKEN_MINT_ADDRESS);
    
    const userTokenAccount = await getAssociatedTokenAddress(barkTokenMint, userPublicKey);
    const stakingTokenAccount = await getAssociatedTokenAddress(barkTokenMint, stakingProgramId, true);

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
        amount * Math.pow(10, 9) // Assuming 9 decimals for BARK token
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
      data: Buffer.from([0, ...new Uint8Array(new Float64Array([amount]).buffer)]) // 0 represents the "stake" instruction
    });
    transaction.add(stakeInstruction);

    return transaction;
  } catch (error) {
    console.error('Error creating staking transaction:', error);
    throw new Error('Failed to create staking transaction');
  }
};

// Unstake tokens from a staking program
export const unstakeToken = async (connection: Connection, userPublicKey: PublicKey, amount: number): Promise<Transaction> => {
  try {
    if (amount <= 0) {
      throw new Error('Invalid unstaking amount');
    }

    const transaction = new Transaction();
    
    const stakingProgramId = new PublicKey(STAKING_PROGRAM_ID);
    const barkTokenMint = new PublicKey(BARK_TOKEN_MINT_ADDRESS);
    
    const userTokenAccount = await getAssociatedTokenAddress(barkTokenMint, userPublicKey);
    const stakingTokenAccount = await getAssociatedTokenAddress(barkTokenMint, stakingProgramId, true);

    // Add the unstaking instruction
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
    transaction.add(unstakeInstruction);

    return transaction;
  } catch (error) {
    console.error('Error creating unstaking transaction:', error);
    throw new Error('Failed to create unstaking transaction');
  }
};

// Function to fetch the reward balance of the user
export const getRewards = async (connection: Connection, publicKey: PublicKey) => {
  try {
    const barkTokenMint = new PublicKey(BARK_TOKEN_MINT_ADDRESS);
    const userTokenAccount = await getAssociatedTokenAddress(barkTokenMint, publicKey);
    const accountInfo = await connection.getTokenAccountBalance(userTokenAccount);
    return accountInfo.value.uiAmount || 0;
  } catch (error) {
    console.error('Error fetching rewards:', error);
    throw new Error('Failed to fetch rewards');
  }
};

// Function to claim rewards
export const claimRewards = async (connection: Connection, userPublicKey: PublicKey, amount: number): Promise<Transaction> => {
  try {
    if (amount <= 0) {
      throw new Error('Invalid claim amount');
    }

    const transaction = new Transaction();
    
    const stakingProgramId = new PublicKey(STAKING_PROGRAM_ID);
    const barkTokenMint = new PublicKey(BARK_TOKEN_MINT_ADDRESS);
    
    const userTokenAccount = await getAssociatedTokenAddress(barkTokenMint, userPublicKey);
    const rewardsTokenAccount = await getAssociatedTokenAddress(barkTokenMint, stakingProgramId, true);

    // Add the claim rewards instruction
    const claimRewardsInstruction = new TransactionInstruction({
      keys: [
        { pubkey: userPublicKey, isSigner: true, isWritable: true },
        { pubkey: rewardsTokenAccount, isSigner: false, isWritable: true },
        { pubkey: userTokenAccount, isSigner: false, isWritable: true },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      ],
      programId: stakingProgramId,
      data: Buffer.from([2, ...new Uint8Array(new Float64Array([amount]).buffer)]) // 2 represents the "claim rewards" instruction
    });
    transaction.add(claimRewardsInstruction);

    return transaction;
  } catch (error) {
    console.error('Error creating claim rewards transaction:', error);
    throw new Error('Failed to create claim rewards transaction');
  }
};

// Helper function to send and confirm a transaction
export const sendAndConfirmTransaction = async (connection: Connection, transaction: Transaction, signers: Keypair[]): Promise<string> => {
  try {
    const signature = await connection.sendTransaction(transaction, signers);
    await connection.confirmTransaction(signature, 'confirmed');
    return signature;
  } catch (error) {
    console.error('Error sending and confirming transaction:', error);
    throw new Error('Failed to send and confirm transaction');
  }
};


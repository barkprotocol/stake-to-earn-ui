import { Connection, PublicKey, Transaction, TransactionInstruction, Keypair, SystemProgram } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, createAssociatedTokenAccountInstruction, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { SOLANA_RPC_URL } from '@/config/constants';

// Initialize Solana connection
const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

export async function createTokenTransferTransaction(
  senderPublicKey: PublicKey,
  recipientPublicKey: PublicKey,
  amount: number,
  tokenMint: PublicKey,
  _senderKeypair: Keypair
): Promise<Transaction> {
  const transaction = new Transaction();

  const senderTokenAccount = await getAssociatedTokenAddress(tokenMint, senderPublicKey);
  const recipientTokenAccount = await getAssociatedTokenAddress(tokenMint, recipientPublicKey);

  const recipientTokenAccountExists = await connection.getAccountInfo(recipientTokenAccount);
  if (!recipientTokenAccountExists) {
    const createAccountInstruction = createAssociatedTokenAccountInstruction(
      senderPublicKey,
      recipientPublicKey,
      recipientTokenAccount,
      tokenMint
    );
    transaction.add(createAccountInstruction);
  }

  const transferInstruction = createTransferInstruction(
    senderTokenAccount,
    recipientTokenAccount,
    senderPublicKey,
    amount,
    [],
    TOKEN_PROGRAM_ID
  );

  transaction.add(transferInstruction);

  return transaction;
}

export async function createTokenAccountIfNecessary(
  owner: PublicKey,
  tokenMint: PublicKey,
  payer: Keypair
): Promise<Transaction> {
  const transaction = new Transaction();

  const tokenAccount = await getAssociatedTokenAddress(tokenMint, owner);

  const tokenAccountInfo = await connection.getAccountInfo(tokenAccount);
  if (!tokenAccountInfo) {
    const createAccountInstruction = createAssociatedTokenAccountInstruction(
      payer.publicKey,
      owner,
      tokenAccount,
      tokenMint
    );
    transaction.add(createAccountInstruction);
  }

  return transaction;
}

export async function sendTransaction(
  transaction: Transaction,
  signers: Keypair[]
): Promise<string> {
  try {
    const signature = await connection.sendTransaction(transaction, signers, {
      skipPreflight: false,
      preflightCommitment: 'processed',
    });
    await connection.confirmTransaction(signature, 'processed');
    return signature;
  } catch (error) {
    console.error('Transaction failed', error);
    throw new Error('Transaction failed');
  }
}

export const stakeTokens = async (
  wallet: Keypair,
  stakingAccount: PublicKey,
  amount: number,
  stakingPoolAddress: PublicKey
): Promise<string> => {
  // Initialize token object for the user's token
  const token = new Token(connection, stakingAccount, TOKEN_PROGRAM_ID, wallet);

  // Create transaction to transfer the tokens to the staking pool
  const transaction = new Transaction().add(
    Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      stakingAccount, // User's token account
      stakingPoolAddress, // Staking pool address
      wallet.publicKey, // Signer
      [],
      amount
    )
  );

  // Send the transaction to Solana
  try {
    const signature = await connection.sendTransaction(transaction, [wallet], { skipPreflight: false });
    await connection.confirmTransaction(signature);
    return signature;
  } catch (error) {
    console.error('Error staking tokens:', error);
    throw new Error('Failed to stake tokens');
  }
};

export const unstakeTokens = async (
  wallet: Keypair,
  stakingAccount: PublicKey,
  amount: number,
  stakingPoolAddress: PublicKey
): Promise<string> => {
  // Initialize token object for the user's token
  const token = new Token(connection, stakingAccount, TOKEN_PROGRAM_ID, wallet);

  // Create transaction to transfer the tokens back from the staking pool to the user
  const transaction = new Transaction().add(
    Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      stakingPoolAddress, // Staking pool address
      stakingAccount, // User's token account
      wallet.publicKey, // Signer
      [],
      amount
    )
  );

  // Send the transaction to Solana
  try {
    const signature = await connection.sendTransaction(transaction, [wallet], { skipPreflight: false });
    await connection.confirmTransaction(signature);
    return signature;
  } catch (error) {
    console.error('Error unstaking tokens:', error);
    throw new Error('Failed to unstake tokens');
  }
};


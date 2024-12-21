import { Connection, Transaction, sendAndConfirmTransaction, Signer, TransactionInstruction, PublicKey } from '@solana/web3.js';
import { toast } from 'react-hot-toast';
import { SOLANA_RPC_URL } from '@/config/constants';

// Initialize Solana connection
const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

/**
 * Sends a transaction to the Solana network and confirms it
 * @param transaction The transaction to send
 * @param signers The signers of the transaction
 * @returns The transaction signature
 */
export async function sendTransactionToSolana(transaction: Transaction, signers: Signer[]): Promise<string> {
  try {
    // Send and confirm the transaction
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      signers,
      {
        commitment: 'confirmed',
        preflightCommitment: 'confirmed',
      }
    );

    console.log('Transaction sent:', signature);
    toast.success('Transaction successful!');
    return signature;
  } catch (error) {
    console.error('Error sending transaction:', error);
    toast.error('Transaction failed. Please try again.');
    throw error;
  }
}

/**
 * Builds and sends a transaction to the Solana network
 * @param instructions The instructions to include in the transaction
 * @param signers The signers of the transaction
 * @param feePayer The account that will pay for the transaction fees
 * @returns The transaction signature
 */
export async function buildAndSendTransaction(
  instructions: TransactionInstruction[],
  signers: Signer[],
  feePayer: PublicKey
): Promise<string> {
  try {
    // Get the latest blockhash
    const { blockhash } = await connection.getLatestBlockhash('confirmed');

    // Create a new transaction and add the instructions
    const transaction = new Transaction().add(...instructions);

    // Set the fee payer and recent blockhash
    transaction.feePayer = feePayer;
    transaction.recentBlockhash = blockhash;

    // Send the transaction
    const signature = await sendTransactionToSolana(transaction, signers);
    return signature;
  } catch (error) {
    console.error('Error building and sending transaction:', error);
    toast.error('Failed to process transaction. Please try again.');
    throw error;
  }
}

/**
 * Checks if a transaction was successful
 * @param signature The transaction signature to check
 * @returns A boolean indicating if the transaction was successful
 */
export async function isTransactionSuccessful(signature: string): Promise<boolean> {
  try {
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');
    return confirmation.value.err === null;
  } catch (error) {
    console.error('Error checking transaction status:', error);
    return false;
  }
}


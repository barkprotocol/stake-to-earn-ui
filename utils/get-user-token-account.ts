import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { SOLANA_RPC_URL, BARK_TOKEN_MINT_ADDRESS } from '@/config/constants';

export async function getUserTokenAccount(userPublicKey: PublicKey): Promise<PublicKey> {
  try {
    const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
    const mintPublicKey = new PublicKey(BARK_TOKEN_MINT_ADDRESS);

    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintPublicKey,
      userPublicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    // Check if the associated token account exists
    const accountInfo = await connection.getAccountInfo(associatedTokenAddress);
    
    if (accountInfo === null) {
      throw new Error('Associated token account does not exist');
    }

    return associatedTokenAddress;
  } catch (error) {
    console.error('Error getting user token account:', error);
    throw new Error('Failed to get user token account');
  }
}


# BARK | Stake to Earn WebUI/UX

**Project Repository**: [BARK Airdrop Launchpad](https://github.com/barkprotocol/airdrop-launchpad)

## Overview

Stake your BARK tokens and earn BARK Protocol tokens through our intuitive platform. The easy-to-use interface helps you securely stake your tokens and start earning rewards today!

### Tech Stack

- **Frontend**: 
  - **Next.js**: For server-side rendering and static site generation, enabling fast and optimized delivery of content.
  - **React**: A component-based library for building dynamic user interfaces.
  - **Shadcn/UI**: A set of reusable UI components to speed up development and improve UX consistency.
  - **Tailwind CSS**: A utility-first CSS framework for rapid and customizable UI design.
  - **Solana Wallet Adapter**: Supports integration with popular Solana wallets like Phantom, Backpack, and Solflare.

- **Backend**:
  - **Admin Dashboard**: A powerful dashboard for managing staking operations, users, and rewards.
  - **Solana Blockchain**: The backbone of the application, ensuring decentralized and secure transactions for token staking and rewards.
  - **Prisma ORM**: An advanced database tool for seamless data management and interactions with the backend.
  - **Helius API**: A reliable API for blockchain interaction, fetching transaction data, and processing eligibility checks.

- **Deployment**:
  - **Vercel**: Platform for deploying the dApp with automatic CI/CD workflows for efficient updates and scalability.

## Features

- **Wallet Connection**: Securely connects with popular Solana wallets such as Phantom, Backpack, and Solflare.
- **Staking & Rewards**: Users can stake their BARK tokens and earn rewards in the form of BARK Protocol tokens.
- **Multiple Transfers**: Transactions are split into the main claim, operational fees, and community fees for transparency and efficiency.
- **Responsive Design**: Optimized for both mobile and desktop devices, ensuring a seamless experience for all users.
- **Blockchain Integration**: Direct interaction with the Solana blockchain ensures transparent and secure operations.
- **Shadcn/UI**: A set of prebuilt UI components that improve development speed while enhancing the user experience.
- **Secure Transactions**: Implements strong security protocols for all sensitive operations.
- **Prisma Integration**: Simplifies database management and ensures efficient handling of data.
- **Comprehensive API**: Well-documented API endpoints for developers to integrate and interact with the platform.
- **Documentation**: In-depth technical documentation available for better understanding and integration.

## How it Works

The BARK Stake to Earn dApp allows users to stake BARK tokens and earn BARK Protocol tokens as rewards. The process involves:

1. **Wallet Connection**: Users connect their Solana wallets (Phantom, Backpack, Solflare) to the dApp.
2. **Staking**: After connecting their wallet, users can stake their BARK tokens directly through the UI.
3. **Rewards**: Upon successful staking, users will start earning BARK Protocol tokens as rewards based on their stake and the current reward rate.
4. **Fee Breakdown**: The claim process includes separate transfers for the main claim, operational fees, and community fees, ensuring transparency and efficiency.

## Prerequisites

Before setting up the project, ensure you have the following requirements:

- **Node.js**: Version 20.0.0 or later.
- **pnpm**: Version 9.15.0 or later.
- **Solana.web3.js**: For blockchain interactions with the Solana network.
- **Prisma ORM**: Configured for efficient database management.
- **Solana Wallet**: A supported wallet (e.g., Phantom, Backpack, Solflare).
- **Shadcn/UI**: A UI component framework for building reusable and consistent components.

### Installing Dependencies

To set up the required packages and libraries:

```bash
pnpm add crypto-browserify stream-browserify url browserify-zlib stream-http https-browserify assert os-browserify path-browserify
```

## Installation

To install and run the BARK Stake to Earn dApp, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/bark-protocol/stake-to-earn-web-ui.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd stake-to-earn-web-ui
   ```

3. **Install dependencies**:

   ```bash
   pnpm install
   ```

4. **Set up environment variables**:

   Create a `.env.local` file in the root directory and populate it with the required and optional environment variables. Example:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
   SECRET_KEY=your-secret-key-here
   JWT_SECRET=your-jwt-secret-key-here
   NODE_ENV=development
   ```

5. **Run the development server**:

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to view the dApp.

## Deployment

The Stake to Earn dApp is optimized for deployment on Vercel. To deploy:

1. Link your GitHub repository to your Vercel account.
2. Add the required environment variables in the Vercel project settings.
3. Deploy your application with a single click.

## API

The application provides several API endpoints for interacting with the backend:

- **`/api/stake`**: Endpoint for staking tokens.
- **`/api/unstake`**: Endpoint for unstaking tokens.
- **`/api/status`**: Endpoint for checking the staking status.
  
For full API documentation and usage, refer to the `/docs` route of the application or [API Docs](/document).

## Future Enhancements

- **Gamification**: Introducing a rewards system with badges and achievements for staking milestones.
- **Advanced Analytics**: Incorporating real-time analytics for users to track their staking progress and rewards.
- **Mobile App**: Creating a dedicated mobile app for more accessible staking and reward tracking.
- **Community Engagement**: Adding more features to enhance community involvement, such as governance or voting on future changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

We welcome contributions! Please fork the repository, make your changes, and submit a pull request with your improvements. All contributions are reviewed before merging.
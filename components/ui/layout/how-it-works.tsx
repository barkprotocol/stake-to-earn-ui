import React from 'react';
import { Wallet, Layers, Calendar, Coins } from 'lucide-react';

interface HowItWorksProps {
  backgroundImage?: string;
  backgroundColor?: string;
}

const steps = [
  {
    icon: <Wallet className="w-6 h-6" />,
    title: "Get Started",
    description: "Connect your wallet to access BARK Protocol's secure staking platform and start earning rewards.",
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Determine Your Stake",
    description: "Decide how much BARK tokens or eligible NFTs you want to stake. Stake a portion or go all in!",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Choose a Plan",
    description: "Select a staking duration. Longer commitments unlock greater rewards for tokens and NFTs alike.",
  },
  {
    icon: <Coins className="w-6 h-6" />,
    title: "Earn & Claim Rewards",
    description: "Sit back and watch your rewards grow. Re-stake for compounding benefits or claim them anytime.",
  },
];

export function HowItWorks({
  backgroundImage,
  backgroundColor = 'black',
}: HowItWorksProps) {
  const backgroundStyle = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: 'rotate(2deg)',
        transformOrigin: 'center',
      }
    : { backgroundColor };

  return (
    <div
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ position: 'relative' }}
    >
      {/* Background Layer */}
      <div
        className="absolute inset-0"
        style={{
          ...backgroundStyle,
          zIndex: -1,
          filter: 'brightness(0.5) contrast(1.2)',
        }}
      ></div>
      <div className="relative max-w-7xl mx-auto">
        {/* Title and Description */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-white mb-4">How It Works</h2>
          <p className="text-xl text-[#D0C8B9]">
            Stake your BARK tokens or NFTs effortlessly and maximize your rewards.
          </p>
        </div>
        {/* Steps Grid */}
        <div className="grid gap-8 md:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm rounded-xl p-8 border border-[#D0C8B9] border-opacity-20 transition-transform duration-300 ease-in-out transform hover:scale-105"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#D0C8B9] text-black mb-6 mx-auto">
                {step.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white text-center">
                {step.title}
              </h3>
              <p className="text-[#D0C8B9] text-center">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


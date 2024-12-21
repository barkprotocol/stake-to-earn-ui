import React from 'react';
import { Shield, Zap, Users, Gift, Coins, BarChartIcon as ChartBar } from 'lucide-react';

interface FeatureCardsProps {
  backgroundImage?: string;
  backgroundColor?: string;
}

const features = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Enhanced Security",
    description: "Leverage Solana's secure blockchain infrastructure for all your transactions."
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Unmatched Speed",
    description: "Enjoy near-instant transaction processing with Solana's ultra-fast network."
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Empowered Community",
    description: "Join a protocol driven by its community, with fair rewards and shared governance."
  }
];

const benefits = [
  {
    icon: <Gift className="w-8 h-8" />,
    title: "Exclusive Airdrops",
    description: "Receive unique rewards and early access to BARK Protocol initiatives."
  },
  {
    icon: <Coins className="w-8 h-8" />,
    title: "Earn While Staking",
    description: "Maximize your gains by staking BARK tokens for additional incentives."
  },
  {
    icon: <ChartBar className="w-8 h-8" />,
    title: "Shape the Future",
    description: "Use your governance power to vote on proposals and drive the protocol forward."
  }
];

export function FeatureCards({ backgroundImage, backgroundColor = 'black' }: FeatureCardsProps) {
  const backgroundStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor };

  return (
    <div className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden" style={backgroundStyle}>
      <div className="absolute inset-0 bg-black bg-opacity-80"></div>
      <div className="relative max-w-7xl mx-auto">
        {/* Features Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Why Check Eligibility?
          </h2>
          <p className="text-xl text-[#D0C8B9]">
            Discover the key advantages of being part of the BARK Protocol
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3 mb-24">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm rounded-xl p-8 border border-[#D0C8B9] border-opacity-20 transition-transform duration-300 ease-in-out transform hover:scale-105"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#D0C8B9] text-black mb-6 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white text-center">{feature.title}</h3>
              <p className="text-[#D0C8B9] text-center">{feature.description}</p>
            </div>
          ))}
        </div>
        {/* Benefits Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Benefits of Joining BARK
          </h2>
          <p className="text-xl text-[#D0C8B9]">
            Unlock exclusive perks and opportunities with BARK Protocol
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm rounded-xl p-8 border border-[#D0C8B9] border-opacity-20 transition-transform duration-300 ease-in-out transform hover:scale-105"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#D0C8B9] text-black mb-6 mx-auto">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white text-center">{benefit.title}</h3>
              <p className="text-[#D0C8B9] text-center">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


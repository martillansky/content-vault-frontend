"use client";

import { WalletIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React from "react";
import dragonflyVault from "../../public/images/dragonfly-vault.png";
interface LandingPageProps {
  onConnectWallet: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onConnectWallet }) => {
  const features = [
    {
      title: "Token-Gated Access",
      description:
        "Control content access through ERC-1155 tokens and custom access logic",
      icon: "🔐",
    },
    {
      title: "Cross-Chain Compatibility",
      description:
        "Seamlessly operate across multiple blockchains with unified permissions",
      icon: "⛓️",
    },
    {
      title: "DAO Integration",
      description:
        "Native support for Snapshot voting and DAO treasury management",
      icon: "🏛️",
    },
    {
      title: "IPFS Storage",
      description:
        "Decentralized content storage with versioning and encryption",
      icon: "📦",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div role="presentation" className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[url('/images/bg-pattern.png')] opacity-60 bg-cover bg-center bg-fixed" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-transparent" />
      </div>
      <div className="w-full">
        <div className="relative z-10 w-full px-4 py-12 flex flex-col items-center justify-center min-h-screen">
          <div className="relative w-[250px] h-[250px] mx-auto mb-6 group inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Image
              src={dragonflyVault}
              alt="Libélula Space Dragonfly Logo - Representing secure content vaults"
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 40vw, 33vw"
              className="object-contain transition-transform duration-700 group-hover:scale-105"
              priority
              loading="eager"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
            Libélula Space
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Welcome to your decentralized content management solution
          </p>

          {/* Features grid */}
          <div className="w-full max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group relative bg-gradient-to-br from-purple-900/20 via-indigo-900/10 to-blue-900/20 p-6 rounded-2xl border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex flex-col">
                    <div className="flex flex-col items-center text-center mb-4">
                      <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-base text-gray-400 group-hover:text-gray-300 transition-colors duration-300 text-center">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onConnectWallet}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 mx-auto text-lg font-medium shadow-lg hover:shadow-xl"
          >
            <WalletIcon className="h-6 w-6" />
            <span>Connect Wallet</span>
          </button>

          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            By connecting your wallet, you agree to our Terms of Service and
            Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

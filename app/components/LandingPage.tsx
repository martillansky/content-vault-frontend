"use client";

import {
  ArrowRightIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
//import { useRouter } from "next/navigation";
import React from "react";

interface LandingPageProps {
  onConnectWallet: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onConnectWallet }) => {
  //const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <ShieldCheckIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Libélula Space
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Your decentralized content management solution
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg inline-block mb-4">
              <LockClosedIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Secure Storage
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your content is encrypted and stored securely on the blockchain
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg inline-block mb-4">
              <WalletIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Wallet Access
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Connect your wallet to access your personal content vaults
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg inline-block mb-4">
              <ArrowRightIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Easy Sharing
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Share your content with others while maintaining control
            </p>
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
  );
};

export default LandingPage;

import {
  ArrowUpIcon,
  ShieldCheckIcon,
  UserMinusIcon,
} from "@heroicons/react/24/outline";
//import { useState } from "react";

interface WalletAccess {
  address: string;
  role: "owner" | "contributor" | "viewer";
  grantedAt: string;
}

interface WalletAccessTableProps {
  walletAccess: WalletAccess[];
  currentOwner: string;
  isOwner: boolean;
  onUpgradeAccess: (walletAddress: string) => void;
  onRevokeAccess: (walletAddress: string) => void;
  onTransferOwnership: (walletAddress: string) => void;
}

export default function WalletAccessTable({
  walletAccess,
  //currentOwner,
  isOwner,
  onUpgradeAccess,
  onRevokeAccess,
  onTransferOwnership,
}: WalletAccessTableProps) {
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-gray-700 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
            >
              Wallet Address
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
            >
              Role
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
            >
              Granted At
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
          {walletAccess.map((wallet) => (
            <tr key={wallet.address}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6 break-all">
                {wallet.address}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    wallet.role === "owner"
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                      : wallet.role === "contributor"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  {wallet.role.charAt(0).toUpperCase() + wallet.role.slice(1)}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                {new Date(wallet.grantedAt).toLocaleDateString()}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                {isOwner && (
                  <div className="flex justify-end space-x-2">
                    {wallet.role === "owner" ? (
                      <button
                        onClick={() => onTransferOwnership(wallet.address)}
                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        title="Transfer Ownership"
                      >
                        <ShieldCheckIcon className="h-4 w-4 mr-1" />
                        <span>Transfer</span>
                      </button>
                    ) : (
                      <>
                        {wallet.role === "viewer" && (
                          <button
                            onClick={() => onUpgradeAccess(wallet.address)}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            title="Upgrade to Contributor"
                          >
                            <ArrowUpIcon className="h-4 w-4 mr-1" />
                            <span>Upgrade</span>
                          </button>
                        )}
                        <button
                          onClick={() => onRevokeAccess(wallet.address)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          title="Revoke Access"
                        >
                          <UserMinusIcon className="h-4 w-4 mr-1" />
                          <span>Revoke</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import BaseForm from "./BaseForm";

interface TransferOwnershipFormProps {
  existingWallets: string[];
  onCancel: () => void;
  onTransferOwnership: (
    newOwner: string,
    requireSignature: boolean
  ) => Promise<void>;
}

export default function TransferOwnershipForm({
  existingWallets,
  onCancel,
  onTransferOwnership,
}: TransferOwnershipFormProps) {
  const [newOwner, setNewOwner] = useState("");
  const [requireSignature, setRequireSignature] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("TransferOwnershipForm handleSubmit called");

    // Validate that newOwner is not empty
    if (!newOwner.trim()) {
      setError("New owner address is required");
      return;
    }

    // Validate that the address is not already in the existing wallets list
    if (existingWallets.includes(newOwner.trim())) {
      setError("This wallet already has access to the vault");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      console.log(
        "Calling onTransferOwnership with:",
        newOwner,
        requireSignature
      );
      await onTransferOwnership(newOwner, requireSignature);
      console.log("onTransferOwnership completed successfully");
    } catch (err) {
      console.error("Error in onTransferOwnership:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseForm
      title="Transfer Ownership"
      icon={<ShieldCheckIcon className="h-6 w-6" />}
      onClose={onCancel}
      onSubmit={handleSubmit}
      submitButtonText="Transfer Ownership"
      maxWidth="md"
      isLoading={isLoading}
      loadingText="Transferring ownership..."
      error={error || undefined}
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="newOwner"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            New Owner Address
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="newOwner"
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              placeholder="0x..."
              required
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Enter the wallet address of the new owner
          </p>
        </div>

        <div className="flex items-center">
          <input
            id="requireSignature"
            name="requireSignature"
            type="checkbox"
            checked={requireSignature}
            onChange={(e) => setRequireSignature(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="requireSignature"
            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
          >
            Require signature from new owner
          </label>
        </div>

        <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/30 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400 dark:text-yellow-300"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                Important
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-200">
                <p>
                  Transferring ownership is a critical operation. The new owner
                  will have full control over this vault, including the ability
                  to revoke your access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseForm>
  );
}

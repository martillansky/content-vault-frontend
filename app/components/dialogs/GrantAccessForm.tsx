import { UserPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import BaseForm from "./BaseForm";

interface GrantAccessFormProps {
  onCancel: () => void;
  onGrantAccess: (
    wallets: Array<{ address: string; role: "contributor" | "viewer" }>,
    requireSignature: boolean
  ) => void;
  existingWallets: string[];
}

export default function GrantAccessForm({
  onCancel,
  onGrantAccess,
  existingWallets,
}: GrantAccessFormProps) {
  const [batchWallets, setBatchWallets] = useState<
    Array<{ address: string; role: "contributor" | "viewer" }>
  >([{ address: "", role: "viewer" }]);
  const [requireSignature, setRequireSignature] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateWalletAddress = (address: string) => {
    // Basic Ethereum address validation
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleAddBatchWallet = () => {
    setBatchWallets([...batchWallets, { address: "", role: "viewer" }]);
  };

  const handleRemoveBatchWallet = (index: number) => {
    setBatchWallets(batchWallets.filter((_, i) => i !== index));
  };

  const handleBatchWalletChange = (
    index: number,
    field: "address" | "role",
    value: string
  ) => {
    const updatedWallets = [...batchWallets];
    updatedWallets[index] = {
      ...updatedWallets[index],
      [field]: value,
    };
    setBatchWallets(updatedWallets);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Validate all wallet addresses
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    batchWallets.forEach((wallet, index) => {
      if (!wallet.address.trim()) {
        newErrors[`wallet${index}`] = "Wallet address is required";
        hasErrors = true;
      } else if (!validateWalletAddress(wallet.address)) {
        newErrors[`wallet${index}`] = "Invalid wallet address format";
        hasErrors = true;
      } else if (
        existingWallets.some(
          (w) => w.toLowerCase() === wallet.address.toLowerCase()
        )
      ) {
        newErrors[`wallet${index}`] = "This wallet already has access";
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      onGrantAccess(batchWallets, requireSignature);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseForm
      title="Grant Access"
      icon={<UserPlusIcon className="h-6 w-6" />}
      onClose={onCancel}
      onSubmit={handleSubmit}
      submitButtonText="Grant Access"
      maxWidth="md"
      isLoading={isLoading}
      loadingText="Granting access..."
      error={error || undefined}
    >
      <div className="space-y-4">
        {batchWallets.map((wallet, index) => (
          <div key={index} className="flex space-x-2 items-start">
            <div className="flex-grow">
              {index === 0 && (
                <label
                  htmlFor={`wallet${index}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Wallet Address
                </label>
              )}
              <input
                type="text"
                id={`wallet${index}`}
                value={wallet.address}
                onChange={(e) =>
                  handleBatchWalletChange(index, "address", e.target.value)
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors[`wallet${index}`]
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                placeholder="0x..."
              />
              {errors[`wallet${index}`] && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors[`wallet${index}`]}
                </p>
              )}
            </div>
            <div className="w-40">
              {index === 0 && (
                <label
                  htmlFor={`role${index}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Role
                </label>
              )}
              <select
                id={`role${index}`}
                value={wallet.role}
                onChange={(e) =>
                  handleBatchWalletChange(
                    index,
                    "role",
                    e.target.value as "contributor" | "viewer"
                  )
                }
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="contributor">Contributor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            {batchWallets.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveBatchWallet(index)}
                className={`${
                  index === 0 ? "mt-9" : "mt-2.5"
                } text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300`}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        ))}

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={handleAddBatchWallet}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-900/50 dark:hover:bg-blue-900/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <UserPlusIcon className="h-4 w-4 mr-1" />
            Add Another Wallet
          </button>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="requireSignature"
              checked={requireSignature}
              onChange={(e) => setRequireSignature(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="requireSignature"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              Require signature
            </label>
          </div>
        </div>
      </div>
    </BaseForm>
  );
}

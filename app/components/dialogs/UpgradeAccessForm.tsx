import {
  ArrowUpIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import BaseForm from "./BaseForm";

interface UpgradeAccessDialogProps {
  walletAddress: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function UpgradeAccessForm({
  walletAddress,
  onClose,
  onConfirm,
}: UpgradeAccessDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);
    setError(null);

    try {
      await onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseForm
      title="Upgrade Access"
      icon={<ArrowUpIcon className="h-6 w-6" />}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitButtonText="Confirm Upgrade"
      maxWidth="md"
      isLoading={isLoading}
      loadingText="Upgrading access..."
      error={error || undefined}
    >
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to upgrade the access level for wallet:
          </p>
          <p className="mt-1 font-mono text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded">
            {walletAddress}
          </p>
        </div>

        <div className="flex items-center p-4 text-yellow-800 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-lg">
          <ExclamationTriangleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">
            This action will grant the wallet additional permissions. Make sure
            this is what you intend to do.
          </p>
        </div>
      </div>
    </BaseForm>
  );
}

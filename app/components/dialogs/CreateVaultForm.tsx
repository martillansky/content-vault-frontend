"use client";

import { FolderPlusIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { useAppKitAccount } from "@reown/appkit/react";
import { useState } from "react";
import LoadingComponent from "../LoadingComponent";
import BaseForm from "./BaseForm";

interface FormProps {
  onClose?: () => void;
  onSuccess?: (vaultId: string) => void;
}

export default function CreateVaultForm({ onClose, onSuccess }: FormProps) {
  const { isConnected } = useAppKitAccount();
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPrivate: false,
    allowContributions: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vault name is required";
    }

    if (formData.name.length > 50) {
      newErrors.name = "Vault name must be less than 50 characters";
    }

    if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement the actual vault creation logic
      // This would include:
      // 1. Preparing the vault data
      // 2. Creating the vault on the blockchain
      // 3. Handling the response

      // Simulate a delay for demonstration
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate a mock vault ID for demonstration
      const mockVaultId = `vault-${Date.now()}`;

      // Close the dialog after successful creation
      setIsOpen(false);
      if (onSuccess) {
        onSuccess(mockVaultId);
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Vault creation failed:", error);
      setErrors({ submit: "Failed to create vault. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-300">
          Please connect your wallet to create a vault
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingComponent text="Creating your vault..." />;
  }

  if (!isOpen) {
    return null;
  }

  const icon = <FolderPlusIcon className="h-6 w-6 text-blue-500 mr-2" />;
  const submitButtonIcon = <ShieldCheckIcon className="h-5 w-5" />;

  return (
    <BaseForm
      title="Create New Vault"
      icon={icon}
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitButtonText="Create Vault"
      submitButtonIcon={submitButtonIcon}
      maxWidth="md"
      isLoading={isLoading}
      loadingText="Creating your vault..."
      error={errors.submit}
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Vault Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.name
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            placeholder="Enter vault name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            placeholder="Describe the purpose of this vault"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.description}
            </p>
          )}
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <input
              id="isPrivate"
              name="isPrivate"
              type="checkbox"
              checked={formData.isPrivate}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label
              htmlFor="isPrivate"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              Private Vault
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="allowContributions"
              name="allowContributions"
              type="checkbox"
              checked={formData.allowContributions}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label
              htmlFor="allowContributions"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              Allow Contributions
            </label>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
            Vault Settings
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <li>• Private vaults are only visible to you</li>
            <li>• Public vaults can be discovered by others</li>
            <li>
              • Allowing contributions lets others add content to your vault
            </li>
            <li>• You can change these settings later</li>
          </ul>
        </div>
      </div>
    </BaseForm>
  );
}

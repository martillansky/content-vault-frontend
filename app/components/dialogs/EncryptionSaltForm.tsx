"use client";

import { ArrowPathIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useAppKitAccount } from "@reown/appkit/react";
import { useState } from "react";
import LoadingComponent from "../LoadingComponent";
import BaseForm from "./BaseForm";

interface EncryptionSaltFormProps {
  onSubmit: (salt: string) => void;
  onCancel: () => void;
}

export default function EncryptionSaltForm({
  onSubmit,
  onCancel,
}: EncryptionSaltFormProps) {
  const { isConnected } = useAppKitAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [salt, setSalt] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSalt(value);

    // Clear error when user types
    if (errors.salt) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.salt;
        return newErrors;
      });
    }
  };

  const generateRandomSalt = () => {
    // Generate a random 16-character string
    const randomSalt = Math.random().toString(36).substring(2, 18);
    setSalt(randomSalt);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!salt.trim()) {
      newErrors.salt = "Encryption salt is required";
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
      // TODO: Implement the logic to save the salt
      // This could be storing it in localStorage, a database, or the blockchain

      // Simulate a delay for demonstration
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call the onSubmit callback with the salt
      onSubmit(salt);
    } catch (error) {
      console.error("Failed to save salt:", error);
      setErrors({
        submit: "Failed to save encryption salt. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-300">
          Please connect your wallet to set encryption salt
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingComponent text="Saving your encryption salt..." />;
  }

  const icon = <LockClosedIcon className="h-6 w-6 text-blue-500 mr-2" />;
  const submitButtonIcon = <LockClosedIcon className="h-5 w-5" />;

  return (
    <BaseForm
      title="Encryption Salt"
      icon={icon}
      onClose={onCancel}
      onSubmit={handleSubmit}
      submitButtonText="Save Salt"
      submitButtonIcon={submitButtonIcon}
      onCancel={onCancel}
      maxWidth="md"
      isLoading={isLoading}
      loadingText="Saving your encryption salt..."
      error={errors.submit}
      info="Your encryption salt is used to secure your files. Once set, it will be used for all future uploads."
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="salt"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Encryption Salt
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="salt"
              name="salt"
              value={salt}
              onChange={handleInputChange}
              className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.salt
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
              placeholder="Enter your encryption salt"
            />
            <button
              type="button"
              onClick={generateRandomSalt}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
              title="Generate random salt"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          </div>
          {errors.salt && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.salt}
            </p>
          )}
        </div>

        <div className="pt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Keep this salt secure. You will need it to decrypt your files later.
          </p>
        </div>
      </div>
    </BaseForm>
  );
}

"use client";

import { useVaultTx } from "@/app/contracts/hooks/useVaultTx";
import { getMockedContent } from "@/app/mockData/private/mockContent";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  DocumentCheckIcon,
  DocumentIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useAppKitAccount } from "@reown/appkit/react";
import { useState } from "react";
import LoadingComponent from "../LoadingComponent";
import BaseForm from "./BaseForm";
import EncryptionSaltForm from "./EncryptionSaltForm";
interface FileItem {
  id: string;
  name: string;
  file: File | null;
  description: string;
}

interface FormProps {
  vaultId: string;
  onClose?: () => void;
  currentFolder?: string;
}

export default function ContentUploadForm({
  vaultId,
  onClose,
  currentFolder = "root",
}: FormProps) {
  const { submitContent } = useVaultTx();
  const { isConnected } = useAppKitAccount();
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "", file: null, description: "" },
  ]);
  const [formData, setFormData] = useState({
    signMetadata: true,
    useEncryption: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSaltForm, setShowSaltForm] = useState(false);
  const [encryptionSalt, setEncryptionSalt] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "name" || name === "description") {
      // Update the current file's name or description
      setFiles((prev) => {
        const updated = [...prev];
        updated[currentFileIndex] = {
          ...updated[currentFileIndex],
          [name]: value,
        };
        return updated;
      });
    } else {
      // Update the general form data
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles((prev) => {
        const updated = [...prev];
        updated[currentFileIndex] = {
          ...updated[currentFileIndex],
          file: file,
          name: file.name, // Auto-fill name with file name
        };
        return updated;
      });

      // Clear error when user selects a file
      if (errors.file) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.file;
          return newErrors;
        });
      }
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const addNewFile = () => {
    setFiles((prev) => [
      ...prev,
      {
        id: (prev.length + 1).toString(),
        name: "",
        file: null,
        description: "",
      },
    ]);
    setCurrentFileIndex(files.length);
  };

  const removeCurrentFile = () => {
    if (files.length > 1) {
      setFiles((prev) => prev.filter((_, index) => index !== currentFileIndex));
      setCurrentFileIndex(Math.max(0, currentFileIndex - 1));
    }
  };

  const goToPreviousFile = () => {
    if (currentFileIndex > 0) {
      setCurrentFileIndex((prev) => prev - 1);
    }
  };

  const goToNextFile = () => {
    if (currentFileIndex < files.length - 1) {
      setCurrentFileIndex((prev) => prev + 1);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Check if at least one file has a name and file selected
    const hasValidFile = files.some((file) => file.name.trim() && file.file);
    if (!hasValidFile) {
      newErrors.file = "At least one file is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // If encryption is enabled and we don't have a salt, show the salt form
    if (formData.useEncryption && !encryptionSalt) {
      setShowSaltForm(true);
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Remove this mocked content
      // Mocked content for demonstration
      const mockedContent = await getMockedContent();

      await submitContent(
        mockedContent.tokenId,
        mockedContent.encryptedCID,
        mockedContent.isCIDEncrypted,
        mockedContent.metadata
      );

      // Simulate a delay for demonstration
      //await new Promise((resolve) => setTimeout(resolve, 2000));

      // Close the dialog after successful upload
      setIsOpen(false);
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setErrors({ submit: "Failed to upload content. Please try again." });
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

  const handleSaltSubmit = (salt: string) => {
    setEncryptionSalt(salt);
    setShowSaltForm(false);
    // Continue with the upload process
    handleSubmit(new Event("submit") as any);
  };

  const handleSaltCancel = () => {
    setShowSaltForm(false);
  };

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-300">
          Please connect your wallet to upload content
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingComponent text="Processing your upload..." />;
  }

  if (!isOpen) {
    return null;
  }

  if (showSaltForm) {
    return (
      <EncryptionSaltForm
        onSubmit={handleSaltSubmit}
        onCancel={handleSaltCancel}
      />
    );
  }

  const currentFile = files[currentFileIndex];
  const icon = <DocumentIcon className="h-6 w-6 text-blue-500 mr-2" />;
  const submitButtonIcon = <DocumentCheckIcon className="h-5 w-5" />;

  return (
    <BaseForm
      title={`Upload Files to ${currentFolder}`}
      icon={icon}
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitButtonText={`Upload ${
        files.length > 1 ? `${files.length} Files` : "File"
      }`}
      submitButtonIcon={submitButtonIcon}
      maxWidth="2xl"
      isLoading={isLoading}
      loadingText="Processing your upload..."
      error={errors.submit}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            File {currentFileIndex + 1} of {files.length}
          </h3>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={goToPreviousFile}
              disabled={currentFileIndex === 0}
              className={`p-2 rounded-full ${
                currentFileIndex === 0
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              } transition-colors`}
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goToNextFile}
              disabled={currentFileIndex === files.length - 1}
              className={`p-2 rounded-full ${
                currentFileIndex === files.length - 1
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              } transition-colors`}
            >
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            File Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={currentFile.name}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.name
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            placeholder="Enter file name"
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
            value={currentFile.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Brief description of your file"
          />
        </div>

        <div>
          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            File
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
            <div className="space-y-1 text-center">
              <DocumentIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Any file type up to 10MB
              </p>
              {currentFile.file && (
                <p className="text-sm text-gray-900 dark:text-white mt-2">
                  Selected: {currentFile.file.name}
                </p>
              )}
            </div>
          </div>
          {errors.file && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.file}
            </p>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={removeCurrentFile}
            disabled={files.length === 1}
            className={`px-3 py-2 rounded-lg flex items-center space-x-2 ${
              files.length === 1
                ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            } transition-colors`}
          >
            <TrashIcon className="h-5 w-5" />
            <span>Remove File</span>
          </button>

          <button
            type="button"
            onClick={addNewFile}
            className="px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Another File</span>
          </button>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <input
              id="signMetadata"
              name="signMetadata"
              type="checkbox"
              checked={formData.signMetadata}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label
              htmlFor="signMetadata"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              Sign metadata with your wallet
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="useEncryption"
              name="useEncryption"
              type="checkbox"
              checked={formData.useEncryption}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label
              htmlFor="useEncryption"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              Encrypt file content
            </label>
          </div>
        </div>
      </div>
    </BaseForm>
  );
}

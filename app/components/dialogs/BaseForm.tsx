"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";

interface BaseFormProps {
  title: string;
  icon: ReactNode;
  onClose: () => void;
  children: ReactNode;
  submitButtonText: string;
  submitButtonIcon?: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  cancelButtonText?: string;
  onCancel?: () => void;
  noCancelButton?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  isLoading?: boolean;
  loadingText?: string;
  error?: string;
  info?: string;
}

export default function BaseForm({
  title,
  icon,
  onClose,
  children,
  submitButtonText,
  submitButtonIcon,
  onSubmit,
  cancelButtonText = "Cancel",
  onCancel,
  noCancelButton = false,
  maxWidth = "2xl",
  isLoading = false,
  loadingText = "Processing...",
  error,
  info,
}: BaseFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    console.log("BaseForm: handleSubmit called");
    e.preventDefault();
    e.stopPropagation();
    onSubmit(e);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  const formContent = (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full ${maxWidthClasses[maxWidth]} max-h-[90vh] overflow-y-auto`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
            {error}
          </div>
        )}

        {info && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">{info}</p>
          </div>
        )}

        {children}

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          {!noCancelButton && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {cancelButtonText}
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitButtonIcon}
            <span>{isLoading ? loadingText : submitButtonText}</span>
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      {formContent}
    </div>
  );
}

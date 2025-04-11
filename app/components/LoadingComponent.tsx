interface LoadingComponentProps {
  text?: string;
}

export default function LoadingComponent({ text }: LoadingComponentProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        {text ?? <p className="text-gray-600 dark:text-gray-300">{text}</p>}
      </div>
    </div>
  );
}

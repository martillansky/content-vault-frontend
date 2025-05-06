interface TooltipComponentProps {
  children: React.ReactNode;
}

export default function TooltipComponent({ children }: TooltipComponentProps) {
  return (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
      {children}
    </div>
  );
}

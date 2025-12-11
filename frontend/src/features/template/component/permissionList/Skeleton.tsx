import React from "react";

export const Skeleton: React.FC<{ className?: string }> = ({
  className = "",
}) => <div className={`bg-gray-200 animate-pulse rounded ${className}`} />;

export const PermissionSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
        >
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-6 w-12" />
        </div>
      ))}
    </div>
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="border border-gray-200 rounded-lg overflow-hidden"
      >
        <div className="p-4 bg-gray-50">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="p-4 space-y-3">
          {[...Array(2)].map((_, j) => (
            <div key={j} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

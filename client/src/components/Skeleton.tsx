import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4' 
}) => {
  return (
    <div 
      className={`animate-pulse bg-gray-200 rounded ${width} ${height} ${className}`}
    />
  );
};

// Card skeleton for dashboard stats
export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Skeleton height="h-4" width="w-24" className="mb-2" />
          <Skeleton height="h-8" width="w-16" />
        </div>
        <Skeleton height="h-12" width="w-12" className="rounded-full" />
      </div>
    </div>
  );
};

// Table row skeleton
export const TableRowSkeleton: React.FC = () => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-3 sm:px-6 py-4">
        <div>
          <Skeleton height="h-5" width="w-32" className="mb-2" />
          <Skeleton height="h-4" width="w-48" />
          <div className="sm:hidden mt-1">
            <Skeleton height="h-3" width="w-24" />
          </div>
        </div>
      </td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
        <Skeleton height="h-6" width="w-16" className="rounded-full" />
      </td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
        <Skeleton height="h-5" width="w-8" />
      </td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
        <Skeleton height="h-5" width="w-8" />
      </td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center gap-2 justify-end">
          <Skeleton height="h-8" width="w-8" className="rounded" />
          <Skeleton height="h-8" width="w-8" className="rounded" />
          <Skeleton height="h-8" width="w-8" className="rounded" />
        </div>
      </td>
    </tr>
  );
};

// Campaign card skeleton for recent campaigns
export const CampaignCardSkeleton: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
      <div className="flex-1">
        <Skeleton height="h-5" width="w-32" className="mb-1" />
        <Skeleton height="h-4" width="w-20" />
      </div>
      <Skeleton height="h-6" width="w-16" className="rounded-full" />
    </div>
  );
};

// Form field skeleton
export const FormFieldSkeleton: React.FC = () => {
  return (
    <div className="space-y-2">
      <Skeleton height="h-4" width="w-24" />
      <Skeleton height="h-10" width="w-full" className="rounded-md" />
    </div>
  );
};

// Detail page skeleton
export const DetailPageSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1">
          <Skeleton height="h-8" width="w-48" className="mb-2" />
          <Skeleton height="h-5" width="w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton height="h-10" width="w-20" className="rounded-lg" />
          <Skeleton height="h-10" width="w-24" className="rounded-lg" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {[...Array(3)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Content sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <Skeleton height="h-6" width="w-32" />
          </div>
          <div className="p-4 sm:p-6 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Skeleton height="h-4" width="w-48" />
                <Skeleton height="h-4" width="w-4" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <Skeleton height="h-6" width="w-32" />
          </div>
          <div className="p-4 sm:p-6 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Skeleton height="h-4" width="w-32" />
                <Skeleton height="h-4" width="w-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Message generator skeleton
export const MessageGeneratorSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Skeleton height="h-8" width="w-64" className="mb-2" />
        <Skeleton height="h-5" width="w-96" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <Skeleton height="h-6" width="w-40" />
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <FormFieldSkeleton key={i} />
            ))}
            <Skeleton height="h-10" width="w-full" className="rounded-md" />
          </div>
        </div>

        {/* Result Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <Skeleton height="h-6" width="w-32" />
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-3">
              <Skeleton height="h-4" width="w-full" />
              <Skeleton height="h-4" width="w-full" />
              <Skeleton height="h-4" width="w-3/4" />
            </div>
            <div className="flex gap-2 mt-4">
              <Skeleton height="h-10" width="w-24" className="rounded-md" />
              <Skeleton height="h-10" width="w-20" className="rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Button loading skeleton
export const ButtonSkeleton: React.FC<{ width?: string }> = ({ width = 'w-24' }) => {
  return <Skeleton height="h-10" width={width} className="rounded-md" />;
};

// Text loading skeleton with shimmer effect
export const ShimmerSkeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4' 
}) => {
  return (
    <div 
      className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded ${width} ${height} ${className}`}
    />
  );
};

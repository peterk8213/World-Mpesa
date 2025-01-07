///loading page for  for /profile

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 flex flex-col items-center">
      {/* Profile Header Section */}
      <div className="w-full max-w-md space-y-8">
        {/* Profile Info */}
        <div className="mt-16 space-y-4 text-center">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 py-6 border-y border-border/20">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-2">
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="space-y-4 mt-8">
          <Skeleton className="h-6 w-32" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

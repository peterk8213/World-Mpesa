///loading page for  for /profile

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 flex flex-col items-center">
      {/* Recent Activity */}
      <div className="space-y-4 mt-8">
        <Skeleton className="h-6 w-32" />
        {[...Array(12)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 w-full">
            <Skeleton className="h-6 w-6 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

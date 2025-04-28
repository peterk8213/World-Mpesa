import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen p-2 lg:p-12 lg:mx-20">
      <main className="flex-1 flex flex-col px-4 py-6 space-y-6 gap-3">
        {/* Profile Card Skeleton */}
        <div className="space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Payment Methods Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* Notification Section Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>

        {/* AI Chatbot Component Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>

        {/* Useful Links Section Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-48" />
            ))}
          </div>
        </div>

        {/* Spacer to match full page height */}
        <div className="flex-1" />
      </main>
    </div>
  );
}

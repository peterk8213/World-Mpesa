import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col bg-white text-black overflow-auto lg:mx-20 gap-[3rem] pb-8">
      <div className="flex flex-col lg:flex-row lg:space-x-4 px-2 w-full">
        {/* Simulated UserHomePageCard Loading */}
        <div className="flex-1 space-y-6 mt-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>

      <div className="px-2">
        {/* Simulated AppServices Section Loading */}
        <div className="space-y-8">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="flex flex-col space-y-4">
              <Skeleton className="h-6 w-40" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// app/history/page.tsx
import { Suspense } from "react";
import { HistoryList } from "@/components/HistoryList";
import { HistoryHeader } from "@/components/HistoryHeader";

export default function HistoryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <HistoryHeader />
      <main className="flex-1 p-4">
        <Suspense
          fallback={
            <div className="text-black text-center mt-8">
              Loading transactions...
            </div>
          }
        >
          <HistoryList />
        </Suspense>
      </main>
    </div>
  );
}

import Container from "@/components/Container";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="bg-[#141414] grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Suspense fallback={
          <div className="w-full max-w-md animate-pulse">
            <div className="h-20 bg-gray-100 rounded-md mb-4" />
            <div className="h-[240px] bg-gray-100 rounded-md" />
          </div>
        }>
          <Container />
        </Suspense>
      </main>
    </div>
  );
}

"use client";
import dynamic from "next/dynamic";

// Dynamically import the client-only p5 component (no SSR)
const SniperDemo = dynamic(
  () => import("@/components/sniper-demo").then((m) => m.SniperDemo),
  { ssr: false, loading: () => <div className="text-neutral-400">Loading game…</div> }
);

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-[#0a0a0a] text-white">
     <SniperDemo />
    </main>
  );
}

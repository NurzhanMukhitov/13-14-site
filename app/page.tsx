"use client";

import dynamic from "next/dynamic";

// Динамический импорт R3F-варианта, чтобы не трогать SSR
const SphereCanvasR3F = dynamic(
  () => import("@/components/sphere-r3f").then((m) => m.SphereCanvasR3F),
  { ssr: false },
);

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero section */}
      <section className="flex min-h-screen items-center justify-center bg-[var(--hero-background)] text-[var(--hero-foreground)]">
        <h1 className="text-[clamp(4rem,20vw,12.5rem)] font-black leading-[0.9] tracking-[-0.03em] text-center">
          <span className="block">13 | 14</span>
        </h1>
      </section>

      {/* Visual section with interactive sphere */}
      <section className="flex min-h-screen items-center justify-center bg-[var(--visual-background)]">
        <div
          id="visual-sketch"
          className="flex w-full items-center justify-center px-6 py-10"
        >
          <SphereCanvasR3F />
        </div>
      </section>
    </main>
  );
}

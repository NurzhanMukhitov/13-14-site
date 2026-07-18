"use client";

import { useEffect, useRef, useState } from "react";
import { SphereCanvas } from "@/components/sphere-canvas";
import { Menu, X } from "lucide-react";

type ProjectScreen = {
  id: string;
  title: string;
  subtitle: string;
  theme: "light" | "dark";
  withHero?: boolean;
};

const projectScreens: ProjectScreen[] = [
  {
    id: "project-000",
    title: "PROJECT 000",
    subtitle: "",
    theme: "light",
    withHero: true,
  },
  {
    id: "project-001",
    title: "PROJECT 001",
    subtitle: "Generative Particle Surface",
    theme: "dark",
  },
  {
    id: "project-002",
    title: "PROJECT 002",
    subtitle: "Editorial Architecture Studies",
    theme: "light",
  },
  {
    id: "project-003",
    title: "PROJECT 003",
    subtitle: "Analog Structures Archive",
    theme: "dark",
  },
  {
    id: "project-004",
    title: "PROJECT 004",
    subtitle: "Material and Form Research",
    theme: "light",
  },
];

const projectNotes: Array<{ label: string; text: string }> = [
  {
    label: "PROJECT 001",
    text: "A generative particle surface explores tension between order and noise. The structure reacts to interaction and keeps a calm rhythm. This study frames the visual language of the whole series.",
  },
  {
    label: "PROJECT 002",
    text: "An editorial composition around industrial architecture and quiet geometry. Images are treated as documents but arranged like a visual essay. Contrast and spacing carry most of the narrative.",
  },
  {
    label: "PROJECT 003",
    text: "A darker chapter focused on material texture and structural repetition. The sequence moves from macro details to wide architectural cuts. The pacing is slow to emphasize form and weight.",
  },
  {
    label: "PROJECT 004",
    text: "A minimal archive of spaces where color appears only as a subtle signal. Frames are intentionally restrained and balanced by negative space. The result is precise, calm, and documentary in tone.",
  },
];

export default function Home() {
  const authorId = "author";
  const scrollerRef = useRef<HTMLElement | null>(null);
  const titrLeftRef = useRef<HTMLSpanElement | null>(null);
  const titrBarRef = useRef<HTMLSpanElement | null>(null);
  const titrRightRef = useRef<HTMLSpanElement | null>(null);
  const sandScaleRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const [activeScreenId, setActiveScreenId] = useState(projectScreens[0].id);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const navItems = [
    ...projectScreens.map((screen) => ({
      id: screen.id,
      label: screen.id === "project-000" ? "TITLE" : screen.title,
    })),
    { id: authorId, label: "PROFILE" },
  ];

  // Track active screen on scroll
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const updateActive = () => {
      const height = root.clientHeight || 1;
      const index = Math.round(root.scrollTop / height);
      const allIds = [...projectScreens.map((s) => s.id), authorId];
      const nextId = allIds[Math.max(0, Math.min(allIds.length - 1, index))];
      setActiveScreenId((prev) => (prev === nextId ? prev : nextId));
    };

    updateActive();
    root.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      root.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  // Titr: "13" уезжает вверх, "14" вниз, рассыпаясь в песок (SVG displacement)
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // SVG-фильтр дорог на GPU — песок только там, где есть настоящий указатель
    const sandEnabled = window.matchMedia("(pointer: fine)").matches;

    let raf = 0;
    const update = () => {
      raf = 0;
      const height = root.clientHeight || 1;
      const p = Math.min(Math.max(root.scrollTop / height, 0), 1);
      // Фильтр снимается в покое (p=0), иначе живой SVG-фильтр зря жрёт GPU
      const sandFilter = sandEnabled && p > 0 ? "url(#sand-titr)" : "none";
      const fade = `${1 - Math.min(p * 1.8, 1)}`;
      if (sandScaleRef.current) {
        sandScaleRef.current.setAttribute(
          "scale",
          String(Math.min(p * 3, 1) * 150),
        );
      }
      if (titrLeftRef.current) {
        titrLeftRef.current.style.transform = `translateY(${-p * 80}vh)`;
        titrLeftRef.current.style.filter = sandFilter;
        titrLeftRef.current.style.opacity = fade;
      }
      if (titrRightRef.current) {
        titrRightRef.current.style.transform = `translateY(${p * 180}vh)`;
        titrRightRef.current.style.filter = sandFilter;
        titrRightRef.current.style.opacity = fade;
      }
      if (titrBarRef.current) {
        titrBarRef.current.style.opacity = `${1 - Math.min(p * 2.5, 1)}`;
        titrBarRef.current.style.filter = sandFilter;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      root.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Reveal: тексты наводятся на резкость один раз при входе в кадр
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>(".reveal-blur");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        }
      },
      { root, threshold: 0.4 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Scroll hint: show after 2s, hide on first scroll
  useEffect(() => {
    const showTimer = setTimeout(() => setShowHint(true), 2000);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const hideHint = () => setShowHint(false);
    root.addEventListener("scroll", hideHint, { once: true, passive: true });
    return () => root.removeEventListener("scroll", hideHint);
  }, []);

  const scrollToScreen = (id: string) => {
    const root = scrollerRef.current;
    if (!root) return;
    const target = root.querySelector<HTMLElement>(`#${id}`);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Hint color based on current screen theme
  const activeScreen = projectScreens.find((s) => s.id === activeScreenId);
  const hintDark =
    activeScreen?.theme === "dark" || activeScreenId === authorId;

  return (
    <>
      {/* ── Desktop nav (md+) ── */}
      <nav className="fixed left-0 top-0 z-50 hidden w-full items-center gap-8 overflow-x-auto px-8 py-6 text-[11px] tracking-[0.14em] text-white mix-blend-difference md:flex">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`shrink-0 transition-opacity ${
              activeScreenId === item.id ? "opacity-100" : "opacity-70"
            }`}
            onClick={() => scrollToScreen(item.id)}
          >
            <span className="nav-roll">
              <span>{item.label}</span>
              <span aria-hidden="true">{item.label}</span>
            </span>
          </button>
        ))}
      </nav>

      {/* ── Mobile header (< md) ── */}
      <div className="fixed left-0 top-0 z-50 flex w-full items-center justify-between px-6 py-5 text-white mix-blend-difference md:hidden">
        <button
          type="button"
          aria-label="Go to title"
          className="text-[11px] tracking-[0.14em]"
          onClick={() => scrollToScreen("project-000")}
        >
          13 | 14
        </button>
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* ── Mobile overlay menu ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black px-8 py-5 text-white">
          <div className="flex justify-end">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
          <nav className="mt-14 flex flex-col gap-7">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`text-left text-[11px] tracking-[0.14em] transition-opacity hover:opacity-100 ${
                  activeScreenId === item.id ? "opacity-100" : "opacity-50"
                }`}
                onClick={() => {
                  scrollToScreen(item.id);
                  setMenuOpen(false);
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* ── Scroll hint ── */}
      <div
        className={`pointer-events-none fixed bottom-8 left-1/2 z-40 -translate-x-1/2 transition-opacity duration-700 ${
          showHint ? "opacity-100" : "opacity-0"
        } ${hintDark ? "text-white" : "text-black"}`}
      >
        <div className="animate-pulse">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 9L12 15L19 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* ── Main horizontal scroller ── */}
      <main
        ref={scrollerRef}
        className="h-[100dvh] snap-y snap-mandatory overflow-y-auto overflow-x-hidden scroll-smooth"
      >
        {projectScreens.map((screen) => {
          const dark = screen.theme === "dark";
          return (
            <section
              key={screen.id}
              id={screen.id}
              className={`relative h-[100dvh] w-full snap-start overflow-hidden pt-14 ${
                dark ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              <div className="flex h-full flex-col items-center justify-center gap-6 px-4 md:px-8">
                {screen.withHero ? (
                  <div className="flex flex-1 w-full items-center justify-center">
                    <svg
                      width="0"
                      height="0"
                      aria-hidden="true"
                      className="absolute"
                    >
                      <filter
                        id="sand-titr"
                        x="-30%"
                        y="-30%"
                        width="160%"
                        height="160%"
                      >
                        <feTurbulence
                          type="fractalNoise"
                          baseFrequency="1.4"
                          numOctaves="3"
                          result="noise"
                        />
                        <feDisplacementMap
                          ref={sandScaleRef}
                          in="SourceGraphic"
                          in2="noise"
                          scale="0"
                          xChannelSelector="R"
                          yChannelSelector="G"
                        />
                      </filter>
                    </svg>
                    <h1 className="text-center text-[clamp(3rem,15vw,9rem)] font-black leading-[0.92] tracking-[-0.03em]">
                      <span
                        ref={titrLeftRef}
                        className="inline-block will-change-transform"
                      >
                        13
                      </span>
                      <span
                        ref={titrBarRef}
                        className="mx-[0.22em] inline-block"
                      >
                        |
                      </span>
                      <span
                        ref={titrRightRef}
                        className="inline-block will-change-transform"
                      >
                        14
                      </span>
                    </h1>
                  </div>
                ) : (
                  <div
                    className={`h-[65vh] w-full md:max-w-[760px] border ${
                      dark
                        ? "border-white/20 bg-white/5"
                        : "border-black/20 bg-black/5"
                    }`}
                  />
                )}
                {screen.subtitle ? (
                  <p
                    className={`reveal-blur text-center text-xs tracking-[0.12em] ${
                      dark ? "text-white/70" : "text-black/70"
                    }`}
                  >
                    {screen.subtitle}
                  </p>
                ) : null}
              </div>
            </section>
          );
        })}

        {/* ── Profile section ── */}
        <section
          id={authorId}
          className="relative h-[100dvh] w-full snap-start overflow-hidden bg-black text-white md:flex md:flex-row"
        >
          {/* Sphere — fills screen on mobile (centered), left panel on desktop */}
          <div
            id="visual-sketch"
            className="absolute inset-0 flex items-center justify-center overflow-hidden pt-14 md:relative md:inset-auto md:h-full md:w-[44%] md:flex-shrink-0 md:pt-16"
          >
            <SphereCanvas />
          </div>

          {/* Mobile: just two lines at bottom-left */}
          <div className="reveal-blur absolute bottom-8 left-6 z-10 space-y-1 md:hidden">
            <p className="text-[11px] tracking-[0.14em] text-white/75">
              Untitled (Profile)
            </p>
            <p className="text-[11px] tracking-[0.14em] text-white/70">
              info@13-14.space
            </p>
          </div>

          {/* Desktop: full text panel on the right */}
          <div className="hidden flex-1 overflow-y-auto px-8 pb-10 pt-24 md:block">
            <div className="space-y-8 max-w-[520px]">
              <div className="reveal-blur space-y-1">
                <p className="text-[11px] tracking-[0.14em] text-white/75">
                  Untitled (Profile)
                </p>
                <p className="text-[11px] tracking-[0.14em] text-white/70">
                  info@13-14.space
                </p>
              </div>
              {projectNotes.map((item, i) => (
                <article
                  key={item.label}
                  className="reveal-blur"
                  style={
                    { "--reveal-delay": `${(i + 1) * 0.12}s` } as React.CSSProperties
                  }
                >
                  <p className="mb-1 text-[11px] tracking-[0.14em] text-white/70">
                    {item.label}
                  </p>
                  <p className="text-[11px] leading-relaxed text-white/80">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

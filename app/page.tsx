"use client";

import { useEffect, useRef, useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import { Slideshow } from "@/components/Slideshow";
import { Menu, X } from "lucide-react";

type ProjectScreen = {
  id: string;
  title: string;
  subtitle: string;
  theme: "light" | "dark";
  images?: string[];
};

// Проекты по очерёдности, иностранные первыми.
const projectScreens: ProjectScreen[] = [
  {
    id: "project-001",
    title: "PROJECT 001",
    subtitle: "Lamborghini 60th Anniversary — Austria",
    theme: "light",
    images: ["/cases/lambo-austria/1.jpg", "/cases/lambo-austria/4.jpg"],
  },
  {
    id: "project-002",
    title: "PROJECT 002",
    subtitle: "Lamborghini Driving Experience — Dubai & Abu Dhabi",
    theme: "dark",
    images: ["/cases/lambo-dubai/1.jpg", "/cases/lambo-dubai/2.jpg", "/cases/lambo-dubai/3.jpg", "/cases/lambo-dubai/4.jpg"],
  },
  {
    id: "project-003",
    title: "PROJECT 003",
    subtitle: "Aston Martin — Dubai Watch Week",
    theme: "light",
    images: ["/cases/aston-martin/1.jpg", "/cases/aston-martin/2.jpg", "/cases/aston-martin/3.jpg", "/cases/aston-martin/4.jpg"],
  },
  {
    id: "project-004",
    title: "PROJECT 004",
    subtitle: "Mercedes-EQ — EQS Premiere",
    theme: "dark",
    images: ["/cases/mercedes-eq/1.jpg", "/cases/mercedes-eq/2.jpg", "/cases/mercedes-eq/3.jpg", "/cases/mercedes-eq/4.jpg"],
  },
  {
    id: "project-005",
    title: "PROJECT 005",
    subtitle: "Samsung Galaxy S25 — World Premiere",
    theme: "light",
    images: ["/cases/samsung-galaxy/1.jpg", "/cases/samsung-galaxy/2.jpg", "/cases/samsung-galaxy/3.jpg", "/cases/samsung-galaxy/4.jpg"],
  },
  {
    id: "project-006",
    title: "PROJECT 006",
    subtitle: "OMODA C7 — Futuristic Reveal",
    theme: "dark",
    images: ["/cases/omoda-c7/1.jpg", "/cases/omoda-c7/2.jpg", "/cases/omoda-c7/3.jpg", "/cases/omoda-c7/4.jpg"],
  },
  {
    id: "project-007",
    title: "PROJECT 007",
    subtitle: "T-Bank PAYvolution — Biometrics in Action",
    theme: "light",
    images: ["/cases/tbank-payvolution/1.jpg", "/cases/tbank-payvolution/2.jpg", "/cases/tbank-payvolution/3.jpg"],
  },
  {
    id: "project-008",
    title: "PROJECT 008",
    subtitle: "Yandex Fabrika — Creativity at Scale",
    theme: "dark",
    images: ["/cases/yandex-fabrika/1.jpg", "/cases/yandex-fabrika/2.jpg", "/cases/yandex-fabrika/3.jpg"],
  },
  {
    id: "project-009",
    title: "PROJECT 009",
    subtitle: "Positive Technologies — Games of the Future",
    theme: "light",
    images: ["/cases/positive-technologies/4.jpg", "/cases/positive-technologies/2.jpg", "/cases/positive-technologies/3.jpg"],
  },
  {
    id: "project-010",
    title: "PROJECT 010",
    subtitle: "T-Bank — Music Festivals",
    theme: "dark",
    images: ["/cases/tbank-festivals/1.jpg", "/cases/tbank-festivals/2.jpg", "/cases/tbank-festivals/4.jpg"],
  },
  // Кейсы из CV — фото и описания появятся позже, пока рамка-заглушка.
  {
    id: "project-011",
    title: "PROJECT 011",
    subtitle: "Jetour T1 — Private Launch",
    theme: "light",
  },
  {
    id: "project-012",
    title: "PROJECT 012",
    subtitle: "Sber Business Conference 2026 — Sber City",
    theme: "dark",
  },
  {
    id: "project-013",
    title: "PROJECT 013",
    subtitle: "BMW Marathon Sponsorship — Moscow & Munich",
    theme: "light",
  },
  {
    id: "project-014",
    title: "PROJECT 014",
    subtitle: "Chery Tiggo 9 — Sky Screen Premiere",
    theme: "dark",
  },
  {
    id: "project-015",
    title: "PROJECT 015",
    subtitle: "OMODA C5 — Online Launch",
    theme: "light",
  },
];

const projectNotes: Array<{ label: string; text: string }> = [
  {
    label: "PROJECT 001 — Lamborghini 60th Anniversary",
    text: "A private 60th-anniversary dinner for Lamborghini in Austria, held at a working observatory. A planetary program with stargazing alongside astronomers, and an exclusive themed menu by a local chef, for 60 guests.",
  },
  {
    label: "PROJECT 002 — Lamborghini Driving Experience",
    text: "An exclusive high-performance driving experience combining track adrenaline with refined hospitality. Full-scale turnkey delivery at a Formula 1 circuit with 16 Temerario cars — curated pit-lane spaces, catering, registration, and guest journey.",
  },
  {
    label: "PROJECT 003 — Aston Martin",
    text: "Concept and delivery of the brand space that opened Dubai Watch Week, the year's most premium event. An expo stand for the Aston Martin DB12 with a hospitality lounge.",
  },
  {
    label: "PROJECT 004 — Mercedes-EQ",
    text: "Launch of the Mercedes-Benz EQS, the brand's first electric car, in Russia. An immersive premiere built on a 1:1 holographic reveal of the vehicle, under the concept “EQS for you, world.”",
  },
  {
    label: "PROJECT 005 — Samsung Galaxy S25",
    text: "World premiere of the Galaxy S25 flagship line. Five interactive spaces, each dedicated to a Galaxy AI feature, and a show reveal for press and guests.",
  },
  {
    label: "PROJECT 006 — OMODA C7",
    text: "Launch of the OMODA C7 at Navka Arena. A choreographed futuristic performance with a slider screen and a floating platform, fusing light, motion, and sound for 300+ guests.",
  },
  {
    label: "PROJECT 007 — T-Bank PAYvolution",
    text: "T-Bank's stand at Finopolis 2025. A six-meter “PAYvolution Tree” anchored an interactive path — a biometric quest with a Telegram bot, a Multibanking demo on a giant LED wall, and a Dolce Vita lounge.",
  },
  {
    label: "PROJECT 008 — Yandex Fabrika",
    text: "The first unified brand stand for Yandex Fabrika — a 100 m², six-meter installation with an industrial polycarbonate silhouette, a game quest linking nine brands, and 3,100 active participants.",
  },
  {
    label: "PROJECT 009 — Positive Technologies",
    text: "The brand's first large integration into a partner event. A hockey-themed stand at Tatneft Arena and a creative brand zone at Kazan Expo, plus a Positive House for staff and guests.",
  },
  {
    label: "PROJECT 010 — T-Bank Music Festivals",
    text: "Brand zones for T-Bank at the STEREOLETO and Dikaya Myata festivals — a playground concept with a real slide and a photo corner, built as a transformable structure for multiple venues, with game mechanics and rewards.",
  },
];

export default function Home() {
  const authorId = "author";
  const scrollerRef = useRef<HTMLElement | null>(null);
  const [activeScreenId, setActiveScreenId] = useState(authorId);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Порядок экранов: Profile первым, затем проекты.
  const screenIds = [authorId, ...projectScreens.map((s) => s.id)];

  const navItems = [
    { id: authorId, label: "PROFILE" },
    ...projectScreens.map((screen) => ({ id: screen.id, label: screen.title })),
  ];

  // Track active screen on scroll
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const updateActive = () => {
      const height = root.clientHeight || 1;
      const index = Math.round(root.scrollTop / height);
      const nextId = screenIds[Math.max(0, Math.min(screenIds.length - 1, index))];
      setActiveScreenId((prev) => (prev === nextId ? prev : nextId));
    };

    updateActive();
    root.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      root.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Шторка: накрытый экран уходит вглубь — масштаб и вуаль
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const height = root.clientHeight || 1;
      const sections = root.querySelectorAll<HTMLElement>("section");
      sections.forEach((section, i) => {
        const covered = Math.min(Math.max(root.scrollTop / height - i, 0), 1);
        const inner = section.querySelector<HTMLElement>("[data-screen-inner]");
        const veil = section.querySelector<HTMLElement>("[data-screen-veil]");
        if (inner) {
          inner.style.transform = covered > 0 ? `scale(${1 - covered * 0.06})` : "";
        }
        if (veil) {
          veil.style.opacity = `${covered * 0.45}`;
        }
      });
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

  // JS-снап: CSS scroll-snap несовместим со sticky-шторкой
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer: number | undefined;
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const h = root.clientHeight || 1;
        const target =
          Math.min(
            Math.round(root.scrollTop / h),
            Math.round((root.scrollHeight - h) / h),
          ) * h;
        if (Math.abs(target - root.scrollTop) > 1) {
          root.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
        }
      }, 200);
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      root.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
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
    const index = screenIds.indexOf(id);
    if (index < 0) return;
    root.scrollTo({ top: index * root.clientHeight, behavior: "smooth" });
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
          aria-label="Go to profile"
          className="text-[11px] tracking-[0.14em]"
          onClick={() => scrollToScreen(authorId)}
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

      {/* ── Main vertical scroller ── */}
      <main
        ref={scrollerRef}
        className="h-[100dvh] overflow-y-auto overflow-x-hidden scroll-smooth"
      >
        {/* ── Profile section (первый экран, наполним фото + текстом) ── */}
        <section
          id={authorId}
          className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-black text-white md:flex md:flex-row"
        >
          {/* Sphere — fills screen on mobile (centered), left panel on desktop */}
          <div
            id="visual-sketch"
            className="absolute inset-0 flex items-center justify-center overflow-hidden px-6 pt-14 md:relative md:inset-auto md:h-full md:w-[44%] md:flex-shrink-0 md:pt-16"
          >
            <ProfileCard
              avatarUrl="/profile/photo.jpg"
              iconUrl=""
              grainUrl=""
              name=""
              title=""
              showUserInfo={false}
              enableTilt={true}
            />
          </div>

          {/* Mobile: name + role at bottom-left */}
          <div className="absolute bottom-8 left-6 right-6 z-10 space-y-1 md:hidden">
            <p className="text-base tracking-tight text-white">Nurzhan Mukhitov</p>
            <p className="text-[10px] tracking-[0.16em] text-white/60">
              TECHNICAL DIRECTOR &amp; PRODUCER
            </p>
            <p className="pt-1 text-[10px] tracking-[0.14em] text-white/55">
              info@13-14.space
            </p>
          </div>

          {/* Desktop: about panel on the right */}
          <div className="hidden flex-1 overflow-y-auto px-8 pb-10 pt-24 md:block">
            <div className="max-w-[440px] space-y-6">
              <div className="space-y-1">
                <p className="text-lg tracking-tight text-white">
                  Nurzhan Mukhitov
                </p>
                <p className="text-[11px] tracking-[0.16em] text-white/60">
                  TECHNICAL DIRECTOR &amp; PRODUCER
                </p>
              </div>
              <p className="text-[13px] leading-relaxed text-white/85">
                Technical director and producer of live brand experiences. 15+
                years turning ambitious concepts into events that run flawlessly
                — on time, on site, in front of an audience.
              </p>
              <p className="text-[13px] leading-relaxed text-white/70">
                I lead the technical side of premieres, brand activations, and
                experiential events end to end — concept and technical design,
                production, and on-site delivery. Work spans automotive, tech,
                and finance brands across Europe, the Middle East, and beyond.
              </p>
              <div className="space-y-1.5">
                <p className="text-[11px] tracking-[0.16em] text-white/45">
                  CAPABILITIES
                </p>
                <p className="text-[12px] leading-relaxed text-white/70">
                  Technical direction &amp; show control · End-to-end production
                  · LED, projection &amp; holography · Interactive installations
                  · Vendor, budget &amp; schedule management · International
                  turnkey delivery
                </p>
              </div>
              <p className="text-[12px] tracking-[0.1em] text-white/55">
                info@13-14.space
              </p>
            </div>
          </div>
        </section>

        {/* ── Project screens ── */}
        {projectScreens.map((screen, index) => {
          const dark = screen.theme === "dark";
          const note = projectNotes[index];
          return (
            <section
              key={screen.id}
              id={screen.id}
              className={`sticky top-0 h-[100dvh] w-full overflow-hidden pt-14 ${
                dark ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              <div
                data-screen-inner
                className="flex h-full flex-col items-center justify-center gap-6 px-4 md:px-8"
              >
                <div
                  className={`relative h-[65vh] w-full overflow-hidden md:max-w-[760px] border ${
                    dark ? "border-white/20" : "border-black/20"
                  }`}
                >
                  {screen.images && screen.images.length > 0 ? (
                    <Slideshow images={screen.images} alt={screen.subtitle} />
                  ) : (
                    <div
                      className={`h-full w-full ${
                        dark ? "bg-white/5" : "bg-black/5"
                      }`}
                    />
                  )}
                  {/* Полупрозрачная накладка-шторка на всё фото, текст на подкладке */}
                  <div className="absolute inset-0 flex flex-col justify-end bg-black/55 px-5 pb-6 md:px-7 md:pb-8">
                    <p className="mb-2 text-[11px] tracking-[0.16em] text-white/80">
                      {screen.subtitle}
                    </p>
                    {note?.text ? (
                      <p className="max-w-[64ch] text-[13px] leading-relaxed text-white/90">
                        {note.text}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
              <div
                data-screen-veil
                className="pointer-events-none absolute inset-0 bg-black opacity-0"
              />
            </section>
          );
        })}
      </main>
    </>
  );
}

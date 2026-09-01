"use client";

import { useEffect, useRef, useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import { Slideshow } from "@/components/Slideshow";

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

const projectNotesEs: Array<{ label: string; text: string }> = [
  {
    label: "PROJECT 001 — Lamborghini 60th Anniversary",
    text: "Cena privada por el 60.º aniversario de Lamborghini en Austria, celebrada en un observatorio en activo. Programa planetario con observación de estrellas junto a astrónomos y un menú temático exclusivo de un chef local, para 60 invitados.",
  },
  {
    label: "PROJECT 002 — Lamborghini Driving Experience",
    text: "Una experiencia de conducción exclusiva que combina la adrenalina de la pista con una hospitalidad refinada. Entrega llave en mano en un circuito de Fórmula 1 con 16 Temerario: espacios de pit-lane, catering, registro y recorrido del invitado.",
  },
  {
    label: "PROJECT 003 — Aston Martin",
    text: "Concepto y ejecución del espacio de marca que abrió la Dubai Watch Week, el evento más premium del año. Un stand expositivo para el Aston Martin DB12 con lounge de hospitalidad.",
  },
  {
    label: "PROJECT 004 — Mercedes-EQ",
    text: "Lanzamiento del Mercedes-Benz EQS, el primer eléctrico de la marca, en Rusia. Un estreno inmersivo construido sobre una revelación holográfica 1:1 del vehículo, bajo el concepto «EQS for you, world».",
  },
  {
    label: "PROJECT 005 — Samsung Galaxy S25",
    text: "Estreno mundial de la línea insignia Galaxy S25. Cinco espacios interactivos, cada uno dedicado a una función de Galaxy AI, y un show de presentación para prensa e invitados.",
  },
  {
    label: "PROJECT 006 — OMODA C7",
    text: "Lanzamiento del OMODA C7 en el Navka Arena. Una performance futurista coreografiada con pantalla deslizante y plataforma flotante, fusionando luz, movimiento y sonido para más de 300 invitados.",
  },
  {
    label: "PROJECT 007 — T-Bank PAYvolution",
    text: "El stand de T-Bank en Finopolis 2025. Un «árbol PAYvolution» de seis metros anclaba un recorrido interactivo: una gincana biométrica con bot de Telegram, una demo de multibanca en una pared LED gigante y un lounge Dolce Vita.",
  },
  {
    label: "PROJECT 008 — Yandex Fabrika",
    text: "El primer stand unificado de Yandex Fabrika: una instalación de 100 m² y seis metros de altura con silueta industrial de policarbonato, un juego que conectaba nueve marcas y 3.100 participantes activos.",
  },
  {
    label: "PROJECT 009 — Positive Technologies",
    text: "La primera gran integración de la marca en un evento asociado. Un stand de temática de hockey en el Tatneft Arena y una zona creativa de marca en Kazan Expo, además de una Positive House para equipo e invitados.",
  },
  {
    label: "PROJECT 010 — T-Bank Music Festivals",
    text: "Zonas de marca de T-Bank en los festivales STEREOLETO y Dikaya Myata: un concepto de parque de juegos con tobogán real y rincón de fotos, construido como estructura transformable para varias sedes, con mecánicas de juego y recompensas.",
  },
];

type Lang = "en" | "es";

// Тексты интерфейса и профиля по языкам.
const COPY = {
  en: {
    burgerMenu: "Menu",
    burgerClose: "Close",
    menuAbout: "ABOUT",
    menuProjects: "PROJECTS",
    menuContact: "CONTACT",
    role: "TECHNICAL DIRECTOR & PRODUCER",
    about1:
      "Technical director and producer of live brand experiences. 15+ years turning ambitious concepts into events that run flawlessly — on time, on site, in front of an audience.",
    about2:
      "I lead the technical side of premieres, brand activations, and experiential events end to end — concept and technical design, production, and on-site delivery. Work spans automotive, tech, and finance brands across Europe, the Middle East, and beyond.",
    capsLabel: "CAPABILITIES",
    caps: "Technical direction & show control · End-to-end production · LED, projection & holography · Interactive installations · Vendor, budget & schedule management · International turnkey delivery",
    contactLabel: "CONTACT",
  },
  es: {
    burgerMenu: "Menú",
    burgerClose: "Cerrar",
    menuAbout: "SOBRE MÍ",
    menuProjects: "PROYECTOS",
    menuContact: "CONTACTO",
    role: "DIRECTOR TÉCNICO Y PRODUCTOR",
    about1:
      "Director técnico y productor de experiencias de marca en vivo. Más de 15 años convirtiendo conceptos ambiciosos en eventos que funcionan a la perfección: a tiempo, in situ y frente al público.",
    about2:
      "Dirijo de principio a fin la parte técnica de estrenos, activaciones de marca y eventos experienciales: concepto y diseño técnico, producción y ejecución in situ. He trabajado con marcas de automoción, tecnología y finanzas en Europa, Oriente Medio y más allá.",
    capsLabel: "CAPACIDADES",
    caps: "Dirección técnica y control de show · Producción integral · LED, proyección y holografía · Instalaciones interactivas · Gestión de proveedores, presupuesto y calendario · Entrega llave en mano internacional",
    contactLabel: "CONTACTO",
  },
} as const;

export default function Home() {
  const authorId = "author";
  const scrollerRef = useRef<HTMLElement | null>(null);
  const [activeScreenId, setActiveScreenId] = useState(authorId);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const c = COPY[lang];
  const notes = lang === "es" ? projectNotesEs : projectNotes;

  // Язык: восстановить выбор, сохранять при смене
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "es" || saved === "en") setLang(saved);
    } catch {}
  }, []);
  const switchLang = (next: Lang) => {
    setLang(next);
    try {
      localStorage.setItem("lang", next);
    } catch {}
  };

  const contactId = "contact";

  // Порядок экранов: Profile первым, затем проекты, Contact последним.
  const screenIds = [
    authorId,
    ...projectScreens.map((s) => s.id),
    contactId,
  ];

  // Бургер-меню: три раздела, без выделения цветом.
  const menuItems = [
    { id: authorId, label: c.menuAbout },
    { id: "project-001", label: c.menuProjects },
    { id: contactId, label: c.menuContact },
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
        // Жёсткий клэмп к реальному концу скролла: округлённая цель может
        // оказаться недостижимой (дробные высоты) — smooth-скролл тогда
        // перезапускается бесконечно и экран дёргается.
        const maxTop = root.scrollHeight - h;
        const target = Math.min(Math.round(root.scrollTop / h) * h, maxTop);
        if (Math.abs(target - root.scrollTop) > 2) {
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

  const scrollToScreen = (id: string, behavior: ScrollBehavior = "smooth") => {
    const root = scrollerRef.current;
    if (!root) return;
    const index = screenIds.indexOf(id);
    if (index < 0) return;
    root.scrollTo({ top: index * root.clientHeight, behavior });
  };

  // Из меню — мгновенный прыжок под открытой плитой, потом плита поднимается
  // и открывает уже нужный раздел. Никакой промотки через все проекты.
  const jumpFromMenu = (id: string) => {
    scrollToScreen(id, "instant");
    window.setTimeout(() => setMenuOpen(false), 350);
  };

  // Hint color based on current screen theme
  const activeScreen = projectScreens.find((s) => s.id === activeScreenId);
  const hintDark =
    activeScreen?.theme === "dark" ||
    activeScreenId === authorId ||
    activeScreenId === contactId;

  return (
    <>
      {/* ── Панель меню: чёрная плита, раскрывается сверху ── */}
      <nav
        aria-hidden={!menuOpen}
        className={`bm-panel fixed inset-0 z-[60] bg-black ${
          menuOpen ? "bm-panel--open" : ""
        }`}
      >
        <div className="absolute left-0 right-0 top-[53%] -translate-y-1/2 px-[max(20px,5vw)]">
          <ul className="flex list-none flex-col items-start gap-1 md:flex-row md:items-baseline md:justify-between md:gap-6">
            {menuItems.map((item, i) => (
              <li key={item.id} className="overflow-hidden">
                <button
                  type="button"
                  className="bm-link whitespace-nowrap text-[clamp(26px,7vw,34px)] font-medium tracking-[0.02em] text-white md:text-[clamp(1.1rem,2vw,1.9rem)]"
                  style={{ "--i": i } as React.CSSProperties}
                  onClick={() => jumpFromMenu(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ── Топбар: бургер с подписью + язык (слева), вордмарк (справа) ── */}
      <div className="fixed left-5 top-5 z-[70] flex flex-col items-start gap-5 mix-blend-difference md:left-7">
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className={`bm-burger flex items-center gap-3 text-white transition-transform duration-300 origin-left hover:scale-[1.06] active:scale-[0.97] ${
            menuOpen ? "bm-burger--open" : ""
          }`}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span
            aria-hidden="true"
            className="flex flex-col items-start gap-[7px]"
          >
            <span
              className={`block h-px w-[26px] bg-current transition-transform duration-500 ${
                menuOpen ? "translate-y-[8px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-[26px] bg-current transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px w-[26px] bg-current transition-transform duration-500 ${
                menuOpen ? "-translate-y-[8px] -rotate-45" : ""
              }`}
            />
          </span>
          <span
            aria-hidden="true"
            className="relative block h-[1.2em] w-[5.2em] overflow-hidden text-left font-mono text-[12px] uppercase tracking-[0.08em]"
          >
            <span className="bm-word bm-word--menu">{c.burgerMenu}</span>
            <span className="bm-word bm-word--close">{c.burgerClose}</span>
          </span>
        </button>

        <p className="flex items-center gap-2 font-mono text-[12px] tracking-[0.08em]">
          {(["en", "es"] as const).map((l, i) => (
            <span key={l} className="flex items-center gap-2">
              {i > 0 && <span className="text-white/45">/</span>}
              <button
                type="button"
                className={`uppercase transition-colors ${
                  lang === l ? "text-white" : "text-white/45 hover:text-white"
                }`}
                onClick={() => switchLang(l)}
              >
                {l}
              </button>
            </span>
          ))}
        </p>
      </div>

      {/* ── Wordmark (справа сверху) ── */}
      <button
        type="button"
        aria-label="Go to profile"
        className="fixed right-6 top-6 z-[70] text-[13px] tracking-[0.14em] text-white mix-blend-difference md:right-8"
        onClick={() => {
          if (menuOpen) {
            jumpFromMenu(authorId);
          } else {
            scrollToScreen(authorId, "instant");
          }
        }}
      >
        13 | 14
      </button>

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
              {c.role}
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
                  {c.role}
                </p>
              </div>
              <p className="text-[13px] leading-relaxed text-white/85">
                {c.about1}
              </p>
              <p className="text-[13px] leading-relaxed text-white/70">
                {c.about2}
              </p>
              <div className="space-y-1.5">
                <p className="text-[11px] tracking-[0.16em] text-white/45">
                  {c.capsLabel}
                </p>
                <p className="text-[12px] leading-relaxed text-white/70">
                  {c.caps}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Project screens ── */}
        {projectScreens.map((screen, index) => {
          const dark = screen.theme === "dark";
          const note = notes[index];
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

        {/* ── Contact section (последний экран) ── */}
        <section
          id={contactId}
          className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-black text-white"
        >
          <div className="flex h-full flex-col justify-center px-6 md:px-8">
            <div className="mx-auto w-full max-w-[440px] space-y-10">
              <p className="reveal-blur text-[11px] tracking-[0.16em] text-white/45">
                {c.contactLabel}
              </p>
              <div className="reveal-blur space-y-1">
                <p className="text-lg tracking-tight">Nurzhan Mukhitov</p>
                <p className="text-[11px] tracking-[0.16em] text-white/60">
                  {c.role}
                </p>
              </div>
              <div
                className="reveal-blur space-y-4 text-[14px]"
                style={{ "--reveal-delay": "0.12s" } as React.CSSProperties}
              >
                <a
                  href="https://t.me/nmk_one"
                  target="_blank"
                  rel="noopener"
                  className="block text-white/85 transition-opacity hover:opacity-60"
                >
                  @nmk_one
                </a>
                <div className="space-y-2">
                  <a
                    href="tel:+34654265169"
                    className="block text-white/85 transition-opacity hover:opacity-60"
                  >
                    <span className="mr-3 text-[11px] tracking-[0.16em] text-white/45">
                      ESP
                    </span>
                    +34 654 265 169
                  </a>
                  <a
                    href="tel:+79264679303"
                    className="block text-white/85 transition-opacity hover:opacity-60"
                  >
                    <span className="mr-3 text-[11px] tracking-[0.16em] text-white/45">
                      RUS
                    </span>
                    +7 926 467 93 03
                  </a>
                </div>
                <a
                  href="mailto:info@13-14.space"
                  className="block text-white/85 transition-opacity hover:opacity-60"
                >
                  info@13-14.space
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

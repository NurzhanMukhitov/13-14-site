"use client";

import { useEffect, useState } from "react";

/**
 * Авто-слайдшоу с кросс-фейдом. Фото стекаются absolute inset-0 —
 * контейнер должен быть position:relative + overflow-hidden.
 * Когда экран не активен (накрыт шторкой другого экрана), слайдшоу
 * замирает: анимация под накрытием зря жгёт GPU и может просвечивать
 * субпиксельным швом на дробных высотах вьюпорта.
 */
export function Slideshow({
  images,
  alt,
  interval = 3800,
  active = true,
}: {
  images: string[];
  alt: string;
  interval?: number;
  active?: boolean;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (images.length <= 1) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const t = setInterval(() => {
      setIndex((p) => (p + 1) % images.length);
    }, interval);
    return () => clearInterval(t);
  }, [images.length, interval, active]);

  return (
    <>
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={alt}
          loading={i === 0 ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
        />
      ))}
    </>
  );
}

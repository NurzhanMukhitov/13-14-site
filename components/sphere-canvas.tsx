/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";

export function SphereCanvas() {
  useEffect(() => {
    let cancelled = false;

    // Shared pointer state — updated by native PointerEvents, read by p5 draw()
    let pointerX: number | null = null;
    let pointerY: number | null = null;
    let pointerCleanup: (() => void) | null = null;

    const sketch = (s: any) => {
      let repelRadius: number;
      let radius: number;
      let angle = 0;
      const points: {
        index: number;
        pos: any;
        vel: any;
        char: string;
      }[] = [];

      const attraction = 0.01;
      const damping = 0.9;
      const repelStrength = 28;
      const digits = ["1", "1", "3", "3", "4"];

      const aboutLines = [
        "Digital visual artist",
        "From generative systems to interactive environments",
        "Code, motion, structure",
        "Open to collaborations",
      ];

      const DESIGN_WIDTH = 900;
      const DESIGN_HEIGHT = 700;
      const DESIGN_RADIUS = 250;
      const DESIGN_REPEL_RADIUS = 90;
      const DESIGN_TEXT_SIZE = 4;
      const DESIGN_PARTICLES = 8000;

      const MOBILE_WIDTH = 360;
      const MOBILE_HEIGHT = 360;
      const MOBILE_RADIUS = 160;
      const MOBILE_REPEL_RADIUS = 60;
      const MOBILE_TEXT_SIZE = 3;
      const MOBILE_PARTICLES = 2000;

      function calculateCanvasSize() {
        const container = document.getElementById("visual-sketch");
        if (!container) {
          return {
            width: DESIGN_WIDTH,
            height: DESIGN_HEIGHT,
            scale: 1,
            radius: DESIGN_RADIUS,
            repelRadius: DESIGN_REPEL_RADIUS,
            textSize: DESIGN_TEXT_SIZE,
            particles: DESIGN_PARTICLES,
            isMobile: false,
          };
        }

        const containerWidth = container.clientWidth;
        const targetWidth = Math.max(
          MOBILE_WIDTH,
          Math.min(DESIGN_WIDTH, containerWidth - 80),
        );

        const scale = targetWidth / DESIGN_WIDTH;
        const targetHeight = DESIGN_HEIGHT * scale;

        if (targetWidth <= MOBILE_WIDTH + 50) {
          return {
            width: MOBILE_WIDTH,
            height: MOBILE_HEIGHT,
            scale: MOBILE_WIDTH / DESIGN_WIDTH,
            radius: MOBILE_RADIUS,
            repelRadius: MOBILE_REPEL_RADIUS,
            textSize: MOBILE_TEXT_SIZE,
            particles: MOBILE_PARTICLES,
            isMobile: true,
          };
        }

        const isMid = targetWidth < 600;
        return {
          width: Math.round(targetWidth),
          height: Math.round(targetHeight),
          scale,
          radius: DESIGN_RADIUS * scale,
          repelRadius: DESIGN_REPEL_RADIUS * scale,
          textSize: Math.max(
            MOBILE_TEXT_SIZE,
            Math.min(
              DESIGN_TEXT_SIZE,
              DESIGN_TEXT_SIZE * Math.sqrt(scale),
            ),
          ),
          particles: isMid ? MOBILE_PARTICLES : DESIGN_PARTICLES,
          isMobile: isMid,
        };
      }

      // Uses shared pointer state set by native PointerEvents (reliable on iOS)
      function getInteractionPoint() {
        if (pointerX !== null && pointerY !== null) {
          return s.createVector(pointerX - s.width / 2, pointerY - s.height / 2);
        }
        return null;
      }

      let revealAlpha = 0;

      function updateTargets() {
        for (const p of points) {
          const i = p.index;
          const x = s.sin(i + angle) * s.sin(i * i) * radius;
          const y = s.cos(i * i) * radius;
          p.pos.set(x, y);
        }
      }

      s.setup = () => {
        const canvasConfig = calculateCanvasSize();

        // pixelDensity MUST be set before createCanvas for Safari compatibility
        s.pixelDensity(1);

        const canvas = s.createCanvas(
          canvasConfig.width,
          canvasConfig.height,
        );

        radius = canvasConfig.radius;
        repelRadius = canvasConfig.repelRadius;
        if (canvasConfig.isMobile) s.frameRate(30);

        const container = document.getElementById("visual-sketch");
        if (container) {
          canvas.parent(container);
        }

        const canvasEl = canvas.elt as HTMLCanvasElement;
        canvasEl.style.background = "transparent";
        canvasEl.style.touchAction = "none";

        // Native PointerEvents — reliable across mouse, touch, stylus on all browsers
        const onMove = (e: PointerEvent) => {
          const rect = canvasEl.getBoundingClientRect();
          pointerX = e.clientX - rect.left;
          pointerY = e.clientY - rect.top;
        };
        const onEnd = () => {
          pointerX = null;
          pointerY = null;
        };

        canvasEl.addEventListener("pointermove", onMove, { passive: true });
        canvasEl.addEventListener("pointerdown", onMove, { passive: true });
        canvasEl.addEventListener("pointerup", onEnd);
        canvasEl.addEventListener("pointerleave", onEnd);
        canvasEl.addEventListener("pointercancel", onEnd);

        pointerCleanup = () => {
          canvasEl.removeEventListener("pointermove", onMove);
          canvasEl.removeEventListener("pointerdown", onMove);
          canvasEl.removeEventListener("pointerup", onEnd);
          canvasEl.removeEventListener("pointerleave", onEnd);
          canvasEl.removeEventListener("pointercancel", onEnd);
        };

        s.textAlign(s.CENTER, s.CENTER);
        s.textFont("monospace");
        s.textStyle(s.NORMAL);
        s.noStroke();
        s.fill(255);
        s.textSize(canvasConfig.textSize);

        const numParticles = canvasConfig.particles;
        for (let i = 0; i < numParticles; i++) {
          points.push({
            index: i,
            pos: s.createVector(0, 0),
            vel: s.createVector(0, 0),
            char: digits[Math.floor(Math.random() * digits.length)],
          });
        }

        angle = 0;
        updateTargets();
        for (const p of points) {
          p.vel.set(0, 0);
        }
      };

      s.draw = () => {
        s.clear();
        s.translate(s.width / 2, s.height / 2);

        const interactionPoint = getInteractionPoint();

        let targetAlpha = 0;
        if (interactionPoint) {
          const distFromCenter = interactionPoint.mag();
          const maxDist = radius * 0.9;
          const t = 1 - s.constrain(distFromCenter / maxDist, 0, 1);
          targetAlpha = 255 * t;
        }

        revealAlpha = revealAlpha + (targetAlpha - revealAlpha) * 0.1;

        for (const p of points) {
          const i = p.index;

          const homeX = s.sin(i + angle) * s.sin(i * i) * radius;
          const homeY = s.cos(i * i) * radius;
          const home = s.createVector(homeX, homeY);

          const toHome = s.createVector(
            home.x - p.pos.x,
            home.y - p.pos.y,
          );
          const spring = toHome.mult(attraction);
          p.vel.add(spring);

          if (interactionPoint) {
            const awayFromInteraction = s.createVector(
              p.pos.x - interactionPoint.x,
              p.pos.y - interactionPoint.y,
            );
            const distSq = awayFromInteraction.magSq();
            if (distSq > 0.1 && distSq < repelRadius * repelRadius) {
              const distance = s.sqrt(distSq);
              awayFromInteraction.normalize();
              const repel =
                repelStrength * (1 - distance / repelRadius);
              awayFromInteraction.mult(repel);
              p.vel.add(awayFromInteraction);
            }
          }

          p.vel.mult(damping);
          p.pos.add(p.vel);

          s.text(p.char, p.pos.x, p.pos.y);
        }

        angle += 0.01;

        if (revealAlpha > 0.1) {
          s.push();
          s.textAlign(s.CENTER, s.CENTER);
          s.fill(255, revealAlpha);

          const baseSize = radius * 0.07;
          s.textSize(baseSize);

          const maxTextWidth = radius * 1.4;
          const textHeight = radius * 1.2;
          const textBlock = aboutLines.join("\n");

          s.text(
            textBlock,
            -maxTextWidth / 2,
            -textHeight / 2,
            maxTextWidth,
            textHeight,
          );
          s.pop();
        }
      };

      s.windowResized = () => {
        // Delay lets CSS reflow finish (important on orientation change)
        setTimeout(() => {
          const canvasConfig = calculateCanvasSize();
          s.resizeCanvas(canvasConfig.width, canvasConfig.height);
          radius = canvasConfig.radius;
          repelRadius = canvasConfig.repelRadius;
          s.textSize(canvasConfig.textSize);
          if (canvasConfig.isMobile) s.frameRate(30);
          else s.frameRate(60);
          updateTargets();
        }, 150);
      };
    };

    let instance: any;

    import("p5").then(({ default: P5 }) => {
      if (cancelled) return;
      const container = document.getElementById("visual-sketch");
      if (container) {
        const staleCanvases = container.querySelectorAll("canvas");
        staleCanvases.forEach((node) => node.remove());
      }
      instance = new P5(sketch);
    });

    return () => {
      cancelled = true;
      pointerCleanup?.();
      if (instance) {
        instance.remove();
      }
    };
  }, []);

  return null;
}

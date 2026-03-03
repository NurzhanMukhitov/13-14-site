"use client";

import { useEffect } from "react";

export function SphereCanvas() {
  useEffect(() => {
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
      const MOBILE_PARTICLES = 4000;

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
          };
        }

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
          particles: targetWidth < 600 ? MOBILE_PARTICLES : DESIGN_PARTICLES,
        };
      }

      function getInteractionPoint() {
        const firstTouch = (s.touches && s.touches[0]) as
          | { x: number; y: number }
          | undefined;
        if (firstTouch) {
          return s.createVector(
            firstTouch.x - s.width / 2,
            firstTouch.y - s.height / 2,
          );
        }

        if (
          s.mouseIsPressed ||
          s.mouseX !== s.pmouseX ||
          s.mouseY !== s.pmouseY
        ) {
          return s.createVector(
            s.mouseX - s.width / 2,
            s.mouseY - s.height / 2,
          );
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
        const canvas = s.createCanvas(
          canvasConfig.width,
          canvasConfig.height,
        );

        radius = canvasConfig.radius;
        repelRadius = canvasConfig.repelRadius;

        const container = document.getElementById("visual-sketch");
        if (container) {
          canvas.parent(container);
        }

        s.pixelDensity(1);
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
        s.background(0);
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
        const canvasConfig = calculateCanvasSize();
        s.resizeCanvas(canvasConfig.width, canvasConfig.height);
        radius = canvasConfig.radius;
        repelRadius = canvasConfig.repelRadius;
        s.textSize(canvasConfig.textSize);
        updateTargets();
      };
    };

    let instance: any;

    import("p5").then(({ default: P5 }) => {
      instance = new P5(sketch);
    });

    return () => {
      if (instance) {
        instance.remove();
      }
    };
  }, []);

  return null;
}


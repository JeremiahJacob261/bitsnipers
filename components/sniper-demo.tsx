/// <reference path="../node_modules/p5/types/p5.d.ts" />
"use client";
import React, { useEffect, useRef, useState } from "react";
import p5 from "p5";
import { useRouter } from "next/navigation";

/**
 * SniperDemo component recreates the provided standalone HTML p5.js demo inside Next.js.
 * - Canvas size: responsive fullscreen
 * - WASD to move player
 * - Click to shoot towards cursor
 * - 5 autonomous bots wander & shoot randomly
 * - Loot drops ($ cash) on death, respawn after 5s
 * - Player now displays as an image
 */
export const SniperDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sketchRef = useRef<p5 | null>(null);
  const [cash, setCash] = useState(1); // player cash (react state for UI)
  const router = useRouter();
  useEffect(() => {
    if (!containerRef.current) return;
    // In React StrictMode dev, effects run twice (mount/unmount). Ensure stale canvases removed.
    containerRef.current.querySelectorAll("canvas").forEach((c) => c.remove());
    if (sketchRef.current) {
      sketchRef.current.remove();
      sketchRef.current = null;
    }

    const sketch = (s: p5) => {
      type Entity = {
        x: number;
        y: number;
        alive: boolean;
        cash: number;
        respawnTimer?: number;
        moveAngle?: number;
        moveTimer?: number;
        shootTimer?: number;
      };
      type Bullet = {
        x: number;
        y: number;
        vx: number;
        vy: number;
        age: number;
        owner: Entity | Player;
      };
      type Loot = { x: number; y: number; cash: number };
      type Player = {
        x: number;
        y: number;
        alive: boolean;
        respawnTimer?: number;
      } & { isPlayer: true };

      let player: Player;
      let bots: Entity[] = [];
      let bullets: Bullet[] = [];
      let loot: Loot[] = [];
      let lastCash = 1;
      let playerImg: p5.Image | null = null;
      let spikerImg: p5.Image | null = null;

      type Obstacle = { x: number; y: number; r: number };
      let obstacles: Obstacle[] = [];

      const BOT_COUNT = 5;
      let CANVAS_W = window.innerWidth;
      let CANVAS_H = window.innerHeight;
      // --- Obstacle / sizing configuration (edit these to tweak quickly) ---
      const OBSTACLE_COUNT = 8; // how many obstacles to place
      const OBSTACLE_RADIUS = 60; // base radius of each obstacle (was 28)
      const OBSTACLE_PLAYER_CLEAR = 3 * OBSTACLE_RADIUS; // min distance from player spawn
      const OBSTACLE_MIN_GAP = 30; // extra spacing between obstacles beyond radii sum
      const PLAYER_RADIUS = 20; // collision radius of player (image 40x40)
      const BOT_RADIUS = 12; // approximate radius of bot (ellipse 24)
      // Manual key state (fix WASD not registering if canvas not focused)
      const held: Record<string, boolean> = {
        w: false,
        a: false,
        s: false,
        d: false,
      };
      let escapePresses = 0;
      let lastEscapeTime = 0; // ms timestamp
      const downHandler = (e: KeyboardEvent) => {
        const k = e.key.toLowerCase();
        if (k in held) {
          held[k] = true;
          e.preventDefault();
        }
        if (e.key === "Escape") {
          const now = Date.now();
          // reset combo if too slow (>1500ms between presses)
          if (now - lastEscapeTime > 1500) escapePresses = 0;
          lastEscapeTime = now;
          escapePresses++;
          if (escapePresses >= 3) {
            // Exit game: navigate back or to home
            try {
              router.push("/");
            } catch {
              router.push("/");
            }
          }
        }
      };
      const upHandler = (e: KeyboardEvent) => {
        const k = e.key.toLowerCase();
        if (k in held) {
          held[k] = false;
          e.preventDefault();
        }
      };
      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);
      // expose for cleanup
      (s as any)._downHandler = downHandler;
      (s as any)._upHandler = upHandler;

      // ===== Infinite obstacle chunk system =====
      const CHUNK_SIZE = 1200; // world size of each chunk
      const OBSTACLES_PER_CHUNK = 10; // how many obstacles per generated chunk
      const generatedChunks = new Set<string>();

      const chunkKey = (cx: number, cy: number) => `${cx},${cy}`;

      const generateChunk = (cx: number, cy: number) => {
        const key = chunkKey(cx, cy);
        if (generatedChunks.has(key)) return;
        generatedChunks.add(key);
        const left = cx * CHUNK_SIZE;
        const top = cy * CHUNK_SIZE;
        let added = 0;
        let attempts = 0;
        while (
          added < OBSTACLES_PER_CHUNK &&
          attempts < OBSTACLES_PER_CHUNK * 25
        ) {
          attempts++;
          const r = OBSTACLE_RADIUS;
          const x = left + s.random(r + 40, CHUNK_SIZE - r - 40);
          const y = top + s.random(r + 40, CHUNK_SIZE - r - 40);
          // Keep initial spawn area clearer for origin chunk
          if (
            cx === 0 &&
            cy === 0 &&
            Math.hypot(x - player.x, y - player.y) < OBSTACLE_PLAYER_CLEAR
          )
            continue;
          // Overlap avoidance
          if (
            obstacles.some(
              (o) => Math.hypot(o.x - x, o.y - y) < o.r + r + OBSTACLE_MIN_GAP
            )
          )
            continue;
          obstacles.push({ x, y, r });
          added++;
        }
      };

      const ensureChunksAroundPlayer = () => {
        const pcx = Math.floor(player.x / CHUNK_SIZE);
        const pcy = Math.floor(player.y / CHUNK_SIZE);
        for (let dx = -2; dx <= 2; dx++) {
          for (let dy = -2; dy <= 2; dy++) {
            generateChunk(pcx + dx, pcy + dy);
          }
        }
      };

      // Helper: find a random point near a center not colliding with obstacles (for infinite world style)
      const safeSpawn = (
        radius: number,
        cx = player?.x || 0,
        cy = player?.y || 0,
        spread = 600
      ): { x: number; y: number } => {
        let attempts = 0;
        while (attempts < 800) {
          attempts++;
          const dist = s.random(radius, spread);
          const ang = s.random(s.TWO_PI);
          const x = cx + Math.cos(ang) * dist;
          const y = cy + Math.sin(ang) * dist;
          const collision = obstacles.some(
            (o) => Math.hypot(o.x - x, o.y - y) < o.r + radius + 4
          );
          if (!collision) return { x, y };
        }
        return { x: cx, y: cy };
      };

      // Convert screen mouse to world coordinates (undo camera translate)
      const getWorldMouse = () => {
        const worldX = s.mouseX - (CANVAS_W / 2 - player.x);
        const worldY = s.mouseY - (CANVAS_H / 2 - player.y);
        return { x: worldX, y: worldY };
      };

      s.setup = () => {
        CANVAS_W = window.innerWidth;
        CANVAS_H = window.innerHeight;
        const c = s.createCanvas(CANVAS_W, CANVAS_H);
        c.parent(containerRef.current!);
        s.noSmooth();

        // --- Create assets (player procedural + load spiker obstacle) ---
        const g = s.createGraphics(40, 40);
        g.clear(); // transparent background

        // Colors
        let fillColor = g.color(181, 152, 112); // brown fill
        let strokeColor = g.color(80); // dark outline
        let gunColor = g.color(50); // gun

        // Bear head (3 circles)
        g.stroke(strokeColor);
        g.strokeWeight(1.5);
        g.fill(fillColor);

        g.ellipse(20, 25, 22, 22); // big head
        g.ellipse(10, 15, 10, 10); // left ear
        g.ellipse(30, 15, 10, 10); // right ear

        // Gun
        g.noStroke();
        g.fill(gunColor);
        g.rect(18.5, 8, 3, 15); // shaft
        g.rect(19.2, 0, 1.6, 8); // barrel
        g.beginShape(); // stock
        g.vertex(18, 23);
        g.vertex(22, 23);
        g.vertex(23, 28);
        g.vertex(20, 30);
        g.vertex(17, 27);
        g.endShape(g.CLOSE);

        // Store as image for later draw
        playerImg = g.get() as p5.Image;

        // Player setup (temporary center, may be adjusted after obstacles)
        player = {
          x: 0,
          y: 0,
          alive: true,
          isPlayer: true,
        };

        // Initial chunks of obstacles around player origin
        ensureChunksAroundPlayer();

        // Ensure player is not inside an obstacle (if obstacles surround center)
        if (
          obstacles.some(
            (o) =>
              Math.hypot(o.x - player.x, o.y - player.y) <
              o.r + PLAYER_RADIUS + 10
          )
        ) {
          const pos = safeSpawn(PLAYER_RADIUS, player.x, player.y, 800);
          player.x = pos.x;
          player.y = pos.y;
        }

        // Bots setup (spawn safely)
        bots = [];
        for (let i = 0; i < BOT_COUNT; i++) {
          const pos = safeSpawn(BOT_RADIUS, player.x, player.y, 800);
          bots.push({
            x: pos.x,
            y: pos.y,
            cash: 1,
            alive: true,
            moveAngle: s.random(s.TWO_PI),
            moveTimer: s.random(1, 3),
            shootTimer: s.random(1, 5),
          });
        }

        // Load spiker AFTER canvas (in case of hot reload). We'll lazy load; if not loaded yet we draw placeholder.
        s.loadImage("/images/spiker.png", (img: p5.Image) => {
          spikerImg = img;
        });
      };

      const handlePlayerMovement = () => {
        if (!player.alive) return;
        let dx = 0,
          dy = 0;

        // WASD using manual held map (more reliable focus-independent)
        if (held.w) dy -= 5;
        if (held.s) dy += 5;
        if (held.a) dx -= 5;
        if (held.d) dx += 5;

        // Arrow keys as backup
        if (s.keyIsDown(s.UP_ARROW)) dy -= 5;
        if (s.keyIsDown(s.DOWN_ARROW)) dy += 5;
        if (s.keyIsDown(s.LEFT_ARROW)) dx -= 5;
        if (s.keyIsDown(s.RIGHT_ARROW)) dx += 5;

        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
          dx *= Math.SQRT1_2;
          dy *= Math.SQRT1_2;
        }

        const newX = player.x + dx;
        const newY = player.y + dy;
        const radius = PLAYER_RADIUS; // player collision radius
        // Check collision with obstacles; allow axis separation (slide along walls)
        let blockedX = false;
        let blockedY = false;
        for (const o of obstacles) {
          const distNew = Math.hypot(o.x - newX, o.y - player.y);
          if (distNew < o.r + radius) blockedX = true;
          const distNewY = Math.hypot(o.x - player.x, o.y - newY);
          if (distNewY < o.r + radius) blockedY = true;
        }
        if (!blockedX) player.x = newX;
        if (!blockedY) player.y = newY;
      };

      const updateBots = () => {
        const dt = s.deltaTime / 1000;
        for (const bot of bots) {
          if (!bot.alive) continue;
          bot.moveTimer = (bot.moveTimer || 0) - dt;
          if (bot.moveTimer <= 0) {
            bot.moveAngle = s.random(s.TWO_PI);
            bot.moveTimer = s.random(1, 3);
          }
          bot.x = bot.x + Math.cos(bot.moveAngle!) * 3;
          bot.y = bot.y + Math.sin(bot.moveAngle!) * 3;
          // Keep bots roughly near player so action stays local
          const dToPlayer = Math.hypot(bot.x - player.x, bot.y - player.y);
          if (dToPlayer > 1800) {
            const pos = safeSpawn(BOT_RADIUS, player.x, player.y, 900);
            bot.x = pos.x;
            bot.y = pos.y;
          }
          bot.shootTimer = (bot.shootTimer || 0) - dt;
          if (bot.shootTimer <= 0) {
            const angle = s.random(s.TWO_PI);
            bullets.push({
              x: bot.x,
              y: bot.y,
              vx: Math.cos(angle) * 10,
              vy: Math.sin(angle) * 10,
              age: 0,
              owner: bot,
            });
            bot.shootTimer = s.random(1, 5);
          }
        }
      };

      const updateBullets = () => {
        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          b.x += b.vx;
          b.y += b.vy;
          b.vx *= 0.98;
          b.vy *= 0.98;
          b.age += 1 / 60;
          // Despawn bullets after age or if far from player (in infinite world)
          if (b.age > 5 || Math.hypot(b.x - player.x, b.y - player.y) > 3000) {
            bullets.splice(i, 1);
            continue;
          }
          // obstacle collision (simple circle collision)
          let hitObstacle = false;
          for (const o of obstacles) {
            if (Math.hypot(b.x - o.x, b.y - o.y) < o.r) {
              hitObstacle = true;
              break;
            }
          }
          if (hitObstacle) {
            bullets.splice(i, 1);
            continue;
          }
          // collision with bots (player-owned bullets)
          if ((b.owner as any).isPlayer) {
            for (const bot of bots) {
              if (!bot.alive) continue;
              if (Math.hypot(b.x - bot.x, b.y - bot.y) < 15) {
                bot.alive = false;
                loot.push({ x: bot.x, y: bot.y, cash: bot.cash });
                bullets.splice(i, 1);
                break;
              }
            }
          }
        }
      };

      const updatePlayerHit = () => {
        if (!player.alive) return;
        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          if ((b.owner as any).isPlayer) continue;
          if (Math.hypot(b.x - player.x, b.y - player.y) < 20) {
            player.alive = false;
            loot.push({ x: player.x, y: player.y, cash: lastCash });
            bullets.splice(i, 1);
            break;
          }
        }
      };

      const updateLoot = () => {
        for (let i = loot.length - 1; i >= 0; i--) {
          const l = loot[i];
          if (player.alive && Math.hypot(l.x - player.x, l.y - player.y) < 25) {
            lastCash += l.cash;
            setCash(lastCash);
            loot.splice(i, 1);
            continue;
          }
        }
      };

      const respawns = () => {
        const dt = s.deltaTime / 1000;
        // bots
        for (const bot of bots) {
          if (!bot.alive) {
            bot.respawnTimer = (bot.respawnTimer || 5) - dt;
            if (bot.respawnTimer <= 0) {
              const pos = safeSpawn(BOT_RADIUS, player.x, player.y, 900);
              bot.x = pos.x;
              bot.y = pos.y;
              bot.cash = 1;
              bot.alive = true;
              bot.moveTimer = s.random(1, 3);
              bot.shootTimer = s.random(1, 5);
              delete bot.respawnTimer;
            }
          }
        }
        // player
        if (!player.alive) {
          player.respawnTimer = (player.respawnTimer || 5) - dt;
          if (player.respawnTimer <= 0) {
            const pos = safeSpawn(PLAYER_RADIUS, player.x, player.y, 800);
            player.x = pos.x;
            player.y = pos.y;
            player.alive = true;
            lastCash = 1;
            setCash(lastCash);
            delete player.respawnTimer;
          }
        }
      };

      const drawBullets = () => {
        s.fill(255, 255, 0);
        s.noStroke();
        for (const b of bullets) {
          s.ellipse(b.x, b.y, 6, 6);
        }
      };

      const drawLoot = () => {
        s.textAlign(s.CENTER);
        s.textSize(12);
        for (const l of loot) {
          s.fill(0, 255, 0);
          s.stroke(0);
          s.strokeWeight(1);
          s.rect(l.x - 6, l.y - 6, 12, 12);
          s.fill(255);
          s.noStroke();
          s.text(`$${l.cash}`, l.x, l.y - 12);
        }
      };

      const drawEntities = () => {
        // Obstacles (draw beneath dynamic entities but above ground)
        for (const o of obstacles) {
          s.push();
          s.imageMode(s.CENTER);
          if (spikerImg) {
            s.image(spikerImg, o.x, o.y, o.r * 2, o.r * 2);
          } else {
            // placeholder
            s.noStroke();
            s.fill(120, 90, 60);
            s.ellipse(o.x, o.y, o.r * 2);
          }
          s.pop();
        }
        // Draw bots
        for (const bot of bots) {
          if (!bot.alive) continue;
          s.fill(255, 0, 0);
          s.stroke(0);
          s.strokeWeight(2);
          s.ellipse(bot.x, bot.y, 24, 24);
          s.fill(255);
          s.noStroke();
          s.textAlign(s.CENTER);
          s.textSize(10);
          s.text(`Bot`, bot.x, bot.y - 20);
          s.text(`$${bot.cash}`, bot.x, bot.y - 8);
        }

        // Draw player with rotation (use world mouse)
        if (player.alive && playerImg) {
          const wm = getWorldMouse();
          const angle = Math.atan2(wm.y - player.y, wm.x - player.x);

          s.push();
          s.translate(player.x, player.y); // move origin to player
          s.rotate(angle + s.HALF_PI); // rotate towards cursor
          s.imageMode(s.CENTER);
          s.image(playerImg, 0, 0, 80, 80);
          s.pop();

          // Player labels (not rotated)
          s.fill(255);
          s.stroke(0);
          s.strokeWeight(1);
          s.textAlign(s.CENTER);
          s.textSize(10);
          s.text(`Player`, player.x, player.y - 28);
          s.text(`$${lastCash}`, player.x, player.y - 16);
        }
      };

      s.windowResized = () => {
        CANVAS_W = window.innerWidth;
        CANVAS_H = window.innerHeight;
        s.resizeCanvas(CANVAS_W, CANVAS_H);
      };

      // Draw infinite-looking background grid
      const drawGrid = () => {
        const GS = 160; // grid size
        const left = player.x - CANVAS_W / 2 - GS;
        const right = player.x + CANVAS_W / 2 + GS;
        const top = player.y - CANVAS_H / 2 - GS;
        const bottom = player.y + CANVAS_H / 2 + GS;
        const startX = Math.floor(left / GS);
        const endX = Math.floor(right / GS);
        const startY = Math.floor(top / GS);
        const endY = Math.floor(bottom / GS);
        for (let gx = startX; gx <= endX; gx++) {
          for (let gy = startY; gy <= endY; gy++) {
            const x = gx * GS;
            const y = gy * GS;
            const parity = (gx + gy) & 1;
            if (parity === 0) s.fill(70, 140, 70);
            else s.fill(60, 120, 60);
            s.noStroke();
            s.rect(x, y, GS, GS);
          }
        }
        // subtle grid lines
        s.stroke(40, 90, 40, 120);
        s.strokeWeight(2);
        for (let gx = startX; gx <= endX; gx++) {
          const x = gx * GS;
          s.line(x, top - 50, x, bottom + 50);
        }
        for (let gy = startY; gy <= endY; gy++) {
          const y = gy * GS;
          s.line(left - 50, y, right + 50, y);
        }
      };

      s.draw = () => {
        s.background(50, 110, 50);

        handlePlayerMovement();
        ensureChunksAroundPlayer();
        updateBots();
        updateBullets();
        updatePlayerHit();
        updateLoot();
        respawns();

        s.push();
        // camera translate (player centered)
        s.translate(CANVAS_W / 2 - player.x, CANVAS_H / 2 - player.y);
        drawGrid();
        drawBullets();
        drawLoot();
        drawEntities();
        s.pop();

        // UI overlay for respawn timer
        if (!player.alive) {
          s.fill(255, 255, 255, 200);
          s.stroke(0);
          s.strokeWeight(2);
          s.rect(10, 10, 200, 30);
          s.fill(255, 0, 0);
          s.noStroke();
          s.textAlign(s.LEFT);
          s.textSize(16);
          s.text(
            `Respawning in ${(player.respawnTimer || 5).toFixed(1)}s`,
            15,
            30
          );
        }
      };

      s.mousePressed = () => {
        if (!player.alive) return;
        const wm = getWorldMouse();
        const angle = Math.atan2(wm.y - player.y, wm.x - player.x);
        bullets.push({
          x: player.x,
          y: player.y,
          vx: Math.cos(angle) * 12,
          vy: Math.sin(angle) * 12,
          age: 0,
          owner: player,
        });
      };

      // Prevent default key behavior for game keys
      s.keyPressed = () => {
        // Prevent scrolling with WASD and arrows
        if (
          [87, 65, 83, 68].includes(s.keyCode) ||
          [s.UP_ARROW, s.DOWN_ARROW, s.LEFT_ARROW, s.RIGHT_ARROW].includes(
            s.keyCode
          )
        ) {
          return false;
        }
      };
    };

    sketchRef.current = new p5(sketch);

    return () => {
      sketchRef.current?.remove();
      sketchRef.current = null;
      // Clean listeners (in case effect re-runs)
      if ((sketch as any)?._downHandler)
        window.removeEventListener("keydown", (sketch as any)._downHandler);
      if ((sketch as any)?._upHandler)
        window.removeEventListener("keyup", (sketch as any)._upHandler);
    };
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-black">
      <div ref={containerRef} className="w-full h-full" tabIndex={0} />
      <div className="absolute top-4 left-4 text-lg text-white font-mono bg-black/70 px-4 py-2 rounded-lg border border-green-400 pointer-events-none select-none">
        💰 Cash: ${cash}
      </div>
      <div className="absolute top-4 right-4 text-sm text-green-200 bg-black/70 px-3 py-2 rounded-lg pointer-events-none select-none">
        🎮 Move: WASD / Arrows • 🔫 Click: shoot
      </div>
      <div className="absolute bottom-4 left-4 text-xs text-gray-300 bg-black/50 px-2 py-1 rounded pointer-events-none select-none">
        DEMO
      </div>
    </div>
  );
};

export default SniperDemo;

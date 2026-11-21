/* Amble Films: the living bear.
   The bear is the outline from the Amble Films logo itself, filled solid and
   moved by a small skeleton (body, head, four two-part legs and paws), so it
   bends as one continuous shape.

   The bear does not walk: its four paws stay planted, which keeps its legs in
   their natural logo shape. On load it stands on the ground, the word "Amble"
   rises up underneath it and lifts it into the logo position, and from then on
   it idles: breathing, sniffing the letters, scenting the air, shifting its
   weight and lifting a paw.

   All positions are in the logo's own coordinates (viewBox 0 0 765 344). */
(function () {
"use strict";

const NS = "http://www.w3.org/2000/svg", TAU = Math.PI * 2;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const smooth = x => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
const f1 = n => (Math.round(n * 10) / 10).toString();
const rnd = (a, b) => a + Math.random() * (b - a);

/* ---------- Proportions, measured from the logo bear ---------- */
const GY = 138;         // the line the paws stand on (top of the letters)
const LIFT = 113;       // how far below that the ground is before the word lifts the bear
const SINK = 182;       // how far down the word starts, hidden in the ground
const X = 235.4;        // where the hips are
const L = 120;          // hip to shoulder
const HIP = 70, SHO = 74;
const NECK = [112, -30], NOSE = 69;
const LEN = { hind: [36, 34], front: [38, 36] };
const LEGS = [                       // where each paw stands, measured from its joint
  { front: false, at: -12.6 }, { front: false, at: 32.4 },
  { front: true,  at: -32.4 }, { front: true,  at: 12.6 }
];
const PLUMP = 2.5;                   // how much the outline is filled out for a chubbier bear (0 = exactly the logo)

/* ---------- Timing of the entrance ---------- */
const T_SNIFF = 0.9, TR0 = 2.5, TR1 = 4.8, T_INTRO = 7.6;
const IDLE = ["ground", "air", "shift", "paw", "low", "ground", "air"];

class Bear {
  constructor(root, o) {
    o = o || {};
    this.root = root; this.skin = o.skin || null; this.probe = !!o.probe;
    if (root) {
      this.path = document.createElementNS(NS, "path");
      this.path.setAttribute("fill", o.ink || "#000");
      root.appendChild(this.path);
    }
    this.t = 0; this.sn = 0; this.th = 0.23; this.thV = 0;
    this.lean = 0; this.dip = 0; this.paw = 0; this.fade = 0;
    this.idle = null; this.nextIdle = T_INTRO + 2.5; this.lastIdle = "";
    this.sk = null; this.breath = 1;
    this.wordY = 0; this.bearY = 0; this.films = 1;
  }

  /* What is happening at time t */
  script(t) {
    const r = { sniff: 0, look: null, air: 0, lean: 0, dip: 0, paw: 0, wordY: 0, bearY: 0 };
    if (this.probe) return r;
    if (t < TR0) {                                             // standing on the ground, nose down
      r.wordY = SINK; r.bearY = LIFT;
      if (t > T_SNIFF && t < TR0 - 0.3) r.sniff = 1;
    } else if (t < TR1) {                                      // the word comes up and lifts the bear
      r.wordY = SINK * (1 - smooth((t - TR0) / (TR1 - TR0)));
      r.bearY = Math.min(r.wordY, LIFT);
      r.dip = smooth((LIFT - r.wordY) / 16) * (1 - smooth((t - (TR1 - 0.5)) / 0.5));   // braces as the ground moves
      r.look = 0.5;
    } else if (t < TR1 + 1.7) {
      r.sniff = 1;                                             // sniffs the letters underfoot
    } else if (t < T_INTRO) {
      r.look = -0.2; r.air = 1;                                // lifts the head, scents the air
    } else if (this.idle) {
      const x = (t - this.idle.t0) / this.idle.dur, env = smooth(x * 4) * smooth((1 - x) * 4);
      if (x >= 1) { this.idle = null; this.nextIdle = t + rnd(3.5, 8); }
      else if (this.idle.type === "ground") { if (x < 0.8) r.sniff = 1; }
      else if (this.idle.type === "air") { if (x < 0.8) { r.look = -0.22; r.air = 1; } }
      else if (this.idle.type === "low") { if (x < 0.8) r.look = 0.5; }
      else if (this.idle.type === "shift") r.lean = 7 * env * Math.sin(x * TAU);
      else if (this.idle.type === "paw") r.paw = env;
    } else if (t > this.nextIdle) {
      this.startIdle();
    }
    return r;
  }
  startIdle(type) {
    if (this.t < T_INTRO || this.idle) return;
    let pick = type;
    while (!pick || pick === this.lastIdle) pick = IDLE[Math.floor(Math.random() * IDLE.length)];
    this.lastIdle = pick;
    this.idle = { type: pick, t0: this.t, dur: pick === "paw" ? 1.6 : pick === "shift" ? 2.8 : rnd(2.4, 3.4) };
  }

  step(dt) {
    if (!(dt > 0.0005)) return;
    this.t += dt;
    const t = this.t, sc = this.script(t);
    this.sn += (sc.sniff - this.sn) * (1 - Math.exp(-dt * 5));
    this.lean += (sc.lean - this.lean) * (1 - Math.exp(-dt * 10));
    this.dip += (sc.dip - this.dip) * (1 - Math.exp(-dt * 7));
    this.paw = sc.paw;
    this.air = (this.air || 0) + (sc.air - (this.air || 0)) * (1 - Math.exp(-dt * 5));
    this.fade = clamp(t / 0.7, 0, 1);
    this.wordY = sc.wordY; this.bearY = sc.bearY;
    this.films = this.probe ? 1 : smooth((t - (TR1 - 0.4)) / 0.9);

    /* Body: hips and shoulders, shifted by leaning, bracing and sniffing */
    const Hx = X + this.lean, Hy = GY - HIP + 7 * this.dip;
    const sx0 = X + L + this.lean, sy0 = GY - SHO + 10 * this.sn + 5 * this.dip;
    const ang = Math.atan2(sy0 - Hy, sx0 - Hx), ca = Math.cos(ang), sa = Math.sin(ang);
    const Sx = Hx + ca * L, Sy = Hy + sa * L;
    const loc = (x, y) => [Hx + x * ca - y * sa, Hy + x * sa + y * ca];

    /* Head */
    const N = loc(NECK[0] + 6 * this.sn, NECK[1] + 13 * this.sn);
    let target = ang * 0.8 + 0.23, ext = 0;
    if (sc.look !== null) target = sc.look;
    if (this.sn > 0.02) {
      const dx = Sx + 66 - N[0], dy = GY - 8 - N[1];          // nose reaches down and forward, clear of the front legs
      target = lerp(target, clamp(Math.atan2(dy, dx) - 0.16, -0.9, 0.85), smooth(this.sn));
      ext = clamp(Math.hypot(dx, dy) - NOSE, -3, 8) * this.sn;
    }
    ext += 4 * this.air;
    const w = 9.5;
    this.thV += (w * w * (target - this.th) - 2 * w * this.thV) * dt;
    this.th += this.thV * dt;
    const sniffing = Math.max(smooth((this.sn - 0.4) / 0.5), this.air);
    const th = this.th + sniffing * (0.03 * Math.sin(TAU * 6.5 * t) * (0.55 + 0.45 * Math.sin(TAU * 0.8 * t)) + 0.06 * Math.sin(TAU * 0.42 * t));

    /* Skeleton: body, head, then upper leg, lower leg and paw for each leg. Paws stay where they stand. */
    const sk = [{ x: Hx, y: Hy, a: ang }, { x: N[0] + Math.cos(th) * ext, y: N[1] + Math.sin(th) * ext, a: th }];
    LEGS.forEach((leg, i) => {
      const jx = leg.front ? Sx : Hx, jy = leg.front ? Sy : Hy;
      const len = leg.front ? LEN.front : LEN.hind, l1 = len[0], l2 = len[1];
      const up = i === 3 ? 13 * this.paw : 0, pitch = i === 3 ? 0.45 * this.paw : 0;      // the front paw that lifts now and then
      const tx = Math.cos(pitch), ty = Math.sin(pitch);
      const fx = (leg.front ? X + L : X) + leg.at, fy = GY - up;
      const tax = fx + ty * 10 - tx, tay = fy - tx * 10 - ty;
      const dx = tax - jx, dy = tay - jy, d0 = Math.hypot(dx, dy) || 1;
      const d = clamp(d0, 14, l1 + l2 - 0.4), ux = dx / d0, uy = dy / d0;
      const ax = jx + ux * d, ay = jy + uy * d;
      const al = (l1 * l1 - l2 * l2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, l1 * l1 - al * al));
      const sgn = leg.front ? 1 : -1;
      const kx = jx + ux * al - uy * h * sgn, ky = jy + uy * al + ux * h * sgn;
      sk.push({ x: jx, y: jy, a: Math.atan2(ky - jy, kx - jx) },
              { x: kx, y: ky, a: Math.atan2(ay - ky, ax - kx) },
              { x: ax, y: ay, a: pitch });
    });
    this.sk = sk;
    this.breath = 1 + 0.016 * Math.sin(TAU * 0.28 * t);
  }

  render(stage) {
    const sk = this.sk, skin = this.skin;
    if (!sk || !skin || !this.path) return;
    const n = skin.n, K = skin.K, I = skin.idx, LX = skin.lx, LY = skin.ly, W = skin.w;
    const cs = sk.map(b => Math.cos(b.a)), sn = sk.map(b => Math.sin(b.a));
    const px = new Float32Array(n), py = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      let x = 0, y = 0;
      for (let j = 0; j < K; j++) {
        const q = i * K + j, wgt = W[q];
        if (!wgt) continue;
        const b = I[q], lx = LX[q], ly = b === 0 ? LY[q] * this.breath : LY[q];
        x += wgt * (sk[b].x + lx * cs[b] - ly * sn[b]);
        y += wgt * (sk[b].y + lx * sn[b] + ly * cs[b]);
      }
      px[i] = x; py[i] = y;
    }
    this.px = px; this.py = py;
    let d = "M" + f1((px[n - 1] + px[0]) / 2) + " " + f1((py[n - 1] + py[0]) / 2);
    for (let i = 0; i < n; i++) {
      const k = (i + 1) % n;
      d += "Q" + f1(px[i]) + " " + f1(py[i]) + " " + f1((px[i] + px[k]) / 2) + " " + f1((py[i] + py[k]) / 2);
    }
    this.path.setAttribute("d", d + "Z");
    this.root.setAttribute("opacity", f1(this.fade));
    this.root.setAttribute("transform", "translate(0 " + f1(this.bearY) + ")");
    if (stage) {
      stage.word.setAttribute("transform", "translate(0 " + f1(this.wordY) + ")");
      stage.films.setAttribute("opacity", this.films.toFixed(2));
    }
  }

  advance(seconds) { for (let i = 0, n = Math.round(seconds * 60); i < n; i++) this.step(1 / 60); }
}

/* ---------- Fitting the logo outline to the skeleton ---------- */
function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1;
  const u = clamp(((px - ax) * dx + (py - ay) * dy) / l2, 0, 1);
  return Math.hypot(px - ax - dx * u, py - ay - dy * u);
}
/* Fill the outline out a little for a heavier, chubbier bear. Same height, paws on the same line. */
function plump(P, grow) {
  const n = P.length;
  const blur = Q => Q.map((_, i) => { let x = 0, y = 0; for (let o = -1; o <= 1; o++) { const p = Q[(i + o + n) % n]; x += p[0]; y += p[1]; } return [x / 3, y / 3]; });
  let area = 0, top = 1e9, bottom = -1e9;
  P.forEach((p, i) => { const q = P[(i + 1) % n]; area += p[0] * q[1] - q[0] * p[1]; top = Math.min(top, p[1]); bottom = Math.max(bottom, p[1]); });
  const out = area > 0 ? 1 : -1;
  let Q = P.map((p, i) => {
    const a = P[(i - 3 + n) % n], b = P[(i + 3) % n], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    return [p[0] + out * dy / l * grow, p[1] - out * dx / l * grow];
  });
  Q = blur(Q);
  let lo = 1e9, hi = -1e9, left = 1e9, right = -1e9;
  Q.forEach(p => { lo = Math.min(lo, p[1]); hi = Math.max(hi, p[1]); left = Math.min(left, p[0]); right = Math.max(right, p[0]); });
  const f = (bottom - top) / (hi - lo), cx = (left + right) / 2;
  return Q.map(p => [cx + (p[0] - cx) * f, bottom + (p[1] - hi) * f]);
}
function makeSkin(svg, d, ox, oy, count) {
  /* 1. Trace the outside edge of the logo bear */
  const end = d.search(/z/i);
  const tmp = document.createElementNS(NS, "path");
  tmp.setAttribute("d", end > 0 ? d.slice(0, end + 1) : d);
  svg.appendChild(tmp);
  const total = tmp.getTotalLength(), n = count || 440;
  let P = [];
  for (let i = 0; i < n; i++) { const q = tmp.getPointAtLength(total * i / n); P.push([q.x + ox, q.y + oy]); }
  svg.removeChild(tmp);
  if (PLUMP) P = plump(P, PLUMP);

  /* 2. The skeleton in its standing pose, which matches the logo */
  const probe = new Bear(null, { probe: true });
  probe.advance(1);
  const rest = probe.sk.map(b => ({ x: b.x, y: b.y, a: b.a }));
  const at = (b, x, y) => [rest[b].x + x * Math.cos(rest[b].a) - y * Math.sin(rest[b].a), rest[b].y + x * Math.sin(rest[b].a) + y * Math.cos(rest[b].a)];
  const segs = [[at(0, 0, 0), at(0, L - 14, 0), 36], [at(1, 26, 0), at(1, 60, 9), 22]];
  LEGS.forEach((leg, i) => {
    const b = 2 + i * 3, len = leg.front ? LEN.front : LEN.hind;
    segs.push([at(b, 0, 0), at(b, len[0], 0), 13], [at(b + 1, 0, 0), at(b + 1, len[1], 0), 10], [at(b + 2, -5, 3), at(b + 2, 14, 3), 8]);
  });

  /* 3. Tie each point of the outline to the nearest bones... */
  const K = 4, NB = segs.length;
  const idx = new Uint8Array(n * K), lx = new Float32Array(n * K), ly = new Float32Array(n * K), w = new Float32Array(n * K);
  let raw = P.map(p => {
    const dist = segs.map(s => Math.max(0, segDist(p[0], p[1], s[0][0], s[0][1], s[1][0], s[1][1]) - s[2]));
    let own = 0, best = 1e9;                 // each point may follow the body, the head and one leg only
    for (let b = 2; b < NB; b++) if (dist[b] < best) { best = dist[b]; own = Math.floor((b - 2) / 3); }
    const row = new Float32Array(NB);
    let sum = 0;
    dist.forEach((dd, b) => { if (b < 2 || Math.floor((b - 2) / 3) === own) { row[b] = 1 / Math.pow(dd + 3, 3); sum += row[b]; } });
    for (let b = 0; b < NB; b++) row[b] /= sum;
    return row;
  });
  /* ...then even the ties out along the outline, so joints bend instead of tearing */
  for (let pass = 0; pass < 3; pass++) {
    raw = raw.map((_, i) => {
      const row = new Float32Array(NB);
      for (let o = -4; o <= 4; o++) { const src = raw[(i + o + n) % n]; for (let b = 0; b < NB; b++) row[b] += src[b] / 9; }
      return row;
    });
  }
  P.forEach((p, i) => {
    const sc = Array.from(raw[i], (v, b) => [b, v]).sort((u, v) => v[1] - u[1]);
    const top = sc.slice(0, K), sum = top.reduce((t, e) => t + e[1], 0);
    top.forEach((e, j) => {
      const b = e[0], q = i * K + j, dx = p[0] - rest[b].x, dy = p[1] - rest[b].y, c = Math.cos(rest[b].a), s = Math.sin(rest[b].a);
      idx[q] = b; w[q] = e[1] / sum; lx[q] = dx * c + dy * s; ly[q] = -dx * s + dy * c;
    });
  });
  return { n, K, idx, lx, ly, w };
}

/* ---------- The wordmark: "Amble" starts in the ground and rises ---------- */
function makeStage(group) {
  const svg = group.ownerSVGElement, kids = Array.from(group.children);
  if (!svg || kids.length < 9) return null;                 // expects the four "Amble" shapes, then the five "FILMS" letters
  const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
  const defs = svg.querySelector("defs") || svg.insertBefore(document.createElementNS(NS, "defs"), svg.firstChild);
  const clip = mk("clipPath", { id: "amble-ground" }, defs);
  mk("rect", { x: -600, y: -300, width: 2000, height: 556 }, clip);       // everything above the ground line (y = 256)
  const outer = mk("g", { "clip-path": "url(#amble-ground)" }, group), word = mk("g", {}, outer), films = mk("g", {}, group);
  kids.slice(0, 4).forEach(k => word.appendChild(k));
  kids.slice(4).forEach(k => films.appendChild(k));
  return { word, films };
}

/* ---------- Start it on the page ---------- */
function mount(root, skin, stage) {
  const bear = new Bear(root, { skin });
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    bear.advance(T_INTRO + 0.5); bear.render(stage);
    return bear;
  }
  let last = 0;
  function tick(now) {
    requestAnimationFrame(tick);
    if (document.hidden) { last = 0; return; }
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
    if (dt < 0.002) return;
    last = now;
    bear.step(dt); bear.render(stage);
  }
  bear.step(1 / 60); bear.render(stage);
  requestAnimationFrame(tick);
  return bear;
}

window.AmbleBear = { Bear, mount, makeSkin, makeStage, T_INTRO };

const rig = document.getElementById("bear-rig");
const art = document.querySelector("#amble-bear-art path");
const letters = document.getElementById("amble-letters");
if (rig && art) {
  const m = /translate\(\s*([-\d.]+)[ ,]+([-\d.]+)/.exec(art.getAttribute("transform") || "");
  const skin = makeSkin(rig.ownerSVGElement, art.getAttribute("d"), m ? +m[1] : 0, m ? +m[2] : 0);
  const still = document.getElementById("bear-static");
  if (still) still.style.display = "none";
  const bear = mount(rig, skin, letters ? makeStage(letters) : null);
  const logo = rig.closest(".logo");
  if (logo) logo.addEventListener("pointerenter", () => bear.startIdle(Math.random() < 0.5 ? "ground" : "air"));
}
})();

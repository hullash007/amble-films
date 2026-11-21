/* Amble Films: the walking bear.
   A small jointed bear that walks in from the left, sniffs the foot of the "A",
   climbs over it, settles on top of the wordmark and then idles (breathing,
   sniffing, ear flicks). Everything is drawn in the logo's own coordinates
   (viewBox 0 0 765 344). */
(function () {
"use strict";

const NS = "http://www.w3.org/2000/svg", TAU = Math.PI * 2;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const smooth = x => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
const frac = x => x - Math.floor(x);
const f1 = n => (Math.round(n * 10) / 10).toString();
const rnd = (a, b) => a + Math.random() * (b - a);

/* ---------- The ground: the line the bear walks along ---------- */
const G = [
  [-700, 251], [24, 251],            // the baseline, left of the wordmark
  [41, 227], [92, 91], [101, 80],    // up the left side of the A
  [125, 80], [132, 88], [150, 140],  // across the top of the A and down its right side
  [214, 146], [255, 140], [430, 140] // onto the m and along its top
];
const C = [0];
for (let i = 1; i < G.length; i++) C[i] = C[i - 1] + Math.hypot(G[i][0] - G[i - 1][0], G[i][1] - G[i - 1][1]);
const END = C[C.length - 1];
function pt(a) {
  a = clamp(a, 0, END);
  let i = 0;
  while (i < G.length - 2 && C[i + 1] < a) i++;
  const f = (a - C[i]) / (C[i + 1] - C[i]);
  return [lerp(G[i][0], G[i + 1][0], f), lerp(G[i][1], G[i + 1][1], f)];
}
function frame(a, w) {
  const p = pt(a - w), q = pt(a + w);
  let dx = q[0] - p[0], dy = q[1] - p[1];
  const l = Math.hypot(dx, dy) || 1;
  dx /= l; dy /= l;
  return { x: (p[0] + q[0]) / 2, y: (p[1] + q[1]) / 2, tx: dx, ty: dy, nx: dy, ny: -dx };
}
const arcAt = (seg, x) => C[seg] + (x - G[seg][0]) / (G[seg + 1][0] - G[seg][0]) * (C[seg + 1] - C[seg]);

/* ---------- Proportions ---------- */
const SL = 76;          // distance covered by one full walk cycle
const BETA = 0.75;      // share of the cycle each paw spends on the ground
const L = 84;           // hip to shoulder
const HIP = 62, SHO = 63;
const GAP = [C[7] + 3, C[8] - 3];   // empty space between the A and the m: no paw may land here
const snap = a => (a > GAP[0] && a < GAP[1]) ? (a < (GAP[0] + GAP[1]) / 2 ? GAP[0] - 5 : GAP[1] + 7) : a;

/* ---------- The route ---------- */
const S_END = arcAt(8, 247);            // standing place on the m
const S1 = S_END - Math.round((S_END - arcAt(0, -128)) / SL) * SL;   // first stop, nose at the foot of the A
const S0 = S1 - 133;                    // where the bear appears
const PH0 = 0.515 - frac(S_END / SL);   // lines the gait up so all four paws are down at each stop
const TA = 2.0, TB0 = 4.6;

/* The climb, worked out ahead of time: brisk on the flat, careful over the A, easing to a stop */
const ROUTE = [];
(function () {
  let s = S1, t = 0; const dt = 1 / 120;
  while (s < S_END - 0.02 && t < 30) {
    const care = smooth((s - (C[1] - 70)) / 60) * (1 - smooth((s - C[6]) / 60));
    const v = Math.min(108 * lerp(1, 0.64, care) * smooth(t / 0.8) + 3, Math.sqrt(2 * 80 * (S_END - s)) + 3);
    s = Math.min(S_END, s + v * dt); ROUTE.push(s); t += dt;
  }
})();
const TB1 = TB0 + ROUTE.length / 120, T_INTRO = TB1 + 3.1;

function trap(x, a, b) {                // ease: speed up, hold, slow down
  const area = 1 - a / 2 - b / 2;
  let y;
  if (x < a) y = x * x / (2 * a);
  else if (x < 1 - b) y = a / 2 + (x - a);
  else { const u = 1 - x; y = area - u * u / (2 * b); }
  return clamp(y / area, 0, 1);
}

/* ---------- Shapes ---------- */
function blob(P) {                      // smooth closed outline through points
  const n = P.length;
  let d = "M" + f1(P[0][0]) + " " + f1(P[0][1]);
  for (let i = 0; i < n; i++) {
    const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
    d += "C" + f1(p1[0] + (p2[0] - p0[0]) / 6) + " " + f1(p1[1] + (p2[1] - p0[1]) / 6) + " " +
         f1(p2[0] - (p3[0] - p1[0]) / 6) + " " + f1(p2[1] - (p3[1] - p1[1]) / 6) + " " +
         f1(p2[0]) + " " + f1(p2[1]);
  }
  return d + "Z";
}
const TORSO_D = blob([[-36, -16], [-29, -36], [-8, -45], [25, -46], [52, -50], [74, -58], [94, -53], [108, -36],
                      [113, -10], [106, 11], [86, 20], [45, 22], [10, 20], [-19, 15], [-35, 3]]);
const HEAD_D = blob([[-25, -25], [0, -30], [19, -27], [31, -19], [41, -12], [50, -10], [56, -3], [54, 6],
                     [44, 11], [28, 16], [10, 26], [-14, 27], [-29, 2]]);
const circ = (x, y, r) => "M" + f1(x - r) + " " + f1(y) + "a" + r + " " + r + " 0 1 0 " + (2 * r) + " 0a" + r + " " + r + " 0 1 0 " + (-2 * r) + " 0Z";
function cap(x1, y1, r1, x2, y2, r2) {  // tapered limb segment
  const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy) || 1e-3, nx = -dy / l, ny = dx / l;
  return "M" + f1(x1 + nx * r1) + " " + f1(y1 + ny * r1) + "L" + f1(x2 + nx * r2) + " " + f1(y2 + ny * r2) +
         "L" + f1(x2 - nx * r2) + " " + f1(y2 - ny * r2) + "L" + f1(x1 - nx * r1) + " " + f1(y1 - ny * r1) + "Z" +
         circ(x1, y1, r1) + circ(x2, y2, r2);
}

const LEGS = [
  { front: false, far: true,  ph: 0.50, o: 2 },
  { front: true,  far: true,  ph: 0.72, o: 6 },
  { front: false, far: false, ph: 0.00, o: -4 },
  { front: true,  far: false, ph: 0.22, o: 1 }
];
const IDLE = ["ground", "air", "shift", "paw", "low", "ground", "air"];

class Bear {
  constructor(root, o) {
    o = o || {};
    this.root = root;
    const mk = (tag, attrs, parent) => {
      const e = document.createElementNS(NS, tag);
      for (const k in attrs) e.setAttribute(k, attrs[k]);
      (parent || root).appendChild(e);
      return e;
    };
    const ink = o.ink || "#000", far = o.far || "#3a3733";
    this.eLeg = [mk("path", { fill: far }), mk("path", { fill: far })];
    this.eTail = mk("circle", { r: 6.5, fill: ink });
    this.eHeadFar = mk("g", {});
    mk("ellipse", { cx: 13, cy: -29, rx: 7, ry: 7.5, fill: far }, this.eHeadFar);
    this.eTorso = mk("path", { d: TORSO_D, fill: ink });
    this.eHead = mk("g", {});
    mk("path", { d: HEAD_D, fill: ink }, this.eHead);
    this.eEar = mk("ellipse", { cx: 3, cy: -30, rx: 8, ry: 8.5, fill: ink }, this.eHead);
    this.eEye = mk("ellipse", { cx: 30, cy: -12, rx: 1.9, ry: 1.9, fill: o.eye || "#F3EEE6" }, this.eHead);
    this.eLeg.push(mk("path", { fill: ink }), mk("path", { fill: ink }));

    this.t = 0; this.s = S0; this.af = S0 + L;
    this.walk = 1; this.sn = 0; this.th = 0.25; this.thV = 0; this.look = 0;
    this.ear = 0; this.earV = 0; this.nextEar = 1.2; this.nextBlink = 2.5; this.blink = 0;
    this.lean = 0; this.pawUp = 0; this.fade = 0;
    this.idle = null; this.nextIdle = T_INTRO + 2.5; this.lastIdle = "";
    this.pose = null;
  }

  /* What the bear is doing at time t */
  script(t) {
    const r = { s: S_END, sniff: 0, look: null, air: 0, lean: 0, paw: 0 };
    if (t < TA) {
      r.s = S0 + (S1 - S0) * (1 - Math.pow(1 - t / TA, 1.7));
      if (t > TA - 0.3) r.sniff = 1;
    } else if (t < TB0) {
      r.s = S1;
      if (t - TA < 1.7) r.sniff = 1; else r.look = -0.85;      // sniff the A, then look up it
    } else if (t < TB1) {
      const fi = (t - TB0) * 120, i0 = Math.min(Math.floor(fi), ROUTE.length - 1), before = i0 ? ROUTE[i0 - 1] : S1;
      r.s = before + (ROUTE[i0] - before) * clamp(fi - i0, 0, 1);
      if (t > TB1 - 0.25) r.sniff = 1;
    } else if (t < TB1 + 1.9) {
      r.sniff = 1;                                             // sniff the letters underfoot
    } else if (t < T_INTRO) {
      r.look = -0.4; r.air = 1;                                // lift the head, scent the air
    } else if (this.idle) {
      const x = (t - this.idle.t0) / this.idle.dur, env = smooth(x * 4) * smooth((1 - x) * 4);
      if (x >= 1) { this.idle = null; this.nextIdle = t + rnd(3.5, 8); }
      else if (this.idle.type === "ground") { if (x < 0.8) r.sniff = 1; }
      else if (this.idle.type === "air") { if (x < 0.8) { r.look = -0.48; r.air = 1; } }
      else if (this.idle.type === "low") { if (x < 0.8) r.look = 0.5; }
      else if (this.idle.type === "shift") r.lean = 6 * env * Math.sin(x * TAU);
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
    this.idle = { type: pick, t0: this.t, dur: pick === "paw" ? 1.5 : pick === "shift" ? 2.6 : rnd(2.4, 3.4) };
  }

  footAt(leg, ref) {
    const c = ref / SL + leg.ph + PH0, k = Math.floor(c), p = c - k;
    const base = leg.front ? L + leg.o : leg.o;
    const F = j => snap(SL * (j - leg.ph - PH0) + BETA * SL / 2 + base);
    let arc, lift = 0, pitch = 0;
    if (p < BETA) arc = F(k);
    else {
      const u = (p - BETA) / (1 - BETA), a0 = F(k), a1 = F(k + 1);
      arc = lerp(a0, a1, smooth(u));
      lift = (leg.front ? 13 : 11) * Math.sin(Math.PI * Math.pow(u, 0.85)) * clamp(Math.abs(a1 - a0) / 55, 0.35, 1.7);
      pitch = Math.sin(Math.PI * u) * (1.15 * (1 - u) - 0.5 * u);
    }
    if (leg.front && !leg.far && this.pawUp > 0) { lift += 12 * this.pawUp; pitch += 0.7 * this.pawUp; }
    const f = frame(arc, 5);
    let ux = f.nx * 0.6, uy = f.ny * 0.6 - 0.4;
    const ul = Math.hypot(ux, uy); ux /= ul; uy /= ul;
    const ca = Math.cos(pitch), sa = Math.sin(pitch);
    const tx = f.tx * ca - f.ty * sa, ty = f.tx * sa + f.ty * ca;
    const x = f.x + ux * lift, y = f.y + uy * lift;
    return { x, y, tx, ty, nx: ty, ny: -tx, ax: x + ty * 10 - tx, ay: y - tx * 10 - ty, grip: clamp(1 - lift / 5, 0, 1) };
  }

  step(dt) {
    if (!(dt > 0.0005)) return;
    this.t += dt;
    const t = this.t, sc = this.script(t);
    const v = (sc.s - this.s) / dt;
    this.s = sc.s;
    const k5 = 1 - Math.exp(-dt * 5);
    this.walk += (clamp(Math.abs(v) / 45, 0, 1) - this.walk) * (1 - Math.exp(-dt * 6));
    this.sn += (sc.sniff - this.sn) * k5;
    this.lean += (sc.lean - this.lean) * (1 - Math.exp(-dt * 8));
    this.pawUp = sc.paw;
    this.fade = clamp(t / 0.6, 0, 1);

    /* Body: hips over the hind paws, shoulders found further along the ground */
    const s = this.s, cH = s / SL + PH0;
    const hipH = HIP + this.walk * 2.0 * Math.cos(TAU * 2 * cH);
    const anchor = (a, h) => {            // a point h above the ground, leaning out from slopes
      const f = frame(a, 34), p = frame(a, 10);
      let ux = f.nx * 0.45, uy = f.ny * 0.45 - 0.55; const l = Math.hypot(ux, uy);
      return [p.x + ux / l * h, p.y + uy / l * h];
    };
    const Hp = anchor(s, hipH);
    let Hx = Hp[0], Hy = Hp[1];
    const shoH = SHO - 9 * this.sn + this.walk * 2.4 * Math.cos(TAU * 2 * cH + 1.2);
    const Sof = a => anchor(a, shoH);
    const g = a => { const p = Sof(a); return Math.hypot(p[0] - Hx, p[1] - Hy) - L; };
    let a = this.af, ga = g(a);           // follow the nearest solution so the shoulders never jump
    for (let i = 0; i < 14 && Math.abs(ga) > 0.05; i++) {
      const sl = (g(a + 0.5) - g(a - 0.5));
      a += Math.abs(sl) < 0.06 ? (ga < 0 ? 1 : -1) : clamp(-ga / sl, -2, 2);
      ga = g(a);
    }
    this.af = clamp(a, Math.max(this.af - 7, s + 30), this.af + 7);
    let Sp = Sof(this.af), Sx = Sp[0], Sy = Sp[1];

    /* Paws */
    const feet = LEGS.map(leg => this.footAt(leg, leg.front ? this.af - L : s));

    /* Keep every planted paw within reach of its joint */
    for (let pass = 0; pass < 2; pass++) {
      LEGS.forEach((leg, i) => {
        const ft = feet[i], R = 63;
        const jx = leg.front ? Sx : Hx, jy = leg.front ? Sy : Hy;
        const dx = ft.ax - jx, dy = ft.ay - jy, d = Math.hypot(dx, dy);
        let m = 0;
        if (d > R) m = (d - R) * 0.55 * ft.grip; else if (d < 30) m = (d - 30) * 0.55;
        if (m) { if (leg.front) { Sx += dx / d * m; Sy += dy / d * m; } else { Hx += dx / d * m; Hy += dy / d * m; } }
      });
      const mx = (Hx + Sx) / 2, my = (Hy + Sy) / 2;
      let dx = Sx - Hx, dy = Sy - Hy; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
      Hx = mx - dx * L / 2 + dx * this.lean * (pass ? 0 : 1); Hy = my - dy * L / 2 + dy * this.lean * (pass ? 0 : 1);
      Sx = Hx + dx * L; Sy = Hy + dy * L;
    }
    const ang0 = Math.atan2(Sy - Hy, Sx - Hx);
    if (this.fH) {                        // a little inertia, so the body never snaps
      const kf = 1 - Math.exp(-dt * 15);
      this.fH[0] += (Hx - this.fH[0]) * kf; this.fH[1] += (Hy - this.fH[1]) * kf; this.fA += (ang0 - this.fA) * kf;
    } else { this.fH = [Hx, Hy]; this.fA = ang0; }
    Hx = this.fH[0]; Hy = this.fH[1];
    const ang = this.fA, ca = Math.cos(ang), sa = Math.sin(ang);
    Sx = Hx + ca * L; Sy = Hy + sa * L;
    const loc = (x, y) => [Hx + x * ca - y * sa, Hy + x * sa + y * ca];

    /* Head */
    const N = loc(95 + 6 * this.sn, -27 + 12 * this.sn);
    let target = ang * 0.55 + 0.24 + this.walk * 0.05 * Math.sin(TAU * 2 * cH + 0.6), ext = 0;
    if (sc.look !== null) target = sc.look;
    if (this.sn > 0.02) {
      const tp = pt(this.af + 54), dx = tp[0] - N[0], dy = tp[1] - 5 - N[1];
      const down = clamp(Math.atan2(dy, dx), -0.9, 1.2);
      target = lerp(target, down, smooth(this.sn));
      ext = clamp(Math.hypot(dx, dy) - 56, -3, 9) * this.sn;
    }
    if (sc.air) ext = 4;
    const w = 9.5;
    this.thV += (w * w * (target - this.th) - 2 * w * this.thV) * dt;
    this.th += this.thV * dt;
    const sniffing = Math.max(this.sn > 0.6 ? this.sn : 0, sc.air);
    const jit = sniffing * (0.03 * Math.sin(TAU * 6.5 * t) * (0.55 + 0.45 * Math.sin(TAU * 0.8 * t)) + 0.06 * Math.sin(TAU * 0.42 * t));

    /* Ears and eyes */
    if (t > this.nextEar) { this.earV -= rnd(9, 15); this.nextEar = t + rnd(1.4, 5); }
    this.earV += (-260 * this.ear - 22 * this.earV) * dt;
    this.ear += this.earV * dt;
    if (t > this.nextBlink) { this.blink = 0.16; this.nextBlink = t + rnd(2.2, 6); }
    this.blink = Math.max(0, this.blink - dt);

    /* Legs */
    const legD = LEGS.map((leg, i) => {
      const ft = feet[i], jx = leg.front ? Sx : Hx, jy = leg.front ? Sy : Hy;
      const l1 = leg.front ? 34 : 35, l2 = leg.front ? 33 : 32;
      let dx = ft.ax - jx, dy = ft.ay - jy, d0 = Math.hypot(dx, dy) || 1;
      const d = clamp(d0, 8, l1 + l2 - 0.4), ux = dx / d0, uy = dy / d0;
      const ox = jx + ux * d - ft.ax, oy = jy + uy * d - ft.ay;          // if out of reach, the paw follows the leg
      const ax = ft.ax + ox, ay = ft.ay + oy, a = (l1 * l1 - l2 * l2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
      const sgn = leg.front ? 1 : -1;
      const kx = jx + ux * a - uy * h * sgn, ky = jy + uy * a + ux * h * sgn;
      const px = ft.x + ox + ft.nx * 6.5, py = ft.y + oy + ft.ny * 6.5, toe = leg.front ? 12 : 13;
      const r = leg.front ? [20, 12.5, 9.5] : [23, 14, 10];
      return cap(jx, jy, r[0], kx, ky, r[1]) + cap(kx, ky, r[1], ax, ay, r[2]) +
             cap(px - ft.tx * 5, py - ft.ty * 5, 6.5, px + ft.tx * toe, py + ft.ty * toe, 6);
    });

    this.pose = { Hx, Hy, ang, N, th: this.th + jit, ext, legD, tail: loc(-36, -22), breath: 1 + 0.014 * Math.sin(TAU * 0.28 * t) * (1 - this.walk) };
  }

  render() {
    const p = this.pose; if (!p) return;
    const deg = 180 / Math.PI;
    this.root.setAttribute("opacity", f1(this.fade));
    this.eTorso.setAttribute("transform", "translate(" + f1(p.Hx) + " " + f1(p.Hy) + ") rotate(" + f1(p.ang * deg) + ") scale(1 " + p.breath.toFixed(3) + ")");
    this.eTail.setAttribute("cx", f1(p.tail[0])); this.eTail.setAttribute("cy", f1(p.tail[1]));
    this.eHead.setAttribute("transform", "translate(" + f1(p.N[0]) + " " + f1(p.N[1]) + ") rotate(" + f1(p.th * deg) + ") translate(" + f1(p.ext) + " 0)");
    this.eHeadFar.setAttribute("transform", this.eHead.getAttribute("transform"));
    this.eEar.setAttribute("transform", "rotate(" + f1(this.ear * deg) + " 3 -22)");
    this.eEye.setAttribute("ry", this.blink > 0 ? "0.3" : "1.9");
    for (let i = 0; i < 4; i++) this.eLeg[i].setAttribute("d", p.legD[i]);
  }

  advance(seconds) { for (let i = 0, n = Math.round(seconds * 60); i < n; i++) this.step(1 / 60); }
}

/* ---------- Start it on the page ---------- */
function mount(root, opts) {
  const bear = new Bear(root, opts);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    bear.advance(T_INTRO + 0.5); bear.render();
    return bear;
  }
  let last = 0;
  function tick(now) {
    requestAnimationFrame(tick);
    if (document.hidden) { last = 0; return; }
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
    if (dt < 0.002) return;
    last = now;
    bear.step(dt); bear.render();
  }
  bear.step(1 / 60); bear.render();
  requestAnimationFrame(tick);
  return bear;
}

window.AmbleBear = { Bear, mount, T_INTRO };

const rig = document.getElementById("bear-rig");
if (rig) {
  const still = document.getElementById("bear-static");
  if (still) still.style.display = "none";
  const bear = mount(rig, {});
  const logo = rig.closest(".logo");
  if (logo) logo.addEventListener("pointerenter", () => bear.startIdle(Math.random() < 0.5 ? "ground" : "air"));
}
})();

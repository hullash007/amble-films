/* Amble Films: the walking bear.
   The bear is the outline from the Amble Films logo itself, filled solid and
   moved by a small skeleton (body, head, four two-part legs and paws), so it
   bends as one continuous shape. It walks in from the left, sniffs the foot of
   the "A", climbs over it, settles on top of the wordmark and then idles.
   All positions are in the logo's own coordinates (viewBox 0 0 765 344). */
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
  [125, 80], [132, 88], [152, 138],  // across the top of the A and down its right side
  [210, 138], [430, 138]             // onto the m and along its top
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

/* ---------- Proportions, measured from the logo bear ---------- */
const SL = 96;          // distance covered by one full walk cycle
const BETA = 0.75;      // share of the cycle each paw spends on the ground
const L = 120;          // hip to shoulder
const HIP = 70, SHO = 74;
const NECK = [112, -30], NOSE = 69;
const LEN = { hind: [36, 34], front: [38, 36] };
const GAP = [C[7] + 3, C[8] - 3];   // empty space between the A and the m: no paw may land here
const snap = a => (a > GAP[0] && a < GAP[1]) ? (a < (GAP[0] + GAP[1]) / 2 ? GAP[0] - 5 : GAP[1] + 7) : a;

/* ---------- The route ---------- */
const S_END = arcAt(8, 235.4);          // standing place on the m, matching the logo
const S1 = S_END - Math.round((S_END - arcAt(0, -168)) / SL) * SL;   // first stop, nose at the foot of the A
const S0 = S1 - 1.25 * SL;              // where the bear appears
const PH0 = 0.515 - frac(S_END / SL);   // lines the gait up so all four paws are down at each stop
const TA = 2.0, TB0 = 4.6;

/* The climb, worked out ahead of time: brisk on the flat, careful over the A, easing to a stop */
const ROUTE = [];
(function () {
  let s = S1, t = 0; const dt = 1 / 120;
  while (s < S_END - 0.02 && t < 30) {
    const care = smooth((s - (C[1] - 110)) / 70) * (1 - smooth((s - C[6]) / 70));
    const v = Math.min(112 * lerp(1, 0.66, care) * smooth(t / 0.8) + 3, Math.sqrt(2 * 80 * (S_END - s)) + 3);
    s = Math.min(S_END, s + v * dt); ROUTE.push(s); t += dt;
  }
})();
const TB1 = TB0 + ROUTE.length / 120, T_INTRO = TB1 + 3.1;

const LEGS = [
  { front: false, ph: 0.00 },   // hind, set back when standing
  { front: false, ph: 0.50 },   // hind, set forward
  { front: true,  ph: 0.22 },   // front, set back
  { front: true,  ph: 0.72 }    // front, set forward
];
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
    this.t = 0; this.s = this.probe ? S_END : S0; this.af = this.s + L;
    this.walk = this.probe ? 0 : 1; this.sn = 0; this.th = 0.23; this.thV = 0;
    this.lean = 0; this.pawUp = 0; this.fade = 0;
    this.idle = null; this.nextIdle = T_INTRO + 2.5; this.lastIdle = "";
    this.sk = null; this.breath = 1;
  }

  /* What the bear is doing at time t */
  script(t) {
    const r = { s: S_END, sniff: 0, look: null, air: 0, lean: 0, paw: 0 };
    if (this.probe) return r;
    if (t < TA) {
      r.s = S0 + (S1 - S0) * (1 - Math.pow(1 - t / TA, 1.7));
      if (t > TA - 0.3) r.sniff = 1;
    } else if (t < TB0) {
      r.s = S1;
      if (t - TA < 1.7) r.sniff = 1; else r.look = -0.42;      // sniff the A, then look up it
    } else if (t < TB1) {
      const fi = (t - TB0) * 120, i0 = Math.min(Math.floor(fi), ROUTE.length - 1), before = i0 ? ROUTE[i0 - 1] : S1;
      r.s = before + (ROUTE[i0] - before) * clamp(fi - i0, 0, 1);
      if (t > TB1 - 0.25) r.sniff = 1;
    } else if (t < TB1 + 1.9) {
      r.sniff = 1;                                             // sniff the letters underfoot
    } else if (t < T_INTRO) {
      r.look = -0.2; r.air = 1;                                // lift the head, scent the air
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

  footAt(leg, i, ref) {
    const c = ref / SL + leg.ph + PH0, k = Math.floor(c), p = c - k;
    const base = leg.front ? L : 0;
    const F = j => snap(SL * (j - leg.ph - PH0) + BETA * SL / 2 + base);
    let arc, lift = 0, pitch = 0;
    if (p < BETA) arc = F(k);
    else {
      const u = (p - BETA) / (1 - BETA), a0 = F(k), a1 = F(k + 1);
      arc = lerp(a0, a1, smooth(u));
      lift = (leg.front ? 15 : 13) * Math.sin(Math.PI * Math.pow(u, 0.85)) * clamp(Math.abs(a1 - a0) / 70, 0.35, 1.7);
      pitch = Math.sin(Math.PI * u) * (0.7 * (1 - u) - 0.3 * u);
    }
    if (i === 3 && this.pawUp > 0) { lift += 13 * this.pawUp; pitch += 0.5 * this.pawUp; }
    const f = frame(arc, 5);
    let ux = f.nx * 0.6, uy = f.ny * 0.6 - 0.4;
    const ul = Math.hypot(ux, uy); ux /= ul; uy /= ul;
    const ca = Math.cos(pitch), sa = Math.sin(pitch);
    const tx = f.tx * ca - f.ty * sa, ty = f.tx * sa + f.ty * ca;
    const x = f.x + ux * lift, y = f.y + uy * lift;
    return { tx, ty, ax: x + ty * 10 - tx, ay: y - tx * 10 - ty, grip: clamp(1 - lift / 5, 0, 1) };
  }

  step(dt) {
    if (!(dt > 0.0005)) return;
    this.t += dt;
    const t = this.t, sc = this.script(t);
    const v = (sc.s - this.s) / dt;
    this.s = sc.s;
    this.walk += (clamp(Math.abs(v) / 45, 0, 1) - this.walk) * (1 - Math.exp(-dt * 6));
    this.sn += (sc.sniff - this.sn) * (1 - Math.exp(-dt * 5));
    this.lean += (sc.lean - this.lean) * (1 - Math.exp(-dt * 8));
    this.pawUp = sc.paw;
    this.fade = clamp(t / 0.6, 0, 1);

    /* Body: hips over the hind paws, shoulders found further along the ground */
    const s = this.s, cH = s / SL + PH0;
    const hipH = HIP + this.walk * 2.4 * Math.cos(TAU * 2 * cH);
    const anchor = (a, h) => {            // a point h above the ground, leaning out from slopes
      const f = frame(a, 34), p = frame(a, 10);
      let ux = f.nx * 0.45, uy = f.ny * 0.45 - 0.55; const l = Math.hypot(ux, uy);
      return [p.x + ux / l * h, p.y + uy / l * h];
    };
    const Hp = anchor(s, hipH);
    let Hx = Hp[0], Hy = Hp[1];
    const shoH = SHO - 10 * this.sn + this.walk * 2.8 * Math.cos(TAU * 2 * cH + 1.2);
    const g = a => { const p = anchor(a, shoH); return Math.hypot(p[0] - Hx, p[1] - Hy) - L; };
    let a = this.af, ga = g(a);           // follow the nearest solution so the shoulders never jump
    for (let i = 0; i < 14 && Math.abs(ga) > 0.05; i++) {
      const sl = (g(a + 0.5) - g(a - 0.5));
      a += Math.abs(sl) < 0.06 ? (ga < 0 ? 1 : -1) : clamp(-ga / sl, -2, 2);
      ga = g(a);
    }
    this.af = clamp(a, Math.max(this.af - 7, s + 40), this.af + 7);
    const Sp = anchor(this.af, shoH);
    let Sx = Sp[0], Sy = Sp[1];

    /* Paws */
    const feet = LEGS.map((leg, i) => this.footAt(leg, i, leg.front ? this.af - L : s));

    /* Keep every planted paw within reach of its joint */
    for (let pass = 0; pass < 2; pass++) {
      LEGS.forEach((leg, i) => {
        const ft = feet[i], len = leg.front ? LEN.front : LEN.hind, R = len[0] + len[1] - 2;
        const jx = leg.front ? Sx : Hx, jy = leg.front ? Sy : Hy;
        const dx = ft.ax - jx, dy = ft.ay - jy, d = Math.hypot(dx, dy);
        let m = 0;
        if (d > R) m = (d - R) * 0.55 * ft.grip; else if (d < 34) m = (d - 34) * 0.55;
        if (m) { if (leg.front) { Sx += dx / d * m; Sy += dy / d * m; } else { Hx += dx / d * m; Hy += dy / d * m; } }
      });
      const mx = (Hx + Sx) / 2, my = (Hy + Sy) / 2;
      let dx = Sx - Hx, dy = Sy - Hy; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
      const ln = pass ? 0 : this.lean;
      Hx = mx - dx * L / 2 + dx * ln; Hy = my - dy * L / 2 + dy * ln;
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
    const N = loc(NECK[0] + 6 * this.sn, NECK[1] + 13 * this.sn);
    let target = ang * 0.55 + 0.23 + this.walk * 0.05 * Math.sin(TAU * 2 * cH + 0.6), ext = 0;
    if (sc.look !== null) target = sc.look;
    if (this.sn > 0.02) {
      const tp = pt(this.af + 46), dx = tp[0] - N[0], dy = tp[1] - 6 - N[1];
      target = lerp(target, clamp(Math.atan2(dy, dx) - 0.16, -0.9, 1.0), smooth(this.sn));
      ext = clamp(Math.hypot(dx, dy) - NOSE, -3, 8) * this.sn;
    }
    if (sc.air) ext = 4;
    const w = 9.5;
    this.thV += (w * w * (target - this.th) - 2 * w * this.thV) * dt;
    this.th += this.thV * dt;
    const sniffing = Math.max(this.sn > 0.6 ? this.sn : 0, sc.air);
    const th = this.th + sniffing * (0.03 * Math.sin(TAU * 6.5 * t) * (0.55 + 0.45 * Math.sin(TAU * 0.8 * t)) + 0.06 * Math.sin(TAU * 0.42 * t));

    /* Skeleton: body, head, then upper leg, lower leg and paw for each leg */
    const sk = [{ x: Hx, y: Hy, a: ang }, { x: N[0] + Math.cos(th) * ext, y: N[1] + Math.sin(th) * ext, a: th }];
    LEGS.forEach((leg, i) => {
      const ft = feet[i], jx = leg.front ? Sx : Hx, jy = leg.front ? Sy : Hy;
      const len = leg.front ? LEN.front : LEN.hind, l1 = len[0], l2 = len[1];
      const dx = ft.ax - jx, dy = ft.ay - jy, d0 = Math.hypot(dx, dy) || 1;
      const d = clamp(d0, 0.62 * (l1 + l2), l1 + l2 - 0.4), ux = dx / d0, uy = dy / d0;   // never fold a leg up tight
      const ax = jx + ux * d, ay = jy + uy * d;                 // if out of reach, the paw follows the leg
      const al = (l1 * l1 - l2 * l2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, l1 * l1 - al * al));
      const sgn = leg.front ? 1 : -1;
      const kx = jx + ux * al - uy * h * sgn, ky = jy + uy * al + ux * h * sgn;
      const lowA = Math.atan2(ay - ky, ax - kx), over = clamp((d0 - (l1 + l2 - 0.4)) / 14, 0, 1);
      sk.push({ x: jx, y: jy, a: Math.atan2(ky - jy, kx - jx) },
              { x: kx, y: ky, a: lowA },
              { x: ax, y: ay, a: lerp(Math.atan2(ft.ty, ft.tx), lowA - 1.45, over) });   // a trailing paw hangs from the leg
    });
    this.sk = sk;
    this.breath = 1 + 0.016 * Math.sin(TAU * 0.28 * t) * (1 - this.walk);
  }

  render() {
    const sk = this.sk, skin = this.skin;
    if (!sk || !skin || !this.path) return;
    const n = skin.n, K = skin.K, I = skin.idx, X = skin.lx, Y = skin.ly, W = skin.w;
    const cs = sk.map(b => Math.cos(b.a)), sn = sk.map(b => Math.sin(b.a));
    const px = new Float32Array(n), py = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      let x = 0, y = 0;
      for (let j = 0; j < K; j++) {
        const q = i * K + j, wgt = W[q];
        if (!wgt) continue;
        const b = I[q], lx = X[q], ly = b === 0 ? Y[q] * this.breath : Y[q];
        x += wgt * (sk[b].x + lx * cs[b] - ly * sn[b]);
        y += wgt * (sk[b].y + lx * sn[b] + ly * cs[b]);
      }
      px[i] = x; py[i] = y;
    }
    let d = "M" + f1((px[n - 1] + px[0]) / 2) + " " + f1((py[n - 1] + py[0]) / 2);
    for (let i = 0; i < n; i++) {
      const k = (i + 1) % n;
      d += "Q" + f1(px[i]) + " " + f1(py[i]) + " " + f1((px[i] + px[k]) / 2) + " " + f1((py[i] + py[k]) / 2);
    }
    this.path.setAttribute("d", d + "Z");
    this.root.setAttribute("opacity", f1(this.fade));
  }

  advance(seconds) { for (let i = 0, n = Math.round(seconds * 60); i < n; i++) this.step(1 / 60); }
}

/* ---------- Fitting the logo outline to the skeleton ---------- */
function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1;
  const u = clamp(((px - ax) * dx + (py - ay) * dy) / l2, 0, 1);
  return Math.hypot(px - ax - dx * u, py - ay - dy * u);
}
function makeSkin(svg, d, ox, oy, count) {
  /* 1. Trace the outside edge of the logo bear */
  const end = d.search(/z/i);
  const tmp = document.createElementNS(NS, "path");
  tmp.setAttribute("d", end > 0 ? d.slice(0, end + 1) : d);
  svg.appendChild(tmp);
  const total = tmp.getTotalLength(), n = count || 440, P = [];
  for (let i = 0; i < n; i++) { const q = tmp.getPointAtLength(total * i / n); P.push([q.x + ox, q.y + oy]); }
  svg.removeChild(tmp);

  /* 2. The skeleton in its standing pose, which matches the logo */
  const probe = new Bear(null, { probe: true });
  probe.advance(2);
  const rest = probe.sk.map(b => ({ x: b.x, y: b.y, a: b.a }));
  const at = (b, x, y) => [rest[b].x + x * Math.cos(rest[b].a) - y * Math.sin(rest[b].a), rest[b].y + x * Math.sin(rest[b].a) + y * Math.cos(rest[b].a)];
  const segs = [[at(0, 0, 0), at(0, L - 14, 0), 36], [at(1, 26, 0), at(1, 60, 9), 22]];
  LEGS.forEach((leg, i) => {
    const b = 2 + i * 3, len = leg.front ? LEN.front : LEN.hind;
    segs.push([at(b, 0, 0), at(b, len[0], 0), 13], [at(b + 1, 0, 0), at(b + 1, len[1], 0), 10], [at(b + 2, -5, 3), at(b + 2, 14, 3), 8]);
  });

  /* 3. Tie each point of the outline to the nearest bones */
  const K = 4, NB = segs.length;
  const idx = new Uint8Array(n * K), lx = new Float32Array(n * K), ly = new Float32Array(n * K), w = new Float32Array(n * K);
  let raw = P.map(p => {
    const dist = segs.map(s => Math.max(0, segDist(p[0], p[1], s[0][0], s[0][1], s[1][0], s[1][1]) - s[2]));
    let own = 0, best = 1e9;                 // each point may follow the body, the head and one leg only
    for (let b = 2; b < segs.length; b++) if (dist[b] < best) { best = dist[b]; own = Math.floor((b - 2) / 3); }
    const sc = [];
    dist.forEach((dd, b) => { if (b < 2 || Math.floor((b - 2) / 3) === own) sc.push([b, 1 / Math.pow(dd + 3, 3)]); });
    const row = new Float32Array(NB), sum = sc.reduce((t, e) => t + e[1], 0);
    sc.forEach(e => { row[e[0]] = e[1] / sum; });
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
  return { n, K, idx, lx, ly, w, rest, segs, points: P };
}

/* ---------- Start it on the page ---------- */
function mount(root, skin, opts) {
  const bear = new Bear(root, Object.assign({ skin }, opts || {}));
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

window.AmbleBear = { Bear, mount, makeSkin, T_INTRO };

const rig = document.getElementById("bear-rig");
const art = document.querySelector("#amble-bear-art path");
if (rig && art) {
  const m = /translate\(\s*([-\d.]+)[ ,]+([-\d.]+)/.exec(art.getAttribute("transform") || "");
  const skin = makeSkin(rig.ownerSVGElement, art.getAttribute("d"), m ? +m[1] : 0, m ? +m[2] : 0);
  const still = document.getElementById("bear-static");
  if (still) still.style.display = "none";
  const bear = mount(rig, skin);
  const logo = rig.closest(".logo");
  if (logo) logo.addEventListener("pointerenter", () => bear.startIdle(Math.random() < 0.5 ? "ground" : "air"));
}
})();

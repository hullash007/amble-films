/* Amble Films: the living bear.
   The bear is the outline from the Amble Films logo itself, filled solid and
   moved by a small skeleton (body, head, four two-part legs and paws), so it
   bends as one continuous shape.

   Its paws stay planted most of the time, which keeps its legs in their natural
   logo shape. Now and then it takes a few small steps along the letter and back,
   one paw at a time, so its legs never pass each other.
   The logo is whole from the first frame and the bear starts already standing on
   the word. It is never still: it works through a long, shuffled round of activities
   (sniffing along the letters, scenting the air, watching the distance,
   stretching, sitting, dozing, shaking out its coat and more). A round lasts
   about two and a half minutes and is ordered and timed afresh each time, so
   it does not read as a loop.

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
const T_SNIFF = 0.9, TR0 = 2.5, TR1 = 4.8;   // the "m" rises under the bear
const TA0 = TR1 + 0.5, TA1 = TA0 + 1.4;      // then the "A" comes up beside it
const T_INTRO = TA1 + 2.2;

/* ---------- The routine: what the bear does once it is standing on the word ---------- */
/* How long each activity lasts, in seconds (shortest, longest). */
const ACTS = {
  ground:  [5, 8],      // nose down, sniffing slowly along the letter underfoot
  air:     [4.5, 7],    // head up, scenting the air
  survey:  [6, 9],      // a slow look up and then down, as if following something far away
  sway:    [5, 7],      // rocks its weight forward and back
  stretch: [6, 8],      // back and low with the head down, then forward with the head up
  shake:   [1.6, 2.2],  // a quick shake of the coat (only ever follows a doze or a stretch)
  alert:   [3.5, 5],    // head comes up and holds quite still, listening
  sigh:    [4, 5.5],    // one deep breath, then the head sinks a little
  doze:    [8, 12],     // head sinks, slow heavy breathing, then a small start awake
  peer:    [4.5, 6.5],  // leans out and looks down over the front of the letter
  shuffle: [3, 4.5],    // shifts its weight from paw to paw
  sit:     [9, 13],     // lowers its haunches, sits and looks about, then stands again
  pace:    [0, 0]       // a few steps forward along the letter, a look about, and back (it keeps its own time, see below)
};
/* One round. It is shuffled before every pass, and no activity follows itself. */
const ROUND = ["ground", "air", "pace", "survey", "sit", "pace", "ground", "stretch", "alert", "pace", "sigh", "peer",
               "air", "pace", "shuffle", "doze", "survey", "pace", "ground", "sway", "air", "alert", "pace", "peer", "shuffle"];
/* Every bear (header, menu, footer) opens the same way: a breath of air, then a walk along the letter */
const OPENER = ["air", "pace"];

/* ---------- The few steps it takes along the letter ---------- */
const STEP = 12;              // how far each paw steps (kept short, so its nose stays clear of the "b")
const PACES = 2;              // how many times all four paws step on the way out (and again on the way back)
const PACE_TIME = 1.7;        // seconds for all four paws to step once
const TURN = [1, 3, 0, 2];    // which quarter of that time each paw steps in: the rear front paw first, then the rear hind paw, then the other two
function newRound(last) {
  for (let tries = 0; tries < 80; tries++) {
    const r = ROUND.slice();
    for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)), s = r[i]; r[i] = r[j]; r[j] = s; }
    if (r[0] !== last && r.every((v, i) => i === 0 || v !== r[i - 1])) return r;
  }
  return ROUND.slice();
}

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
    this.reach = 0; this.swell = 0; this.deep = 0; this.sit = 0; this.bph = 0;
    this.act = null; this.queue = []; this.nextAct = T_INTRO + 0.6; this.lastAct = "air";
    this.ox = 0;                                                             // how far along the letter it has stepped
    this.legs = LEGS.map(l => ({ at: l.at, up: 0, pitch: 0 }));              // where each paw is, how high it is lifted and how it is tilted
    this.sk = null; this.breath = 1;
    this.wordY = 0; this.aY = 0; this.bearY = 0; this.films = 1;
  }

  /* What is happening at time t */
  script(t) {
    const r = { sniff: 0, look: null, air: 0, lean: 0, dip: 0, paw: 0, wordY: 0, aY: 0, bearY: 0,
                reach: 0, jit: 0, wob: 0, swell: 0, deep: 0, sit: 0, still: 0 };
    if (this.probe) return r;
    r.aY = t < TA0 ? SINK : SINK * (1 - smooth((t - TA0) / (TA1 - TA0)));
    if (t < TR0) {                                             // standing on the ground, nose down
      r.wordY = SINK; r.bearY = LIFT;
      if (t > T_SNIFF && t < TR0 - 0.3) r.sniff = 1;
    } else if (t < TR1) {                                      // the word comes up and lifts the bear
      r.wordY = SINK * (1 - smooth((t - TR0) / (TR1 - TR0)));
      r.bearY = Math.min(r.wordY, LIFT);
      r.dip = smooth((LIFT - r.wordY) / 16) * (1 - smooth((t - (TR1 - 0.5)) / 0.5));   // braces as the ground moves
      r.look = 0.4;
    } else if (t < TA1 + 0.6) {
      r.sniff = 1;                                             // sniffs the letter underfoot while the A arrives
    } else if (t < T_INTRO) {
      r.look = 0.08; r.air = 1;                                // lifts the head a little, scents the air
    } else {                                                   // the routine: one activity after another, with only a short breath between
      if (!this.act && t >= this.nextAct) this.begin();
      if (this.act) {
        const a = this.act, x = (t - a.t0) / a.dur;
        if (a.type === "pace") { if (this.pace(a, t - a.t0, r)) { this.act = null; this.nextAct = t + rnd(0.7, 2.2); } }
        else if (x < 1) this.perform(a, x, t, r);
        else {
          if ((a.type === "doze" && Math.random() < 0.75) || (a.type === "stretch" && Math.random() < 0.35)) this.queue.unshift("shake");
          this.act = null; this.nextAct = t + rnd(0.7, 2.2);
        }
      }
    }
    return r;
  }
  /* Start the next activity in the round, or a named one */
  begin(type) {
    if (!type && !this.queue.length) this.queue = newRound(this.lastAct);
    const name = type || this.queue.shift(), d = ACTS[name];
    this.lastAct = name;
    this.act = { type: name, t0: this.t, dur: rnd(d[0], d[1]), a: Math.random(), b: Math.random(),     // a and b make each performance a little different
                 pause: rnd(2.4, 4.2) };                                                                // how long it stops at the far end of its few steps
  }
  /* Something caught its attention (the pointer came near): it looks up and listens */
  notice() {
    if (this.t > T_INTRO && !(this.act && (this.act.type === "alert" || this.act.type === "sit" || this.act.type === "pace"))) this.begin("alert");
  }
  /* What each activity asks of the body at the point x (0 to 1) through it */
  perform(a, x, t, r) {
    const env = smooth(x * 5) * smooth((1 - x) * 5), PI = Math.PI;
    switch (a.type) {
      case "ground":
        if (x < 0.9) r.sniff = 1;
        r.reach = (6 + 8 * a.a) * env * Math.sin(x * TAU * (1 + Math.round(a.b)));
        break;
      case "air":
        if (x < 0.88) { r.look = 0.08 - 0.16 * a.a * Math.sin(x * PI); r.air = 1; }
        break;
      case "survey":
        r.look = 0.2 - (0.14 + 0.06 * a.a) * env * Math.sin(x * TAU);
        break;
      case "sway":
        r.lean = (5.5 + 3 * a.a) * env * Math.sin(x * TAU * 2);
        break;
      case "stretch": {
        const back = smooth(x / 0.18) * smooth((0.52 - x) / 0.14), fwd = smooth((x - 0.5) / 0.16) * smooth((1 - x) / 0.2);
        r.lean = -9 * back + 7 * fwd; r.dip = 0.9 * back; r.sniff = 0.55 * back;
        if (fwd > 0.05) r.look = lerp(0.2, 0.02, fwd);
        break;
      }
      case "shake":
        r.jit = 2.6 * env * Math.sin(t * TAU * 6.5); r.wob = 0.075 * env * Math.sin(t * TAU * 6.5 + 1.2); r.dip = 0.25 * env;
        break;
      case "alert":
        if (x < 0.85) { r.look = -0.02 - 0.05 * a.a; r.still = 1; }
        break;
      case "sigh":
        r.swell = Math.sin(x * PI);
        r.look = 0.2 + 0.1 * smooth((x - 0.5) / 0.25) * smooth((1 - x) / 0.2);
        break;
      case "doze":
        if (x < 0.86) { const down = smooth(x / 0.25); r.look = 0.2 + 0.3 * down; r.deep = smooth(x / 0.3); r.dip = 0.45 * down; }
        else r.look = 0.02;
        break;
      case "peer":
        if (x < 0.88) r.sniff = 1;
        r.lean = 7 * env; r.reach = 15 * env;
        break;
      case "shuffle":
        r.lean = 3.5 * env * Math.sin(x * TAU * 3); r.dip = 0.2 * env * Math.abs(Math.sin(x * TAU * 3));
        break;
      case "sit": {
        const s = smooth(x / 0.16) * smooth((1 - x) / 0.14);
        r.sit = s; r.look = 0.1 - 0.1 * s * Math.sin(x * TAU * 1.5);
        break;
      }
    }
  }

  /* A few steps forward along the letter, a look about, and the same steps back to where it stood.
     e is the time since it set off, in seconds. Returns true when it is home. */
  pace(a, e, r) {
    const walk = PACES * PACE_TIME, t1 = walk, t2 = t1 + a.pause, t3 = t2 + walk;
    const ease = x => x - 0.25 * Math.sin(TAU * x) / TAU;                    // a little slower into the first step and out of the last
    if (e < t1) this.tread(PACES * ease(e / walk), r);
    else if (e < t2) {
      this.tread(PACES, r);
      const x = (e - t1) / a.pause;
      if (x > 0.1 && x < 0.85) { r.look = 0.07 - 0.08 * a.a * Math.sin(x * Math.PI); r.air = a.b < 0.5 ? 1 : 0; }   // head up: it looks ahead, and sometimes scents the air
    }
    else if (e < t3) this.tread(PACES * ease(1 - (e - t2) / walk), r);         // the same steps, taken backwards
    else { this.tread(0, r); return true; }
    return false;
  }
  /* Places the paws when the bear is g rounds of steps along (g may be a fraction) and moves the body with them.
     The paws step one at a time. A paw on the ground stays exactly where it was put down while the body moves
     over it, so nothing slides, and the rear paw of each pair never reaches the front one, so the legs never cross. */
  tread(g, r) {
    const u = g - Math.floor(g);
    this.ox = STEP * g;
    this.legs.forEach((foot, i) => {
      const q = clamp(u * 4 - TURN[i], 0, 1), s = Math.sin(Math.PI * q), lift = s * s;
      foot.at = LEGS[i].at + STEP * (smooth(q) - u); foot.up = 8 * lift; foot.pitch = 0.2 * lift;
    });
    const beat = Math.sin(Math.PI * (u * 4 - Math.floor(u * 4)));
    if (u > 0) { r.dip = 0.14 * beat * beat; r.wob = 0.02 * Math.sin(TAU * u * 4); }                 // the body dips and the head nods a little with each step
  }

  step(dt) {
    if (!(dt > 0.0005)) return;
    this.t += dt;
    const t = this.t, sc = this.script(t);
    this.sn += (sc.sniff - this.sn) * (1 - Math.exp(-dt * 5));
    this.lean += (sc.lean - this.lean) * (1 - Math.exp(-dt * 10));
    this.dip += (sc.dip - this.dip) * (1 - Math.exp(-dt * 7));
    this.paw = sc.paw;
    this.reach += (sc.reach - this.reach) * (1 - Math.exp(-dt * 4));
    this.swell += (sc.swell - this.swell) * (1 - Math.exp(-dt * 3));
    this.deep += (sc.deep - this.deep) * (1 - Math.exp(-dt * 1.5));
    this.sit += (sc.sit - this.sit) * (1 - Math.exp(-dt * 2.2));
    const life = this.probe ? 0 : smooth((t - T_INTRO) / 3) * (1 - sc.still);   // a little constant movement, so the bear is never frozen
    this.air = (this.air || 0) + (sc.air - (this.air || 0)) * (1 - Math.exp(-dt * 5));
    this.fade = clamp(t / 0.7, 0, 1);
    this.wordY = sc.wordY; this.aY = sc.aY; this.bearY = sc.bearY;
    this.films = this.probe ? 1 : smooth((t - (TA1 - 0.4)) / 0.9);

    /* Body: hips and shoulders, shifted by leaning, bracing and sniffing */
    const drift = this.lean + sc.jit + 1.1 * life * Math.sin(TAU * 0.07 * t);
    const Hx = X + drift, Hy = GY - HIP + 7 * this.dip + 22 * this.sit;
    const sx0 = X + L + drift, sy0 = GY - SHO + 6 * this.sn + 5 * this.dip;
    const ang = Math.atan2(sy0 - Hy, sx0 - Hx), ca = Math.cos(ang), sa = Math.sin(ang);
    const Sx = Hx + ca * L, Sy = Hy + sa * L;
    const loc = (x, y) => [Hx + x * ca - y * sa, Hy + x * sa + y * ca];

    /* Head */
    const N = loc(NECK[0] + 5 * this.sn, NECK[1] + 7 * this.sn);
    let target = ang * 0.8 + 0.23 + life * (0.03 * Math.sin(TAU * 0.13 * t) + 0.018 * Math.sin(TAU * 0.31 * t + 2)), ext = 0;
    if (sc.look !== null) target = sc.look;
    if (this.sn > 0.02) {
      const dx = Sx + 66 + this.reach - N[0], dy = GY - 8 - N[1];          // nose reaches down and forward, clear of the front legs
      target = lerp(target, clamp(Math.atan2(dy, dx) - 0.16, -0.9, 0.6), smooth(this.sn));   // a gentle dip of the head, so the face keeps its shape
      ext = clamp(Math.hypot(dx, dy) - NOSE, -3, 5) * this.sn;
    }
    ext += 2 * this.air;
    const w = 9.5;
    this.thV += (w * w * (target - this.th) - 2 * w * this.thV) * dt;
    this.th += this.thV * dt;
    const sniffing = Math.max(smooth((this.sn - 0.4) / 0.5), this.air);
    const th = this.th + sniffing * (0.03 * Math.sin(TAU * 6.5 * t) * (0.55 + 0.45 * Math.sin(TAU * 0.8 * t)) + 0.06 * Math.sin(TAU * 0.42 * t)) + sc.wob;

    /* Skeleton: body, head, then upper leg, lower leg and paw for each leg. Paws stay where they stand. */
    const sk = [{ x: Hx, y: Hy, a: ang }, { x: N[0] + Math.cos(th) * ext, y: N[1] + Math.sin(th) * ext, a: th }];
    LEGS.forEach((leg, i) => {
      const jx = leg.front ? Sx : Hx, jy = leg.front ? Sy : Hy;
      const len = leg.front ? LEN.front : LEN.hind, l1 = len[0], l2 = len[1];
      const foot = this.legs[i];                                                          // where this paw is in its step, when the bear is stepping
      const up = foot.up + (i === 3 ? 13 * this.paw : 0), pitch = foot.pitch + (i === 3 ? 0.45 * this.paw : 0);
      const tx = Math.cos(pitch), ty = Math.sin(pitch);
      const fx = (leg.front ? X + L : X) + foot.at, fy = GY - up;
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
    this.bph += dt * TAU * lerp(0.28, 0.17, this.deep);                       // breathing slows and deepens when it dozes
    this.breath = 1 + lerp(0.016, 0.036, this.deep) * Math.sin(this.bph) + 0.03 * this.swell;
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
    this.root.setAttribute("transform", "translate(" + f1(this.ox) + " " + f1(this.bearY) + ")");
    if (stage) {
      stage.m.setAttribute("transform", "translate(0 " + f1(this.wordY) + ")");
      stage.a.setAttribute("transform", "translate(0 " + f1(this.aY) + ")");
      stage.films.setAttribute("opacity", this.films.toFixed(2));
    }
  }

  advance(seconds) { for (let i = 0, n = Math.round(seconds * 60); i < n; i++) this.step(1 / 60); }
}

/* The bear's outline, traced once from the logo and filled out (see plump). Tracing it in the browser is slow on
   phones, so it is kept here. If the logo artwork ever changes, these numbers no longer match its length and the
   outline is traced afresh. */
const OUTLINE = { length: 4094, points: [[344.18,21.77],[346.19,22.6],[348.15,23.45],[350.09,24.27],[352.03,25.04],[353.95,25.79],[355.85,26.51],[357.71,27.19],[359.52,27.77],[361.31,28.19],[363.14,28.33],[365.03,28.02],[366.98,27.47],[369.02,27.03],[371.18,27.06],[373.4,27.35],[375.64,27.66],[377.9,27.89],[380.23,28.16],[382.64,28.77],[384.93,29.95],[386.65,31.73],[387.49,33.88],[387.7,36.08],[387.89,38.1],[388.51,39.81],[389.58,41.23],[390.9,42.53],[392.4,43.89],[393.96,45.43],[395.43,47.13],[396.62,49],[397.51,50.97],[398.28,52.9],[399.15,54.67],[400.23,56.21],[401.51,57.57],[403.03,58.88],[404.78,60.27],[406.71,61.8],[408.06,63.7],[408.52,66.02],[407.99,68.63],[406.99,71.05],[405.66,73.07],[404.07,74.77],[402.39,76.41],[400.71,78.09],[398.9,79.6],[396.83,80.73],[394.52,81.36],[392.16,81.58],[389.87,81.55],[387.7,81.47],[385.63,81.43],[383.63,81.49],[381.65,81.66],[379.66,81.99],[377.64,82.44],[375.59,82.92],[373.48,83.32],[371.32,83.57],[369.15,83.73],[367,83.83],[364.9,83.92],[363,83.97],[361.3,83.93],[359.97,83.88],[359.31,84.32],[359.23,85.32],[359.5,86.86],[359.65,88.58],[359.81,90.46],[360.09,92.39],[360.54,94.27],[361.16,96.09],[361.92,97.87],[362.81,99.62],[363.8,101.35],[364.87,103.06],[366.01,104.77],[367.18,106.48],[368.37,108.22],[369.57,109.97],[370.76,111.75],[371.9,113.54],[372.93,115.31],[373.83,117.02],[374.71,118.59],[375.82,119.86],[377.29,120.67],[379.12,121.08],[381.17,121.46],[383.33,122.24],[385.47,123.56],[387.27,125.53],[388.43,128.02],[388.71,130.81],[388,133.49],[386.37,135.63],[384.14,137.05],[381.69,137.83],[379.28,138.2],[376.98,138.34],[374.77,138.36],[372.59,138.37],[370.42,138.37],[368.23,138.35],[366,138.24],[363.73,137.96],[361.43,137.44],[359.18,136.64],[357.08,135.55],[355.29,134.16],[353.74,132.59],[352.3,131.02],[350.8,129.64],[349.21,128.46],[347.55,127.4],[345.79,126.4],[343.98,125.39],[342.15,124.34],[340.32,123.24],[338.49,122.09],[336.69,120.9],[334.91,119.65],[333.17,118.35],[331.58,117.07],[330.22,115.83],[329.16,114.6],[328.29,114.05],[327.5,114.29],[326.65,115.36],[325.64,116.63],[324.53,118.04],[323.46,119.5],[322.53,120.83],[321.67,121.99],[321.56,122.67],[322.27,123.06],[323.92,123.32],[325.82,124.09],[327.72,125.5],[329.26,127.65],[329.99,130.34],[329.79,133.27],[328.51,135.66],[326.45,137.24],[323.9,137.95],[321.43,138.23],[319.1,138.3],[316.88,138.31],[314.69,138.31],[312.47,138.28],[310.22,138.11],[307.94,137.74],[305.65,137.1],[303.4,136.14],[301.27,134.8],[299.39,133.07],[297.99,130.94],[297.21,128.59],[297.04,126.17],[297.19,123.83],[297.42,121.61],[297.59,119.49],[297.71,117.43],[297.78,115.36],[297.8,113.27],[297.81,111.14],[297.84,109.02],[297.97,107.06],[298.27,105.35],[298.77,104.05],[298.81,103.61],[298.24,103.8],[296.87,104.43],[295.19,104.91],[293.29,105.36],[291.29,105.82],[289.41,106.23],[287.66,106.63],[286.1,107.12],[284.98,108.05],[284.28,109.39],[283.91,111.05],[283.5,112.82],[283.09,114.67],[282.75,116.47],[282.5,118.14],[282.4,119.61],[282.92,120.69],[284.05,121.46],[285.73,122.04],[287.6,122.89],[289.62,124.07],[291.63,125.68],[293.04,127.84],[293.61,130.47],[293.25,133.37],[291.94,135.73],[289.9,137.29],[287.35,138],[284.88,138.31],[282.55,138.38],[280.37,138.35],[278.23,138.3],[276.13,138.29],[274.03,138.31],[271.93,138.33],[269.79,138.35],[267.58,138.36],[265.31,138.29],[263,138.02],[260.67,137.39],[258.38,136.36],[256.3,134.9],[254.64,133.02],[253.52,130.84],[252.89,128.55],[252.56,126.33],[252.29,124.24],[251.89,122.3],[251.28,120.49],[250.49,118.8],[249.55,117.2],[248.57,115.73],[247.59,114.43],[246.61,113.31],[245.58,112.87],[244.48,113.16],[243.27,114.1],[241.85,115.18],[240.24,116.3],[238.49,117.47],[236.72,118.62],[235.01,119.7],[233.37,120.68],[231.91,121.52],[230.78,122.25],[230.28,122.68],[230.74,122.81],[232,122.85],[233.84,123.31],[235.79,124.48],[237.59,126.33],[238.68,128.8],[238.87,131.6],[238.07,134.34],[236.44,136.39],[234.18,137.6],[231.65,138.08],[229.23,138.25],[226.93,138.3],[224.69,138.31],[222.45,138.26],[220.18,138.04],[217.89,137.59],[215.61,136.84],[213.41,135.8],[211.46,134.42],[209.79,132.74],[208.4,130.82],[207.13,128.85],[205.96,126.83],[204.95,124.75],[204.19,122.51],[203.74,120.14],[203.62,117.7],[203.92,115.32],[204.58,113.07],[205.52,110.96],[206.54,108.98],[207.55,107.07],[208.52,105.21],[209.43,103.35],[210.29,101.49],[211.12,99.6],[211.91,97.7],[212.67,95.79],[213.39,93.86],[214.08,91.91],[214.75,89.95],[215.38,87.98],[216,86.01],[216.6,84.05],[217.15,82.09],[217.64,80.11],[218.03,78.12],[218.35,76.09],[218.62,74.01],[218.89,71.88],[219.25,69.74],[219.75,67.59],[220.38,65.45],[221.13,63.35],[221.99,61.29],[222.96,59.29],[224.01,57.35],[225.15,55.46],[226.36,53.62],[227.63,51.84],[228.97,50.11],[230.36,48.43],[231.79,46.79],[233.27,45.21],[234.8,43.66],[236.35,42.16],[237.95,40.7],[239.58,39.26],[241.25,37.86],[242.98,36.51],[244.78,35.24],[246.65,34.06],[248.57,32.97],[250.55,31.96],[252.56,31.04],[254.62,30.22],[256.72,29.5],[258.86,28.9],[261.02,28.4],[263.2,28],[265.38,27.71],[267.57,27.51],[269.74,27.4],[271.91,27.36],[274.07,27.36],[276.22,27.39],[278.36,27.46],[280.51,27.57],[282.65,27.71],[284.78,27.9],[286.91,28.12],[289.02,28.38],[291.11,28.66],[293.17,28.96],[295.2,29.24],[297.21,29.43],[299.2,29.52],[301.18,29.5],[303.15,29.37],[305.11,29.13],[307.06,28.79],[308.99,28.34],[310.91,27.81],[312.81,27.18],[314.69,26.48],[316.56,25.69],[318.42,24.83],[320.3,23.9],[322.21,22.94],[324.19,22.02],[326.27,21.19],[328.45,20.5],[330.7,20.01],[333.01,19.75],[335.34,19.74],[337.65,19.97],[339.91,20.41],[342.09,21.02]] };

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
  const n = count || 360, KEY = "amble-bear-outline-" + n + "-" + d.length;
  let P = null;
  if (d.length === OUTLINE.length && OUTLINE.points.length === n) P = OUTLINE.points;
  else try { const c = JSON.parse(localStorage.getItem(KEY)); if (Array.isArray(c) && c.length === n) P = c; } catch (e) {}   // traced once, then kept by the browser
  if (!P) {
    const total = tmp.getTotalLength();
    P = [];
    for (let i = 0; i < n; i++) { const q = tmp.getPointAtLength(total * i / n); P.push([q.x + ox, q.y + oy]); }
    if (PLUMP) P = plump(P, PLUMP);
    try { localStorage.setItem(KEY, JSON.stringify(P.map(p => [Math.round(p[0] * 100) / 100, Math.round(p[1] * 100) / 100]))); } catch (e) {}
  }
  svg.removeChild(tmp);

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

/* ---------- The wordmark: "ble" is there from the start; the "m" and then the "A" rise out of the ground ---------- */
function makeStage(group) {
  const svg = group.ownerSVGElement, kids = Array.from(group.children);
  if (!svg || kids.length < 9) return null;                 // expects the four "Amble" shapes, then the five "FILMS" letters
  const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
  const defs = svg.querySelector("defs") || svg.insertBefore(document.createElementNS(NS, "defs"), svg.firstChild);
  /* In the logo file the "A" and the "m" are one joined shape. It is shown twice, each copy cut to one
     letter (they meet at x = 209) and to the ground line (y = 256), so each letter can rise on its own. */
  const SPLIT = 209, am = kids[3];
  mk("rect", { x: -600, y: -300, width: SPLIT + 600, height: 556 }, mk("clipPath", { id: "amble-cut-a" }, defs));
  mk("rect", { x: SPLIT, y: -300, width: 1400, height: 556 }, mk("clipPath", { id: "amble-cut-m" }, defs));
  const a = mk("g", {}, mk("g", { "clip-path": "url(#amble-cut-a)" }, group));
  const m = mk("g", {}, mk("g", { "clip-path": "url(#amble-cut-m)" }, group));
  const films = mk("g", {}, group);
  m.appendChild(am.cloneNode(true)); a.appendChild(am);
  kids.slice(4).forEach(k => films.appendChild(k));
  return { a, m, films };
}

/* ---------- Start it on the page ---------- */
function mount(root, skin, stage, gate) {
  const bear = new Bear(root, { skin });
  /* The wordmark is whole from the very first frame: the entrance is skipped and the bear
     starts already standing on the letters, going about its routine. */
  bear.t = T_INTRO; bear.advance(0.5); bear.render(stage);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return bear;
  bear.queue = OPENER.slice();
  bear.nextAct = bear.t + 0.6;
  let last = 0;
  /* Full frame rate for smooth movement. It never freezes for lack of interaction; it only rests
     while it cannot be seen (tab hidden, scrolled away, menu closed), and carries on where it left off. */
  function tick(now) {
    requestAnimationFrame(tick);
    if (document.hidden || (gate && !gate())) { last = 0; return; }
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
    last = now;
    bear.step(dt); bear.render(stage);
  }
  requestAnimationFrame(tick);
  return bear;
}

window.AmbleBear = { Bear, mount, makeSkin, makeStage, T_INTRO };

/* One living bear, used on every logo: the header, the phone menu and the footer.
   All of them share the outline traced once from the logo and the same skeleton and routine; each keeps its own
   shuffled order so two bears on screen never move in step. Only the bear moves: the wordmark stays still.
   The still logo bear shows until the bear is built (and if scripts never run). With reduced motion the bear stands in one calm pose. */
function start() {
  const art = document.querySelector("#amble-bear-art path");
  if (!art) return;
  const header = document.getElementById("bear-rig");
  const rigs = [...(header ? [header] : []), ...document.querySelectorAll("[data-bear-rig]")];
  if (!rigs.length) return;
  const m = /translate\(\s*([-\d.]+)[ ,]+([-\d.]+)/.exec(art.getAttribute("transform") || "");
  const skin = makeSkin(rigs[0].ownerSVGElement, art.getAttribute("d"), m ? +m[1] : 0, m ? +m[2] : 0);
  const letters = document.getElementById("amble-letters");
  rigs.forEach(r => {
    const svg = r.ownerSVGElement, isHeader = r === header;
    const still = isHeader ? document.getElementById("bear-static") : svg.querySelector(".bear-still");
    if (still) still.style.display = "none";
    // Each bear moves only while it can be seen: the header always, the menu while open, the footer while on screen
    let gate = null;
    const dlg = r.closest("dialog");
    if (dlg) gate = () => dlg.open;
    else if (!isHeader && "IntersectionObserver" in window) {
      let seen = false;
      new IntersectionObserver(([e]) => { seen = e.isIntersecting; }, { rootMargin: "80px" }).observe(svg);
      gate = () => seen;
    }
    const bear = mount(r, skin, isHeader && letters ? makeStage(letters) : null, gate);
    const logo = r.closest(".logo");
    if (logo) logo.addEventListener("pointerenter", () => bear.notice());
  });
}
// Starts as soon as the page is parsed (it no longer waits for every image and video), when the browser is free
const later = () => ("requestIdleCallback" in window) ? requestIdleCallback(start, { timeout: 800 }) : setTimeout(start, 120);
if (document.readyState !== "loading") later(); else addEventListener("DOMContentLoaded", later, { once: true });
})();

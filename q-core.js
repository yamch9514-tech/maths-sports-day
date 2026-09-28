/* Maths Sports Day — question engine core.
   Works in the browser (window.MSD) and in Node (module.exports) for testing.
   Every question generator is deterministic for a given random seed, so a
   Class Challenge code gives every student exactly the same questions. */
(function (root) {
  'use strict';

  /* ---------- Seeded random numbers ---------- */
  function hashStr(str) {
    let h1 = 0xdeadbeef ^ str.length, h2 = 0x41c6ce57 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return ((h1 >>> 0) ^ (h2 >>> 0)) >>> 0;
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function makeRng(seed) {
    const next = mulberry32(seed >>> 0);
    const r = {
      next: next,
      int: function (a, b) { return a + Math.floor(next() * (b - a + 1)); },
      pick: function (arr) { return arr[Math.floor(next() * arr.length)]; },
      chance: function (p) { return next() < p; },
      sign: function () { return next() < 0.5 ? -1 : 1; },
      shuffle: function (arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
        return a;
      },
      intNot: function (a, b, excluded) {
        let v, guard = 0;
        do { v = r.int(a, b); } while (excluded.indexOf(v) >= 0 && ++guard < 200);
        return v;
      },
      nonZero: function (a, b) { return r.intNot(a, b, [0]); },
      sample: function (arr, k) { return r.shuffle(arr).slice(0, k); }
    };
    return r;
  }

  /* ---------- Number helpers ---------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a; }
  function lcm(a, b) { return Math.abs(a * b) / gcd(a, b); }
  function clean(x) { return parseFloat(Number(x).toPrecision(12)); }
  const MINUS = '−';
  const NNBSP = ' '; // narrow no-break space for thousands (Cambridge style: 45 000)

  function plain(x) {
    // number -> plain decimal string without exponent
    x = clean(x);
    let s = String(Math.abs(x));
    if (s.indexOf('e') >= 0) s = Math.abs(x).toFixed(14).replace(/0+$/, '').replace(/\.$/, '');
    return (x < 0 ? '-' : '') + s;
  }
  function fmt(x) {
    const s = plain(x);
    const neg = s[0] === '-';
    const body = neg ? s.slice(1) : s;
    const parts = body.split('.');
    let ip = parts[0];
    if (ip.length > 4) ip = ip.replace(/\B(?=(\d{3})+(?!\d))/g, NNBSP);
    return (neg ? MINUS : '') + ip + (parts[1] ? '.' + parts[1] : '');
  }
  // format with sign handling inside expressions: (−3)
  function paren(x) { return x < 0 ? '(' + fmt(x) + ')' : fmt(x); }
  function money(x) { return 'RM' + (Math.round(x * 100) / 100).toFixed(2); }
  function roundTo(x, dp) { const m = Math.pow(10, dp); return clean(Math.round(clean(x * m)) / m); }
  function roundSF(x, sf) {
    if (x === 0) return 0;
    const mag = Math.floor(Math.log10(Math.abs(x)));
    const dp = sf - 1 - mag;
    if (dp >= 0) return roundTo(x, dp);
    const m = Math.pow(10, -dp);
    return clean(Math.round(x / m) * m);
  }

  /* ---------- Fractions ---------- */
  function fr(n, d) {
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d) || 1;
    return { n: n / g, d: d / g };
  }
  function fAdd(a, b) { return fr(a.n * b.d + b.n * a.d, a.d * b.d); }
  function fSub(a, b) { return fr(a.n * b.d - b.n * a.d, a.d * b.d); }
  function fMul(a, b) { return fr(a.n * b.n, a.d * b.d); }
  function fDiv(a, b) { return fr(a.n * b.d, a.d * b.n); }
  function fracHTML(n, d) {
    const neg = (n < 0) !== (d < 0) && n !== 0;
    n = Math.abs(n); d = Math.abs(d);
    return (neg ? MINUS : '') + '<span class="fr"><span>' + n + '</span><span>' + d + '</span></span>';
  }
  function mixedHTML(n, d) {
    // n/d (any sign) -> mixed number HTML (whole number if exact)
    const f = fr(n, d);
    const neg = f.n < 0;
    const an = Math.abs(f.n);
    const w = Math.floor(an / f.d), rem = an % f.d;
    let s = neg ? MINUS : '';
    if (rem === 0) return s + w;
    if (w > 0) s += w;
    return s + '<span class="fr"><span>' + rem + '</span><span>' + f.d + '</span></span>';
  }
  function fracOrInt(n, d) { const f = fr(n, d); return f.d === 1 ? fmt(f.n) : fracHTML(f.n, f.d); }

  /* ---------- Algebra formatting ---------- */
  function v(name) { return '<i>' + name + '</i>'; }
  // terms: array of [coef, varHTML]; varHTML '' for constants. Returns e.g. "3x − 2y + 5"
  function lin(terms) {
    let out = '';
    terms.forEach(function (t) {
      const c = t[0], x = t[1];
      if (c === 0) return;
      const abs = Math.abs(c);
      const body = x ? ((abs === 1 ? '' : fmt(abs)) + x) : fmt(abs);
      if (out === '') out = (c < 0 ? MINUS : '') + body;
      else out += (c < 0 ? ' ' + MINUS + ' ' : ' + ') + body;
    });
    return out === '' ? '0' : out;
  }
  function fx(top, bottom) { return '<span class="fr"><span>' + top + '</span><span>' + bottom + '</span></span>'; }
  function pow(base, e) { return base + '<sup>' + (typeof e === 'number' ? fmt(e) : e) + '</sup>'; }
  function vec(a, b) { return '<span class="vec"><span>' + fmt(a) + '</span><span>' + fmt(b) + '</span></span>'; }
  function coord(x, y) { return '(' + fmt(x) + ', ' + fmt(y) + ')'; }
  function rec(digits) { return '<span class="rec">' + digits + '</span>'; } // recurring dot(s)

  /* ---------- Answers ---------- */
  function ansNum(value, extra) {
    const a = { type: 'num', value: clean(value), show: fmt(value) };
    if (extra) Object.keys(extra).forEach(function (k) { a[k] = extra[k]; });
    return a;
  }
  // form: 'simplest' (lowest terms, improper or mixed ok), 'mixed' (mixed number), 'any' (any equivalent value)
  function ansFrac(n, d, form, extra) {
    const f = fr(n, d);
    form = form || 'simplest';
    let show;
    if (f.d === 1) show = fmt(f.n);
    else if (form === 'mixed') show = mixedHTML(f.n, f.d);
    else if (Math.abs(f.n) > f.d) show = mixedHTML(f.n, f.d) + ' or ' + fracHTML(f.n, f.d);
    else show = fracHTML(f.n, f.d);
    const a = { type: 'num', value: clean(f.n / f.d), frac: f, form: form, show: show };
    if (extra) Object.keys(extra).forEach(function (k) { a[k] = extra[k]; });
    return a;
  }
  function ansMC(correct, distractors, rng, keepOrder) {
    const opts = [correct];
    distractors.forEach(function (d) { if (opts.indexOf(d) < 0) opts.push(d); });
    const chosen = [opts[0]].concat(rng.shuffle(opts.slice(1)).slice(0, 3));
    const shown = keepOrder ? opts.filter(function (o) { return chosen.indexOf(o) >= 0; }) : rng.shuffle(chosen);
    return { type: 'mc', options: shown, correct: shown.indexOf(correct), show: correct };
  }

  function parseInput(raw) {
    let s = String(raw == null ? '' : raw).trim().replace(/−/g, '-').replace(/\s+/g, ' ');
    if (!s) return null;
    let neg = false;
    if (s[0] === '-') { neg = true; s = s.slice(1).trim(); }
    let m;
    if ((m = s.match(/^(\d+) (\d+)\/(\d+)$/))) {
      const w = +m[1], n = +m[2], d = +m[3];
      if (d === 0) return null;
      return { kind: 'mixed', whole: w, n: n, d: d, value: (neg ? -1 : 1) * (w + n / d) };
    }
    if ((m = s.match(/^(\d+)\/(\d+)$/))) {
      const n = +m[1], d = +m[2];
      if (d === 0) return null;
      return { kind: 'frac', n: n, d: d, value: (neg ? -1 : 1) * n / d };
    }
    s = s.replace(/ /g, '');
    if (/^(\d+\.?\d*|\.\d+)$/.test(s)) return { kind: s.indexOf('.') >= 0 ? 'dec' : 'int', value: (neg ? -1 : 1) * parseFloat(s) };
    return null;
  }

  function check(ans, raw) {
    if (ans.type === 'mc') return { correct: raw === ans.correct };
    const p = parseInput(raw);
    if (!p) return { correct: false, invalid: true, msg: "That isn't a number I can read." };
    const tol = ans.tol != null ? ans.tol : 1e-9 * Math.max(1, Math.abs(ans.value));
    if (Math.abs(p.value - ans.value) > tol) return { correct: false };
    if (ans.form === 'simplest' || ans.form === 'mixed') {
      if (p.kind === 'dec') {
        if (ans.allowDecimal) return { correct: true };
        return { correct: false, near: true, msg: 'Right value, but give your answer as a fraction.' };
      }
      if (p.kind === 'frac') {
        if (p.d === 1 || gcd(p.n, p.d) !== 1) return { correct: false, near: true, msg: 'Right value, but simplify your fraction fully.' };
        if (ans.form === 'mixed' && p.n > p.d) return { correct: false, near: true, msg: 'Right value, but write it as a mixed number.' };
      }
      if (p.kind === 'mixed') {
        if (p.n === 0 || p.n >= p.d || gcd(p.n, p.d) !== 1) return { correct: false, near: true, msg: 'Right value, but simplify the fraction part fully.' };
      }
    }
    return { correct: true };
  }

  /* ---------- SVG diagrams ---------- */
  const D2R = Math.PI / 180;
  function r1(x) { return Math.round(x * 10) / 10; }
  function svg(w, h, inner, label) {
    return '<svg class="dg" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + (label || 'diagram') + '">' + inner + '</svg>';
  }
  function P(cx, cy, r, deg) { return [cx + r * Math.cos(deg * D2R), cy - r * Math.sin(deg * D2R)]; }
  function L(a, b, cls) { return '<line x1="' + r1(a[0]) + '" y1="' + r1(a[1]) + '" x2="' + r1(b[0]) + '" y2="' + r1(b[1]) + '"' + (cls ? ' class="' + cls + '"' : '') + '/>'; }
  function T(p, text, cls) {
    return '<text x="' + r1(p[0]) + '" y="' + r1(p[1]) + '" text-anchor="middle" dominant-baseline="central"' + (cls ? ' class="' + cls + '"' : '') + '>' + text + '</text>';
  }
  function arc(cx, cy, r, a1, a2) {
    const s = P(cx, cy, r, a1), e = P(cx, cy, r, a2);
    const large = (a2 - a1) > 180 ? 1 : 0;
    return '<path class="arc" d="M' + r1(s[0]) + ',' + r1(s[1]) + ' A' + r + ',' + r + ' 0 ' + large + ' 0 ' + r1(e[0]) + ',' + r1(e[1]) + '"/>';
  }
  function angLabel(val) { return typeof val === 'number' ? val + '°' : val; }
  function lblCls(val) { return typeof val === 'number' ? 'lb' : 'lb unk'; }
  // angle marker at vertex (cx,cy) spanning directions a1->a2 (ccw), with label
  function angleMark(cx, cy, a1, a2, val, rArc) {
    rArc = rArc || 26;
    let s = arc(cx, cy, rArc, a1, a2);
    const span = a2 - a1;
    const rl = rArc + (span < 35 ? 26 : span < 60 ? 20 : 16);
    s += T(P(cx, cy, rl, (a1 + a2) / 2), angLabel(val), lblCls(val));
    return s;
  }
  function polyline(pts, close, cls) {
    return '<' + (close ? 'polygon' : 'polyline') + ' points="' + pts.map(function (p) { return r1(p[0]) + ',' + r1(p[1]); }).join(' ') + '"' + (cls ? ' class="' + cls + '"' : '') + '/>';
  }
  function dirDeg(a, b) { return Math.atan2(-(b[1] - a[1]), b[0] - a[0]) / D2R; } // math angle of a->b in screen coords
  function norm360(d) { d = d % 360; return d < 0 ? d + 360 : d; }
  // interior angle mark at vertex V between neighbours A and B (the smaller angle)
  function vertexMark(V, A, B, val, rArc) {
    let d1 = norm360(dirDeg(V, A)), d2 = norm360(dirDeg(V, B));
    let lo = Math.min(d1, d2), hi = Math.max(d1, d2);
    if (hi - lo > 180) { const t = lo; lo = hi; hi = t + 360; }
    return angleMark(V[0], V[1], lo, hi, val, rArc);
  }
  function fitPoints(pts, W, H, pad) {
    const xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
    const minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs), minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
    const s = Math.min((W - 2 * pad) / (maxX - minX || 1), (H - 2 * pad) / (maxY - minY || 1));
    const ox = (W - s * (maxX - minX)) / 2, oy = (H - s * (maxY - minY)) / 2;
    return pts.map(function (p) { return [ox + (p[0] - minX) * s, H - (oy + (p[1] - minY) * s)]; });
  }
  const NTS = '<text x="6" y="12" class="nts">Not drawn to scale</text>';

  const DG = {
    straight: function (a, left, right) {
      // straight line with ray at angle a; right sector = a, left = 180 - a. left/right = labels (number or 'x')
      const cx = 160, cy = 120;
      let s = L([20, cy], [300, cy]) + L([cx, cy], P(cx, cy, 105, a));
      s += angleMark(cx, cy, 0, a, right, 28) + angleMark(cx, cy, a, 180, left, 34);
      return svg(320, 140, s + NTS, 'angles on a straight line');
    },
    point: function (angles, labels, tilt) {
      const cx = 160, cy = 110; let s = '', d = tilt || 0;
      angles.forEach(function (ang, i) {
        s += L([cx, cy], P(cx, cy, 90, d));
        s += angleMark(cx, cy, d, d + ang, labels[i], 24 + (i % 2) * 6);
        d += ang;
      });
      return svg(320, 220, s + NTS, 'angles around a point');
    },
    triangle: function (A, B, labels) {
      // base from V0 to V1, apex V2. A at V0, B at V1, C at V2. labels [lA,lB,lC] (null = no label)
      const C = 180 - A - B;
      const t = Math.sin(B * D2R) / Math.sin((A + B) * D2R);
      const raw = [[0, 0], [1, 0], [t * Math.cos(A * D2R), t * Math.sin(A * D2R)]];
      const p = fitPoints(raw, 320, 200, 34);
      let s = polyline(p, true, 'sh');
      [[0, 1, 2], [1, 0, 2], [2, 0, 1]].forEach(function (ix, i) {
        if (labels[i] != null) s += vertexMark(p[ix[0]], p[ix[1]], p[ix[2]], labels[i], [A, B, C][i] < 40 ? 30 : 24);
      });
      return svg(320, 200, s + NTS, 'triangle');
    },
    quad: function (angles, labels, rng) {
      // convex quadrilateral with interior angles angles[0..3] (sum 360)
      const dirs = [0];
      for (let i = 1; i < 4; i++) dirs.push(dirs[i - 1] + (180 - angles[i]));
      const u = dirs.map(function (d) { return [Math.cos(d * D2R), Math.sin(d * D2R)]; });
      let pts = null;
      for (let tries = 0; tries < 80 && !pts; tries++) {
        const s0 = 0.8 + rng.next() * 0.7, s1 = 0.8 + rng.next() * 0.7;
        const rx = -(s0 * u[0][0] + s1 * u[1][0]), ry = -(s0 * u[0][1] + s1 * u[1][1]);
        const det = u[2][0] * u[3][1] - u[2][1] * u[3][0];
        const s2 = (rx * u[3][1] - ry * u[3][0]) / det, s3 = (u[2][0] * ry - u[2][1] * rx) / det;
        if (s2 > 0.45 && s3 > 0.45 && s2 < 2.2 && s3 < 2.2) {
          const sl = [s0, s1, s2];
          pts = [[0, 0]];
          for (let i = 0; i < 3; i++) pts.push([pts[i][0] + sl[i] * u[i][0], pts[i][1] + sl[i] * u[i][1]]);
        }
      }
      if (!pts) return null;
      const p = fitPoints(pts, 320, 210, 34);
      let s = polyline(p, true, 'sh');
      for (let i = 0; i < 4; i++) {
        s += vertexMark(p[i], p[(i + 3) % 4], p[(i + 1) % 4], labels[i], 24);
      }
      return svg(320, 210, s + NTS, 'quadrilateral');
    },
    vertOpp: function (a, tilt, labels) {
      // two lines crossing; sectors [a, 180-a, a, 180-a] starting at tilt. labels array of 4 (null = none)
      const cx = 160, cy = 105;
      let s = L(P(cx, cy, 120, tilt), P(cx, cy, 120, tilt + 180)) + L(P(cx, cy, 120, tilt + a), P(cx, cy, 120, tilt + a + 180));
      const sectors = [[tilt, tilt + a], [tilt + a, tilt + 180], [tilt + 180, tilt + 180 + a], [tilt + 180 + a, tilt + 360]];
      sectors.forEach(function (sec, i) { if (labels[i] != null) s += angleMark(cx, cy, sec[0], sec[1], labels[i], i % 2 ? 36 : 24); });
      return svg(320, 210, s + NTS, 'intersecting lines');
    },
    parallel: function (theta, marks) {
      // two horizontal parallel lines, transversal at angle theta (deg). marks: [{at:'top'|'bot', pos:'AR'|'AL'|'BL'|'BR', lab}]
      const y1 = 62, y2 = 150, dx = (y2 - y1) / Math.tan(theta * D2R);
      const top = [160 + dx / 2, y1], bot = [160 - dx / 2, y2];
      const ext = 48 / Math.sin(theta * D2R);
      let s = L([18, y1], [302, y1]) + L([18, y2], [302, y2]);
      s += L(P(top[0], top[1], ext, theta), P(bot[0], bot[1], ext, theta + 180));
      [y1, y2].forEach(function (y) { s += '<path class="arw" d="M262,' + (y - 6) + ' l8,6 l-8,6"/>'; });
      const sec = { AR: [0, theta], AL: [theta, 180], BL: [180, 180 + theta], BR: [180 + theta, 360] };
      marks.forEach(function (m) {
        const c = m.at === 'top' ? top : bot;
        s += angleMark(c[0], c[1], sec[m.pos][0], sec[m.pos][1], m.lab, 22);
      });
      return svg(320, 212, s + NTS, 'parallel lines');
    },
    exterior: function (A, C, labA, labC, labX) {
      // triangle V0 (A), V1 (B), apex V2 (C); base extended beyond V1
      const B = 180 - A - C;
      const t = Math.sin(B * D2R) / Math.sin((A + B) * D2R);
      const raw = [[0, 0], [1, 0], [t * Math.cos(A * D2R), t * Math.sin(A * D2R)], [1.45, 0]];
      const p = fitPoints(raw, 320, 190, 30);
      let s = polyline([p[0], p[1], p[2]], true, 'sh') + L(p[1], p[3]);
      s += vertexMark(p[0], p[1], p[2], labA, 26);
      s += vertexMark(p[2], p[0], p[1], labC, 26);
      s += vertexMark(p[1], p[3], p[2], labX, 24);
      return svg(320, 190, s + NTS, 'triangle with exterior angle');
    },
    rightTri: function (labA, labB, labC) {
      // right angle at bottom-left; legs: vertical (labA), horizontal (labB); hypotenuse labC
      const p = [[60, 30], [60, 170], [270, 170]];
      let s = polyline(p, true, 'sh') + '<path class="ra" d="M60,154 h16 v16"/>';
      s += T([34, 100], labA, lblCls(labA === 'x' ? 'x' : 0)) + T([165, 192], labB, lblCls(labB === 'x' ? 'x' : 0)) + T([185, 86], labC, lblCls(labC === 'x' ? 'x' : 0));
      return svg(320, 205, s + NTS, 'right-angled triangle');
    },
    triArea: function (b, h) {
      const p = [[40, 170], [280, 170], [200, 40]];
      let s = polyline(p, true, 'sh') + L([200, 40], [200, 170], 'dash') + '<path class="ra" d="M200,158 h-12 v12"/>';
      s += T([160, 190], b + ' cm', 'lb') + T([174, 112], h + ' cm', 'lb');
      return svg(320, 205, s + NTS, 'triangle');
    },
    para: function (b, h) {
      const p = [[40, 160], [230, 160], [290, 50], [100, 50]];
      let s = polyline(p, true, 'sh') + L([100, 50], [100, 160], 'dash') + '<path class="ra" d="M100,148 h12 v12"/>';
      s += T([135, 180], b + ' cm', 'lb') + T([126, 108], h + ' cm', 'lb');
      return svg(320, 195, s + NTS, 'parallelogram');
    },
    trap: function (a, b, h) {
      const p = [[30, 160], [290, 160], [220, 50], [100, 50]];
      let s = polyline(p, true, 'sh') + L([100, 50], [100, 160], 'dash') + '<path class="ra" d="M100,148 h12 v12"/>';
      s += T([160, 34], a + ' cm', 'lb') + T([160, 180], b + ' cm', 'lb') + T([126, 108], h + ' cm', 'lb');
      return svg(320, 195, s + NTS, 'trapezium');
    },
    lShape: function (W, H, w2, h2) {
      // outer W x H with the top-right corner (w2 x h2) removed. Labels: W bottom, H left, W - w2 top, H - h2 right
      const p = [[52, 176], [262, 176], [262, 106], [172, 106], [172, 38], [52, 38]];
      let s = polyline(p, true, 'sh');
      s += T([157, 194], W + ' cm', 'lb') + T([26, 107], H + ' cm', 'lb') + T([112, 26], (W - w2) + ' cm', 'lb') + T([288, 141], (H - h2) + ' cm', 'lb');
      return svg(320, 206, s + '<text x="316" y="200" text-anchor="end" class="nts">Not drawn to scale</text>', 'compound shape');
    },
    cuboid: function (l, w, h) {
      const x = 50, y = 170, L_ = 170, H_ = 90, dx = 60, dy = 40;
      const f = [[x, y], [x + L_, y], [x + L_, y - H_], [x, y - H_]];
      let s = polyline(f, true, 'sh') + polyline([[x, y - H_], [x + dx, y - H_ - dy], [x + L_ + dx, y - H_ - dy], [x + L_, y - H_]], false, 'sh2');
      s += polyline([[x + L_, y], [x + L_ + dx, y - dy], [x + L_ + dx, y - H_ - dy]], false, 'sh2');
      s += T([x + L_ / 2, y + 16], l + ' cm', 'lb') + T([x + L_ + dx / 2 + 24, y - dy / 2 + 14], w + ' cm', 'lb') + T([x - 26, y - H_ / 2], h + ' cm', 'lb');
      return svg(320, 200, s + NTS, 'cuboid');
    },
    prism: function (b, h, len, hyp) {
      // right-angled triangular prism: triangle front face (base b, height h), depth len
      const x = 40, y = 170, B = 110, H = 95, dx = 150, dy = 50;
      const f = [[x, y], [x + B, y], [x, y - H]];
      let s = polyline(f, true, 'sh') + '<path class="ra" d="M' + x + ',' + (y - 12) + ' h12 v12"/>';
      s += polyline([[x + B, y], [x + B + dx, y - dy], [x + dx, y - H - dy], [x, y - H]], false, 'sh2');
      s += L([x + dx, y - H - dy], [x + dx, y - dy], 'dash') + L([x + dx, y - dy], [x + B + dx, y - dy], 'dash') + L([x, y], [x + dx, y - dy], 'dash');
      s += T([x + B / 2, y + 16], b + ' cm', 'lb') + T([x - 22, y - H / 2], h + ' cm', 'lb') + T([x + B + dx / 2 + 22, y - dy / 2 + 10], len + ' cm', 'lb');
      if (hyp) s += T([x + B / 2 + 4, y - H / 2 - 14], hyp + ' cm', 'lb');
      return svg(320, 200, s + NTS, 'triangular prism');
    },
    cylinder: function (r, h) {
      const cx = 160, top = 45, bot = 165, rx = 70, ry = 22;
      let s = '<ellipse class="sh" cx="' + cx + '" cy="' + bot + '" rx="' + rx + '" ry="' + ry + '"/>';
      s += '<rect class="sh" x="' + (cx - rx) + '" y="' + top + '" width="' + (2 * rx) + '" height="' + (bot - top) + '" stroke="none"/>';
      s += L([cx - rx, top], [cx - rx, bot]) + L([cx + rx, top], [cx + rx, bot]);
      s += '<ellipse class="sh" cx="' + cx + '" cy="' + top + '" rx="' + rx + '" ry="' + ry + '"/>';
      s += L([cx, top], [cx + rx, top], 'dash') + '<circle cx="' + cx + '" cy="' + top + '" r="2.5" class="dot"/>' + T([cx + rx / 2, top + 11], r + ' cm', 'lb sm') + T([cx + rx + 30, (top + bot) / 2], h + ' cm', 'lb');
      return svg(320, 195, s + NTS, 'cylinder');
    },
    rectSemi: function (w, d) {
      // rectangle w wide, d tall, with a semicircle (diameter d) on the right side
      const x0 = 40, y0 = 40, W = 170, H = 120, R = H / 2;
      let s = '<path class="sh" d="M' + x0 + ',' + y0 + ' h' + W + ' a' + R + ',' + R + ' 0 0 1 0,' + H + ' h' + (-W) + ' Z"/>';
      s += L([x0 + W, y0], [x0 + W, y0 + H], 'dash');
      s += T([x0 + W / 2, y0 + H + 16], w + ' cm', 'lb') + T([x0 - 22, y0 + H / 2], d + ' cm', 'lb');
      return svg(320, 190, s + NTS, 'rectangle with a semicircle');
    },
    circle: function (lab, diameter) {
      const cx = 160, cy = 100, R = 75;
      let s = '<circle class="sh" cx="' + cx + '" cy="' + cy + '" r="' + R + '"/><circle cx="' + cx + '" cy="' + cy + '" r="2.5" class="dot"/>';
      if (diameter) s += L([cx - R, cy], [cx + R, cy]) + T([cx, cy - 14], lab, 'lb');
      else s += L([cx, cy], [cx + R, cy]) + T([cx + R / 2, cy - 14], lab, 'lb');
      return svg(320, 200, s + NTS, 'circle');
    },
    spinner: function (labels) {
      const n = labels.length, cx = 160, cy = 105, R = 90;
      let s = '';
      for (let i = 0; i < n; i++) {
        const a1 = 90 - i * 360 / n, a2 = 90 - (i + 1) * 360 / n;
        const p1 = P(cx, cy, R, a1), p2 = P(cx, cy, R, a2);
        s += '<path class="sp sp' + labels[i].c + '" d="M' + cx + ',' + cy + ' L' + r1(p1[0]) + ',' + r1(p1[1]) + ' A' + R + ',' + R + ' 0 0 1 ' + r1(p2[0]) + ',' + r1(p2[1]) + ' Z"/>';
        s += T(P(cx, cy, R * 0.62, (a1 + a2) / 2), labels[i].t, 'lb splb');
      }
      s += '<path class="arw2" d="M' + cx + ',' + (cy - 8) + ' l0,-45"/><circle cx="' + cx + '" cy="' + cy + '" r="5" class="dot"/>';
      return svg(320, 210, s, 'spinner');
    },
    numberLine: function (lo, hi, a, aClosed, b, bClosed) {
      // a/b may be null for rays. ticks lo..hi
      const x0 = 30, x1 = 290, y = 50, n = hi - lo;
      const X = function (t) { return x0 + (t - lo) * (x1 - x0) / n; };
      let s = L([x0 - 12, y], [x1 + 12, y]);
      for (let t = lo; t <= hi; t++) s += L([X(t), y - 6], [X(t), y + 6]) + T([X(t), y + 22], fmt(t), 'lb sm');
      const L1 = a != null ? X(a) : x0 - 12, R1 = b != null ? X(b) : x1 + 12;
      s += '<line class="nl" x1="' + r1(L1) + '" y1="' + (y - 18) + '" x2="' + r1(R1) + '" y2="' + (y - 18) + '"/>';
      if (a == null) s += '<path class="nlh" d="M' + (L1 + 10) + ',' + (y - 24) + ' l-10,6 l10,6"/>';
      if (b == null) s += '<path class="nlh" d="M' + (R1 - 10) + ',' + (y - 24) + ' l10,6 l-10,6"/>';
      if (a != null) s += '<circle cx="' + r1(X(a)) + '" cy="' + (y - 18) + '" r="6" class="' + (aClosed ? 'cl' : 'op') + '"/>';
      if (b != null) s += '<circle cx="' + r1(X(b)) + '" cy="' + (y - 18) + '" r="6" class="' + (bClosed ? 'cl' : 'op') + '"/>';
      return svg(320, 86, s, 'number line');
    },
    grid: function (rows, cols, shaded) {
      const cell = Math.min(26, Math.floor(280 / cols)), W = cols * cell, H = rows * cell;
      const ox = (320 - W) / 2, oy = 10;
      let s = '';
      for (let i = 0; i < rows * cols; i++) {
        const rr = Math.floor(i / cols), cc = i % cols;
        s += '<rect x="' + (ox + cc * cell) + '" y="' + (oy + rr * cell) + '" width="' + cell + '" height="' + cell + '" class="' + (i < shaded ? 'gs' : 'gc') + '"/>';
      }
      return svg(320, H + 20, s, 'grid');
    },
    pie: function (sectors) {
      // sectors: [{deg, name}] -> pie with angle labels, legend on the right
      const cx = 105, cy = 105, R = 90; let a = 90, s = '';
      sectors.forEach(function (sec, i) {
        const a2 = a - sec.deg, p1 = P(cx, cy, R, a), p2 = P(cx, cy, R, a2);
        s += '<path class="sp sp' + (i % 6) + '" d="M' + cx + ',' + cy + ' L' + r1(p1[0]) + ',' + r1(p1[1]) + ' A' + R + ',' + R + ' 0 ' + (sec.deg > 180 ? 1 : 0) + ' 1 ' + r1(p2[0]) + ',' + r1(p2[1]) + ' Z"/>';
        s += T(P(cx, cy, R * 0.62, (a + a2) / 2), fmt(sec.deg) + '°', 'lb splb sm');
        a = a2;
      });
      sectors.forEach(function (sec, i) {
        const ly = 45 + i * 36;
        s += '<rect x="214" y="' + (ly - 9) + '" width="18" height="18" rx="3" class="sp sp' + (i % 6) + '"/>';
        s += '<text x="239" y="' + ly + '" dominant-baseline="central" class="lb sm">' + sec.name + '</text>';
      });
      return svg(340, 210, s, 'pie chart');
    }
  };

  // Function machine (HTML)
  function machine(inp, ops, out) {
    let s = '<div class="fm"><span class="fm-io">' + inp + '</span>';
    ops.forEach(function (o) { s += '<span class="fm-ar">→</span><span class="fm-op">' + o + '</span>'; });
    return s + '<span class="fm-ar">→</span><span class="fm-io">' + out + '</span></div>';
  }
  // Small data table (HTML)
  function table(headers, rows) {
    let s = '<div class="qtw"><table class="qt"><thead><tr>' + headers.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>';
    rows.forEach(function (r) { s += '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; });
    return s + '</tbody></table></div>';
  }

  /* ---------- Topics & generator registry ---------- */
  const TOPICS = { 7: [], 8: [], 9: [] };
  const GENS = [];
  function topic(year, id, unit, name, strand) { TOPICS[year].push({ id: id, unit: unit, name: name, strand: strand, year: year }); }
  function def(g) { GENS.push(g); }

  const STRANDS = { N: 'Number', A: 'Algebra', G: 'Geometry & measure', S: 'Statistics & probability' };
  const NAMES_F = ['Aisha', 'Priya', 'Mei Ling', 'Siti', 'Nurul', 'Farah', 'Divya', 'Hui Min'];
  const NAMES_M = ['Wei Ming', 'Hafiz', 'Arjun', 'Jun Hao', 'Ravi', 'Kai', 'Aiman', 'Daniel'];
  const NAMES = NAMES_F.concat(NAMES_M);

  function topicOf(year, id) { return TOPICS[year].filter(function (t) { return t.id === id; })[0]; }

  let uidCounter = 0;
  function make(g, rng) {
    let q = null, guard = 0;
    while (!q && guard++ < 20) q = g.gen(rng);
    if (!q) throw new Error('Generator failed: ' + g.id);
    q.uid = ++uidCounter;
    q.gen = g.id; q.year = g.year; q.topic = g.topic; q.tier = g.tier;
    const t = topicOf(g.year, g.topic);
    q.topicName = t ? t.name : g.topic;
    q.unit = t ? t.unit : null;
    q.strand = t ? t.strand : null;
    return q;
  }

  // filter: {year, topics:[ids], tiers:[1,2,3], quick:bool, strand:'N'}
  function pool(filter) {
    return GENS.filter(function (g) {
      if (g.year !== filter.year) return false;
      if (filter.topics && filter.topics.indexOf(g.topic) < 0) return false;
      if (filter.tiers && filter.tiers.indexOf(g.tier) < 0) return false;
      if (filter.quick && !g.quick) return false;
      if (filter.strand) { const t = topicOf(g.year, g.topic); if (!t || t.strand !== filter.strand) return false; }
      return true;
    });
  }
  // pick a question: topic first (balanced revision), then generator; avoids recently used generators
  function pick(rng, filter, recent) {
    recent = recent || [];
    let gens = pool(filter);
    if (!gens.length) { const f2 = Object.assign({}, filter); delete f2.tiers; gens = pool(f2); }
    if (!gens.length) { const f3 = Object.assign({}, filter); delete f3.tiers; delete f3.quick; gens = pool(f3); }
    if (!gens.length) return null;
    let fresh = gens.filter(function (g) { return recent.indexOf(g.id) < 0; });
    if (!fresh.length) fresh = gens;
    const topics = [];
    fresh.forEach(function (g) { if (topics.indexOf(g.topic) < 0) topics.push(g.topic); });
    const tp = rng.pick(topics);
    const g = rng.pick(fresh.filter(function (x) { return x.topic === tp; }));
    return make(g, rng);
  }

  const API = {
    hashStr: hashStr, makeRng: makeRng, gcd: gcd, lcm: lcm, clean: clean, fmt: fmt, plain: plain, paren: paren, money: money,
    roundTo: roundTo, roundSF: roundSF, fr: fr, fAdd: fAdd, fSub: fSub, fMul: fMul, fDiv: fDiv,
    fracHTML: fracHTML, mixedHTML: mixedHTML, fracOrInt: fracOrInt, fx: fx, v: v, lin: lin, pow: pow, vec: vec, coord: coord, rec: rec,
    ansNum: ansNum, ansFrac: ansFrac, ansMC: ansMC, parseInput: parseInput, check: check,
    DG: DG, machine: machine, table: table, MINUS: MINUS,
    TOPICS: TOPICS, GENS: GENS, STRANDS: STRANDS, NAMES: NAMES, NAMES_F: NAMES_F, NAMES_M: NAMES_M, topic: topic, def: def, make: make, pool: pool, pick: pick, topicOf: topicOf
  };
  root.MSD = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);

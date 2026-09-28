/* Maths Sports Day — Year 9 (J3T) questions, Cambridge Lower Secondary Stage 9 / Learner's Book 9.
   Tier 1 Bronze, 2 Silver, 3 Gold. Questions are designed to be worked without a calculator (π = 3.14). */
(function (M) {
  'use strict';
  const def = M.def, fmt = M.fmt, paren = M.paren, lin = M.lin, v = M.v, pow = M.pow, F = M.fracHTML, fx = M.fx, mixed = M.mixedHTML,
    ansNum = M.ansNum, ansFrac = M.ansFrac, ansMC = M.ansMC, DG = M.DG, gcd = M.gcd, lcm = M.lcm, fr = M.fr, coord = M.coord,
    MINUS = M.MINUS, NAMES = M.NAMES, NAMES_F = M.NAMES_F, NAMES_M = M.NAMES_M, money = M.money, vec = M.vec, rec = M.rec;
  const Y = 9;
  const x = v('x'), y = v('y'), n = v('n');
  function ord(k) { const s = ['th', 'st', 'nd', 'rd'], m = k % 100; return k + (s[(m - 20) % 10] || s[m] || s[0]); }
  function op(c) { return c < 0 ? ' ' + MINUS + ' ' + fmt(-c) : ' + ' + fmt(c); }
  function sq(t) { return t + '<sup>2</sup>'; }
  function ten(e) { return '10<sup>' + fmt(e) + '</sup>'; }
  function sf(m, e) { return fmt(m) + ' × ' + ten(e); }
  function properFrac(r, dens) { const d = r.pick(dens); let k, g = 0; do { k = r.int(1, d - 1); } while (gcd(k, d) !== 1 && g++ < 30); return fr(k, d); }
  function nthExpr(a, b) { return a < 0 ? lin([[b, ''], [a, n]]) : lin([[a, n], [b, '']]); }
  function fracAns(nu, de, extra) { const f = fr(nu, de); return ansFrac(nu, de, 'any', Object.assign({ allowDecimal: true, show: F(nu, de) + (f.d !== de ? ' = ' + F(f.n, f.d) : '') }, extra || {})); }
  function termDec(d) { while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1; }

  M.topic(Y, 'num', 1, 'Number & calculation', 'N');
  M.topic(Y, 'expr', 2, 'Expressions & formulae', 'A');
  M.topic(Y, 'dpr', 3, 'Decimals, percentages & rounding', 'N');
  M.topic(Y, 'eq', 4, 'Equations & inequalities', 'A');
  M.topic(Y, 'ang', 5, 'Angles & Pythagoras', 'G');
  M.topic(Y, 'inv', 6, 'Statistical investigations', 'S');
  M.topic(Y, 'meas', 7, 'Shapes & measurements', 'G');
  M.topic(Y, 'frac', 8, 'Fractions', 'N');
  M.topic(Y, 'seq', 9, 'Sequences & functions', 'A');
  M.topic(Y, 'graph', 10, 'Graphs', 'A');
  M.topic(Y, 'ratio', 11, 'Ratio & proportion', 'N');
  M.topic(Y, 'prob', 12, 'Probability', 'S');
  M.topic(Y, 'trans', 13, 'Position & transformation', 'G');
  M.topic(Y, 'vol', 14, 'Volume, surface area & symmetry', 'G');
  M.topic(Y, 'stats', 15, 'Interpreting & discussing results', 'S');

  /* ===== Unit 1 Number and calculation ===== */
  def({ id: 'y9-num-irr', year: Y, topic: 'num', tier: 1, quick: true, gen: function (r) {
    const non = r.pick([2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 17, 20]), sqn = r.int(2, 12), f = properFrac(r, [3, 7, 9, 11]);
    return { q: 'Which of these numbers is irrational?', ans: ansMC('√' + non, ['√' + sqn * sqn, F(f.n, f.d), fmt(M.clean(r.int(1, 99) / 100)), '0.' + rec(String(r.int(1, 9)))], r),
      hint: 'A rational number can be written as a fraction. Recurring decimals are rational too!', steps: ['√' + sqn * sqn + ' = ' + sqn + ', fractions, terminating and recurring decimals are all rational.', '√' + non + ' is not a whole number and cannot be written as a fraction, so it is irrational.'] };
  } });

  def({ id: 'y9-num-sf', year: Y, topic: 'num', tier: 1, quick: true, gen: function (r) {
    const m = M.clean(r.int(11, 99) / 10), e = r.int(3, 7);
    if (m === Math.round(m)) return null;
    const ordinary = M.clean(m * Math.pow(10, e));
    return { q: 'Write ' + fmt(ordinary) + ' in standard form.', ans: ansMC(sf(m, e), [sf(M.clean(m * 10), e - 1), sf(m, e - 1), sf(M.clean(m / 10), e + 1), sf(m, e + 1)], r),
      hint: 'Standard form is A × 10<sup>n</sup> where 1 ≤ A &lt; 10.', steps: ['Put the decimal point after the first digit: ' + fmt(m), 'Count how many places it moved: ' + e, fmt(ordinary) + ' = ' + sf(m, e)] };
  } });

  def({ id: 'y9-num-sfsmall', year: Y, topic: 'num', tier: 2, quick: true, gen: function (r) {
    const m = M.clean(r.intNot(11, 99, [20, 30, 40, 50, 60, 70, 80, 90]) / 10), e = r.int(2, 5), ordinary = M.clean(m / Math.pow(10, e));
    if (r.chance(0.5)) return { q: 'Write ' + sf(m, -e) + ' as an ordinary number.', ans: ansNum(ordinary), hint: '× ' + ten(-e) + ' means divide by ' + fmt(Math.pow(10, e)) + '.', steps: [fmt(m) + ' ÷ ' + fmt(Math.pow(10, e)) + ' = ' + fmt(ordinary)] };
    return { q: 'Write ' + fmt(ordinary) + ' in standard form.', ans: ansMC(sf(m, -e), [sf(m, -e + 1), sf(M.clean(m * 10), -e - 1), sf(m, e)], r), hint: 'Move the decimal point to just after the first non-zero digit.',
      steps: ['The first non-zero digit gives ' + fmt(m) + '.', 'The point moved ' + e + ' places right, so the index is ' + fmt(-e) + '.', 'Answer: ' + sf(m, -e)] };
  } });

  def({ id: 'y9-num-negidx', year: Y, topic: 'num', tier: 2, quick: true, gen: function (r) {
    const opts = [[2, 1], [2, 2], [2, 3], [2, 4], [3, 1], [3, 2], [3, 3], [4, 2], [5, 1], [5, 2], [5, 3], [10, 2], [10, 3]], o = r.pick(opts), d = Math.pow(o[0], o[1]);
    return { q: 'Work out ' + pow(o[0], -o[1]) + '<br><small>Give your answer as a fraction.</small>', ans: ansFrac(1, d, 'any', { allowDecimal: termDec(d) }), hint: 'A negative index means “one over”: ' + pow(v('a'), MINUS + v('n')) + ' = ' + fx(1, pow(v('a'), v('n'))) + '.',
      steps: [pow(o[0], -o[1]) + ' = ' + fx(1, pow(o[0], o[1])) + ' = ' + F(1, d)] };
  } });

  def({ id: 'y9-num-idxlaws', year: Y, topic: 'num', tier: 2, quick: true, gen: function (r) {
    const a = r.int(2, 9), m = r.int(2, 6), k = r.int(2, 5);
    if (r.chance(0.5)) return { q: 'Simplify (' + pow(a, m) + ')<sup>' + k + '</sup><br><small>Give your answer as a single power of ' + a + '.</small>', ans: ansMC(pow(a, m * k), [pow(a, m + k), pow(a, m * k + 1), pow(a * k, m)], r),
      hint: 'A power of a power: multiply the indices.', steps: ['(' + pow(a, m) + ')<sup>' + k + '</sup> = ' + a + '<sup>' + m + ' × ' + k + '</sup> = ' + pow(a, m * k)] };
    const p = r.int(2, 7), q = r.int(2, 9);
    if (p === q) return null;
    return { q: 'Simplify ' + pow(a, p) + ' × ' + pow(a, -q) + '<br><small>Give your answer as a single power of ' + a + '.</small>', ans: ansMC(pow(a, p - q), [pow(a, p + q), pow(a, -p * q), pow(a, q - p)], r),
      hint: 'Add the indices, taking care with the negative sign.', steps: [pow(a, p) + ' × ' + pow(a, -q) + ' = ' + a + '<sup>' + p + ' + (' + MINUS + q + ')</sup> = ' + pow(a, p - q)] };
  } });

  def({ id: 'y9-num-sfcalc', year: Y, topic: 'num', tier: 3, quick: false, gen: function (r) {
    const p = r.int(2, 9), q = r.int(2, 9), a = r.int(2, 8), b = r.int(2, 7);
    if (r.chance(0.5)) {
      const P = p * q, big = P >= 10, mm = big ? M.clean(P / 10) : P, ee = big ? a + b + 1 : a + b;
      const ds = [sf(mm, a * b), sf(mm, ee + (big ? -1 : 1)), sf(mm, ee + (big ? 1 : -1))];
      if (big) ds.push(fmt(P) + ' × ' + ten(a + b)); else ds.push(sf(p + q, a + b));
      return { q: 'Work out (' + sf(p, a) + ') × (' + sf(q, b) + ')<br><small>Give your answer in standard form.</small>', ans: ansMC(sf(mm, ee), ds, r), hint: 'Multiply the numbers, add the powers of 10, then check the answer is in standard form.',
        steps: [p + ' × ' + q + ' = ' + P + ', ' + ten(a) + ' × ' + ten(b) + ' = ' + ten(a + b), P + ' × ' + ten(a + b) + (big ? ' = ' + sf(mm, ee) : ''), 'Answer: ' + sf(mm, ee)] };
    }
    const kq = r.int(2, 4), k = r.int(2, 9), top = kq * k;
    if (top > 9) return null;
    const hi = a + b, lo = r.int(1, hi - 1);
    return { q: 'Work out (' + sf(top, hi) + ') ÷ (' + sf(kq, lo) + ')<br><small>Give your answer in standard form.</small>', ans: ansMC(sf(k, hi - lo), [sf(k, hi + lo), sf(top - kq, hi - lo), sf(k, Math.round(hi / lo) === hi / lo ? hi / lo : hi - lo + 1)], r),
      hint: 'Divide the numbers, subtract the powers of 10.', steps: [top + ' ÷ ' + kq + ' = ' + k, ten(hi) + ' ÷ ' + ten(lo) + ' = ' + ten(hi - lo), 'Answer: ' + sf(k, hi - lo)] };
  } });

  def({ id: 'y9-num-surd', year: Y, topic: 'num', tier: 2, quick: true, gen: function (r) {
    const lo = r.int(2, 11), N = r.int(lo * lo + 1, (lo + 1) * (lo + 1) - 1);
    const half = Math.floor(N / 2);
    return { q: 'Between which two consecutive whole numbers does √' + N + ' lie?', ans: ansMC(lo + ' and ' + (lo + 1), [(lo - 1) + ' and ' + lo, (lo + 1) + ' and ' + (lo + 2), half + ' and ' + (half + 1)], r),
      hint: 'Find the square numbers either side of ' + N + '.', steps: [pow(lo, 2) + ' = ' + lo * lo + ' and ' + pow(lo + 1, 2) + ' = ' + (lo + 1) * (lo + 1), lo * lo + ' &lt; ' + N + ' &lt; ' + (lo + 1) * (lo + 1) + ', so ' + lo + ' &lt; √' + N + ' &lt; ' + (lo + 1)] };
  } });

  /* ===== Unit 2 Expressions and formulae ===== */
  def({ id: 'y9-expr-sub', year: Y, topic: 'expr', tier: 1, quick: true, gen: function (r) {
    if (r.chance(0.5)) { const a = -r.int(1, 5), b = r.int(1, 8), res = 3 * a * a - 2 * b;
      return { q: 'Find the value of 3' + sq(v('a')) + ' ' + MINUS + ' 2' + v('b') + ' when ' + v('a') + ' = ' + fmt(a) + ' and ' + v('b') + ' = ' + b + '.', ans: ansNum(res), hint: 'Square before multiplying by 3.', steps: ['3 × (' + fmt(a) + ')<sup>2</sup> = ' + 3 * a * a, '2 × ' + b + ' = ' + 2 * b, 3 * a * a + ' ' + MINUS + ' ' + 2 * b + ' = ' + fmt(res)] }; }
    const k = r.pick([2, 4]), xv = k * r.nonZero(-6, 6), c = r.nonZero(-9, 9), res = xv / k + c;
    return { q: 'Find the value of ' + fx(x, k) + op(c) + ' when ' + x + ' = ' + fmt(xv) + '.', ans: ansNum(res), hint: 'Divide ' + fmt(xv) + ' by ' + k + ' first.', steps: [fmt(xv) + ' ÷ ' + k + ' = ' + fmt(xv / k), fmt(xv / k) + op(c) + ' = ' + fmt(res)] };
  } });

  def({ id: 'y9-expr-dbl', year: Y, topic: 'expr', tier: 2, quick: true, gen: function (r) {
    const a = r.nonZero(-9, 9), b = r.nonZero(-9, 9), s = a + b, p = a * b;
    const X2 = sq(x), correct = lin([[1, X2], [s, x], [p, '']]);
    return { q: 'Expand and simplify (' + lin([[1, x], [a, '']]) + ')(' + lin([[1, x], [b, '']]) + ')', ans: ansMC(correct, [lin([[1, X2], [p, '']]), lin([[1, X2], [s, x], [-p, '']]), lin([[1, X2], [p, x], [s, '']]), lin([[1, X2], [-s, x], [p, '']])], r),
      hint: 'Multiply each term in the first bracket by each term in the second (FOIL).', steps: [x + ' × ' + x + ' = ' + X2 + ', ' + x + ' × ' + paren(b) + ' = ' + lin([[b, x]]) + ', ' + fmt(a) + ' × ' + x + ' = ' + lin([[a, x]]) + ', ' + fmt(a) + ' × ' + paren(b) + ' = ' + fmt(p), 'Collect: ' + correct] };
  } });

  def({ id: 'y9-expr-sq', year: Y, topic: 'expr', tier: 3, quick: false, gen: function (r) {
    const a = r.nonZero(-9, 9), X2 = sq(x), correct = lin([[1, X2], [2 * a, x], [a * a, '']]);
    return { q: 'Expand and simplify (' + lin([[1, x], [a, '']]) + ')<sup>2</sup>', ans: ansMC(correct, [lin([[1, X2], [a * a, '']]), lin([[1, X2], [a, x], [a * a, '']]), lin([[1, X2], [2 * a, x], [2 * a, '']]), lin([[1, X2], [-2 * a, x], [a * a, '']])], r),
      hint: 'Write it as (' + lin([[1, x], [a, '']]) + ')(' + lin([[1, x], [a, '']]) + ').', steps: ['(' + lin([[1, x], [a, '']]) + ')(' + lin([[1, x], [a, '']]) + ') = ' + lin([[1, X2], [a, x], [a, x], [a * a, '']]), '= ' + correct] };
  } });

  def({ id: 'y9-expr-idx', year: Y, topic: 'expr', tier: 2, quick: true, gen: function (r) {
    const t = r.int(0, 2), A = v('a');
    if (t === 0) { const m = r.int(2, 8), k = r.int(2, 7); return { q: 'Simplify ' + pow(x, m) + ' × ' + pow(x, k), ans: ansMC(pow(x, m + k), [pow(x, m * k), '2' + pow(x, m + k), pow(x, Math.abs(m - k) || m + k + 1)], r), hint: 'Add the indices.', steps: [pow(x, m) + ' × ' + pow(x, k) + ' = ' + pow(x, m + k)] }; }
    if (t === 1) { const k = r.int(2, 5), m = r.int(2, 5); return { q: 'Simplify (' + k + pow(A, m) + ')<sup>2</sup>', ans: ansMC(k * k + pow(A, 2 * m), [k + pow(A, 2 * m), 2 * k + pow(A, 2 * m), k * k + pow(A, m + 2), k * k + pow(A, 2 * m + 1), k + pow(A, m + 2)], r), hint: 'Square the number AND the power of ' + A + '.', steps: [k + '<sup>2</sup> = ' + k * k, '(' + pow(A, m) + ')<sup>2</sup> = ' + pow(A, 2 * m), 'Answer: ' + k * k + pow(A, 2 * m)] }; }
    const q = r.int(2, 6), c = r.int(2, 5), p = q * c, m = r.int(5, 9), k = r.int(2, m - 2);
    return { q: 'Simplify ' + fx(p + pow(x, m), q + pow(x, k)), ans: ansMC(c + pow(x, m - k), [c + pow(x, m + k), (p - q) + pow(x, m - k), c + pow(x, Math.round(m / k) === m / k ? m / k : m * k)], r), hint: 'Divide the numbers and subtract the indices.', steps: [p + ' ÷ ' + q + ' = ' + c, pow(x, m) + ' ÷ ' + pow(x, k) + ' = ' + pow(x, m - k), 'Answer: ' + c + pow(x, m - k)] };
  } });

  def({ id: 'y9-expr-afrac', year: Y, topic: 'expr', tier: 3, quick: false, gen: function (r) {
    const pr = r.pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6], [3, 7]]), a = pr[0], b = pr[1];
    const add = r.chance(0.5), top = add ? a + b : b - a, correct = fx((top === 1 ? '' : top) + x, a * b);
    return { q: 'Simplify ' + fx(x, a) + (add ? ' + ' : ' ' + MINUS + ' ') + fx(x, b), ans: ansMC(correct, [fx((add ? 2 : '') + x, add ? a + b : b - a), fx(x, a * b), fx((add ? a + b : Math.abs(a - b) + 1) + x, a + b)], r),
      hint: 'Use a common denominator of ' + a * b + '.', steps: [fx(x, a) + ' = ' + fx(b + x, a * b) + ', ' + fx(x, b) + ' = ' + fx(a + x, a * b), fx(b + x, a * b) + (add ? ' + ' : ' ' + MINUS + ' ') + fx(a + x, a * b) + ' = ' + correct] };
  } });

  def({ id: 'y9-expr-subject', year: Y, topic: 'expr', tier: 3, quick: false, gen: function (r) {
    const t = r.int(0, 2);
    if (t === 0) { const A = v('A'), b = v('b'), h = v('h');
      return { q: 'Make ' + h + ' the subject of ' + A + ' = ' + F(1, 2) + b + h, ans: ansMC(h + ' = ' + fx('2' + A, b), [h + ' = ' + fx(A, '2' + b), h + ' = ' + fx('2' + b, A), h + ' = 2' + A + ' ' + MINUS + ' ' + b], r),
        hint: 'Multiply both sides by 2, then divide by ' + b + '.', steps: ['2' + A + ' = ' + b + h, h + ' = ' + fx('2' + A, b)] }; }
    if (t === 1) { const C = v('C'), rr = v('r');
      return { q: 'Make ' + rr + ' the subject of ' + C + ' = 2π' + rr, ans: ansMC(rr + ' = ' + fx(C, '2π'), [rr + ' = 2π' + C, rr + ' = ' + C + ' ' + MINUS + ' 2π', rr + ' = ' + fx('2' + C, 'π')], r), hint: 'Divide both sides by 2π.', steps: [rr + ' = ' + fx(C, '2π')] }; }
    const a = r.int(2, 9), b = r.int(2, 6);
    return { q: 'Make ' + x + ' the subject of ' + y + ' = ' + fx(x + ' + ' + a, b), ans: ansMC(x + ' = ' + b + y + ' ' + MINUS + ' ' + a, [x + ' = ' + fx(y + ' ' + MINUS + ' ' + a, b), x + ' = ' + b + y + ' + ' + a, x + ' = ' + b + '(' + y + ' + ' + a + ')'], r),
      hint: 'Multiply both sides by ' + b + ', then subtract ' + a + '.', steps: [b + y + ' = ' + x + ' + ' + a, x + ' = ' + b + y + ' ' + MINUS + ' ' + a] };
  } });

  def({ id: 'y9-expr-formula', year: Y, topic: 'expr', tier: 2, quick: false, gen: function (r) {
    if (r.chance(0.5)) { const u = r.int(0, 10), a = 2 * r.int(1, 5), t = r.int(2, 6), s = u * t + a * t * t / 2;
      return { q: 'Use ' + v('s') + ' = ' + v('u') + v('t') + ' + ' + F(1, 2) + v('a') + sq(v('t')) + ' to find ' + v('s') + ' when ' + v('u') + ' = ' + u + ', ' + v('a') + ' = ' + a + ' and ' + v('t') + ' = ' + t + '.', ans: ansNum(s), hint: 'Square ' + v('t') + ' before multiplying.',
        steps: [u + ' × ' + t + ' = ' + u * t, F(1, 2) + ' × ' + a + ' × ' + pow(t, 2) + ' = ' + a * t * t / 2, v('s') + ' = ' + u * t + ' + ' + a * t * t / 2 + ' = ' + s] }; }
    const m = 2 * r.int(1, 6), vv = r.int(2, 10), E = m * vv * vv / 2;
    return { q: 'Kinetic energy is given by ' + v('E') + ' = ' + F(1, 2) + v('m') + sq(v('v')) + '. Find ' + v('E') + ' when ' + v('m') + ' = ' + m + ' and ' + v('v') + ' = ' + vv + '.', ans: ansNum(E), hint: 'Square ' + v('v') + ' first.', steps: [pow(vv, 2) + ' = ' + vv * vv, F(1, 2) + ' × ' + m + ' × ' + vv * vv + ' = ' + E] };
  } });

  /* ===== Unit 3 Decimals, percentages and rounding ===== */
  def({ id: 'y9-dpr-pow10', year: Y, topic: 'dpr', tier: 1, quick: true, gen: function (r) {
    const num = M.clean(r.int(2, 999) / Math.pow(10, r.int(0, 2))), e = r.pick([-3, -2, -1, 2, 3]), res = M.clean(num * Math.pow(10, e));
    return { q: 'Work out ' + fmt(num) + ' × ' + ten(e), ans: ansNum(res), hint: e < 0 ? '× ' + ten(e) + ' is the same as ÷ ' + fmt(Math.pow(10, -e)) + '.' : '× ' + ten(e) + ' is the same as × ' + fmt(Math.pow(10, e)) + '.',
      steps: [fmt(num) + ' × ' + ten(e) + ' = ' + fmt(num) + (e < 0 ? ' ÷ ' + fmt(Math.pow(10, -e)) : ' × ' + fmt(Math.pow(10, e))), '= ' + fmt(res)] };
  } });

  def({ id: 'y9-dpr-bounds', year: Y, topic: 'dpr', tier: 2, quick: true, gen: function (r) {
    const t = r.int(0, 2), upper = r.chance(0.5);
    let val, half, desc, unit;
    if (t === 0) { val = M.clean(r.int(11, 199) / 10); half = 0.05; desc = 'correct to 1 decimal place'; unit = r.pick(['cm', 'm', 'kg']); }
    else if (t === 1) { val = 10 * r.int(2, 99); half = 5; desc = 'correct to the nearest 10'; unit = r.pick(['g', 'm', 'ml']); }
    else { val = r.int(2, 99); half = 0.5; desc = 'correct to the nearest whole number'; unit = r.pick(['cm', 'kg', 'seconds']); }
    const b = M.clean(upper ? val + half : val - half);
    return { q: 'A measurement is ' + fmt(val) + ' ' + unit + ', ' + desc + '. What is its ' + (upper ? 'upper' : 'lower') + ' bound?', ans: ansNum(b), hint: 'The bound is half a unit of rounding away from ' + fmt(val) + '.',
      steps: ['Half of the rounding unit is ' + fmt(half) + '.', fmt(val) + (upper ? ' + ' : ' ' + MINUS + ' ') + fmt(half) + ' = ' + fmt(b) + ' ' + unit] };
  } });

  def({ id: 'y9-dpr-comp', year: Y, topic: 'dpr', tier: 3, quick: false, gen: function (r) {
    const t = r.int(0, 2);
    if (t === 0) { const P = r.pick([100, 200, 400, 500, 1000, 2000]), pc = r.pick([2, 3, 4, 5, 10]), res = M.roundTo(P * Math.pow(1 + pc / 100, 2), 2);
      return { q: 'RM' + fmt(P) + ' is invested at ' + pc + '% compound interest per year. How much, in RM, is it worth after 2 years?', ans: ansNum(res, { show: money(res) }), hint: 'Multiply by ' + fmt(M.clean(1 + pc / 100)) + ' once for each year.',
        steps: ['Multiplier = ' + fmt(M.clean(1 + pc / 100)), fmt(P) + ' × ' + fmt(M.clean(1 + pc / 100)) + '<sup>2</sup> = ' + money(res)] }; }
    if (t === 1) { const V = 1000 * r.pick([20, 30, 40, 50, 60, 80]), pc = r.pick([10, 20]), res = M.clean(V * Math.pow(1 - pc / 100, 2));
      return { q: 'A car is worth RM' + fmt(V) + '. Its value falls by ' + pc + '% each year. What is it worth, in RM, after 2 years?', ans: ansNum(res, { show: 'RM' + fmt(res) }), hint: 'Multiply by ' + fmt(M.clean(1 - pc / 100)) + ' for each year. It is NOT a ' + 2 * pc + '% decrease.',
        steps: ['After 1 year: ' + fmt(V) + ' × ' + fmt(M.clean(1 - pc / 100)) + ' = ' + fmt(M.clean(V * (1 - pc / 100))), 'After 2 years: ' + fmt(M.clean(V * (1 - pc / 100))) + ' × ' + fmt(M.clean(1 - pc / 100)) + ' = RM' + fmt(res)] }; }
    const P = r.pick([100, 200, 400, 500, 800]), pc = r.pick([10, 20, 25]), res = M.clean(P * (1 + pc / 100) * (1 - pc / 100));
    return { q: 'A price of RM' + P + ' is increased by ' + pc + '%. The new price is then decreased by ' + pc + '%. What is the final price, in RM?', ans: ansNum(res), hint: 'The second percentage is of the NEW price.',
      steps: ['After increase: ' + P + ' × ' + fmt(M.clean(1 + pc / 100)) + ' = ' + fmt(M.clean(P * (1 + pc / 100))), 'After decrease: ' + fmt(M.clean(P * (1 + pc / 100))) + ' × ' + fmt(M.clean(1 - pc / 100)) + ' = ' + fmt(res)] };
  } });

  def({ id: 'y9-dpr-change', year: Y, topic: 'dpr', tier: 2, quick: false, gen: function (r) {
    const old = r.pick([40, 50, 80, 120, 150, 200, 250, 400, 2400]), p = r.pick([4, 5, 8, 10, 12, 15, 20, 25, 30, 35]), inc = r.chance(0.5), nw = M.clean(old * (inc ? 1 + p / 100 : 1 - p / 100));
    if (nw !== Math.round(nw)) return null;
    const what = r.pick(['The population of a village', 'The number of members of a sports club', 'The number of visitors to a website in a day']);
    return { q: what + ' changed from ' + fmt(old) + ' to ' + fmt(nw) + '. Find the percentage ' + (inc ? 'increase' : 'decrease') + '.', ans: ansNum(p), hint: 'Percentage change = actual change ÷ original value × 100.',
      steps: ['Actual change = ' + fmt(Math.abs(nw - old)), fmt(Math.abs(nw - old)) + ' ÷ ' + fmt(old) + ' × 100 = ' + p + '%'] };
  } });

  def({ id: 'y9-dpr-decimal', year: Y, topic: 'dpr', tier: 1, quick: true, gen: function (r) {
    if (r.chance(0.5)) { const a = M.clean(r.intNot(2, 49, [10, 20, 30, 40]) / 100), b = M.clean(r.int(2, 9) / 10), res = M.clean(a * b);
      return { q: 'Work out ' + fmt(a) + ' × ' + fmt(b), ans: ansNum(res), hint: 'Multiply the digits, then count decimal places.', steps: [Math.round(a * 100) + ' × ' + Math.round(b * 10) + ' = ' + Math.round(a * 100) * Math.round(b * 10), '3 decimal places: ' + fmt(res)] }; }
    const b = M.clean(r.int(11, 19) / 100), q = r.int(2, 12), a = M.clean(b * q);
    return { q: 'Work out ' + fmt(a) + ' ÷ ' + fmt(b), ans: ansNum(q), hint: 'Multiply both numbers by 100 first.', steps: [fmt(a) + ' ÷ ' + fmt(b) + ' = ' + fmt(M.clean(a * 100)) + ' ÷ ' + fmt(M.clean(b * 100)), '= ' + q] };
  } });

  /* ===== Unit 4 Equations and inequalities ===== */
  def({ id: 'y9-eq-brk', year: Y, topic: 'eq', tier: 1, quick: false, gen: function (r) {
    const c = r.int(2, 4), a = r.int(c + 1, c + 4), k = r.int(-4, 12); let b = r.nonZero(-6, 6), d = null;
    for (let t = 0; t < 30; t++) { const lhs = a * (k + b); if (lhs % c === 0) { d = lhs / c - k; break; } b = r.nonZero(-6, 6); }
    if (d === null || d === 0 || d === b) return null;
    return { q: 'Solve ' + a + '(' + lin([[1, x], [b, '']]) + ') = ' + c + '(' + lin([[1, x], [d, '']]) + ')', ans: ansNum(k), hint: 'Expand both brackets first.',
      steps: [lin([[a, x], [a * b, '']]) + ' = ' + lin([[c, x], [c * d, '']]), lin([[a - c, x]]) + ' = ' + fmt(c * d - a * b), x + ' = ' + fmt(k)] };
  } });

  def({ id: 'y9-eq-frac', year: Y, topic: 'eq', tier: 3, quick: false, gen: function (r) {
    const c = r.pick([2, 3, 4, 5]), f = r.intNot(2, 5, [c]), a = r.int(1, 3), d = r.int(1, 3), k = r.int(-5, 12), K = r.int(-3, 8);
    if (a * f === d * c) return null;
    const b = c * K - a * k, e = f * K - d * k;
    if (b === 0 || e === 0 || Math.abs(b) > 25 || Math.abs(e) > 25) return null;
    return { q: 'Solve ' + fx(lin([[a, x], [b, '']]), c) + ' = ' + fx(lin([[d, x], [e, '']]), f), ans: ansNum(k), hint: 'Multiply both sides by ' + c + ' × ' + f + ' = ' + c * f + ' (cross-multiply).',
      steps: [f + '(' + lin([[a, x], [b, '']]) + ') = ' + c + '(' + lin([[d, x], [e, '']]) + ')', lin([[a * f, x], [b * f, '']]) + ' = ' + lin([[c * d, x], [c * e, '']]), lin([[a * f - c * d, x]]) + ' = ' + fmt(c * e - b * f), x + ' = ' + fmt(k)] };
  } });

  def({ id: 'y9-eq-denom', year: Y, topic: 'eq', tier: 2, quick: false, gen: function (r) {
    const t = r.int(0, 2);
    if (t === 0) { const m = r.int(2, 9), k = r.int(2, 12); return { q: 'Solve ' + fx(m * k, x) + ' = ' + m, ans: ansNum(k), hint: 'Multiply both sides by ' + x + '.', steps: [m * k + ' = ' + m + x, x + ' = ' + m * k + ' ÷ ' + m + ' = ' + k] }; }
    if (t === 1) { const m = r.int(2, 6), q = r.int(2, 8), a = r.nonZero(-5, 5), k = q - a; return { q: 'Solve ' + fx(m * q, lin([[1, x], [a, '']])) + ' = ' + m, ans: ansNum(k), hint: 'Multiply both sides by (' + lin([[1, x], [a, '']]) + ').', steps: [m * q + ' = ' + m + '(' + lin([[1, x], [a, '']]) + ')', lin([[1, x], [a, '']]) + ' = ' + q, x + ' = ' + fmt(k)] }; }
    const m = r.int(2, 5), k = r.int(2, 9), kk = (m - 1) * k;
    return { q: 'Solve ' + fx(x + ' + ' + kk, x) + ' = ' + m, ans: ansNum(k), hint: 'Multiply both sides by ' + x + ', then collect the ' + x + ' terms.', steps: [x + ' + ' + kk + ' = ' + m + x, kk + ' = ' + (m - 1 === 1 ? '' : m - 1) + x, x + ' = ' + k] };
  } });

  def({ id: 'y9-eq-sim', year: Y, topic: 'eq', tier: 3, quick: false, gen: function (r) {
    const X = r.int(-3, 9), Yv = r.int(-3, 9), askX = r.chance(0.5);
    if (r.chance(0.4)) {
      const s = X + Yv, d = X - Yv;
      return { q: 'Solve the simultaneous equations:<br>' + x + ' + ' + y + ' = ' + fmt(s) + '<br>' + x + ' ' + MINUS + ' ' + y + ' = ' + fmt(d) + '<br>What is the value of ' + (askX ? x : y) + '?', ans: ansNum(askX ? X : Yv), hint: 'Add the two equations to eliminate ' + y + '.',
        steps: ['Add: 2' + x + ' = ' + fmt(s + d) + ', so ' + x + ' = ' + fmt(X), 'Substitute: ' + fmt(X) + ' + ' + y + ' = ' + fmt(s) + ', so ' + y + ' = ' + fmt(Yv)] };
    }
    const a = r.int(2, 5), b = r.intNot(1, 5, [a]), c1 = a * X + b * Yv, c2 = X + Yv;
    return { q: 'Solve the simultaneous equations:<br>' + lin([[a, x], [b, y]]) + ' = ' + fmt(c1) + '<br>' + x + ' + ' + y + ' = ' + fmt(c2) + '<br>What is the value of ' + (askX ? x : y) + '?', ans: ansNum(askX ? X : Yv), hint: 'Multiply the second equation by ' + b + ' and subtract.',
      steps: [b + ' × (second): ' + lin([[b, x], [b, y]]) + ' = ' + fmt(b * c2), 'Subtract: ' + lin([[a - b, x]]) + ' = ' + fmt(c1 - b * c2), x + ' = ' + fmt(X) + ', then ' + y + ' = ' + fmt(c2) + ' ' + MINUS + ' ' + paren(X) + ' = ' + fmt(Yv)] };
  } });

  def({ id: 'y9-eq-ineq', year: Y, topic: 'eq', tier: 2, quick: true, gen: function (r) {
    const k = r.int(-5, 9), a = r.int(2, 6);
    if (r.chance(0.5)) {
      const b = r.nonZero(-10, 12), c = a * k + b, strict = r.chance(0.5), sym = strict ? ' &gt; ' : ' ≥ ', rev = strict ? ' &lt; ' : ' ≤ ';
      return { q: 'Solve ' + lin([[a, x], [b, '']]) + sym + fmt(c), ans: ansMC(x + sym + fmt(k), [x + rev + fmt(k), x + sym + fmt(k + 1), x + sym + fmt(c - b)].filter(function (s) { return s !== x + sym + fmt(k); }), r),
        hint: 'Solve it like an equation, keeping the inequality sign.', steps: [lin([[a, x]]) + sym + fmt(c - b), x + sym + fmt(k)] };
    }
    const b = r.int(1, 15), c = b - a * k, strict = r.chance(0.5), sym = strict ? ' &lt; ' : ' ≤ ', flip = strict ? ' &gt; ' : ' ≥ ';
    return { q: 'Solve ' + lin([[b, ''], [-a, x]]) + sym + fmt(c), ans: ansMC(x + flip + fmt(k), [x + sym + fmt(k), x + flip + fmt(-k === k ? k + 1 : -k), x + sym + fmt(-k === k ? k - 1 : -k)], r),
      hint: 'When you divide by a negative number, reverse the inequality sign.', steps: [lin([[-a, x]]) + sym + fmt(c - b), 'Divide by ' + fmt(-a) + ' and reverse the sign: ' + x + flip + fmt(k)] };
  } });

  def({ id: 'y9-eq-ineqint', year: Y, topic: 'eq', tier: 3, quick: false, gen: function (r) {
    const a = r.int(2, 7), b = r.nonZero(-9, 12), c = r.int(10, 60), bound = (c - b) / a, strict = r.chance(0.6);
    let ans = Math.floor(bound); if (strict && ans === bound) ans = bound - 1;
    return { q: 'What is the largest integer ' + x + ' that satisfies ' + lin([[a, x], [b, '']]) + (strict ? ' &lt; ' : ' ≤ ') + c + '?', ans: ansNum(ans), hint: 'Solve the inequality, then pick the largest whole number allowed.',
      steps: [lin([[a, x]]) + (strict ? ' &lt; ' : ' ≤ ') + (c - b), x + (strict ? ' &lt; ' : ' ≤ ') + (Number.isInteger(bound) ? bound : fx(c - b, a) + ' = ' + fmt(M.roundTo(bound, 2)) + (M.roundTo(bound, 2) !== bound ? '…' : '')), 'Largest integer: ' + ans] };
  } });

  /* ===== Unit 5 Angles (and Pythagoras' theorem) ===== */
  const POLY = { 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon', 12: 'dodecagon (12 sides)' };
  def({ id: 'y9-ang-sum', year: Y, topic: 'ang', tier: 1, quick: true, gen: function (r) {
    const k = r.pick([5, 6, 7, 8, 9, 10, 12, 15, 20]);
    return { q: 'What is the sum of the interior angles of ' + (POLY[k] ? 'a ' + POLY[k] : 'a polygon with ' + k + ' sides') + ', in degrees?', ans: ansNum((k - 2) * 180), hint: 'Sum of interior angles = (n − 2) × 180°.', steps: ['(' + k + ' ' + MINUS + ' 2) × 180 = ' + (k - 2) + ' × 180 = ' + (k - 2) * 180 + '°'] };
  } });

  def({ id: 'y9-ang-reg', year: Y, topic: 'ang', tier: 2, quick: true, gen: function (r) {
    const k = r.pick([5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36]), ext = 360 / k, t = r.int(0, 2);
    const name = POLY[k] ? 'a regular ' + POLY[k] : 'a regular polygon with ' + k + ' sides';
    if (t === 0) return { q: 'What is the size of each exterior angle of ' + name + ', in degrees?', ans: ansNum(ext), hint: 'The exterior angles of any polygon add up to 360°.', steps: ['360 ÷ ' + k + ' = ' + ext + '°'] };
    if (t === 1) return { q: 'What is the size of each interior angle of ' + name + ', in degrees?', ans: ansNum(180 - ext), hint: 'Find the exterior angle first: 360° ÷ ' + k + '.', steps: ['Exterior angle = 360 ÷ ' + k + ' = ' + ext + '°', 'Interior angle = 180 ' + MINUS + ' ' + ext + ' = ' + (180 - ext) + '°'] };
    const useInt = r.chance(0.5);
    return { q: 'Each ' + (useInt ? 'interior' : 'exterior') + ' angle of a regular polygon is ' + (useInt ? 180 - ext : ext) + '°. How many sides does it have?', ans: ansNum(k), hint: 'Number of sides = 360° ÷ exterior angle.',
      steps: [useInt ? 'Exterior angle = 180 ' + MINUS + ' ' + (180 - ext) + ' = ' + ext + '°' : 'Exterior angle = ' + ext + '°', 'Sides = 360 ÷ ' + ext + ' = ' + k] };
  } });

  def({ id: 'y9-ang-missing', year: Y, topic: 'ang', tier: 3, quick: false, gen: function (r) {
    const k = r.pick([5, 6]), S = (k - 2) * 180, known = [];
    for (let i = 0; i < k - 1; i++) known.push(r.int(95, 150));
    const last = S - known.reduce(function (a, b) { return a + b; }, 0);
    if (last < 70 || last > 170) return null;
    return { q: 'A ' + POLY[k] + ' has angles of ' + known.join('°, ') + '° and ' + x + '°. Find the value of ' + x + '.', ans: ansNum(last), hint: 'First find the sum of the interior angles of a ' + POLY[k] + '.',
      steps: ['Sum = (' + k + ' ' + MINUS + ' 2) × 180 = ' + S + '°', 'Known angles add to ' + (S - last) + '°', x + ' = ' + S + ' ' + MINUS + ' ' + (S - last) + ' = ' + last] };
  } });

  const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20], [20, 21, 29], [10, 24, 26], [15, 20, 25], [12, 35, 37], [9, 40, 41]];
  def({ id: 'y9-pyth-hyp', year: Y, topic: 'ang', tier: 2, quick: false, gen: function (r) {
    const t = r.pick(TRIPLES), swap = r.chance(0.5), a = swap ? t[1] : t[0], b = swap ? t[0] : t[1];
    return { q: 'Find the length of the hypotenuse, ' + x + ' cm.', dg: DG.rightTri(a + ' cm', b + ' cm', 'x'), ans: ansNum(t[2]), hint: 'Pythagoras: ' + sq(v('a')) + ' + ' + sq(v('b')) + ' = ' + sq(v('c')) + ', where ' + v('c') + ' is the hypotenuse.',
      steps: [sq(x) + ' = ' + pow(a, 2) + ' + ' + pow(b, 2) + ' = ' + a * a + ' + ' + b * b + ' = ' + t[2] * t[2], x + ' = √' + t[2] * t[2] + ' = ' + t[2] + ' cm'] };
  } });

  def({ id: 'y9-pyth-leg', year: Y, topic: 'ang', tier: 3, quick: false, gen: function (r) {
    const t = r.pick(TRIPLES), giveFirst = r.chance(0.5), known = giveFirst ? t[0] : t[1], unknown = giveFirst ? t[1] : t[0];
    const dg = giveFirst ? DG.rightTri(known + ' cm', 'x', t[2] + ' cm') : DG.rightTri('x', known + ' cm', t[2] + ' cm');
    return { q: 'Find the value of ' + x + ', in cm.', dg: dg, ans: ansNum(unknown), hint: 'For a shorter side, subtract: ' + sq(v('a')) + ' = ' + sq(v('c')) + ' − ' + sq(v('b')) + '.',
      steps: [sq(x) + ' = ' + pow(t[2], 2) + ' ' + MINUS + ' ' + pow(known, 2) + ' = ' + t[2] * t[2] + ' ' + MINUS + ' ' + known * known + ' = ' + unknown * unknown, x + ' = √' + unknown * unknown + ' = ' + unknown + ' cm'] };
  } });

  def({ id: 'y9-pyth-check', year: Y, topic: 'ang', tier: 2, quick: true, gen: function (r) {
    const t = r.pick(TRIPLES), bad = []; let g = 0;
    while (bad.length < 3 && g++ < 200) {
      const a = r.int(3, 20), b = r.int(a + 1, a + 12), c = r.int(b + 1, b + 6);
      const s = a + ', ' + b + ', ' + c;
      if (a * a + b * b !== c * c && bad.indexOf(s) < 0) bad.push(s);
    }
    return { q: 'Which set of lengths (in cm) could be the sides of a right-angled triangle?', ans: ansMC(t.join(', '), bad, r), hint: 'Check whether the two smaller squares add up to the largest square.',
      steps: [pow(t[0], 2) + ' + ' + pow(t[1], 2) + ' = ' + t[0] * t[0] + ' + ' + t[1] * t[1] + ' = ' + t[2] * t[2] + ' = ' + pow(t[2], 2), 'So ' + t.join(', ') + ' works (Pythagoras).'] };
  } });

  def({ id: 'y9-ang-par', year: Y, topic: 'ang', tier: 1, quick: true, gen: function (r) {
    let th, g = 0; do { th = r.int(40, 140); } while (th >= 80 && th <= 100 && g++ < 50);
    const pos = ['AR', 'AL', 'BL', 'BR'], p1 = r.pick(pos), p2 = r.pick(pos), val = { AR: th, AL: 180 - th, BL: th, BR: 180 - th }, info = M.parallelInfo(p1, p2);
    return { q: 'The horizontal lines are parallel. Find the value of ' + x + '.', dg: DG.parallel(th, [{ at: 'top', pos: p1, lab: val[p1] }, { at: 'bot', pos: p2, lab: 'x' }]), ans: ansNum(val[p2]),
      hint: 'Corresponding and alternate angles are equal.', steps: [info.why, info.same ? x + ' = ' + val[p2] + '°' : x + ' = 180 ' + MINUS + ' ' + val[p1] + ' = ' + val[p2] + '°'] };
  } });

  /* ===== Unit 6 Statistical investigations ===== */
  def({ id: 'y9-inv-bias', year: Y, topic: 'inv', tier: 1, quick: false, gen: function (r) {
    const sc = r.pick([
      ['how much exercise students at a school do each week', 'Asking only students in the school basketball team'],
      ['how people in a town usually travel to work', 'Asking people waiting at a bus stop'],
      ['how many books students read each month', 'Asking only students who are in the library'],
      ['how much time teenagers spend on social media', 'Asking only students in the school computer club']]);
    const fair = ['Choosing 50 students at random from the school register', 'Choosing 10 students at random from each year group', 'Choosing every 10th name from an alphabetical list of students'];
    const fairQ = sc[0].indexOf('town') >= 0 ? ['Choosing 100 adults at random from the town’s electoral list', 'Asking 20 adults at random in each area of the town', 'Choosing every 20th house on a list of all the houses'] : fair;
    return { q: 'A survey is planned to find out ' + sc[0] + '. Which sampling method is most likely to be BIASED?', ans: ansMC(sc[1], fairQ, r), hint: 'Biased means the sample does not represent everyone fairly.',
      steps: ['“' + sc[1] + '” only includes a group that is likely to give unusual answers, so it is biased.'] };
  } });

  def({ id: 'y9-inv-type', year: Y, topic: 'inv', tier: 1, quick: true, mc2: true, gen: function (r) {
    const it = r.pick([['heights you measure yourself in your class', 'Primary data'], ['rainfall figures downloaded from a weather website', 'Secondary data'], ['answers to a questionnaire you give to your friends', 'Primary data'],
      ['population figures from a government report', 'Secondary data'], ['reaction times you record in a science experiment', 'Primary data'], ['football results printed in a newspaper', 'Secondary data']]);
    return { q: 'Is this primary data or secondary data?<br><b>' + it[0].charAt(0).toUpperCase() + it[0].slice(1) + '</b>', ans: ansMC(it[1], [it[1] === 'Primary data' ? 'Secondary data' : 'Primary data'], r, true),
      hint: 'Primary data is collected by you. Secondary data was collected by someone else.', steps: [it[1] === 'Primary data' ? 'You collected it yourself, so it is primary data.' : 'Someone else collected it, so it is secondary data.'] };
  } });

  /* ===== Unit 7 Shapes and measurements ===== */
  def({ id: 'y9-meas-area', year: Y, topic: 'meas', tier: 1, quick: true, gen: function (r) {
    const useD = r.chance(0.4), rad = r.int(1, 10), A = M.clean(3.14 * rad * rad);
    return { q: 'Find the area of a circle with ' + (useD ? 'diameter ' + 2 * rad : 'radius ' + rad) + ' cm. Use π = 3.14. Give your answer in cm².', dg: DG.circle((useD ? 2 * rad : rad) + ' cm', useD), ans: ansNum(A),
      hint: 'Area = π' + sq(v('r')) + (useD ? '. Halve the diameter first.' : '.'), steps: [(useD ? 'Radius = ' + 2 * rad + ' ÷ 2 = ' + rad + ' cm' : ''), 'Area = 3.14 × ' + pow(rad, 2) + ' = 3.14 × ' + rad * rad + ' = ' + fmt(A) + ' cm²'].filter(Boolean) };
  } });

  def({ id: 'y9-meas-circ', year: Y, topic: 'meas', tier: 1, quick: true, gen: function (r) {
    const rad = r.int(1, 12), C = M.clean(2 * 3.14 * rad);
    return { q: 'Find the circumference of a circle with radius ' + rad + ' cm. Use π = 3.14.', ans: ansNum(C), hint: 'C = 2π' + v('r') + ' (or π × diameter).', steps: ['C = 2 × 3.14 × ' + rad + ' = ' + fmt(C) + ' cm'] };
  } });

  def({ id: 'y9-meas-semi', year: Y, topic: 'meas', tier: 2, quick: false, gen: function (r) {
    const rad = r.pick([2, 4, 5, 6, 10]), half = M.clean(3.14 * rad * rad / 2);
    if (r.chance(0.5)) return { q: 'Find the area of a semicircle with diameter ' + 2 * rad + ' cm. Use π = 3.14.', ans: ansNum(half), hint: 'Area of a semicircle = ½ × π' + sq(v('r')) + '.', steps: ['Radius = ' + rad + ' cm', '½ × 3.14 × ' + rad * rad + ' = ' + fmt(half) + ' cm²'] };
    const w = r.int(5, 20), A = M.clean(w * 2 * rad + half);
    return { q: 'The shape is made from a rectangle and a semicircle. Find its total area, in cm². Use π = 3.14.', dg: DG.rectSemi(w, 2 * rad), ans: ansNum(A), hint: 'Add the rectangle area and the semicircle area. The semicircle’s diameter is ' + 2 * rad + ' cm.',
      steps: ['Rectangle: ' + w + ' × ' + 2 * rad + ' = ' + w * 2 * rad + ' cm²', 'Semicircle: ½ × 3.14 × ' + pow(rad, 2) + ' = ' + fmt(half) + ' cm²', 'Total = ' + fmt(A) + ' cm²'] };
  } });

  def({ id: 'y9-meas-units', year: Y, topic: 'meas', tier: 1, quick: true, gen: function (r) {
    const c = r.pick([['tonnes', 'kg', 1000], ['kg', 'g', 1000], ['g', 'mg', 1000], ['km', 'm', 1000], ['m', 'cm', 100], ['cm', 'mm', 10], ['litres', 'ml', 1000], ['m³', 'litres', 1000]]);
    const big = r.chance(0.5), val = big ? M.clean(r.int(2, 95) / r.pick([1, 10])) : r.int(2, 95) * r.pick([10, 100]);
    const res = M.clean(big ? val * c[2] : val / c[2]);
    return { q: 'Convert ' + fmt(val) + ' ' + (big ? c[0] : c[1]) + ' to ' + (big ? c[1] : c[0]) + '.', ans: ansNum(res), hint: '1 ' + c[0].replace(/s$/, '') + ' = ' + fmt(c[2]) + ' ' + c[1] + '.',
      steps: ['1 ' + c[0].replace(/s$/, '').replace('tonne', 'tonne') + ' = ' + fmt(c[2]) + ' ' + c[1], fmt(val) + (big ? ' × ' : ' ÷ ') + fmt(c[2]) + ' = ' + fmt(res) + ' ' + (big ? c[1] : c[0])] };
  } });

  def({ id: 'y9-meas-radius', year: Y, topic: 'meas', tier: 3, quick: false, gen: function (r) {
    const rad = r.int(2, 10), A = M.clean(3.14 * rad * rad);
    return { q: 'A circle has an area of ' + fmt(A) + ' cm². Find its radius, in cm. Use π = 3.14.', ans: ansNum(rad), hint: 'Divide by 3.14 to find ' + sq(v('r')) + ', then square root.', steps: [sq(v('r')) + ' = ' + fmt(A) + ' ÷ 3.14 = ' + rad * rad, v('r') + ' = √' + rad * rad + ' = ' + rad + ' cm'] };
  } });

  /* ===== Unit 8 Fractions ===== */
  def({ id: 'y9-frac-recur', year: Y, topic: 'frac', tier: 2, quick: false, gen: function (r) {
    if (r.chance(0.5)) { const d = r.int(1, 8), f = fr(d, 9);
      return { q: 'Write 0.' + rec(String(d)) + ' as a fraction in its simplest form.', ans: ansFrac(f.n, f.d, 'simplest'), hint: 'Let ' + x + ' = 0.' + d + d + d + '… and multiply by 10.', steps: ['10' + x + ' = ' + d + '.' + d + d + d + '…', '10' + x + ' ' + MINUS + ' ' + x + ' = ' + d + ', so 9' + x + ' = ' + d, x + ' = ' + F(d, 9) + (f.d !== 9 ? ' = ' + F(f.n, f.d) : '')] }; }
    let ab; do { ab = r.int(10, 98); } while (ab % 11 === 0);
    const f = fr(ab, 99), s = String(ab);
    return { q: 'Write 0.' + rec(s) + ' as a fraction in its simplest form.', ans: ansFrac(f.n, f.d, 'simplest'), hint: 'Two digits repeat, so multiply by 100.',
      steps: ['100' + x + ' = ' + s + '.' + s + s + '…', '100' + x + ' ' + MINUS + ' ' + x + ' = ' + ab + ', so 99' + x + ' = ' + ab, x + ' = ' + F(ab, 99) + (f.d !== 99 ? ' = ' + F(f.n, f.d) : '')] };
  } });

  def({ id: 'y9-frac-mixmul', year: Y, topic: 'frac', tier: 2, quick: false, gen: function (r) {
    const w1 = r.int(1, 3), w2 = r.int(1, 3), f1 = properFrac(r, [2, 3, 4, 5]), f2 = properFrac(r, [2, 3, 4, 5]);
    const A = fr(w1 * f1.d + f1.n, f1.d), B = fr(w2 * f2.d + f2.n, f2.d), mul = r.chance(0.5), res = mul ? M.fMul(A, B) : M.fDiv(A, B);
    if (res.d > 20) return null;
    return { q: 'Work out ' + w1 + F(f1.n, f1.d) + (mul ? ' × ' : ' ÷ ') + w2 + F(f2.n, f2.d) + '<br><small>Give your answer in its simplest form.</small>', ans: ansFrac(res.n, res.d, 'simplest'), hint: 'Change mixed numbers to improper fractions first.',
      steps: ['Improper fractions: ' + F(A.n, A.d) + (mul ? ' × ' : ' ÷ ') + F(B.n, B.d), mul ? '= ' + F(A.n * B.n, A.d * B.d) : '= ' + F(A.n, A.d) + ' × ' + F(B.d, B.n) + ' = ' + F(A.n * B.d, A.d * B.n), '= ' + (res.d === 1 ? res.n : mixed(res.n, res.d))] };
  } });

  def({ id: 'y9-frac-ops', year: Y, topic: 'frac', tier: 3, quick: false, gen: function (r) {
    const a = properFrac(r, [2, 3, 4, 5, 6]), b = properFrac(r, [2, 3, 4, 5, 6]), c = properFrac(r, [2, 3, 4, 5, 6, 7]);
    const diff = M.fSub(a, b);
    if (diff.n <= 0) return null;
    const res = M.fDiv(diff, c);
    if (res.d > 30 || Math.abs(res.n) > 60) return null;
    return { q: 'Work out (' + F(a.n, a.d) + ' ' + MINUS + ' ' + F(b.n, b.d) + ') ÷ ' + F(c.n, c.d) + '<br><small>Give your answer in its simplest form.</small>', ans: ansFrac(res.n, res.d, 'simplest'), hint: 'Brackets first, then divide by multiplying by the reciprocal.',
      steps: ['Brackets: ' + F(a.n, a.d) + ' ' + MINUS + ' ' + F(b.n, b.d) + ' = ' + F(diff.n, diff.d), F(diff.n, diff.d) + ' × ' + F(c.d, c.n) + ' = ' + (res.d === 1 ? res.n : F(res.n, res.d) + (res.n > res.d ? ' = ' + mixed(res.n, res.d) : ''))] };
  } });

  def({ id: 'y9-frac-of', year: Y, topic: 'frac', tier: 1, quick: true, gen: function (r) {
    const f = properFrac(r, [2, 3, 4, 5, 6, 8]), w = r.int(1, 4), g = properFrac(r, [2, 3, 4, 5, 6]), B = fr(w * g.d + g.n, g.d), res = M.fMul(f, B);
    if (res.d > 12) return null;
    return { q: 'Find ' + F(f.n, f.d) + ' of ' + w + F(g.n, g.d) + '<br><small>Give your answer in its simplest form.</small>', ans: ansFrac(res.n, res.d, 'simplest'), hint: '“Of” means multiply. Change ' + w + F(g.n, g.d) + ' to an improper fraction.',
      steps: [F(f.n, f.d) + ' × ' + F(B.n, B.d) + ' = ' + F(f.n * B.n, f.d * B.d), '= ' + (res.d === 1 ? res.n : (res.n > res.d ? mixed(res.n, res.d) : F(res.n, res.d)))] };
  } });

  def({ id: 'y9-frac-term', year: Y, topic: 'frac', tier: 1, quick: true, gen: function (r) {
    const good = r.pick([[3, 8], [7, 20], [9, 25], [11, 40], [5, 16], [13, 50], [7, 125], [3, 32]]), bad = r.sample([[5, 6], [7, 12], [4, 15], [2, 7], [5, 9], [3, 11], [7, 30], [1, 3]], 3);
    return { q: 'Which of these fractions is equal to a terminating decimal?', ans: ansMC(F(good[0], good[1]), bad.map(function (b) { return F(b[0], b[1]); }), r),
      hint: 'In simplest form, a fraction terminates only if the denominator’s prime factors are just 2s and 5s.', steps: [good[1] + ' has no prime factors other than 2 and 5, so ' + F(good[0], good[1]) + ' terminates (= ' + fmt(M.clean(good[0] / good[1])) + ').'] };
  } });

  /* ===== Unit 9 Sequences and functions ===== */
  def({ id: 'y9-seq-lin', year: Y, topic: 'seq', tier: 1, quick: true, gen: function (r) {
    const a = r.nonZero(-7, 9), b = r.nonZero(-12, 12);
    if (a === 1 || a === -1) return null;
    const t = [1, 2, 3, 4].map(function (k) { return a * k + b; }), correct = nthExpr(a, b);
    return { q: 'Which is the <i>n</i>th term of this sequence?<br><b>' + t.map(fmt).join(', ') + ', …</b>', ans: ansMC(correct, [nthExpr(a, a + b), nthExpr(a, -b), nthExpr(a + b, a)], r),
      hint: 'The common difference is the number in front of ' + n + '.', steps: ['Common difference: ' + fmt(a) + ', so ' + lin([[a, n]]) + '.', 'First term ' + fmt(t[0]) + ' = ' + fmt(a) + op(b) + ', so the <i>n</i>th term is ' + correct + '.'] };
  } });

  def({ id: 'y9-seq-quad', year: Y, topic: 'seq', tier: 2, quick: true, gen: function (r) {
    const k = r.int(3, 12);
    if (r.chance(0.2)) return { q: 'The <i>n</i>th term of a sequence is ' + n + '<sup>3</sup>. What is the ' + ord(k) + ' term?', ans: ansNum(k * k * k), hint: 'Cube the position number.', steps: [pow(k, 3) + ' = ' + k * k * k] };
    const c = r.nonZero(-9, 12);
    return { q: 'The <i>n</i>th term of a sequence is ' + sq(n) + op(c) + '. What is the ' + ord(k) + ' term?', ans: ansNum(k * k + c), hint: 'Square the position number first.', steps: [pow(k, 2) + op(c) + ' = ' + k * k + op(c) + ' = ' + fmt(k * k + c)] };
  } });

  def({ id: 'y9-seq-quadmc', year: Y, topic: 'seq', tier: 2, quick: false, gen: function (r) {
    const t = r.int(0, 2);
    if (t === 2) { const terms = [1, 8, 27, 64]; return { q: 'Which is the <i>n</i>th term of this sequence?<br><b>' + terms.join(', ') + ', …</b>', ans: ansMC(n + '<sup>3</sup>', [sq(n), '3' + n, lin([[7, n], [-6, '']])], r), hint: 'Look for cube numbers.', steps: ['1 = 1<sup>3</sup>, 8 = 2<sup>3</sup>, 27 = 3<sup>3</sup>, 64 = 4<sup>3</sup>', 'So the <i>n</i>th term is ' + n + '<sup>3</sup>.'] }; }
    const c = t === 0 ? r.int(1, 9) : -r.int(1, 5), terms = [1, 2, 3, 4, 5].map(function (k) { return k * k + c; }), correct = sq(n) + op(c);
    return { q: 'Which is the <i>n</i>th term of this sequence?<br><b>' + terms.map(fmt).join(', ') + ', …</b>', ans: ansMC(correct, [sq(n) + op(c + 1), lin([[3, n], [c - 2, '']]), sq(n) + op(-c), '(' + n + op(c) + ')<sup>2</sup>'], r),
      hint: 'Compare each term with the square numbers 1, 4, 9, 16, 25.', steps: ['Square numbers: 1, 4, 9, 16, 25', 'Each term is ' + (c > 0 ? c + ' more' : (-c) + ' less') + ' than a square number.', 'So the <i>n</i>th term is ' + correct + '.'] };
  } });

  def({ id: 'y9-seq-which', year: Y, topic: 'seq', tier: 3, quick: false, gen: function (r) {
    const c = r.nonZero(-9, 20), k = r.int(6, 20), V = k * k + c;
    return { q: 'The <i>n</i>th term of a sequence is ' + sq(n) + op(c) + '. Which term is equal to ' + V + '?', ans: ansNum(k), hint: 'Solve ' + sq(n) + op(c) + ' = ' + V + '.', steps: [sq(n) + ' = ' + V + (c > 0 ? ' ' + MINUS + ' ' + c : ' + ' + (-c)) + ' = ' + k * k, n + ' = √' + k * k + ' = ' + k, 'It is the ' + ord(k) + ' term.'] };
  } });

  def({ id: 'y9-seq-inv', year: Y, topic: 'seq', tier: 2, quick: true, gen: function (r) {
    const a = r.int(2, 6), b = r.nonZero(-9, 9), k = r.int(-4, 10);
    if (r.chance(0.5)) { const out = a * k + b;
      return { q: 'The function is ' + x + ' → ' + lin([[a, x], [b, '']]) + '. Which input gives an output of ' + fmt(out) + '?', ans: ansNum(k), hint: 'Use inverse operations, in reverse order.', steps: [lin([[a, x], [b, '']]) + ' = ' + fmt(out), a + x + ' = ' + fmt(out - b), x + ' = ' + fmt(k)] }; }
    const inp = a * k - b, out = k;
    return { q: 'The function is ' + x + ' → ' + fx(lin([[1, x], [b, '']]), a) + '. Which input gives an output of ' + fmt(out) + '?', ans: ansNum(inp), hint: 'Multiply by ' + a + ', then undo the ' + (b > 0 ? '+ ' + b : MINUS + ' ' + (-b)) + '.',
      steps: [lin([[1, x], [b, '']]) + ' = ' + fmt(out) + ' × ' + a + ' = ' + fmt(a * out), x + ' = ' + fmt(a * out) + (b > 0 ? ' ' + MINUS + ' ' + b : ' + ' + (-b)) + ' = ' + fmt(inp)] };
  } });

  /* ===== Unit 10 Graphs ===== */
  def({ id: 'y9-graph-grad', year: Y, topic: 'graph', tier: 2, quick: true, gen: function (r) {
    const t = r.int(0, 2);
    if (t === 0) { const k = r.int(2, 4), m = r.nonZero(-4, 5), c = r.nonZero(-5, 5);
      return { q: 'What is the gradient of the line ' + k + y + ' = ' + lin([[k * m, x], [k * c, '']]) + '?', ans: ansNum(m), hint: 'Divide everything by ' + k + ' to get ' + y + ' = …', steps: [y + ' = ' + lin([[m, x], [c, '']]), 'Gradient = ' + fmt(m)] }; }
    if (t === 1) { const a = r.int(2, 6), c = r.nonZero(-9, 12);
      return { q: 'What is the gradient of the line ' + lin([[a, x], [1, y]]) + ' = ' + fmt(c) + '?', ans: ansNum(-a), hint: 'Rearrange to ' + y + ' = …', steps: [y + ' = ' + lin([[c, ''], [-a, x]]), 'Gradient = ' + fmt(-a)] }; }
    const k = r.int(2, 5), c = k * r.int(1, 6);
    return { q: 'What is the gradient of the line ' + lin([[1, x], [k, y]]) + ' = ' + c + '?', ans: ansFrac(-1, k, 'any', { allowDecimal: true, show: fracOrNeg(-1, k) }), hint: 'Rearrange to ' + y + ' = …',
      steps: [k + y + ' = ' + lin([[c, ''], [-1, x]]), y + ' = ' + fmt(c / k) + ' ' + MINUS + ' ' + fx(x, k), 'Gradient = ' + fracOrNeg(-1, k)] };
  } });
  function fracOrNeg(nu, de) { return F(nu, de) + (M.clean(nu / de) === M.roundTo(nu / de, 3) ? ' = ' + fmt(M.clean(nu / de)) : ''); }

  def({ id: 'y9-graph-grad2', year: Y, topic: 'graph', tier: 2, quick: false, gen: function (r) {
    const dx = r.int(2, 6), dy = r.nonZero(-5, 6);
    if (dy % dx === 0) return null;
    const x1 = r.int(-3, 4), y1 = r.int(-4, 5), f = fr(dy, dx);
    return { q: 'A line passes through ' + coord(x1, y1) + ' and ' + coord(x1 + dx, y1 + dy) + '. What is its gradient?', ans: ansFrac(dy, dx, 'any', { allowDecimal: true, show: F(f.n, f.d) + (termDec(f.d) ? ' = ' + fmt(M.clean(f.n / f.d)) : '') }),
      hint: 'Gradient = change in ' + y + ' ÷ change in ' + x + '. It can be a fraction!', steps: ['Change in ' + y + ' = ' + fmt(dy) + ', change in ' + x + ' = ' + dx, 'Gradient = ' + F(dy, dx) + (f.d !== dx ? ' = ' + F(f.n, f.d) : '')] };
  } });

  def({ id: 'y9-graph-xint', year: Y, topic: 'graph', tier: 1, quick: true, gen: function (r) {
    const a = r.int(1, 6), b = r.int(1, 6), k = r.int(1, 5), C = a * b * k, axis = r.chance(0.5);
    return { q: 'Where does the line ' + lin([[a, x], [b, y]]) + ' = ' + C + ' cross the ' + (axis ? x : y) + '-axis? Give the ' + (axis ? x : y) + '-coordinate.', ans: ansNum(axis ? C / a : C / b), hint: 'On the ' + (axis ? x : y) + '-axis, ' + (axis ? y : x) + ' = 0.',
      steps: ['Put ' + (axis ? y : x) + ' = 0: ' + (axis ? lin([[a, x]]) : lin([[b, y]])) + ' = ' + C].concat((axis ? a : b) === 1 ? [] : [(axis ? x : y) + ' = ' + C + ' ÷ ' + (axis ? a : b) + ' = ' + (axis ? C / a : C / b)]) };
  } });

  def({ id: 'y9-graph-eq2', year: Y, topic: 'graph', tier: 3, quick: false, gen: function (r) {
    const m = r.nonZero(-4, 5), c = r.nonZero(-6, 6), x1 = r.int(1, 3), x2 = x1 + r.int(1, 3);
    if (m === c) return null;
    const eq = function (mm, cc) { return y + ' = ' + lin([[mm, x], [cc, '']]); };
    return { q: 'Which is the equation of the straight line through ' + coord(x1, m * x1 + c) + ' and ' + coord(x2, m * x2 + c) + '?', ans: ansMC(eq(m, c), [eq(c, m), eq(m, m * x1 + c), eq(-m, c + 2 * m * x1)], r),
      hint: 'Find the gradient first, then substitute a point to find ' + v('c') + '.', steps: ['Gradient = ' + fmt(m * (x2 - x1)) + ' ÷ ' + (x2 - x1) + ' = ' + fmt(m), fmt(m * x1 + c) + ' = ' + fmt(m) + ' × ' + x1 + ' + ' + v('c') + ', so ' + v('c') + ' = ' + fmt(c), 'Answer: ' + eq(m, c)] };
  } });

  def({ id: 'y9-graph-intersect', year: Y, topic: 'graph', tier: 3, quick: false, gen: function (r) {
    const X = r.nonZero(-4, 6), m1 = r.nonZero(-3, 4), m2 = r.intNot(-3, 4, [m1, 0]), c1 = r.nonZero(-6, 8), c2 = c1 + (m1 - m2) * X;
    if (c2 === 0) return null;
    return { q: 'The lines ' + y + ' = ' + lin([[m1, x], [c1, '']]) + ' and ' + y + ' = ' + lin([[m2, x], [c2, '']]) + ' intersect. What is the ' + x + '-coordinate of the point of intersection?', ans: ansNum(X), hint: 'Set the two expressions equal to each other.',
      steps: [lin([[m1, x], [c1, '']]) + ' = ' + lin([[m2, x], [c2, '']]), lin([[m1 - m2, x]]) + ' = ' + fmt(c2 - c1), x + ' = ' + fmt(X)] };
  } });

  /* ===== Unit 11 Ratio and proportion ===== */
  def({ id: 'y9-ratio-direct', year: Y, topic: 'ratio', tier: 1, quick: true, gen: function (r) {
    const k = r.int(2, 9), x1 = r.int(2, 6), x2 = r.intNot(3, 15, [x1]);
    return { q: v('y') + ' is directly proportional to ' + x + '. When ' + x + ' = ' + x1 + ', ' + y + ' = ' + k * x1 + '. Find ' + y + ' when ' + x + ' = ' + x2 + '.', ans: ansNum(k * x2), hint: 'Find how much ' + y + ' is for each 1 of ' + x + '.',
      steps: [y + ' ÷ ' + x + ' = ' + k * x1 + ' ÷ ' + x1 + ' = ' + k, y + ' = ' + k + ' × ' + x2 + ' = ' + k * x2] };
  } });

  def({ id: 'y9-ratio-inverse', year: Y, topic: 'ratio', tier: 2, quick: true, gen: function (r) {
    const total = r.pick([24, 36, 48, 60, 72, 120]), divs = []; for (let i = 2; i <= 12; i++) if (total % i === 0) divs.push(i);
    const w1 = r.pick(divs), w2 = r.pick(divs.filter(function (d) { return d !== w1; }));
    return { q: w1 + ' workers take ' + total / w1 + ' days to paint a school. How many days would ' + w2 + ' workers take, working at the same rate?', ans: ansNum(total / w2), hint: 'This is inverse proportion: more workers → fewer days.',
      steps: ['Total work = ' + w1 + ' × ' + total / w1 + ' = ' + total + ' worker-days', total + ' ÷ ' + w2 + ' = ' + total / w2 + ' days'] };
  } });

  def({ id: 'y9-ratio-equiv', year: Y, topic: 'ratio', tier: 1, quick: true, gen: function (r) {
    let p, q, g = 0; do { p = r.int(1, 9); q = r.int(2, 12); } while ((p === q || gcd(p, q) !== 1) && g++ < 50);
    const k = r.int(2, 9);
    return { q: 'Find the value of ' + x + ' when ' + p + ' : ' + q + ' = ' + x + ' : ' + q * k + '.', ans: ansNum(p * k), hint: 'What has ' + q + ' been multiplied by?', steps: [q + ' × ' + k + ' = ' + q * k, x + ' = ' + p + ' × ' + k + ' = ' + p * k] };
  } });

  def({ id: 'y9-ratio-combine', year: Y, topic: 'ratio', tier: 3, quick: false, gen: function (r) {
    const p = r.int(1, 5), q = r.int(2, 6), s = r.int(2, 6), t = r.int(1, 7);
    if (gcd(p, q) !== 1 || gcd(s, t) !== 1 || q === s) return null;
    const A = p * s, C = q * t, g = gcd(A, C), correct = A / g + ' : ' + C / g;
    return { q: v('a') + ' : ' + v('b') + ' = ' + p + ' : ' + q + ' and ' + v('b') + ' : ' + v('c') + ' = ' + s + ' : ' + t + '. Find ' + v('a') + ' : ' + v('c') + ' in its simplest form.',
      ans: ansMC(correct, [p + ' : ' + t, (p * t) / gcd(p * t, q * s) + ' : ' + (q * s) / gcd(p * t, q * s), (p + s) + ' : ' + (q + t)], r), hint: 'Make the ' + v('b') + ' parts the same: use ' + q * s + '.',
      steps: [v('a') + ' : ' + v('b') + ' = ' + p * s + ' : ' + q * s, v('b') + ' : ' + v('c') + ' = ' + q * s + ' : ' + q * t, v('a') + ' : ' + v('c') + ' = ' + A + ' : ' + C + (g > 1 ? ' = ' + correct : '')] };
  } });

  def({ id: 'y9-ratio-recipe', year: Y, topic: 'ratio', tier: 2, quick: false, gen: function (r) {
    const n1 = r.pick([2, 4, 5, 6, 8]), n2 = r.intNot(3, 12, [n1]), per = r.pick([25, 30, 40, 50, 60, 75]), amt = per * n1, res = M.clean(per * n2);
    const ing = r.pick([['flour', 'g'], ['rice', 'g'], ['coconut milk', 'ml'], ['sugar', 'g']]);
    return { q: 'A recipe for ' + n1 + ' people uses ' + amt + ' ' + ing[1] + ' of ' + ing[0] + '. How much ' + ing[0] + ', in ' + ing[1] + ', is needed for ' + n2 + ' people?', ans: ansNum(res), hint: 'Find the amount for 1 person first.',
      steps: ['For 1 person: ' + amt + ' ÷ ' + n1 + ' = ' + per + ' ' + ing[1], 'For ' + n2 + ': ' + per + ' × ' + n2 + ' = ' + fmt(res) + ' ' + ing[1]] };
  } });

  /* ===== Unit 12 Probability ===== */
  def({ id: 'y9-prob-me', year: Y, topic: 'prob', tier: 1, quick: true, gen: function (r) {
    const a = r.int(5, 45), b = r.int(5, 45);
    if (a + b > 95) return null;
    const pa = M.clean(a / 100), pb = M.clean(b / 100), res = M.clean(pa + pb);
    if (r.chance(0.5)) return { q: 'A counter is taken at random from a bag. The probability that it is red is ' + fmt(pa) + ' and the probability that it is blue is ' + fmt(pb) + '. What is the probability that it is red or blue?',
      ans: ansNum(res), hint: 'Red and blue cannot happen at the same time (mutually exclusive), so add.', steps: ['P(red or blue) = ' + fmt(pa) + ' + ' + fmt(pb) + ' = ' + fmt(res)] };
    return { q: 'The probability that a student walks to school is ' + fmt(pa) + '. The probability that a student cycles to school is ' + fmt(pb) + '. What is the probability that a student walks or cycles to school?',
      ans: ansNum(res), hint: 'A student cannot walk and cycle at the same time (mutually exclusive), so add.', steps: ['P(walks or cycles) = ' + fmt(pa) + ' + ' + fmt(pb) + ' = ' + fmt(res)] };
  } });

  def({ id: 'y9-prob-indep', year: Y, topic: 'prob', tier: 2, quick: false, gen: function (r) {
    if (r.chance(0.5)) { const pa = M.clean(r.int(1, 9) / 10), pb = M.clean(r.int(1, 9) / 10), res = M.clean(pa * pb);
      return { q: 'The probability that ' + r.pick(NAMES_F) + ' is late for school is ' + fmt(pa) + '. The probability that ' + r.pick(NAMES_M) + ' is late is ' + fmt(pb) + '. The events are independent. What is the probability that they are BOTH late?', ans: ansNum(res),
        hint: 'For independent events, multiply the probabilities.', steps: ['P(both) = ' + fmt(pa) + ' × ' + fmt(pb) + ' = ' + fmt(res)] }; }
    const k = r.int(1, 6), outs = r.pick([['rolling a ' + k + ' on a fair dice', 6], ['rolling an even number on a fair dice', 2]]);
    const d = 2 * outs[1];
    return { q: 'A fair coin is flipped and a fair six-sided dice is rolled. What is the probability of getting heads AND ' + outs[0].replace(' on a fair dice', '') + '?', ans: ansFrac(1, d, 'any', { show: F(1, 2) + ' × ' + F(1, outs[1]) + ' = ' + F(1, d) }),
      hint: 'Multiply the probabilities of the two independent events.', steps: ['P(heads) = ' + F(1, 2) + ', P(' + outs[0].replace('rolling ', '').replace(' on a fair dice', '') + ') = ' + F(outs[1] === 6 ? 1 : 3, 6) + (outs[1] === 2 ? ' = ' + F(1, 2) : ''), F(1, 2) + ' × ' + F(1, outs[1]) + ' = ' + F(1, d)] };
  } });

  def({ id: 'y9-prob-dep', year: Y, topic: 'prob', tier: 3, quick: false, gen: function (r) {
    const red = r.int(2, 7), blue = r.int(2, 7), tot = red + blue, both = r.chance(0.5);
    const nu = both ? red * (red - 1) : blue * (blue - 1), de = tot * (tot - 1), col = both ? 'red' : 'blue', c = both ? red : blue, f = fr(nu, de);
    return { q: 'A bag contains ' + red + ' red counters and ' + blue + ' blue counters. Two counters are taken out at random, one after the other, WITHOUT replacement. What is the probability that both are ' + col + '?',
      ans: ansFrac(nu, de, 'any', { show: F(c, tot) + ' × ' + F(c - 1, tot - 1) + ' = ' + F(nu, de) + (f.d !== de ? ' = ' + F(f.n, f.d) : '') }), hint: 'After the first ' + col + ' counter is taken, there is one fewer ' + col + ' AND one fewer counter in total.',
      steps: ['First: ' + F(c, tot) + ', second: ' + F(c - 1, tot - 1), F(c, tot) + ' × ' + F(c - 1, tot - 1) + ' = ' + F(nu, de) + (f.d !== de ? ' = ' + F(f.n, f.d) : '')] };
  } });

  def({ id: 'y9-prob-sample', year: Y, topic: 'prob', tier: 2, quick: false, gen: function (r) {
    const ev = r.pick([['the product is even', function (a, b) { return (a * b) % 2 === 0; }], ['the total is 10 or more', function (a, b) { return a + b >= 10; }], ['both dice show the same number', function (a, b) { return a === b; }],
      ['the total is a prime number', function (a, b) { const s = a + b; return [2, 3, 5, 7, 11].indexOf(s) >= 0; }], ['the difference between the scores is 2', function (a, b) { return Math.abs(a - b) === 2; }]]);
    let cnt = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (ev[1](a, b)) cnt++;
    const f = fr(cnt, 36);
    return { q: 'Two fair six-sided dice are rolled. What is the probability that ' + ev[0] + '?', ans: ansFrac(cnt, 36, 'any', { show: F(cnt, 36) + (f.d !== 36 ? ' = ' + F(f.n, f.d) : '') }), hint: 'Use a 6 × 6 sample-space diagram (36 outcomes).',
      steps: ['There are 36 equally likely outcomes.', 'Count the outcomes where ' + ev[0] + ': there are ' + cnt + '.', 'Probability = ' + F(cnt, 36) + (f.d !== 36 ? ' = ' + F(f.n, f.d) : '')] };
  } });

  /* ===== Unit 13 Position and transformation ===== */
  def({ id: 'y9-trans-scale', year: Y, topic: 'trans', tier: 1, quick: true, gen: function (r) {
    const N = r.pick([5000, 10000, 20000, 25000, 50000]), d = M.clean(r.int(2, 24) / 2), realM = M.clean(d * N / 100), inKm = realM >= 1000 && r.chance(0.5);
    return { q: 'A map has a scale of 1 : ' + fmt(N) + '. Two places are ' + fmt(d) + ' cm apart on the map. What is the real distance, in ' + (inKm ? 'km' : 'metres') + '?', ans: ansNum(inKm ? M.clean(realM / 1000) : realM), hint: '1 cm on the map is ' + fmt(N) + ' cm in real life. There are 100 cm in 1 m.',
      steps: [fmt(d) + ' × ' + fmt(N) + ' = ' + fmt(M.clean(d * N)) + ' cm', '= ' + fmt(realM) + ' m' + (inKm ? ' = ' + fmt(M.clean(realM / 1000)) + ' km' : '')] };
  } });

  def({ id: 'y9-trans-bearing', year: Y, topic: 'trans', tier: 2, quick: true, gen: function (r) {
    const b = r.int(10, 350);
    if (b === 180) return null;
    const back = b < 180 ? b + 180 : b - 180, p3 = function (t) { return String(t).padStart(3, '0'); };
    return { q: 'The bearing of a lighthouse from a boat is ' + p3(b) + '°. What is the bearing of the boat from the lighthouse, in degrees?', ans: ansNum(back, { show: p3(back) + '°' }), hint: 'Back bearings differ by 180°.',
      steps: [(b < 180 ? b + ' + 180' : b + ' ' + MINUS + ' 180') + ' = ' + back, 'Bearing: ' + p3(back) + '°'] };
  } });

  def({ id: 'y9-trans-segment', year: Y, topic: 'trans', tier: 2, quick: false, gen: function (r) {
    const nn = r.pick([3, 4, 5]), k = r.int(1, nn - 1);
    if (gcd(k, nn) !== 1) return null;
    const dx = nn * r.nonZero(-3, 3), dy = nn * r.nonZero(-3, 3), A = [r.int(-5, 5), r.int(-5, 5)], B = [A[0] + dx, A[1] + dy];
    const P = [A[0] + dx * k / nn, A[1] + dy * k / nn], Q = [B[0] - dx * k / nn, B[1] - dy * k / nn], mid = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
    const ds = [coord(Q[0], Q[1]), coord(A[0] + dx * k / nn, A[1] - dy * k / nn), Number.isInteger(mid[0]) && Number.isInteger(mid[1]) ? coord(mid[0], mid[1]) : coord(P[0] + 1, P[1]), coord(P[0], P[1] + 1), coord(dx * k / nn, dy * k / nn)];
    return { q: 'A is ' + coord(A[0], A[1]) + ' and B is ' + coord(B[0], B[1]) + '. Point P is ' + F(k, nn) + ' of the way from A to B. What are the coordinates of P?', ans: ansMC(coord(P[0], P[1]), ds, r),
      hint: 'Find the change from A to B, then take ' + F(k, nn) + ' of it.', steps: ['From A to B: ' + x + ' changes by ' + fmt(dx) + ', ' + y + ' changes by ' + fmt(dy), F(k, nn) + ' of these: ' + fmt(dx * k / nn) + ' and ' + fmt(dy * k / nn), 'P = ' + coord(P[0], P[1])] };
  } });

  def({ id: 'y9-trans-combo', year: Y, topic: 'trans', tier: 3, quick: false, gen: function (r) {
    let a = r.nonZero(-6, 6), b = r.nonZero(-6, 6); if (Math.abs(a) === Math.abs(b)) b = b > 0 ? b + 1 : b - 1;
    const h = r.nonZero(-5, 5), k = r.nonZero(-5, 5), inY = r.chance(0.5);
    const R = inY ? [-a, b] : [a, -b], img = [R[0] + h, R[1] + k];
    const ds = [inY ? [a + h, -b + k] : [-a + h, b + k], inY ? [-(a + h), b + k] : [a + h, -(b + k)], [R[0] - h, R[1] - k]].map(function (p) { return coord(p[0], p[1]); });
    return { q: 'The point ' + coord(a, b) + ' is reflected in the ' + (inY ? y : x) + '-axis. The image is then translated by the vector ' + vec(h, k) + '. What are the final coordinates?', ans: ansMC(coord(img[0], img[1]), ds, r),
      hint: 'Do the reflection first, then the translation.', steps: ['Reflect in the ' + (inY ? y : x) + '-axis: ' + coord(R[0], R[1]), 'Translate: ' + coord(R[0], R[1]) + ' → ' + coord(img[0], img[1])] };
  } });

  def({ id: 'y9-trans-sf', year: Y, topic: 'trans', tier: 1, quick: true, gen: function (r) {
    const k = r.int(2, 5), s = [r.int(2, 6), r.int(3, 8), r.int(4, 9)];
    if (s[0] === s[1] || s[1] === s[2] || s[0] === s[2]) return null;
    const i = r.int(0, 2);
    return { q: 'A triangle with sides ' + s.join(' cm, ') + ' cm is enlarged. The side that was ' + s[i] + ' cm becomes ' + s[i] * k + ' cm. How long does the ' + s[(i + 1) % 3] + ' cm side become, in cm?', ans: ansNum(s[(i + 1) % 3] * k), hint: 'Find the scale factor first.',
      steps: ['Scale factor = ' + s[i] * k + ' ÷ ' + s[i] + ' = ' + k, s[(i + 1) % 3] + ' × ' + k + ' = ' + s[(i + 1) % 3] * k + ' cm'] };
  } });

  /* ===== Unit 14 Volume, surface area and symmetry ===== */
  def({ id: 'y9-vol-prism', year: Y, topic: 'vol', tier: 1, quick: true, gen: function (r) {
    const A = r.int(6, 40), L = r.int(3, 20);
    return { q: 'A prism has a cross-sectional area of ' + A + ' cm² and a length of ' + L + ' cm. What is its volume, in cm³?', ans: ansNum(A * L), hint: 'Volume of a prism = area of cross-section × length.', steps: [A + ' × ' + L + ' = ' + A * L + ' cm³'] };
  } });

  def({ id: 'y9-vol-cyl', year: Y, topic: 'vol', tier: 2, quick: false, gen: function (r) {
    const rad = r.int(1, 10), h = r.int(2, 20), V = M.clean(3.14 * rad * rad * h);
    return { q: 'Find the volume of the cylinder, in cm³. Use π = 3.14.', dg: DG.cylinder(rad, h), ans: ansNum(V), hint: 'Volume = π' + sq(v('r')) + v('h') + '.', steps: ['Area of circle = 3.14 × ' + pow(rad, 2) + ' = ' + fmt(M.clean(3.14 * rad * rad)) + ' cm²', 'Volume = ' + fmt(M.clean(3.14 * rad * rad)) + ' × ' + h + ' = ' + fmt(V) + ' cm³'] };
  } });

  def({ id: 'y9-vol-cylsa', year: Y, topic: 'vol', tier: 3, quick: false, gen: function (r) {
    const rad = r.pick([1, 2, 3, 5, 10]), h = r.int(2, 15), ends = M.clean(2 * 3.14 * rad * rad), curved = M.clean(2 * 3.14 * rad * h), S = M.clean(ends + curved);
    return { q: 'Find the total surface area of the closed cylinder, in cm². Use π = 3.14.', dg: DG.cylinder(rad, h), ans: ansNum(S), hint: 'Two circles plus the curved surface (a rectangle of width 2π' + v('r') + ').',
      steps: ['Two ends: 2 × 3.14 × ' + pow(rad, 2) + ' = ' + fmt(ends) + ' cm²', 'Curved surface: 2 × 3.14 × ' + rad + ' × ' + h + ' = ' + fmt(curved) + ' cm²', 'Total = ' + fmt(S) + ' cm²'] };
  } });

  def({ id: 'y9-vol-cylh', year: Y, topic: 'vol', tier: 3, quick: false, gen: function (r) {
    const rad = r.pick([1, 2, 5, 10]), h = r.int(2, 20), base = M.clean(3.14 * rad * rad), V = M.clean(base * h);
    return { q: 'A cylinder has a volume of ' + fmt(V) + ' cm³ and a radius of ' + rad + ' cm. Find its height, in cm. Use π = 3.14.', ans: ansNum(h), hint: 'Height = volume ÷ area of the circular base.', steps: ['Base area = 3.14 × ' + pow(rad, 2) + ' = ' + fmt(base) + ' cm²', 'Height = ' + fmt(V) + ' ÷ ' + fmt(base) + ' = ' + h + ' cm'] };
  } });

  def({ id: 'y9-vol-planes', year: Y, topic: 'vol', tier: 1, quick: true, gen: function (r) {
    const s = r.pick([['a cube', 9], ['a cuboid whose length, width and height are all different', 3], ['a square-based pyramid (with its top directly above the centre of the base)', 4], ['a triangular prism with equilateral triangle ends', 4], ['a cuboid with two square faces (not a cube)', 5]]);
    return { q: 'How many planes of symmetry does ' + s[0] + ' have?', ans: ansNum(s[1]), hint: 'A plane of symmetry cuts the solid into two mirror-image halves.', steps: [s[0].charAt(0).toUpperCase() + s[0].slice(1) + ' has ' + s[1] + ' planes of symmetry.'] };
  } });

  /* ===== Unit 15 Interpreting and discussing results ===== */
  def({ id: 'y9-stats-avg', year: Y, topic: 'stats', tier: 1, quick: true, gen: function (r) {
    const k = r.pick([6, 8]), d = M.dataset(r, k, 1, 40), s = d.slice().sort(function (a, b) { return a - b; }), med = M.clean((s[k / 2 - 1] + s[k / 2]) / 2);
    return { q: 'Find the median of these numbers:<br><b>' + d.join(', ') + '</b>', ans: ansNum(med), hint: 'Order them. With an even number of values, the median is halfway between the middle two.',
      steps: ['In order: ' + s.join(', '), 'Middle two: ' + s[k / 2 - 1] + ' and ' + s[k / 2], 'Median = ' + fmt(med)] };
  } });

  def({ id: 'y9-stats-groupmean', year: Y, topic: 'stats', tier: 3, quick: false, gen: function (r) {
    const N = r.pick([20, 25, 40, 50]), w = 10, k = 4, wts = []; for (let i = 0; i < k; i++) wts.push(r.int(2, 10));
    const S = wts.reduce(function (a, b) { return a + b; }, 0), f = wts.map(function (t) { return Math.max(1, Math.floor(N * t / S)); });
    let diff = N - f.reduce(function (a, b) { return a + b; }, 0), gi = 0;
    while (diff !== 0 && gi++ < 100) { const j = r.int(0, k - 1); if (diff > 0) { f[j]++; diff--; } else if (f[j] > 1) { f[j]--; diff++; } }
    if (diff !== 0) return null;
    const lo0 = r.pick([0, 10, 20, 30]), mids = f.map(function (c, i) { return lo0 + w * i + w / 2; }), tot = f.reduce(function (s, c, i) { return s + c * mids[i]; }, 0), mean = M.clean(tot / N);
    return { q: 'The table shows the scores of ' + N + ' students in a quiz. Calculate an estimate of the mean score.', dg: M.table(['Score, <i>s</i>', 'Frequency'], f.map(function (c, i) { return [(lo0 + w * i) + ' ≤ <i>s</i> &lt; ' + (lo0 + w * (i + 1)), c]; })), ans: ansNum(mean),
      hint: 'Multiply each midpoint by its frequency, add, then divide by ' + N + '.', steps: ['Midpoints: ' + mids.join(', '), 'Σ(midpoint × frequency) = ' + tot, 'Estimate of mean = ' + tot + ' ÷ ' + N + ' = ' + fmt(mean)] };
  } });

  def({ id: 'y9-stats-corr', year: Y, topic: 'stats', tier: 1, quick: true, gen: function (r) {
    const it = r.pick([['the number of hours spent revising and the test score', 'Positive correlation'], ['the outside temperature and the number of hot drinks sold', 'Negative correlation'],
      ['the age of a car and its value', 'Negative correlation'], ['a student’s height and their arm span', 'Positive correlation'], ['a student’s shoe size and the month they were born', 'No correlation'],
      ['the number of hours of sunshine and the number of ice creams sold', 'Positive correlation'], ['a person’s height and the number of letters in their name', 'No correlation']]);
    return { q: 'A scatter graph is drawn to compare ' + it[0] + '. What type of correlation would you expect?', ans: ansMC(it[1], ['Positive correlation', 'Negative correlation', 'No correlation'].filter(function (s) { return s !== it[1]; }), r, true),
      hint: 'Positive: both increase together. Negative: one increases as the other decreases.', steps: [it[1] === 'No correlation' ? 'There is no link between these two things.' : it[1] === 'Positive correlation' ? 'As one increases, the other tends to increase.' : 'As one increases, the other tends to decrease.', 'Answer: ' + it[1].toLowerCase()] };
  } });

  def({ id: 'y9-stats-modal', year: Y, topic: 'stats', tier: 2, quick: false, gen: function (r) {
    const f = [r.int(2, 9), r.int(3, 12), r.int(3, 12), r.int(2, 9)], mx = Math.max.apply(null, f);
    if (f.filter(function (t) { return t === mx; }).length > 1) return null;
    const lo0 = r.pick([140, 150]), labels = f.map(function (c, i) { return (lo0 + 5 * i) + ' ≤ <i>h</i> &lt; ' + (lo0 + 5 * (i + 1)); });
    const N = f.reduce(function (a, b) { return a + b; }, 0), askMedian = r.chance(0.5);
    let ansIdx = f.indexOf(mx);
    if (askMedian) { const pos = (N + 1) / 2; let cum = 0; for (let i = 0; i < 4; i++) { cum += f[i]; if (cum >= Math.ceil(pos)) { ansIdx = i; break; } } if (N % 2 === 0) { let cum2 = 0, i1 = -1, i2 = -1; for (let i = 0; i < 4; i++) { cum2 += f[i]; if (i1 < 0 && cum2 >= N / 2) i1 = i; if (i2 < 0 && cum2 >= N / 2 + 1) i2 = i; } if (i1 !== i2) return null; ansIdx = i1; } }
    return { q: 'The table shows the heights, ' + v('h') + ' cm, of ' + N + ' students. ' + (askMedian ? 'Which class contains the median height?' : 'Which is the modal class?'), dg: M.table(['Height, <i>h</i> (cm)', 'Frequency'], f.map(function (c, i) { return [labels[i], c]; })),
      ans: ansMC(labels[ansIdx], labels.filter(function (l, i) { return i !== ansIdx; }), r, true), hint: askMedian ? 'The median is the ' + (N % 2 ? ((N + 1) / 2) + 'th' : (N / 2) + 'th and ' + (N / 2 + 1) + 'th') + ' value. Add up the frequencies as you go.' : 'The modal class has the highest frequency.',
      steps: askMedian ? ['There are ' + N + ' students, so the median is the ' + (N % 2 ? ord((N + 1) / 2) : ord(N / 2) + ' and ' + ord(N / 2 + 1)) + ' value.', 'Running totals: ' + f.map(function (c, i) { return f.slice(0, i + 1).reduce(function (a, b) { return a + b; }, 0); }).join(', '), 'So the median is in ' + labels[ansIdx] + '.'] : ['The highest frequency is ' + mx + '.', 'Modal class: ' + labels[ansIdx]] };
  } });

  def({ id: 'y9-stats-compare', year: Y, topic: 'stats', tier: 2, quick: false, gen: function (r) {
    const mA = r.int(10, 30), mB = mA + r.nonZero(-6, 6), rA = r.int(5, 20), rB = rA + r.pick([-1, 1]) * r.int(3, 10);
    if (rB < 2) return null;
    const hi = mB > mA ? 'Girls' : 'Boys', lo = hi === 'Girls' ? 'Boys' : 'Girls', cons = rB < rA ? 'Girls' : 'Boys', incon = cons === 'Girls' ? 'Boys' : 'Girls';
    const correct = 'On average the ' + hi.toLowerCase() + ' did more push-ups, and the ' + cons.toLowerCase() + '’ results were more consistent.';
    return { q: 'In a fitness test, the boys’ push-ups had a median of ' + mA + ' and a range of ' + rA + '. The girls’ push-ups had a median of ' + mB + ' and a range of ' + rB + '. Which statement is correct?',
      ans: ansMC(correct, ['On average the ' + lo.toLowerCase() + ' did more push-ups, and the ' + cons.toLowerCase() + '’ results were more consistent.', 'On average the ' + hi.toLowerCase() + ' did more push-ups, and the ' + incon.toLowerCase() + '’ results were more consistent.', 'On average the ' + lo.toLowerCase() + ' did more push-ups, and the ' + incon.toLowerCase() + '’ results were more consistent.'], r),
      hint: 'Compare the medians (average) and the ranges (spread).', steps: ['Higher median: ' + hi.toLowerCase() + ' (' + Math.max(mA, mB) + ')', 'Smaller range = more consistent: ' + cons.toLowerCase() + ' (' + Math.min(rA, rB) + ')'] };
  } });

})(typeof module !== 'undefined' && module.exports ? require('./q-core.js') : window.MSD);

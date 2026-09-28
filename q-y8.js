/* Maths Sports Day — Year 8 (J2T) questions, Cambridge Lower Secondary Stage 8 / Learner's Book 8.
   Unit 6 (Planning and collecting data) is not included. Tier 1 Bronze, 2 Silver, 3 Gold. */
(function (M) {
  'use strict';
  const def = M.def, fmt = M.fmt, paren = M.paren, lin = M.lin, v = M.v, pow = M.pow, F = M.fracHTML, fx = M.fx, mixed = M.mixedHTML,
    ansNum = M.ansNum, ansFrac = M.ansFrac, ansMC = M.ansMC, DG = M.DG, gcd = M.gcd, lcm = M.lcm, fr = M.fr, coord = M.coord,
    MINUS = M.MINUS, NAMES = M.NAMES, NAMES_F = M.NAMES_F, money = M.money, vec = M.vec;
  const Y = 8;
  const x = v('x'), y = v('y'), n = v('n');
  function ord(k) { const s = ['th', 'st', 'nd', 'rd'], m = k % 100; return k + (s[(m - 20) % 10] || s[m] || s[0]); }
  function op(c) { return c < 0 ? ' ' + MINUS + ' ' + fmt(-c) : ' + ' + fmt(c); }
  function sq(t) { return t + '<sup>2</sup>'; }
  function properFrac(r, dens) { const d = r.pick(dens); let k, g = 0; do { k = r.int(1, d - 1); } while (gcd(k, d) !== 1 && g++ < 30); return fr(k, d); }
  function nthExpr(a, b) { return a < 0 ? lin([[b, ''], [a, n]]) : lin([[a, n], [b, '']]); }

  M.topic(Y, 'int', 1, 'Integers', 'N');
  M.topic(Y, 'alg', 2, 'Expressions, formulae & equations', 'A');
  M.topic(Y, 'pv', 3, 'Place value & rounding', 'N');
  M.topic(Y, 'dec', 4, 'Decimals', 'N');
  M.topic(Y, 'ang', 5, 'Angles', 'G');
  M.topic(Y, 'frac', 7, 'Fractions', 'N');
  M.topic(Y, 'shape', 8, 'Shapes & symmetry', 'G');
  M.topic(Y, 'seq', 9, 'Sequences & functions', 'A');
  M.topic(Y, 'pct', 10, 'Percentages', 'N');
  M.topic(Y, 'graph', 11, 'Graphs', 'A');
  M.topic(Y, 'ratio', 12, 'Ratio & proportion', 'N');
  M.topic(Y, 'prob', 13, 'Probability', 'S');
  M.topic(Y, 'trans', 14, 'Position & transformation', 'G');
  M.topic(Y, 'area', 15, 'Area & volume', 'G');
  M.topic(Y, 'stats', 16, 'Interpreting & discussing results', 'S');

  /* ===== Unit 1 Integers ===== */
  def({ id: 'y8-int-muldiv', year: Y, topic: 'int', tier: 1, quick: true, gen: function (r) {
    const p = r.int(2, 12), q = r.int(2, 12); let sa = r.sign(), sb = r.sign();
    if (sa > 0 && sb > 0) { sa = -1; sb = -1; }
    let A, B, res, sym;
    if (r.chance(0.5)) { A = sa * p; B = sb * q; res = A * B; sym = ' × '; }
    else { A = sa * p * q; B = sb * q; res = A / B; sym = ' ÷ '; }
    return { q: 'Work out ' + fmt(A) + sym + paren(B), ans: ansNum(res), hint: 'Same signs → positive. Different signs → negative.',
      steps: [(sa === sb ? 'The signs are the same, so the answer is positive.' : 'The signs are different, so the answer is negative.'), 'Answer: ' + fmt(res)] };
  } });

  def({ id: 'y8-int-powers', year: Y, topic: 'int', tier: 1, quick: true, gen: function (r) {
    const t = r.int(0, 2);
    if (t === 0) { const k = r.int(2, 12); return { q: 'Work out (' + MINUS + k + ')<sup>2</sup>', ans: ansNum(k * k), hint: 'A negative number times a negative number is positive.', steps: ['(' + MINUS + k + ') × (' + MINUS + k + ') = ' + k * k] }; }
    const k = r.pick([2, 3, 4, 5, 10]);
    if (t === 1) return { q: 'Work out (' + MINUS + k + ')<sup>3</sup>', ans: ansNum(-k * k * k), hint: 'Three negatives multiplied together give a negative answer.', steps: ['(' + MINUS + k + ') × (' + MINUS + k + ') × (' + MINUS + k + ') = ' + fmt(-k * k * k)] };
    return { q: 'Work out ∛(' + fmt(-k * k * k) + ')', ans: ansNum(-k), hint: 'Which number cubed gives ' + fmt(-k * k * k) + '?', steps: ['(' + MINUS + k + ')<sup>3</sup> = ' + fmt(-k * k * k) + ', so ∛(' + fmt(-k * k * k) + ') = ' + fmt(-k)] };
  } });

  def({ id: 'y8-int-index', year: Y, topic: 'int', tier: 2, quick: true, gen: function (r) {
    const a = r.int(2, 9), m = r.int(3, 9), k = r.int(2, 6), t = r.int(0, 3);
    if (t === 0) return { q: 'Simplify ' + pow(a, m) + ' × ' + pow(a, k) + '<br><small>Give your answer as a single power of ' + a + '.</small>', ans: ansMC(pow(a, m + k), [pow(a, m * k), pow(a * a, m + k), pow(a, m - k)], r),
      hint: 'When you multiply powers of the same number, add the indices.', steps: [pow(a, m) + ' × ' + pow(a, k) + ' = ' + a + '<sup>' + m + ' + ' + k + '</sup> = ' + pow(a, m + k)] };
    if (t === 1) { if (Math.abs(m - k) < 2) return null; const hi = Math.max(m, k), lo = Math.min(m, k);
      return { q: 'Simplify ' + pow(a, hi) + ' ÷ ' + pow(a, lo) + '<br><small>Give your answer as a single power of ' + a + '.</small>', ans: ansMC(pow(a, hi - lo), [pow(a, hi + lo), pow(1, hi - lo), pow(a, hi * lo)], r),
        hint: 'When you divide powers of the same number, subtract the indices.', steps: [pow(a, hi) + ' ÷ ' + pow(a, lo) + ' = ' + a + '<sup>' + hi + ' ' + MINUS + ' ' + lo + '</sup> = ' + pow(a, hi - lo)] }; }
    if (t === 2) { const b = r.int(2, 25); return { q: 'Work out ' + pow(b, 0), ans: ansNum(1), hint: 'Any non-zero number to the power 0 is 1.', steps: ['Any non-zero number to the power 0 equals 1.', pow(b, 0) + ' = 1'] }; }
    const b = r.pick([2, 3, 5, 10]), hi = r.int(4, 7), lo = r.int(1, hi - 2), val = Math.pow(b, hi - lo);
    if (val > 1000) return null;
    return { q: 'Work out ' + pow(b, hi) + ' ÷ ' + pow(b, lo), ans: ansNum(val), hint: 'Subtract the indices first.', steps: [pow(b, hi) + ' ÷ ' + pow(b, lo) + ' = ' + pow(b, hi - lo), '= ' + val] };
  } });

  function pfString(ex) { // ex: {2:e2,3:e3,5:e5,7:e7}
    return [2, 3, 5, 7].filter(function (p) { return ex[p] > 0; }).map(function (p) { return ex[p] === 1 ? String(p) : pow(p, ex[p]); }).join(' × ');
  }
  function pfValue(ex) { return Math.pow(2, ex[2]) * Math.pow(3, ex[3]) * Math.pow(5, ex[5]) * Math.pow(7, ex[7]); }
  def({ id: 'y8-int-primefac', year: Y, topic: 'int', tier: 2, quick: false, gen: function (r) {
    const ex = { 2: r.int(1, 3), 3: r.int(0, 2), 5: r.int(0, 1), 7: r.int(0, 1) };
    const val = pfValue(ex), mult = ex[2] + ex[3] + ex[5] + ex[7], distinct = [2, 3, 5, 7].filter(function (p) { return ex[p] > 0; }).length;
    if (val < 60 || val > 600 || mult < 4 || distinct < 2) return null;
    const correct = pfString(ex);
    const d1 = Object.assign({}, ex); d1[2] += 1;
    const d2 = Object.assign({}, ex); d2[3] = ex[3] > 0 ? ex[3] - 1 : 1;
    const d3 = Object.assign({}, ex); d3[2] = ex[3]; d3[3] = ex[2];
    let comp;
    if (ex[5] > 0 && ex[2] > 0) { const e = Object.assign({}, ex); e[2] -= 1; e[5] -= 1; comp = (pfString(e) ? pfString(e) + ' × ' : '') + '10'; }
    else if (ex[3] > 0) { const e = Object.assign({}, ex); e[2] -= 1; e[3] -= 1; comp = (pfString(e) ? pfString(e) + ' × ' : '') + '6'; }
    const ds = [pfString(d1), pfString(d2), comp].concat(pfValue(d3) !== val ? [pfString(d3)] : []).filter(Boolean);
    const st = []; let cur = val;
    [2, 3, 5, 7].forEach(function (p) { while (cur % p === 0) { st.push(cur + ' ÷ ' + p + ' = ' + cur / p); cur /= p; } });
    st.push('So ' + val + ' = ' + correct);
    return { q: 'Write ' + val + ' as a product of its prime factors.', ans: ansMC(correct, ds, r), hint: 'Keep dividing by the smallest prime that goes in exactly: 2, then 3, then 5…', steps: st };
  } });

  def({ id: 'y8-int-hcflcm', year: Y, topic: 'int', tier: 2, quick: false, gen: function (r) {
    if (r.chance(0.5)) {
      const g = r.pick([6, 8, 12, 14, 15, 18, 21, 24]); let m1 = r.int(2, 9), m2 = r.int(2, 9), t = 0;
      while ((m1 === m2 || gcd(m1, m2) !== 1 || g * Math.max(m1, m2) > 200) && t++ < 60) { m1 = r.int(2, 9); m2 = r.int(2, 9); }
      if (m1 === m2 || gcd(m1, m2) !== 1 || g * Math.max(m1, m2) > 200) return null;
      return { q: 'Find the highest common factor (HCF) of ' + g * m1 + ' and ' + g * m2 + '.', ans: ansNum(g), hint: 'Write each number as a product of prime factors and pick out the common ones.',
        steps: [g * m1 + ' = ' + g + ' × ' + m1, g * m2 + ' = ' + g + ' × ' + m2, m1 + ' and ' + m2 + ' share no factor, so HCF = ' + g] };
    }
    let A, B, L, t = 0;
    do { A = r.pick([12, 14, 15, 16, 18, 20, 21, 24, 28, 30, 35, 36, 40, 45]); B = r.pick([12, 14, 15, 16, 18, 20, 21, 24, 28, 30, 35, 36, 40, 45]); L = lcm(A, B); } while ((A === B || L > 360 || L === A || L === B) && t++ < 100);
    if (A === B || L > 360 || L === A || L === B) return null;
    return { q: 'Find the lowest common multiple (LCM) of ' + A + ' and ' + B + '.', ans: ansNum(L), hint: 'HCF × LCM = the product of the two numbers.',
      steps: ['HCF of ' + A + ' and ' + B + ' is ' + gcd(A, B), 'LCM = ' + A + ' × ' + B + ' ÷ ' + gcd(A, B) + ' = ' + L] };
  } });

  def({ id: 'y8-int-hier', year: Y, topic: 'int', tier: 3, quick: true, gen: function (r) {
    const t = r.int(0, 2), neg = -r.int(1, 20), nat = r.int(2, 30), f = properFrac(r, [3, 4, 5, 7, 8]), dec = M.clean(r.int(11, 99) / 10);
    if (t === 0) return { q: 'Which of these numbers is an integer but NOT a natural number?', ans: ansMC(fmt(neg), [fmt(nat), F(f.n, f.d), fmt(dec)], r), hint: 'Natural numbers are 1, 2, 3, … Integers also include the negative whole numbers.',
      steps: ['Natural numbers: 1, 2, 3, …', 'Integers also include 0 and negative whole numbers.', fmt(neg) + ' is an integer but not a natural number.'] };
    if (t === 1) { const k = r.int(2, 6), whole = F(k * r.int(2, 5), k);
      return { q: 'Which of these numbers is rational but NOT an integer?', ans: ansMC(F(f.n, f.d), [fmt(neg), fmt(nat), whole], r), hint: 'Check whether each one simplifies to a whole number.',
        steps: [whole + ' simplifies to a whole number, so it is an integer.', F(f.n, f.d) + ' is a fraction that is not a whole number, so it is rational but not an integer.'] }; }
    return { q: 'Which of these numbers is a natural number?', ans: ansMC(fmt(nat), [fmt(neg), F(f.n, f.d), fmt(M.clean(-dec))], r), hint: 'Natural numbers are the counting numbers 1, 2, 3, …', steps: [fmt(nat) + ' is a counting number, so it is a natural number.'] };
  } });

  def({ id: 'y8-int-order', year: Y, topic: 'int', tier: 2, quick: false, gen: function (r) {
    const t = r.int(0, 2);
    if (t === 0) { const a = r.int(2, 6), b = r.int(2, 6), c = r.int(2, 6), res = a * a + b * c;
      return { q: 'Work out (' + MINUS + a + ')<sup>2</sup> ' + MINUS + ' ' + b + ' × (' + MINUS + c + ')', ans: ansNum(res), hint: 'Index first, then multiplication, then subtraction.',
        steps: ['(' + MINUS + a + ')<sup>2</sup> = ' + a * a, b + ' × (' + MINUS + c + ') = ' + fmt(-b * c), a * a + ' ' + MINUS + ' (' + fmt(-b * c) + ') = ' + res] }; }
    if (t === 1) { const a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 6), res = -a * b + c * c;
      return { q: 'Work out ' + MINUS + a + ' × ' + b + ' + ' + pow(c, 2), ans: ansNum(res), hint: 'Do the index and the multiplication before adding.',
        steps: [MINUS + a + ' × ' + b + ' = ' + fmt(-a * b), pow(c, 2) + ' = ' + c * c, fmt(-a * b) + ' + ' + c * c + ' = ' + fmt(res)] }; }
    const a = r.int(1, 5), b = r.int(a + 2, a + 8), d = a - b, sqv = d * d, divs = [];
    for (let k = 2; k <= 10; k++) if (sqv % k === 0) divs.push(k);
    if (!divs.length) return null;
    const c = r.pick(divs);
    return { q: 'Work out (' + a + ' ' + MINUS + ' ' + b + ')<sup>2</sup> ÷ ' + c, ans: ansNum(sqv / c), hint: 'Brackets first, then the index, then divide.',
      steps: [a + ' ' + MINUS + ' ' + b + ' = ' + fmt(d), '(' + fmt(d) + ')<sup>2</sup> = ' + sqv, sqv + ' ÷ ' + c + ' = ' + sqv / c] };
  } });

  /* ===== Unit 2 Expressions, formulae and equations ===== */
  def({ id: 'y8-alg-sub', year: Y, topic: 'alg', tier: 1, quick: true, gen: function (r) {
    const t = r.int(0, 3);
    if (t === 0) { const a = r.int(2, 5), k = -r.int(2, 6); return { q: 'Find the value of ' + a + sq(x) + ' when ' + x + ' = ' + fmt(k) + '.', ans: ansNum(a * k * k), hint: 'Square first, then multiply by ' + a + '.', steps: [a + ' × (' + fmt(k) + ')<sup>2</sup> = ' + a + ' × ' + k * k + ' = ' + a * k * k] }; }
    if (t === 1) { const c = r.int(1, 9), k = -r.int(1, 4); return { q: 'Find the value of ' + x + '<sup>3</sup> ' + MINUS + ' ' + c + ' when ' + x + ' = ' + fmt(k) + '.', ans: ansNum(k * k * k - c), hint: 'A negative number cubed is negative.', steps: ['(' + fmt(k) + ')<sup>3</sup> = ' + fmt(k * k * k), fmt(k * k * k) + ' ' + MINUS + ' ' + c + ' = ' + fmt(k * k * k - c)] }; }
    if (t === 2) { const a = -r.int(1, 5), b = r.int(1, 6), res = 3 * a * a - 2 * b; return { q: 'Find the value of 3' + sq(v('a')) + ' ' + MINUS + ' 2' + v('b') + ' when ' + v('a') + ' = ' + fmt(a) + ' and ' + v('b') + ' = ' + b + '.', ans: ansNum(res), hint: 'Substitute into each term separately.', steps: ['3 × (' + fmt(a) + ')<sup>2</sup> = ' + 3 * a * a, '2 × ' + b + ' = ' + 2 * b, 3 * a * a + ' ' + MINUS + ' ' + 2 * b + ' = ' + fmt(res)] }; }
    const c = r.int(2, 6), k = -r.int(c + 1, c + 6), res = (k + c) * (k + c);
    return { q: 'Find the value of (' + x + ' + ' + c + ')<sup>2</sup> when ' + x + ' = ' + fmt(k) + '.', ans: ansNum(res), hint: 'Work out the bracket first.', steps: [fmt(k) + ' + ' + c + ' = ' + fmt(k + c), '(' + fmt(k + c) + ')<sup>2</sup> = ' + res] };
  } });

  def({ id: 'y8-alg-expand', year: Y, topic: 'alg', tier: 2, quick: true, gen: function (r) {
    const a = r.int(2, 6), b = r.int(1, 5), c = r.nonZero(-9, 9);
    const correct = lin([[a * b, sq(x)], [a * c, x]]);
    const ds = [lin([[a * b, sq(x)], [c, '']]), lin([[a * b, x], [a * c, x]]) === correct ? '' : lin([[a * b, x], [a * c, '']]), lin([[a * b, sq(x)], [-a * c, x]]), lin([[a + b, sq(x)], [a * c, x]])].filter(Boolean);
    return { q: 'Expand ' + a + x + '(' + lin([[b, x], [c, '']]) + ')', ans: ansMC(correct, ds, r), hint: 'Multiply ' + a + x + ' by each term. ' + x + ' × ' + x + ' = ' + sq(x) + '.',
      steps: [a + x + ' × ' + lin([[b, x]]) + ' = ' + lin([[a * b, sq(x)]]), a + x + ' × ' + paren(c) + ' = ' + lin([[a * c, x]]), 'Answer: ' + correct] };
  } });

  def({ id: 'y8-alg-factor', year: Y, topic: 'alg', tier: 2, quick: false, gen: function (r) {
    const k = r.pick([4, 6, 8, 9, 10, 12]); let a = r.int(1, 5), b = r.nonZero(-7, 7), t = 0;
    while ((gcd(a, b) !== 1) && t++ < 40) { a = r.int(1, 5); b = r.nonZero(-7, 7); }
    if (gcd(a, b) !== 1) return null;
    const part = k % 2 === 0 ? 2 : 3;
    if (r.chance(0.5)) {
      const expr = lin([[k * a, x], [k * b, '']]), correct = k + '(' + lin([[a, x], [b, '']]) + ')';
      return { q: 'Factorise fully ' + expr, ans: ansMC(correct, [part + '(' + lin([[k * a / part, x], [k * b / part, '']]) + ')', k + '(' + lin([[a, x], [k * b, '']]) + ')', k + x + '(' + lin([[a, ''], [b, '']]) + ')'], r),
        hint: 'Find the HCF of ' + k * a + ' and ' + fmt(Math.abs(k * b)) + '.', steps: ['The HCF of ' + k * a + ' and ' + fmt(Math.abs(k * b)) + ' is ' + k + '.', expr + ' = ' + correct] };
    }
    const expr = lin([[k * a, sq(x)], [k * b, x]]), correct = k + x + '(' + lin([[a, x], [b, '']]) + ')';
    return { q: 'Factorise fully ' + expr, ans: ansMC(correct, [k + '(' + lin([[a, sq(x)], [b, x]]) + ')', x + '(' + lin([[k * a, x], [k * b, '']]) + ')', part + x + '(' + lin([[k * a / part, x], [k * b / part, '']]) + ')'], r),
      hint: 'The HCF includes a number AND ' + x + '.', steps: ['The HCF of ' + lin([[k * a, sq(x)]]) + ' and ' + lin([[Math.abs(k * b), x]]) + ' is ' + k + x + '.', expr + ' = ' + correct] };
  } });

  def({ id: 'y8-alg-solveboth', year: Y, topic: 'alg', tier: 2, quick: false, gen: function (r) {
    const c = r.int(2, 7), a = r.int(c + 1, c + 6), k = r.nonZero(-6, 10), b = r.nonZero(-12, 12), d = (a - c) * k + b;
    return { q: 'Solve ' + lin([[a, x], [b, '']]) + ' = ' + lin([[c, x], [d, '']]), ans: ansNum(k), hint: 'Subtract ' + c + x + ' from both sides first.',
      steps: ['Subtract ' + c + x + ': ' + lin([[a - c, x], [b, '']]) + ' = ' + fmt(d), (b > 0 ? 'Subtract ' + b : 'Add ' + (-b)) + ': ' + lin([[a - c, x]]) + ' = ' + fmt(d - b), x + ' = ' + fmt(k)] };
  } });

  def({ id: 'y8-alg-solvefrac', year: Y, topic: 'alg', tier: 2, quick: false, gen: function (r) {
    const a = r.int(2, 6);
    if (r.chance(0.5)) { const b = r.nonZero(-8, 9), c = r.int(-5, 9), k = a * (c - b);
      return { q: 'Solve ' + fx(x, a) + op(b) + ' = ' + fmt(c), ans: ansNum(k), hint: 'Undo the ' + (b > 0 ? 'add' : 'subtract') + ' first, then multiply by ' + a + '.',
        steps: [fx(x, a) + ' = ' + fmt(c - b), x + ' = ' + fmt(c - b) + ' × ' + a + ' = ' + fmt(k)] }; }
    const b = r.nonZero(-8, 9), c = r.int(-4, 9), k = a * c - b;
    return { q: 'Solve ' + fx(lin([[1, x], [b, '']]), a) + ' = ' + fmt(c), ans: ansNum(k), hint: 'Multiply both sides by ' + a + ' first.',
      steps: [lin([[1, x], [b, '']]) + ' = ' + fmt(c) + ' × ' + a + ' = ' + fmt(a * c), x + ' = ' + fmt(a * c) + (b > 0 ? ' ' + MINUS + ' ' + b : ' + ' + (-b)) + ' = ' + fmt(k)] };
  } });

  def({ id: 'y8-alg-solvebrk', year: Y, topic: 'alg', tier: 3, quick: false, gen: function (r) {
    const c = r.int(1, 5), a = r.int(c + 1, c + 5), b = r.int(1, 8), k = r.int(-4, 10), d = a * (k - b) - c * k;
    return { q: 'Solve ' + a + '(' + x + ' ' + MINUS + ' ' + b + ') = ' + lin([[c, x], [d, '']]), ans: ansNum(k), hint: 'Expand the bracket, then get the ' + x + ' terms on one side.',
      steps: ['Expand: ' + lin([[a, x], [-a * b, '']]) + ' = ' + lin([[c, x], [d, '']]), 'Subtract ' + (c === 1 ? '' : c) + x + ': ' + lin([[a - c, x], [-a * b, '']]) + ' = ' + fmt(d), 'Add ' + a * b + ': ' + lin([[a - c, x]]) + ' = ' + fmt(d + a * b), x + ' = ' + fmt(k)] };
  } });

  def({ id: 'y8-alg-subject', year: Y, topic: 'alg', tier: 3, quick: false, gen: function (r) {
    const t = r.int(0, 2), a = r.int(2, 9), b = r.int(1, 12);
    if (t === 0) return { q: 'Make ' + x + ' the subject of ' + y + ' = ' + lin([[a, x], [b, '']]), ans: ansMC(x + ' = ' + fx(y + ' ' + MINUS + ' ' + b, a), [x + ' = ' + fx(y + ' + ' + b, a), x + ' = ' + fx(y, a) + ' ' + MINUS + ' ' + b, x + ' = ' + a + y + ' ' + MINUS + ' ' + b], r),
      hint: 'Undo the operations in reverse order: subtract ' + b + ', then divide by ' + a + '.', steps: [y + ' ' + MINUS + ' ' + b + ' = ' + a + x, x + ' = ' + fx(y + ' ' + MINUS + ' ' + b, a)] };
    if (t === 1) return { q: 'Make ' + x + ' the subject of ' + y + ' = ' + a + '(' + x + ' ' + MINUS + ' ' + b + ')', ans: ansMC(x + ' = ' + fx(y, a) + ' + ' + b, [x + ' = ' + fx(y, a) + ' ' + MINUS + ' ' + b, x + ' = ' + fx(y + ' + ' + b, a), x + ' = ' + a + y + ' + ' + b], r),
      hint: 'Divide by ' + a + ' first, then add ' + b + '.', steps: [fx(y, a) + ' = ' + x + ' ' + MINUS + ' ' + b, x + ' = ' + fx(y, a) + ' + ' + b] };
    const V = v('v'), U = v('u'), A = v('a'), Tt = v('t');
    return { q: 'Make ' + Tt + ' the subject of the formula ' + V + ' = ' + U + ' + ' + A + Tt, ans: ansMC(Tt + ' = ' + fx(V + ' ' + MINUS + ' ' + U, A), [Tt + ' = ' + fx(V + ' + ' + U, A), Tt + ' = ' + fx(V, A) + ' ' + MINUS + ' ' + U, Tt + ' = ' + fx(U + ' ' + MINUS + ' ' + V, A)], r),
      hint: 'Subtract ' + U + ' from both sides, then divide by ' + A + '.', steps: [V + ' ' + MINUS + ' ' + U + ' = ' + A + Tt, Tt + ' = ' + fx(V + ' ' + MINUS + ' ' + U, A)] };
  } });

  def({ id: 'y8-alg-formula', year: Y, topic: 'alg', tier: 1, quick: true, gen: function (r) {
    const t = r.int(0, 2);
    if (t === 0) { const u = r.int(0, 20), a = r.int(2, 10), tt = r.int(2, 10), res = u + a * tt;
      return { q: 'Use the formula ' + v('v') + ' = ' + v('u') + ' + ' + v('a') + v('t') + ' to find ' + v('v') + ' when ' + v('u') + ' = ' + u + ', ' + v('a') + ' = ' + a + ' and ' + v('t') + ' = ' + tt + '.', ans: ansNum(res), hint: v('a') + v('t') + ' means ' + v('a') + ' × ' + v('t') + '.', steps: [v('v') + ' = ' + u + ' + ' + a + ' × ' + tt, '= ' + u + ' + ' + a * tt + ' = ' + res] }; }
    if (t === 1) { const C = r.pick([0, 10, 20, 25, 30, 35, 40, 100, -10, -40, 5, 15]), F_ = M.clean(1.8 * C + 32);
      return { q: 'The formula ' + v('F') + ' = 1.8' + v('C') + ' + 32 changes degrees Celsius to degrees Fahrenheit. Find ' + v('F') + ' when ' + v('C') + ' = ' + fmt(C) + '.', ans: ansNum(F_), hint: 'Multiply by 1.8, then add 32.', steps: ['1.8 × ' + paren(C) + ' = ' + fmt(M.clean(1.8 * C)), fmt(M.clean(1.8 * C)) + ' + 32 = ' + fmt(F_)] }; }
    const l = r.int(3, 20), w = r.int(2, 15), res = 2 * (l + w);
    return { q: 'The perimeter of a rectangle is ' + v('P') + ' = 2(' + v('l') + ' + ' + v('w') + '). Find ' + v('P') + ' when ' + v('l') + ' = ' + l + ' and ' + v('w') + ' = ' + w + '.', ans: ansNum(res), hint: 'Add inside the bracket first.', steps: [l + ' + ' + w + ' = ' + (l + w), '2 × ' + (l + w) + ' = ' + res] };
  } });

  def({ id: 'y8-alg-ineq', year: Y, topic: 'alg', tier: 2, quick: true, gen: function (r) {
    const a = r.int(-4, 1), b = a + r.int(2, 5), ca = r.chance(0.5), cb = r.chance(0.5);
    const sym = function (closed) { return closed ? ' ≤ ' : ' &lt; '; };
    if (r.chance(0.5)) {
      const correct = fmt(a) + sym(ca) + x + sym(cb) + fmt(b);
      const all = [[true, true], [true, false], [false, true], [false, false]].map(function (p) { return fmt(a) + sym(p[0]) + x + sym(p[1]) + fmt(b); });
      return { q: 'Which inequality is shown on the number line?', dg: DG.numberLine(a - 2, b + 2, a, ca, b, cb), ans: ansMC(correct, all.filter(function (s) { return s !== correct; }), r),
        hint: 'A filled circle means the number IS included (≤). An open circle means it is not (&lt;).', steps: ['Left end ' + fmt(a) + ': ' + (ca ? 'filled circle, so ≤' : 'open circle, so &lt;'), 'Right end ' + fmt(b) + ': ' + (cb ? 'filled circle, so ≤' : 'open circle, so &lt;'), 'Answer: ' + correct] };
    }
    const lo = ca ? a : a + 1, hi = cb ? b : b - 1, list = []; for (let i = lo; i <= hi; i++) list.push(fmt(i));
    return { q: 'How many integers ' + n + ' satisfy ' + fmt(a) + sym(ca) + n + sym(cb) + fmt(b) + '?', ans: ansNum(list.length), hint: 'List them. Check whether ' + fmt(a) + ' and ' + fmt(b) + ' are included.',
      steps: ['The integers are: ' + list.join(', '), 'There are ' + list.length + '.'] };
  } });

  def({ id: 'y8-alg-words', year: Y, topic: 'alg', tier: 2, quick: false, gen: function (r) {
    const a = r.int(2, 5), b = r.int(1, 9);
    if (a === b) return null;
    if (r.chance(0.5)) {
      const correct = fx(n, a) + ' ' + MINUS + ' ' + b;
      return { q: 'Think of a number ' + n + '. Divide it by ' + a + ', then subtract ' + b + '. Which expression shows the result?', ans: ansMC(correct, [fx(n + ' ' + MINUS + ' ' + b, a), a + n + ' ' + MINUS + ' ' + b, b + ' ' + MINUS + ' ' + fx(n, a)], r),
        hint: 'Do the operations in the order given.', steps: ['Divide by ' + a + ': ' + fx(n, a), 'Subtract ' + b + ': ' + correct] };
    }
    const correct = fx(n + ' + ' + b, a);
    return { q: 'Think of a number ' + n + '. Add ' + b + ', then divide by ' + a + '. Which expression shows the result?', ans: ansMC(correct, [fx(n, a) + ' + ' + b, a + '(' + n + ' + ' + b + ')', fx(n + ' + ' + a, b)], r),
      hint: 'The whole of (' + n + ' + ' + b + ') is divided by ' + a + '.', steps: ['Add ' + b + ': ' + n + ' + ' + b, 'Divide the whole thing by ' + a + ': ' + correct] };
  } });

  /* ===== Unit 3 Place value and rounding ===== */
  def({ id: 'y8-pv-01', year: Y, topic: 'pv', tier: 1, quick: true, gen: function (r) {
    const num = M.clean(r.int(2, 999) / Math.pow(10, r.int(0, 2))), p = r.pick([0.1, 0.01]), mul = r.chance(0.5);
    const res = M.clean(mul ? num * p : num / p), eq = p === 0.1 ? 10 : 100;
    return { q: 'Work out ' + fmt(num) + (mul ? ' × ' : ' ÷ ') + fmt(p), ans: ansNum(res), hint: (mul ? 'Multiplying' : 'Dividing') + ' by ' + fmt(p) + ' is the same as ' + (mul ? 'dividing' : 'multiplying') + ' by ' + eq + '.',
      steps: [fmt(num) + (mul ? ' × ' : ' ÷ ') + fmt(p) + ' = ' + fmt(num) + (mul ? ' ÷ ' : ' × ') + eq, '= ' + fmt(res)] };
  } });

  def({ id: 'y8-pv-sf', year: Y, topic: 'pv', tier: 2, quick: true, gen: function (r) {
    const t = r.int(0, 2); let val, sf;
    if (t === 0) { val = r.int(10001, 99999); sf = r.int(1, 3); }
    else if (t === 1) { val = M.clean(r.int(1001, 9999) / Math.pow(10, r.int(5, 6))); sf = r.int(1, 2); }
    else { val = M.clean(r.int(10001, 99999) / 10000 * r.pick([1, 10])); sf = r.int(2, 3); }
    const res = M.roundSF(val, sf);
    if (res === val) return null;
    if (val < 1000) { const digits = M.plain(res).replace('-', '').replace('.', '').replace(/^0+/, ''); if (digits.length !== sf) return null; }
    return { q: 'Round ' + fmt(val) + ' to ' + sf + ' significant figure' + (sf > 1 ? 's' : '') + '.', ans: ansNum(res), hint: 'The first significant figure is the first non-zero digit.',
      steps: ['Count ' + sf + ' significant figure' + (sf > 1 ? 's' : '') + ' from the first non-zero digit, then look at the next digit to decide whether to round up.', 'Answer: ' + fmt(res)] };
  } });

  def({ id: 'y8-pv-est', year: Y, topic: 'pv', tier: 3, quick: false, gen: function (r) {
    const A1 = r.pick([20, 30, 40, 50, 60, 70, 80, 90, 200, 300, 400]), B1 = r.int(2, 9), C1 = r.pick([0.2, 0.4, 0.5, 2, 4, 5]);
    const est = M.clean(A1 * B1 / C1);
    if (est !== Math.round(est)) return null;
    const jig = function (base) { let val, g = 0; do { val = M.clean(base * (1 + (r.int(-35, 35) / 1000))); val = M.roundTo(val, base >= 100 ? 0 : base >= 10 ? 1 : base >= 1 ? 2 : 3); } while ((M.roundSF(val, 1) !== base || val === base) && g++ < 50); return val; };
    const A = jig(A1), B = jig(B1), C = jig(C1);
    if (M.roundSF(A, 1) !== A1 || M.roundSF(B, 1) !== B1 || M.roundSF(C, 1) !== C1) return null;
    return { q: 'Estimate the value of ' + fx(fmt(A) + ' × ' + fmt(B), fmt(C)) + ' by rounding each number to 1 significant figure.', ans: ansNum(est), hint: 'Round each number to 1 s.f. first, then calculate.',
      steps: [fmt(A) + ' ≈ ' + fmt(A1) + ', ' + fmt(B) + ' ≈ ' + B1 + ', ' + fmt(C) + ' ≈ ' + fmt(C1), fx(fmt(A1) + ' × ' + B1, fmt(C1)) + ' = ' + fx(fmt(A1 * B1), fmt(C1)) + ' = ' + fmt(est)] };
  } });

  /* ===== Unit 4 Decimals ===== */
  def({ id: 'y8-dec-order', year: Y, topic: 'dec', tier: 1, quick: true, gen: function (r) {
    const X = r.int(2, 7), k = r.int(1, 9), j = r.int(1, 9);
    const vals = [M.clean(-(X / 10 + k / 100)), M.clean(-X / 10), M.clean(-(X / 10 - j / 100)), M.clean(r.int(1, 9) / 10)];
    if (vals[2] === vals[1] || vals[0] === vals[1]) return null;
    const small = r.chance(0.6);
    const answer = small ? vals[0] : vals[3];
    return { q: 'Which number is the ' + (small ? 'smallest' : 'largest') + '?', ans: ansMC(fmt(answer), vals.filter(function (t) { return t !== answer; }).map(fmt), r),
      hint: 'On a number line, numbers further to the left are smaller. ' + fmt(-0.5) + ' is less than ' + fmt(-0.4) + '.',
      steps: ['In order from smallest: ' + vals.slice().sort(function (a, b) { return a - b; }).map(fmt).join(', '), 'The ' + (small ? 'smallest' : 'largest') + ' is ' + fmt(answer) + '.'] };
  } });

  def({ id: 'y8-dec-mul', year: Y, topic: 'dec', tier: 2, quick: true, gen: function (r) {
    const a1 = r.intNot(2, 49, [10, 20, 30, 40]), b1 = r.int(2, 9), da = r.int(1, 2), db = r.int(1, 2);
    const a = M.clean(a1 / Math.pow(10, da)), b = M.clean(b1 / Math.pow(10, db)), res = M.clean(a * b);
    return { q: 'Work out ' + fmt(a) + ' × ' + fmt(b), ans: ansNum(res), hint: 'Multiply without the decimal points, then count the decimal places.',
      steps: [a1 + ' × ' + b1 + ' = ' + a1 * b1, 'There are ' + (da + db) + ' decimal places in the question, so the answer has ' + (da + db) + ' decimal places.', 'Answer: ' + fmt(res)] };
  } });

  def({ id: 'y8-dec-div', year: Y, topic: 'dec', tier: 2, quick: false, gen: function (r) {
    const b = M.clean(r.pick([r.int(2, 9), r.int(11, 25)]) / 10), q = M.clean(r.int(2, 60) / r.pick([1, 1, 10])), a = M.clean(b * q);
    if (M.plain(a).split('.')[1] && M.plain(a).split('.')[1].length > 2) return null;
    return { q: 'Work out ' + fmt(a) + ' ÷ ' + fmt(b), ans: ansNum(q), hint: 'Multiply both numbers by 10 so you divide by a whole number.',
      steps: [fmt(a) + ' ÷ ' + fmt(b) + ' = ' + fmt(M.clean(a * 10)) + ' ÷ ' + fmt(M.clean(b * 10)), '= ' + fmt(q)] };
  } });

  def({ id: 'y8-dec-easy', year: Y, topic: 'dec', tier: 3, quick: false, gen: function (r) {
    const p = r.int(12, 49), q = r.int(12, 49), N = p * q, t = r.int(0, 2);
    const forms = [[M.clean(p / 10), M.clean(q / 10), M.clean(N / 100)], [M.clean(p / 10), q * 10, N], [M.clean(p / 100), q, M.clean(N / 100)]];
    const f = forms[t];
    return { q: 'You are told that ' + p + ' × ' + q + ' = ' + fmt(N) + '. Use this to work out ' + fmt(f[0]) + ' × ' + fmt(f[1]) + '.', ans: ansNum(f[2]), hint: 'Compare each number with ' + p + ' and ' + q + ': how many times bigger or smaller?',
      steps: [fmt(f[0]) + ' is ' + p + ' ÷ ' + (t === 2 ? 100 : 10) + (t === 1 ? ' and ' + fmt(f[1]) + ' is ' + q + ' × 10' : t === 0 ? ' and ' + fmt(f[1]) + ' is ' + q + ' ÷ 10' : ''), 'Answer: ' + fmt(f[2])] };
  } });

  /* ===== Unit 5 Angles and constructions ===== */
  function angNot90(r, lo, hi) { let a, g = 0; do { a = r.int(lo, hi); } while (a >= 80 && a <= 100 && g++ < 50); return a; }
  def({ id: 'y8-ang-name', year: Y, topic: 'ang', tier: 1, quick: true, gen: function (r) {
    const th = angNot90(r, 40, 140), t = r.int(0, 2);
    let marks, name, why;
    if (t === 0) { const p = r.pick(['AR', 'AL', 'BL', 'BR']); marks = [{ at: 'top', pos: p, lab: 'a' }, { at: 'bot', pos: p, lab: 'b' }]; name = 'Corresponding angles'; why = 'They are in the same position at each crossing (an F shape).'; }
    else if (t === 1) { const pr = r.pick([['BL', 'AR'], ['BR', 'AL']]); marks = [{ at: 'top', pos: pr[0], lab: 'a' }, { at: 'bot', pos: pr[1], lab: 'b' }]; name = 'Alternate angles'; why = 'They are between the parallel lines on opposite sides of the transversal (a Z shape).'; }
    else { const pr = r.pick([['AR', 'BL'], ['AL', 'BR']]), at = r.pick(['top', 'bot']); marks = [{ at: at, pos: pr[0], lab: 'a' }, { at: at, pos: pr[1], lab: 'b' }]; name = 'Vertically opposite angles'; why = 'They are opposite each other where two lines cross.'; }
    return { q: 'What type of angles are ' + v('a') + ' and ' + v('b') + '?', dg: DG.parallel(th, marks), ans: ansMC(name, ['Corresponding angles', 'Alternate angles', 'Vertically opposite angles'].filter(function (s) { return s !== name; }), r, true),
      hint: 'Corresponding: F shape. Alternate: Z shape. Vertically opposite: X shape.', steps: [why, 'Answer: ' + name.toLowerCase() + ' (they are equal).'] };
  } });

  def({ id: 'y8-ang-par', year: Y, topic: 'ang', tier: 2, quick: true, gen: function (r) {
    const th = angNot90(r, 40, 140), pos = ['AR', 'AL', 'BL', 'BR'], p1 = r.pick(pos), p2 = r.pick(pos);
    const val = { AR: th, AL: 180 - th, BL: th, BR: 180 - th }, info = M.parallelInfo(p1, p2), res = val[p2];
    return { q: 'The horizontal lines are parallel. Find the value of ' + x + '.', dg: DG.parallel(th, [{ at: 'top', pos: p1, lab: val[p1] }, { at: 'bot', pos: p2, lab: 'x' }]), ans: ansNum(res),
      hint: 'Look for corresponding (F), alternate (Z) or vertically opposite (X) angles.', steps: [info.why, info.same ? x + ' = ' + res + '°' : x + ' = 180 ' + MINUS + ' ' + val[p1] + ' = ' + res + '°'] };
  } });

  def({ id: 'y8-ang-paralg', year: Y, topic: 'ang', tier: 3, quick: false, gen: function (r) {
    const th = angNot90(r, 45, 135), pr = r.pick([['AR', 'AR'], ['BL', 'AR'], ['BR', 'AL'], ['AL', 'AL']]);
    const val = { AR: th, AL: 180 - th, BL: th, BR: 180 - th }, target = val[pr[1]];
    const a = r.int(2, 5), b = target - a * Math.floor(target / a) + a * r.int(0, 3) ;
    const k = (target - b) / a;
    if (k !== Math.round(k) || k <= 0 || b === 0) return null;
    const expr = lin([[a, 'x'], [b, '']]).replace(/x/, 'x');
    return { q: 'The horizontal lines are parallel. Find the value of ' + x + '.', dg: DG.parallel(th, [{ at: 'top', pos: pr[0], lab: val[pr[0]] }, { at: 'bot', pos: pr[1], lab: expr }]), ans: ansNum(k),
      hint: 'The two marked angles are equal. Write an equation.', steps: [M.parallelInfo(pr[0], pr[1]).why, lin([[a, x], [b, '']]) + ' = ' + target, lin([[a, x]]) + ' = ' + (target - b), x + ' = ' + k] };
  } });

  def({ id: 'y8-ang-ext', year: Y, topic: 'ang', tier: 2, quick: true, gen: function (r) {
    const A = r.int(30, 80), C = r.int(30, 80);
    if (A + C >= 150) return null;
    if (r.chance(0.6)) return { q: 'Find the value of ' + x + '.', dg: DG.exterior(A, C, A, C, 'x'), ans: ansNum(A + C), hint: 'The exterior angle of a triangle equals the sum of the two interior opposite angles.',
      steps: ['Exterior angle = sum of the two interior opposite angles', x + ' = ' + A + ' + ' + C + ' = ' + (A + C) + '°'] };
    return { q: 'Find the value of ' + x + '.', dg: DG.exterior(A, C, 'x', C, A + C), ans: ansNum(A), hint: 'The exterior angle equals the sum of the two interior opposite angles.',
      steps: [x + ' + ' + C + ' = ' + (A + C), x + ' = ' + (A + C) + ' ' + MINUS + ' ' + C + ' = ' + A + '°'] };
  } });

  def({ id: 'y8-ang-extalg', year: Y, topic: 'ang', tier: 3, quick: false, gen: function (r) {
    const k = r.int(20, 45), c = r.int(5, 30), A = k, C = k + c, E = A + C;
    if (E >= 150) return null;
    return { q: 'Find the value of ' + x + '.', dg: DG.exterior(A, C, 'x', 'x + ' + c, E), ans: ansNum(k), hint: 'Exterior angle = sum of the interior opposite angles. Form an equation.',
      steps: [x + ' + ' + x + ' + ' + c + ' = ' + E, '2' + x + ' = ' + (E - c), x + ' = ' + k] };
  } });

  def({ id: 'y8-ang-iso', year: Y, topic: 'ang', tier: 1, quick: true, gen: function (r) {
    if (r.chance(0.5)) { const apex = 2 * r.intNot(10, 60, [30]), base = (180 - apex) / 2;
      return { q: 'An isosceles triangle has an angle of ' + apex + '° between its two equal sides. What size is each of the other two angles?', ans: ansNum(base), hint: 'The two base angles are equal and all three add up to 180°.', steps: ['180 ' + MINUS + ' ' + apex + ' = ' + (180 - apex), (180 - apex) + ' ÷ 2 = ' + base + '°'] }; }
    const base = r.intNot(35, 80, [60]), apex = 180 - 2 * base;
    return { q: 'The two equal angles of an isosceles triangle are each ' + base + '°. What size is the third angle?', ans: ansNum(apex), hint: 'All three angles add up to 180°.', steps: ['180 ' + MINUS + ' ' + base + ' ' + MINUS + ' ' + base + ' = ' + apex + '°'] };
  } });

  /* ===== Unit 7 Fractions ===== */
  def({ id: 'y8-frac-rec', year: Y, topic: 'frac', tier: 2, quick: true, gen: function (r) {
    if (r.chance(0.5)) {
      const rec = r.pick([[5, 6], [2, 3], [4, 9], [7, 12], [3, 7], [5, 11], [1, 6], [2, 15]]), term = r.sample([[3, 8], [7, 20], [9, 25], [11, 40], [3, 5], [13, 50], [5, 16], [1, 4]], 3);
      return { q: 'Which of these fractions is equal to a recurring decimal?', ans: ansMC(F(rec[0], rec[1]), term.map(function (t) { return F(t[0], t[1]); }), r),
        hint: 'A fraction (in simplest form) gives a terminating decimal only if its denominator has no prime factors other than 2 and 5.',
        steps: ['The denominator ' + rec[1] + ' has a prime factor other than 2 or 5.', 'So ' + F(rec[0], rec[1]) + ' is a recurring decimal.'] };
    }
    const it = r.pick([[1, 3, '0.' + M.rec('3')], [2, 3, '0.' + M.rec('6')], [1, 9, '0.' + M.rec('1')], [5, 9, '0.' + M.rec('5')], [1, 6, '0.1' + M.rec('6')], [5, 6, '0.8' + M.rec('3')]]);
    const wrong = { '1/3': ['0.3', '0.33', '3.3'], '2/3': ['0.6', '0.67', '0.23'], '1/9': ['0.9', '0.19', '0.1'], '5/9': ['0.59', '0.5', '0.95'], '1/6': ['0.16', '0.6', '0.1'], '5/6': ['0.56', '0.83', '0.8'] }[it[0] + '/' + it[1]];
    return { q: 'Which decimal is equal to ' + F(it[0], it[1]) + '?', ans: ansMC(it[2], wrong, r), hint: 'Divide ' + it[0] + ' by ' + it[1] + '. Does it stop?', steps: [it[0] + ' ÷ ' + it[1] + ' = ' + it[2] + ' (the dot shows the digit that repeats for ever)'] };
  } });

  def({ id: 'y8-frac-submix', year: Y, topic: 'frac', tier: 2, quick: false, gen: function (r) {
    const f1 = properFrac(r, [2, 3, 4, 5, 6, 8]), f2 = properFrac(r, [2, 3, 4, 5, 6, 8]), w1 = r.int(3, 6), w2 = r.int(1, w1 - 1);
    const A = fr(w1 * f1.d + f1.n, f1.d), B = fr(w2 * f2.d + f2.n, f2.d), res = M.fSub(A, B);
    if (res.n <= res.d || lcm(f1.d, f2.d) > 24) return null;
    const L = lcm(A.d, B.d);
    return { q: 'Work out ' + w1 + F(f1.n, f1.d) + ' ' + MINUS + ' ' + w2 + F(f2.n, f2.d) + '<br><small>Give your answer as a mixed number in its simplest form.</small>', ans: ansFrac(res.n, res.d, 'mixed'),
      hint: 'Change both to improper fractions with a common denominator.',
      steps: ['Improper fractions: ' + F(A.n, A.d) + ' ' + MINUS + ' ' + F(B.n, B.d), '= ' + F(A.n * L / A.d, L) + ' ' + MINUS + ' ' + F(B.n * L / B.d, L) + ' = ' + F(A.n * L / A.d - B.n * L / B.d, L), '= ' + mixed(res.n, res.d)] };
  } });

  def({ id: 'y8-frac-intmix', year: Y, topic: 'frac', tier: 2, quick: false, gen: function (r) {
    if (r.chance(0.5)) {
      const k = r.int(2, 6), w = r.int(1, 4), f = properFrac(r, [3, 4, 5, 6, 8]), res = fr(k * (w * f.d + f.n), f.d);
      return { q: 'Work out ' + k + ' × ' + w + F(f.n, f.d) + '<br><small>Give your answer as a mixed number in its simplest form.</small>', ans: ansFrac(res.n, res.d, 'mixed'), hint: 'Multiply the whole number part and the fraction part separately, then add.',
        steps: [k + ' × ' + w + ' = ' + k * w, k + ' × ' + F(f.n, f.d) + ' = ' + F(k * f.n, f.d) + (k * f.n >= f.d ? ' = ' + mixed(k * f.n, f.d) : ''), 'Total: ' + mixed(res.n, res.d)] };
    }
    const k = r.int(2, 12), f = properFrac(r, [2, 3, 4, 5, 6, 8]), res = fr(k * f.d, f.n);
    return { q: 'Work out ' + k + ' ÷ ' + F(f.n, f.d) + '<br><small>Give your answer in its simplest form.</small>', ans: ansFrac(res.n, res.d, 'simplest'), hint: 'Dividing by ' + F(f.n, f.d) + ' is the same as multiplying by ' + F(f.d, f.n) + '.',
      steps: [k + ' ÷ ' + F(f.n, f.d) + ' = ' + k + ' × ' + F(f.d, f.n) + ' = ' + F(k * f.d, f.n), (res.d === 1 ? '= ' + res.n : '= ' + mixed(res.n, res.d))] };
  } });

  def({ id: 'y8-frac-ops', year: Y, topic: 'frac', tier: 3, quick: false, gen: function (r) {
    const a = properFrac(r, [2, 3, 4, 5, 6]), b = properFrac(r, [2, 3, 4, 5]), c = properFrac(r, [2, 3, 4, 5, 6]);
    const prod = M.fMul(b, c), res = M.fAdd(a, prod);
    if (lcm(a.d, prod.d) > 40) return null;
    return { q: 'Work out ' + F(a.n, a.d) + ' + ' + F(b.n, b.d) + ' × ' + F(c.n, c.d) + '<br><small>Give your answer in its simplest form.</small>', ans: ansFrac(res.n, res.d, 'simplest'), hint: 'Multiplication comes before addition.',
      steps: ['Multiply first: ' + F(b.n, b.d) + ' × ' + F(c.n, c.d) + ' = ' + F(prod.n, prod.d), 'Then add: ' + F(a.n, a.d) + ' + ' + F(prod.n, prod.d) + ' = ' + (Math.abs(res.n) > res.d ? mixed(res.n, res.d) + ' (' + F(res.n, res.d) + ')' : F(res.n, res.d))] };
  } });

  def({ id: 'y8-frac-neg', year: Y, topic: 'frac', tier: 1, quick: true, gen: function (r) {
    const fam = r.pick([[2, 4, 8], [3, 6, 12], [2, 5, 10], [3, 4, 12]]), fs = []; let g = 0;
    while (fs.length < 3 && g++ < 100) { const f = properFrac(r, fam); if (!fs.some(function (h) { return h.n * f.d === f.n * h.d; })) fs.push(f); }
    if (fs.length < 3) return null;
    const pos = properFrac(r, fam);
    const vals = fs.map(function (f) { return { n: -f.n, d: f.d }; }).concat([pos]);
    const sorted = vals.slice().sort(function (a, b) { return a.n / a.d - b.n / b.d; });
    const html = function (f) { return F(f.n, f.d); };
    return { q: 'Which fraction is the smallest?', ans: ansMC(html(sorted[0]), sorted.slice(1).map(html), r), hint: 'The most negative number is the smallest.',
      steps: ['The smallest is the negative fraction with the biggest size: ' + html(sorted[0]) + '.', 'In order: ' + sorted.map(html).join(', ')] };
  } });

  /* ===== Unit 8 Shapes and symmetry ===== */
  def({ id: 'y8-shape-circ', year: Y, topic: 'shape', tier: 1, quick: true, gen: function (r) {
    const useD = r.chance(0.5), val = useD ? r.int(2, 20) : r.int(1, 10), d = useD ? val : 2 * val, C = M.clean(3.14 * d);
    return { q: 'Find the circumference of a circle with ' + (useD ? 'diameter ' : 'radius ') + val + ' cm. Use π = 3.14. Give your answer in cm.', dg: DG.circle(val + ' cm', useD), ans: ansNum(C),
      hint: 'Circumference = π × diameter' + (useD ? '' : ' (diameter = 2 × radius)') + '.', steps: [(useD ? '' : 'Diameter = 2 × ' + val + ' = ' + d + ' cm. '), 'C = 3.14 × ' + d + ' = ' + fmt(C) + ' cm'].filter(Boolean) };
  } });

  def({ id: 'y8-shape-circinv', year: Y, topic: 'shape', tier: 3, quick: false, gen: function (r) {
    const d = r.pick([4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 50]), C = M.clean(3.14 * d), askR = r.chance(0.5) && d % 2 === 0;
    return { q: 'The circumference of a circle is ' + fmt(C) + ' cm. Find its ' + (askR ? 'radius' : 'diameter') + ', in cm. Use π = 3.14.', ans: ansNum(askR ? d / 2 : d), hint: 'Diameter = circumference ÷ π.',
      steps: ['Diameter = ' + fmt(C) + ' ÷ 3.14 = ' + d + ' cm', askR ? 'Radius = ' + d + ' ÷ 2 = ' + d / 2 + ' cm' : ''].filter(Boolean) };
  } });

  def({ id: 'y8-shape-quad', year: Y, topic: 'shape', tier: 1, quick: true, gen: function (r) {
    const T = ['A square is a special type of rectangle.', 'A square is a special type of rhombus.', 'A rectangle is a special type of parallelogram.', 'A rhombus is a special type of parallelogram.'];
    const Fs = ['A rectangle is a special type of square.', 'A trapezium is a special type of parallelogram.', 'A kite is a special type of rhombus.', 'A parallelogram is a special type of rectangle.', 'A rhombus is a special type of square.'];
    const c = r.pick(T);
    return { q: 'Which statement is always true?', ans: ansMC(c, r.sample(Fs, 3), r), hint: 'Think about the properties each shape must have.', steps: [c, 'The other statements are not always true.'] };
  } });

  def({ id: 'y8-shape-euler', year: Y, topic: 'shape', tier: 2, quick: true, gen: function (r) {
    const solids = [[6, 8, 12], [4, 4, 6], [8, 6, 12], [7, 10, 15], [7, 7, 12], [12, 20, 30], [20, 12, 30], [8, 12, 18], [6, 6, 10], [5, 6, 9], [9, 14, 21]];
    const s = r.pick(solids), ask = r.int(0, 2), names = ['faces', 'vertices', 'edges'];
    const given = [0, 1, 2].filter(function (i) { return i !== ask; });
    return { q: 'A 3D shape has ' + s[given[0]] + ' ' + names[given[0]] + ' and ' + s[given[1]] + ' ' + names[given[1]] + '. Use Euler’s formula to find the number of ' + names[ask] + '.', ans: ansNum(s[ask]),
      hint: 'Euler’s formula: F + V − E = 2', steps: ['F + V ' + MINUS + ' E = 2', 'F = ' + s[0] + ', V = ' + s[1] + ', E = ' + s[2] + ' (check: ' + s[0] + ' + ' + s[1] + ' ' + MINUS + ' ' + s[2] + ' = 2)'] };
  } });

  def({ id: 'y8-shape-planes', year: Y, topic: 'shape', tier: 2, quick: true, gen: function (r) {
    const s = r.pick([['a cube', 9], ['a cuboid whose length, width and height are all different', 3], ['a square-based pyramid (with its top directly above the centre of the base)', 4], ['a triangular prism with equilateral triangle ends', 4], ['a cuboid with two square faces (not a cube)', 5]]);
    return { q: 'How many planes of symmetry does ' + s[0] + ' have?', ans: ansNum(s[1]), hint: 'A plane of symmetry cuts a solid into two halves that are mirror images.', steps: [s[0].charAt(0).toUpperCase() + s[0].slice(1) + ' has ' + s[1] + ' planes of symmetry.'] };
  } });

  /* ===== Unit 9 Sequences and functions ===== */
  def({ id: 'y8-seq-next', year: Y, topic: 'seq', tier: 1, quick: true, gen: function (r) {
    const d = r.pick([0.25, 0.5, 0.75, 1.5, -0.5, -0.25, 0.2, 0.3, 1.25]), a = M.clean(r.int(2, 40) / 4), t = [0, 1, 2, 3, 4].map(function (i) { return M.clean(a + i * d); });
    return { q: 'What is the next term in this sequence?<br><b>' + t.slice(0, 4).map(fmt).join(', ') + ', …</b>', ans: ansNum(t[4]), hint: 'Find the difference between terms.',
      steps: ['The term-to-term rule is ' + (d > 0 ? 'add ' + fmt(d) : 'subtract ' + fmt(-d)) + '.', fmt(t[3]) + (d > 0 ? ' + ' + fmt(d) : ' ' + MINUS + ' ' + fmt(-d)) + ' = ' + fmt(t[4])] };
  } });

  def({ id: 'y8-seq-findnth', year: Y, topic: 'seq', tier: 2, quick: false, gen: function (r) {
    const a = r.nonZero(-6, 9), b = r.nonZero(-10, 12);
    if (a === 1 || a === -1) return null;
    const t = [1, 2, 3, 4].map(function (k) { return a * k + b; }), correct = nthExpr(a, b);
    return { q: 'Which is the <i>n</i>th term of this sequence?<br><b>' + t.map(fmt).join(', ') + ', …</b>', ans: ansMC(correct, [nthExpr(a, a + b), lin([[1, n], [a, '']]), nthExpr(a, -b), nthExpr(a + b, a)], r),
      hint: 'The difference between terms tells you the number in front of ' + n + '.', steps: ['The terms go ' + (a > 0 ? 'up' : 'down') + ' by ' + Math.abs(a) + ' each time, so start with ' + lin([[a, n]]) + '.', 'When ' + n + ' = 1, ' + lin([[a, n]]) + ' = ' + fmt(a) + '. The first term is ' + fmt(t[0]) + ', so ' + (b > 0 ? 'add ' + b : 'subtract ' + (-b)) + '.', 'Answer: ' + correct] };
  } });

  def({ id: 'y8-seq-term', year: Y, topic: 'seq', tier: 1, quick: true, gen: function (r) {
    const a = r.nonZero(-5, 9), b = r.nonZero(-12, 12), k = r.int(6, 40);
    return { q: 'The <i>n</i>th term of a sequence is ' + nthExpr(a, b) + '. What is the ' + ord(k) + ' term?', ans: ansNum(a * k + b), hint: 'Substitute ' + n + ' = ' + k + '.',
      steps: [(a < 0 ? fmt(b) + ' ' + MINUS + ' ' + (a === -1 ? k : (-a) + ' × ' + k) : (a === 1 ? k : a + ' × ' + k) + op(b)) + ' = ' + fmt(a * k + b)] };
  } });

  def({ id: 'y8-seq-which', year: Y, topic: 'seq', tier: 3, quick: false, gen: function (r) {
    const a = r.int(2, 9), b = r.nonZero(-10, 12), k = r.int(8, 40), V = a * k + b;
    return { q: 'The <i>n</i>th term of a sequence is ' + nthExpr(a, b) + '. Which term of the sequence is equal to ' + V + '?', ans: ansNum(k), hint: 'Solve ' + nthExpr(a, b) + ' = ' + V + '.',
      steps: [nthExpr(a, b) + ' = ' + V, a + n + ' = ' + (V - b), n + ' = ' + k, 'It is the ' + ord(k) + ' term.'] };
  } });

  def({ id: 'y8-seq-fn', year: Y, topic: 'seq', tier: 2, quick: false, gen: function (r) {
    const a = r.int(2, 5), b = r.nonZero(-6, 9), inp = a * r.int(-3, 8), out = inp / a + b;
    if (r.chance(0.5)) return { q: 'What is the output of this function machine?', dg: M.machine(fmt(inp), ['÷ ' + a, b > 0 ? '+ ' + b : MINUS + ' ' + (-b)], '?'), ans: ansNum(out), hint: 'Divide, then ' + (b > 0 ? 'add' : 'subtract') + '.', steps: [fmt(inp) + ' ÷ ' + a + ' = ' + fmt(inp / a), fmt(inp / a) + op(b) + ' = ' + fmt(out)] };
    return { q: 'What is the input of this function machine?', dg: M.machine('?', ['÷ ' + a, b > 0 ? '+ ' + b : MINUS + ' ' + (-b)], fmt(out)), ans: ansNum(inp), hint: 'Work backwards with inverse operations.', steps: ['Undo ' + (b > 0 ? '+ ' + b : MINUS + ' ' + (-b)) + ': ' + fmt(out) + (b > 0 ? ' ' + MINUS + ' ' + b : ' + ' + (-b)) + ' = ' + fmt(inp / a), 'Undo ÷ ' + a + ': ' + fmt(inp / a) + ' × ' + a + ' = ' + fmt(inp)] };
  } });

  /* ===== Unit 10 Percentages ===== */
  def({ id: 'y8-pct-incdec', year: Y, topic: 'pct', tier: 1, quick: true, gen: function (r) {
    const p = r.pick([5, 10, 15, 20, 25, 30, 40, 12, 8]), amt = 20 * r.int(1, 25), inc = r.chance(0.5), ch = M.clean(amt * p / 100), res = M.clean(inc ? amt + ch : amt - ch);
    return { q: (inc ? 'Increase ' : 'Decrease ') + amt + ' by ' + p + '%.', ans: ansNum(res), hint: 'Find ' + p + '% of ' + amt + ', then ' + (inc ? 'add it on' : 'take it away') + '.',
      steps: [p + '% of ' + amt + ' = ' + fmt(ch), amt + (inc ? ' + ' : ' ' + MINUS + ' ') + fmt(ch) + ' = ' + fmt(res)] };
  } });

  def({ id: 'y8-pct-mult', year: Y, topic: 'pct', tier: 2, quick: true, gen: function (r) {
    const p = r.pick([3, 4, 6, 7, 8, 12, 15, 18, 22, 35, 45]), inc = r.chance(0.5), m = M.clean(inc ? 1 + p / 100 : 1 - p / 100);
    return { q: 'Which multiplier would you use to ' + (inc ? 'increase' : 'decrease') + ' an amount by ' + p + '%?', ans: ansMC(fmt(m), [fmt(M.clean(p / 100)), fmt(M.clean(inc ? 1 - p / 100 : 1 + p / 100)), fmt(M.clean(inc ? 1 + p / 10 : (100 - p) / 10))], r),
      hint: 'Start with 100% = 1, then ' + (inc ? 'add' : 'subtract') + ' ' + p + '%.', steps: ['100% ' + (inc ? '+' : MINUS) + ' ' + p + '% = ' + (inc ? 100 + p : 100 - p) + '%', (inc ? 100 + p : 100 - p) + '% = ' + fmt(m)] };
  } });

  def({ id: 'y8-pct-change', year: Y, topic: 'pct', tier: 2, quick: false, gen: function (r) {
    const old = r.pick([20, 40, 50, 80, 120, 160, 200, 250, 400]), p = 5 * r.int(1, 12), inc = r.chance(0.5), nw = M.clean(old * (inc ? 1 + p / 100 : 1 - p / 100));
    if (nw !== Math.round(nw) || nw <= 0) return null;
    const it = old <= 80 ? r.pick([['The price of a T-shirt', 'RM'], ['The number of students in a club', '']]) : r.pick([['The price of a bicycle', 'RM'], ['The number of visitors to a museum in a day', ''], ['The price of a school trip', 'RM']]);
    return { q: it[0] + ' changed from ' + it[1] + old + ' to ' + it[1] + nw + '. What is the percentage ' + (inc ? 'increase' : 'decrease') + '?', ans: ansNum(p), hint: 'Percentage change = change ÷ original × 100.',
      steps: ['Change = ' + it[1] + Math.abs(nw - old), Math.abs(nw - old) + ' ÷ ' + old + ' × 100 = ' + p + '%'] };
  } });

  def({ id: 'y8-pct-sale', year: Y, topic: 'pct', tier: 3, quick: false, gen: function (r) {
    const p = r.pick([15, 35, 45, 12, 18, 65]), price = r.pick([24, 36, 48, 60, 84, 120, 150, 240]), res = M.clean(price * (1 - p / 100));
    const item = r.pick(['a jacket', 'a pair of trainers', 'a school bag', 'a badminton racket']);
    return { q: 'In a sale, all prices are reduced by ' + p + '%. ' + item.charAt(0).toUpperCase() + item.slice(1) + ' normally costs RM' + price + '. What is the sale price, in RM?', ans: ansNum(res, { show: money(res) }), hint: 'Use a multiplier: 100% − ' + p + '% = ' + (100 - p) + '%.',
      steps: ['Multiplier = ' + fmt(M.clean(1 - p / 100)), price + ' × ' + fmt(M.clean(1 - p / 100)) + ' = ' + money(res)] };
  } });

  /* ===== Unit 11 Graphs ===== */
  def({ id: 'y8-graph-mc', year: Y, topic: 'graph', tier: 1, quick: true, gen: function (r) {
    const m = r.nonZero(-6, 8), c = r.nonZero(-9, 9), askM = r.chance(0.5), altForm = m < 0 && r.chance(0.5);
    const eq = y + ' = ' + (altForm ? lin([[c, ''], [m, x]]) : lin([[m, x], [c, '']]));
    return { q: 'What is the ' + (askM ? 'gradient' : '<i>y</i>-intercept') + ' of the line ' + eq + '?', ans: ansNum(askM ? m : c), hint: 'In ' + y + ' = ' + v('m') + x + ' + ' + v('c') + ', ' + v('m') + ' is the gradient and ' + v('c') + ' is the ' + y + '-intercept.',
      steps: ['Compare with ' + y + ' = ' + v('m') + x + ' + ' + v('c') + ': ' + v('m') + ' = ' + fmt(m) + ', ' + v('c') + ' = ' + fmt(c) + '.', 'Answer: ' + fmt(askM ? m : c)] };
  } });

  def({ id: 'y8-graph-parallel', year: Y, topic: 'graph', tier: 2, quick: true, gen: function (r) {
    const m = r.nonZero(-5, 6), c = r.nonZero(-8, 8), c2 = r.intNot(-9, 9, [c, 0]);
    const eq = function (mm, cc) { return y + ' = ' + lin([[mm, x], [cc, '']]); };
    return { q: 'Which line is parallel to ' + eq(m, c) + '?', ans: ansMC(eq(m, c2), [eq(c, m) === eq(m, c2) ? eq(m + 1, c) : eq(c, m), eq(-m, c), eq(m + 1, c2)], r),
      hint: 'Parallel lines have the same gradient.', steps: ['Parallel lines have the same gradient: ' + fmt(m) + '.', 'Only ' + eq(m, c2) + ' has gradient ' + fmt(m) + '.'] };
  } });

  def({ id: 'y8-graph-implicit', year: Y, topic: 'graph', tier: 2, quick: false, gen: function (r) {
    const a = r.int(1, 5), b = r.int(1, 5), xi = r.nonZero(-4, 6), yi = r.nonZero(-4, 6), c = a * xi * b * (r.chance(0.5) ? 1 : 1);
    const C = a * b * r.int(1, 4);
    const eq = lin([[a, x], [b, y]]) + ' = ' + C;
    if (r.chance(0.5)) return { q: 'The line ' + eq + ' crosses the ' + x + '-axis at (' + x + ', 0). Find the value of ' + x + '.', ans: ansNum(C / a), hint: 'On the ' + x + '-axis, ' + y + ' = 0.', steps: ['Put ' + y + ' = 0: ' + lin([[a, x]]) + ' = ' + C, x + ' = ' + C / a] };
    return { q: 'The line ' + eq + ' crosses the ' + y + '-axis at (0, ' + y + '). Find the value of ' + y + '.', ans: ansNum(C / b), hint: 'On the ' + y + '-axis, ' + x + ' = 0.', steps: ['Put ' + x + ' = 0: ' + lin([[b, y]]) + ' = ' + C, y + ' = ' + C / b] };
  } });

  def({ id: 'y8-graph-grad2', year: Y, topic: 'graph', tier: 3, quick: false, gen: function (r) {
    const m = r.nonZero(-4, 5), x1 = r.int(-4, 4), y1 = r.int(-5, 5), d = r.int(1, 4), x2 = x1 + d, y2 = y1 + m * d;
    return { q: 'A straight line passes through ' + coord(x1, y1) + ' and ' + coord(x2, y2) + '. What is its gradient?', ans: ansNum(m), hint: 'Gradient = change in ' + y + ' ÷ change in ' + x + '.',
      steps: ['Change in ' + y + ' = ' + fmt(y2) + ' ' + MINUS + ' ' + paren(y1) + ' = ' + fmt(y2 - y1), 'Change in ' + x + ' = ' + fmt(x2) + ' ' + MINUS + ' ' + paren(x1) + ' = ' + d, 'Gradient = ' + fmt(y2 - y1) + ' ÷ ' + d + ' = ' + fmt(m)] };
  } });

  def({ id: 'y8-graph-eq', year: Y, topic: 'graph', tier: 2, quick: true, gen: function (r) {
    const m = r.nonZero(-5, 6), c = r.nonZero(-8, 8);
    if (m === c) return null;
    const eq = function (mm, cc) { return y + ' = ' + lin([[mm, x], [cc, '']]); };
    return { q: 'Which is the equation of the line with gradient ' + fmt(m) + ' and ' + y + '-intercept ' + fmt(c) + '?', ans: ansMC(eq(m, c), [eq(c, m), eq(m, -c), eq(-m, c)], r),
      hint: 'Use ' + y + ' = ' + v('m') + x + ' + ' + v('c') + '.', steps: [v('m') + ' = ' + fmt(m) + ' and ' + v('c') + ' = ' + fmt(c), 'So ' + eq(m, c)] };
  } });

  /* ===== Unit 12 Ratio and proportion ===== */
  def({ id: 'y8-ratio-units', year: Y, topic: 'ratio', tier: 1, quick: true, gen: function (r) {
    const t = r.pick([['cm', 'm', 100], ['g', 'kg', 1000], ['minutes', 'hours', 60], ['mm', 'cm', 10], ['ml', 'litres', 1000]]);
    let p, q, g = 0; do { p = r.int(1, 9); q = r.int(1, 9); } while ((p === q || gcd(p, q) !== 1) && g++ < 50);
    const bigUnits = r.int(1, 5), small = bigUnits * t[2] * p / q;
    if (small !== Math.round(small) || small >= bigUnits * t[2] * 3) return null;
    const A = small, B = bigUnits, k = gcd(A, B * t[2]);
    const correct = (A / k) + ' : ' + (B * t[2] / k);
    return { q: 'Write ' + fmt(A) + ' ' + t[0] + ' : ' + B + ' ' + t[1] + ' in its simplest form.', ans: ansMC(correct, [(B * t[2] / k) + ' : ' + (A / k), fmt(A / gcd(A, B)) + ' : ' + (B / gcd(A, B)), (A / k * 10) + ' : ' + (B * t[2] / k)], r),
      hint: 'Change both quantities to the same units first.', steps: [B + ' ' + t[1] + ' = ' + fmt(B * t[2]) + ' ' + t[0], fmt(A) + ' : ' + fmt(B * t[2]) + ' = ' + correct] };
  } });

  def({ id: 'y8-ratio-three', year: Y, topic: 'ratio', tier: 2, quick: false, gen: function (r) {
    const p = [r.int(1, 6), r.int(1, 6), r.int(1, 6)];
    if (p[0] === p[1] && p[1] === p[2]) return null;
    const unit = r.int(3, 20), tot = (p[0] + p[1] + p[2]) * unit, nm = r.sample(NAMES, 3), i = r.int(0, 2);
    return { q: nm[0] + ', ' + nm[1] + ' and ' + nm[2] + ' share RM' + tot + ' in the ratio ' + p.join(' : ') + '. How much, in RM, does ' + nm[i] + ' get?', ans: ansNum(p[i] * unit), hint: 'Add the parts to find the total number of parts.',
      steps: ['Total parts: ' + p.join(' + ') + ' = ' + (p[0] + p[1] + p[2]), 'One part: ' + tot + ' ÷ ' + (p[0] + p[1] + p[2]) + ' = ' + unit, nm[i] + ': ' + p[i] + ' × ' + unit + ' = RM' + p[i] * unit] };
  } });

  def({ id: 'y8-ratio-best', year: Y, topic: 'ratio', tier: 2, quick: false, gen: function (r) {
    const item = r.pick([['rice', 'kg', 'kg', [1, 2, 5, 10], 'bag'], ['cooking oil', 'litres', 'litre', [1, 2, 3, 5], 'bottle'], ['washing powder', 'kg', 'kg', [1, 2, 3, 4], 'box']]);
    const s = r.sample(item[3], 2), pu = [M.clean(r.int(20, 60) / 10), 0];
    pu[1] = M.clean(pu[0] + r.pick([-1, 1]) * r.int(1, 5) / 10);
    const price = [M.clean(s[0] * pu[0]), M.clean(s[1] * pu[1])];
    const best = pu[0] < pu[1] ? 0 : 1;
    const opt = function (i) { return 'The ' + s[i] + '-' + item[2] + ' ' + item[4] + ' for ' + money(price[i]); };
    return { q: 'A shop sells ' + item[0] + ' in two sizes: ' + s[0] + ' ' + (s[0] === 1 ? item[2] : item[1]) + ' for ' + money(price[0]) + ' and ' + s[1] + ' ' + (s[1] === 1 ? item[2] : item[1]) + ' for ' + money(price[1]) + '. Which is better value?', ans: ansMC(opt(best), [opt(1 - best), 'They are exactly the same value'], r),
      hint: 'Find the price for 1 ' + item[2] + ' of each.', steps: [money(price[0]) + ' ÷ ' + s[0] + ' = ' + money(pu[0]) + ' per ' + item[2], money(price[1]) + ' ÷ ' + s[1] + ' = ' + money(pu[1]) + ' per ' + item[2], 'The cheaper price per ' + item[2] + ' is better value.'] };
  } });

  def({ id: 'y8-ratio-diff', year: Y, topic: 'ratio', tier: 3, quick: false, gen: function (r) {
    let p, q, g = 0; do { p = r.int(1, 8); q = r.int(2, 9); } while ((p >= q || gcd(p, q) !== 1) && g++ < 50);
    if (p >= q) return null;
    const k = r.int(2, 12);
    return { q: 'A bag has red and blue beads in the ratio ' + p + ' : ' + q + '. There are ' + (q - p) * k + ' more blue beads than red beads. How many red beads are there?', ans: ansNum(p * k), hint: 'The difference in parts is ' + q + ' − ' + p + ' = ' + (q - p) + '.',
      steps: ['Difference: ' + q + ' ' + MINUS + ' ' + p + ' = ' + (q - p) + ' part' + (q - p === 1 ? '' : 's') + ' = ' + (q - p) * k + ' beads', '1 part = ' + k, 'Red = ' + p + ' × ' + k + ' = ' + p * k] };
  } });

  /* ===== Unit 13 Probability ===== */
  def({ id: 'y8-prob-comp', year: Y, topic: 'prob', tier: 1, quick: true, gen: function (r) {
    const p = M.clean(r.int(1, 99) / 100), ev = r.pick(['it will rain tomorrow', 'a train is late', 'a team wins its next match', 'a light bulb is faulty']);
    return { q: 'The probability that ' + ev + ' is ' + fmt(p) + '. What is the probability that ' + ev.replace('it will rain', 'it will not rain').replace('a train is late', 'a train is not late').replace('a team wins', 'the team does not win').replace('a light bulb is faulty', 'a light bulb is not faulty') + '?',
      ans: ansNum(M.clean(1 - p)), hint: 'P(not A) = 1 − P(A).', steps: ['1 ' + MINUS + ' ' + fmt(p) + ' = ' + fmt(M.clean(1 - p))] };
  } });

  def({ id: 'y8-prob-table', year: Y, topic: 'prob', tier: 2, quick: true, gen: function (r) {
    const cols = ['Red', 'Blue', 'Green', 'Yellow'], ps = [r.int(5, 35), r.int(5, 35), r.int(5, 30)];
    const last = 100 - ps[0] - ps[1] - ps[2];
    if (last < 5) return null;
    ps.push(last);
    const miss = r.int(0, 3);
    const rows = ps.map(function (p, i) { return [cols[i], i === miss ? '<i>p</i>' : fmt(M.clean(p / 100))]; });
    return { q: 'A biased spinner lands on one of four colours. The table shows the probabilities. Find the value of ' + v('p') + '.', dg: M.table(['Colour', 'Probability'], rows), ans: ansNum(M.clean(ps[miss] / 100)),
      hint: 'The probabilities of all the outcomes add up to 1.', steps: ['Known probabilities add to ' + fmt(M.clean(1 - ps[miss] / 100)), v('p') + ' = 1 ' + MINUS + ' ' + fmt(M.clean(1 - ps[miss] / 100)) + ' = ' + fmt(M.clean(ps[miss] / 100))] };
  } });

  def({ id: 'y8-prob-two', year: Y, topic: 'prob', tier: 2, quick: false, gen: function (r) {
    if (r.chance(0.4)) {
      const t = r.pick([['two heads', 1, 'HH'], ['exactly one head', 2, 'HT, TH'], ['at least one head', 3, 'HH, HT, TH'], ['two tails', 1, 'TT']]);
      return { q: 'Two fair coins are flipped. What is the probability of getting ' + t[0] + '?', ans: ansFrac(t[1], 4, 'any', { allowDecimal: true, show: F(t[1], 4) + (fr(t[1], 4).d !== 4 ? ' = ' + F(fr(t[1], 4).n, fr(t[1], 4).d) : '') }),
        hint: 'List all the outcomes: HH, HT, TH, TT.', steps: ['Outcomes: HH, HT, TH, TT (4 equally likely)', 'Successful: ' + t[2] + ' (' + t[1] + ')', 'Probability = ' + F(t[1], 4)] };
    }
    const s = r.int(3, 11), cnt = 6 - Math.abs(7 - s), f = fr(cnt, 36);
    return { q: 'Two fair six-sided dice are rolled and the scores are added. What is the probability that the total is ' + s + '?', ans: ansFrac(cnt, 36, 'any', { show: F(cnt, 36) + (f.d !== 36 ? ' = ' + F(f.n, f.d) : '') }),
      hint: 'Draw a 6 × 6 sample-space table of totals: there are 36 outcomes.', steps: ['There are 36 equally likely outcomes.', 'Totals of ' + s + ': ' + cnt + ' ways', 'Probability = ' + F(cnt, 36) + (f.d !== 36 ? ' = ' + F(f.n, f.d) : '')] };
  } });

  def({ id: 'y8-prob-twospin', year: Y, topic: 'prob', tier: 3, quick: false, gen: function (r) {
    const a = r.int(3, 5), b = r.int(2, 4), kind = r.pick(['even', 'odd', 'greater']);
    let cnt = 0; const T = a + b > 6 ? r.int(4, a + b - 1) : 4;
    for (let i = 1; i <= a; i++) for (let j = 1; j <= b; j++) { const s = i + j; if ((kind === 'even' && s % 2 === 0) || (kind === 'odd' && s % 2 === 1) || (kind === 'greater' && s > T)) cnt++; }
    if (cnt === 0) return null;
    const desc = kind === 'greater' ? 'greater than ' + T : kind;
    return { q: 'Spinner A is numbered 1 to ' + a + ' and spinner B is numbered 1 to ' + b + '. Both are fair. They are spun and the two numbers are added. What is the probability that the total is ' + desc + '?',
      ans: ansFrac(cnt, a * b, 'any', { allowDecimal: true, show: F(cnt, a * b) + (fr(cnt, a * b).d !== a * b ? ' = ' + F(fr(cnt, a * b).n, fr(cnt, a * b).d) : '') }),
      hint: 'Make a sample-space table with ' + a + ' × ' + b + ' = ' + a * b + ' outcomes.', steps: ['There are ' + a + ' × ' + b + ' = ' + a * b + ' equally likely outcomes.', cnt + ' of them give a total that is ' + desc + '.', 'Probability = ' + F(cnt, a * b)] };
  } });

  /* ===== Unit 14 Position and transformation ===== */
  def({ id: 'y8-trans-mid', year: Y, topic: 'trans', tier: 1, quick: true, gen: function (r) {
    const mx = r.int(-5, 6), my = r.int(-5, 6), dx = r.nonZero(-6, 6), dy = r.nonZero(-6, 6);
    const A = [mx - dx, my - dy], B = [mx + dx, my + dy];
    return { q: 'Find the midpoint of the line segment joining ' + coord(A[0], A[1]) + ' and ' + coord(B[0], B[1]) + '.', ans: ansMC(coord(mx, my), [coord(B[0] - A[0], B[1] - A[1]), coord(mx, -my), coord(A[0] + B[0], A[1] + B[1]), coord(my, mx), coord(mx + 1, my - 1)], r),
      hint: 'Add the ' + x + '-coordinates and halve; do the same for the ' + y + '-coordinates.', steps: [x + ': (' + fmt(A[0]) + ' + ' + paren(B[0]) + ') ÷ 2 = ' + fmt(mx), y + ': (' + fmt(A[1]) + ' + ' + paren(B[1]) + ') ÷ 2 = ' + fmt(my), 'Midpoint: ' + coord(mx, my)] };
  } });

  def({ id: 'y8-trans-bearing', year: Y, topic: 'trans', tier: 2, quick: true, gen: function (r) {
    if (r.chance(0.35)) { const d = r.pick([['east', 90], ['south', 180], ['west', 270], ['north-east', 45], ['south-east', 135], ['south-west', 225], ['north-west', 315]]);
      return { q: 'What is the bearing of the direction ' + d[0] + '? Give your answer in degrees.', ans: ansNum(d[1], { show: String(d[1]).padStart(3, '0') + '°' }), hint: 'Bearings are measured clockwise from north.', steps: ['Measure clockwise from north: ' + d[0] + ' is ' + String(d[1]).padStart(3, '0') + '°.'] }; }
    const b = r.int(10, 350);
    if (b === 180) return null;
    const back = b < 180 ? b + 180 : b - 180;
    return { q: 'The bearing of B from A is ' + String(b).padStart(3, '0') + '°. What is the bearing of A from B, in degrees?', ans: ansNum(back, { show: String(back).padStart(3, '0') + '°' }), hint: 'The back bearing differs by 180°.',
      steps: [b < 180 ? String(b).padStart(3, '0') + ' + 180 = ' + back : b + ' ' + MINUS + ' 180 = ' + back, 'Bearing: ' + String(back).padStart(3, '0') + '°'] };
  } });

  def({ id: 'y8-trans-vector', year: Y, topic: 'trans', tier: 2, quick: true, gen: function (r) {
    const a = r.int(-6, 6), b = r.int(-6, 6), h = r.nonZero(-6, 6), k = r.nonZero(-6, 6);
    if (h === k) return null;
    return { q: 'The point ' + coord(a, b) + ' is translated by the vector ' + vec(h, k) + '. What are the coordinates of its image?', ans: ansMC(coord(a + h, b + k), [coord(a - h, b - k), coord(a + k, b + h), coord(a + h, b - k)], r),
      hint: 'The top number moves ' + x + ' (right/left); the bottom number moves ' + y + ' (up/down).', steps: [fmt(a) + op(h) + ' = ' + fmt(a + h), fmt(b) + op(k) + ' = ' + fmt(b + k), 'Image: ' + coord(a + h, b + k)] };
  } });

  def({ id: 'y8-trans-reflect', year: Y, topic: 'trans', tier: 2, quick: false, gen: function (r) {
    let a = r.nonZero(-6, 6), b = r.nonZero(-6, 6); if (Math.abs(a) === Math.abs(b)) b = b > 0 ? b + 1 : b - 1;
    const t = r.int(0, 3), c = r.nonZero(-3, 3);
    const lines = [y + ' = ' + x, y + ' = ' + MINUS + x, x + ' = ' + fmt(c), y + ' = ' + fmt(c)];
    const imgs = [[b, a], [-b, -a], [2 * c - a, b], [a, 2 * c - b]];
    const im = imgs[t], correct = coord(im[0], im[1]);
    const ds = imgs.filter(function (p, i) { return i !== t; }).map(function (p) { return coord(p[0], p[1]); }).concat([coord(-a, b), coord(a, -b)]);
    const why = ['Reflecting in ' + y + ' = ' + x + ' swaps the coordinates.', 'Reflecting in ' + y + ' = ' + MINUS + x + ' swaps the coordinates and changes both signs.', 'The ' + x + '-distance to the line ' + x + ' = ' + fmt(c) + ' is ' + fmt(Math.abs(a - c)) + ', so the image is the same distance on the other side.', 'The ' + y + '-distance to the line ' + y + ' = ' + fmt(c) + ' is ' + fmt(Math.abs(b - c)) + ', so the image is the same distance on the other side.'][t];
    return { q: 'The point ' + coord(a, b) + ' is reflected in the line ' + lines[t] + '. What are the coordinates of its image?', ans: ansMC(correct, ds, r), hint: 'Sketch the point and the mirror line on a grid.', steps: [why, 'Image: ' + correct] };
  } });

  def({ id: 'y8-trans-area', year: Y, topic: 'trans', tier: 3, quick: true, gen: function (r) {
    const k = r.int(2, 5), l = r.int(2, 9), w = r.int(1, 8);
    if (r.chance(0.5)) return { q: 'A rectangle measuring ' + l + ' cm by ' + w + ' cm is enlarged by scale factor ' + k + '. What is the area of the enlarged rectangle, in cm²?', ans: ansNum(l * w * k * k), hint: 'Every length is multiplied by ' + k + ', so the area is multiplied by ' + k + '² = ' + k * k + '.',
      steps: ['New sides: ' + l * k + ' cm and ' + w * k + ' cm', 'Area = ' + l * k + ' × ' + w * k + ' = ' + l * w * k * k + ' cm² (' + k * k + ' times the original ' + l * w + ' cm²)'] };
    return { q: 'A rectangle has a perimeter of ' + 2 * (l + w) + ' cm. It is enlarged by scale factor ' + k + '. What is the perimeter of the enlarged rectangle, in cm?', ans: ansNum(2 * (l + w) * k), hint: 'Perimeter is a length, so it is multiplied by the scale factor.',
      steps: [2 * (l + w) + ' × ' + k + ' = ' + 2 * (l + w) * k + ' cm'] };
  } });

  /* ===== Unit 15 Shapes, area and volume ===== */
  def({ id: 'y8-area-miles', year: Y, topic: 'area', tier: 1, quick: true, gen: function (r) {
    if (r.chance(0.5)) { const mi = 5 * r.int(1, 30); return { q: 'Use 5 miles ≈ 8 km to convert ' + mi + ' miles to kilometres.', ans: ansNum(mi / 5 * 8), hint: 'How many lots of 5 miles are there?', steps: [mi + ' ÷ 5 = ' + mi / 5, mi / 5 + ' × 8 = ' + mi / 5 * 8 + ' km'] }; }
    const km = 8 * r.int(1, 30);
    return { q: 'Use 5 miles ≈ 8 km to convert ' + km + ' km to miles.', ans: ansNum(km / 8 * 5), hint: 'How many lots of 8 km are there?', steps: [km + ' ÷ 8 = ' + km / 8, km / 8 + ' × 5 = ' + km / 8 * 5 + ' miles'] };
  } });

  def({ id: 'y8-area-para', year: Y, topic: 'area', tier: 1, quick: true, gen: function (r) {
    const b = r.int(4, 18), h = r.int(3, 12);
    return { q: 'Find the area of the parallelogram, in cm².', dg: DG.para(b, h), ans: ansNum(b * h), hint: 'Area of a parallelogram = base × perpendicular height.', steps: ['Area = ' + b + ' × ' + h + ' = ' + b * h + ' cm²'] };
  } });

  def({ id: 'y8-area-trap', year: Y, topic: 'area', tier: 2, quick: false, gen: function (r) {
    const a = r.int(3, 10), b = a + r.int(2, 10), h = r.int(2, 12), A = M.clean((a + b) * h / 2);
    return { q: 'Find the area of the trapezium, in cm².', dg: DG.trap(a, b, h), ans: ansNum(A), hint: 'Area = ½ × (a + b) × h, where a and b are the parallel sides.', steps: ['Area = ½ × (' + a + ' + ' + b + ') × ' + h, '= ½ × ' + (a + b) + ' × ' + h + ' = ' + fmt(A) + ' cm²'] };
  } });

  def({ id: 'y8-area-prismvol', year: Y, topic: 'area', tier: 2, quick: false, gen: function (r) {
    const b = r.int(3, 12), h = r.int(2, 10), L = r.int(4, 20), cs = M.clean(b * h / 2), V = M.clean(cs * L);
    return { q: 'Find the volume of the triangular prism, in cm³.', dg: DG.prism(b, h, L), ans: ansNum(V), hint: 'Volume = area of the triangle × length.', steps: ['Triangle area = ½ × ' + b + ' × ' + h + ' = ' + fmt(cs) + ' cm²', 'Volume = ' + fmt(cs) + ' × ' + L + ' = ' + fmt(V) + ' cm³'] };
  } });

  def({ id: 'y8-area-prismsa', year: Y, topic: 'area', tier: 3, quick: false, gen: function (r) {
    const k = r.int(1, 3), a = 3 * k, b = 4 * k, c = 5 * k, L = r.int(5, 15), tri = a * b / 2, SA = 2 * tri + (a + b + c) * L;
    return { q: 'Find the total surface area of the triangular prism, in cm².', dg: DG.prism(b, a, L, c), ans: ansNum(SA), hint: 'Two triangles plus three rectangles.',
      steps: ['Two triangles: 2 × ½ × ' + b + ' × ' + a + ' = ' + 2 * tri + ' cm²', 'Rectangles: (' + a + ' + ' + b + ' + ' + c + ') × ' + L + ' = ' + (a + b + c) * L + ' cm²', 'Total = ' + 2 * tri + ' + ' + (a + b + c) * L + ' = ' + SA + ' cm²'] };
  } });

  /* ===== Unit 16 Interpreting and discussing results ===== */
  def({ id: 'y8-stats-avg', year: Y, topic: 'stats', tier: 1, quick: true, gen: function (r) {
    const d = M.dataset(r, r.int(5, 7), -9, 12), mx = Math.max.apply(null, d), mn = Math.min.apply(null, d);
    if (mx === mn) return null;
    return { q: 'These are the midnight temperatures (°C) in a town on ' + d.length + ' nights:<br><b>' + d.map(fmt).join(', ') + '</b><br>What is the range?', ans: ansNum(mx - mn), hint: 'Range = highest − lowest.', steps: ['Highest = ' + fmt(mx) + ', lowest = ' + fmt(mn), 'Range = ' + fmt(mx) + ' ' + MINUS + ' ' + paren(mn) + ' = ' + (mx - mn) + ' °C'] };
  } });

  def({ id: 'y8-stats-freqmean', year: Y, topic: 'stats', tier: 2, quick: false, gen: function (r) {
    const N = r.pick([10, 20, 25]), vals = [0, 1, 2, 3, 4], f = [0, 0, 0, 0, 0];
    for (let i = 0; i < N; i++) f[r.pick([0, 1, 1, 2, 2, 2, 3, 3, 4])]++;
    const sum = f.reduce(function (s, c, i) { return s + c * vals[i]; }, 0), mean = M.clean(sum / N);
    const what = r.pick([['Number of goals', 'matches'], ['Number of pets', 'students'], ['Number of books borrowed', 'students']]);
    return { q: 'The table shows ' + what[0].toLowerCase() + ' for ' + N + ' ' + what[1] + '. Calculate the mean.', dg: M.table([what[0], 'Frequency'], vals.map(function (t, i) { return [t, f[i]]; })), ans: ansNum(mean),
      hint: 'Multiply each value by its frequency, add them, then divide by the total frequency.', steps: ['Σ(value × frequency) = ' + vals.map(function (t, i) { return t + '×' + f[i]; }).join(' + ') + ' = ' + sum, 'Mean = ' + sum + ' ÷ ' + N + ' = ' + fmt(mean)] };
  } });

  def({ id: 'y8-stats-groupmean', year: Y, topic: 'stats', tier: 3, quick: false, gen: function (r) {
    const N = r.pick([10, 20, 25, 40, 50]), w = r.pick([10, 20]), k = r.int(3, 4);
    const wts = []; for (let i = 0; i < k; i++) wts.push(r.int(2, 10));
    const S = wts.reduce(function (a, b) { return a + b; }, 0), f = wts.map(function (t) { return Math.max(1, Math.floor(N * t / S)); });
    let diff = N - f.reduce(function (a, b) { return a + b; }, 0), gi = 0;
    while (diff !== 0 && gi++ < 100) { const j = r.int(0, k - 1); if (diff > 0) { f[j]++; diff--; } else if (f[j] > 1) { f[j]--; diff++; } }
    if (diff !== 0) return null;
    const mids = f.map(function (c, i) { return w * i + w / 2; }), tot = f.reduce(function (s, c, i) { return s + c * mids[i]; }, 0), mean = M.clean(tot / N);
    const unit = w === 10 ? 'Time, t (minutes)' : 'Mass, m (g)', vname = w === 10 ? '<i>t</i>' : '<i>m</i>';
    return { q: 'The table shows grouped data for ' + N + ' results. Calculate an estimate of the mean.', dg: M.table([unit, 'Frequency'], f.map(function (c, i) { return [w * i + ' ≤ ' + vname + ' &lt; ' + w * (i + 1), c]; })), ans: ansNum(mean),
      hint: 'Use the midpoint of each group.', steps: ['Midpoints: ' + mids.join(', '), 'Σ(midpoint × frequency) = ' + mids.map(function (m, i) { return m + '×' + f[i]; }).join(' + ') + ' = ' + tot, 'Estimated mean = ' + tot + ' ÷ ' + N + ' = ' + fmt(mean)] };
  } });

  def({ id: 'y8-stats-pieangle', year: Y, topic: 'stats', tier: 1, quick: false, gen: function (r) {
    const N = r.pick([20, 30, 36, 40, 45, 60, 72, 90, 120]), k = r.int(2, Math.round(N * 0.6)), ang = M.clean(k * 360 / N);
    const food = r.pick(['nasi lemak', 'roti canai', 'mee goreng', 'chicken rice']);
    return { q: 'In a survey of ' + N + ' students, ' + k + ' chose ' + food + ' as their favourite breakfast. What angle would represent ' + food + ' in a pie chart, in degrees?', ans: ansNum(ang), hint: 'Each student gets 360° ÷ ' + N + '.',
      steps: ['360 ÷ ' + N + ' = ' + fmt(M.clean(360 / N)) + '° per student', k + ' × ' + fmt(M.clean(360 / N)) + ' = ' + fmt(ang) + '°'] };
  } });

  def({ id: 'y8-stats-compare', year: Y, topic: 'stats', tier: 2, quick: false, gen: function (r) {
    const mA = r.int(50, 80), mB = mA + r.nonZero(-12, 12), rA = r.int(10, 40), rB = rA + r.pick([-1, 1]) * r.int(8, 20);
    if (rB < 5) return null;
    const better = mB > mA ? 'B' : 'A', worse = better === 'A' ? 'B' : 'A', spread = rB > rA ? 'B' : 'A', cons = spread === 'A' ? 'B' : 'A';
    const correct = 'Class ' + better + ' did better on average, and class ' + cons + '’s scores were more consistent.';
    return { q: 'Two classes took the same test. Class A: mean ' + mA + ', range ' + rA + '. Class B: mean ' + mB + ', range ' + rB + '. Which statement is correct?',
      ans: ansMC(correct, ['Class ' + worse + ' did better on average, and class ' + cons + '’s scores were more consistent.', 'Class ' + better + ' did better on average, and class ' + spread + '’s scores were more consistent.', 'Class ' + worse + ' did better on average, and class ' + spread + '’s scores were more consistent.'], r),
      hint: 'A higher mean means better on average. A smaller range means more consistent.', steps: ['Higher mean: class ' + better + ' (' + Math.max(mA, mB) + ')', 'Smaller range (more consistent): class ' + cons + ' (' + Math.min(rA, rB) + ')'] };
  } });

})(typeof module !== 'undefined' && module.exports ? require('./q-core.js') : window.MSD);

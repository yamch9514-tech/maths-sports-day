/* Maths Sports Day — Year 7 (J1T) questions, Cambridge Lower Secondary Stage 7 / Learner's Book 7.
   Tier 1 = Bronze (warm-up), 2 = Silver (core), 3 = Gold (challenge). quick = suitable for the 100 m Sprint. */
(function (M) {
  'use strict';
  const def = M.def, fmt = M.fmt, paren = M.paren, lin = M.lin, v = M.v, pow = M.pow, F = M.fracHTML, mixed = M.mixedHTML,
    ansNum = M.ansNum, ansFrac = M.ansFrac, ansMC = M.ansMC, DG = M.DG, gcd = M.gcd, lcm = M.lcm, fr = M.fr, coord = M.coord,
    MINUS = M.MINUS, NAMES = M.NAMES, NAMES_F = M.NAMES_F, NAMES_M = M.NAMES_M, money = M.money;
  const Y = 7;
  const x = v('x'), y = v('y'), n = v('n');
  function ord(k) { const s = ['th', 'st', 'nd', 'rd'], m = k % 100; return k + (s[(m - 20) % 10] || s[m] || s[0]); }
  function op(c) { return c < 0 ? ' ' + MINUS + ' ' + fmt(-c) : ' + ' + fmt(c); } // " + 5" / " − 5"

  M.topic(Y, 'int', 1, 'Integers', 'N');
  M.topic(Y, 'alg', 2, 'Expressions, formulae & equations', 'A');
  M.topic(Y, 'pv', 3, 'Place value & rounding', 'N');
  M.topic(Y, 'dec', 4, 'Decimals', 'N');
  M.topic(Y, 'ang', 5, 'Angles', 'G');
  M.topic(Y, 'data', 6, 'Collecting data', 'S');
  M.topic(Y, 'frac', 7, 'Fractions', 'N');
  M.topic(Y, 'shape', 8, 'Shapes & symmetry', 'G');
  M.topic(Y, 'seq', 9, 'Sequences & functions', 'A');
  M.topic(Y, 'pct', 10, 'Percentages', 'N');
  M.topic(Y, 'graph', 11, 'Graphs', 'A');
  M.topic(Y, 'ratio', 12, 'Ratio & proportion', 'N');
  M.topic(Y, 'prob', 13, 'Probability', 'S');
  M.topic(Y, 'trans', 14, 'Position & transformation', 'G');
  M.topic(Y, 'area', 15, 'Area & volume', 'G');
  M.topic(Y, 'stats', 16, 'Interpreting results', 'S');

  /* ===== Unit 1 Integers ===== */
  def({ id: 'y7-int-addsub', year: Y, topic: 'int', tier: 1, quick: true, gen: function (r) {
    let a = r.nonZero(-15, 15); const b = r.nonZero(-15, 15), sub = r.chance(0.5);
    if (a > 0 && b > 0) a = -a;
    const res = sub ? a - b : a + b;
    const steps = [];
    if (!sub && b > 0) steps.push('Start at ' + fmt(a) + ' on the number line and move ' + b + ' to the right.');
    if (sub && b > 0) steps.push('Start at ' + fmt(a) + ' on the number line and move ' + b + ' to the left.');
    if (sub && b < 0) steps.push('Subtracting a negative number is the same as adding: ' + fmt(a) + ' + ' + fmt(-b));
    else if (!sub && b < 0) steps.push('Adding a negative number is the same as subtracting: ' + fmt(a) + ' ' + MINUS + ' ' + fmt(-b));
    steps.push('= ' + fmt(res));
    return { q: 'Work out ' + fmt(a) + (sub ? ' ' + MINUS + ' ' : ' + ') + paren(b), ans: ansNum(res), hint: 'Picture a number line. Subtracting a negative means adding.', steps: steps };
  } });

  def({ id: 'y7-int-muldiv', year: Y, topic: 'int', tier: 1, quick: true, gen: function (r) {
    const p = r.int(2, 12), q = r.int(2, 12), negFirst = r.chance(0.5);
    let A, B, res, sym;
    if (r.chance(0.5)) { A = negFirst ? -p : p; B = negFirst ? q : -q; res = A * B; sym = ' × '; }
    else { A = negFirst ? -p * q : p * q; B = negFirst ? q : -q; res = A / B; sym = ' ÷ '; }
    return { q: 'Work out ' + fmt(A) + sym + paren(B), ans: ansNum(res), hint: 'Different signs give a negative answer.',
      steps: ['The signs are different, so the answer is negative.', fmt(Math.abs(A)) + sym + fmt(Math.abs(B)) + ' = ' + fmt(Math.abs(res)), 'Answer: ' + fmt(res)] };
  } });

  def({ id: 'y7-int-order', year: Y, topic: 'int', tier: 2, quick: false, gen: function (r) {
    const form = r.int(0, 3);
    if (form === 0) {
      const a = r.int(2, 20), b = r.int(2, 9), c = r.int(2, 9);
      return { q: 'Work out ' + a + ' + ' + b + ' × ' + c, ans: ansNum(a + b * c), hint: 'Multiply before you add.',
        steps: ['Multiply first: ' + b + ' × ' + c + ' = ' + b * c, a + ' + ' + b * c + ' = ' + (a + b * c)] };
    }
    if (form === 1) {
      const a = r.int(1, 9), b = r.int(a + 1, a + 9), c = r.int(2, 6), d = a - b;
      return { q: 'Work out (' + a + ' ' + MINUS + ' ' + b + ') × ' + c, ans: ansNum(d * c), hint: 'Work out the brackets first.',
        steps: ['Brackets first: ' + a + ' ' + MINUS + ' ' + b + ' = ' + fmt(d), fmt(d) + ' × ' + c + ' = ' + fmt(d * c)] };
    }
    if (form === 2) {
      const a = r.int(2, 30), b = r.int(2, 6), c = r.int(2, 5), res = a - c * b * b;
      return { q: 'Work out ' + a + ' ' + MINUS + ' ' + c + ' × ' + pow(b, 2), ans: ansNum(res), hint: 'Indices come before multiplication, then subtraction.',
        steps: ['Index first: ' + pow(b, 2) + ' = ' + b * b, 'Then multiply: ' + c + ' × ' + b * b + ' = ' + c * b * b, a + ' ' + MINUS + ' ' + c * b * b + ' = ' + fmt(res)] };
    }
    const a = r.int(1, 6), b = r.int(1, 6), s = a + b, sq = s * s;
    const divs = []; for (let k = 2; k <= 12; k++) if (sq % k === 0 && k !== sq) divs.push(k);
    const c = r.pick(divs);
    return { q: 'Work out (' + a + ' + ' + b + ')' + '<sup>2</sup> ÷ ' + c, ans: ansNum(sq / c), hint: 'Brackets, then indices, then division.',
      steps: ['Brackets: ' + a + ' + ' + b + ' = ' + s, 'Index: ' + pow(s, 2) + ' = ' + sq, sq + ' ÷ ' + c + ' = ' + sq / c] };
  } });

  def({ id: 'y7-int-hcflcm', year: Y, topic: 'int', tier: 2, quick: false, gen: function (r) {
    if (r.chance(0.5)) {
      const g = r.pick([2, 3, 4, 5, 6, 7, 8, 9, 12]);
      const maxM = Math.floor(99 / g);
      if (maxM < 3) return null;
      const m1 = r.int(2, maxM); let m2 = r.int(2, maxM), guard = 0;
      while ((m2 === m1 || gcd(m1, m2) !== 1) && guard++ < 50) m2 = r.int(2, maxM);
      if (m2 === m1 || gcd(m1, m2) !== 1) return null;
      const A = g * m1, B = g * m2;
      return { q: 'Find the highest common factor (HCF) of ' + A + ' and ' + B + '.', ans: ansNum(g), hint: 'List the factors of each number and find the biggest one they share.',
        steps: [A + ' = ' + g + ' × ' + m1 + ' and ' + B + ' = ' + g + ' × ' + m2, m1 + ' and ' + m2 + ' have no common factor except 1.', 'So the HCF is ' + g + '.'] };
    }
    let A, B, L, guard = 0;
    do { A = r.int(3, 20); B = r.int(3, 20); L = lcm(A, B); } while ((A === B || L > 100 || L === A || L === B) && guard++ < 100);
    if (A === B || L > 100 || L === A || L === B) return null;
    const mults = function (k) { const out = []; for (let t = k; t <= L; t += k) out.push(t); return out.join(', '); };
    return { q: 'Find the lowest common multiple (LCM) of ' + A + ' and ' + B + '.', ans: ansNum(L), hint: 'List the multiples of each number until you find one in both lists.',
      steps: ['Multiples of ' + A + ': ' + mults(A), 'Multiples of ' + B + ': ' + mults(B), 'The first number in both lists is ' + L + '.'] };
  } });

  def({ id: 'y7-int-roots', year: Y, topic: 'int', tier: 1, quick: true, gen: function (r) {
    const t = r.int(0, 3);
    if (t === 0) { const k = r.int(2, 15); return { q: 'Work out ' + pow(k, 2), ans: ansNum(k * k), hint: 'Square means multiply the number by itself.', steps: [pow(k, 2) + ' = ' + k + ' × ' + k + ' = ' + k * k] }; }
    if (t === 1) { const k = r.int(2, 15); return { q: 'Work out √' + k * k, ans: ansNum(k), hint: 'Which number multiplied by itself gives ' + k * k + '?', steps: [k + ' × ' + k + ' = ' + k * k + ', so √' + k * k + ' = ' + k] }; }
    const k = r.pick([2, 3, 4, 5, 10]);
    if (t === 2) return { q: 'Work out ' + pow(k, 3), ans: ansNum(k * k * k), hint: 'Cube means multiply three of the number together.', steps: [pow(k, 3) + ' = ' + k + ' × ' + k + ' × ' + k + ' = ' + k * k * k] };
    return { q: 'Work out ∛' + k * k * k, ans: ansNum(k), hint: 'Which number cubed gives ' + k * k * k + '?', steps: [k + ' × ' + k + ' × ' + k + ' = ' + k * k * k + ', so ∛' + k * k * k + ' = ' + k] };
  } });

  def({ id: 'y7-int-divis', year: Y, topic: 'int', tier: 2, quick: true, gen: function (r) {
    const d = r.pick([3, 4, 6, 9]);
    const good = d * r.int(Math.ceil(120 / d), Math.floor(9990 / d));
    const bad = [];
    let guard = 0;
    while (bad.length < 3 && guard++ < 500) {
      let c = r.int(120, 9990);
      if (d === 9 && r.chance(0.7)) c = 3 * r.int(40, 3330);      // divisible by 3 but maybe not 9
      if (d === 4 || d === 6) c = 2 * r.int(60, 4995);            // even numbers
      if (c % d !== 0 && bad.indexOf(c) < 0) bad.push(c);
    }
    const tests = { 3: 'the sum of its digits is a multiple of 3', 4: 'its last two digits make a multiple of 4', 6: 'it is even AND its digit sum is a multiple of 3', 9: 'the sum of its digits is a multiple of 9' };
    const ds = String(good).split('').reduce(function (s, c) { return s + (+c); }, 0);
    const st = ['A number is divisible by ' + d + ' if ' + tests[d] + '.'];
    if (d === 4) st.push('Last two digits of ' + good + ': ' + String(good).slice(-2) + ', which is a multiple of 4.');
    else st.push('Digit sum of ' + good + ' = ' + ds + (d === 6 ? ', and ' + good + ' is even.' : '.'));
    return { q: 'Which of these numbers is divisible by ' + d + '?', ans: ansMC(fmt(good), bad.map(fmt), r), hint: 'Use the divisibility test for ' + d + '.', steps: st };
  } });

  def({ id: 'y7-int-temp', year: Y, topic: 'int', tier: 2, quick: false, gen: function (r) {
    const s = r.int(-12, -2), rise = r.int(5, 15), fall = r.int(3, 14), res = s + rise - fall;
    return { q: 'At 6 a.m. the temperature was ' + fmt(s) + ' °C. By noon it had risen by ' + rise + ' °C. By midnight it had fallen by ' + fall + ' °C from the noon temperature. What was the temperature at midnight, in °C?',
      ans: ansNum(res), hint: 'Rise means add, fall means subtract.',
      steps: ['Noon: ' + fmt(s) + ' + ' + rise + ' = ' + fmt(s + rise) + ' °C', 'Midnight: ' + fmt(s + rise) + ' ' + MINUS + ' ' + fall + ' = ' + fmt(res) + ' °C'] };
  } });

  def({ id: 'y7-int-lcmword', year: Y, topic: 'int', tier: 3, quick: false, gen: function (r) {
    let a, b, L, g = 0;
    do { a = r.pick([4, 6, 8, 9, 10, 12, 15, 18, 20]); b = r.pick([4, 6, 8, 9, 10, 12, 15, 18, 20]); L = lcm(a, b); } while ((a === b || L > 90 || L === a * b) && g++ < 100);
    if (a === b || L > 90) return null;
    return { q: 'One bus leaves the station every ' + a + ' minutes and another bus every ' + b + ' minutes. Both buses leave at 8:00 a.m. After how many minutes will they next leave together?',
      ans: ansNum(L), hint: 'You need the lowest common multiple of ' + a + ' and ' + b + '.',
      steps: ['Find the LCM of ' + a + ' and ' + b + '.', 'Multiples of ' + Math.max(a, b) + ': ' + (function () { const o = []; for (let t = Math.max(a, b); t <= L; t += Math.max(a, b)) o.push(t); return o.join(', '); })(), L + ' is the first one that is also a multiple of ' + Math.min(a, b) + '.', 'They leave together again after ' + L + ' minutes.'] };
  } });

  /* ===== Unit 2 Expressions, formulae and equations ===== */
  def({ id: 'y7-alg-sub', year: Y, topic: 'alg', tier: 1, quick: true, gen: function (r) {
    const a = r.int(2, 9), b = r.nonZero(-12, 12), k = r.int(2, 10), res = a * k + b;
    return { q: 'Find the value of ' + lin([[a, x], [b, '']]) + ' when ' + x + ' = ' + k + '.', ans: ansNum(res), hint: 'Replace ' + x + ' with ' + k + '. Remember ' + a + x + ' means ' + a + ' × ' + x + '.',
      steps: [a + ' × ' + k + op(b), '= ' + a * k + op(b), '= ' + fmt(res)] };
  } });

  def({ id: 'y7-alg-sub2', year: Y, topic: 'alg', tier: 2, quick: false, gen: function (r) {
    const p = r.int(2, 6), q = r.int(2, 6);
    let a = r.nonZero(-6, 8), b = r.nonZero(-6, 6);
    if (a > 0 && b > 0) b = -b;
    const res = p * a - q * b;
    return { q: 'Find the value of ' + p + x + ' ' + MINUS + ' ' + q + y + ' when ' + x + ' = ' + fmt(a) + ' and ' + y + ' = ' + fmt(b) + '.', ans: ansNum(res), hint: 'Substitute carefully and watch the signs.',
      steps: [p + ' × ' + paren(a) + ' ' + MINUS + ' ' + q + ' × ' + paren(b), '= ' + fmt(p * a) + ' ' + MINUS + ' ' + paren(q * b), '= ' + fmt(res)] };
  } });

  def({ id: 'y7-alg-collect', year: Y, topic: 'alg', tier: 1, quick: true, gen: function (r) {
    const a = r.int(2, 9), b = r.int(1, 9);
    let c = r.nonZero(-8, 8), d = r.nonZero(-8, 8), g = 0;
    while ((a + c === 0 || b + d === 0 || c === 0 || d === 0) && g++ < 50) { c = r.nonZero(-8, 8); d = r.nonZero(-8, 8); }
    if (a + c === 0 || b + d === 0) return null;
    const correct = lin([[a + c, x], [b + d, y]]);
    const ds = [lin([[a - c, x], [b + d, y]]), lin([[a + c, x], [b - d, y]]), (a + b + c + d > 1 ? (a + b + c + d) + x + y : lin([[a + c + 1, x], [b + d, y]])), lin([[a + c, x], [b + d, '']]), lin([[a - c, x], [b - d, y]])];
    return { q: 'Simplify ' + lin([[a, x], [b, y], [c, x], [d, y]]), ans: ansMC(correct, ds, r), hint: 'Collect the ' + x + ' terms together and the ' + y + ' terms together.',
      steps: [x + ' terms: ' + lin([[a, ''], [c, '']]) + ' = ' + fmt(a + c), y + ' terms: ' + lin([[b, ''], [d, '']]) + ' = ' + fmt(b + d), 'Answer: ' + correct] };
  } });

  def({ id: 'y7-alg-expand', year: Y, topic: 'alg', tier: 2, quick: true, gen: function (r) {
    const a = r.int(2, 9), b = r.int(1, 6), c = r.int(1, 9) * r.sign();
    const correct = lin([[a * b, x], [a * c, '']]);
    const ds = [lin([[a * b, x], [c, '']]), lin([[a * b, x], [-a * c, '']]), lin([[a + b, x], [a * c, '']]), lin([[b, x], [a * c, '']])];
    return { q: 'Expand ' + a + '(' + lin([[b, x], [c, '']]) + ')', ans: ansMC(correct, ds, r), hint: 'Multiply EVERY term inside the bracket by ' + a + '.',
      steps: [a + ' × ' + lin([[b, x]]) + ' = ' + lin([[a * b, x]]), a + ' × ' + paren(c) + ' = ' + fmt(a * c), 'Answer: ' + correct] };
  } });

  def({ id: 'y7-alg-expand2', year: Y, topic: 'alg', tier: 3, quick: false, gen: function (r) {
    const a = r.int(2, 6), c = r.int(2, 6), b = r.int(1, 9), d = r.int(1, 9);
    if (a * b - c * d === 0) return null;
    const correct = lin([[a + c, x], [a * b - c * d, '']]);
    const ds = [lin([[a + c, x], [a * b + c * d, '']]), lin([[a + c, x], [b - d, '']]), lin([[a + c, x], [a * b - d, '']]), lin([[a * c, x], [a * b - c * d, '']])];
    return { q: 'Expand and simplify ' + a + '(' + x + ' + ' + b + ') + ' + c + '(' + x + ' ' + MINUS + ' ' + d + ')', ans: ansMC(correct, ds, r), hint: 'Expand each bracket, then collect like terms.',
      steps: [a + '(' + x + ' + ' + b + ') = ' + lin([[a, x], [a * b, '']]), c + '(' + x + ' ' + MINUS + ' ' + d + ') = ' + lin([[c, x], [-c * d, '']]), 'Collect: ' + correct] };
  } });

  def({ id: 'y7-alg-solve1', year: Y, topic: 'alg', tier: 1, quick: true, gen: function (r) {
    const k = r.nonZero(-12, 15), t = r.int(0, 2);
    if (t === 0) { const a = r.int(2, 20); return { q: 'Solve ' + x + ' + ' + a + ' = ' + fmt(k + a), ans: ansNum(k), hint: 'Subtract ' + a + ' from both sides.', steps: [x + ' = ' + fmt(k + a) + ' ' + MINUS + ' ' + a, x + ' = ' + fmt(k)] }; }
    if (t === 1) { const a = r.int(2, 20); return { q: 'Solve ' + x + ' ' + MINUS + ' ' + a + ' = ' + fmt(k - a), ans: ansNum(k), hint: 'Add ' + a + ' to both sides.', steps: [x + ' = ' + fmt(k - a) + ' + ' + a, x + ' = ' + fmt(k)] }; }
    const a = r.int(2, 9);
    return { q: 'Solve ' + a + x + ' = ' + fmt(a * k), ans: ansNum(k), hint: 'Divide both sides by ' + a + '.', steps: [x + ' = ' + fmt(a * k) + ' ÷ ' + a, x + ' = ' + fmt(k)] };
  } });

  def({ id: 'y7-alg-solve2', year: Y, topic: 'alg', tier: 2, quick: false, gen: function (r) {
    const a = r.int(2, 9), b = r.nonZero(-15, 15), k = r.nonZero(-8, 12), c = a * k + b;
    return { q: 'Solve ' + lin([[a, x], [b, '']]) + ' = ' + fmt(c), ans: ansNum(k), hint: 'Undo the ' + (b > 0 ? 'add' : 'subtract') + ' first, then divide.',
      steps: [(b > 0 ? 'Subtract ' + b : 'Add ' + (-b)) + ' on both sides: ' + a + x + ' = ' + fmt(c - b), 'Divide by ' + a + ': ' + x + ' = ' + fmt(k)] };
  } });

  def({ id: 'y7-alg-solve3', year: Y, topic: 'alg', tier: 3, quick: false, gen: function (r) {
    if (r.chance(0.5)) {
      const a = r.int(2, 6), b = r.nonZero(-6, 8), k = r.int(-5, 12), c = a * (k + b);
      return { q: 'Solve ' + a + '(' + lin([[1, x], [b, '']]) + ') = ' + fmt(c), ans: ansNum(k), hint: 'Divide both sides by ' + a + ' first (or expand the bracket).',
        steps: ['Divide by ' + a + ': ' + lin([[1, x], [b, '']]) + ' = ' + fmt(k + b), x + ' = ' + fmt(k + b) + (b > 0 ? ' ' + MINUS + ' ' + b : ' + ' + (-b)) + ' = ' + fmt(k)] };
    }
    const nm = r.pick(NAMES), a = r.int(3, 9), b = r.int(2, 15), k = r.int(3, 15), c = a * k - b;
    return { q: nm + ' thinks of a number, multiplies it by ' + a + ' and then subtracts ' + b + '. The answer is ' + c + '. What number did ' + nm + ' think of?', ans: ansNum(k), hint: 'Write an equation: ' + a + x + ' ' + MINUS + ' ' + b + ' = ' + c + '.',
      steps: [a + x + ' ' + MINUS + ' ' + b + ' = ' + c, a + x + ' = ' + (c + b), x + ' = ' + k] };
  } });

  def({ id: 'y7-alg-words', year: Y, topic: 'alg', tier: 2, quick: false, gen: function (r) {
    const n1 = r.pick(NAMES); let n2 = r.pick(NAMES); if (n2 === n1) n2 = 'Ben';
    const m = r.int(2, 5), k = r.int(1, 9);
    if (m === k) return null;
    if (r.chance(0.5)) {
      const correct = lin([[m, n], [k, '']]);
      return { q: n1 + ' has ' + n + ' stickers. ' + n2 + ' has ' + k + ' more than ' + m + ' times as many stickers as ' + n1 + '. Which expression gives the number of stickers ' + n2 + ' has?',
        ans: ansMC(correct, [lin([[k, n], [m, '']]), m + '(' + n + ' + ' + k + ')', lin([[m, n], [-k, '']]), n + ' + ' + (m + k)], r), hint: '"' + m + ' times as many" means ' + m + n + '.',
        steps: [m + ' times as many as ' + n1 + ': ' + m + n, k + ' more: ' + correct] };
    }
    const correct = m + '(' + v('p') + ' ' + MINUS + ' ' + k + ')';
    return { q: 'A pen costs ' + v('p') + ' ringgit. A ruler costs ' + k + ' ringgit less than a pen. Which expression gives the cost, in ringgit, of ' + m + ' rulers?',
      ans: ansMC(correct, [lin([[m, v('p')], [-k, '']]), v('p') + ' ' + MINUS + ' ' + m * k, m + '(' + v('p') + ' + ' + k + ')', lin([[m, v('p')], [k, '']])], r), hint: 'First write the cost of ONE ruler.',
      steps: ['One ruler costs ' + v('p') + ' ' + MINUS + ' ' + k, m + ' rulers cost ' + correct] };
  } });

  def({ id: 'y7-alg-formula', year: Y, topic: 'alg', tier: 2, quick: true, gen: function (r) {
    const k = r.int(3, 12), t = r.int(0, 2), C = v('C'), T = v('T'), A = v('A'), m = v('m'), b = v('b');
    if (t === 0) return { q: 'Each ticket costs RM' + k + '. Which formula gives the total cost, ' + C + ' ringgit, of ' + n + ' tickets?',
      ans: ansMC(C + ' = ' + k + n, [C + ' = ' + n + ' + ' + k, C + ' = ' + n + ' ÷ ' + k, n + ' = ' + k + C], r), hint: 'Try it with 2 tickets.', steps: [n + ' tickets cost ' + k + ' × ' + n + ' ringgit.', C + ' = ' + k + n] };
    if (t === 1) { const nm = r.pick(NAMES_F);
      return { q: nm + ' is ' + k + ' years older than her brother. Her brother is ' + b + ' years old. Which formula gives ' + nm + '’s age, ' + m + ' years?',
        ans: ansMC(m + ' = ' + b + ' + ' + k, [m + ' = ' + b + ' ' + MINUS + ' ' + k, m + ' = ' + k + b, b + ' = ' + m + ' + ' + k], r), hint: 'Older means add.', steps: [nm + ' is ' + k + ' years older, so add ' + k + ' to ' + b + '.', m + ' = ' + b + ' + ' + k] }; }
    return { q: 'A total of ' + T + ' ringgit is shared equally between ' + k + ' friends. Which formula gives the amount, ' + A + ' ringgit, that each friend gets?',
      ans: ansMC(A + ' = ' + T + ' ÷ ' + k, [A + ' = ' + k + T, A + ' = ' + T + ' ' + MINUS + ' ' + k, T + ' = ' + A + ' ÷ ' + k], r), hint: 'Sharing equally means dividing.', steps: ['Divide the total by ' + k + '.', A + ' = ' + T + ' ÷ ' + k] };
  } });

  def({ id: 'y7-alg-ineq', year: Y, topic: 'alg', tier: 2, quick: true, gen: function (r) {
    const a = r.int(-4, 5);
    if (r.chance(0.5)) {
      const gt = r.chance(0.5);
      const good = gt ? a + r.int(1, 4) : a - r.int(1, 4);
      const bad = gt ? [a, a - r.int(1, 3), a - r.int(4, 6)] : [a, a + r.int(1, 3), a + r.int(4, 6)];
      return { q: 'Which number satisfies the inequality ' + x + (gt ? ' &gt; ' : ' &lt; ') + fmt(a) + '?', ans: ansMC(fmt(good), bad.map(fmt), r),
        hint: x + (gt ? ' &gt; ' : ' &lt; ') + fmt(a) + ' means ' + x + ' is ' + (gt ? 'greater' : 'less') + ' than ' + fmt(a) + ' (not equal to it).',
        steps: [fmt(good) + ' is ' + (gt ? 'greater' : 'less') + ' than ' + fmt(a) + '.', fmt(a) + ' itself does not satisfy ' + x + (gt ? ' &gt; ' : ' &lt; ') + fmt(a) + '.'] };
    }
    const gt = r.chance(0.5), lo = a - 4, hi = a + 4, b = a + r.pick([-1, 1]);
    const dg = gt ? DG.numberLine(lo, hi, a, false, null, false) : DG.numberLine(lo, hi, null, false, a, false);
    const correct = x + (gt ? ' &gt; ' : ' &lt; ') + fmt(a);
    return { q: 'Which inequality is shown on the number line?', dg: dg,
      ans: ansMC(correct, [x + (gt ? ' &lt; ' : ' &gt; ') + fmt(a), x + (gt ? ' &gt; ' : ' &lt; ') + fmt(b), x + (gt ? ' &lt; ' : ' &gt; ') + fmt(b)], r),
      hint: 'An open circle means the number itself is NOT included. Which way does the arrow point?',
      steps: ['Open circle at ' + fmt(a) + ', arrow pointing ' + (gt ? 'right (bigger numbers)' : 'left (smaller numbers)') + '.', 'So ' + correct] };
  } });

  /* ===== Unit 3 Place value and rounding ===== */
  def({ id: 'y7-pv-pow10', year: Y, topic: 'pv', tier: 1, quick: true, gen: function (r) {
    const num = M.clean(r.int(1, 999) / Math.pow(10, r.int(0, 2))), e = r.int(1, 3), p = Math.pow(10, e), mul = r.chance(0.5);
    const res = M.clean(mul ? num * p : num / p);
    return { q: 'Work out ' + fmt(num) + (mul ? ' × ' : ' ÷ ') + fmt(p), ans: ansNum(res), hint: (mul ? 'Multiplying' : 'Dividing') + ' by ' + fmt(p) + ' moves the digits ' + e + ' place' + (e > 1 ? 's' : '') + ' to the ' + (mul ? 'left' : 'right') + '.',
      steps: ['The digits move ' + e + ' place' + (e > 1 ? 's' : '') + ' to the ' + (mul ? 'left' : 'right') + ' (the number gets ' + (mul ? 'bigger' : 'smaller') + ').', fmt(num) + (mul ? ' × ' : ' ÷ ') + fmt(p) + ' = ' + fmt(res)] };
  } });

  def({ id: 'y7-pv-round', year: Y, topic: 'pv', tier: 1, quick: true, gen: function (r) {
    const dp = r.pick([1, 2]);
    const val = M.clean(r.int(1, 99) + r.int(1, 9999) / 10000);
    const res = M.roundTo(val, dp);
    const str = M.plain(val), dec = (str.split('.')[1] || '');
    if (dec.length <= dp) return null;
    if (Math.round(res * Math.pow(10, dp)) % 10 === 0) return null; // avoid trailing-zero answers
    const nextDigit = +dec[dp];
    return { q: 'Round ' + fmt(val) + ' to ' + dp + ' decimal place' + (dp > 1 ? 's' : '') + '.', ans: ansNum(res), hint: 'Look at the digit in decimal place ' + (dp + 1) + '.',
      steps: ['The digit in decimal place ' + (dp + 1) + ' is ' + nextDigit + '.', nextDigit >= 5 ? 'It is 5 or more, so round up.' : 'It is less than 5, so round down.', 'Answer: ' + fmt(res)] };
  } });

  def({ id: 'y7-pv-digit', year: Y, topic: 'pv', tier: 1, quick: true, gen: function (r) {
    const digs = r.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 5), num = M.clean(digs[0] * 10 + digs[1] + digs[2] / 10 + digs[3] / 100 + digs[4] / 1000);
    const pos = r.int(0, 4), d = digs[pos], vals = [d * 10, d, d / 10, d / 100, d / 1000].map(M.clean), names = ['tens', 'ones', 'tenths', 'hundredths', 'thousandths'];
    return { q: 'What is the value of the digit ' + d + ' in ' + fmt(num) + '?', ans: ansMC(fmt(vals[pos]), vals.filter(function (t, i) { return i !== pos; }).map(fmt), r), hint: 'Say the place-value column for each digit: tens, ones, tenths, hundredths, thousandths.',
      steps: ['The ' + d + ' is in the ' + names[pos] + ' column.', 'Its value is ' + fmt(vals[pos]) + '.'] };
  } });

  def({ id: 'y7-pv-missing', year: Y, topic: 'pv', tier: 2, quick: true, gen: function (r) {
    const num = M.clean(r.int(2, 999) / Math.pow(10, r.int(1, 2))), e = r.int(1, 3), p = Math.pow(10, e), mul = r.chance(0.5), res = M.clean(mul ? num * p : num / p);
    return { q: fmt(num) + (mul ? ' × ' : ' ÷ ') + '<b>?</b> = ' + fmt(res) + '<br>What is the missing number?', ans: ansNum(p), hint: 'How many places have the digits moved?',
      steps: ['The digits moved ' + e + ' place' + (e > 1 ? 's' : '') + ' to the ' + (mul ? 'left' : 'right') + '.', 'So the missing number is ' + fmt(p) + '.'] };
  } });

  /* ===== Unit 4 Decimals ===== */
  def({ id: 'y7-dec-addsub', year: Y, topic: 'dec', tier: 1, quick: true, gen: function (r) {
    const a = M.clean(r.int(11, 999) / r.pick([10, 100])), b = M.clean(r.int(11, 999) / r.pick([10, 100]));
    const t = r.int(0, 2);
    if (t === 0) return { q: 'Work out ' + fmt(a) + ' + ' + fmt(b), ans: ansNum(M.clean(a + b)), hint: 'Line up the decimal points.', steps: [fmt(a) + ' + ' + fmt(b) + ' = ' + fmt(M.clean(a + b))] };
    if (t === 1) { const hi = Math.max(a, b), lo = Math.min(a, b); if (hi === lo) return null; return { q: 'Work out ' + fmt(hi) + ' ' + MINUS + ' ' + fmt(lo), ans: ansNum(M.clean(hi - lo)), hint: 'Line up the decimal points. Fill empty places with zeros.', steps: [fmt(hi) + ' ' + MINUS + ' ' + fmt(lo) + ' = ' + fmt(M.clean(hi - lo))] }; }
    const s = M.clean(-a + b);
    return { q: 'Work out ' + fmt(-a) + ' + ' + fmt(b), ans: ansNum(s), hint: 'This is the same as ' + fmt(b) + ' ' + MINUS + ' ' + fmt(a) + '.', steps: [fmt(-a) + ' + ' + fmt(b) + ' = ' + fmt(b) + ' ' + MINUS + ' ' + fmt(a), '= ' + fmt(s)] };
  } });

  def({ id: 'y7-dec-order', year: Y, topic: 'dec', tier: 1, quick: true, gen: function (r) {
    const X = r.int(3, 8);
    let vals, g = 0;
    do {
      vals = [X / 10, M.clean((X - 1) / 10 + r.int(11, 99) / 1000), M.clean((X - 1) / 10 + r.int(1, 9) / 100), M.clean(X / 100 + r.int(1, 9) / 1000)];
    } while (vals.filter(function (a, i) { return vals.indexOf(a) === i; }).length < 4 && g++ < 50);
    return { q: 'Which number is the largest?', ans: ansMC(fmt(vals[0]), vals.slice(1).map(fmt), r), hint: 'Compare the tenths digits first. More digits does not mean bigger!',
      steps: ['Compare tenths: ' + fmt(vals[0]) + ' has ' + X + ' tenths; the others have fewer.', 'So ' + fmt(vals[0]) + ' is the largest.'] };
  } });

  def({ id: 'y7-dec-muldiv', year: Y, topic: 'dec', tier: 2, quick: true, gen: function (r) {
    const k = r.int(2, 9), base = M.clean(r.intNot(11, 99, [20, 30, 40, 50, 60, 70, 80, 90]) / r.pick([10, 100]));
    if (r.chance(0.5)) return { q: 'Work out ' + fmt(base) + ' × ' + k, ans: ansNum(M.clean(base * k)), hint: 'Multiply without the decimal point, then put it back.', steps: [fmt(base) + ' × ' + k + ' = ' + fmt(M.clean(base * k))] };
    const a = M.clean(base * k);
    return { q: 'Work out ' + fmt(a) + ' ÷ ' + k, ans: ansNum(base), hint: 'Use short division and keep the decimal point in line.', steps: [fmt(a) + ' ÷ ' + k + ' = ' + fmt(base), 'Check: ' + fmt(base) + ' × ' + k + ' = ' + fmt(a)] };
  } });

  def({ id: 'y7-dec-easy', year: Y, topic: 'dec', tier: 2, quick: true, gen: function (r) {
    const pairs = [[2.5, 4, 10], [0.5, 8, 4], [1.25, 8, 10], [0.25, 8, 2], [2.5, 8, 20], [0.2, 5, 1]];
    const p = r.pick(pairs), k = r.int(3, 19);
    return { q: 'Work out ' + fmt(p[0]) + ' × ' + k + ' × ' + p[1], ans: ansNum(M.clean(p[2] * k)), hint: 'Change the order: multiply ' + fmt(p[0]) + ' × ' + p[1] + ' first.',
      steps: [fmt(p[0]) + ' × ' + p[1] + ' = ' + p[2], p[2] + ' × ' + k + ' = ' + fmt(p[2] * k)] };
  } });

  def({ id: 'y7-dec-word', year: Y, topic: 'dec', tier: 3, quick: false, gen: function (r) {
    const nm = r.pick(NAMES_F), t = r.int(0, 2);
    if (t === 0) { const pr = M.clean(r.int(105, 895) / 100), k = r.int(3, 9), tot = M.clean(pr * k);
      return { q: nm + ' buys ' + k + ' notebooks costing ' + money(pr) + ' each. How much does ' + nm + ' pay altogether, in RM?', ans: ansNum(tot, { show: money(tot) }), hint: 'Multiply the price by ' + k + '.', steps: [fmt(pr) + ' × ' + k + ' = ' + fmt(tot), 'Answer: ' + money(tot)] }; }
    if (t === 1) { const piece = M.clean(r.int(15, 95) / 100 + r.int(0, 2)), k = r.int(3, 8), L = M.clean(piece * k);
      return { q: 'A ribbon ' + fmt(L) + ' m long is cut into ' + k + ' equal pieces. How long is each piece, in metres?', ans: ansNum(piece), hint: 'Divide ' + fmt(L) + ' by ' + k + '.', steps: [fmt(L) + ' ÷ ' + k + ' = ' + fmt(piece) + ' m'] }; }
    const a = r.int(20, 50), b = M.clean(r.int(105, 1295) / 100), c = M.clean(r.int(105, 895) / 100), left = M.clean(a - b - c);
    if (left <= 0) return null;
    return { q: nm + ' has RM' + a + '. She spends ' + money(b) + ' on lunch and ' + money(c) + ' on a book. How much money, in RM, does she have left?', ans: ansNum(left, { show: money(left) }), hint: 'Add what she spends, then subtract from RM' + a + '.',
      steps: ['Spent: ' + fmt(b) + ' + ' + fmt(c) + ' = ' + fmt(M.clean(b + c)), a + ' ' + MINUS + ' ' + fmt(M.clean(b + c)) + ' = ' + fmt(left), 'Answer: ' + money(left)] };
  } });

  /* ===== Unit 5 Angles and constructions ===== */
  function angNot90(r, lo, hi) { let a, g = 0; do { a = r.int(lo, hi); } while (a >= 80 && a <= 100 && g++ < 50); return a; }
  def({ id: 'y7-ang-line', year: Y, topic: 'ang', tier: 1, quick: true, gen: function (r) {
    const a = angNot90(r, 25, 155), knownRight = r.chance(0.5);
    const dg = knownRight ? DG.straight(a, 'x', a) : DG.straight(a, 180 - a, 'x');
    const res = knownRight ? 180 - a : a;
    return { q: 'Find the value of ' + x + '.', dg: dg, ans: ansNum(res), hint: 'Angles on a straight line add up to 180°.',
      steps: ['Angles on a straight line add up to 180°.', x + ' = 180 ' + MINUS + ' ' + (knownRight ? a : 180 - a) + ' = ' + res + '°'] };
  } });

  def({ id: 'y7-ang-point', year: Y, topic: 'ang', tier: 1, quick: true, gen: function (r) {
    const s1 = r.int(70, 150), s2 = r.int(70, 150), s3 = 360 - s1 - s2;
    if (s3 < 60 || s3 > 170) return null;
    const angs = [s1, s2, s3], u = r.int(0, 2);
    const labels = angs.map(function (a, i) { return i === u ? 'x' : a; });
    const known = angs.filter(function (a, i) { return i !== u; });
    return { q: 'Find the value of ' + x + '.', dg: DG.point(angs, labels, r.int(0, 60)), ans: ansNum(angs[u]), hint: 'Angles around a point add up to 360°.',
      steps: ['Angles around a point add up to 360°.', x + ' = 360 ' + MINUS + ' ' + known[0] + ' ' + MINUS + ' ' + known[1] + ' = ' + angs[u] + '°'] };
  } });

  def({ id: 'y7-ang-tri', year: Y, topic: 'ang', tier: 1, quick: true, gen: function (r) {
    const A = r.int(30, 100), B = r.int(30, 100), C = 180 - A - B;
    if (C < 25 || C > 110) return null;
    const angs = [A, B, C], u = r.int(0, 2);
    const labels = angs.map(function (a, i) { return i === u ? 'x' : a; });
    const known = angs.filter(function (a, i) { return i !== u; });
    return { q: 'Find the value of ' + x + '.', dg: DG.triangle(A, B, labels), ans: ansNum(angs[u]), hint: 'Angles in a triangle add up to 180°.',
      steps: ['Angles in a triangle add up to 180°.', x + ' = 180 ' + MINUS + ' ' + known[0] + ' ' + MINUS + ' ' + known[1] + ' = ' + angs[u] + '°'] };
  } });

  def({ id: 'y7-ang-quad', year: Y, topic: 'ang', tier: 2, quick: false, gen: function (r) {
    const a = r.int(60, 140), b = r.int(60, 140), c = r.int(60, 140), d = 360 - a - b - c;
    if (d < 55 || d > 145) return null;
    const angs = [a, b, c, d], u = r.int(0, 3);
    const labels = angs.map(function (t, i) { return i === u ? 'x' : t; });
    const dg = DG.quad(angs, labels, r);
    if (!dg) return null;
    const known = angs.filter(function (t, i) { return i !== u; });
    return { q: 'Find the value of ' + x + '.', dg: dg, ans: ansNum(angs[u]), hint: 'Angles in a quadrilateral add up to 360°.',
      steps: ['Angles in a quadrilateral add up to 360°.', known.join(' + ') + ' = ' + (360 - angs[u]), x + ' = 360 ' + MINUS + ' ' + (360 - angs[u]) + ' = ' + angs[u] + '°'] };
  } });

  def({ id: 'y7-ang-vo', year: Y, topic: 'ang', tier: 2, quick: true, gen: function (r) {
    const a = angNot90(r, 30, 150), pos = r.int(1, 3);
    const labels = [a, null, null, null]; labels[pos] = 'x';
    const res = pos === 2 ? a : 180 - a;
    return { q: 'Two straight lines cross. Find the value of ' + x + '.', dg: DG.vertOpp(a, r.int(-15, 15), labels), ans: ansNum(res),
      hint: pos === 2 ? 'Vertically opposite angles are equal.' : 'Angles on a straight line add up to 180°.',
      steps: pos === 2 ? [x + ' and ' + a + '° are vertically opposite, so they are equal.', x + ' = ' + a + '°'] : [x + ' and ' + a + '° are on a straight line.', x + ' = 180 ' + MINUS + ' ' + a + ' = ' + res + '°'] };
  } });

  function parallelInfo(p1, p2) {
    const val = { AR: 0, AL: 1, BL: 0, BR: 1 };
    const same = val[p1] === val[p2];
    let why;
    if (p1 === p2) why = 'They are corresponding angles, so they are equal.';
    else if ((p1 === 'BL' && p2 === 'AR') || (p1 === 'BR' && p2 === 'AL')) why = 'They are alternate angles, so they are equal.';
    else if ((p1 === 'BL' && p2 === 'AL') || (p1 === 'BR' && p2 === 'AR')) why = 'They are between the parallel lines on the same side, so they add up to 180°.';
    else why = same ? 'Use corresponding angles, then vertically opposite angles: they are equal.' : 'Use corresponding angles, then angles on a straight line: they add up to 180°.';
    return { same: same, why: why };
  }
  M.parallelInfo = parallelInfo;
  def({ id: 'y7-ang-par', year: Y, topic: 'ang', tier: 3, quick: false, gen: function (r) {
    const th = angNot90(r, 40, 140), pos = ['AR', 'AL', 'BL', 'BR'];
    const p1 = r.pick(pos), p2 = r.pick(pos);
    const val = { AR: th, AL: 180 - th, BL: th, BR: 180 - th };
    const info = parallelInfo(p1, p2), res = val[p2];
    return { q: 'The two horizontal lines are parallel. Find the value of ' + x + '.', dg: DG.parallel(th, [{ at: 'top', pos: p1, lab: val[p1] }, { at: 'bot', pos: p2, lab: 'x' }]), ans: ansNum(res),
      hint: 'Look for equal angles (corresponding or alternate) and angles on a straight line.',
      steps: [info.why, info.same ? x + ' = ' + res + '°' : x + ' = 180 ' + MINUS + ' ' + val[p1] + ' = ' + res + '°'] };
  } });

  def({ id: 'y7-ang-quadalg', year: Y, topic: 'ang', tier: 3, quick: false, gen: function (r) {
    const k = r.int(30, 60), rest = 360 - 3 * k, p = r.int(60, 150), q = rest - p;
    if (q < 60 || q > 150) return null;
    const angs = [k, 2 * k, p, q], labels = ['x', '2x', p, q];
    const order = r.shuffle([0, 1, 2, 3]);
    const dg = DG.quad(order.map(function (i) { return angs[i]; }), order.map(function (i) { return labels[i]; }), r);
    if (!dg) return null;
    return { q: 'Find the value of ' + x + '.', dg: dg, ans: ansNum(k), hint: 'Angles in a quadrilateral add up to 360°. ' + x + ' + 2' + x + ' = 3' + x + '.',
      steps: [x + ' + 2' + x + ' + ' + p + ' + ' + q + ' = 360', '3' + x + ' + ' + (p + q) + ' = 360', '3' + x + ' = ' + (360 - p - q), x + ' = ' + k] };
  } });

  /* ===== Unit 6 Collecting data ===== */
  def({ id: 'y7-data-type', year: Y, topic: 'data', tier: 1, quick: true, gen: function (r) {
    const items = [['favourite colour', 'Categorical'], ['number of brothers and sisters', 'Discrete'], ['height of a student', 'Continuous'], ['shoe size', 'Discrete'],
      ['time taken to run 100 m', 'Continuous'], ['type of pet', 'Categorical'], ['mass of a bag of rice', 'Continuous'], ['number of goals scored in a match', 'Discrete'],
      ['favourite sport', 'Categorical'], ['temperature at noon', 'Continuous'], ['number of books read last month', 'Discrete'], ['way of travelling to school', 'Categorical']];
    const it = r.pick(items);
    const why = { Categorical: 'It is described with words (categories), not numbers.', Discrete: 'It can only take certain separate values (you can count it).', Continuous: 'It is measured, so it can take any value in a range.' };
    return { q: 'What type of data is “' + it[0] + '”?', ans: ansMC(it[1], ['Categorical', 'Discrete', 'Continuous'].filter(function (t) { return t !== it[1]; }), r, true), hint: 'Is it words, counted or measured?', steps: [why[it[1]], 'Answer: ' + it[1]] };
  } });

  def({ id: 'y7-data-sample', year: Y, topic: 'data', tier: 2, quick: false, gen: function (r) {
    const nm = r.pick(NAMES_F), total = r.pick([500, 600, 800, 900, 1200]), sz = total / 10;
    const topicQ = r.pick(['favourite fruit', 'favourite sport', 'favourite school subject', 'usual bedtime']);
    return { q: nm + ' wants to find out the ' + topicQ + ' of the ' + total + ' students in her school. Which is the best sample to use?',
      ans: ansMC('Ask ' + sz + ' students chosen at random from the whole school', ['Ask her 5 best friends', 'Ask ' + sz + ' students from her own year only', 'Ask the first ' + sz / 5 + ' students who arrive at school'], r),
      hint: 'A good sample is big enough and represents everyone.', steps: ['A random sample from the whole school represents all year groups.', 'A sample of ' + sz + ' is large enough to be reliable.'] };
  } });

  /* ===== Unit 7 Fractions ===== */
  function properFrac(r, dens) { const d = r.pick(dens); let k, g = 0; do { k = r.int(1, d - 1); } while (gcd(k, d) !== 1 && g++ < 30); return fr(k, d); }
  def({ id: 'y7-frac-simp', year: Y, topic: 'frac', tier: 1, quick: true, gen: function (r) {
    const f = properFrac(r, [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]), k = r.int(2, 9);
    return { q: 'Write ' + F(f.n * k, f.d * k) + ' in its simplest form.', ans: ansFrac(f.n, f.d, 'simplest'), hint: 'Divide the top and bottom by their highest common factor.',
      steps: ['The HCF of ' + f.n * k + ' and ' + f.d * k + ' is ' + k * gcd(f.n, f.d) + '.', F(f.n * k, f.d * k) + ' = ' + F(f.n, f.d)] };
  } });

  def({ id: 'y7-frac-of', year: Y, topic: 'frac', tier: 1, quick: true, gen: function (r) {
    const f = properFrac(r, [3, 4, 5, 6, 8, 10]), amt = f.d * r.int(2, 12), res = amt / f.d * f.n;
    return { q: 'Find ' + F(f.n, f.d) + ' of ' + amt + '.', ans: ansNum(res), hint: 'Divide by the denominator, then multiply by the numerator.', steps: [amt + ' ÷ ' + f.d + ' = ' + amt / f.d, amt / f.d + ' × ' + f.n + ' = ' + res] };
  } });

  def({ id: 'y7-frac-order', year: Y, topic: 'frac', tier: 2, quick: false, gen: function (r) {
    const fam = r.pick([[3, 4, 6, 12], [2, 4, 5, 10, 20], [3, 6, 9, 18], [2, 3, 4, 6, 8, 12, 24]]), LCD = fam[fam.length - 1];
    const fs = []; let g = 0;
    while (fs.length < 4 && g++ < 200) {
      const f = properFrac(r, fam.slice(0, -1).concat([LCD]));
      if (!fs.some(function (h) { return h.n * f.d === f.n * h.d; })) fs.push(f);
    }
    if (fs.length < 4) return null;
    fs.sort(function (a, b) { return b.n / b.d - a.n / a.d; });
    const html = fs.map(function (f) { return F(f.n, f.d); });
    return { q: 'Which fraction is the largest?', ans: ansMC(html[0], html.slice(1), r), hint: 'Write all the fractions with the same denominator (' + LCD + ').',
      steps: ['With denominator ' + LCD + ': ' + fs.map(function (f) { return F(f.n, f.d) + ' = ' + F(f.n * LCD / f.d, LCD); }).join(', '), 'The largest is ' + html[0] + '.'] };
  } });

  def({ id: 'y7-frac-addmix', year: Y, topic: 'frac', tier: 2, quick: false, gen: function (r) {
    const w1 = r.int(1, 4), w2 = r.int(1, 4), f1 = properFrac(r, [2, 3, 4, 5, 6, 8]), f2 = properFrac(r, [2, 3, 4, 5, 6, 8]);
    const L = lcm(f1.d, f2.d); if (L > 24) return null;
    const sumN = f1.n * L / f1.d + f2.n * L / f2.d, tot = M.fAdd(fr(w1 * f1.d + f1.n, f1.d), fr(w2 * f2.d + f2.n, f2.d));
    const st = ['Add the whole numbers: ' + w1 + ' + ' + w2 + ' = ' + (w1 + w2),
      'Add the fractions: ' + F(f1.n, f1.d) + ' + ' + F(f2.n, f2.d) + ' = ' + F(f1.n * L / f1.d, L) + ' + ' + F(f2.n * L / f2.d, L) + ' = ' + F(sumN, L) + (sumN >= L || gcd(sumN, L) > 1 ? ' = ' + mixed(sumN, L) : '')];
    st.push('Answer: ' + mixed(tot.n, tot.d));
    return { q: 'Work out ' + w1 + F(f1.n, f1.d) + ' + ' + w2 + F(f2.n, f2.d) + '<br><small>Give your answer as a mixed number in its simplest form.</small>', ans: ansFrac(tot.n, tot.d, 'mixed'), hint: 'Add the whole numbers, then add the fractions using a common denominator.', steps: st };
  } });

  def({ id: 'y7-frac-mul', year: Y, topic: 'frac', tier: 2, quick: false, gen: function (r) {
    const a = properFrac(r, [2, 3, 4, 5, 6, 7, 8, 9, 10]), b = properFrac(r, [2, 3, 4, 5, 6, 7, 8, 9, 10]), p = M.fMul(a, b);
    return { q: 'Work out ' + F(a.n, a.d) + ' × ' + F(b.n, b.d) + '<br><small>Give your answer in its simplest form.</small>', ans: ansFrac(p.n, p.d, 'simplest'), hint: 'Multiply the numerators, multiply the denominators, then simplify.',
      steps: [F(a.n, a.d) + ' × ' + F(b.n, b.d) + ' = ' + F(a.n * b.n, a.d * b.d), (a.n * b.n === p.n ? 'This is already in its simplest form.' : 'Simplify: ' + F(p.n, p.d))] };
  } });

  def({ id: 'y7-frac-div', year: Y, topic: 'frac', tier: 3, quick: false, gen: function (r) {
    const a = properFrac(r, [2, 3, 4, 5, 6, 8, 9, 10]), b = properFrac(r, [2, 3, 4, 5, 6, 8, 9, 10]);
    if (a.n * b.d === b.n * a.d) return null;
    const p = M.fDiv(a, b);
    return { q: 'Work out ' + F(a.n, a.d) + ' ÷ ' + F(b.n, b.d) + '<br><small>Give your answer in its simplest form.</small>', ans: ansFrac(p.n, p.d, 'simplest'), hint: 'Dividing by a fraction is the same as multiplying by its reciprocal.',
      steps: [F(a.n, a.d) + ' ÷ ' + F(b.n, b.d) + ' = ' + F(a.n, a.d) + ' × ' + F(b.d, b.n), '= ' + F(a.n * b.d, a.d * b.n), (Math.abs(p.n) > p.d ? '= ' + mixed(p.n, p.d) : (a.n * b.d !== p.n ? '= ' + F(p.n, p.d) : ''))].filter(Boolean) };
  } });

  /* ===== Unit 8 Shapes and symmetry ===== */
  def({ id: 'y7-shape-circle', year: Y, topic: 'shape', tier: 1, quick: true, gen: function (r) {
    const items = [['Radius', 'a straight line from the centre of a circle to its circumference'], ['Diameter', 'a straight line from one side of a circle to the other that passes through the centre'],
      ['Chord', 'a straight line joining any two points on the circumference of a circle'], ['Tangent', 'a straight line that touches a circle at exactly one point'], ['Circumference', 'the distance all the way around a circle']];
    const it = r.pick(items);
    const others = ['Radius', 'Diameter', 'Chord', 'Tangent', 'Circumference'].filter(function (t) { return t !== it[0] && !((it[0] === 'Chord' && t === 'Diameter') || (it[0] === 'Diameter' && t === 'Chord')); });
    return { q: 'What is the name of ' + it[1] + '?', ans: ansMC(it[0], others, r), hint: 'Picture a circle with its centre marked.', steps: ['A ' + it[0].toLowerCase() + ' is ' + it[1] + '.'] };
  } });

  def({ id: 'y7-shape-sym', year: Y, topic: 'shape', tier: 1, quick: true, gen: function (r) {
    const shapes = [['an equilateral triangle', 3, 3], ['a square', 4, 4], ['a regular pentagon', 5, 5], ['a regular hexagon', 6, 6], ['a regular octagon', 8, 8],
      ['a rectangle (that is not a square)', 2, 2], ['a rhombus (that is not a square)', 2, 2], ['a parallelogram (that is not a rectangle or rhombus)', 0, 2], ['a kite', 1, 1], ['an isosceles trapezium', 1, 1]];
    const s = r.pick(shapes), lines = r.chance(0.5);
    return { q: lines ? 'How many lines of symmetry does ' + s[0] + ' have?' : 'What is the order of rotational symmetry of ' + s[0] + '?', ans: ansNum(lines ? s[1] : s[2]),
      hint: lines ? 'Imagine folding it so the two halves match exactly.' : 'How many times does it look the same during one full turn?',
      steps: [s[0].charAt(0).toUpperCase() + s[0].slice(1) + ' has ' + (lines ? s[1] + ' line' + (s[1] === 1 ? '' : 's') + ' of symmetry.' : 'rotational symmetry of order ' + s[2] + '.')] };
  } });

  def({ id: 'y7-shape-3d', year: Y, topic: 'shape', tier: 2, quick: true, gen: function (r) {
    const solids = [['a cube', 6, 12, 8], ['a cuboid', 6, 12, 8], ['a triangular prism', 5, 9, 6], ['a square-based pyramid', 5, 8, 5], ['a triangular-based pyramid (tetrahedron)', 4, 6, 4], ['a pentagonal prism', 7, 15, 10], ['a hexagonal prism', 8, 18, 12]];
    const s = r.pick(solids), w = r.int(0, 2), word = ['faces', 'edges', 'vertices'][w];
    return { q: 'How many ' + word + ' does ' + s[0] + ' have?', ans: ansNum(s[1 + w]), hint: 'Faces are flat surfaces, edges are lines where faces meet, vertices are corners.',
      steps: [s[0].charAt(0).toUpperCase() + s[0].slice(1) + ' has ' + s[1] + ' faces, ' + s[2] + ' edges and ' + s[3] + ' vertices.'] };
  } });

  def({ id: 'y7-shape-poly', year: Y, topic: 'shape', tier: 1, quick: true, gen: function (r) {
    const polys = [[5, 'Pentagon'], [6, 'Hexagon'], [7, 'Heptagon'], [8, 'Octagon'], [9, 'Nonagon'], [10, 'Decagon']];
    const p = r.pick(polys);
    return { q: 'What is the name of a polygon with ' + p[0] + ' sides?', ans: ansMC(p[1], polys.filter(function (t) { return t[0] !== p[0]; }).map(function (t) { return t[1]; }), r), hint: 'Hex = 6, oct = 8, dec = 10…', steps: ['A polygon with ' + p[0] + ' sides is a ' + p[1].toLowerCase() + '.'] };
  } });

  /* ===== Unit 9 Sequences and functions ===== */
  def({ id: 'y7-seq-next', year: Y, topic: 'seq', tier: 1, quick: true, gen: function (r) {
    const a = r.int(-10, 20), d = r.nonZero(-7, 9), t = [0, 1, 2, 3, 4].map(function (i) { return a + i * d; });
    return { q: 'What is the next term in this sequence?<br><b>' + t.slice(0, 4).map(fmt).join(', ') + ', …</b>', ans: ansNum(t[4]), hint: 'Find the difference between consecutive terms.',
      steps: ['The term-to-term rule is ' + (d > 0 ? 'add ' + d : 'subtract ' + (-d)) + '.', fmt(t[3]) + (d > 0 ? ' + ' + d : ' ' + MINUS + ' ' + (-d)) + ' = ' + fmt(t[4])] };
  } });

  def({ id: 'y7-seq-nth', year: Y, topic: 'seq', tier: 2, quick: true, gen: function (r) {
    const t = r.int(0, 2), k = r.int(5, 50);
    let expr, val;
    if (t === 0) { const a = r.int(2, 12); expr = a + n; val = a * k; }
    else if (t === 1) { const a = r.int(1, 20); expr = n + ' + ' + a; val = k + a; }
    else { const a = r.int(1, 9); expr = n + ' ' + MINUS + ' ' + a; val = k - a; }
    return { q: 'The <i>n</i>th term of a sequence is ' + expr + '. What is the ' + ord(k) + ' term?', ans: ansNum(val), hint: 'Replace ' + n + ' with ' + k + '.', steps: ['Substitute ' + n + ' = ' + k + ' into ' + expr + '.', 'Answer: ' + val] };
  } });

  def({ id: 'y7-seq-findnth', year: Y, topic: 'seq', tier: 2, quick: false, gen: function (r) {
    const t = r.int(0, 2);
    if (t === 0) { const a = r.int(2, 9), seq = [a, 2 * a, 3 * a, 4 * a];
      return { q: 'Which is the <i>n</i>th term of this sequence?<br><b>' + seq.join(', ') + ', …</b>', ans: ansMC(a + n, [n + ' + ' + a, a + n + ' + ' + a, (a + 1) + n], r), hint: 'These are multiples of ' + a + '.', steps: ['The terms are the multiples of ' + a + ' (the ' + a + ' times table).', 'So the <i>n</i>th term is ' + a + n + '.'] }; }
    if (t === 1) { const a = r.int(2, 9), seq = [1 + a, 2 + a, 3 + a, 4 + a];
      return { q: 'Which is the <i>n</i>th term of this sequence?<br><b>' + seq.join(', ') + ', …</b>', ans: ansMC(n + ' + ' + a, [n + ' + ' + (a + 1), (a + 1) + n, a + n], r), hint: 'Each term is the position number plus something.', steps: ['1st term = 1 + ' + a + ', 2nd term = 2 + ' + a + ', …', 'So the <i>n</i>th term is ' + n + ' + ' + a + '.'] }; }
    const a = r.int(1, 5), seq = [1 - a, 2 - a, 3 - a, 4 - a];
    return { q: 'Which is the <i>n</i>th term of this sequence?<br><b>' + seq.map(fmt).join(', ') + ', …</b>', ans: ansMC(n + ' ' + MINUS + ' ' + a, [n + ' + ' + a, a + n, n + ' ' + MINUS + ' ' + (a + 1)], r), hint: 'Each term is ' + a + ' less than its position number.', steps: ['1st term = 1 ' + MINUS + ' ' + a + ' = ' + fmt(1 - a) + ', 2nd term = 2 ' + MINUS + ' ' + a + ' = ' + fmt(2 - a) + ', …', 'So the <i>n</i>th term is ' + n + ' ' + MINUS + ' ' + a + '.'] };
  } });

  def({ id: 'y7-seq-machine', year: Y, topic: 'seq', tier: 2, quick: true, gen: function (r) {
    const a = r.int(2, 9), b = r.nonZero(-9, 12), k = r.int(-5, 12), out = a * k + b;
    return { q: 'What is the output of this function machine?', dg: M.machine(fmt(k), ['× ' + a, b > 0 ? '+ ' + b : MINUS + ' ' + (-b)], '?'), ans: ansNum(out), hint: 'Do the operations in order, left to right.',
      steps: [fmt(k) + ' × ' + a + ' = ' + fmt(a * k), fmt(a * k) + op(b) + ' = ' + fmt(out)] };
  } });

  def({ id: 'y7-seq-machinv', year: Y, topic: 'seq', tier: 3, quick: false, gen: function (r) {
    const a = r.int(2, 9), b = r.nonZero(-9, 12), k = r.int(-5, 12), out = a * k + b;
    return { q: 'What is the input of this function machine?', dg: M.machine('?', ['× ' + a, b > 0 ? '+ ' + b : MINUS + ' ' + (-b)], fmt(out)), ans: ansNum(k), hint: 'Work backwards using inverse operations.',
      steps: ['Undo ' + (b > 0 ? '+ ' + b : MINUS + ' ' + (-b)) + ': ' + fmt(out) + (b > 0 ? ' ' + MINUS + ' ' + b : ' + ' + (-b)) + ' = ' + fmt(a * k), 'Undo × ' + a + ': ' + fmt(a * k) + ' ÷ ' + a + ' = ' + fmt(k)] };
  } });

  /* ===== Unit 10 Percentages ===== */
  def({ id: 'y7-pct-fdp', year: Y, topic: 'pct', tier: 1, quick: true, gen: function (r) {
    const t = r.int(0, 3);
    if (t === 0) { const d = r.pick([2, 4, 5, 10, 20, 25, 50]), k = r.int(1, d - 1); return { q: 'Write ' + F(k, d) + ' as a percentage.', ans: ansNum(M.clean(k / d * 100)), hint: 'Make the denominator 100.', steps: [F(k, d) + ' = ' + F(k * 100 / d, 100) + ' = ' + fmt(M.clean(k * 100 / d)) + '%'] }; }
    if (t === 1) { const p = r.int(1, 99), dv = M.clean(p / 100); return { q: 'Write ' + fmt(dv) + ' as a percentage.', ans: ansNum(p), hint: 'Multiply by 100.', steps: [fmt(dv) + ' × 100 = ' + p + '%'] }; }
    if (t === 2) { const p = r.pick([r.int(1, 9), r.int(11, 99), r.int(101, 250)]); return { q: 'Write ' + p + '% as a decimal.', ans: ansNum(M.clean(p / 100)), hint: 'Divide by 100.', steps: [p + ' ÷ 100 = ' + fmt(M.clean(p / 100))] }; }
    const p = r.pick([5, 15, 35, 45, 55, 65, 85, 95, 12, 24, 36, 48, 64, 75, 8, 4]), f = fr(p, 100);
    return { q: 'Write ' + p + '% as a fraction in its simplest form.', ans: ansFrac(f.n, f.d, 'simplest'), hint: 'Write it over 100, then simplify.', steps: [p + '% = ' + F(p, 100), 'Simplify: ' + F(f.n, f.d)] };
  } });

  def({ id: 'y7-pct-of', year: Y, topic: 'pct', tier: 2, quick: true, gen: function (r) {
    const t = r.int(0, 2);
    if (t === 0) { const p = r.pick([10, 20, 25, 30, 40, 50, 75, 15, 35, 5]), amt = r.pick([20, 40, 60, 80, 120, 160, 200, 240, 360, 400]), res = M.clean(p * amt / 100);
      return { q: 'Find ' + p + '% of ' + amt + '.', ans: ansNum(res), hint: 'Find 10% (or 1%) first, then build up.', steps: ['10% of ' + amt + ' = ' + fmt(amt / 10), p + '% of ' + amt + ' = ' + fmt(res)] }; }
    if (t === 1) { const p = r.pick([0.5, 0.1, 0.2]), amt = r.pick([200, 400, 600, 800, 1000, 1200]), res = M.clean(p * amt / 100);
      return { q: 'Find ' + fmt(p) + '% of ' + amt + '.', ans: ansNum(res), hint: 'Find 1% first.', steps: ['1% of ' + amt + ' = ' + fmt(amt / 100), fmt(p) + '% of ' + amt + ' = ' + fmt(res)] }; }
    const p = r.pick([110, 120, 125, 150, 200, 250]), amt = r.pick([12, 20, 24, 36, 40, 42, 60, 80]), res = M.clean(p * amt / 100);
    return { q: 'Find ' + p + '% of ' + amt + '.', ans: ansNum(res), hint: p + '% is more than 100%, so the answer is bigger than ' + amt + '.', steps: [p + '% = 100% + ' + (p - 100) + '%', amt + ' + ' + fmt(M.clean((p - 100) * amt / 100)) + ' = ' + fmt(res)] };
  } });

  def({ id: 'y7-pct-grid', year: Y, topic: 'pct', tier: 2, quick: true, gen: function (r) {
    const shape = r.pick([[10, 10], [4, 5], [5, 5], [2, 10]]), total = shape[0] * shape[1], k = r.int(1, total - 1), pc = M.clean(k / total * 100);
    return { q: 'What percentage of the grid is shaded?', dg: DG.grid(shape[0], shape[1], k), ans: ansNum(pc), hint: 'Write shaded ÷ total as a fraction, then as a percentage.',
      steps: [k + ' out of ' + total + ' squares are shaded: ' + F(k, total), F(k, total) + ' = ' + fmt(pc) + '%'] };
  } });

  def({ id: 'y7-pct-express', year: Y, topic: 'pct', tier: 3, quick: false, gen: function (r) {
    const nm = r.pick(NAMES), b = r.pick([20, 25, 40, 50, 80, 200, 400]), p = r.pick([5, 10, 15, 20, 30, 35, 40, 45, 55, 60, 65, 70, 75, 80, 85, 90, 95]), a = b * p / 100;
    if (a !== Math.round(a)) return null;
    return { q: nm + ' scored ' + a + ' out of ' + b + ' in a test. What is this as a percentage?', ans: ansNum(p), hint: 'Write ' + a + ' out of ' + b + ' as a fraction, then change it to a percentage.',
      steps: [F(a, b) + ' × 100 = ' + p + '%'] };
  } });

  /* ===== Unit 11 Graphs ===== */
  def({ id: 'y7-graph-axes', year: Y, topic: 'graph', tier: 1, quick: true, gen: function (r) {
    const c = r.nonZero(-6, 6), vert = r.chance(0.5), vs = r.sample([-3, -1, 0, 2, 4, 5], 3);
    const pts = vs.map(function (t) { return vert ? coord(c, t) : coord(t, c); }).join(', ');
    const correct = (vert ? x : y) + ' = ' + fmt(c);
    return { q: 'The points ' + pts + ' all lie on a straight line. What is the equation of the line?', ans: ansMC(correct, [(vert ? y : x) + ' = ' + fmt(c), y + ' = ' + x + op(c), x + ' + ' + y + ' = ' + fmt(c)], r),
      hint: 'Which coordinate stays the same?', steps: ['The ' + (vert ? x : y) + '-coordinate is always ' + fmt(c) + '.', 'So the equation is ' + correct + '.'] };
  } });

  def({ id: 'y7-graph-value', year: Y, topic: 'graph', tier: 1, quick: true, gen: function (r) {
    const k = r.nonZero(-6, 8);
    if (r.chance(0.5)) { const m = r.int(2, 6); return { q: 'For the line ' + y + ' = ' + m + x + ', find ' + y + ' when ' + x + ' = ' + fmt(k) + '.', ans: ansNum(m * k), hint: m + x + ' means ' + m + ' × ' + x + '.', steps: [y + ' = ' + m + ' × ' + paren(k) + ' = ' + fmt(m * k)] }; }
    const c = r.nonZero(-9, 9);
    return { q: 'For the line ' + y + ' = ' + x + op(c) + ', find ' + y + ' when ' + x + ' = ' + fmt(k) + '.', ans: ansNum(k + c), hint: 'Substitute the value of ' + x + '.', steps: [y + ' = ' + fmt(k) + op(c) + ' = ' + fmt(k + c)] };
  } });

  def({ id: 'y7-graph-point', year: Y, topic: 'graph', tier: 2, quick: true, gen: function (r) {
    const k = r.nonZero(-4, 5);
    if (r.chance(0.5)) {
      const m = r.int(2, 5), yy = m * k;
      return { q: 'Which point lies on the line ' + y + ' = ' + m + x + '?', ans: ansMC(coord(k, yy), [coord(yy, k), coord(k, yy + 1), coord(k, k + m), coord(-k, yy)], r), hint: 'Check each point: is the ' + y + '-coordinate ' + m + ' times the ' + x + '-coordinate?',
        steps: ['When ' + x + ' = ' + fmt(k) + ', ' + y + ' = ' + m + ' × ' + paren(k) + ' = ' + fmt(yy) + '.', 'So ' + coord(k, yy) + ' lies on the line.'] };
    }
    const c = r.nonZero(-5, 6), yy = k + c;
    return { q: 'Which point lies on the line ' + y + ' = ' + x + op(c) + '?', ans: ansMC(coord(k, yy), [coord(yy, k), coord(k, k - c), coord(k + 1, yy)], r), hint: 'Substitute each ' + x + '-coordinate into the equation.',
      steps: ['When ' + x + ' = ' + fmt(k) + ', ' + y + ' = ' + fmt(k) + op(c) + ' = ' + fmt(yy) + '.', 'So ' + coord(k, yy) + ' lies on the line.'] };
  } });

  /* ===== Unit 12 Ratio and proportion ===== */
  def({ id: 'y7-ratio-simp', year: Y, topic: 'ratio', tier: 1, quick: true, gen: function (r) {
    let p, q, g = 0; do { p = r.int(1, 9); q = r.int(1, 9); } while ((p === q || gcd(p, q) !== 1) && g++ < 50);
    const k = r.pick([4, 6, 8, 9, 10, 12]), A = p * k, B = q * k;
    const part = k % 2 === 0 ? 2 : 3;
    return { q: 'Write ' + A + ' : ' + B + ' in its simplest form.', ans: ansMC(p + ' : ' + q, [q + ' : ' + p, (A / part) + ' : ' + (B / part), (p + 1) + ' : ' + (q + 1)], r), hint: 'Divide both parts by their highest common factor.',
      steps: ['The HCF of ' + A + ' and ' + B + ' is ' + k + '.', A + ' ÷ ' + k + ' = ' + p + ', ' + B + ' ÷ ' + k + ' = ' + q, 'Answer: ' + p + ' : ' + q] };
  } });

  def({ id: 'y7-ratio-share', year: Y, topic: 'ratio', tier: 2, quick: false, gen: function (r) {
    let p, q, g = 0; do { p = r.int(1, 7); q = r.int(1, 7); } while ((p === q || gcd(p, q) !== 1) && g++ < 50);
    const unit = r.int(2, 15), total = (p + q) * unit, n1 = r.pick(NAMES); let n2 = r.pick(NAMES); if (n2 === n1) n2 = 'Ben';
    const first = r.chance(0.5);
    return { q: n1 + ' and ' + n2 + ' share RM' + total + ' in the ratio ' + p + ' : ' + q + '. How much, in RM, does ' + (first ? n1 : n2) + ' get?', ans: ansNum((first ? p : q) * unit), hint: 'Find the total number of parts, then the value of one part.',
      steps: ['Total parts: ' + p + ' + ' + q + ' = ' + (p + q), 'One part: ' + total + ' ÷ ' + (p + q) + ' = ' + unit, (first ? n1 : n2) + ' gets ' + (first ? p : q) + ' × ' + unit + ' = RM' + (first ? p : q) * unit] };
  } });

  def({ id: 'y7-ratio-unitary', year: Y, topic: 'ratio', tier: 2, quick: false, gen: function (r) {
    const item = r.pick(['pens', 'erasers', 'bottles of water', 'packets of noodles', 'mangoes']), u = M.clean(r.pick([1.2, 1.5, 2.5, 0.8, 1.25, 3.5, 2.2, 0.6])), k = r.int(3, 8);
    let m = r.int(2, 12); if (m === k) m = k + 3;
    const C = M.clean(k * u), res = M.clean(m * u);
    return { q: k + ' ' + item + ' cost ' + money(C) + '. How much, in RM, do ' + m + ' ' + item + ' cost?', ans: ansNum(res, { show: money(res) }), hint: 'Find the cost of ONE first (unitary method).',
      steps: ['One costs ' + fmt(C) + ' ÷ ' + k + ' = ' + money(u), m + ' cost ' + m + ' × ' + fmt(u) + ' = ' + money(res)] };
  } });

  def({ id: 'y7-ratio-find', year: Y, topic: 'ratio', tier: 3, quick: false, gen: function (r) {
    let p, q, g = 0; do { p = r.int(2, 9); q = r.int(2, 9); } while ((p === q || gcd(p, q) !== 1) && g++ < 50);
    const k = r.int(2, 9), giveGirls = r.chance(0.5);
    return { q: 'The ratio of boys to girls in a club is ' + p + ' : ' + q + '. There are ' + (giveGirls ? q * k + ' girls. How many boys' : p * k + ' boys. How many girls') + ' are there?', ans: ansNum(giveGirls ? p * k : q * k), hint: 'Find what one part of the ratio is worth.',
      steps: [giveGirls ? q + ' parts = ' + q * k + ', so 1 part = ' + k : p + ' parts = ' + p * k + ', so 1 part = ' + k, giveGirls ? 'Boys: ' + p + ' × ' + k + ' = ' + p * k : 'Girls: ' + q + ' × ' + k + ' = ' + q * k] };
  } });

  /* ===== Unit 13 Probability ===== */
  def({ id: 'y7-prob-words', year: Y, topic: 'prob', tier: 1, quick: true, gen: function (r) {
    const ev = [['rolling a 7 on an ordinary six-sided dice', 'Impossible'], ['rolling a number less than 7 on an ordinary six-sided dice', 'Certain'], ['getting heads when you flip a fair coin', 'Even chance'],
      ['rolling a 6 on an ordinary six-sided dice', 'Unlikely'], ['rolling a number greater than 1 on an ordinary six-sided dice', 'Likely'], ['picking a red ball from a bag of 9 red balls and 1 blue ball', 'Likely'],
      ['picking a blue ball from a bag of 9 red balls and 1 blue ball', 'Unlikely'], ['rolling an even number on an ordinary six-sided dice', 'Even chance'], ['picking a green ball from a bag of 5 red balls and 5 blue balls', 'Impossible']];
    const e = r.pick(ev), scale = ['Impossible', 'Unlikely', 'Even chance', 'Likely', 'Certain'];
    return { q: 'Which word best describes the probability of ' + e[0] + '?', ans: ansMC(e[1], scale.filter(function (s) { return s !== e[1]; }), r, true), hint: 'Think about how many outcomes are possible.', steps: ['The best description is “' + e[1].toLowerCase() + '”.'] };
  } });

  def({ id: 'y7-prob-bag', year: Y, topic: 'prob', tier: 1, quick: true, gen: function (r) {
    const cs = [r.int(1, 9), r.int(1, 9), r.int(1, 9)], names = ['red', 'blue', 'green'], i = r.int(0, 2), tot = cs[0] + cs[1] + cs[2];
    const f = fr(cs[i], tot);
    return { q: 'A bag contains ' + cs[0] + ' red, ' + cs[1] + ' blue and ' + cs[2] + ' green counters. One counter is taken at random. What is the probability that it is ' + names[i] + '?',
      ans: ansFrac(cs[i], tot, 'any', { show: F(cs[i], tot) + (f.n !== cs[i] ? ' = ' + F(f.n, f.d) : '') }), hint: 'Probability = number of ' + names[i] + ' counters ÷ total number of counters.',
      steps: ['Total counters: ' + tot, 'P(' + names[i] + ') = ' + F(cs[i], tot) + (f.n !== cs[i] ? ' = ' + F(f.n, f.d) : '')] };
  } });

  def({ id: 'y7-prob-dice', year: Y, topic: 'prob', tier: 2, quick: true, gen: function (r) {
    const evs = [['a prime number', [2, 3, 5]], ['a multiple of 3', [3, 6]], ['a factor of 6', [1, 2, 3, 6]], ['an odd number', [1, 3, 5]], ['a square number', [1, 4]], ['a number greater than 4', [5, 6]], ['a number less than 3', [1, 2]]];
    const e = r.pick(evs), f = fr(e[1].length, 6);
    return { q: 'An ordinary fair six-sided dice is rolled. What is the probability of rolling ' + e[0] + '?', ans: ansFrac(e[1].length, 6, 'any', { show: F(e[1].length, 6) + (f.d !== 6 ? ' = ' + F(f.n, f.d) : '') }), hint: 'List the outcomes that work.',
      steps: ['Outcomes that work: ' + e[1].join(', ') + ' (' + e[1].length + ' out of 6)', 'Probability = ' + F(e[1].length, 6) + (f.d !== 6 ? ' = ' + F(f.n, f.d) : '')] };
  } });

  def({ id: 'y7-prob-exp', year: Y, topic: 'prob', tier: 2, quick: false, gen: function (r) {
    const N = r.pick([20, 25, 40, 50, 100]), k = r.int(Math.round(N * 0.3), Math.round(N * 0.7)), f = fr(k, N);
    const thing = r.pick([['A coin is flipped', 'times. It lands on heads', 'heads'], ['A drawing pin is dropped', 'times. It lands point up', 'landing point up'], ['A spinner is spun', 'times. It lands on red', 'red']]);
    return { q: thing[0] + ' ' + N + ' ' + thing[1] + ' ' + k + ' times. What is the experimental probability of ' + thing[2] + '?', ans: ansFrac(k, N, 'any', { allowDecimal: true, show: F(k, N) + ' = ' + fmt(M.clean(k / N)) }),
      hint: 'Experimental probability = number of successes ÷ number of trials.', steps: ['Experimental probability = ' + F(k, N) + (f.n !== k ? ' = ' + F(f.n, f.d) : '') + ' = ' + fmt(M.clean(k / N))] };
  } });

  def({ id: 'y7-prob-spinner', year: Y, topic: 'prob', tier: 3, quick: false, gen: function (r) {
    const N = r.pick([5, 6, 8, 10]), cols = [{ c: 0, t: 'R', w: 'red' }, { c: 1, t: 'B', w: 'blue' }, { c: 2, t: 'G', w: 'green' }, { c: 3, t: 'Y', w: 'yellow' }];
    const labs = []; for (let i = 0; i < N; i++) labs.push(r.pick(cols));
    const target = r.pick(labs), k = labs.filter(function (l) { return l === target; }).length, f = fr(k, N);
    return { q: 'This fair spinner has ' + N + ' equal sections. What is the probability that it lands on ' + target.t + ' (' + target.w + ')?', dg: DG.spinner(labs), ans: ansFrac(k, N, 'any', { allowDecimal: true, show: F(k, N) + (f.n !== k ? ' = ' + F(f.n, f.d) : '') }),
      hint: 'Count the sections labelled ' + target.t + '.', steps: [k + ' of the ' + N + ' equal sections ' + (k === 1 ? 'is ' : 'are ') + target.t + '.', 'Probability = ' + F(k, N) + (f.n !== k ? ' = ' + F(f.n, f.d) : '')] };
  } });

  /* ===== Unit 14 Position and transformation ===== */
  def({ id: 'y7-trans-dist', year: Y, topic: 'trans', tier: 1, quick: true, gen: function (r) {
    const c = r.int(-8, 8); let a = r.int(-9, 9), b = r.int(-9, 9); if (a === b) b = a + r.int(2, 6);
    const vert = r.chance(0.5), P1 = vert ? coord(c, a) : coord(a, c), P2 = vert ? coord(c, b) : coord(b, c);
    return { q: 'What is the distance between the points ' + P1 + ' and ' + P2 + '?', ans: ansNum(Math.abs(a - b)), hint: 'The ' + (vert ? x : y) + '-coordinates are the same, so subtract the other coordinates.',
      steps: ['Distance = ' + fmt(Math.max(a, b)) + ' ' + MINUS + ' ' + paren(Math.min(a, b)) + ' = ' + Math.abs(a - b) + ' units'] };
  } });

  def({ id: 'y7-trans-reflect', year: Y, topic: 'trans', tier: 2, quick: true, gen: function (r) {
    let a = r.nonZero(-7, 7), b = r.nonZero(-7, 7); if (Math.abs(a) === Math.abs(b)) b = b > 0 ? b + 1 : b - 1;
    const inX = r.chance(0.5), res = inX ? coord(a, -b) : coord(-a, b);
    return { q: 'The point ' + coord(a, b) + ' is reflected in the ' + (inX ? x : y) + '-axis. What are the coordinates of its image?', ans: ansMC(res, [inX ? coord(-a, b) : coord(a, -b), coord(-a, -b), coord(b, a)], r),
      hint: 'Reflecting in the ' + (inX ? x : y) + '-axis changes the sign of the ' + (inX ? y : x) + '-coordinate.', steps: ['The ' + (inX ? x : y) + '-coordinate stays the same; the ' + (inX ? y : x) + '-coordinate changes sign.', 'Image: ' + res] };
  } });

  def({ id: 'y7-trans-translate', year: Y, topic: 'trans', tier: 2, quick: true, gen: function (r) {
    const a = r.int(-6, 6), b = r.int(-6, 6), h = r.nonZero(-5, 5), k = r.nonZero(-5, 5);
    if (Math.abs(h) === Math.abs(k)) return null;
    const u = function (t) { return Math.abs(t) + (Math.abs(t) === 1 ? ' unit ' : ' units '); };
    const words = u(h) + (h > 0 ? 'right' : 'left') + ' and ' + u(k) + (k > 0 ? 'up' : 'down');
    return { q: 'The point ' + coord(a, b) + ' is translated ' + words + '. What are the coordinates of its image?', ans: ansMC(coord(a + h, b + k), [coord(a - h, b + k), coord(a + k, b + h), coord(a + h, b - k)], r),
      hint: 'Right/left changes the ' + x + '-coordinate; up/down changes the ' + y + '-coordinate.', steps: [x + ': ' + fmt(a) + op(h) + ' = ' + fmt(a + h), y + ': ' + fmt(b) + op(k) + ' = ' + fmt(b + k), 'Image: ' + coord(a + h, b + k)] };
  } });

  def({ id: 'y7-trans-rotate', year: Y, topic: 'trans', tier: 3, quick: false, gen: function (r) {
    let a = r.nonZero(-6, 6), b = r.nonZero(-6, 6); if (Math.abs(a) === Math.abs(b)) b = b > 0 ? b + 1 : b - 1;
    const t = r.int(0, 2), names = ['180°', '90° clockwise', '90° anticlockwise'];
    const imgs = [coord(-a, -b), coord(b, -a), coord(-b, a)];
    return { q: 'The point ' + coord(a, b) + ' is rotated ' + names[t] + ' about the origin. What are the coordinates of its image?', ans: ansMC(imgs[t], imgs.filter(function (s, i) { return i !== t; }).concat([coord(b, a), coord(a, -b)]), r),
      hint: 'Sketch the point on a grid and turn your page.', steps: [['A 180° turn changes the sign of both coordinates.', 'For 90° clockwise, (' + x + ', ' + y + ') → (' + y + ', ' + MINUS + x + ').', 'For 90° anticlockwise, (' + x + ', ' + y + ') → (' + MINUS + y + ', ' + x + ').'][t], 'Image: ' + imgs[t]] };
  } });

  def({ id: 'y7-trans-enlarge', year: Y, topic: 'trans', tier: 2, quick: true, gen: function (r) {
    const a = r.int(2, 9), b = r.int(2, 9), k = r.int(2, 5);
    if (a === b) return null;
    return { q: 'A rectangle measures ' + a + ' cm by ' + b + ' cm. It is enlarged by scale factor ' + k + '. What is the length, in cm, of the longer side of the enlarged rectangle?', ans: ansNum(k * Math.max(a, b)), hint: 'Multiply every length by the scale factor.',
      steps: ['Longer side: ' + Math.max(a, b) + ' cm', Math.max(a, b) + ' × ' + k + ' = ' + k * Math.max(a, b) + ' cm'] };
  } });

  def({ id: 'y7-trans-map', year: Y, topic: 'trans', tier: 1, quick: true, gen: function (r) {
    const k = r.pick([2, 5, 10, 20, 25, 50]), d = M.clean(r.int(2, 18) / 2);
    return { q: 'A map has a scale of 1 cm to ' + k + ' km. Two towns are ' + fmt(d) + ' cm apart on the map. What is the real distance between them, in km?', ans: ansNum(M.clean(d * k)), hint: 'Each 1 cm on the map is ' + k + ' km in real life.', steps: [fmt(d) + ' × ' + k + ' = ' + fmt(M.clean(d * k)) + ' km'] };
  } });

  /* ===== Unit 15 Shapes, area and volume ===== */
  def({ id: 'y7-area-tri', year: Y, topic: 'area', tier: 1, quick: true, gen: function (r) {
    const b = r.int(4, 16), h = r.int(3, 12), A = M.clean(b * h / 2);
    return { q: 'Find the area of the triangle, in cm².', dg: DG.triArea(b, h), ans: ansNum(A), hint: 'Area of a triangle = ½ × base × height.', steps: ['Area = ½ × ' + b + ' × ' + h, '= ' + fmt(A) + ' cm²'] };
  } });

  def({ id: 'y7-area-compound', year: Y, topic: 'area', tier: 2, quick: false, gen: function (r) {
    const W = r.int(8, 16), H = r.int(6, 14), w2 = r.int(2, W - 3), h2 = r.int(2, H - 3), A = W * H - w2 * h2;
    return { q: 'Find the area of this shape, in cm². All corners are right angles.', dg: DG.lShape(W, H, w2, h2), ans: ansNum(A), hint: 'Find the area of the big rectangle, then subtract the missing corner.',
      steps: ['Big rectangle: ' + W + ' × ' + H + ' = ' + W * H + ' cm²', 'Missing corner: (' + W + ' ' + MINUS + ' ' + (W - w2) + ') × (' + H + ' ' + MINUS + ' ' + (H - h2) + ') = ' + w2 + ' × ' + h2 + ' = ' + w2 * h2 + ' cm²', 'Area = ' + W * H + ' ' + MINUS + ' ' + w2 * h2 + ' = ' + A + ' cm²'] };
  } });

  def({ id: 'y7-area-vol', year: Y, topic: 'area', tier: 1, quick: true, gen: function (r) {
    const l = r.int(3, 12), w = r.int(2, 9), h = r.int(2, 9);
    return { q: 'Find the volume of the cuboid, in cm³.', dg: DG.cuboid(l, w, h), ans: ansNum(l * w * h), hint: 'Volume = length × width × height.', steps: ['Volume = ' + l + ' × ' + w + ' × ' + h + ' = ' + l * w * h + ' cm³'] };
  } });

  def({ id: 'y7-area-sa', year: Y, topic: 'area', tier: 2, quick: false, gen: function (r) {
    const l = r.int(3, 10), w = r.int(2, 8), h = r.int(2, 8), S = 2 * (l * w + l * h + w * h);
    return { q: 'Find the surface area of the cuboid, in cm².', dg: DG.cuboid(l, w, h), ans: ansNum(S), hint: 'A cuboid has 3 pairs of identical rectangular faces.',
      steps: ['Faces: ' + l + ' × ' + w + ' = ' + l * w + ', ' + l + ' × ' + h + ' = ' + l * h + ', ' + w + ' × ' + h + ' = ' + w * h, 'Surface area = 2 × (' + l * w + ' + ' + l * h + ' + ' + w * h + ') = ' + S + ' cm²'] };
  } });

  def({ id: 'y7-area-units', year: Y, topic: 'area', tier: 2, quick: true, gen: function (r) {
    const t = r.int(0, 4);
    if (t === 0) { const a = M.clean(r.int(1, 19) / 2); return { q: 'Convert ' + fmt(a) + ' m² to cm².', ans: ansNum(M.clean(a * 10000)), hint: '1 m² = 100 cm × 100 cm = 10 000 cm²', steps: ['1 m² = 10 000 cm²', fmt(a) + ' × 10 000 = ' + fmt(M.clean(a * 10000)) + ' cm²'] }; }
    if (t === 1) { const a = M.clean(r.int(1, 99) / 2); return { q: 'Convert ' + fmt(a) + ' cm² to mm².', ans: ansNum(M.clean(a * 100)), hint: '1 cm² = 10 mm × 10 mm = 100 mm²', steps: ['1 cm² = 100 mm²', fmt(a) + ' × 100 = ' + fmt(M.clean(a * 100)) + ' mm²'] }; }
    if (t === 2) { const a = M.clean(r.int(1, 19) / 2); return { q: 'Convert ' + fmt(a) + ' hectares to m².', ans: ansNum(M.clean(a * 10000)), hint: '1 hectare = 10 000 m²', steps: ['1 ha = 10 000 m²', fmt(a) + ' × 10 000 = ' + fmt(M.clean(a * 10000)) + ' m²'] }; }
    if (t === 3) { const b = r.pick([5000, 15000, 25000, 40000, 65000, 120000]); return { q: 'Convert ' + fmt(b) + ' cm² to m².', ans: ansNum(M.clean(b / 10000)), hint: 'Divide by 10 000.', steps: [fmt(b) + ' ÷ 10 000 = ' + fmt(M.clean(b / 10000)) + ' m²'] }; }
    const b = r.pick([450, 1200, 75, 3050, 600, 2500]);
    return { q: 'Convert ' + fmt(b) + ' mm² to cm².', ans: ansNum(M.clean(b / 100)), hint: 'Divide by 100.', steps: [fmt(b) + ' ÷ 100 = ' + fmt(M.clean(b / 100)) + ' cm²'] };
  } });

  def({ id: 'y7-area-missing', year: Y, topic: 'area', tier: 3, quick: false, gen: function (r) {
    if (r.chance(0.5)) {
      const l = r.int(3, 12), w = r.int(2, 9), h = r.int(2, 12);
      return { q: 'A cuboid has a volume of ' + l * w * h + ' cm³. Its length is ' + l + ' cm and its width is ' + w + ' cm. What is its height, in cm?', ans: ansNum(h), hint: 'Volume = length × width × height, so height = volume ÷ (length × width).',
        steps: [l + ' × ' + w + ' = ' + l * w, l * w * h + ' ÷ ' + l * w + ' = ' + h + ' cm'] };
    }
    const b = r.int(4, 16), h = r.int(3, 14), A = M.clean(b * h / 2);
    return { q: 'A triangle has an area of ' + fmt(A) + ' cm² and a base of ' + b + ' cm. What is its perpendicular height, in cm?', ans: ansNum(h), hint: 'Area = ½ × base × height, so height = 2 × area ÷ base.',
      steps: ['2 × ' + fmt(A) + ' = ' + fmt(2 * A), fmt(2 * A) + ' ÷ ' + b + ' = ' + h + ' cm'] };
  } });

  /* ===== Unit 16 Interpreting results ===== */
  function dataset(r, k, lo, hi) { const d = []; for (let i = 0; i < k; i++) d.push(r.int(lo, hi)); return d; }
  M.dataset = dataset;
  def({ id: 'y7-stats-range', year: Y, topic: 'stats', tier: 1, quick: true, gen: function (r) {
    const d = dataset(r, r.int(5, 7), 2, 40), mx = Math.max.apply(null, d), mn = Math.min.apply(null, d);
    return { q: 'Find the range of these numbers:<br><b>' + d.join(', ') + '</b>', ans: ansNum(mx - mn), hint: 'Range = largest − smallest.', steps: ['Largest = ' + mx + ', smallest = ' + mn, 'Range = ' + mx + ' ' + MINUS + ' ' + mn + ' = ' + (mx - mn)] };
  } });

  def({ id: 'y7-stats-mode', year: Y, topic: 'stats', tier: 1, quick: true, gen: function (r) {
    const base = r.sample([3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 5), m = base[0], d = r.shuffle(base.concat([m, m]).concat(r.chance(0.5) ? [base[1]] : []));
    return { q: 'Find the mode of these numbers:<br><b>' + d.join(', ') + '</b>', ans: ansNum(m), hint: 'The mode is the number that appears most often.', steps: [m + ' appears ' + d.filter(function (t) { return t === m; }).length + ' times, more than any other number.', 'Mode = ' + m] };
  } });

  def({ id: 'y7-stats-median', year: Y, topic: 'stats', tier: 2, quick: false, gen: function (r) {
    const k = r.int(5, 8), d = dataset(r, k, 1, 30), s = d.slice().sort(function (a, b) { return a - b; });
    const med = k % 2 ? s[(k - 1) / 2] : M.clean((s[k / 2 - 1] + s[k / 2]) / 2);
    return { q: 'Find the median of these numbers:<br><b>' + d.join(', ') + '</b>', ans: ansNum(med), hint: 'Put the numbers in order first.',
      steps: ['In order: ' + s.join(', '), k % 2 ? 'The middle number is ' + med + '.' : 'The middle two are ' + s[k / 2 - 1] + ' and ' + s[k / 2] + '. Median = (' + s[k / 2 - 1] + ' + ' + s[k / 2] + ') ÷ 2 = ' + fmt(med)] };
  } });

  def({ id: 'y7-stats-mean', year: Y, topic: 'stats', tier: 2, quick: false, gen: function (r) {
    const k = r.int(4, 6), mean = r.int(5, 20), d = [];
    for (let i = 0; i < k - 1; i++) d.push(mean + r.int(-6, 6));
    const last = mean * k - d.reduce(function (a, b) { return a + b; }, 0);
    if (last < 1 || last > 40) return null;
    d.push(last);
    const dd = r.shuffle(d);
    return { q: 'Find the mean of these numbers:<br><b>' + dd.join(', ') + '</b>', ans: ansNum(mean), hint: 'Add them all up, then divide by how many there are.', steps: ['Total = ' + dd.join(' + ') + ' = ' + mean * k, 'Mean = ' + mean * k + ' ÷ ' + k + ' = ' + mean] };
  } });

  def({ id: 'y7-stats-missing', year: Y, topic: 'stats', tier: 3, quick: false, gen: function (r) {
    const k = r.int(4, 6), mean = r.int(6, 15), d = [];
    for (let i = 0; i < k - 1; i++) d.push(mean + r.int(-5, 5));
    const last = mean * k - d.reduce(function (a, b) { return a + b; }, 0);
    if (last < 1 || last > 30) return null;
    return { q: 'The mean of ' + k + ' numbers is ' + mean + '. ' + (k - 1) + ' of the numbers are ' + d.join(', ') + '. What is the missing number?', ans: ansNum(last), hint: 'Mean × how many numbers = the total.',
      steps: ['Total = ' + mean + ' × ' + k + ' = ' + mean * k, 'Known numbers add to ' + (mean * k - last), 'Missing number = ' + mean * k + ' ' + MINUS + ' ' + (mean * k - last) + ' = ' + last] };
  } });

  def({ id: 'y7-stats-pie', year: Y, topic: 'stats', tier: 2, quick: false, gen: function (r) {
    const N = r.pick([36, 40, 60, 72, 90, 120]), per = 360 / N;
    const sports = r.sample(['Football', 'Badminton', 'Netball', 'Swimming', 'Basketball', 'Athletics'], 4);
    const c = [r.int(Math.round(N * 0.15), Math.round(N * 0.35)), r.int(Math.round(N * 0.1), Math.round(N * 0.3)), r.int(Math.round(N * 0.1), Math.round(N * 0.25))];
    const lastC = N - c[0] - c[1] - c[2];
    if (lastC < N * 0.08) return null;
    c.push(lastC);
    const secs = c.map(function (k, i) { return { deg: M.clean(k * per), name: sports[i] }; });
    const i = r.int(0, 3);
    return { q: 'The pie chart shows the favourite sports of ' + N + ' students. How many students chose ' + sports[i].toLowerCase() + '?', dg: DG.pie(secs), ans: ansNum(c[i]), hint: 'Each student is worth 360° ÷ ' + N + ' = ' + fmt(per) + '°.',
      steps: ['360° ÷ ' + N + ' = ' + fmt(per) + '° per student', fmt(secs[i].deg) + '° ÷ ' + fmt(per) + '° = ' + c[i] + ' students'] };
  } });

})(typeof module !== 'undefined' && module.exports ? require('./q-core.js') : window.MSD);

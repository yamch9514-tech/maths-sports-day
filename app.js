/* Maths Sports Day — game app. Everything runs on the student's own phone; progress is saved in this browser only. */
(function () {
  'use strict';
  var M = window.MSD;
  var app = document.getElementById('app');

  /* ---------------- Saved progress ---------------- */
  var KEY = 'maths-sports-day-v1';
  function blank() { return { name: '', cls: 0, year: 7, sound: true, vibrate: true, xp: 0, medals: { gold: 0, silver: 0, bronze: 0 }, pb: {}, topics: {}, races: 0 }; }
  function load() {
    try { var raw = localStorage.getItem(KEY); if (raw) { var o = JSON.parse(raw); var b = blank(); for (var k in o) b[k] = o[k]; return b; } } catch (e) { /* storage unavailable */ }
    return blank();
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } }
  var S = load();

  var CLASSES = { 7: 'J1T', 8: 'J2T', 9: 'J3T' };
  var EVENTS = {
    sprint: { name: '100 m Sprint', icon: '⚡\uFE0F', ic: 's', code: 'S', blurb: 'Race through 10 quick questions. Beat your best time!' },
    hurdles: { name: 'Hurdles', icon: '🚧', ic: 'h', code: 'H', blurb: 'Pick one topic. Clear 10 hurdles, with hints and worked solutions.' },
    relay: { name: '4 × 100 m Relay', icon: '🏁', ic: 'r', code: 'R', blurb: 'Mixed revision: 4 legs covering Number, Algebra, Geometry and Statistics.' },
    marathon: { name: 'Marathon', icon: '🏃', ic: 'm', code: 'M', blurb: '1 km for every correct answer. 3 lives. Can you finish all 42 km?' }
  };
  var CODE_EVENT = { S: 'sprint', R: 'relay', M: 'marathon' };
  var LEVELS = [[0, 'Rookie'], [150, 'Club Runner'], [400, 'County Athlete'], [800, 'National Star'], [1500, 'Champion'], [3000, 'Legend']];
  var TIERS = { 1: ['t1', '🥉 Bronze'], 2: ['t2', '🥈 Silver'], 3: ['t3', '🥇 Gold'] };
  var MEDAL_ICON = { gold: '🥇', silver: '🥈', bronze: '🥉', finisher: '🎽', dnf: '💪' };
  var WORDS = ['TIGER', 'MANGO', 'DURIAN', 'KANCIL', 'TAPIR', 'EAGLE', 'COMET', 'ROCKET', 'THUNDER', 'LOTUS', 'BATIK', 'SATAY', 'PAPAYA', 'HORNBILL', 'TURTLE', 'MONSOON', 'RAINBOW', 'FALCON', 'PANTHER', 'ORBIT'];

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmtTime(ms) { var s = ms / 1000; if (s < 60) return s.toFixed(1) + ' s'; var m = Math.floor(s / 60); var r = s - m * 60; return m + ':' + (r < 10 ? '0' : '') + r.toFixed(1); }
  function levelOf(xp) { var cur = LEVELS[0], next = null; for (var i = 0; i < LEVELS.length; i++) { if (xp >= LEVELS[i][0]) { cur = LEVELS[i]; next = LEVELS[i + 1] || null; } } return { name: cur[1], from: cur[0], to: next ? next[0] : null, nextName: next ? next[1] : null }; }
  function pbKey(year, ev) { return year + '-' + ev; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* ---------------- Sound & vibration ---------------- */
  var AC = null;
  function tone(freqs, dur, type, vol) {
    if (!S.sound) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === 'suspended') AC.resume();
      var t = AC.currentTime;
      freqs.forEach(function (f, i) {
        var o = AC.createOscillator(), g = AC.createGain();
        o.type = type || 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t + i * dur);
        g.gain.exponentialRampToValueAtTime(vol || 0.12, t + i * dur + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t + (i + 1) * dur);
        o.connect(g); g.connect(AC.destination);
        o.start(t + i * dur); o.stop(t + (i + 1) * dur + 0.03);
      });
    } catch (e) { /* no audio */ }
  }
  var SFX = {
    ok: function () { tone([660, 990], 0.08); },
    bad: function () { tone([220, 160], 0.13, 'square', 0.05); if (S.vibrate && navigator.vibrate) navigator.vibrate(120); },
    tick: function () { tone([620], 0.08, 'sine', 0.07); },
    go: function () { tone([1100], 0.16, 'square', 0.07); },
    win: function () { tone([523, 659, 784, 1047], 0.11); },
    water: function () { tone([880, 1175], 0.09); }
  };

  /* ---------------- Screens & navigation ---------------- */
  var current = '';
  function view(id, html) {
    current = id;
    app.innerHTML = '<section class="screen" id="' + id + '">' + html + '</section>';
    window.scrollTo(0, 0);
    if (id !== 'home' && id !== 'welcome') { try { history.pushState({ s: id }, ''); } catch (e) { /* ignore */ } }
  }
  window.addEventListener('popstate', function () {
    if (run && !run.done) { askQuit(); try { history.pushState({ s: 'play' }, ''); } catch (e) { /* ignore */ } return; }
    closeOverlay();
    if (S.name) home(); else welcome();
  });
  function toast(msg, ms) {
    var t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, ms || 1800);
  }
  var overlayEl = null;
  function overlay(html, onClickOutside) {
    closeOverlay();
    overlayEl = document.createElement('div'); overlayEl.className = 'overlay'; overlayEl.innerHTML = html;
    if (onClickOutside) overlayEl.addEventListener('click', function (e) { if (e.target === overlayEl) onClickOutside(); });
    document.body.appendChild(overlayEl);
    return overlayEl;
  }
  function closeOverlay() { if (overlayEl) { overlayEl.remove(); overlayEl = null; } }

  /* ---------------- Welcome ---------------- */
  var pendingCls = 0;
  function welcome() {
    pendingCls = S.cls || 0;
    view('welcome',
      '<div class="hero"><span class="medal">🏅</span><h1>Maths<br>Sports Day</h1><p>Race, jump and relay your way through Year 7–9 maths.</p></div>' +
      '<div class="card"><h2>Ready, athlete?</h2>' +
      '<div class="field"><label for="nm">Your name or nickname</label><input id="nm" class="input" maxlength="20" autocomplete="nickname" value="' + esc(S.name) + '" placeholder="e.g. Aisha"></div>' +
      '<div class="field"><label>Your class</label><div class="choices">' +
      [7, 8, 9].map(function (y) { return '<button class="choice' + (pendingCls === y ? ' on' : '') + '" data-act="pickcls" data-y="' + y + '"><span class="big">' + CLASSES[y] + '</span><span>Year ' + y + '<br><small>Cambridge Stage ' + y + '</small></span></button>'; }).join('') +
      '</div></div>' +
      '<button class="btn block" data-act="join">Let’s go! 🏃</button>' +
      '<p class="note">Your name and scores are saved only on this phone. Nothing is sent anywhere.</p></div>');
  }

  /* ---------------- Home ---------------- */
  function home() {
    run = null;
    var lv = levelOf(S.xp), pct = lv.to ? Math.round((S.xp - lv.from) / (lv.to - lv.from) * 100) : 100;
    var y = S.year;
    function pbText(ev) {
      var p = S.pb[pbKey(y, ev)];
      if (ev === 'hurdles') { var n = M.TOPICS[y].filter(function (t) { return (S.topics[y + '-' + t.id] || 0) >= 9; }).length; return n ? '🥇 ' + n + ' of ' + M.TOPICS[y].length + ' topics golden' : '16 topics to master'.replace('16', M.TOPICS[y].length); }
      if (!p) return 'No record yet';
      if (ev === 'marathon') return '⭐ Best: ' + p.km + ' km';
      return '⭐ Best: ' + fmtTime(p.time);
    }
    var evs = ['sprint', 'hurdles', 'relay', 'marathon'].map(function (k) {
      var e = EVENTS[k];
      return '<button class="event" data-act="event" data-ev="' + k + '"><span class="ic ' + e.ic + '">' + e.icon + '</span><span><h3>' + e.name + '</h3><p>' + e.blurb + '</p><span class="pb">' + pbText(k) + '</span></span></button>';
    }).join('');
    view('home',
      '<div class="topbar"><div class="hello"><h1>Hi, ' + esc(S.name) + '!</h1><small>' + (S.cls ? CLASSES[S.cls] + ' · ' : '') + lv.name + ' · ' + S.xp + ' XP</small></div>' +
      '<button class="chip" data-act="year" aria-label="Change question level">Year ' + y + ' ▾</button></div>' +
      '<div class="xpbar" aria-hidden="true"><i style="width:' + pct + '%"></i></div>' +
      '<div class="levelrow"><span>' + lv.name + '</span><span>' + (lv.to ? (lv.to - S.xp) + ' XP to ' + lv.nextName : 'Top level!') + '</span></div>' +
      '<div class="events">' + evs +
      '<button class="event" data-act="challenge"><span class="ic c">🎟️</span><span><h3>Class Challenge</h3><p>Got a code from your teacher? Everyone gets the same questions.</p></span></button></div>' +
      '<div class="homefoot"><button class="btn ghost" data-act="trophies">🏆 Trophies</button><button class="btn ghost" data-act="settings">⚙️ Settings</button><button class="btn ghost" data-act="teacher">🧑‍🏫 Teacher</button></div>' +
      '<p class="note" style="text-align:center">Tip: keep paper and a pencil next to you for working out.</p>');
  }

  function chooseYear() {
    overlay('<div class="sheet" role="dialog" aria-label="Choose question level"><h2>Question level</h2><p class="note" style="margin-top:0">Your class is ' + (S.cls ? CLASSES[S.cls] : '—') + '. You can also practise another year’s questions.</p><div class="choices" style="margin-top:12px">' +
      [7, 8, 9].map(function (y) { return '<button class="choice' + (S.year === y ? ' on' : '') + '" data-act="setyear" data-y="' + y + '"><span class="big">Y' + y + '</span><span>Year ' + y + ' (' + CLASSES[y] + ')<br><small>Learner’s Book ' + y + '</small></span></button>'; }).join('') +
      '</div><div class="row"><button class="btn ghost" data-act="close">Close</button></div></div>', closeOverlay);
  }

  /* ---------------- Hurdles topic list ---------------- */
  function topics() {
    var y = S.year;
    var list = M.TOPICS[y].map(function (t) {
      var best = S.topics[y + '-' + t.id] || 0, st = best >= 9 ? '🥇' : best >= 7 ? '🥈' : best >= 5 ? '🥉' : '';
      var n = M.GENS.filter(function (g) { return g.year === y && g.topic === t.id; }).length;
      return '<button class="topic" data-act="starthurdles" data-t="' + t.id + '"><span class="u">Unit<b>' + t.unit + '</b></span><span class="n">' + t.name + '<span class="strandtag">' + M.STRANDS[t.strand] + ' · ' + n + ' question types' + (best ? ' · best ' + best + '/10' : '') + '</span></span><span class="st">' + st + '</span></button>';
    }).join('');
    view('topics', '<div class="playbar"><button class="iconbtn" data-act="home" aria-label="Back">←</button><div class="title">🚧 Hurdles<small>Year ' + y + ' · Learner’s Book ' + y + ' units</small></div><span></span></div>' +
      '<p class="note">Choose a topic. You’ll get 10 hurdles that get harder: 🥉 Bronze, then 🥈 Silver, then 🥇 Gold. Hints are free!</p><div class="topics">' + list + '</div>');
  }

  /* ---------------- Class Challenge ---------------- */
  function parseCode(raw) {
    var c = String(raw || '').toUpperCase().replace(/\s+/g, '').replace(/[–—]/g, '-');
    var m = c.match(/^([789])([SRM])-?([A-Z0-9]{2,12})$/);
    if (!m) return null;
    return { year: +m[1], event: CODE_EVENT[m[2]], code: m[1] + m[2] + '-' + m[3] };
  }
  function challenge() {
    view('challenge', '<div class="playbar"><button class="iconbtn" data-act="home" aria-label="Back">←</button><div class="title">🎟️ Class Challenge<small>Same questions for everyone</small></div><span></span></div>' +
      '<div class="card"><h2>Enter your code</h2><p class="note" style="margin-top:0">Your teacher will show a code like <b>8R-TIGER42</b>.</p>' +
      '<div class="field"><input id="code" class="input" style="text-transform:uppercase;font-family:var(--font-display);font-weight:800;font-size:26px;letter-spacing:1px;text-align:center" maxlength="16" autocapitalize="characters" autocomplete="off" spellcheck="false" placeholder="8R-TIGER42"></div>' +
      '<div id="codemsg" class="note" role="status"></div>' +
      '<button class="btn block" data-act="startcode" style="margin-top:12px">Start challenge</button></div>');
    var inp = document.getElementById('code');
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') startFromCode(); });
    setTimeout(function () { inp.focus(); }, 50);
  }
  function startFromCode() {
    var inp = document.getElementById('code'), c = parseCode(inp && inp.value);
    if (!c) { document.getElementById('codemsg').innerHTML = '<span style="color:var(--bad);font-weight:700">That code doesn’t look right.</span> It should start with 7, 8 or 9, then S, R or M, e.g. 8R-TIGER42.'; SFX.bad(); return; }
    startRun({ event: c.event, year: c.year, code: c.code });
  }

  /* ---------------- The race engine ---------------- */
  var run = null, ticker = null;
  function now() { return (window.performance && performance.now) ? performance.now() : Date.now(); }
  function elapsed() { return run.acc + (run.paused ? 0 : now() - run.since); }
  function pauseClock() { if (!run.paused) { run.acc += now() - run.since; run.paused = true; } }
  function resumeClock() { if (run.paused) { run.since = now(); run.paused = false; } }

  function startRun(o) {
    closeOverlay();
    var seed = o.code ? M.hashStr(o.code) : (Math.floor(Math.random() * 4294967295) >>> 0);
    run = { event: o.event, year: o.year, topic: o.topic || null, code: o.code || null, rng: M.makeRng(seed),
      attempt: 0, answered: 0, correct: 0, wrong: 0, log: [], recent: [], seen: {}, streak: 0, bestStreak: 0,
      lives: 3, km: 0, acc: 0, since: 0, paused: true, penalty: 0, hints: 0, done: false, q: null, input: '', locked: false };
    renderPlay();
    countdown(function () { resumeClock(); nextQuestion(); startTicker(); });
  }

  function countdown(done) {
    var steps = ['On your marks…', 'Get set…', 'GO!'], i = 0;
    var el = overlay('<div class="countdown" aria-live="assertive"></div>');
    var box = el.querySelector('.countdown');
    function step() {
      if (!run) return;
      if (i < steps.length) {
        box.innerHTML = steps[i] + (i === 0 ? '<small>' + EVENTS[run.event].name + ' · Year ' + run.year + (run.code ? ' · ' + run.code : '') + '</small>' : '');
        box.style.animation = 'none'; void box.offsetWidth; box.style.animation = '';
        if (i === 2) SFX.go(); else SFX.tick();
        i++; setTimeout(step, i === 3 ? 450 : 650);
      } else { closeOverlay(); done(); }
    }
    step();
  }

  function startTicker() {
    stopTicker();
    ticker = setInterval(function () { if (run && !run.done) updateStat(); }, 100);
  }
  function stopTicker() { if (ticker) { clearInterval(ticker); ticker = null; } }

  function tiersFor() {
    var i = run.attempt;
    if (run.event === 'sprint') return i < 3 ? [1] : [1, 2];
    if (run.event === 'hurdles') return [[1], [1], [1], [2], [2], [2], [2], [3], [3], [3]][i] || [2, 3];
    if (run.event === 'relay') return [[1], [2], [3]][i % 3];
    return i < 7 ? [1] : i < 20 ? [1, 2] : i < 35 ? [2, 3] : [3];
  }
  function newQuestion() {
    var f = { year: run.year, tiers: tiersFor() };
    if (run.event === 'sprint') f.quick = true;
    if (run.event === 'hurdles') f.topics = [run.topic];
    if (run.event === 'relay') f.strand = ['N', 'A', 'G', 'S'][Math.floor(run.attempt / 3) % 4];
    var q = null;
    for (var tries = 0; tries < 6; tries++) {
      q = M.pick(run.rng, f, run.recent);
      var key = q.q + '|' + (q.ans.options ? q.ans.options.join('|') : '') + '|' + (q.dg || '');
      if (!run.seen[key]) { run.seen[key] = 1; break; }
    }
    run.recent.push(q.gen);
    var keep = Math.max(1, Math.min(6, Math.floor(M.pool({ year: run.year, topics: f.topics, strand: f.strand, quick: f.quick }).length / 2)));
    while (run.recent.length > keep) run.recent.shift();
    run.attempt++;
    return q;
  }

  function progress() {
    if (run.event === 'sprint') return run.correct / 10;
    if (run.event === 'hurdles') return run.answered / 10;
    if (run.event === 'relay') return run.answered / 12;
    return run.km / 42;
  }

  function renderPlay() {
    var e = EVENTS[run.event];
    var sub = 'Year ' + run.year + (run.code ? ' · ' + run.code : run.topic ? ' · ' + M.topicOf(run.year, run.topic).name : '');
    var marks = '';
    if (run.event === 'relay') marks = '<span class="ticks"><span>Leg 1</span><span>Leg 2</span><span>Leg 3</span><span>Leg 4</span></span>';
    if (run.event === 'marathon') marks = [7, 14, 21, 28, 35].map(function (k) { return '<span class="flag" style="left:calc((100% - 30px) * ' + (k / 42) + ' + 8px)">' + (k === 21 ? '🚩' : '💧') + '</span>'; }).join('');
    if (run.event === 'hurdles') marks = '<span class="ticks">' + new Array(11).join('<span>▮</span>') + '</span>';
    view('play',
      '<div class="playbar"><button class="iconbtn" data-act="quit" aria-label="Quit race">✕</button><div class="title">' + e.icon + ' ' + e.name + '<small id="sub">' + esc(sub) + '</small></div><div class="stat" id="stat"></div></div>' +
      '<div class="track" aria-hidden="true">' + marks + '<span class="runner" id="runner">🏃</span></div>' +
      '<div id="qwrap"></div>');
    updateStat(); moveRunner();
  }
  function moveRunner() { var r = document.getElementById('runner'); if (r) r.style.left = 'calc((100% - 34px) * ' + Math.min(1, progress()) + ')'; }
  function updateStat() {
    var el = document.getElementById('stat'); if (!el || !run) return;
    if (run.event === 'marathon') el.innerHTML = '<span class="lives" aria-label="' + run.lives + ' lives">' + new Array(run.lives + 1).join('❤️') + new Array(4 - run.lives).join('🤍') + '</span><br><small>' + run.km + ' km</small>';
    else if (run.event === 'hurdles') el.innerHTML = Math.min(run.answered + 1, 10) + '<small style="font-size:14px">/10</small>';
    else el.textContent = fmtTime(elapsed());
  }

  function nextQuestion() {
    if (!run || run.done) return;
    if (run.event === 'relay' && run.answered > 0 && run.answered % 3 === 0 && !run.batonShown) {
      run.batonShown = true;
      var leg = run.answered / 3 + 1, names = ['Number', 'Algebra', 'Geometry & measure', 'Statistics & probability'];
      pauseClock();
      var thisRun = run, baton = overlay('<div class="countdown">Baton pass! 🏃<small>Leg ' + leg + ' of 4 · ' + names[leg - 1] + '</small></div>');
      SFX.tick();
      setTimeout(function () {
        if (run !== thisRun || run.done) return;
        if (overlayEl === baton) { closeOverlay(); resumeClock(); nextQuestion(); }
        else run.batonPending = true;
      }, 1100);
      return;
    }
    run.batonShown = false;
    run.q = newQuestion(); run.input = ''; run.locked = false; run.hintShown = false;
    renderQuestion();
  }

  function qBody(q) {
    return '<div class="qtext">' + q.q + '</div>' + (q.dg ? '<div class="qdg">' + q.dg + '</div>' : '');
  }
  function renderQuestion() {
    var q = run.q, t = TIERS[q.tier];
    var sub = document.getElementById('sub');
    if (sub && run.event !== 'hurdles') sub.textContent = 'Year ' + run.year + ' · Question ' + run.attempt + (run.code ? ' · ' + run.code : '');
    var hintUI = run.event === 'hurdles' ? '<div class="hintrow"><button class="btn ghost small" data-act="hint">💡 Hint</button><small>Hurdle ' + run.attempt + ' of 10</small></div><div id="hintbox"></div>' : '';
    var html = '<div class="qcard" id="qcard"><div class="qmeta"><span>Unit ' + q.unit + ' · ' + q.topicName + '</span><span class="tier ' + t[0] + '">' + t[1] + '</span></div>' + qBody(q) + hintUI + '</div>';
    html += '<div class="answer" id="answer">';
    if (q.ans.type === 'mc') {
      html += '<div class="options" role="group" aria-label="Answer options">' + q.ans.options.map(function (o, i) {
        return '<button class="opt" data-act="mc" data-i="' + i + '"><span class="l">' + 'ABCD'[i] + '</span><span>' + o + '</span></button>';
      }).join('') + '</div>';
    } else {
      html = html.replace('<div class="answer" id="answer">', '<div class="answer sticky" id="answer">');
      html += '<div class="display" id="display" aria-live="polite"></div>';
      if (q.ans.frac) html += '<p class="note" style="text-align:center;margin:6px 0 0">Fraction: type 3 / 4 · Mixed number: 2 ␣ 1 / 3</p>';
      html += '<div class="keypad">' + ['7', '8', '9', 'del', '4', '5', '6', 'neg', '1', '2', '3', '/', '0', '.', 'sp', 'go'].map(function (k) {
        if (k === 'del') return '<button class="key fn" data-act="key" data-k="del" aria-label="Delete">⌫</button>';
        if (k === 'neg') return '<button class="key fn" data-act="key" data-k="neg" aria-label="Minus sign">−</button>';
        if (k === 'sp') return '<button class="key fn" data-act="key" data-k=" " aria-label="Space (for mixed numbers)">␣<small>space</small></button>';
        if (k === 'go') return '<button class="key go" data-act="key" data-k="go" aria-label="Submit answer">GO</button>';
        return '<button class="key' + (k === '/' || k === '.' ? ' fn' : '') + '" data-act="key" data-k="' + k + '">' + k + '</button>';
      }).join('') + '</div>';
    }
    html += '</div>';
    html += '<div id="fb" aria-live="polite"></div>';
    document.getElementById('qwrap').innerHTML = html;
    drawDisplay();
    var card = document.getElementById('qcard'); if (card) card.scrollIntoView({ block: 'nearest' });
    updateStat();
  }
  function drawDisplay() {
    var d = document.getElementById('display'); if (!d) return;
    d.innerHTML = run.input ? esc(run.input.replace(/-/g, '−')) + '<span class="caret"></span>' : '<span class="ph">Type your answer</span>';
  }
  function key(k) {
    if (!run || run.locked || !run.q || run.q.ans.type !== 'num') return;
    if (k === 'go') { submit(run.input); return; }
    if (k === 'del') run.input = run.input.slice(0, -1);
    else if (k === 'neg') run.input = run.input.charAt(0) === '-' ? run.input.slice(1) : '-' + run.input;
    else if (run.input.length < 14) {
      var t = run.input, last = t.slice(-1), part = t.split(/[ \/]/).pop();
      if (k === ' ' && (!/[0-9]$/.test(t) || t.indexOf(' ') >= 0 || t.indexOf('/') >= 0 || t.indexOf('.') >= 0)) return;
      if (k === '/' && (!/[0-9]$/.test(t) || t.indexOf('/') >= 0 || t.indexOf('.') >= 0)) return;
      if (k === '.' && (part.indexOf('.') >= 0 || t.indexOf('/') >= 0 || t.indexOf(' ') >= 0)) return;
      if (/[0-9]/.test(k) && last === '0' && (part === '0') && k !== '.') { /* allow leading zero replacement */ run.input = t.slice(0, -1); }
      run.input += k;
    }
    drawDisplay();
  }

  function givenText(q, v) {
    if (q.ans.type === 'mc') return q.ans.options[v];
    return esc(String(v).replace(/-/g, '−'));
  }

  function submit(value) {
    if (!run || run.locked || run.done) return;
    var q = run.q;
    if (q.ans.type === 'num' && String(value).trim() === '') { toast('Type an answer first'); return; }
    var res = M.check(q.ans, value);
    if (res.invalid) { toast('Check your answer — ' + res.msg.toLowerCase()); return; }
    run.locked = true;
    pauseClock();
    var ok = res.correct;
    run.answered++;
    run.log.push({ q: q, given: givenText(q, value), ok: ok, msg: res.msg || '' });
    var extra = '';
    if (ok) {
      run.correct++; run.streak++; run.bestStreak = Math.max(run.bestStreak, run.streak);
      if (run.event === 'marathon') {
        run.km++;
        if (run.km % 7 === 0 && run.km < 42) {
          if (run.lives < 3) { run.lives++; extra = '💧 Water station! +1 life'; SFX.water(); }
          else extra = '💧 Water station at ' + run.km + ' km';
        }
        if (run.km === 21) extra = '🚩 Half marathon!';
      }
      SFX.ok();
    } else {
      run.wrong++; run.streak = 0;
      if (run.event === 'sprint') { run.acc += 3000; run.penalty += 3000; }
      if (run.event === 'relay') { run.acc += 10000; run.penalty += 10000; }
      if (run.event === 'marathon') run.lives--;
      SFX.bad();
    }
    moveRunner(); updateStat();
    showFeedback(ok, res, extra);
  }

  function isOver() {
    if (run.event === 'sprint') return run.correct >= 10 || run.answered >= 25;
    if (run.event === 'hurdles') return run.answered >= 10;
    if (run.event === 'relay') return run.answered >= 12;
    return run.lives <= 0 || run.km >= 42;
  }

  function showFeedback(ok, res, extra) {
    var q = run.q, card = document.getElementById('qcard'), fb = document.getElementById('fb');
    if (card) { card.className = 'qcard ' + (ok ? 'ok' : 'bad'); var hb = card.querySelector('[data-act="hint"]'); if (hb) hb.disabled = true; }
    if (q.ans.type === 'num') { var ansEl = document.getElementById('answer'); if (ansEl) { ansEl.className = 'answer'; ansEl.innerHTML = '<div class="display ' + (ok ? 'good' : 'wrongans') + '">' + run.log[run.log.length - 1].given + '</div>'; } }
    if (q.ans.type === 'mc') {
      var btns = document.querySelectorAll('.opt');
      btns.forEach(function (b, i) { b.disabled = true; if (i === q.ans.correct) b.classList.add('right'); });
      var chosen = run.log[run.log.length - 1];
      if (!ok) btns.forEach(function (b, i) { if (q.ans.options[i] === chosen.given) b.classList.add('wrong'); });
    }
    var over = isOver();
    var streakTxt = ok && run.streak >= 3 ? ' <small>🔥 ' + run.streak + ' in a row</small>' : '';
    var penaltyTxt = !ok && run.event === 'sprint' ? ' <small>+3 s</small>' : !ok && run.event === 'relay' ? ' <small>+10 s</small>' : !ok && run.event === 'marathon' ? ' <small>−1 life</small>' : '';
    var steps = '<ol class="steps">' + q.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>';
    var html;
    if (ok) {
      html = '<div class="feedback ok"><h3>✅ ' + pick(['Correct!', 'Nice!', 'Great jump!', 'Spot on!', 'Brilliant!']) + streakTxt + '</h3>' + (extra ? '<div class="ans">' + extra + '</div>' : '') + '</div>';
    } else {
      html = '<div class="feedback ' + (res.near ? 'near' : 'bad') + '"><h3>' + (res.near ? '🤏 So close' : '❌ Not quite') + penaltyTxt + '</h3>' +
        (res.msg ? '<div class="ans">' + res.msg + '</div>' : '') +
        '<div class="ans">Answer: <b>' + q.ans.show + '</b></div>' + (run.event === 'sprint' ? '' : steps) +
        '<button class="btn block navy" data-act="next">' + (over ? 'See results' : run.event === 'hurdles' ? 'Next hurdle →' : 'Keep going →') + '</button></div>';
    }
    fb.innerHTML = html;
    if (!ok) { var b = fb.querySelector('button'); if (b) b.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
    var auto = ok ? (extra ? 1100 : run.event === 'hurdles' ? 800 : 550) : (run.event === 'sprint' ? 1800 : 0);
    if (auto) run.autoNext = setTimeout(advance, auto);
  }

  function advance() {
    if (!run || run.done) return;
    clearTimeout(run.autoNext);
    if (isOver()) { finish(); return; }
    resumeClock();
    nextQuestion();
  }

  function showHint() {
    if (!run || !run.q || run.hintShown) return;
    run.hintShown = true; run.hints++;
    var hb = document.getElementById('hintbox');
    if (hb) hb.innerHTML = '<div class="hint"><b>Hint:</b> ' + run.q.hint + '</div>';
  }

  function askQuit() {
    if (!run) return;
    var wasPaused = run.paused; pauseClock();
    overlay('<div class="sheet" role="dialog" aria-label="Quit?"><h2>Leave the race?</h2><p>Your progress in this race won’t be saved.</p><div class="row"><button class="btn ghost" data-act="stay" data-p="' + (wasPaused ? 1 : 0) + '">Keep racing</button><button class="btn" data-act="leave">Leave</button></div></div>');
  }

  /* ---------------- Results ---------------- */
  function medalFor(r) {
    if (r.event === 'sprint') { if (r.correct < 10) return 'dnf'; return r.time <= 60000 ? 'gold' : r.time <= 90000 ? 'silver' : r.time <= 130000 ? 'bronze' : 'finisher'; }
    if (r.event === 'hurdles') return r.correct >= 9 ? 'gold' : r.correct >= 7 ? 'silver' : r.correct >= 5 ? 'bronze' : 'finisher';
    if (r.event === 'relay') return r.correct >= 11 ? 'gold' : r.correct >= 9 ? 'silver' : r.correct >= 7 ? 'bronze' : 'finisher';
    return r.km >= 42 ? 'gold' : r.km >= 21 ? 'silver' : r.km >= 10 ? 'bronze' : 'finisher';
  }
  function finish() {
    stopTicker(); pauseClock(); run.done = true;
    var r = { event: run.event, year: run.year, code: run.code, topic: run.topic, correct: run.correct, answered: run.answered, time: Math.round(elapsed()), km: run.km, penalty: run.penalty, bestStreak: run.bestStreak };
    var medal = medalFor(r), isPB = false, k = pbKey(r.year, r.event), old = S.pb[k];
    if (r.event === 'sprint' && r.correct >= 10 && (!old || r.time < old.time)) { S.pb[k] = { time: r.time }; isPB = true; }
    if (r.event === 'relay' && (!old || r.time < old.time)) { S.pb[k] = { time: r.time, correct: r.correct }; isPB = true; }
    if (r.event === 'marathon' && (!old || r.km > old.km) && r.km > 0) { S.pb[k] = { km: r.km }; isPB = true; }
    if (r.event === 'hurdles') { var tk = r.year + '-' + r.topic; if (S.topics[tk] === undefined || S.topics[tk] < r.correct) { isPB = r.correct > (S.topics[tk] || 0); S.topics[tk] = r.correct; } }
    var gold = run.log.filter(function (l) { return l.ok && l.q.tier === 3; }).length;
    var xp = r.correct * 10 + gold * 5 + ({ gold: 50, silver: 30, bronze: 15 }[medal] || 0) + (isPB ? 20 : 0);
    var lvBefore = levelOf(S.xp).name;
    S.xp += xp; S.races++;
    if (S.medals[medal] !== undefined) S.medals[medal]++;
    save();
    var lvAfter = levelOf(S.xp).name;
    if (medal === 'gold' || medal === 'silver' || medal === 'bronze') SFX.win();
    renderResult(r, medal, isPB, xp, lvBefore !== lvAfter ? lvAfter : null);
  }

  function renderResult(r, medal, isPB, xp, levelUp) {
    var titles = { gold: 'Gold medal!', silver: 'Silver medal!', bronze: 'Bronze medal!', finisher: 'You finished!', dnf: 'Good effort!' };
    var head, stats;
    if (r.event === 'sprint') { head = r.correct >= 10 ? fmtTime(r.time) : r.correct + ' / 10 correct'; stats = [[r.correct + '/' + r.answered, 'correct'], [fmtTime(r.penalty), 'penalties'], [r.bestStreak, 'best streak']]; }
    else if (r.event === 'hurdles') { head = r.correct + ' / 10 hurdles'; stats = [[fmtTime(r.time), 'time'], [run.hints, 'hints used'], [r.bestStreak, 'best streak']]; }
    else if (r.event === 'relay') { head = fmtTime(r.time); stats = [[r.correct + '/12', 'correct'], [fmtTime(r.penalty), 'penalties'], [r.bestStreak, 'best streak']]; }
    else { head = r.km + ' km'; stats = [[r.correct + '/' + r.answered, 'correct'], [fmtTime(r.time), 'time'], [r.bestStreak, 'best streak']]; }
    var cheers = {
      gold: ['Champion performance! 🔥', 'Outstanding — that was a world-class run.', 'Gold! Your hard work is paying off.'],
      silver: ['Great run! Gold is within reach.', 'Superb effort — check your missed questions and go for gold.'],
      bronze: ['On the podium! Keep training and you’ll climb higher.', 'Nice work! Review the worked solutions, then race again.'],
      finisher: ['You finished — that’s what athletes do! Look at the worked solutions and try again.', 'Every champion started as a rookie. Review, practise, race again!'],
      dnf: ['Tough race! Read the worked solutions below — they’ll make the next one easier.', 'Mistakes are how we get stronger. Review and have another go!']
    };
    var wrong = run.log.filter(function (l) { return !l.ok; }).length;
    var review = run.log.map(function (l, i) {
      return '<div class="ritem"><div class="top"><span class="mark">' + (l.ok ? '✅' : '❌') + '</span><div class="qtext">' + (i + 1) + '. ' + l.q.q + '</div></div>' +
        (l.q.dg ? '<div class="qdg">' + l.q.dg + '</div>' : '') +
        '<div class="yours">Your answer: <b>' + l.given + '</b>' + (l.ok ? '' : ' · Correct: <b>' + l.q.ans.show + '</b>') + '</div>' +
        '<details' + (l.ok ? '' : ' open') + '><summary>Worked solution</summary><ol class="steps">' + l.q.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol></details></div>';
    }).join('');
    var cert = '';
    if (r.code) {
      var d = new Date();
      cert = '<div class="certificate"><div style="font-weight:700">🎟️ Class Challenge result — show your teacher</div><div class="code">' + esc(r.code) + '</div><dl>' +
        '<dt>Name</dt><dd>' + esc(S.name) + '</dd><dt>Class</dt><dd>' + (S.cls ? CLASSES[S.cls] : '—') + '</dd><dt>Event</dt><dd>' + EVENTS[r.event].name + '</dd>' +
        '<dt>Result</dt><dd>' + head + ' ' + MEDAL_ICON[medal] + '</dd><dt>Correct</dt><dd>' + r.correct + ' of ' + r.answered + '</dd>' +
        '<dt>Finished</dt><dd>' + d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + '</dd></dl></div>';
    }
    view('result',
      '<div class="result"><div class="big" aria-hidden="true">' + MEDAL_ICON[medal] + '</div><h1>' + titles[medal] + '</h1>' +
      '<div class="headline">' + head + '</div>' + (isPB ? '<div class="pbflag">⭐ New personal best!</div>' : '') +
      '<div class="statgrid">' + stats.map(function (s) { return '<div><b>' + s[0] + '</b><span>' + s[1] + '</span></div>'; }).join('') + '</div>' +
      '<p class="cheer">' + pick(cheers[medal]) + '</p><p class="note">+' + xp + ' XP' + (levelUp ? ' · 🎉 You are now a <b>' + levelUp + '</b>!' : '') + '</p>' + cert +
      '<div class="btncol"><button class="btn block" data-act="again">Race again</button>' +
      '<button class="btn block ghost" data-act="home">Home</button></div></div>' +
      '<div class="card review"><h2>Review your race</h2><p class="note" style="margin-top:0">' + (wrong ? wrong + ' to learn from — the worked solutions are open below.' : 'Perfect run! Tap any question to see the method.') + '</p>' + review + '</div>');
  }

  /* ---------------- Trophies ---------------- */
  function trophies() {
    var rows = '';
    [7, 8, 9].forEach(function (y) {
      ['sprint', 'relay', 'marathon'].forEach(function (ev) {
        var p = S.pb[pbKey(y, ev)];
        if (p) rows += '<tr><td>Year ' + y + '</td><td>' + EVENTS[ev].name + '</td><td>' + (ev === 'marathon' ? p.km + ' km' : fmtTime(p.time)) + '</td></tr>';
      });
      var golden = M.TOPICS[y].filter(function (t) { return (S.topics[y + '-' + t.id] || 0) >= 9; }).length;
      var tried = M.TOPICS[y].filter(function (t) { return S.topics[y + '-' + t.id] !== undefined; }).length;
      if (tried) rows += '<tr><td>Year ' + y + '</td><td>Hurdles</td><td>' + golden + ' of ' + M.TOPICS[y].length + ' topics 🥇</td></tr>';
    });
    var lv = levelOf(S.xp);
    view('trophies', '<div class="playbar"><button class="iconbtn" data-act="home" aria-label="Back">←</button><div class="title">🏆 Trophy cabinet<small>' + esc(S.name) + ' · ' + lv.name + '</small></div><span></span></div>' +
      '<div class="card"><div class="medalrow"><div>🥇<b>' + S.medals.gold + '</b></div><div>🥈<b>' + S.medals.silver + '</b></div><div>🥉<b>' + S.medals.bronze + '</b></div></div>' +
      '<p class="note" style="text-align:center">' + S.races + ' races · ' + S.xp + ' XP</p></div>' +
      '<div class="card"><h2>Personal bests</h2>' + (rows ? '<table class="pbtable"><thead><tr><th>Level</th><th>Event</th><th>Best</th></tr></thead><tbody>' + rows + '</tbody></table>' : '<p class="note">No records yet — go and set some!</p>') + '</div>' +
      '<div class="card"><h2>Athlete levels</h2><table class="pbtable"><tbody>' + LEVELS.map(function (l) { return '<tr><td>' + (S.xp >= l[0] ? '✅ ' : '⬜ ') + l[1] + '</td><td>' + l[0] + ' XP</td></tr>'; }).join('') + '</tbody></table>' +
      '<p class="note">Earn XP for every correct answer, extra for 🥇 Gold questions, medals and personal bests.</p></div>');
  }

  /* ---------------- Settings ---------------- */
  var resetArmed = false;
  function settings() {
    resetArmed = false;
    view('settings', '<div class="playbar"><button class="iconbtn" data-act="home" aria-label="Back">←</button><div class="title">⚙️ Settings<small>Saved on this phone</small></div><span></span></div>' +
      '<div class="card"><div class="toggle"><span>🔊 Sound effects</span><button class="switch' + (S.sound ? ' on' : '') + '" data-act="toggle" data-k="sound" aria-pressed="' + S.sound + '" aria-label="Sound effects"></button></div>' +
      '<div class="toggle"><span>📳 Vibrate on wrong answers</span><button class="switch' + (S.vibrate ? ' on' : '') + '" data-act="toggle" data-k="vibrate" aria-pressed="' + S.vibrate + '" aria-label="Vibration"></button></div></div>' +
      '<div class="card"><h2>Your details</h2><p>' + esc(S.name) + ' · ' + (S.cls ? CLASSES[S.cls] + ' (Year ' + S.cls + ')' : '—') + '</p><button class="btn ghost block" data-act="edit">Change name or class</button></div>' +
      '<div class="card"><h2>Start over</h2><p class="note" style="margin-top:0">This deletes your name, medals and personal bests from this phone.</p><button class="btn ghost block" data-act="reset" id="resetbtn">Reset my progress</button></div>');
  }

  /* ---------------- Teacher ---------------- */
  var tYear = 0, tEv = 'R', lastCode = '';
  function siteURL() { return location.href.split('#')[0].split('?')[0]; }
  function qrSVG(text) {
    try { var qr = window.qrcode(0, 'M'); qr.addData(text); qr.make(); return qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true }); }
    catch (e) { return '<p class="note">QR code unavailable.</p>'; }
  }
  function teacher() {
    tYear = tYear || S.cls || 7;
    var cov = [7, 8, 9].map(function (y) {
      return '<details><summary>Year ' + y + ' (' + CLASSES[y] + ') · Learner’s Book ' + y + ' · ' + M.GENS.filter(function (g) { return g.year === y; }).length + ' question types</summary><ul>' +
        M.TOPICS[y].map(function (t) { var gs = M.GENS.filter(function (g) { return g.year === y && g.topic === t.id; }); return '<li>Unit ' + t.unit + ' ' + t.name + ' — ' + gs.length + ' types (' + [1, 2, 3].map(function (k) { return gs.filter(function (g) { return g.tier === k; }).length; }).join('/') + ' bronze/silver/gold)</li>'; }).join('') + '</ul></details>';
    }).join('');
    view('teacher', '<div class="playbar"><button class="iconbtn" data-act="home" aria-label="Back">←</button><div class="title">🧑‍🏫 Teacher corner<small>Share, challenge, guide</small></div><span></span></div>' +
      '<div class="card"><h2>1 · Share with your class</h2><p class="note" style="margin-top:0">Project this QR code. Students scan it with their phone camera and play in their browser, with no app or login needed.</p>' +
      '<div class="qrbox" id="qr">' + qrSVG(siteURL()) + '</div><div class="url">' + esc(siteURL()) + '</div>' +
      '<div class="btnrow"><button class="btn ghost" data-act="copyurl">Copy link</button><button class="btn navy" data-act="fullqr">Full-screen QR</button></div></div>' +
      '<div class="card"><h2>2 · Make a Class Challenge</h2><p class="note" style="margin-top:0">Everyone who types the same code gets exactly the same questions, in the same order, so results are fair to compare.</p>' +
      '<div class="field"><label>Year</label><div class="seg">' + [7, 8, 9].map(function (y) { return '<button class="' + (tYear === y ? 'on' : '') + '" data-act="tyear" data-y="' + y + '">Year ' + y + '<br><small>' + CLASSES[y] + '</small></button>'; }).join('') + '</div></div>' +
      '<div class="field"><label>Event</label><div class="seg">' + [['S', '⚡ Sprint'], ['R', '🏁 Relay'], ['M', '🏃 Marathon']].map(function (e) { return '<button class="' + (tEv === e[0] ? 'on' : '') + '" data-act="tev" data-e="' + e[0] + '">' + e[1] + '</button>'; }).join('') + '</div></div>' +
      '<button class="btn block" data-act="makecode">Create code</button><div id="codeout">' + (lastCode ? codeBlock(lastCode) : '') + '</div></div>' +
      '<div class="card guide"><h2>3 · How to use it in class</h2><ul>' +
      '<li><b>Warm-up (5 min):</b> everyone runs the ⚡ 100 m Sprint. Ask who beat their personal best.</li>' +
      '<li><b>After teaching a topic (10–15 min):</b> 🚧 Hurdles on that unit. Hints and worked solutions help students learn from each slip.</li>' +
      '<li><b>Exam revision (15–20 min):</b> 🏁 Relay mixes all four strands, so it covers the whole syllabus.</li>' +
      '<li><b>Class competition:</b> make a Challenge code, give everyone 10 minutes, then collect the result cards (students can screenshot them).</li>' +
      '<li><b>Homework:</b> “Reach the half-marathon (21 km) in the 🏃 Marathon before Friday.” It builds stamina and resilience.</li>' +
      '<li><b>Get moving:</b> after each Relay leg, students stand up and do 5 star jumps before the next leg. Or run it outdoors, with phones left at a “station” table.</li></ul>' +
      '<h3>Wellbeing by design</h3><ul><li>Medals reward accuracy, and every student can win gold.</li><li>Personal bests matter more than beating others. Only Challenge result cards are compared.</li><li>Every wrong answer shows a worked solution, so it becomes a learning moment.</li><li>Scores stay on each phone. There are no public leaderboards and no accounts.</li></ul>' +
      '<h3>Tips</h3><ul><li>Ask students to mute sound effects in ⚙️ Settings during lessons.</li><li>Students can add the game to their home screen (browser menu → “Add to Home screen”). It then works offline too.</li><li>Keep paper and pencils handy. Questions use π = 3.14 and don’t need a calculator.</li></ul></div>' +
      '<div class="card coverage"><h2>4 · What’s inside</h2><p class="note" style="margin-top:0">Questions are generated fresh every time, so no two races are the same. Each year uses its own Learner’s Book units, tiered 🥉 Bronze → 🥈 Silver → 🥇 Gold.</p>' + cov +
      '<button class="btn block navy" data-act="preview" style="margin-top:12px">🔎 Preview every question type</button></div>');
  }
  var pvYear = 0;
  function preview(y) {
    pvYear = y || pvYear || tYear || S.cls || 7;
    var rng = M.makeRng((Math.floor(Math.random() * 4294967295)) >>> 0), n = 0;
    var body = M.TOPICS[pvYear].map(function (t) {
      var items = M.GENS.filter(function (g) { return g.year === pvYear && g.topic === t.id; }).sort(function (a, b) { return a.tier - b.tier; }).map(function (g) {
        var q = M.make(g, rng), tt = TIERS[g.tier]; n++;
        var opts = q.ans.type === 'mc' ? '<ol type="A" class="steps">' + q.ans.options.map(function (o, i) { return '<li' + (i === q.ans.correct ? ' style="font-weight:700;color:var(--ok)"' : '') + '>' + o + '</li>'; }).join('') + '</ol>' : '';
        return '<div class="ritem"><div class="qmeta"><span class="tier ' + tt[0] + '">' + tt[1] + '</span><span>' + (g.quick ? '⚡ Sprint-ready' : '') + '</span></div>' + qBody(q) + opts +
          '<div class="yours" style="margin-left:0">Answer: <b>' + q.ans.show + '</b></div><details style="margin-left:0"><summary>Worked solution</summary><ol class="steps">' + q.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol></details></div>';
      }).join('');
      return '<div class="card review"><h2 style="font-size:21px">Unit ' + t.unit + ' · ' + t.name + '</h2><p class="note" style="margin-top:0">' + M.STRANDS[t.strand] + '</p>' + items + '</div>';
    }).join('');
    view('preview', '<div class="playbar"><button class="iconbtn" data-act="teacher" aria-label="Back">←</button><div class="title">🔎 Question preview<small>One fresh example of every question type</small></div><span></span></div>' +
      '<div class="card"><div class="seg">' + [7, 8, 9].map(function (yy) { return '<button class="' + (pvYear === yy ? 'on' : '') + '" data-act="pvyear" data-y="' + yy + '">Year ' + yy + '<br><small>' + CLASSES[yy] + '</small></button>'; }).join('') + '</div>' +
      '<p class="note">Year ' + pvYear + ': ' + n + ' question types from Learner’s Book ' + pvYear + '. Numbers change every time. Tap “New examples” to see more.</p><button class="btn block ghost" data-act="pvnew">🔄 New examples</button></div>' + body);
  }
  function makeCode() {
    var w = WORDS[Math.floor(Math.random() * WORDS.length)], d = Math.floor(10 + Math.random() * 90);
    lastCode = tYear + tEv + '-' + w + d;
    document.getElementById('codeout').innerHTML = codeBlock(lastCode);
  }
  function codeBlock(c) {
    var p = parseCode(c);
    return '<div class="bigcode">' + c + '</div><p class="note" style="text-align:center;margin-top:0">Year ' + p.year + ' · ' + EVENTS[p.event].name + '. Students tap <b>🎟️ Class Challenge</b> and type this code.</p>' +
      '<div class="btnrow"><button class="btn ghost" data-act="copycode">Copy code</button><button class="btn navy" data-act="trycode">Try it</button></div>';
  }
  function fullQR() {
    var el = document.createElement('div'); el.className = 'fullqr'; el.setAttribute('role', 'dialog');
    el.innerHTML = '<h2>🏅 Maths Sports Day</h2>' + qrSVG(siteURL()) + '<p>Scan with your phone camera to play</p><button class="btn" style="margin-top:12px">Close</button>';
    el.querySelector('button').addEventListener('click', function () { el.remove(); });
    document.body.appendChild(el);
  }
  function copy(text) {
    function fallback() { var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast('Copied!'); } catch (e) { toast('Copy failed: select and copy it instead'); } ta.remove(); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast('Copied!'); }, fallback); else fallback();
  }

  /* ---------------- Actions ---------------- */
  var ACT = {
    pickcls: function (b) { pendingCls = +b.dataset.y; document.querySelectorAll('.choice').forEach(function (c) { c.classList.toggle('on', c === b); }); },
    join: function () {
      var nm = (document.getElementById('nm').value || '').trim().slice(0, 20);
      if (!nm) { toast('Please type your name'); document.getElementById('nm').focus(); return; }
      if (!pendingCls) { toast('Please choose your class'); return; }
      var changed = S.cls !== pendingCls;
      S.name = nm; S.cls = pendingCls; if (changed) S.year = pendingCls; save(); home();
    },
    home: function () { closeOverlay(); home(); },
    year: chooseYear,
    setyear: function (b) { S.year = +b.dataset.y; save(); closeOverlay(); home(); },
    close: closeOverlay,
    event: function (b) { var ev = b.dataset.ev; if (ev === 'hurdles') topics(); else startRun({ event: ev, year: S.year }); },
    starthurdles: function (b) { startRun({ event: 'hurdles', year: S.year, topic: b.dataset.t }); },
    challenge: challenge,
    startcode: startFromCode,
    key: function (b) { key(b.dataset.k); },
    mc: function (b) { submit(+b.dataset.i); },
    next: advance,
    hint: showHint,
    quit: askQuit,
    stay: function (b) { closeOverlay(); if (run && run.batonPending) { run.batonPending = false; resumeClock(); nextQuestion(); return; } if (b.dataset.p !== '1' && run && !run.locked) resumeClock(); },
    leave: function () { stopTicker(); if (run) { clearTimeout(run.autoNext); run.done = true; } run = null; closeOverlay(); home(); },
    again: function () { var o = { event: run.event, year: run.year, topic: run.topic, code: run.code }; startRun(o); },
    trophies: trophies,
    settings: settings,
    teacher: teacher,
    toggle: function (b) { var k = b.dataset.k; S[k] = !S[k]; save(); b.classList.toggle('on', S[k]); b.setAttribute('aria-pressed', S[k]); if (k === 'sound' && S.sound) SFX.ok(); },
    edit: welcome,
    reset: function (b) {
      if (!resetArmed) { resetArmed = true; b.textContent = 'Tap again to delete everything'; b.style.borderColor = 'var(--bad)'; b.style.color = 'var(--bad)'; return; }
      S = blank(); save(); welcome();
    },
    tyear: function (b) { tYear = +b.dataset.y; document.querySelectorAll('[data-act="tyear"]').forEach(function (x) { x.classList.toggle('on', x === b); }); },
    tev: function (b) { tEv = b.dataset.e; document.querySelectorAll('[data-act="tev"]').forEach(function (x) { x.classList.toggle('on', x === b); }); },
    makecode: makeCode,
    copycode: function () { copy(lastCode); },
    copyurl: function () { copy(siteURL()); },
    fullqr: fullQR,
    preview: function () { preview(); },
    pvyear: function (b) { preview(+b.dataset.y); },
    pvnew: function () { preview(pvYear); },
    trycode: function () { var c = parseCode(lastCode); if (c) startRun({ event: c.event, year: c.year, code: c.code }); }
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (!b || b.disabled) return;
    var f = ACT[b.dataset.act];
    if (f) { e.preventDefault(); f(b, e); }
  });
  document.addEventListener('keydown', function (e) {
    if (!run || run.done || current !== 'play' || overlayEl) return;
    if (e.target && e.target.tagName === 'INPUT') return;
    var q = run.q; if (!q) return;
    if (run.locked) { if (e.key === 'Enter' || e.key === ' ') { var nb = document.querySelector('[data-act="next"]'); if (nb) { e.preventDefault(); advance(); } } return; }
    if (q.ans.type === 'mc') {
      var idx = '1234'.indexOf(e.key); if (idx < 0) idx = 'abcd'.indexOf(e.key.toLowerCase());
      if (idx >= 0 && idx < q.ans.options.length) { e.preventDefault(); submit(idx); }
      return;
    }
    if (/^[0-9.\/ ]$/.test(e.key)) { e.preventDefault(); key(e.key); }
    else if (e.key === '-' || e.key === '−') { e.preventDefault(); key('neg'); }
    else if (e.key === 'Backspace') { e.preventDefault(); key('del'); }
    else if (e.key === 'Enter') { e.preventDefault(); key('go'); }
  });

  /* ---------------- Start ---------------- */
  if (S.name && S.cls) home(); else welcome();
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { /* offline support unavailable */ }); });
  }
  // test hook (used by automated checks only)
  window.__MSD_TEST__ = { get run() { return run; }, get state() { return S; }, parseCode: parseCode };
})();

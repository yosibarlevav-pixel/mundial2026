'use strict';
/* המגירה – יומן, תזכורות, פוקוס ומאמן. הכול נשמר מקומית במכשיר (localStorage). */

// ───────────── עזרים ─────────────
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseYmd = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const fmt = m => `${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}`;
const nowMin = () => { const n = new Date(); return n.getHours() * 60 + n.getMinutes(); };
const uid = () => Math.random().toString(36).slice(2, 10);
const MONTHS = ['בינואר', 'בפברואר', 'במרץ', 'באפריל', 'במאי', 'ביוני', 'ביולי', 'באוגוסט', 'בספטמבר', 'באוקטובר', 'בנובמבר', 'בדצמבר'];
const DAYS = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

const CATS = {
  home:    { n: 'בית',     c: '#5bb5ae', i: '🏠' },
  work:    { n: 'עבודה',   c: '#5b82e8', i: '💼' },
  social:  { n: 'חברתי',   c: '#dd78a6', i: '👥' },
  health:  { n: 'בריאות',  c: '#6fb36a', i: '🏃' },
  study:   { n: 'לימודים', c: '#9b7be0', i: '🎓' },
  fun:     { n: 'פנאי',    c: '#c0449a', i: '🎮' },
  routine: { n: 'שגרה',    c: '#f2b84b', i: '☀️' },
  event:   { n: 'אירוע',   c: '#5aaee0', i: '📅' },
};
const CAT_WORDS = {
  work: ['פגישה', 'להגיע', 'מייל', 'לקוח', 'עבודה', 'משרד', 'דוח', 'הצעה', 'פרויקט'],
  home: ['לבקר', 'בית', 'לנקות', 'לאסוף', 'חבילה', 'לקנות', 'סופר', 'כביסה', 'לבשל'],
  social: ['לפגוש', 'חבר', 'חברים', 'משפחה', 'לחגוג', 'יום הולדת', 'להתקשר'],
  health: ['ספורט', 'ריצה', 'רופא', 'אימון', 'חדר כושר', 'תרופה', 'יוגה'],
  study: ['ללמוד', 'שיעור', 'מבחן', 'קורס', 'לקרוא', 'תרגיל'],
  fun: ['סרט', 'משחק', 'מונדיאל', 'מסעדה', 'טיול'],
};
const ACCENTS = ['#2f6f4f', '#2f6fb5', '#8a4fc4', '#d2693b', '#c0395f', '#444b57'];

// ───────────── מצב ושמירה ─────────────
const KEY = 'keshev.planner.v1';
const defaults = () => ({
  tasks: [], chats: [], current: null,
  settings: { name: 'חבר', wake: '06:30', sleep: '00:00', accent: ACCENTS[0], sound: true, haptics: true,
    lead: 0, focusMin: 25, breakMin: 5, sessions: 4, ambient: 'rain' },
  focusLog: {},
});
let S = (() => { try { return { ...defaults(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return defaults(); } })();
S.settings = { ...defaults().settings, ...S.settings };
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* מצב פרטי */ } };

const ui = { tab: 'inbox', date: ymd(new Date()), dismissedOverdue: false, chatTopic: null };

function ensureRoutines() {
  const mk = (sys, title, time, cat) => {
    let t = S.tasks.find(x => x.sys === sys);
    if (!t) { t = newTask({ title, cat, date: ymd(new Date()), time, dur: sys === 'sleep' ? 0 : 25, repeat: 'daily', remind: false }); t.sys = sys; S.tasks.push(t); }
    t.time = time;
  };
  mk('wake', 'השכמה', S.settings.wake, 'routine');
  mk('sleep', 'לילה טוב', S.settings.sleep, 'routine');
}
function newTask(p) {
  return { id: uid(), title: p.title, cat: p.cat || 'home', date: p.date || null, time: p.time || null, dur: p.dur ?? 30,
    repeat: p.repeat || 'none', remind: !!p.remind, bucket: p.date ? null : (p.bucket || 'week'), done: {}, created: Date.now() };
}

// ───────────── לוגיקת משימות ─────────────
const doneKey = (t, ds) => t.date ? ds : 'inbox';
const isDone = (t, ds) => !!t.done[doneKey(t, ds)];
function occursOn(t, ds) {
  if (!t.date) return false;
  if (t.repeat === 'none') return t.date === ds;
  if (ds < t.date) return false;
  if (t.repeat === 'daily') return true;
  if (t.repeat === 'weekly') return parseYmd(ds).getDay() === parseYmd(t.date).getDay();
  return false;
}
const dayItems = ds => S.tasks.filter(t => occursOn(t, ds)).sort((a, b) => sortKey(a) - sortKey(b));
const sortKey = t => t.sys === 'sleep' ? 5000 : (t.time ? toMin(t.time) : 1200);
const inbox = bucket => S.tasks.filter(t => !t.date && t.bucket === bucket && !isDone(t));
const overdue = () => { const td = ymd(new Date()); return S.tasks.filter(t => t.date && t.repeat === 'none' && t.date < td && !isDone(t, t.date) && !t.sys && t.cat !== 'event'); };

function dayWindow() {
  const w = toMin(S.settings.wake) + 25; let s = toMin(S.settings.sleep);
  if (s <= w) s += 1440; return [w, Math.min(s, 1440)];
}
function findSlot(ds, from, dur) {
  const [ws, we] = dayWindow();
  const busy = dayItems(ds).filter(t => t.time && t.sys !== 'sleep').map(t => [toMin(t.time), toMin(t.time) + (t.dur || 0) + 10]);
  for (let s = Math.max(from, ws); s + dur <= we; s += 5) {
    if (!busy.some(([bs, be]) => s < be && s + dur > bs)) return s;
  }
  return null;
}
function schedule(tasks) {
  let placed = 0; const now = new Date();
  for (const t of tasks) {
    for (let d = 0; d < 7; d++) {
      const ds = ymd(addDays(now, d));
      const from = d === 0 ? Math.ceil((nowMin() + 5) / 5) * 5 : 0;
      const slot = findSlot(ds, from, t.dur || 30);
      if (slot != null) { t.date = ds; t.time = fmt(slot).padStart(5, '0'); t.bucket = null; t.repeat = 'none'; placed++; break; }
    }
  }
  save(); return placed;
}

function parseQuick(text) {
  let t = ' ' + text.trim() + ' '; let date = null, time = null;
  const today = new Date();
  const take = (re, fn) => { const m = t.match(re); if (m) { t = t.replace(re, ' '); fn(m); return true; } return false; };
  take(/\sמחרתיים\s/, () => date = ymd(addDays(today, 2))) ||
  take(/\sמחר\s/, () => date = ymd(addDays(today, 1))) ||
  take(/\sהיום\s/, () => date = ymd(today));
  if (!take(/\s(?:ב-?|בשעה\s*)?(\d{1,2}):(\d{2})\s/, m => time = `${pad(m[1])}:${m[2]}`))
    take(/\sבשעה\s*(\d{1,2})\s/, m => time = `${pad(m[1])}:00`);
  if (time && !date) date = ymd(today);
  const title = t.replace(/\s+/g, ' ').trim() || text.trim();
  let cat = 'home';
  outer: for (const [c, ws] of Object.entries(CAT_WORDS)) for (const w of ws) if (title.includes(w)) { cat = c; break outer; }
  return { title, date, time, cat, remind: !!time };
}

// ───────────── צלילים, רטט, התראות ─────────────
let actx = null;
const audio = () => (actx ||= new (window.AudioContext || window.webkitAudioContext)());
function beep() {
  if (!S.settings.sound) return;
  try { const c = audio(), o = c.createOscillator(), g = c.createGain(); o.frequency.value = 880; o.connect(g); g.connect(c.destination);
    g.gain.setValueAtTime(.2, c.currentTime); g.gain.exponentialRampToValueAtTime(.001, c.currentTime + .8); o.start(); o.stop(c.currentTime + .8); } catch { /* אין אודיו */ }
}
const buzz = (p = 15) => { if (S.settings.haptics && navigator.vibrate) navigator.vibrate(p); };
let ambientNodes = null;
function startAmbient(kind) {
  stopAmbient(); if (kind === 'none') return;
  try {
    const c = audio(); const len = c.sampleRate * 2; const buf = c.createBuffer(1, len, c.sampleRate); const d = buf.getChannelData(0);
    let last = 0; for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; if (kind === 'white') d[i] = w * .4; else { last = (last + .02 * w) / 1.02; d[i] = last * 3.5; } }
    const src = c.createBufferSource(); src.buffer = buf; src.loop = true;
    const f = c.createBiquadFilter(); f.type = kind === 'rain' ? 'highpass' : 'lowpass'; f.frequency.value = kind === 'rain' ? 900 : 500;
    const g = c.createGain(); g.gain.value = kind === 'rain' ? .35 : .6;
    src.connect(f); f.connect(g); g.connect(c.destination); src.start(); ambientNodes = { src, g };
  } catch { /* ignore */ }
}
function stopAmbient() { try { ambientNodes?.src.stop(); } catch { /* ignore */ } ambientNodes = null; }

async function askNotify() {
  if (!('Notification' in window)) return toast('הדפדפן לא תומך בהתראות');
  const r = await Notification.requestPermission();
  toast(r === 'granted' ? 'התראות הופעלו ✓' : 'ההרשאה לא ניתנה');
}
async function notify(title, body) {
  beep(); buzz([200, 100, 200]); toast(`🔔 ${title}`);
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try { const reg = await navigator.serviceWorker?.getRegistration(); if (reg) return reg.showNotification(title, { body, icon: 'icon.svg', dir: 'rtl', lang: 'he' }); } catch { /* fallthrough */ }
  new Notification(title, { body, icon: 'icon.svg' });
}
function checkReminders() {
  const fired = JSON.parse(localStorage.getItem(KEY + '.fired') || '{}'); const n = nowMin(), ds = ymd(new Date()); let ch = false;
  for (const t of dayItems(ds)) {
    if (!t.remind || !t.time || isDone(t, ds)) continue;
    const at = toMin(t.time) - S.settings.lead, k = `${t.id}:${ds}`;
    if (n >= at && n < at + 15 && !fired[k]) { fired[k] = Date.now(); ch = true; notify(t.title, S.settings.lead ? `מתחיל בעוד ${S.settings.lead} דקות (${t.time})` : `עכשיו – ${t.time}`); }
  }
  if (ch) { for (const k in fired) if (Date.now() - fired[k] > 864e5) delete fired[k]; try { localStorage.setItem(KEY + '.fired', JSON.stringify(fired)); } catch { /* ignore */ } }
}

// ───────────── UI בסיסי ─────────────
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2600); }
function sheet(html, mount) {
  const root = $('#sheet-root'); root.innerHTML = `<div class="back"><div class="sheet">${html}</div></div>`;
  root.firstChild.addEventListener('mousedown', e => { if (e.target === root.firstChild) closeSheet(); });
  mount && mount($('.sheet', root));
}
const closeSheet = () => { $('#sheet-root').innerHTML = ''; };
function applyTheme() { document.documentElement.style.setProperty('--accent', S.settings.accent); }

let rec = null;
function listen(inputEl, btn) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return toast('זיהוי קולי לא נתמך בדפדפן הזה');
  if (rec) { rec.stop(); return; }
  rec = new SR(); rec.lang = 'he-IL'; rec.interimResults = true; btn?.classList.add('rec');
  rec.onresult = e => { inputEl.value = [...e.results].map(r => r[0].transcript).join(' '); };
  rec.onend = () => { rec = null; btn?.classList.remove('rec'); };
  rec.onerror = () => toast('לא הצלחתי לשמוע, נסו שוב');
  rec.start();
}

// ───────────── מסך: המגירה ─────────────
function viewInbox() {
  const od = overdue(), week = inbox('week'), some = inbox('someday');
  const row = t => `<div class="t-item" draggable="true" data-id="${t.id}" data-act="edit" style="--c:${CATS[t.cat].c}">
      <span class="ico">${CATS[t.cat].i}</span><span class="ttl">${esc(t.title)}</span><span class="chev">‹</span></div>`;
  return `
  <div class="row"><h1>המגירה</h1>${week.length + some.length ? `<span class="pill">${week.length + some.length}</span>` : ''}</div>
  <p class="sub">כל מה שבראש, במקום אחד.</p>
  <div class="card capture"><button class="mic" data-act="mic-quick">🎙</button>
    <input id="quick" placeholder="מה עוד בראש? זרוק לכאן…" enterkeyhint="send"><button class="go" data-act="quick-add">+</button></div>
  ${od.length && !ui.dismissedOverdue ? `<div class="banner"><button class="x" data-act="dismiss-od">✕</button>
      <button class="btn" data-act="resched-od">בטל הכול</button>
      <span class="t">${od.length} משימות עלו ליומן</span><span>↪️</span></div>` : ''}
  <div class="sheetlike">
    <div class="sec-h">השבוע <i>${week.length}</i></div>
    <div class="zone" data-drop="week">${week.map(row).join('') || '<div class="empty">המגירה ריקה – כל הכבוד 🎉</div>'}</div>
    <div class="sec-h" style="margin-top:36px">מתישהו <i>${some.length}</i></div>
    <div class="zone" data-drop="someday">${some.map(row).join('') || '<div class="drop">גרור לכאן למתישהו</div>'}</div>
  </div>
  <button class="btn block magic" data-act="organize">קשב, תסדר לי את זה ✨</button>`;
}
function updateBadge() { const n = inbox('week').length + inbox('someday').length; const b = $('#badge'); b.hidden = !n; b.textContent = n; }

// ───────────── מסך: יומן ─────────────
function weekDays() { const sel = parseYmd(ui.date); const start = addDays(sel, -sel.getDay()); return Array.from({ length: 7 }, (_, i) => addDays(start, i)); }
function dotColors(ds) {
  const seen = new Set(), out = [];
  for (const t of dayItems(ds)) { const c = t.sys === 'sleep' ? '#2f6f4f' : CATS[t.cat].c; if (!seen.has(c)) { seen.add(c); out.push(c); } }
  return out.slice(0, 3);
}
function viewCalendar() {
  const d = parseYmd(ui.date), items = dayItems(ui.date), out = [];
  items.forEach((t, i) => {
    const c = t.sys === 'sleep' ? '#2f6f4f' : CATS[t.cat].c, ic = t.sys === 'sleep' ? '🌙' : CATS[t.cat].i, st = t.time ? toMin(t.time) : null;
    const meta = [t.repeat !== 'none' ? '🔄' : '', t.remind ? '🔔' : '', st != null && t.dur ? `${t.time}–${fmt(st + t.dur)}` : (t.time || ''), t.cat === 'event' ? '· יומן' : ''].filter(Boolean).join(' ');
    out.push(`<div class="tl-row ${isDone(t, ui.date) ? 'done' : ''}" style="--c:${c}">
      <span class="tm">${t.time ? fmt(st) : ''}</span>
      <span class="nodecol"><span class="node ${t.cat === 'event' ? 'ev' : ''}" data-act="edit" data-id="${t.id}">${ic}</span></span>
      <div class="body" data-act="edit" data-id="${t.id}"><div class="meta">${meta}</div><div class="name">${esc(t.title)}</div></div>
      <button class="chk" data-act="toggle" data-id="${t.id}">${isDone(t, ui.date) ? '✓' : ''}</button></div>`);
    const nx = items[i + 1];
    if (nx && st != null && nx.time && nx.sys !== 'sleep') {
      const end = st + (t.dur || 0), gap = toMin(nx.time) - end;
      if (gap >= 30) {
        const label = gap >= 180 ? `<span class="free">🕘 ${Math.round(gap / 60)} שעות פנויות</span><br><button class="btn ghost" style="padding:6px 14px;margin-top:6px;font-size:14px" data-act="add-at" data-t="${fmt(end + 5)}">＋ הוספת משימה</button>`
          : `<button class="add" data-act="add-at" data-t="${fmt(end + 5)}"><span class="circ">+</span>זמן טוב למשימה קטנה</button>`;
        out.push(`<div class="gap"><span class="tm">${fmt(end)}</span><span class="nodecol"></span><div class="body">${label}</div><span></span></div>`);
      }
    }
  });
  return `
  <div class="cal-h"><button class="icon-btn" data-act="settings">⚙️</button><span style="font-weight:700;color:var(--accent)">קשב</span>
    <label class="icon-btn" style="position:relative">📅<input type="date" id="jump" value="${ui.date}" style="position:absolute;inset:0;opacity:0;width:100%"></label>
    <h2>${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}</h2></div>
  <div class="week" id="week">${weekDays().map(x => { const ds = ymd(x), dots = dotColors(ds);
    return `<button class="day ${ds === ui.date ? 'sel' : ''}" data-act="day" data-d="${ds}"><small>${DAYS[x.getDay()]}</small><span class="n">${x.getDate()}</span>
      <span class="dots">${dots.map(c => `<i style="--c:${c}"></i>`).join('')}</span></button>`; }).join('')}</div>
  <div class="tl">${out.join('') || '<div class="empty">אין משימות ליום הזה</div>'}</div>`;
}

// ───────────── מסך: פוקוס ─────────────
const F = { mode: 'work', remaining: S.settings.focusMin * 60, total: S.settings.focusMin * 60, running: false, endAt: 0, session: 1, label: '', taskId: '' };
const C = 2 * Math.PI * 120;
function viewFocus() {
  const todayTasks = dayItems(ymd(new Date())).filter(t => !t.sys && !isDone(t, ymd(new Date())));
  const logToday = S.focusLog[ymd(new Date())] || 0;
  return `
  <div class="fsel"><select id="ftask"><option value="">שם המשימה</option>${todayTasks.concat(inbox('week')).map(t => `<option value="${t.id}" ${F.taskId === t.id ? 'selected' : ''}>${esc(t.title)}</option>`).join('')}</select>
    <span class="muted" title="סשנים שהושלמו היום">🍅 ${logToday}</span></div>
  <div class="fmsg"><h2 id="fh">${F.mode === 'work' ? `${S.settings.focusMin} דקות של ריכוז.` : 'זמן הפסקה ☕'}</h2>
    <div class="muted">${F.mode === 'work' ? 'מתחילים בקטן, צעד אחרי צעד.' : 'קום, תמתח, תשתה מים.'}</div></div>
  <div class="ring"><svg viewBox="0 0 260 260"><circle cx="130" cy="130" r="120" fill="none" stroke="var(--line)" stroke-width="6"/>
    <circle id="fring" cx="130" cy="130" r="120" fill="none" stroke="var(--accent)" stroke-width="6" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - F.remaining / F.total)}"/></svg>
    <div class="time" id="ftime">${mmss(F.remaining)}</div></div>
  <div class="sdots">${Array.from({ length: S.settings.sessions }, (_, i) => `<i class="${i < F.session - (F.mode === 'work' ? 1 : 0) ? 'on' : ''}"></i>`).join('')}</div>
  <div class="fopts"><select id="fsound"><option value="rain">🌧 גשם שקט</option><option value="waves">🌊 גלים</option><option value="white">📻 רעש לבן</option><option value="none">🔇 ללא</option></select>
    <button class="chip" data-act="focus-settings">⚙️ ${S.settings.focusMin} דק׳ · ${S.settings.sessions} סבבים</button></div>
  <button class="play" data-act="focus-toggle" id="fplay">${F.running ? '⏸' : '▶'}</button>
  <div class="row" style="justify-content:center"><button class="chip" data-act="focus-reset">↺ איפוס</button><button class="chip" data-act="focus-skip">⏭ דלג</button></div>`;
}
const mmss = s => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
function focusTick() {
  if (!F.running) return;
  F.remaining = Math.max(0, Math.round((F.endAt - Date.now()) / 1000));
  if (F.remaining <= 0) return focusDone();
  paintFocus();
}
function paintFocus() {
  const t = $('#ftime'); if (!t) return; t.textContent = mmss(F.remaining);
  $('#fring').setAttribute('stroke-dashoffset', C * (1 - F.remaining / F.total));
}
function setMode(mode) {
  F.mode = mode; F.total = F.remaining = (mode === 'work' ? S.settings.focusMin : S.settings.breakMin) * 60; F.running = false;
}
function focusDone() {
  F.running = false; stopAmbient();
  if (F.mode === 'work') {
    const k = ymd(new Date()); S.focusLog[k] = (S.focusLog[k] || 0) + 1; save();
    notify('סבב ריכוז הסתיים 🎉', 'זמן להפסקה קצרה.');
    if (F.session >= S.settings.sessions) { F.session = 1; setMode('work'); } else { F.session++; setMode('break'); }
  } else { notify('ההפסקה נגמרה', 'חוזרים לעבודה?'); setMode('work'); }
  render();
}
function focusStart(seconds) {
  if (seconds) { F.total = F.remaining = seconds; F.mode = 'work'; }
  F.running = true; F.endAt = Date.now() + F.remaining * 1000; startAmbient($('#fsound')?.value || S.settings.ambient); buzz();
}

// ───────────── מסך: קשב (מאמן) ─────────────
const TOPICS = [
  { id: 'plan', n: 'תכנון וסדר יום', i: '🗓' }, { id: 'focus', n: 'ריכוז ופוקוס', i: '🎯' },
  { id: 'procrast', n: 'דחיינות ותקיעות', i: '⏳' }, { id: 'overwhelm', n: 'עומס והצפה', i: '🌪' },
  { id: 'emotion', n: 'רגש ומוטיבציה', i: '💚' }, { id: 'habits', n: 'הרגלים והתמדה', i: '🔁' },
];
const KEYWORDS = {
  plan: ['תכנון', 'לתכנן', 'סדר', 'יום', 'לוז', 'מתי'], focus: ['ריכוז', 'פוקוס', 'מתרכז', 'מסיח'],
  procrast: ['דחיינות', 'דוחה', 'תקוע', 'לא מצליח להתחיל', 'מתחיל', 'עצלן'], overwhelm: ['עומס', 'הצפה', 'המון', 'לחוץ', 'לא מספיק', 'הצפתי'],
  emotion: ['עצוב', 'מתוסכל', 'מוטיבציה', 'חרדה', 'עייף', 'כועס', 'רגש', 'מדוכא'], habits: ['הרגל', 'הרגלים', 'התמדה', 'שגרה', 'כל יום'],
};
function coach(topic) {
  const open = inbox('week').length, td = ymd(new Date()), left = dayItems(td).filter(t => !t.sys && !isDone(t, td)).length;
  switch (topic) {
    case 'plan': return { t: `בוא נסדר את היום. יש לך ${left} משימות להיום ו-${open} במגירה.\nהכי חשוב שנבחר דבר אחד שאי אפשר בלי.`, chips: [['organize', 'סדר לי את המגירה ביומן'], ['goto-cal', 'הצג את היום'], ['goto-inbox', 'פתח את המגירה']] };
    case 'focus': return { t: 'ריכוז נבנה בסבבים קצרים. נבחר משימה אחת, נסגור הסחות ונריץ 25 דקות. אחר כך 5 דקות הפסקה.', chips: [['focus25', 'התחל 25 דקות'], ['focus10', 'רק 10 דקות']] };
    case 'procrast': return { t: 'דחיינות היא בדרך כלל התנגדות להתחלה, לא עצלות. הטריק: מתחייבים ל-5 דקות בלבד. אחרי זה מותר להפסיק (בדרך כלל ממשיכים).', chips: [['focus5', 'בוא ננסה 5 דקות'], ['split', 'איך מפרקים משימה?']] };
    case 'overwhelm': return { t: 'קודם נשימה: שאיפה 4 שניות, החזקה 4, נשיפה 6 – ארבע פעמים.\nאחר כך נבחר 3 דברים בלבד להיום, והשאר ילכו ל"מתישהו" – הם לא נעלמים.', chips: [['top3', 'השאר רק 3 למגירה השבועית'], ['focus5', 'התחל 5 דקות שקט']] };
    case 'emotion': return { t: 'זה לגיטימי להרגיש ככה. אין צורך להיות פרודוקטיבי כל הזמן. מה יעזור עכשיו?', chips: [['focus5', 'משהו קטן אחד (5 דק׳)'], ['rest', 'אני צריך הפסקה'], ['add-habit', 'להוסיף הרגל מטפל']] };
    case 'habits': return { t: 'הרגל חדש נבנה מצעד זעיר באותו זמן כל יום (למשל: אחרי הקפה – 5 דקות קריאה). נוסיף אחד כמשימה חוזרת?', chips: [['add-habit', 'הוסף הרגל יומי'], ['goto-cal', 'ראה את היומן']] };
    default: return { t: 'הבנתי. ספר לי עוד, או בחר נושא: תכנון, ריכוז, דחיינות, עומס, רגש או הרגלים.', chips: TOPICS.map(x => [`topic:${x.id}`, x.n]) };
  }
}
function curChat() { let c = S.chats.find(x => x.id === S.current); if (!c) { c = { id: uid(), ts: Date.now(), msgs: [] }; S.chats.push(c); S.current = c.id; } return c; }
function say(role, text, chips) { curChat().msgs.push({ role, text, chips }); save(); }
function chatSend(text) {
  text = text.trim(); if (!text) return;
  say('me', text);
  const topic = Object.keys(KEYWORDS).find(k => KEYWORDS[k].some(w => text.includes(w)));
  const r = coach(topic); say('bot', r.t, r.chips); render(); scrollChat();
}
const scrollChat = () => { const v = $('#view'); v.scrollTop = v.scrollHeight; };
function runChip(id) {
  if (id.startsWith('topic:')) { const x = TOPICS.find(t => t.id === id.slice(6)); say('me', x.n); const r = coach(x.id); say('bot', r.t, r.chips); return render(), scrollChat(); }
  const act = {
    organize: () => { const n = schedule(inbox('week')); say('bot', n ? `סידרתי ${n} משימות ביומן שלך 👌` : 'אין כרגע משימות במגירה לסדר.'); },
    'goto-cal': () => { ui.tab = 'calendar'; ui.date = ymd(new Date()); },
    'goto-inbox': () => { ui.tab = 'inbox'; },
    focus25: () => { ui.tab = 'focus'; setMode('work'); },
    focus10: () => { ui.tab = 'focus'; F.total = F.remaining = 600; F.mode = 'work'; },
    focus5: () => { ui.tab = 'focus'; F.total = F.remaining = 300; F.mode = 'work'; },
    split: () => say('bot', 'שאל את עצמך: "מה הצעד הפיזי הראשון?" (לפתוח את הקובץ, לכתוב כותרת, לקחת את המפתחות). הוסף אותו כמשימה נפרדת של 10 דקות. רוצה לנסות?', [['add', 'הוסף משימה קטנה']]),
    top3: () => { const w = inbox('week'); w.slice(3).forEach(t => t.bucket = 'someday'); save(); say('bot', w.length > 3 ? `העברתי ${w.length - 3} משימות ל"מתישהו". נשארו לך 3 – מספיק לעכשיו.` : 'כבר יש לך 3 משימות או פחות. כל הכבוד.'); },
    rest: () => say('bot', 'הפסקה מותרת. קום, שתה מים, נשום עמוק. אני כאן כשתרצה לחזור 💚'),
    'add-habit': () => openTaskSheet({ repeat: 'daily', cat: 'health', date: ymd(new Date()), time: '08:00', remind: true }),
    add: () => openTaskSheet({}),
  }[id];
  act?.(); save(); render();
  if (id === 'focus25' || id === 'focus10' || id === 'focus5') focusStart();
  if (ui.tab === 'chat') scrollChat();
}
function viewChat() {
  const td = ymd(new Date()), upcoming = dayItems(td).filter(t => !t.sys && !isDone(t, td) && t.time && toMin(t.time) >= nowMin());
  const c = S.chats.find(x => x.id === S.current), has = c && c.msgs.length;
  const sub = `נשארו לך היום ${dayItems(td).filter(t => !t.sys && !isDone(t, td)).length} משימות${upcoming[0] ? `, הקרובה ב-${upcoming[0].time}` : ''}`;
  const head = `<div class="row spread"><h1 style="color:var(--accent);font-size:28px">היי ${esc(S.settings.name)}, מה נשמע?</h1><button class="icon-btn" data-act="history">🕘</button></div>
    <p class="sub">🕒 ${sub}</p>`;
  const body = has ? `<div class="msgs">${c.msgs.map((m, i) => `<div class="msg ${m.role}">${esc(m.text)}</div>${m.chips && i === c.msgs.length - 1 ? `<div class="chips">${m.chips.map(([id, l]) => `<button class="chip" data-act="chip" data-id="${id}">${esc(l)}</button>`).join('')}</div>` : ''}`).join('')}</div>`
    : `<div class="topics">${TOPICS.map(t => `<button class="card topic" data-act="topic" data-id="${t.id}"><span class="ti">${t.i}</span>${t.n}</button>`).join('')}</div>`;
  return head + body + `<div class="chatbar"><button class="send" data-act="chat-send">↑</button><input id="chatin" placeholder="${has ? 'על מה חשבת?' : 'תקוע במשהו? ספר לי'}" enterkeyhint="send"><button class="mic" data-act="mic-chat">🎙</button></div>`;
}

// ───────────── חלונות: משימה ─────────────
function openTaskSheet(init = {}, editId = null) {
  const t = editId ? S.tasks.find(x => x.id === editId) : null;
  const v = { title: '', cat: 'home', date: '', time: '', dur: 30, repeat: 'none', remind: false, bucket: 'week', ...(t || {}), ...init };
  let cat = v.cat;
  sheet(`<h3>${t ? 'עריכת משימה' : 'משימה חדשה'}</h3>
    <div class="field"><label>מה צריך לעשות?</label><div class="row"><input id="f-title" style="flex:1" value="${esc(v.title)}" placeholder="למשל: לפגוש את דנה מחר 17:30"><button class="mic" id="f-mic">🎙</button></div></div>
    <div class="field"><label>קטגוריה</label><div class="cats">${Object.entries(CATS).filter(([k]) => k !== 'routine').map(([k, c]) => `<button class="cat ${k === cat ? 'on' : ''}" data-cat="${k}" style="--c:${c.c}">${c.i} ${c.n}</button>`).join('')}</div></div>
    <div class="two"><div class="field"><label>תאריך</label><input type="date" id="f-date" value="${v.date || ''}"></div><div class="field"><label>שעה</label><input type="time" id="f-time" value="${v.time || ''}"></div></div>
    <div class="two"><div class="field"><label>משך (דקות)</label><input type="number" id="f-dur" min="0" step="5" value="${v.dur}"></div>
      <div class="field"><label>חזרה</label><select id="f-rep"><option value="none">ללא</option><option value="daily">כל יום</option><option value="weekly">כל שבוע</option></select></div></div>
    <div class="field" id="f-bucket-w"><label>אם אין תאריך – היכן לשמור?</label><select id="f-bucket"><option value="week">השבוע</option><option value="someday">מתישהו</option></select></div>
    <label class="toggle"><span>🔔 תזכורת</span><input type="checkbox" id="f-remind" ${v.remind ? 'checked' : ''}></label>
    <div class="actions"><button class="btn" id="f-save">שמירה</button>${t ? `<button class="btn ghost" id="f-done">${isDone(t, ui.date) ? 'בטל סימון' : 'בוצע ✓'}</button><button class="btn danger" id="f-del">מחיקה</button>` : ''}</div>`,
  el => {
    $('#f-rep', el).value = v.repeat; $('#f-bucket', el).value = v.bucket || 'week';
    $$('.cat', el).forEach(b => b.onclick = () => { cat = b.dataset.cat; $$('.cat', el).forEach(x => x.classList.toggle('on', x === b)); });
    $('#f-mic', el).onclick = e => listen($('#f-title', el), e.currentTarget);
    $('#f-save', el).onclick = () => {
      const raw = $('#f-title', el).value.trim(); if (!raw) return toast('צריך לכתוב מה לעשות');
      let p = { title: raw, cat, date: $('#f-date', el).value, time: $('#f-time', el).value };
      if (!t && !p.date && !p.time) { const q = parseQuick(raw); p = { ...p, title: q.title, date: q.date || '', time: q.time || '', cat: init.cat || (cat === 'home' ? q.cat : cat) }; }
      if (p.time && !p.date) p.date = ymd(new Date());
      Object.assign(p, { dur: +$('#f-dur', el).value || 0, repeat: $('#f-rep', el).value, remind: $('#f-remind', el).checked, bucket: $('#f-bucket', el).value });
      if (p.remind && !p.time) p.remind = false;
      if (t) { Object.assign(t, p, { date: p.date || null, time: p.time || null }); if (!t.date) t.bucket = p.bucket; else t.bucket = null; }
      else { const n = newTask({ ...p, date: p.date || null }); S.tasks.push(n); }
      if (p.remind) maybeAskNotify();
      save(); closeSheet(); toast('נשמר ✓'); buzz(); render();
    };
    if (t) {
      $('#f-done', el).onclick = () => { t.done[doneKey(t, ui.date)] = !isDone(t, ui.date); save(); closeSheet(); render(); };
      $('#f-del', el).onclick = () => { if (t.sys) return toast('משימות שגרה מנוהלות בהגדרות'); S.tasks = S.tasks.filter(x => x !== t); save(); closeSheet(); render(); };
    }
  });
}
function maybeAskNotify() { if ('Notification' in window && Notification.permission === 'default') askNotify(); }

// ───────────── הגדרות ─────────────
function viewSettings() {
  const li = (ic, l, val, act) => `<button class="li" data-act="${act}"><span class="ic">${ic}</span><span class="grow">${l}</span><span class="val">${esc(val || '')}</span><span class="muted">‹</span></button>`;
  return `<div class="row spread" style="margin-bottom:12px"><h1 style="font-size:24px">הגדרות</h1><button class="btn ghost" data-act="back">ליומן ›</button></div>
  <div class="list">${li('👤', 'פרופיל אישי', S.settings.name, 's-profile')}${li('☀️', 'היום שלי', `${S.settings.wake}–${S.settings.sleep}`, 's-day')}</div>
  <div class="list-h">התאמה אישית</div><div class="list">${li('🎨', 'עיצוב האפליקציה', '', 's-design')}${li('🔊', 'צלילים ורטט', S.settings.sound ? 'פעיל' : 'כבוי', 's-sound')}</div>
  <div class="list-h">חיבורים</div><div class="list">${li('📅', 'יומן ותזכורות', 'Notification' in window && Notification.permission === 'granted' ? 'מחוברים' : 'לא פעיל', 's-cal')}</div>
  <div class="list-h">תמיכה</div><div class="list">${li('❓', 'עזרה וטיפים', '', 's-help')}${li('📤', 'שיתוף עם חברים', '', 's-share')}</div>
  <div class="list-h">מידע</div><div class="list">${li('💾', 'גיבוי ושחזור נתונים', '', 's-backup')}${li('🗑', 'מחיקת כל הנתונים', '', 's-wipe')}${li('ℹ️', 'גרסה', '1.0.0', 'noop')}</div>`;
}
function settingsAction(a) {
  const s = S.settings;
  const done = () => { save(); applyTheme(); closeSheet(); render(); };
  if (a === 's-profile') sheet(`<h3>פרופיל אישי</h3><div class="field"><label>איך לקרוא לך?</label><input id="p-name" value="${esc(s.name)}"></div><button class="btn block" id="ok">שמירה</button>`,
    el => $('#ok', el).onclick = () => { s.name = $('#p-name', el).value.trim() || 'חבר'; done(); });
  if (a === 's-day') sheet(`<h3>היום שלי</h3><div class="two"><div class="field"><label>שעת השכמה</label><input type="time" id="d-wake" value="${s.wake}"></div><div class="field"><label>שעת שינה</label><input type="time" id="d-sleep" value="${s.sleep}"></div></div>
    <p class="muted">משימות מהמגירה ישובצו אוטומטית רק בין שעות אלה.</p><button class="btn block" id="ok">שמירה</button>`,
    el => $('#ok', el).onclick = () => { s.wake = $('#d-wake', el).value || s.wake; s.sleep = $('#d-sleep', el).value || s.sleep; ensureRoutines(); done(); });
  if (a === 's-design') sheet(`<h3>עיצוב האפליקציה</h3><div class="swatches">${ACCENTS.map(c => `<button class="sw ${c === s.accent ? 'on' : ''}" data-c="${c}" style="--c:${c}"></button>`).join('')}</div>`,
    el => $$('.sw', el).forEach(b => b.onclick = () => { s.accent = b.dataset.c; done(); }));
  if (a === 's-sound') sheet(`<h3>צלילים ורטט</h3><label class="toggle"><span>צלילי התראה</span><input type="checkbox" id="t-s" ${s.sound ? 'checked' : ''}></label>
    <label class="toggle"><span>רטט</span><input type="checkbox" id="t-h" ${s.haptics ? 'checked' : ''}></label><button class="btn block" id="ok">שמירה</button>`,
    el => $('#ok', el).onclick = () => { s.sound = $('#t-s', el).checked; s.haptics = $('#t-h', el).checked; done(); });
  if (a === 's-cal') sheet(`<h3>יומן ותזכורות</h3>
    <div class="field"><label>תזכורת מראש</label><select id="c-lead">${[0, 5, 10, 15, 30].map(m => `<option value="${m}" ${s.lead === m ? 'selected' : ''}>${m ? `${m} דקות לפני` : 'בזמן המשימה'}</option>`).join('')}</select></div>
    <button class="btn ghost block" id="c-notif" style="margin-bottom:10px">🔔 הפעלת התראות בדפדפן</button>
    <button class="btn ghost block" id="c-exp" style="margin-bottom:10px">📤 ייצוא ליומן (‎.ics‎)</button>
    <button class="btn ghost block" id="c-imp" style="margin-bottom:10px">📥 ייבוא מקובץ יומן (‎.ics‎)</button>
    <p class="muted" style="font-size:13px">ההתראות פועלות כשהאפליקציה פתוחה או מותקנת במסך הבית. לתזכורות שמגיעות גם כשהאפליקציה סגורה לחלוטין צריך שרת Push.</p>
    <button class="btn block" id="ok">שמירה</button>`,
    el => { $('#c-notif', el).onclick = askNotify; $('#c-exp', el).onclick = exportIcs; $('#c-imp', el).onclick = importIcs;
      $('#ok', el).onclick = () => { s.lead = +$('#c-lead', el).value; done(); }; });
  if (a === 's-help') sheet(`<h3>עזרה וטיפים</h3><p>• <b>זרוק למגירה</b> כל מחשבה. אפשר לכתוב "פגישה עם דנה מחר 17:30" והאפליקציה תזהה תאריך ושעה.</p><p>• <b>״קשב, תסדר לי את זה״</b> משבץ את המגירה בזמנים פנויים ביומן.</p><p>• <b>גרור</b> משימה בין "השבוע" ל"מתישהו" (או היכנס לעריכה).</p><p>• במסך היומן לחץ על + בין משימות כדי לנצל זמן פנוי.</p><p>• <b>פוקוס</b>: סבבי ריכוז והפסקות עם צליל רקע.</p>`);
  if (a === 's-share') { const d = { title: 'המגירה', text: 'אפליקציית יומן ותזכורות', url: location.href }; navigator.share ? navigator.share(d).catch(() => {}) : (navigator.clipboard?.writeText(location.href), toast('הקישור הועתק')); }
  if (a === 's-backup') sheet(`<h3>גיבוי ושחזור</h3><button class="btn block" id="b-exp" style="margin-bottom:10px">הורדת גיבוי</button><button class="btn ghost block" id="b-imp">שחזור מקובץ</button>`,
    el => { $('#b-exp', el).onclick = () => download('planner-backup.json', JSON.stringify(S), 'application/json');
      $('#b-imp', el).onclick = () => pickFile('.json', txt => { try { S = { ...defaults(), ...JSON.parse(txt) }; S.settings = { ...defaults().settings, ...S.settings }; ensureRoutines(); done(); toast('שוחזר ✓'); } catch { toast('קובץ לא תקין'); } }); });
  if (a === 's-wipe') sheet(`<h3>מחיקת כל הנתונים</h3><p>הפעולה תמחק את כל המשימות וההגדרות במכשיר הזה ואי אפשר לבטל.</p><button class="btn danger block" id="ok">מחק הכול</button>`,
    el => $('#ok', el).onclick = () => { S = defaults(); ensureRoutines(); done(); toast('הכול נמחק'); });
}

// ───────────── ייבוא/ייצוא ─────────────
function download(name, text, type) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1e3); }
function pickFile(accept, cb) { const i = document.createElement('input'); i.type = 'file'; i.accept = accept; i.onchange = () => i.files[0]?.text().then(cb); i.click(); }
function exportIcs() {
  const dt = (ds, tm) => ds.replace(/-/g, '') + 'T' + (tm || '09:00').replace(':', '') + '00';
  const ev = S.tasks.filter(t => t.date && !t.sys).map(t => {
    const st = t.time ? toMin(t.time) : 540, en = st + (t.dur || 30);
    return ['BEGIN:VEVENT', `UID:${t.id}@planner`, `DTSTAMP:${dt(ymd(new Date()), '00:00')}`, `DTSTART:${dt(t.date, t.time)}`, `DTEND:${dt(t.date, `${pad(Math.floor(en / 60) % 24)}:${pad(en % 60)}`)}`,
      `SUMMARY:${t.title.replace(/[,;\n]/g, ' ')}`, t.repeat !== 'none' ? `RRULE:FREQ=${t.repeat === 'daily' ? 'DAILY' : 'WEEKLY'}` : '',
      t.remind ? 'BEGIN:VALARM\nTRIGGER:-PT' + (S.settings.lead || 0) + 'M\nACTION:DISPLAY\nDESCRIPTION:תזכורת\nEND:VALARM' : '', 'END:VEVENT'].filter(Boolean).join('\r\n');
  });
  download('planner.ics', ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//planner//HE', ...ev, 'END:VCALENDAR'].join('\r\n'), 'text/calendar');
}
function importIcs() {
  pickFile('.ics,text/calendar', txt => {
    let n = 0; const unfolded = txt.replace(/\r?\n[ \t]/g, '');
    for (const blk of unfolded.split('BEGIN:VEVENT').slice(1)) {
      const g = k => (blk.match(new RegExp(`^${k}[^:\\r\\n]*:(.*)$`, 'm')) || [])[1]?.trim();
      const s = g('DTSTART'), e = g('DTEND'), title = g('SUMMARY'); if (!s || !title) continue;
      const m = s.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2}))?/); if (!m) continue;
      const time = m[4] ? `${m[4]}:${m[5]}` : null, em = e?.match(/T(\d{2})(\d{2})/);
      const dur = time && em ? Math.max(0, toMin(`${em[1]}:${em[2]}`) - toMin(time)) : 60;
      const rr = g('RRULE') || ''; const t = newTask({ title, cat: 'event', date: `${m[1]}-${m[2]}-${m[3]}`, time, dur, repeat: /DAILY/.test(rr) ? 'daily' : /WEEKLY/.test(rr) ? 'weekly' : 'none' });
      S.tasks.push(t); n++;
    }
    save(); render(); toast(`יובאו ${n} אירועים`);
  });
}

// ───────────── רינדור ואירועים ─────────────
function render() {
  const v = $('#view'), keep = v.scrollTop;
  v.innerHTML = { inbox: viewInbox, calendar: viewCalendar, chat: viewChat, focus: viewFocus, settings: viewSettings }[ui.tab]();
  $$('#nav [data-tab]').forEach(b => b.classList.toggle('on', b.dataset.tab === (ui.tab === 'settings' ? 'calendar' : ui.tab)));
  updateBadge();
  if (ui.tab === 'focus') $('#fsound').value = S.settings.ambient;
  if (ui.tab === 'calendar') { $('#jump').onchange = e => { if (e.target.value) { ui.date = e.target.value; render(); } }; }
  if (ui.tab !== 'chat') v.scrollTop = keep;
  bindDnD();
}
function bindDnD() {
  $$('.t-item[draggable]').forEach(el => el.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', el.dataset.id)));
  $$('[data-drop]').forEach(z => {
    z.addEventListener('dragover', e => { e.preventDefault(); z.classList.add('over'); });
    z.addEventListener('dragleave', () => z.classList.remove('over'));
    z.addEventListener('drop', e => { e.preventDefault(); const t = S.tasks.find(x => x.id === e.dataTransfer.getData('text/plain')); if (t) { t.bucket = z.dataset.drop; save(); render(); } });
  });
}
const byId = id => S.tasks.find(t => t.id === id);

document.addEventListener('click', e => {
  const tab = e.target.closest('[data-tab]'); if (tab) { ui.tab = tab.dataset.tab; if (ui.tab === 'calendar') ui.date ||= ymd(new Date()); buzz(8); return render(); }
  const el = e.target.closest('[data-act]'); if (!el) return;
  const a = el.dataset.act, id = el.dataset.id;
  if (a.startsWith('s-')) return settingsAction(a);
  switch (a) {
    case 'add': return openTaskSheet(ui.tab === 'calendar' ? { date: ui.date } : {});
    case 'add-at': return openTaskSheet({ date: ui.date, time: el.dataset.t.padStart(5, '0') });
    case 'edit': return openTaskSheet({}, id);
    case 'toggle': { const t = byId(id); t.done[doneKey(t, ui.date)] = !isDone(t, ui.date); save(); buzz(); return render(); }
    case 'day': ui.date = el.dataset.d; return render();
    case 'settings': ui.tab = 'settings'; return render();
    case 'back': ui.tab = 'calendar'; return render();
    case 'quick-add': { const i = $('#quick'); const txt = i.value.trim(); if (!txt) return i.focus(); const q = parseQuick(txt);
      S.tasks.push(newTask({ ...q, date: q.date })); if (q.remind) maybeAskNotify(); save(); toast(q.date ? `נקבע ל-${q.date.slice(8)}/${q.date.slice(5, 7)}${q.time ? ' ' + q.time : ''}` : 'נוסף למגירה'); buzz(); return render(); }
    case 'mic-quick': return listen($('#quick'), el);
    case 'dismiss-od': ui.dismissedOverdue = true; return render();
    case 'resched-od': { const n = schedule(overdue()); toast(`${n} משימות שובצו מחדש`); return render(); }
    case 'organize': { const items = inbox('week'); if (!items.length) return toast('אין מה לסדר – המגירה ריקה'); const n = schedule(items); toast(n ? `✨ סידרתי ${n} משימות ביומן` : 'אין זמן פנוי השבוע'); buzz([20, 40, 20]); if (n) { ui.tab = 'calendar'; ui.date = ymd(new Date()); } return render(); }
    case 'topic': case 'chip': return runChip(a === 'topic' ? `topic:${id}` : id);
    case 'chat-send': { const i = $('#chatin'); const t = i.value; i.value = ''; return chatSend(t); }
    case 'mic-chat': return listen($('#chatin'), el);
    case 'history': return sheet(`<h3>שיחות קודמות</h3><button class="btn ghost block" data-act="new-chat" style="margin-bottom:12px">שיחה חדשה</button>${S.chats.filter(c => c.msgs.length).reverse().map(c => `<button class="li card" style="margin-bottom:8px" data-act="open-chat" data-id="${c.id}">${new Date(c.ts).toLocaleDateString('he-IL')} · ${esc(c.msgs[0].text.slice(0, 40))}</button>`).join('') || '<div class="empty">עדיין אין שיחות</div>'}`);
    case 'new-chat': S.current = null; S.chats = S.chats.filter(c => c.msgs.length); save(); closeSheet(); return render();
    case 'open-chat': S.current = id; save(); closeSheet(); return render();
    case 'focus-toggle': { if (F.running) { F.running = false; stopAmbient(); } else focusStart(); return render(); }
    case 'focus-reset': F.running = false; stopAmbient(); setMode(F.mode); return render();
    case 'focus-skip': F.running = false; stopAmbient(); if (F.mode === 'work') { F.session = F.session >= S.settings.sessions ? 1 : F.session + 1; setMode('break'); } else setMode('work'); return render();
    case 'focus-settings': return sheet(`<h3>הגדרות פוקוס</h3><div class="two"><div class="field"><label>ריכוז (דק׳)</label><input type="number" id="fs-w" value="${S.settings.focusMin}" min="1" max="120"></div><div class="field"><label>הפסקה (דק׳)</label><input type="number" id="fs-b" value="${S.settings.breakMin}" min="1" max="60"></div></div>
      <div class="field"><label>מספר סבבים</label><input type="number" id="fs-n" value="${S.settings.sessions}" min="1" max="10"></div><button class="btn block" id="ok">שמירה</button>`,
      el2 => $('#ok', el2).onclick = () => { S.settings.focusMin = +$('#fs-w', el2).value || 25; S.settings.breakMin = +$('#fs-b', el2).value || 5; S.settings.sessions = +$('#fs-n', el2).value || 4; F.session = 1; setMode('work'); save(); closeSheet(); render(); });
  }
});
document.addEventListener('change', e => {
  if (e.target.id === 'ftask') { F.taskId = e.target.value; }
  if (e.target.id === 'fsound') { S.settings.ambient = e.target.value; save(); if (F.running) startAmbient(e.target.value); }
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  if (e.target.id === 'quick') $('[data-act="quick-add"]').click();
  if (e.target.id === 'chatin') $('[data-act="chat-send"]').click();
});
// החלקה בין שבועות
let sx = null;
document.addEventListener('touchstart', e => { sx = e.target.closest('#week') ? e.touches[0].clientX : null; }, { passive: true });
document.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; sx = null;
  if (Math.abs(dx) > 60) { ui.date = ymd(addDays(parseYmd(ui.date), dx > 0 ? -7 : 7)); render(); } });

// ───────────── אתחול ─────────────
ensureRoutines(); save(); applyTheme();
if (!S.tasks.some(t => !t.sys)) { // דוגמאות בהפעלה ראשונה
  const td = ymd(new Date());
  [['לבקר את ההורים בכפר סבא', 'home'], ['להגיע לפגישה באלפי מנשה', 'work'], ['להגיע לפתיחת מלאכה', 'work']].forEach(([title, cat]) => S.tasks.push(newTask({ title, cat })));
  S.tasks.push(newTask({ title: 'לפגוש את יצחק וינר', cat: 'social', date: td, time: '14:15', dur: 30, remind: true }));
  save();
}
render();
setInterval(() => { focusTick(); }, 250);
setInterval(checkReminders, 20000); checkReminders();
document.addEventListener('visibilitychange', () => { if (!document.hidden) { checkReminders(); if (ui.tab === 'calendar' || ui.tab === 'chat') render(); } });
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});

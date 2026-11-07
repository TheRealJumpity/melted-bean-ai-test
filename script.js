'use strict';
/* Melted-Bean · script.js */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const money = n => '$' + n.toFixed(2);
const store = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem('mb_' + k)); return v ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('mb_' + k, JSON.stringify(v)); } catch {} }
};
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- procedural artwork (stand-in for AI images) ---------- */
function art(label, hue = 28, kind = 'cup') {
  const bg1 = `hsl(${hue} 55% 22%)`, bg2 = `hsl(${hue + 12} 60% 38%)`, liq = `hsl(${hue} 55% 30%)`;
  const cup = kind === 'bakery'
    ? `<ellipse cx="200" cy="250" rx="110" ry="60" fill="#d9a066"/><ellipse cx="200" cy="230" rx="100" ry="50" fill="#e8b878"/><path d="M130 225q70-60 140 0" stroke="#b27a3c" stroke-width="6" fill="none"/>`
    : `<path d="M120 170h160l-16 140a26 26 0 0 1-26 22h-76a26 26 0 0 1-26-22z" fill="#f6ead8"/><path d="M130 190h140l-10 112a18 18 0 0 1-18 16h-84a18 18 0 0 1-18-16z" fill="${liq}"/><ellipse cx="200" cy="190" rx="70" ry="9" fill="#f3d9b1"/><path d="M270 200h18a22 22 0 0 1 0 44h-22" fill="none" stroke="#f6ead8" stroke-width="10"/>`;
  const steam = [170, 200, 230].map((x, i) => `<path d="M${x} 150c-14-16 14-24 0-44" fill="none" stroke="#f3d9b1" stroke-width="6" stroke-linecap="round" opacity="0"><animate attributeName="opacity" values="0;.8;0" dur="3s" begin="${i * .6}s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 14;0 -14" dur="3s" begin="${i * .6}s" repeatCount="indefinite"/></path>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/><circle cx="330" cy="70" r="46" fill="#fff" opacity=".07"><animate attributeName="r" values="46;58;46" dur="6s" repeatCount="indefinite"/></circle>${cup}${kind === 'bakery' ? '' : steam}<text x="200" y="378" text-anchor="middle" font-family="Georgia,serif" font-size="22" fill="#f6ead8" opacity=".85">${label.replace(/&/g, '&amp;')}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/* ---------- data ---------- */
const MENU = [
  { id: 'esp', name: 'Single-Origin Espresso', cat: 'Espresso', price: 3.25, desc: 'Rotating bean, syrupy body, cocoa finish.', tags: ['vegan', 'gf'], hue: 24, cal: 5, caf: 64 },
  { id: 'amer', name: 'Americano', cat: 'Espresso', price: 3.75, desc: 'Double shot lengthened with hot water.', tags: ['vegan', 'gf'], hue: 26, cal: 10, caf: 128 },
  { id: 'cap', name: 'Cappuccino', cat: 'Espresso', price: 4.75, desc: 'Equal parts espresso, steamed milk, thick foam.', tags: ['gf'], hue: 30, cal: 120, caf: 128 },
  { id: 'lat', name: 'Velvet Latte', cat: 'Espresso', price: 5.25, desc: 'Silky microfoam with latte art on top.', tags: ['gf'], hue: 32, cal: 190, caf: 128 },
  { id: 'melt', name: 'The Melted Bean', cat: 'Signature', price: 6.5, desc: 'Our namesake: espresso, melted dark chocolate, brown-sugar cream.', tags: ['gf'], hue: 18, cal: 340, caf: 128 },
  { id: 'honey', name: 'Honey Lavender Latte', cat: 'Signature', price: 6.25, desc: 'Local honey, lavender and oat milk.', tags: ['vegan', 'gf'], hue: 280, cal: 230, caf: 128 },
  { id: 'pump', name: 'Pumpkin Spice Ghost', cat: 'Signature', price: 6.75, desc: 'Seasonal: pumpkin, cinnamon, white mocha, whipped “ghost” foam.', tags: ['gf'], hue: 22, cal: 380, caf: 128 },
  { id: 'smore', name: "Campfire S'mores Mocha", cat: 'Signature', price: 6.95, desc: 'Torched marshmallow, graham crumb, dark chocolate.', tags: [], hue: 14, cal: 420, caf: 100 },
  { id: 'cold', name: 'Nitro Cold Brew', cat: 'Cold', price: 5.5, desc: '18-hour steep, nitrogen-poured, naturally sweet.', tags: ['vegan', 'gf'], hue: 20, cal: 5, caf: 280 },
  { id: 'icel', name: 'Iced Oat Latte', cat: 'Cold', price: 5.5, desc: 'Double shot over ice with creamy oat milk.', tags: ['vegan', 'gf'], hue: 34, cal: 160, caf: 128 },
  { id: 'tonic', name: 'Espresso Tonic', cat: 'Cold', price: 5.25, desc: 'Bright, bitter-sweet, absurdly refreshing.', tags: ['vegan', 'gf'], hue: 45, cal: 60, caf: 128 },
  { id: 'matcha', name: 'Ceremonial Matcha', cat: 'Tea & More', price: 5.75, desc: 'Stone-ground matcha whisked to order.', tags: ['vegan', 'gf'], hue: 110, cal: 90, caf: 70 },
  { id: 'chai', name: 'Spiced Chai', cat: 'Tea & More', price: 5.0, desc: 'House-made masala chai concentrate.', tags: ['gf'], hue: 36, cal: 200, caf: 50 },
  { id: 'hot', name: 'Molten Hot Chocolate', cat: 'Tea & More', price: 4.95, desc: 'Melted Valrhona, decaf, topped with marshmallows.', tags: ['gf', 'decaf'], hue: 10, cal: 360, caf: 10 },
  { id: 'decaf', name: 'Swiss-Water Decaf Latte', cat: 'Tea & More', price: 5.25, desc: 'All the comfort, none of the jitters.', tags: ['gf', 'decaf'], hue: 40, cal: 190, caf: 5 },
  { id: 'crois', name: 'Butter Croissant', cat: 'Bakery', price: 3.95, desc: 'Laminated 27 layers, baked each morning.', tags: [], hue: 35, cal: 270, caf: 0, kind: 'bakery' },
  { id: 'cook', name: 'Brown-Butter Cookie', cat: 'Bakery', price: 3.5, desc: 'Gooey centre, flaky salt, melted chocolate.', tags: [], hue: 30, cal: 310, caf: 0, kind: 'bakery' },
  { id: 'vmuf', name: 'Vegan Blueberry Muffin', cat: 'Bakery', price: 3.75, desc: 'Plant-based, bursting with berries.', tags: ['vegan'], hue: 250, cal: 290, caf: 0, kind: 'bakery' },
  { id: 'gfb', name: 'Flourless Brownie', cat: 'Bakery', price: 3.95, desc: 'Fudgy, gluten-free, deeply chocolatey.', tags: ['gf'], hue: 8, cal: 320, caf: 0, kind: 'bakery' }
];
MENU.forEach(m => m.img = art(m.name, m.hue, m.kind));
const DAILY = [
  ['Sunday', 'honey'], ['Monday', 'cold'], ['Tuesday', 'cap'], ['Wednesday', 'matcha'], ['Thursday', 'melt'], ['Friday', 'smore'], ['Saturday', 'pump']
];
const HOURS = [['Sunday', '8:00 – 17:00', 8, 17], ['Monday', '6:30 – 19:00', 6.5, 19], ['Tuesday', '6:30 – 19:00', 6.5, 19], ['Wednesday', '6:30 – 19:00', 6.5, 19], ['Thursday', '6:30 – 19:00', 6.5, 19], ['Friday', '6:30 – 19:00', 6.5, 19], ['Saturday', '7:00 – 20:00', 7, 20]];
const ORIGINS = [['🇪🇹', 'Ethiopia', 'Yirgacheffe', 'Jasmine, bergamot, peach'], ['🇨🇴', 'Colombia', 'Huila', 'Caramel, red apple'], ['🇬🇹', 'Guatemala', 'Antigua', 'Dark chocolate, orange'], ['🇮🇩', 'Sumatra', 'Mandheling', 'Earthy, cedar, molasses'], ['🇰🇪', 'Kenya', 'Nyeri', 'Blackcurrant, citrus']];
const TEAM = [['🧔', 'Rafi', 'Head Roaster', 'Has tasted 4,000 coffees. Still hasn’t had enough.'], ['👩‍🎤', 'Mina', 'Latte Artist', '2× regional latte-art champion.'], ['🧑‍🍳', 'Theo', 'Pastry Chef', 'Wakes at 3 a.m. for the croissants.'], ['👩‍🔬', 'Dana', 'Quality Lead', 'Cups every batch. Zero mercy.']];
const REVIEWS = [['“The Melted Bean is dangerously good.”', 'Priya S.'], ['“Best latte art in the city, and the vibe is unreal.”', 'Marcus T.'], ['“I came for the wifi, stayed for the croissants.”', 'Jess L.'], ['“Their subscription changed my mornings.”', 'Owen K.']];
const EVENTS = [['Latte Art Throwdown', 6, '19:00', 'Watch baristas battle, vote for the winner.'], ['Public Cupping', 13, '11:00', 'Taste five origins side by side.'], ['Open Mic & Espresso', 20, '19:30', 'Poetry, music, caffeine.'], ['Home-Brew Workshop', 27, '10:00', 'Learn pour-over, AeroPress & French press.']];
const QUIZ = [
  { q: 'Pick a morning mood', o: [['Cosy & slow', 'sweet'], ['Ready to conquer', 'bold'], ['Light & breezy', 'fresh'], ['Dessert for breakfast', 'treat']] },
  { q: 'Your milk of choice', o: [['Whole', 'sweet'], ['Oat', 'treat'], ['None, black', 'bold'], ['Plant-based, anything', 'fresh']] },
  { q: 'Weather outside', o: [['Snowing', 'treat'], ['Chilly', 'sweet'], ['Warm', 'fresh'], ['Whatever, I need caffeine', 'bold']] },
  { q: 'Pick a flavour', o: [['Chocolate', 'treat'], ['Caramel', 'sweet'], ['Citrus', 'fresh'], ['Dark roast', 'bold']] }
];
const RESULT = { sweet: ['honey', 'Honey Lavender Latte'], bold: ['cold', 'Nitro Cold Brew'], fresh: ['tonic', 'Espresso Tonic'], treat: ['melt', 'The Melted Bean'] };
const BREW = [['Bloom: pour 40 g water', 0], ['Pour to 150 g, slow circles', 30], ['Pour to 250 g', 70], ['Final pour to 320 g', 105], ['Let it drain, then enjoy ☕', 150]];
const PROMOS = { MELT10: .10, HALLOWEEN: .15, BEAN5: .05 };

/* ---------- toast & effects ---------- */
function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  $('#toasts').append(t); setTimeout(() => t.remove(), 3100);
}
function burst(chars = ['☕', '🫘', '✨'], n = 28) {
  if (reduceMotion) return;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span'); s.className = 'fall'; s.textContent = chars[i % chars.length];
    s.style.left = Math.random() * 100 + 'vw'; s.style.fontSize = 16 + Math.random() * 22 + 'px';
    s.style.animationDuration = 2 + Math.random() * 3 + 's'; s.style.animationDelay = Math.random() * .8 + 's';
    document.body.append(s); setTimeout(() => s.remove(), 6500);
  }
}

/* ---------- preloader ---------- */
addEventListener('load', () => setTimeout(() => $('#preloader').classList.add('done'), 700));
setTimeout(() => $('#preloader').classList.add('done'), 3000);

/* ---------- theme ---------- */
const root = document.documentElement;
root.dataset.theme = store.get('theme', matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
function toggleTheme() { root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'; store.set('theme', root.dataset.theme); }
$('#themeBtn').onclick = toggleTheme;

/* ---------- seasonal banner & daily special ---------- */
const now = new Date(), mo = now.getMonth();
const SEASON = mo === 9 ? '🎃 Spooky season! Pumpkin Spice Ghost is back · use code HALLOWEEN for 15% off'
  : mo >= 10 && mo <= 11 ? '🎄 Holiday menu is here: peppermint mocha & gingerbread latte'
  : mo >= 5 && mo <= 7 ? '☀️ Summer sips: Nitro Cold Brew buy-one-get-one on Fridays'
  : mo >= 2 && mo <= 4 ? '🌸 Spring menu: Honey Lavender Latte is blooming'
  : '🍂 Autumn favourites are warming up';
$('#seasonalText').textContent = SEASON;
if (store.get('seasonHide', false)) $('#seasonal').classList.add('hide');
$('#seasonalClose').onclick = () => { $('#seasonal').classList.add('hide'); store.set('seasonHide', true); };

const [dayName, dayId] = DAILY[now.getDay()];
const dayItem = MENU.find(m => m.id === dayId);
$('#specialDay').textContent = dayName;
$('#specialName').textContent = dayItem.name;
$('#specialDesc').textContent = dayItem.desc;
$('#specialPrice').textContent = money(dayItem.price * 0.9) + '  (10% off today)';
$('#specialImg').src = dayItem.img;
$('#specialAdd').onclick = () => addLine({ key: dayItem.id + ':special', name: dayItem.name + ' (special)', price: +(dayItem.price * .9).toFixed(2), caf: dayItem.caf });

/* ---------- open-now badge & hours ---------- */
function shopNow() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Edmonton', weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
  const g = t => parts.find(p => p.type === t).value;
  return { day: g('weekday'), h: (+g('hour') % 24) + +g('minute') / 60 };
}
function renderHours() {
  const n = shopNow(), row = HOURS.find(h => h[0] === n.day);
  const open = row && n.h >= row[2] && n.h < row[3];
  const b = $('#openBadge'); b.textContent = open ? '● Open now' : '● Closed'; b.className = 'badge ' + (open ? 'open' : 'closed');
  $('#hours').innerHTML = HOURS.map(h => `<tr class="${h[0] === n.day ? 'today' : ''}"><td>${h[0]}</td><td>${h[1]}</td></tr>`).join('');
}
renderHours(); setInterval(renderHours, 60000);

/* ---------- menu ---------- */
const CATS = ['All', ...new Set(MENU.map(m => m.cat))];
let fCat = 'All', fDiet = new Set(), fQ = '', fSort = 'feat';
let favs = new Set(store.get('favs', []));
$('#cats').innerHTML = CATS.map(c => `<button class="chip ${c === 'All' ? 'on' : ''}" data-cat="${c}">${c}</button>`).join('');
$('#cats').onclick = e => { const b = e.target.closest('[data-cat]'); if (!b) return; fCat = b.dataset.cat; $$('#cats .chip').forEach(x => x.classList.toggle('on', x === b)); renderMenu(); };
$('#diet').onclick = e => { const b = e.target.closest('[data-diet]'); if (!b) return; const d = b.dataset.diet; fDiet.has(d) ? fDiet.delete(d) : fDiet.add(d); b.classList.toggle('on'); renderMenu(); };
$('#search').oninput = e => { fQ = e.target.value.toLowerCase(); renderMenu(); };
$('#sort').onchange = e => { fSort = e.target.value; renderMenu(); };
function renderMenu() {
  let list = MENU.filter(m => (fCat === 'All' || m.cat === fCat) && (!fQ || (m.name + m.desc).toLowerCase().includes(fQ)) && [...fDiet].every(d => d === 'fav' ? favs.has(m.id) : m.tags.includes(d)));
  if (fSort === 'lo') list.sort((a, b) => a.price - b.price); if (fSort === 'hi') list.sort((a, b) => b.price - a.price); if (fSort === 'az') list.sort((a, b) => a.name.localeCompare(b.name));
  $('#menuGrid').innerHTML = list.map((m, i) => `<article class="item" data-id="${m.id}" style="animation-delay:${i * 40}ms">
    <img src="${m.img}" alt="${m.name}" loading="lazy" width="400" height="400">
    <div class="body"><h3>${m.name}</h3><div>${m.tags.map(t => `<span class="tag">${{ vegan: '🌱 vegan', gf: '🌾 GF', decaf: '😴 decaf' }[t]}</span>`).join('')}</div><p>${m.desc}</p>
    <div class="row"><b>${money(m.price)}</b><span><button class="heart ${favs.has(m.id) ? 'on' : ''}" data-fav="${m.id}" aria-label="Favourite">♥</button> <button class="add" data-add="${m.id}" aria-label="Add ${m.name}">+</button></span></div></div></article>`).join('');
  $('#noResults').hidden = list.length > 0;
}
$('#menuGrid').onclick = e => {
  const fav = e.target.closest('[data-fav]'), add = e.target.closest('[data-add]'), card = e.target.closest('.item');
  if (fav) { const id = fav.dataset.fav; favs.has(id) ? favs.delete(id) : favs.add(id); store.set('favs', [...favs]); fav.classList.toggle('on'); if (favs.has(id)) toast('Saved to favourites ♥'); return; }
  if (add) { const m = MENU.find(x => x.id === add.dataset.add); addLine({ key: m.id, name: m.name, price: m.price, caf: m.caf }); return; }
  if (card) openItem(MENU.find(x => x.id === card.dataset.id));
};
function openItem(m) {
  const d = $('#modal');
  d.innerHTML = `<img class="modal-img" src="${m.img}" alt="${m.name}"><h2 style="font-family:Fraunces,serif">${m.name}</h2><p>${m.desc}</p><p class="muted">${m.cal} kcal · ${m.caf} mg caffeine · ${m.tags.join(', ') || 'contains dairy/gluten'}</p>
  ${m.kind ? '' : `<label>Size<select id="mSize"><option value="0">Small</option><option value="0.75" selected>Medium +$0.75</option><option value="1.5">Large +$1.50</option></select></label>`}
  <p class="row" style="justify-content:space-between;margin-top:1rem"><button class="btn ghost" id="mClose">Close</button><button class="btn" id="mAdd">Add to order</button></p>`;
  d.showModal();
  $('#mClose').onclick = () => d.close();
  $('#mAdd').onclick = () => { const s = $('#mSize'), up = s ? +s.value : 0, nm = s ? s.selectedOptions[0].text.split(' ')[0] : ''; addLine({ key: m.id + ':' + nm, name: m.name, note: nm, price: m.price + up, caf: m.caf }); d.close(); };
}
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') e.target.close(); });
renderMenu();

/* ---------- cart ---------- */
let cart = store.get('cart', []), promo = store.get('promo', null), tip = 0.1;
function addLine(l) {
  const ex = cart.find(c => c.key === l.key);
  ex ? ex.qty++ : cart.push({ ...l, qty: 1 });
  saveCart(); toast(`Added ${l.name}`); $('#cartBtn').classList.remove('bump'); void $('#cartBtn').offsetWidth; $('#cartBtn').classList.add('bump');
}
function saveCart() { store.set('cart', cart); renderCart(); }
function renderCart() {
  $('#cartCount').textContent = cart.reduce((a, c) => a + c.qty, 0);
  $('#cartLines').innerHTML = cart.length ? cart.map((c, i) => `<div class="line"><b>${c.name}</b><small>${c.note || ''} ${money(c.price)} each</small><div class="qty"><button data-q="-1" data-i="${i}" aria-label="Less">−</button>${c.qty}<button data-q="1" data-i="${i}" aria-label="More">+</button></div></div>`).join('') : '<p class="muted">Your cart is empty. Treat yourself ☕</p>';
  const sub = cart.reduce((a, c) => a + c.price * c.qty, 0), disc = promo ? sub * PROMOS[promo] : 0, tax = (sub - disc) * .05, tipv = (sub - disc) * tip;
  $('#totals').innerHTML = `<dt>Subtotal</dt><dd>${money(sub)}</dd>${promo ? `<dt>Promo ${promo}</dt><dd>−${money(disc)}</dd>` : ''}<dt>GST 5%</dt><dd>${money(tax)}</dd><dt>Tip</dt><dd>${money(tipv)}</dd><dt><b>Total</b></dt><dd><b>${money(sub - disc + tax + tipv)}</b></dd>`;
}
$('#cartLines').onclick = e => { const b = e.target.closest('[data-q]'); if (!b) return; const c = cart[+b.dataset.i]; c.qty += +b.dataset.q; if (c.qty <= 0) cart.splice(+b.dataset.i, 1); saveCart(); };
$('#tips').onclick = e => { const b = e.target.closest('[data-tip]'); if (!b) return; tip = +b.dataset.tip; $$('#tips .chip').forEach(x => x.classList.toggle('on', x === b)); renderCart(); };
$('#promoBtn').onclick = () => { const c = $('#promo').value.trim().toUpperCase(); if (PROMOS[c]) { promo = c; store.set('promo', c); toast(`Promo ${c} applied 🎉`); burst(['🎉'], 10); } else toast('Unknown code'); renderCart(); };
function openCart(o = true) { $('#cart').classList.toggle('open', o); $('#scrim').classList.toggle('on', o); $('#cart').setAttribute('aria-hidden', !o); }
$('#cartBtn').onclick = () => openCart(); $('#cartClose').onclick = () => openCart(false); $('#scrim').onclick = () => openCart(false);
$('#checkout').onsubmit = e => {
  e.preventDefault();
  if (!cart.length) return toast('Add something first');
  const drinks = cart.reduce((a, c) => a + c.qty, 0), num = 'MB-' + Math.floor(1000 + Math.random() * 9000);
  addStamps(drinks); cart = []; promo = null; store.set('promo', null); saveCart(); openCart(false);
  toast(`Order ${num} placed for ${$('#coName').value}!`); burst(); runTracker(num);
  location.hash = '#reserve';
};
renderCart();

/* ---------- order tracker ---------- */
let trackTimers = [];
function runTracker(num) {
  trackTimers.forEach(clearTimeout); const li = $$('#tracker li'); li.forEach(x => x.classList.remove('on'));
  const msgs = ['Order received', 'Our baristas are brewing…', 'Ready! Come grab it ☕'];
  msgs.forEach((m, i) => trackTimers.push(setTimeout(() => { li.forEach((x, j) => x.classList.toggle('on', j <= i)); $('#trackerMsg').textContent = `${num}: ${m}`; if (i === 2) burst(['☕'], 8); }, i * 4000 + 300)));
}

/* ---------- builder ---------- */
const BASES = MENU.filter(m => ['Espresso', 'Cold', 'Signature'].includes(m.cat));
$('#bBase').innerHTML = BASES.map(m => `<option value="${m.id}">${m.name} ${money(m.price)}</option>`).join('');
const bIds = ['bBase', 'bSize', 'bMilk', 'bShots', 'bSyrup', 'bTemp', 'bFoam', 'bWhip'];
function builderCalc() {
  const base = MENU.find(m => m.id === $('#bBase').value);
  const price = base.price + +$('#bSize').value + +$('#bMilk').value + $('#bShots').value * 0.9 + +$('#bSyrup').value + ($('#bFoam').checked ? .25 : 0) + ($('#bWhip').checked ? .5 : 0);
  $('#bPrice').textContent = price.toFixed(2); $('#bShotsOut').textContent = $('#bShots').value;
  const milkMix = $('#bMilk').selectedIndex >= 2 ? 'oat-ish' : 'dairy', warm = $('#bSyrup').selectedIndex ? 12 : 0;
  $('#liqTop').setAttribute('stop-color', `hsl(${base.hue + warm} 45% ${30 + (milkMix === 'dairy' ? 4 : 0)}%)`); $('#liqBot').setAttribute('stop-color', `hsl(${base.hue} 55% 14%)`);
  $('#foam').setAttribute('ry', $('#bFoam').checked ? 16 : 9); $('#whip').setAttribute('opacity', $('#bWhip').checked ? 1 : 0);
  const iced = $('#bTemp').value === 'Iced'; $('#ice').setAttribute('opacity', iced ? 1 : 0); $('#bSteam').style.opacity = iced ? 0 : 1;
  $('#bSummary').textContent = `${$('#bSize').selectedOptions[0].text.split(' ')[0]} ${$('#bTemp').value.toLowerCase()} ${base.name}, ${$('#bMilk').selectedOptions[0].text.toLowerCase()} milk${$('#bShots').value > 0 ? ', +' + $('#bShots').value + ' shots' : ''}${$('#bSyrup').selectedIndex ? ', ' + $('#bSyrup').selectedOptions[0].text.toLowerCase() : ''}`;
  return { base, price };
}
bIds.forEach(i => $('#' + i).addEventListener('input', builderCalc)); builderCalc();
$('#bAdd').onclick = () => { const { base, price } = builderCalc(); addLine({ key: 'custom:' + $('#bSummary').textContent + $('#bFoam').checked + $('#bWhip').checked, name: 'Custom ' + base.name, note: $('#bSummary').textContent, price: +price.toFixed(2), caf: base.caf + $('#bShots').value * 64 }); };

/* ---------- quiz ---------- */
let qi = 0, score = {};
function renderQuiz() {
  const box = $('#quizBox');
  if (qi >= QUIZ.length) {
    const top = Object.entries(score).sort((a, b) => b[1] - a[1])[0][0], [id, nm] = RESULT[top], m = MENU.find(x => x.id === id);
    box.innerHTML = `<h3>Your perfect brew: ${nm}</h3><img src="${m.img}" alt="${nm}" style="max-width:240px;border-radius:16px"><p>${m.desc}</p><div class="row"><button class="btn" id="qAdd">Add to order</button><button class="btn ghost" id="qAgain">Retake</button></div>`;
    $('#qAdd').onclick = () => addLine({ key: m.id, name: m.name, price: m.price, caf: m.caf }); $('#qAgain').onclick = () => { qi = 0; score = {}; renderQuiz(); }; burst(['✨'], 10); return;
  }
  const q = QUIZ[qi];
  box.innerHTML = `<div class="bar"><i style="width:${qi / QUIZ.length * 100}%"></i></div><h3>${q.q}</h3><div class="opts">${q.o.map(o => `<button class="opt" data-k="${o[1]}">${o[0]}</button>`).join('')}</div>`;
}
$('#quizBox').onclick = e => { const b = e.target.closest('.opt'); if (!b) return; score[b.dataset.k] = (score[b.dataset.k] || 0) + 1; qi++; renderQuiz(); };
renderQuiz();

/* ---------- gallery / video fallbacks ---------- */
const GAL = [['Latte Swirl', 30], ['Roast Day', 14], ['Cold Brew Glow', 200], ['Morning Light', 40], ['Cozy Corner', 20], ['Pour Over', 26], ['Cookie Hour', 32], ['Night Shift', 250]];
$('#gallery').innerHTML = GAL.map((g, i) => `<img src="media/gallery-${i + 1}.webp" data-fb="${art(g[0], g[1])}" alt="${g[0]}" loading="lazy" width="400" height="400">`).join('');
$$('#gallery img').forEach(im => im.onerror = () => { im.onerror = null; im.src = im.dataset.fb; });
$('#gallery').onclick = e => { if (e.target.tagName !== 'IMG') return; const lb = $('#lightbox'); $('img', lb).src = e.target.src; $('img', lb).alt = e.target.alt; lb.showModal(); };
$('#lbClose').onclick = () => $('#lightbox').close();
$('#lightbox').addEventListener('click', e => { if (e.target.id === 'lightbox') e.target.close(); });
// lazy-load reel videos; reveal over fallback only if file exists
const vio = new IntersectionObserver(es => es.forEach(en => {
  const v = en.target; if (en.isIntersecting) { if (!v.src && v.dataset.src) { v.src = v.dataset.src; v.addEventListener('canplay', () => { v.classList.add('ok'); v.play().catch(() => {}); }, { once: true }); v.addEventListener('error', () => v.remove(), { once: true }); } else v.play().catch(() => {}); } else v.pause();
}), { threshold: .3 });
$$('.reel video').forEach(v => vio.observe(v));
const hv = $('#heroVideo'); $('source', hv).addEventListener('error', () => hv.remove()); hv.addEventListener('error', () => hv.remove());

/* ---------- brew lab ---------- */
let bt = null, bs = 0;
const fmt = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
$('#brewStart').onclick = () => {
  if (bt) { clearInterval(bt); bt = null; $('#brewStart').textContent = 'Resume'; return; }
  $('#brewStart').textContent = 'Pause';
  bt = setInterval(() => {
    bs++; $('#timer').textContent = fmt(bs);
    const step = [...BREW].reverse().find(s => bs >= s[1]); $('#brewStep').textContent = step[0];
    $('#carafe').setAttribute('height', Math.min(46, bs / 150 * 46)); $('#carafe').setAttribute('y', 138 - Math.min(46, bs / 150 * 46));
    if (bs >= 150) { clearInterval(bt); bt = null; $('#brewStart').textContent = 'Start'; burst(['☕'], 10); toast('Brew complete!'); }
  }, 1000);
};
$('#brewReset').onclick = () => { clearInterval(bt); bt = null; bs = 0; $('#timer').textContent = '0:00'; $('#brewStep').textContent = 'Ready when you are.'; $('#carafe').setAttribute('height', 0); $('#brewStart').textContent = 'Start'; };
const calcWater = () => $('#rWater').textContent = Math.round($('#rGrams').value * $('#rRatio').value);
$('#rGrams').oninput = $('#rRatio').oninput = calcWater;
const CAFF = MENU.filter(m => m.caf > 0).slice(0, 6), cc = {};
$('#caff').innerHTML = CAFF.map(m => `<div class="caff-row"><span>${m.name} <small class="muted">${m.caf}mg</small></span><span><button data-c="${m.id}" data-d="-1">−</button> <b id="cc-${m.id}">0</b> <button data-c="${m.id}" data-d="1">+</button></span></div>`).join('');
$('#caff').onclick = e => { const b = e.target.closest('[data-c]'); if (!b) return; cc[b.dataset.c] = Math.max(0, (cc[b.dataset.c] || 0) + +b.dataset.d); $('#cc-' + b.dataset.c).textContent = cc[b.dataset.c]; const t = CAFF.reduce((a, m) => a + (cc[m.id] || 0) * m.caf, 0); $('#caffBar').style.width = Math.min(100, t / 400 * 100) + '%'; $('#caffText').textContent = `${t} mg of the 400 mg daily guideline for healthy adults` + (t > 400 ? ': over the limit!' : ''); };

/* ---------- origins, team, events, reviews ---------- */
$('#originList').innerHTML = ORIGINS.map(o => `<div class="origin" data-reveal><big>${o[0]}</big><h3>${o[1]}</h3><b>${o[2]}</b><p class="muted">${o[3]}</p></div>`).join('');
$('#teamGrid').innerHTML = TEAM.map(t => `<div class="flip" tabindex="0"><div><div class="f"><big>${t[0]}</big><h3>${t[1]}</h3><span class="muted">${t[2]}</span></div><div class="b"><p>${t[3]}</p></div></div></div>`).join('');
$('#teamGrid').onclick = e => e.target.closest('.flip')?.classList.toggle('on');
const evDate = off => { const d = new Date(); d.setDate(d.getDate() + off); return d; };
$('#eventList').innerHTML = EVENTS.map((e, i) => { const d = evDate(e[1]); return `<div class="event" data-reveal><div class="d">${d.toLocaleString('en', { month: 'short' })}<small>${d.getDate()}</small></div><div><b>${e[0]}</b><br><span class="muted">${e[2]} · ${e[3]}</span></div><button class="btn ghost" data-ics="${i}">+ Calendar</button></div>`; }).join('');
$('#eventList').onclick = e => {
  const b = e.target.closest('[data-ics]'); if (!b) return; const ev = EVENTS[b.dataset.ics], d = evDate(ev[1]), [h, m] = ev[2].split(':'); d.setHours(h, m, 0);
  const z = x => x.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nSUMMARY:${ev[0]} @ Melted-Bean\r\nDTSTART:${z(d)}\r\nDTEND:${z(new Date(+d + 36e5))}\r\nDESCRIPTION:${ev[3]}\r\nEND:VEVENT\r\nEND:VCALENDAR`;
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = 'melted-bean-event.ics'; a.click(); toast('Calendar file downloaded');
};
$('#carousel').innerHTML = REVIEWS.map((r, i) => `<div class="quote ${i ? '' : 'on'}">${r[0]}<small>— ${r[1]}</small></div>`).join('');
$('#dots').innerHTML = REVIEWS.map((_, i) => `<button class="${i ? '' : 'on'}" data-i="${i}" aria-label="Review ${i + 1}"></button>`).join('');
let ri = 0, rt;
function showReview(i) { ri = i; $$('.quote').forEach((q, j) => q.classList.toggle('on', j === i)); $$('#dots button').forEach((d, j) => d.classList.toggle('on', j === i)); }
function autoReview() { clearInterval(rt); rt = setInterval(() => showReview((ri + 1) % REVIEWS.length), 5000); }
$('#dots').onclick = e => { const b = e.target.closest('[data-i]'); if (b) { showReview(+b.dataset.i); autoReview(); } }; autoReview();

/* ---------- subscription & gift cards ---------- */
const subCalc = () => { const p = +$('#sBag').value * +$('#sFreq').value; $('#sPrice').textContent = p.toFixed(2); return p; };
['sRoast', 'sBag', 'sFreq'].forEach(i => $('#' + i).oninput = subCalc); subCalc();
$('#sAdd').onclick = () => addLine({ key: 'sub:' + $('#sRoast').value + $('#sBag').value + $('#sFreq').value, name: 'Subscription: ' + $('#sRoast').value, note: $('#sFreq').selectedOptions[0].text + ' · ' + $('#sBag').selectedOptions[0].text, price: +subCalc().toFixed(2) });
let giftAmt = 25;
$('#giftAmts').innerHTML = [10, 25, 50, 100].map(a => `<button class="chip ${a === 25 ? 'on' : ''}" data-a="${a}">$${a}</button>`).join('');
$('#giftAmts').onclick = e => { const b = e.target.closest('[data-a]'); if (!b) return; giftAmt = +b.dataset.a; $$('#giftAmts .chip').forEach(x => x.classList.toggle('on', x === b)); $('#giftPreviewAmt').textContent = '$' + giftAmt; };
$('#giftMsg').oninput = e => $('#giftPreviewMsg').textContent = e.target.value || 'Enjoy a cup on me!';
$('#giftAdd').onclick = () => addLine({ key: 'gift:' + giftAmt + $('#giftTo').value + $('#giftMsg').value, name: 'Gift card' + ($('#giftTo').value ? ' for ' + $('#giftTo').value : ''), note: $('#giftMsg').value, price: giftAmt });

/* ---------- loyalty ---------- */
let stamps = store.get('stamps', 0);
function renderStamps() {
  $('#stamps').innerHTML = Array.from({ length: 10 }, (_, i) => `<div class="stamp ${i < stamps % 10 || (stamps && stamps % 10 === 0 && stamps >= 10 && false) ? 'on' : ''}">${i < stamps % 10 ? '☕' : i === 9 ? '🎁' : ''}</div>`).join('');
  const free = Math.floor(stamps / 10);
  $('#stampText').textContent = `${stamps % 10}/10 stamps · ${free} free drink${free === 1 ? '' : 's'} earned`;
}
function addStamps(n) { const before = Math.floor(stamps / 10); stamps += n; store.set('stamps', stamps); renderStamps(); if (Math.floor(stamps / 10) > before) { toast('Free drink unlocked! 🎁'); burst(['🎁', '☕'], 20); } }
$('#stampAdd').onclick = () => addStamps(1); $('#stampReset').onclick = () => { stamps = 0; store.set('stamps', 0); renderStamps(); };
renderStamps();

/* ---------- forms ---------- */
const rd = $('#resDate'); rd.min = new Date().toISOString().split('T')[0]; rd.value = rd.min;
$('#resForm').onsubmit = e => {
  e.preventDefault(); const f = new FormData(e.target), list = store.get('reservations', []); list.push(Object.fromEntries(f)); store.set('reservations', list);
  $('#resOut').textContent = `Table for ${f.get('guests')} requested on ${f.get('date')} at ${f.get('time')}. We'll confirm by email.`; toast('Reservation requested ✔'); e.target.reset(); rd.value = rd.min;
};
$('#newsForm').onsubmit = e => { e.preventDefault(); store.set('news', $('#newsEmail').value); burst(['💌', '☕']); toast('You’re on the list!'); e.target.reset(); };
$('#contactForm').onsubmit = e => { e.preventDefault(); location.href = `mailto:hello@melted-bean.example?subject=${encodeURIComponent('Hello from ' + $('#cName').value)}&body=${encodeURIComponent($('#cMsg').value)}`; };

/* ---------- share ---------- */
$('#shareBtn').onclick = async () => {
  const data = { title: 'Melted-Bean', text: 'Coffee that melts into your day ☕', url: location.href };
  try { navigator.share ? await navigator.share(data) : (await navigator.clipboard.writeText(location.href), toast('Link copied')); } catch {}
};

/* ---------- nav, scroll, reveal, counters ---------- */
$('#burger').onclick = () => { const o = $('#links').classList.toggle('open'); $('#burger').setAttribute('aria-expanded', o); };
$('#links').onclick = () => $('#links').classList.remove('open');
const secs = $$('main section[id]');
addEventListener('scroll', () => {
  const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
  $('#progress').style.width = (y / h * 100) + '%';
  $('#nav').classList.toggle('scrolled', y > 40); $('#toTop').classList.toggle('show', y > 700);
  const cur = secs.filter(s => s.offsetTop - 120 <= y).pop();
  $$('#links a').forEach(a => a.classList.toggle('active', cur && a.hash === '#' + cur.id));
  if (!reduceMotion) { const hc = $('#heroCanvas'); hc.style.transform = `translateY(${y * .25}px)`; }
}, { passive: true });
$('#toTop').onclick = () => scrollTo({ top: 0 });
const rio = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); rio.unobserve(en.target); const c = $('[data-count]', en.target); if (c) count(c); } }), { threshold: .15 });
new MutationObserver(() => $$('[data-reveal]:not(.seen)').forEach(el => { el.classList.add('seen'); rio.observe(el); })).observe(document.body, { childList: true, subtree: true });
$$('[data-reveal]').forEach(el => { el.classList.add('seen'); rio.observe(el); });
function count(el) {
  const to = +el.dataset.count, dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || '', t0 = performance.now();
  (function step(t) { const p = Math.min(1, (t - t0) / 1600), e = 1 - Math.pow(1 - p, 3); el.textContent = (to * e).toLocaleString('en', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf; if (p < 1) requestAnimationFrame(step); })(t0);
}

/* ---------- cursor ---------- */
const cur = $('#cursor');
addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; cur.classList.add('on'); cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px'; });
document.addEventListener('pointerover', e => { cur.style.width = cur.style.height = e.target.closest('a,button,.item,.flip,img') ? '30px' : '18px'; });

/* ---------- hero canvas: steam + floating beans ---------- */
(function hero() {
  const c = $('#heroCanvas'), ctx = c.getContext('2d'); let w, h, ps = [];
  const resize = () => { w = c.width = c.offsetWidth; h = c.height = c.offsetHeight; }; resize(); addEventListener('resize', resize);
  const mk = (bean) => ({ x: Math.random() * w, y: h + Math.random() * 100, r: bean ? 8 + Math.random() * 12 : 20 + Math.random() * 50, v: .3 + Math.random() * .8, a: Math.random() * 6, bean, o: bean ? .5 : .06 + Math.random() * .08 });
  for (let i = 0; i < 70; i++) { const p = mk(i % 4 === 0); p.y = Math.random() * h; ps.push(p); }
  let mx = .5; $('.hero').addEventListener('pointermove', e => mx = e.clientX / innerWidth);
  (function loop() {
    ctx.clearRect(0, 0, w, h);
    for (const p of ps) {
      p.y -= p.v; p.a += .01; p.x += Math.sin(p.a) * .6 + (mx - .5) * .5;
      if (p.y < -80) Object.assign(p, mk(p.bean));
      ctx.save(); ctx.globalAlpha = p.o; ctx.translate(p.x, p.y);
      if (p.bean) { ctx.rotate(p.a); ctx.fillStyle = '#c8864b'; ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * .65, 0, 0, 7); ctx.fill(); ctx.strokeStyle = '#2b1810'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-p.r * .8, 0); ctx.quadraticCurveTo(0, p.r * .3, p.r * .8, 0); ctx.stroke(); }
      else { const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.r); g.addColorStop(0, '#fff'); g.addColorStop(1, 'transparent'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, p.r, 0, 7); ctx.fill(); }
      ctx.restore();
    }
    if (!reduceMotion) requestAnimationFrame(loop);
  })();
})();

/* ---------- ambience (generated brown noise, no audio files) ---------- */
let actx, node, gain;
$('#ambience').onclick = e => {
  const btn = e.currentTarget, on = btn.getAttribute('aria-pressed') !== 'true';
  if (on) {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const buf = actx.createBuffer(1, actx.sampleRate * 4, actx.sampleRate), d = buf.getChannelData(0); let last = 0;
    for (let i = 0; i < d.length; i++) { const wn = Math.random() * 2 - 1; d[i] = (last + .02 * wn) / 1.02; last = d[i]; d[i] *= 3.5; }
    node = actx.createBufferSource(); node.buffer = buf; node.loop = true;
    const lp = actx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700; gain = actx.createGain(); gain.gain.value = .25;
    node.connect(lp).connect(gain).connect(actx.destination); node.start(); toast('Café ambience on 🎧');
  } else { node && node.stop(); toast('Ambience off'); }
  btn.setAttribute('aria-pressed', on);
};

/* ---------- keyboard, easter egg, cookie, misc ---------- */
addEventListener('keydown', e => {
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
  if (e.key === 'Escape') { openCart(false); $$('dialog[open]').forEach(d => d.close()); }
  if (typing || e.metaKey || e.ctrlKey) return;
  const k = e.key.toLowerCase();
  if (k === 'c') openCart(!$('#cart').classList.contains('open'));
  if (k === 't') toggleTheme();
  if (k === '/') { e.preventDefault(); $('#menu').scrollIntoView(); $('#search').focus(); }
  if (k === '?') $('#help').showModal();
});
const KONAMI = 'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a'.split(','); let kp = 0;
addEventListener('keydown', e => { kp = e.key === KONAMI[kp] ? kp + 1 : 0; if (kp === KONAMI.length) { kp = 0; burst(['☕', '🫘', '🥐', '🍪'], 70); toast('☕ Secret unlocked: free cookie with any drink! (show this)'); } });
if (store.get('cookie', false)) $('#cookie').classList.add('hide');
$('#cookieOk').onclick = () => { store.set('cookie', true); $('#cookie').classList.add('hide'); };
$('#yr').textContent = new Date().getFullYear();
if (location.protocol.startsWith('http') && 'serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
addEventListener('beforeprint', () => $$('[data-reveal]').forEach(e => e.classList.add('in')));

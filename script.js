const $ = s => document.querySelector(s);
const L = C.links;

// ---------- الوضع الليلي / النهاري ----------
const root = document.documentElement, tb = $("#theme");
let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) {}
const setTheme = t => { root.dataset.theme = t; tb.textContent = t === "dark" ? "☀" : "☾"; };
setTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
tb.onclick = () => {
  const t = root.dataset.theme === "dark" ? "light" : "dark";
  setTheme(t);
  try { localStorage.setItem("theme", t); } catch (e) {}
};

// ---------- بناء الصفحة من content.js ----------
const rv = (h, d = 0) => `<div class="rv" style="--d:${d}s">${h}</div>`;
const dl = `<a class="btn" href="${L.mac}">${ico("apple", 20)} ${C.hero.mac}</a><a class="btn o" href="${L.win}">${ico("windows", 18)} ${C.hero.win}</a>`;
$("#nav").innerHTML = C.nav.map(n => `<a href="${n[1]}">${n[0]}</a>`).join("");
$("#glyphs").innerHTML = [..."حhمlكج;ضqشaع"].map((g, i) => `<span style="top:${(i * 37) % 90}%;${i % 2 ? "left" : "right"}:${(i * 13) % 40}%;animation-delay:-${i * 1.7}s">${g}</span>`).join("");

$("#hero").innerHTML = `<h1>${C.hero.title}</h1><p class="sub">${C.hero.sub}</p>
  <div class="demo" aria-hidden="true"><span id="ty"></span><span class="caret"></span></div>
  <div class="cta">${dl}</div><p class="note">${C.hero.free}</p>`;

$("#problem").innerHTML = `<div class="center">${rv(`<h2>${C.problem.title}</h2><p class="lead">${C.problem.text}</p>`)}
  <div class="noise">${C.problem.noise.map((n, i) => `<span style="--r:${i % 2 ? 3 : -3}deg;--x:${[-14, 10, -6, 16, -12, 8][i % 6]}px;--y:${[0, 14, -8, 6, 16, -4][i % 6]}px;animation-delay:-${i * .6}s">${n}</span>`).join("")}</div></div>`;

$("#fix").innerHTML = `<div class="center">${rv(`<h2>${C.fix.title}</h2><p class="lead">${C.fix.text}</p>`)}
  <div class="fix"><div class="line" id="fl" dir="ltr">${C.fix.bad}</div>
  <button class="key wide" id="fk">${C.fix.btn}</button></div></div>`;

$("#features").innerHTML = `<h2 class="center">${C.featuresTitle}</h2>
  <div class="grid">${C.features.map((f, i) => rv(`<div class="card"><h3>${f[0]}</h3><p>${f[1]}</p></div>`, i * .12)).join("")}</div>`;

$("#apps").innerHTML = `<div class="center">${rv(`<h2>${C.appsTitle}</h2><p class="lead">${C.appsText}</p>`)}
  <div class="chips">${C.apps.map((a, i) => rv(`<div class="chip"><i style="background:${a[2]}">${a[1] ? ico(a[1], 18) : a[3]}</i>${a[0]}</div>`, i * .12)).join("")}${rv(`<div class="chip all">${C.appsAll}</div>`, .4)}</div></div>`;

$("#try").innerHTML = rv(`<div class="try"><h2>${C.try.title}</h2><p>${C.try.sub}</p>
  <textarea id="inp" placeholder="${C.try.ph}" dir="auto"></textarea><div class="out warn" id="out">—</div></div>`);

$("#video").innerHTML = rv(`<div class="center"><h2>${C.videoTitle}</h2>
  <div class="vid">${C.video ? `<iframe src="https://www.youtube-nocookie.com/embed/${C.video}" title="${C.videoTitle}" allowfullscreen loading="lazy"></iframe>` : C.videoEmpty}</div></div>`);

$("#download").innerHTML = rv(`<div class="center"><h2>${C.dl.title}</h2><p>${C.dl.text}</p>
  <div class="cta">${dl}</div><span class="soon">${C.dl.soon}</span></div>`);

$("#faq").innerHTML = `<div class="faq"><h2 class="center">${C.faqTitle}</h2>${C.faq.map((q, i) => rv(`<div class="q"><button>${q[0]}</button><div class="a"><p>${q[1]}</p></div></div>`, i * .08)).join("")}</div>`;
document.querySelectorAll(".q>button").forEach(b => b.onclick = () => b.parentNode.classList.toggle("o"));

$("#foot").innerHTML = `<div class="soc">${C.social.map(s => `<a href="${L[s[1]]}" target="_blank" rel="noopener">${ico(s[1], 18)} ${s[0]}</a>`).join("")}</div>
  <p>© 2026 Hawwel · All rights reserved.</p>
  <p>developed by <a href="${L.dev}" target="_blank" rel="noopener">Ashraf Abdulmonem</a></p>`;

// ظهور ناعم أثناء السكرول
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
document.querySelectorAll(".rv").forEach(el => io.observe(el));

// زرار الاختصار التفاعلي
let fixed = false;
const fl = $("#fl"), fk = $("#fk");
fk.onclick = () => {
  fk.classList.add("p"); fl.classList.add("sw");
  setTimeout(() => {
    fixed = !fixed; fl.dir = fixed ? "rtl" : "ltr";
    fl.textContent = fixed ? C.fix.good : C.fix.bad; fl.classList.remove("sw"); fk.classList.remove("p");
  }, 220);
};

// ---------- حركة الكتابة في الهيرو ----------
const ty = $("#ty"), sleep = ms => new Promise(r => setTimeout(r, ms));
async function loop() {
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (still) { ty.dir = "rtl"; ty.textContent = C.pairs[0][1]; return; }
  for (let i = 0; ; i = (i + 1) % C.pairs.length) {
    const [bad, good] = C.pairs[i];
    ty.dir = "ltr"; ty.textContent = "";
    for (const ch of bad) { ty.textContent += ch; await sleep(110); }
    await sleep(700);
    ty.classList.add("sel"); await sleep(650);
    ty.classList.remove("sel"); ty.dir = "rtl"; ty.textContent = good;
    await sleep(1500);
    for (let k = good.length; k >= 0; k--) { ty.textContent = good.slice(0, k); await sleep(70); }
    await sleep(350);
  }
}
loop();

// ---------- المحوّل التفاعلي (Arabic PC مبسّط) ----------
const en = "qwertyuiopasdfghjkl;'zxcvbnm,./`[]";
const ar = "ضصثقفغعهخحشسيبلاتنمكطئءؤر|ىةوزظذجد"; // "|" مكان زرار b (لا)
const E2A = {}, A2E = {};
[...en].forEach((c, i) => { E2A[c] = ar[i]; A2E[ar[i]] = c; });
E2A.b = "لا"; delete A2E["|"];
E2A["?"] = "؟"; A2E["؟"] = "?"; A2E["،"] = ","; A2E["؛"] = ";";

function convert(t) {
  const hasAr = /[\u0600-\u06FF]/.test(t), hasLat = /[A-Za-z]/.test(t);
  const other = /[^\u0600-\u06FFA-Za-z\P{L}]/u.test(t);
  if (other) return [C.try.other, true];
  if (hasAr && hasLat) return [C.try.mixed, true];
  if (hasAr) return [t.replace(/لا/g, "b").replace(/./gu, c => A2E[c] ?? c), false];
  if (hasLat) return [t.toLowerCase().replace(/./gu, c => E2A[c] ?? c), false];
  return [t || "—", !t];
}
const inp = $("#inp"), out = $("#out");
inp.addEventListener("input", () => {
  const [txt, warn] = convert(inp.value);
  out.textContent = txt; out.classList.toggle("warn", warn);
});

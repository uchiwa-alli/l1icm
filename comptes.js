/* ============================================================
   COMPTES · L1 ICM · EMIT Fianarantsoa
   Inscription (élèves de la classe uniquement), connexion,
   statistiques de visite, espace admin et profils publics
   (photo, lien Facebook, bio, statut).
   Tu n'as rien à modifier ici : tout se règle dans firebase-config.js
   © 2026 Alli · ALLI.DEV. Tous droits réservés.
   ============================================================ */
(function () {
"use strict";
var C = window.COMPTES || {}, cfg = C.firebase || {}, root = document.documentElement;
window.__authReady = true;                       /* le module a démarré (voir le filet de sécurité dans index.html) */
if (C.actif === false) {                         /* comptes désactivés volontairement : le site reste ouvert comme avant */
  root.classList.remove("locked"); var g0 = document.getElementById("gate"); if (g0) g0.remove(); return;
}
if (!(cfg.apiKey && cfg.projectId)) {            /* configuration incomplète : on bloque, on n'ouvre jamais le site */
  var g1 = document.getElementById("gate");
  if (g1) g1.innerHTML = '<div class="gi2"><p class="sub" style="text-align:center;margin-top:30vh">Le site est momentanément indisponible (configuration des comptes incomplète).</p></div>';
  return;
}
var MUST = C.obligatoire !== false;              /* connexion obligatoire, sauf si firebase-config.js met explicitement false */
if (!MUST) root.classList.remove("locked");
var DOM = C.domaine || "l1icm.app";
var $ = function (i) { return document.getElementById(i); };
function E(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
function noop() {}
function ymd(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function ms(ts) { return ts && ts.toMillis ? ts.toMillis() : 0; }
function fdt(ts) { var m = ms(ts); return m ? new Date(m).toLocaleString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"; }
function rid() { var a = new Uint8Array(12), s = ""; (window.crypto || window.msCrypto).getRandomValues(a); a.forEach(function (b) { s += ("0" + b.toString(16)).slice(-2); }); return s; }

var auth, db, user = null, prof = null, isAdmin = false, busy = false, ST = "load", notice = "", welcome = false, tracked = false, AD = {}, unsub = null, seq = 0, wasOk = false, hadSession = false;
var LAB = { actif: "Actif", attente: "En attente", suspendu: "Suspendu", banni: "Banni", refuse: "Refusé" };

/* ---------- Styles ---------- */
var css = document.createElement("style");
css.textContent = "\
#acc{margin-left:auto;border:1px solid var(--line);background:var(--surface);border-radius:99px;height:40px;padding:0 12px;font-weight:700;font-size:14px;white-space:nowrap;flex:none}\
#acc+#th{margin-left:0}\
.bar #ttl{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bar #back{white-space:nowrap;flex:none}.bar .lg{flex:none}#th{flex:none}@media(max-width:430px){.bar>img.lg{display:none}}\
#aq{width:100%;font:inherit;padding:12px 16px;border-radius:14px;border:1px solid var(--line);background:var(--surface);color:var(--ink)}\
.fm{display:grid;gap:12px;margin-top:6px}.fm label{display:grid;gap:6px;font-weight:600;font-size:14px}\
.fm input[type=text],.fm input[type=password],.fm input[type=date],.fm select,.fm textarea{width:100%;font:inherit;font-weight:400;padding:12px 14px;border-radius:14px;border:1px solid var(--line);background:var(--surface);color:var(--ink)}\
.fm .qgo{margin-top:4px;width:100%}\
.fm .chk{display:flex;flex-direction:row;gap:12px;align-items:center;font-weight:800;font-size:17px;padding:12px 14px;border:1.5px solid var(--line);border-radius:14px;background:var(--surface)}\
.fm .chk input{width:24px;height:24px;accent-color:var(--blue);flex:none}\
.msg{min-height:1.4em;margin:8px 0 0;font-size:14px;color:var(--muted)}.msg.ko{color:#e5484d;font-weight:600}.msg.ok{color:#2fa36b;font-weight:600}\
.tabs{display:flex;gap:8px;margin-bottom:12px}.tabs button{flex:1;border:1.5px solid var(--line);background:var(--surface);border-radius:14px;padding:11px 6px;font-weight:800}\
.tabs button.on{background:var(--navy);color:var(--on-navy);border-color:var(--navy)}\
.pk{display:grid;gap:6px}.pk button{display:flex;gap:10px;align-items:center;text-align:left;border:1px solid var(--line);background:var(--surface);border-radius:14px;padding:8px 10px;font-size:14px;line-height:1.3;overflow-wrap:anywhere}\
.pk button:hover{border-color:var(--blue)}.pk .hint{color:var(--muted);font-size:13px}\
.cho{display:flex;gap:12px;align-items:center;border:1.5px solid var(--blue);border-radius:14px;padding:10px 12px;background:var(--surface);font-size:14px;line-height:1.3}\
.cho span{overflow-wrap:anywhere}.cho button{margin-left:auto;border:0;background:none;color:var(--blue);font-weight:700;flex:none}\
#gate,#blk{position:fixed;inset:0;z-index:2000;background:var(--bg);overflow:auto;padding:24px 18px calc(24px + env(safe-area-inset-bottom,0px))}\
.gi2{max-width:460px;margin:0 auto}.gi2 img{width:64px;border-radius:16px;display:block;margin:6px 0 14px}\
.st{display:inline-block;border-radius:99px;padding:2px 10px;font-size:12px;font-weight:700}\
.st-actif{background:#d6f5e3;color:#14683d}.st-attente{background:#fff1c9;color:#7a5200}.st-suspendu{background:#ffe0c9;color:#8a3d00}.st-banni{background:#ffd9db;color:#a3131a}.st-refuse{background:#e6e8f0;color:#3c4060}#af{flex-wrap:wrap}#af button{flex:1 0 30%}\
.pc{display:flex;gap:14px;align-items:center;flex-wrap:wrap}.pc .av{width:64px;height:64px;margin:0}.pc .nb{min-width:70px}\
.sg{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:0 0 14px}@media(min-width:700px){.sg{grid-template-columns:repeat(4,1fr)}}\
.sc{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:12px 14px}.sc b{display:block;font-size:28px;letter-spacing:-.03em;line-height:1.1}.sc span{color:var(--muted);font-size:13px}\
.ch{display:flex;align-items:flex-end;gap:5px;height:130px;margin-top:12px}.ch div{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:3px;height:100%;font-size:10px;color:var(--muted)}\
.ch i{display:block;width:100%;border-radius:6px 6px 2px 2px;background:var(--blue);min-height:2px}.ch b{font-size:10px;color:var(--ink)}\
.pgb{height:8px;border-radius:99px;background:var(--line);overflow:hidden;margin-top:8px}.pgb i{display:block;height:100%;background:var(--blue)}\
.ar{display:flex;gap:10px;align-items:center;width:100%;text-align:left;background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:10px 12px;font-size:14px;color:var(--ink)}\
.ar .tx{min-width:0;flex:1;overflow-wrap:anywhere;line-height:1.3}.ar small{color:var(--muted)}\
.mdl{position:fixed;inset:0;z-index:20;background:rgba(10,12,40,.55);display:flex;align-items:flex-end;justify-content:center}\
@media(min-width:600px){.mdl{align-items:center;padding:20px}}\
.mc{background:var(--bg);color:var(--ink);width:100%;max-width:480px;max-height:92vh;overflow:auto;border-radius:22px 22px 0 0;padding:20px 18px calc(20px + env(safe-area-inset-bottom,0px));animation:in .3s}\
@media(min-width:600px){.mc{border-radius:22px}}\
.ab{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}.ab button{border:1.5px solid var(--line);background:var(--surface);color:var(--ink);border-radius:14px;padding:12px 8px;font-weight:700}\
.ab button.dg{border-color:#e5484d;color:#e5484d}.ab button.pr{background:var(--navy);color:var(--on-navy);border-color:var(--navy)}.ab button:disabled{opacity:.5}\
.rt{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}.rt button{border:1px solid var(--line);background:var(--surface);border-radius:99px;padding:8px 14px;font-weight:700;font-size:13px}\
#people .row{cursor:pointer}#people .row:active{opacity:.85}#people .row:focus-visible{outline:2px solid var(--blue)}\
.pc .av img,.pfav img,.pfav svg,.pfed .av img,.pfed .av svg{width:100%;height:100%;object-fit:cover;display:block}\
.pfv{text-align:center}.pfv h3{margin:0;font-size:20px;line-height:1.25;overflow-wrap:anywhere}\
.pfav{width:104px;height:104px;margin:4px auto 12px;font-size:34px}\
.pfm{display:flex;justify-content:center;align-items:center;gap:10px;flex-wrap:wrap;margin-top:10px}.pfm .chip{margin:0}\
.pfrel{border-radius:99px;padding:5px 14px;font-weight:700;font-size:14px;background:var(--surface);border:1px solid var(--line)}\
.pfbio{margin:14px 0 0;text-align:left;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.45;font-size:15px;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:12px 14px}\
.pfbio.vide{color:var(--muted);text-align:center}\
.pffb{display:block;margin-top:12px;text-align:center;text-decoration:none;border-radius:14px;padding:13px 10px;font-weight:800;background:var(--navy);color:var(--on-navy)}\
.pfed{display:flex;gap:14px;align-items:center;flex-wrap:wrap}.pfed .av{width:76px;height:76px;margin:0;flex:none;font-size:26px}\
.pfed .bt{display:flex;gap:8px;flex-wrap:wrap}.pfed .bt button,.pfed .bt label{border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:99px;padding:9px 14px;font-weight:700;font-size:13px;cursor:pointer}\
.pfcnt{margin:-6px 2px 0;text-align:right;font-size:12px;color:var(--muted)}\
.cfc{margin-bottom:10px}.cft{margin:0 0 8px;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.45;font-size:16px}\
.cfa{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.cfa button{border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:99px;padding:7px 13px;font-weight:700;font-size:13px}.cfa button.on{background:var(--navy);color:var(--on-navy);border-color:var(--navy)}.cfa button.dg{border-color:#e5484d;color:#e5484d}.cfa button:disabled{opacity:.6}\
.cfk{margin-top:12px;border-top:1px solid var(--line);padding-top:10px;display:grid;gap:8px}.cfq{font-size:14px;line-height:1.35;overflow-wrap:anywhere}.cfx{border:0;background:none;font-size:13px}\
.cfcf{display:flex;gap:8px}.cfcf input{flex:1;min-width:0;font:inherit;padding:10px 12px;border-radius:12px;border:1px solid var(--line);background:var(--surface);color:var(--ink)}.cfcf button{border:0;border-radius:12px;padding:0 14px;font-weight:800;background:var(--navy);color:var(--on-navy)}\
";
document.head.appendChild(css);

/* ---------- Éléments d'interface ---------- */
var acc = document.createElement("button");
acc.id = "acc"; acc.setAttribute("aria-label", "Mon compte"); acc.textContent = "👤";
acc.onclick = function () { location.hash = "compte"; };
document.querySelector(".bar").insertBefore(acc, $("th"));

function mkTile(id, ico, b, s) {
  var el = document.createElement("button");
  el.className = "tile"; el.id = id;
  el.innerHTML = "<i>" + ico + "</i><b></b><span></span>";
  el.onclick = function () { location.hash = { "t-adm": "admin", "t-conf": "conf" }[id] || "compte"; };
  $("tiles").appendChild(el);
  return el;
}
var tAcc = mkTile("t-acc", "👤"), tConf = mkTile("t-conf", "💌"), tAdm = mkTile("t-adm", "🛡️");
tAdm.hidden = true; tConf.hidden = true;

function mkSec(id) { var s = document.createElement("section"); s.className = "view"; s.id = id; $("app").appendChild(s); return s; }
mkSec("v-compte"); mkSec("v-admin"); mkSec("v-conf");
var gate = $("gate"); if (!gate) { gate = document.createElement("div"); gate.id = "gate"; document.body.appendChild(gate); }
var blk = document.createElement("div"); blk.id = "blk"; blk.hidden = true; document.body.appendChild(blk);

title.compte = "Mon compte"; title.admin = "Espace admin"; title.conf = "Confessions";
var _go = window.go;
window.go = function (v) {
  if (MUST && !allowed()) return;                /* aucune page interne sans compte actif, même en tapant l'URL (#admin, #quiz…) */
  if (v === "admin" && !isAdmin) { if (ST === "load") { _go("compte"); return; } location.hash = "compte"; return; }
  _go(v);
  if (v === "cls") loadProfils();
  if (v === "conf") viewConf();
  if (v === "compte") viewCompte();
  if (v === "admin") loadAdmin();
};

/* ---------- Firebase ---------- */
function loadScript(src) { return new Promise(function (ok, ko) { var s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = ko; document.head.appendChild(s); }); }
var BASE = "https://www.gstatic.com/firebasejs/10.12.5/firebase-";
loadScript(BASE + "app-compat.js")
  .then(function () { return Promise.all([loadScript(BASE + "auth-compat.js"), loadScript(BASE + "firestore-compat.js")]); })
  .then(function () {
    firebase.initializeApp(cfg); auth = firebase.auth(); db = firebase.firestore();
    auth.onAuthStateChanged(onAuth);
  })
  .catch(function () { ST = "err"; notice = "Impossible de joindre le serveur. Vérifie ta connexion."; render(); });
setTimeout(function () { if (ST === "load") { ST = "err"; notice = "Le serveur met trop de temps à répondre."; render(); } }, 20000);
render();

function fr(e) {
  var c = (e && e.code) || "";
  return ({
    "auth/invalid-credential": "Numéro ou mot de passe incorrect.",
    "auth/wrong-password": "Numéro ou mot de passe incorrect.",
    "auth/user-not-found": "Numéro ou mot de passe incorrect.",
    "auth/invalid-email": "Numéro ou e-mail invalide.",
    "auth/too-many-requests": "Trop d’essais. Réessaie dans quelques minutes.",
    "auth/network-request-failed": "Pas de connexion internet.",
    "auth/weak-password": "Mot de passe trop court (6 caractères minimum).",
    "auth/requires-recent-login": "Reconnecte-toi puis réessaie.",
    "auth/operation-not-allowed": "La connexion par e-mail/mot de passe n’est pas activée dans Firebase.",
    "permission-denied": "Refusé par le serveur (règles Firestore). Vérifie qu’elles sont bien publiées.",
    "unavailable": "Serveur injoignable. Vérifie ta connexion.",
    "deja": "Ce numéro a déjà un compte, avec un autre mot de passe. Va dans « Connexion ». Mot de passe oublié ? Contacte l’admin."
  })[c] || (e && e.message) || "Une erreur est survenue.";
}
function eff(p) { if (p.statut === "suspendu" && p.jusqua && ms(p.jusqua) && ms(p.jusqua) < Date.now()) return "actif"; return p.statut; }
function rowByNum(n) { for (var i = 0; i < ROWS.length; i++) if (ROWS[i].nums.indexOf(n) > -1) return ROWS[i]; return null; }
function nbHTML(r) { return '<div class="nb g' + r.g + '"><b' + (r.nums.length > 1 ? ' class="m"' : "") + ">" + r.nums.join(" · ") + "</b><small>GROUPE " + r.g + "</small></div>"; }
function nbU(u) { var g = u.num <= G1 ? 1 : 2; return '<div class="nb g' + g + '"><b>' + u.num + "</b><small>GROUPE " + g + "</small></div>"; }

/* ---------- Authentification ---------- */
/* Accès autorisé = administrateur (document admins/<uid> lu sur Firestore) OU élève dont le profil est « actif ».
   Les règles Firestore refont la même vérification côté serveur : ce code ne fait que l'affichage. */
function allowed() { return ST === "in" && (isAdmin || (!!prof && eff(prof) === "actif")); }
function stopWatch() { if (unsub) { try { unsub(); } catch (e) {} unsub = null; } }
function wipe() {                                /* efface tout ce qui est privé quand la session se termine */
  AD = {}; welcome = false; pfDirty = false; pfPhoto = ""; pubAt = 0; pubSt = 0;
  Object.keys(PUB).forEach(function (k) { delete PUB[k]; }); if (typeof pp === "function") pp();
  $("v-admin").innerHTML = ""; $("v-compte").innerHTML = ""; $("v-conf").innerHTML = ""; CF = { posts: [], auth: {}, pend: [], mine: [], com: {}, open: {} };
  _go("home");
  try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
}
function onAuth(u) {
  if (busy) return Promise.resolve();
  var tok = ++seq; stopWatch();
  user = u; prof = null; isAdmin = false;
  if (!u) { ST = "out"; if (hadSession) { hadSession = false; wipe(); } render(); return Promise.resolve(); }
  hadSession = true; ST = "load"; render();      /* pendant la vérification : écran « Chargement… » uniquement */
  return db.doc("admins/" + u.uid).get().then(function (a) {
    if (tok !== seq) return;
    if (a.exists) { isAdmin = true; ST = "in"; render(); return; }
    var m = (u.email || "").toLowerCase().match(/^(\d{1,3})@(.+)$/);
    if (!m || m[2] !== DOM) { notice = "Ce compte n’est pas autorisé sur ce site."; return auth.signOut(); }
    return watch(m[1], tok);
  }).catch(function (e) { if (tok !== seq) return; ST = "err"; notice = fr(e); render(); });
}
function watch(num, tok) {                       /* suit le profil en direct : une suspension ou un bannissement s'applique tout de suite */
  return new Promise(function (resolve) {
    var firstSnap = true;
    unsub = db.doc("users/" + num).onSnapshot(function (s) {
      if (tok !== seq) { resolve(); return; }
      if (!s.exists && s.metadata && s.metadata.fromCache) { ST = "err"; notice = "Pas de connexion internet. Réessaie."; render(); resolve(); return; }
      if (!s.exists) { stopWatch(); notice = "Ce compte n’existe plus. Inscris-toi à nouveau ou contacte l’admin."; auth.signOut(); resolve(); return; }
      prof = s.data(); prof.id = num; ST = "in";
      if (firstSnap) { firstSnap = false; bump(num); }
      render(); resolve();
    }, function (e) { if (tok === seq) { ST = "err"; notice = fr(e); render(); } resolve(); });
  });
}
function bump(num) {
  try { if (!sessionStorage.getItem("l1icm_t")) { sessionStorage.setItem("l1icm_t", "1"); var F = firebase.firestore.FieldValue; db.doc("users/" + num).update({ derniereConnexion: F.serverTimestamp(), connexions: F.increment(1) }).catch(noop); } } catch (e) {}
}
function first() { if (!tracked) { tracked = true; if (!isAdmin) track(); } }

function login(idv, pw) {
  idv = idv.trim(); var email;
  if (idv.indexOf("@") > -1) email = idv.toLowerCase();
  else {
    var r = /^\d+$/.test(idv) ? rowByNum(+idv) : null;
    if (!r) return Promise.reject({ message: "Numéro introuvable. Utilise ton N° sur la liste de la classe." });
    email = r.nums[0] + "@" + DOM;
  }
  return auth.signInWithEmailAndPassword(email, pw);
}
function register(r, pw) {
  var num = r.nums[0], email = num + "@" + DOM; busy = true;
  var cred = auth.createUserWithEmailAndPassword(email, pw).catch(function (e) {
    if (e.code === "auth/email-already-in-use") return auth.signInWithEmailAndPassword(email, pw).catch(function () { throw { code: "deja" }; });
    throw e;
  });
  return cred.then(function () {
    var ref = db.doc("users/" + num);
    return ref.get().then(function (s) {
      if (s.exists) return;
      var F = firebase.firestore.FieldValue;
      return ref.set({ num: +num, nom: r.n, groupe: r.g, statut: "attente", jusqua: null, bgAdmin: true, note: "", creeLe: F.serverTimestamp(), derniereConnexion: F.serverTimestamp(), connexions: 1 });
    });
  }).then(function () { busy = false; welcome = true; return onAuth(auth.currentUser); })
    .catch(function (e) { busy = false; if (auth.currentUser) auth.signOut().catch(noop); throw e; });
}

function authUI(box, mode) {
  mode = mode || "login";
  var h = '<div class="tabs"><button data-m="login"' + (mode === "login" ? ' class="on"' : "") + '>Connexion</button><button data-m="reg"' + (mode === "reg" ? ' class="on"' : "") + ">Inscription</button></div>";
  if (notice) { h += '<p class="msg ko">' + E(notice) + "</p>"; notice = ""; }
  if (mode === "login") {
    h += '<form class="fm"><label>N° de liste<input type="text" name="ident" inputmode="numeric" autocomplete="username" placeholder="ex. 194" required></label>' +
      '<label>Mot de passe<input type="password" name="pw" autocomplete="current-password" required></label>' +
      '<button class="qgo" type="submit">Se connecter</button><p class="msg f"></p></form>';
  } else {
    h += '<p class="sub" style="margin:0 0 6px;font-size:14px">Réservé aux élèves de la classe. Retrouve ton nom dans la liste.</p>' +
      '<form class="fm"><label>Ton nom ou ton numéro<input type="text" name="s" autocomplete="off" placeholder="ex. RAKOTO ou 194"></label>' +
      '<div class="pk"></div><div class="cho" hidden></div>' +
      '<label>Mot de passe (6 caractères minimum)<input type="password" name="pw" autocomplete="new-password" required></label>' +
      '<label>Confirmer le mot de passe<input type="password" name="pw2" autocomplete="new-password" required></label>' +
      '<label class="chk"><input type="checkbox" name="bg"><span>Bg ny admin</span></label>' +
      '<button class="qgo" type="submit">Créer mon compte</button><p class="msg f"></p></form>';
  }
  box.innerHTML = h;
  box.querySelectorAll(".tabs button").forEach(function (b) { b.onclick = function () { authUI(box, b.dataset.m); }; });
  var f = box.querySelector("form"), m = box.querySelector(".msg.f"), btn = f.querySelector(".qgo");
  function say(t, k) { m.className = "msg f" + (k ? " " + k : ""); m.textContent = t; }
  if (mode === "login") {
    f.onsubmit = function (e) {
      e.preventDefault(); say("Connexion…"); btn.disabled = true;
      login(f.elements.ident.value, f.elements.pw.value).then(function () { say(""); }).catch(function (er) { say(fr(er), "ko"); btn.disabled = false; });
    };
    return;
  }
  var sel = null, s = f.elements.s, pk = box.querySelector(".pk"), cho = box.querySelector(".cho");
  s.oninput = function () {
    var q = s.value.trim(); pk.innerHTML = "";
    var isN = /^\d+$/.test(q); if (!q || (!isN && q.length < 2)) return;
    var k = nkey(q), L = ROWS.filter(function (r) { return isN ? r.nums.indexOf(+q) > -1 : nkey(r.n).indexOf(k) > -1; }).slice(0, 6);
    pk.innerHTML = L.length ? L.map(function (r) { return '<button type="button" data-i="' + ROWS.indexOf(r) + '">' + nbHTML(r) + "<span>" + E(r.n) + "</span></button>"; }).join("")
      : '<span class="hint">Aucun élève trouvé. Seuls les élèves de la liste de la classe peuvent s’inscrire.</span>';
    pk.querySelectorAll("button").forEach(function (b) {
      b.onclick = function () {
        sel = ROWS[+b.dataset.i]; pk.innerHTML = ""; s.parentNode.hidden = true; cho.hidden = false;
        cho.innerHTML = nbHTML(sel) + "<span>" + E(sel.n) + '</span><button type="button">Changer</button>';
        cho.querySelector("button").onclick = function () { sel = null; cho.hidden = true; s.parentNode.hidden = false; s.value = ""; s.focus(); };
      };
    });
  };
  f.onsubmit = function (e) {
    e.preventDefault();
    if (!sel) return say("Choisis ton nom dans la liste de la classe.", "ko");
    var pw = f.elements.pw.value;
    if (pw.length < 6) return say("Mot de passe trop court (6 caractères minimum).", "ko");
    if (pw !== f.elements.pw2.value) return say("Les deux mots de passe sont différents.", "ko");
    if (!f.elements.bg.checked) return say("Tu dois cocher « Bg ny admin » pour t’inscrire.", "ko");
    say("Création du compte…"); btn.disabled = true;
    register(sel, pw).catch(function (er) { say(fr(er), "ko"); btn.disabled = false; });
  };
}

/* ---------- Affichage ---------- */
function render() {
  var ok = allowed(), blocked = ST === "in" && !isAdmin && !!prof && !ok;
  acc.textContent = ok ? (isAdmin ? "🛡️" : "👤 " + prof.num) : "👤";
  tAcc.querySelector("b").textContent = ok ? "Mon compte" : "Compte";
  tAcc.querySelector("span").textContent = ok ? (isAdmin ? "Connecté en admin" : "N° " + prof.num + " · Groupe " + (prof.num <= G1 ? 1 : 2)) : "Connexion · Inscription";
  tAdm.hidden = !(ok && isAdmin);
  tConf.hidden = !ok; tConf.querySelector("b").textContent = "Confessions"; tConf.querySelector("span").textContent = isAdmin ? "Valider et modérer" : "Anonyme · validé par l’admin";
  tAdm.querySelector("b").textContent = "Espace admin";
  tAdm.querySelector("span").textContent = "Statistiques et comptes";

  root.classList.toggle("locked", MUST && !ok);  /* tant que l'accès n'est pas confirmé, l'intro et le site restent cachés */
  var needGate = MUST && !ok && !blocked;
  gate.hidden = !needGate;
  if (needGate) {
    var g = '<div class="gi2"><img src="' + LOGO + '" alt=""><h2>L1 ICM</h2><p class="sub">Connecte-toi avec ton compte de la classe pour accéder au site.</p><div class="card" id="gb">';
    if (ST === "load") g += "Chargement…"; else if (ST === "err") g += '<p class="msg ko">' + E(notice || "Impossible de joindre le serveur.") + '</p><button class="qgo" onclick="location.reload()">Réessayer</button>';
    gate.innerHTML = g + "</div></div>";
    if (ST === "out") authUI($("gb"));
  }
  blk.hidden = !blocked;
  if (blocked) {
    var s = eff(prof), T = {
      banni: ["⛔", "Compte banni", "Ton compte a été banni par l’admin. Pour toute question, contacte l’admin."],
      refuse: ["❌", "Inscription refusée", "Ton inscription a été refusée par l’admin. Pour toute question, contacte l’admin."],
      suspendu: ["⏸️", "Compte suspendu", (prof.jusqua ? "Ton compte est suspendu jusqu’au " + fdt(prof.jusqua) + "." : "Ton compte est suspendu jusqu’à nouvel ordre.") + " Pour toute question, contacte l’admin."],
      attente: ["⏳", "Compte en attente", "Votre compte est en attente de validation par l’administrateur. Cet écran se met à jour tout seul dès la validation."]
    }, t = T[s] || ["⛔", "Accès refusé", "Ce compte n’a pas accès au site. Contacte l’admin."];
    blk.innerHTML = '<div class="gi2"><div class="card" style="text-align:center"><div style="font-size:56px">' + t[0] + "</div><h2>" + t[1] + '</h2><p class="sub" style="margin:0 auto 6px">' + t[2] + '</p><button class="qgo" id="blko">Se déconnecter</button></div></div>';
    $("blko").onclick = function () { auth.signOut(); };
  }
  if (ok && !wasOk) { wasOk = true; first(); loadProfils(true); route(); }
  wasOk = ok;
  if ($("v-compte").classList.contains("on")) viewCompte();
}

function viewCompte() {
  var b = $("v-compte"), h = "<h2>Mon compte</h2>";
  if (MUST && !allowed()) { b.innerHTML = ""; return; }
  if (ST === "load") { b.innerHTML = h + '<p class="sub">Chargement…</p>'; return; }
  if (ST === "err") { b.innerHTML = h + '<div class="card"><p class="msg ko">' + E(notice || "Impossible de joindre le serveur.") + '</p><button class="qgo" onclick="location.reload()">Réessayer</button></div>'; return; }
  if (ST === "out") { b.innerHTML = h + '<p class="sub">Inscris-toi avec ton nom de la liste de la classe pour créer ton compte.</p><div class="card" id="ab"></div>'; authUI($("ab")); return; }
  if (isAdmin) {
    b.innerHTML = h + '<div class="card"><span class="chip">Admin</span><p style="margin:0 0 4px"><b>Connecté en administrateur</b></p><p class="sub" style="margin:0">' + E(user.email) + '</p><div class="ab"><button class="pr" id="go-adm">🛡️ Espace admin</button><button id="lo">Se déconnecter</button></div></div>';
    $("go-adm").onclick = function () { location.hash = "admin"; }; $("lo").onclick = function () { auth.signOut(); };
    return;
  }
  if ($("pfbox") && pfDirty) return;             /* ne pas écraser ce que l'élève est en train de saisir */
  var p = nm(prof.nom), s = eff(prof);
  b.innerHTML = h + (welcome ? '<div class="ban">Bienvenue ! Ton compte est créé ✅</div>' : "") +
    '<div class="card"><div class="pc"><div class="av" id="pcav">' + myAv() + "</div>" + nbU(prof) + '<div style="min-width:0;flex:1"><b>' + E(p[0]) + "</b> " + E(p[1]) + '<br><span class="st st-' + s + '">' + LAB[s] + "</span></div></div>" +
    '<p class="sub" style="margin:14px 0 0;font-size:14px">Inscrit le ' + fdt(prof.creeLe) + "</p>" +
    '<div class="ab"><button id="pwb">🔑 Changer le mot de passe</button><button id="lo">Se déconnecter</button></div><div id="pwf"></div></div><div class="card" id="pfbox" style="margin-top:14px"></div>';
  $("lo").onclick = function () { auth.signOut(); };
  profilForm();
  $("pwb").onclick = function () {
    var z = $("pwf"); if (z.innerHTML) { z.innerHTML = ""; return; }
    z.innerHTML = '<form class="fm" style="margin-top:14px"><label>Mot de passe actuel<input type="password" name="o" autocomplete="current-password" required></label><label>Nouveau mot de passe<input type="password" name="n" autocomplete="new-password" required></label><button class="qgo" type="submit">Enregistrer</button><p class="msg"></p></form>';
    var f = z.querySelector("form"), m = z.querySelector(".msg");
    f.onsubmit = function (e) {
      e.preventDefault(); if (f.elements.n.value.length < 6) { m.className = "msg ko"; m.textContent = "Mot de passe trop court (6 caractères minimum)."; return; }
      m.className = "msg"; m.textContent = "…";
      user.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(user.email, f.elements.o.value))
        .then(function () { return user.updatePassword(f.elements.n.value); })
        .then(function () { m.className = "msg ok"; m.textContent = "Mot de passe modifié ✅"; f.reset(); })
        .catch(function (er) { m.className = "msg ko"; m.textContent = fr(er); });
    };
  };
}

/* ---------- Profils publics : photo, Facebook, bio, statut ---------- */
/* Stockés dans Firestore : profils/<N° de liste>. Lecture : élèves actifs + admin. Écriture : l'élève sur SON profil (voir firestore-profils.rules). */
var PUB = window.PROFILS = window.PROFILS || {}, pubAt = 0, pubSt = 0, pubErr = "", pfDirty = false, pfPhoto = "";
var REL = { couple: "💞 En couple", celib: "🙋 Célibataire", complique: "🤷 C’est compliqué" };
function isFbOk(u) { return typeof okFb === "function" ? okFb(u) : /^https:\/\/([a-z0-9-]+\.)*(facebook|fb)\.com\//i.test(u); }
function cleanFb(v) {
  v = (v || "").trim(); if (!v) return "";
  if (!/^https?:\/\//i.test(v)) v = "https://" + v.replace(/^\/+/, "");
  v = v.replace(/^http:\/\//i, "https://");
  try { v = new URL(v).href; } catch (e) {}
  return v;
}
function myKey() { var r = rowByNum(+prof.id); return r ? r.n : prof.nom; }
function myAv() { var d = PUB[myKey()]; return d && d.photo ? '<img alt="" src="' + E(d.photo) + '">' : av(prof.nom); }

function loadProfils(force) {
  if (!db || !allowed()) return Promise.resolve();
  if (!force && pubSt === 2 && Date.now() - pubAt < 120000) return Promise.resolve();
  if (pubSt !== 2) pubSt = 1;
  var tk = seq;
  function refresh() { if ($("v-compte").classList.contains("on") && !pfDirty) viewCompte(); }
  return db.collection("profils").get().then(function (q) {
    if (tk !== seq) return;
    var m = {};
    q.forEach(function (s) {
      var d = s.data() || {}, r = rowByNum(+s.id), o = {}; if (!r) return;
      if (typeof d.photo === "string" && d.photo.indexOf("data:image/jpeg;base64,") === 0) o.photo = d.photo;
      if (typeof d.facebook === "string" && d.facebook && isFbOk(d.facebook)) o.facebook = d.facebook;
      if (typeof d.bio === "string" && d.bio.trim()) o.bio = d.bio;
      if (REL[d.relation]) o.relation = d.relation;
      m[r.n] = o;
    });
    Object.keys(PUB).forEach(function (k) { delete PUB[k]; });
    Object.assign(PUB, m);
    pubSt = 2; pubAt = Date.now(); pubErr = "";
    if (typeof pp === "function") pp();
    refresh();
  }).catch(function (e) { if (tk !== seq) return; if (pubSt !== 2) { pubSt = 3; pubErr = fr(e); } refresh(); });
}

/* Réduit la photo en carré 220×220 JPEG (≈ 10–20 Ko) avant de l'enregistrer */
function shrink(file) {
  return new Promise(function (ok, ko) {
    var url = URL.createObjectURL(file), im = new Image();
    im.onload = function () {
      try {
        var S = 220, w = im.naturalWidth, h = im.naturalHeight, s = Math.min(w, h); if (!s) throw 0;
        var cv = document.createElement("canvas"); cv.width = cv.height = S;
        var x = cv.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, S, S);
        x.drawImage(im, (w - s) / 2, (h - s) / 2, s, s, 0, 0, S, S);
        var d = cv.toDataURL("image/jpeg", 0.8); if (d.length > 50000) d = cv.toDataURL("image/jpeg", 0.55);
        URL.revokeObjectURL(url); d.length > 50000 ? ko() : ok(d);
      } catch (e) { URL.revokeObjectURL(url); ko(e); }
    };
    im.onerror = function () { URL.revokeObjectURL(url); ko(); };
    im.src = url;
  });
}

/* Fiche d'un camarade (ouverte en touchant une ligne de « La classe ») */
window.openProfil = function (n) {
  if (MUST && !allowed()) return;
  var r = null; for (var i = 0; i < ROWS.length; i++) if (ROWS[i].n === n) { r = ROWS[i]; break; } if (!r) return;
  var me = n === ME, pr = getPr(n), p = nm(n);
  var pic = me ? window.AD : pr.photo, link = me ? FB : (typeof pr.facebook === "string" && /^https?:\/\//.test(pr.facebook) ? pr.facebook : "");
  var mine = !isAdmin && !!prof && myKey() === n;
  var h = '<div class="pfv"><div class="av pfav">' + (pic ? '<img alt="Photo de ' + E(n) + '" src="' + E(pic) + '">' : av(n)) + "</div>" +
    "<h3><b>" + E(p[0]) + "</b> " + E(p[1]) + "</h3>" +
    '<div class="pfm">' + nbHTML(r) + (me ? '<span class="chip">Admin</span>' : "") + (pr.relation && REL[pr.relation] ? '<span class="pfrel">' + REL[pr.relation] + "</span>" : "") + "</div>" +
    (pr.bio ? '<p class="pfbio">' + E(pr.bio) + "</p>" : me ? "" : '<p class="pfbio vide">' + (mine ? "Tu n’as pas encore écrit de bio." : "Pas encore de bio.") + "</p>") +
    (link ? '<a class="pffb" href="' + E(link) + '" target="_blank" rel="noopener">Accéder à ' + (me ? "mon" : "son") + " profil Facebook</a>" : "") +
    '</div><div class="ab">' + (mine ? '<button class="pr" data-a="ed">✏️ Modifier mon profil</button>' : "") + '<button data-a="x"' + (mine ? "" : ' style="grid-column:1/-1"') + ">Fermer</button></div>";
  var M = openM(h);
  var im = M.el.querySelector(".pfav img"); if (im) im.onerror = function () { im.parentNode.innerHTML = av(n); };
  M.el.querySelector('[data-a="x"]').onclick = M.close;
  var ed = M.el.querySelector('[data-a="ed"]'); if (ed) ed.onclick = function () { M.close(); location.hash = "compte"; };
};
(function () {
  var ppl = $("people"); if (!ppl) return;
  ppl.addEventListener("click", function (e) { if (e.target.closest("a")) return; var r = e.target.closest(".row"); if (r && r.dataset.n) openProfil(r.dataset.n); });
  ppl.addEventListener("keydown", function (e) { var t = e.target; if ((e.key === "Enter" || e.key === " ") && t.classList && t.classList.contains("row") && t.dataset.n) { e.preventDefault(); openProfil(t.dataset.n); } });
})();

/* Formulaire « Mon profil public » (page Mon compte) */
function profilForm() {
  var z = $("pfbox"); if (!z) return;
  if (pubSt !== 2) {
    z.innerHTML = '<h3 style="margin:0 0 6px">Mon profil public</h3>' + (pubSt === 3 ? '<p class="msg ko">' + E(pubErr || "Impossible de charger les profils.") + '</p><button class="qgo" id="pfre">Réessayer</button>' : '<p class="sub" style="margin:0">Chargement…</p>');
    if (pubSt === 3) $("pfre").onclick = function () { pubSt = 0; profilForm(); loadProfils(true); };
    else if (pubSt === 0) loadProfils(true);
    return;
  }
  var d = PUB[myKey()] || {};
  pfPhoto = d.photo || "";
  z.innerHTML = '<h3 style="margin:0 0 4px">Mon profil public</h3><p class="sub" style="margin:0 0 14px;font-size:14px">Toute la classe le voit en touchant ton nom dans « La classe ».</p>' +
    '<div class="pfed"><div class="av" id="pfav"></div><div class="bt"><label>📷 Choisir une photo<input type="file" id="pff" accept="image/*" hidden></label><button type="button" id="pfrm">Retirer</button></div></div>' +
    '<form class="fm" style="margin-top:14px"><label>Lien de ton profil Facebook (facultatif)<input type="text" name="fb" inputmode="url" autocomplete="off" autocapitalize="off" placeholder="https://www.facebook.com/…" maxlength="300"></label>' +
    '<label>Statut<select name="rel"><option value="">Ne pas afficher</option><option value="couple">💞 En couple</option><option value="celib">🙋 Célibataire</option><option value="complique">🤷 C’est compliqué</option></select></label>' +
    '<label>Bio<textarea name="bio" rows="4" maxlength="300" placeholder="Parle un peu de toi…"></textarea></label><div class="pfcnt" id="pfc"></div>' +
    '<button class="qgo" type="submit">Enregistrer mon profil</button><p class="msg"></p></form>';
  var f = z.querySelector("form"), m = z.querySelector(".msg"), btn = f.querySelector(".qgo");
  f.elements.fb.value = d.facebook || ""; f.elements.rel.value = d.relation || ""; f.elements.bio.value = d.bio || "";
  function say(t, k) { m.className = "msg" + (k ? " " + k : ""); m.textContent = t; }
  function drawAv() { $("pfav").innerHTML = pfPhoto ? '<img alt="" src="' + E(pfPhoto) + '">' : av(prof.nom); }
  function count() { $("pfc").textContent = f.elements.bio.value.length + " / 300"; }
  drawAv(); count();
  f.addEventListener("input", function () { pfDirty = true; count(); });
  f.addEventListener("change", function () { pfDirty = true; });
  $("pff").onchange = function () {
    var file = this.files && this.files[0]; this.value = ""; if (!file) return;
    say("Préparation de la photo…");
    shrink(file).then(function (u) { pfPhoto = u; pfDirty = true; drawAv(); say("Photo prête. Appuie sur « Enregistrer mon profil ».", ""); })
      .catch(function () { say("Impossible de lire cette image. Essaie une photo JPG ou PNG.", "ko"); });
  };
  $("pfrm").onclick = function () { pfPhoto = ""; pfDirty = true; drawAv(); say("Photo retirée. Appuie sur « Enregistrer mon profil ».", ""); };
  f.onsubmit = function (e) {
    e.preventDefault();
    var fb = cleanFb(f.elements.fb.value), bio = f.elements.bio.value.trim();
    if (fb && (!isFbOk(fb) || fb.length > 300)) return say("Ce n’est pas un lien Facebook valide (ex. https://www.facebook.com/ton.profil).", "ko");
    var data = { num: +prof.id, nom: prof.nom, photo: pfPhoto || "", facebook: fb, bio: bio, relation: f.elements.rel.value, maj: firebase.firestore.FieldValue.serverTimestamp() };
    say("Enregistrement…"); btn.disabled = true;
    db.doc("profils/" + prof.id).set(data).then(function () {
      var o = {}; if (data.photo) o.photo = data.photo; if (fb) o.facebook = fb; if (bio) o.bio = bio; if (REL[data.relation]) o.relation = data.relation;
      PUB[myKey()] = o; pfDirty = false; f.elements.fb.value = fb; f.elements.bio.value = bio; count();
      var a = $("pcav"); if (a) a.innerHTML = myAv();
      if (typeof pp === "function") pp();
      say("Profil enregistré ✅", "ok"); btn.disabled = false;
    }).catch(function (er) { say(fr(er), "ko"); btn.disabled = false; });
  };
}

/* ---------- Confessions anonymes (chaque message est validé par l'admin) ---------- */
/* confessions/<id> = messages publiés (SANS auteur) · confAuteurs/<id> = auteur, lisible par l'admin (et l'auteur pour ses propres messages) */
var CF = { posts: [], auth: {}, pend: [], mine: [], com: {}, open: {} };
function tagFor(pid) { var k = "l1icm_tag_" + pid, t = null; try { t = localStorage.getItem(k); } catch (e) {} if (!t) { t = rid().slice(0, 8); try { localStorage.setItem(k, t); } catch (e) {} } return t; }
function ago(ts) { var m = ms(ts); if (!m) return "à l’instant"; var s = (Date.now() - m) / 1000; if (s < 60) return "à l’instant"; if (s < 3600) return Math.floor(s / 60) + " min"; if (s < 86400) return Math.floor(s / 3600) + " h"; return Math.floor(s / 86400) + " j"; }
function cfPost(id) { return CF.posts.filter(function (x) { return x.id === id; })[0]; }

function viewConf() {
  var b = $("v-conf"); if (MUST && !allowed()) { b.innerHTML = ""; return; }
  b.innerHTML = '<div class="rt"><h2 style="margin:8px 0 6px">💌 Confessions</h2><button id="cfr">↻ Actualiser</button></div>' +
    '<p class="sub">Anonyme pour la classe : l’admin voit l’auteur et valide chaque message avant sa publication.</p>' +
    (isAdmin ? "" : '<div class="card"><form class="fm" id="cff"><label>Ton message<textarea name="t" rows="3" maxlength="400" placeholder="Une déclaration, une anecdote, un mot pour quelqu’un… Reste respectueux."></textarea></label><button class="qgo" type="submit">Envoyer pour validation</button><p class="msg"></p></form></div>') +
    '<div id="cfm"></div><div id="cfl"><p class="sub">Chargement…</p></div>';
  $("cfr").onclick = function () { CF.com = {}; loadConf(); };
  loadConf();
}
function loadConf() {
  var jobs = [db.collection("confessions").orderBy("creeLe", "desc").limit(60).get(),
    isAdmin ? db.collection("confAuteurs").where("kind", "==", "post").get() : db.collection("confAuteurs").where("num", "==", +prof.id).where("kind", "==", "post").get()];
  return Promise.all(jobs).then(function (q) {
    CF.posts = []; CF.auth = {}; CF.pend = []; CF.mine = [];
    q[0].forEach(function (s) { var d = s.data(); d.id = s.id; CF.posts.push(d); });
    q[1].forEach(function (s) { var d = s.data(); d.id = s.id; CF.auth[d.id] = d; if (isAdmin) { if (d.statut === "attente") CF.pend.push(d); } else if (d.statut === "attente" || d.statut === "refuse") CF.mine.push(d); });
    CF.pend.sort(function (a, c) { return ms(a.creeLe) - ms(c.creeLe); }); CF.mine.sort(function (a, c) { return ms(c.creeLe) - ms(a.creeLe); });
    drawConf();
  }).catch(function (er) { var l = $("cfl"); if (l) l.innerHTML = '<p class="msg ko">' + E(fr(er)) + "</p>"; });
}
function postHTML(p, n) {
  var A = p.aime || [], S = p.signale || [], a = CF.auth[p.id], liked = A.indexOf(n) > -1, rep = S.indexOf(n) > -1;
  if (S.length >= 3 && !isAdmin) return '<div class="card cfc"><p class="sub" style="margin:0">🚩 Message signalé, masqué en attendant l’avis de l’admin.</p></div>';
  return '<div class="card cfc" data-id="' + p.id + '"><p class="cft">' + E(p.texte) + "</p><small class=\"sub\">" + ago(p.creeLe) + (isAdmin && a ? " · ✍️ " + E(a.nom) + " (N° " + a.num + ")" : "") + (isAdmin && S.length ? " · 🚩 " + S.length : "") + "</small>" +
    '<div class="cfa"><button data-a="like"' + (isAdmin ? " disabled" : "") + (liked ? ' class="on"' : "") + ">❤️ " + A.length + '</button><button data-a="com">💬 ' + (CF.com[p.id] ? CF.com[p.id].length : "Commenter") + "</button>" +
    (isAdmin ? '<button class="dg" data-a="del">🗑️</button>' : '<button data-a="rep"' + (rep ? " disabled" : "") + ">" + (rep ? "Signalé ✓" : "🚩") + "</button>") + "</div>" +
    (CF.open[p.id] ? '<div class="cfk" id="k-' + p.id + '"></div>' : "") + "</div>";
}
function drawConf() {
  var m = $("cfm"), l = $("cfl"); if (!m || !l) return;
  var n = isAdmin ? 0 : +prof.id, h = "";
  if (isAdmin && CF.pend.length) h += '<h3 style="margin:14px 2px 8px">À valider (' + CF.pend.length + ")</h3>" + CF.pend.map(function (d) {
    return '<div class="card cfc" data-id="' + d.id + '"><p class="cft">' + E(d.texte) + '</p><small class="sub">✍️ ' + E(d.nom) + " · N° " + d.num + " · " + ago(d.creeLe) + '</small><div class="ab"><button class="pr" data-a="pub">✅ Publier</button><button class="dg" data-a="ref">❌ Refuser</button></div></div>'; }).join("");
  if (!isAdmin && CF.mine.length) h += CF.mine.map(function (d) {
    return '<div class="card cfc"><p class="cft">' + E(d.texte) + '</p><small class="sub">' + (d.statut === "attente" ? "⏳ En attente de validation (toi seul le vois)" : "❌ Refusé par l’admin") + "</small></div>"; }).join("");
  m.innerHTML = h;
  l.innerHTML = (CF.posts.length ? "" : '<p class="sub">Aucun message publié pour le moment.</p>') + CF.posts.map(function (p) { return postHTML(p, n); }).join("");
  Object.keys(CF.open).forEach(function (id) { if (CF.open[id]) drawCom(id); });
}
function loadCom(id) {
  var jobs = [db.collection("confessions/" + id + "/commentaires").orderBy("creeLe").get()];
  if (isAdmin) jobs.push(db.collection("confAuteurs").where("kind", "==", "com").where("postId", "==", id).get());
  return Promise.all(jobs).then(function (q) {
    var au = {}; if (q[1]) q[1].forEach(function (s) { au[s.id] = s.data(); });
    CF.com[id] = []; q[0].forEach(function (s) { var d = s.data(); d.id = s.id; d.au = au["c-" + s.id]; CF.com[id].push(d); });
    drawConf();
  }).catch(function (er) { CF.open[id] = false; alert(fr(er)); drawConf(); });
}
function drawCom(id) {
  var z = $("k-" + id); if (!z) return; var L = CF.com[id];
  if (!L) { z.innerHTML = '<p class="sub" style="margin:0">Chargement…</p>'; return; }
  var tags = [];
  z.innerHTML = L.map(function (c) {
    var i = tags.indexOf(c.tag); if (i < 0) i = tags.push(c.tag) - 1;
    return '<div class="cfq"><b>Anonyme ' + (i + 1) + "</b> " + E(c.texte) + ' <small class="sub">' + ago(c.creeLe) + (c.au ? " · ✍️ " + E(c.au.nom) + " (N° " + c.au.num + ")" : "") + "</small>" +
      (isAdmin ? ' <button class="cfx" data-a="dcom" data-c="' + c.id + '">🗑️</button>' : "") + "</div>"; }).join("") +
    (isAdmin ? "" : '<form class="cfcf" data-id="' + id + '"><input type="text" name="t" maxlength="300" placeholder="Ton commentaire (anonyme)" autocomplete="off"><button type="submit">Envoyer</button></form>');
}
$("v-conf").addEventListener("click", function (e) {
  var b = e.target.closest("button[data-a]"); if (!b || b.disabled) return;
  var card = b.closest("[data-id]"), id = card && card.dataset.id, a = b.dataset.a, F = firebase.firestore.FieldValue, bt;
  function fail(er) { alert(fr(er)); b.disabled = false; }
  if (a === "like" || a === "rep") {
    var p = cfPost(id), ch = a === "like" ? "aime" : "signale", n = +prof.id, L = p[ch] || [], on = L.indexOf(n) > -1, up = {};
    if (a === "rep" && !confirm("Signaler ce message à l’admin ?")) return;
    up[ch] = on ? F.arrayRemove(n) : F.arrayUnion(n); b.disabled = true;
    db.doc("confessions/" + id).update(up).then(function () { p[ch] = on ? L.filter(function (x) { return x !== n; }) : L.concat([n]); drawConf(); }).catch(fail);
  } else if (a === "com") {
    CF.open[id] = !CF.open[id]; if (CF.open[id] && !CF.com[id]) loadCom(id); drawConf();
  } else if (a === "pub") {
    var d = CF.auth[id]; b.disabled = true; bt = db.batch();
    bt.set(db.doc("confessions/" + id), { texte: d.texte, creeLe: F.serverTimestamp(), aime: [], signale: [] });
    bt.update(db.doc("confAuteurs/" + id), { statut: "publie" }); bt.commit().then(loadConf).catch(fail);
  } else if (a === "ref") {
    b.disabled = true; db.doc("confAuteurs/" + id).update({ statut: "refuse" }).then(loadConf).catch(fail);
  } else if (a === "del") {
    if (!confirm("Supprimer ce message ?")) return; b.disabled = true; bt = db.batch();
    bt.delete(db.doc("confessions/" + id)); if (CF.auth[id]) bt.update(db.doc("confAuteurs/" + id), { statut: "supprime" });
    bt.commit().then(loadConf).catch(fail);
  } else if (a === "dcom") {
    if (!confirm("Supprimer ce commentaire ?")) return; b.disabled = true;
    db.doc("confessions/" + id + "/commentaires/" + b.dataset.c).delete().then(function () { loadCom(id); }).catch(fail);
  }
});
$("v-conf").addEventListener("submit", function (e) {
  e.preventDefault(); var f = e.target, F = firebase.firestore.FieldValue, t = f.elements.t.value.trim(), btn = f.querySelector("button"), m = f.querySelector(".msg"); if (!t || isAdmin) return;
  if (f.id === "cff") {
    if (CF.mine.filter(function (d) { return d.statut === "attente"; }).length >= 3) { m.className = "msg ko"; m.textContent = "Tu as déjà 3 messages en attente. Patiente un peu."; return; }
    var ref = db.collection("confAuteurs").doc(); btn.disabled = true; m.className = "msg"; m.textContent = "Envoi…";
    ref.set({ kind: "post", postId: ref.id, num: +prof.id, nom: prof.nom, texte: t, statut: "attente", creeLe: F.serverTimestamp() })
      .then(function () { f.reset(); btn.disabled = false; loadConf().then(function () { var z = $("cff"); if (z) { var q = z.querySelector(".msg"); q.className = "msg ok"; q.textContent = "Envoyé ✅ L’admin va le valider avant publication."; } }); })
      .catch(function (er) { m.className = "msg ko"; m.textContent = fr(er); btn.disabled = false; });
  } else if (f.classList.contains("cfcf")) {
    var id = f.dataset.id, cr = db.collection("confessions/" + id + "/commentaires").doc(), bt = db.batch(), ts = F.serverTimestamp(); btn.disabled = true;
    bt.set(cr, { texte: t, tag: tagFor(id), creeLe: ts });
    bt.set(db.doc("confAuteurs/c-" + cr.id), { kind: "com", postId: id, num: +prof.id, nom: prof.nom, texte: t, creeLe: ts });
    bt.commit().then(function () { loadCom(id); }).catch(function (er) { alert(fr(er)); btn.disabled = false; });
  }
});

/* ---------- Statistiques de visite ---------- */
function track() {
  try { if (sessionStorage.getItem("l1icm_v")) return; sessionStorage.setItem("l1icm_v", "1"); } catch (e) {}
  var F = firebase.firestore.FieldValue, inc = F.increment(1), ts = F.serverTimestamp();
  db.doc("stats/global").set({ visites: inc }, { merge: true }).catch(noop);
  db.doc("stats/j-" + ymd(new Date())).set({ visites: inc }, { merge: true }).catch(noop);
  var vid = null; try { vid = localStorage.getItem("l1icm_vid"); } catch (e) {}
  var neu = !vid; if (!vid) { vid = rid(); try { localStorage.setItem("l1icm_vid", vid); } catch (e) {} }
  var ref = db.doc("visiteurs/" + vid);
  if (neu) ref.set({ premiere: ts, derniere: ts, visites: 1 }).catch(noop);
  else ref.update({ derniere: ts, visites: inc }).catch(function () { ref.set({ premiere: ts, derniere: ts, visites: 1 }).catch(noop); });
}

/* ---------- Espace admin ---------- */
function openM(html) {
  var m = document.createElement("div"); m.className = "mdl";
  var c = document.createElement("div"); c.className = "mc"; c.innerHTML = html; m.appendChild(c);
  m.onclick = function (e) { if (e.target === m) m.remove(); };
  document.body.appendChild(m);
  return { el: c, set: function (h) { c.innerHTML = h; }, close: function () { m.remove(); } };
}

function loadAdmin() {
  var b = $("v-admin");
  if (!AD.t) b.innerHTML = '<h2>Espace admin</h2><p class="sub">Chargement des données…</p>';
  var ds = [], d = new Date();
  for (var i = 13; i >= 0; i--) ds.push(new Date(d.getFullYear(), d.getMonth(), d.getDate() - i));
  Promise.all([db.collection("users").get(), db.collection("visiteurs").get(), db.doc("stats/global").get()]
    .concat(ds.map(function (x) { return db.doc("stats/j-" + ymd(x)).get(); }))).then(function (q) {
    AD.t = Date.now(); AD.users = {}; AD.vis = [];
    AD.glob = q[2].exists ? (q[2].data().visites || 0) : 0;
    AD.days = ds.map(function (x, k) { return { d: x, n: q[3 + k].exists ? (q[3 + k].data().visites || 0) : 0 }; });
    q[0].forEach(function (s) { var u = s.data(); u.id = s.id; AD.users[s.id] = u; });
    q[1].forEach(function (s) { AD.vis.push(s.data()); });
    AD.f = AD.f || "all"; AD.q = AD.q || "";
    drawAdmin();
  }).catch(function (e) { b.innerHTML = '<h2>Espace admin</h2><div class="card"><p class="msg ko">' + E(fr(e)) + '</p><button class="qgo" id="rl">Réessayer</button></div>'; $("rl").onclick = loadAdmin; });
}

function drawAdmin() {
  var y = window.scrollY, b = $("v-admin"), U = Object.keys(AD.users).map(function (k) { return AD.users[k]; });
  var cnt = { actif: 0, attente: 0, suspendu: 0, banni: 0, refuse: 0 }, g1 = 0, g2 = 0;
  U.forEach(function (u) { cnt[eff(u)] = (cnt[eff(u)] || 0) + 1; if (u.num <= G1) g1++; else g2++; });
  var t0 = new Date(); t0.setHours(0, 0, 0, 0);
  var vis7 = AD.vis.filter(function (v) { return ms(v.derniere) >= Date.now() - 7 * 864e5; }).length;
  var today = AD.days[AD.days.length - 1].n, max = Math.max.apply(null, AD.days.map(function (x) { return x.n; }).concat([1]));
  var pct = ROWS.length ? Math.round(U.length / ROWS.length * 100) : 0;
  function card(v, l) { return '<div class="sc"><b>' + v + "</b><span>" + l + "</span></div>"; }
  var h = '<div class="rt"><h2 style="margin:8px 0 6px">Espace admin</h2><button id="rf">↻ Actualiser</button></div><p class="sub">Dernière mise à jour : ' + new Date(AD.t).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) + "</p>" +
    '<div class="sg">' + card(AD.glob, "visites au total") + card(today, "visites aujourd’hui") + card(AD.vis.length, "visiteurs uniques") + card(vis7, "visiteurs actifs (7 j)") +
    card(U.length, "comptes inscrits") + card(cnt.attente, "en attente") + card(cnt.suspendu, "suspendus") + card(cnt.banni, "bannis") + "</div>" +
    '<div class="card" style="margin-bottom:14px"><b>Inscriptions</b> <span class="sub" style="margin:0">· ' + U.length + " sur " + ROWS.length + " élèves (" + pct + " %)</span><div class=\"pgb\"><i style=\"width:" + pct + '%"></i></div><p class="sub" style="margin:8px 0 0;font-size:13px">Groupe 1 : ' + g1 + " inscrits · Groupe 2 : " + g2 + " inscrits · " + cnt.actif + " actifs</p></div>" +
    '<div class="card" style="margin-bottom:14px"><b>Visites · 14 derniers jours</b><div class="ch">' +
    AD.days.map(function (x) { return "<div>" + (x.n ? "<b>" + x.n + "</b>" : "") + '<i style="height:' + Math.round(x.n / max * 100) + '%"></i>' + x.d.getDate() + "</div>"; }).join("") + "</div></div>" +
    '<h3 style="margin:18px 2px 0">Comptes</h3><div class="seg" id="af">' + [["all", "Tous", U.length], ["actif", "Actifs", cnt.actif], ["attente", "Attente", cnt.attente], ["suspendu", "Suspendus", cnt.suspendu], ["banni", "Bannis", cnt.banni], ["refuse", "Refusés", cnt.refuse]].map(function (x) { return '<button data-f="' + x[0] + '"' + (AD.f === x[0] ? ' class="on"' : "") + ">" + x[1] + "<small>" + x[2] + "</small></button>"; }).join("") + "</div>" +
    '<input id="aq" type="search" placeholder="Rechercher un nom ou un numéro" value="' + E(AD.q) + '" style="margin-bottom:10px"><div class="rows" id="alist"></div>';
  b.innerHTML = h;
  $("rf").onclick = loadAdmin;
  b.querySelectorAll("#af button").forEach(function (x) { x.onclick = function () { AD.f = x.dataset.f; b.querySelectorAll("#af button").forEach(function (z) { z.classList.toggle("on", z === x); }); drawList(); }; });
  $("aq").oninput = function () { AD.q = this.value; drawList(); };
  drawList(); window.scrollTo(0, y);
}

function drawList() {
  var q = AD.q.trim(), isN = /^\d+$/.test(q), k = nkey(q);
  var L = Object.keys(AD.users).map(function (x) { return AD.users[x]; }).filter(function (u) {
    if (AD.f !== "all" && eff(u) !== AD.f) return false;
    if (!q) return true; return isN ? String(u.num).indexOf(q) === 0 : nkey(u.nom).indexOf(k) > -1;
  }).sort(function (a, b) { return a.num - b.num; });
  $("alist").innerHTML = L.length ? L.map(function (u) {
    var p = nm(u.nom), s = eff(u);
    return '<button class="ar" data-id="' + E(u.id) + '">' + nbU(u) + '<div class="tx"><b>' + E(p[0]) + "</b> " + E(p[1]) + "<br><small>" + (u.connexions || 0) + " connexion(s) · dernière : " + fdt(u.derniereConnexion) + '</small></div><span class="st st-' + s + '">' + LAB[s] + "</span></button>";
  }).join("") : '<p class="sub">' + (Object.keys(AD.users).length ? "Aucun compte ne correspond." : "Aucun compte inscrit pour le moment.") + "</p>";
  document.querySelectorAll("#alist .ar").forEach(function (x) { x.onclick = function () { manage(x.dataset.id); }; });
}

function manage(id) {
  var u = AD.users[id]; if (!u) return;
  var M = openM("");
  function save(p) {
    M.el.querySelectorAll("button").forEach(function (b) { b.disabled = true; });
    return db.doc("users/" + id).update(p).then(function () { Object.assign(u, p); M.close(); drawAdmin(); })
      .catch(function (e) { alert(fr(e)); home(); });
  }
  function bind(map) { M.el.querySelectorAll("[data-a]").forEach(function (b) { b.onclick = map[b.dataset.a]; }); }
  function home() {
    var s = eff(u);
    var h = '<div style="display:flex;gap:12px;align-items:center">' + nbU(u) + '<div style="min-width:0"><b style="overflow-wrap:anywhere">' + E(u.nom) + '</b><br><span class="st st-' + s + '">' + LAB[s] + "</span></div></div>" +
      '<p class="sub" style="margin:12px 0 0;font-size:14px">Inscrit le ' + fdt(u.creeLe) + "<br>Dernière connexion : " + fdt(u.derniereConnexion) + " · " + (u.connexions || 0) + " connexion(s)" +
      (s === "suspendu" ? "<br>Suspendu " + (u.jusqua ? "jusqu’au " + fdt(u.jusqua) : "jusqu’à nouvel ordre") : "") + (u.note ? "<br>Note : " + E(u.note) : "") + '</p><div class="ab">';
    if (s === "attente") h += '<button class="pr" data-a="ok">✅ Valider</button>';
    if (s === "suspendu" || s === "banni" || s === "refuse") h += '<button class="pr" data-a="ok">↩️ Réactiver</button>';
    if (s === "actif" || s === "attente") h += '<button data-a="sus">⏸️ Suspendre</button>';
    if (s === "attente") h += '<button class="dg" data-a="ref">❌ Refuser</button>';
    if (s !== "banni") h += '<button class="dg" data-a="ban">⛔ Bannir</button>';
    h += '<button data-a="edit">✏️ Modifier</button><button class="dg" data-a="del">🗑️ Supprimer</button><button data-a="rp" style="grid-column:1/-1">🧹 Vider son profil public</button><button data-a="x" style="grid-column:1/-1">Fermer</button></div>';
    M.set(h);
    bind({
      ok: function () { save({ statut: "actif", jusqua: null }); },
      sus: durations, ref: function () { confirmM("Refuser l’inscription de " + u.nom + " ?", "Il n’aura pas accès au site. Tu pourras le réactiver plus tard.", "Refuser", function () { save({ statut: "refuse", jusqua: null }); }); },
      ban: function () { confirmM("Bannir " + u.nom + " ?", "Il ne pourra plus utiliser son compte.", "Bannir", function () { save({ statut: "banni", jusqua: null }); }); },
      rp: function () { confirmM("Vider le profil public de " + u.nom + " ?", "Sa photo, son lien Facebook, sa bio et son statut sont effacés. Il pourra les remettre.", "Vider", function () { M.el.querySelectorAll("button").forEach(function (b) { b.disabled = true; }); db.doc("profils/" + id).delete().then(function () { var r = rowByNum(+id); if (r) delete PUB[r.n]; if (typeof pp === "function") pp(); home(); }).catch(function (e) { alert(fr(e)); home(); }); }); },
      edit: edit, del: function () { confirmM("Supprimer le compte de " + u.nom + " ?", "Son profil est effacé (statistiques comprises). Il pourra se réinscrire avec le même mot de passe.", "Supprimer", function () { M.el.querySelectorAll("button").forEach(function (b) { b.disabled = true; }); db.doc("profils/" + id).delete().catch(noop); { var rr = rowByNum(+id); if (rr) delete PUB[rr.n]; } db.doc("users/" + id).delete().then(function () { delete AD.users[id]; M.close(); drawAdmin(); }).catch(function (e) { alert(fr(e)); home(); }); }); },
      x: function () { M.close(); }
    });
  }
  function confirmM(t, d, label, fn) {
    M.set("<h3 style=\"margin:0 0 6px\">" + E(t) + '</h3><p class="sub" style="margin:0">' + E(d) + '</p><div class="ab"><button data-a="n">Annuler</button><button class="dg" data-a="y">' + label + "</button></div>");
    bind({ n: home, y: fn });
  }
  function durations() {
    var D = [[1, "1 jour"], [3, "3 jours"], [7, "7 jours"], [30, "30 jours"], [0, "Jusqu’à nouvel ordre"]];
    M.set('<h3 style="margin:0 0 6px">Suspendre ' + E(u.nom) + '</h3><p class="sub" style="margin:0">Pendant combien de temps ?</p><div class="ab">' + D.map(function (x, i) { return '<button data-a="d' + i + '">' + x[1] + "</button>"; }).join("") + '<button data-a="n" style="grid-column:1/-1">Retour</button></div>');
    var map = { n: home };
    D.forEach(function (x, i) { map["d" + i] = function () { save({ statut: "suspendu", jusqua: x[0] ? firebase.firestore.Timestamp.fromDate(new Date(Date.now() + x[0] * 864e5)) : null }); }; });
    bind(map);
  }
  function edit() {
    var jd = ms(u.jusqua) ? ymd(new Date(ms(u.jusqua))) : "";
    M.set('<h3 style="margin:0 0 6px">Modifier le compte N° ' + u.num + '</h3><form class="fm"><label>Nom affiché<input type="text" name="nom" maxlength="120" value="' + E(u.nom) + '" required></label>' +
      '<label>Statut<select name="st">' + Object.keys(LAB).map(function (k) { return '<option value="' + k + '"' + (u.statut === k ? " selected" : "") + ">" + LAB[k] + "</option>"; }).join("") + "</select></label>" +
      '<label>Suspendu jusqu’au (facultatif)<input type="date" name="dt" value="' + jd + '"></label>' +
      '<label>Note interne (visible par toi seulement)<textarea name="note" rows="2" maxlength="300">' + E(u.note || "") + '</textarea></label>' +
      '<button class="qgo" type="submit">Enregistrer</button><button class="qgo alt" type="button" data-a="n" style="margin-top:0">Annuler</button><p class="msg"></p></form>');
    bind({ n: home });
    var f = M.el.querySelector("form");
    f.onsubmit = function (e) {
      e.preventDefault(); var nom = f.elements.nom.value.trim(), st = f.elements.st.value, dt = f.elements.dt.value;
      if (!nom) { f.querySelector(".msg").className = "msg ko"; f.querySelector(".msg").textContent = "Le nom ne peut pas être vide."; return; }
      save({ nom: nom, statut: st, jusqua: st === "suspendu" && dt ? firebase.firestore.Timestamp.fromDate(new Date(dt + "T23:59:00")) : null, note: f.elements.note.value.trim() });
    };
  }
  home();
}
})();

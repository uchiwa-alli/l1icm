/* ============================================================
   COMPTES · L1 ICM · EMIT Fianarantsoa
   Inscription (élèves de la classe uniquement), connexion,
   statistiques de visite et espace admin.
   Tu n'as rien à modifier ici : tout se règle dans firebase-config.js
   © 2026 Alli · ALLI.DEV. Tous droits réservés.
   ============================================================ */
(function () {
"use strict";
var C = window.COMPTES || {}, cfg = C.firebase || {};
if (!(C.actif && cfg.apiKey && cfg.projectId && C.adminEmail)) return;   /* comptes désactivés : le site reste comme avant */

var DOM = C.domaine || "l1icm.app", ADMIN = String(C.adminEmail).trim().toLowerCase();
var $ = function (i) { return document.getElementById(i); };
function E(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
function noop() {}
function ymd(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function ms(ts) { return ts && ts.toMillis ? ts.toMillis() : 0; }
function fdt(ts) { var m = ms(ts); return m ? new Date(m).toLocaleString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"; }
function rid() { var a = new Uint8Array(12), s = ""; (window.crypto || window.msCrypto).getRandomValues(a); a.forEach(function (b) { s += ("0" + b.toString(16)).slice(-2); }); return s; }

var auth, db, user = null, prof = null, isAdmin = false, busy = false, ST = "load", notice = "", welcome = false, tracked = false, AD = {};
var LAB = { actif: "Actif", attente: "En attente", suspendu: "Suspendu", banni: "Banni" };

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
#gate,#blk{position:fixed;inset:0;z-index:8;background:var(--bg);overflow:auto;padding:24px 18px calc(24px + env(safe-area-inset-bottom,0px))}\
.gi2{max-width:460px;margin:0 auto}.gi2 img{width:64px;border-radius:16px;display:block;margin:6px 0 14px}\
.st{display:inline-block;border-radius:99px;padding:2px 10px;font-size:12px;font-weight:700}\
.st-actif{background:#d6f5e3;color:#14683d}.st-attente{background:#fff1c9;color:#7a5200}.st-suspendu{background:#ffe0c9;color:#8a3d00}.st-banni{background:#ffd9db;color:#a3131a}\
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
  el.onclick = function () { location.hash = id === "t-adm" ? "admin" : "compte"; };
  $("tiles").appendChild(el);
  return el;
}
var tAcc = mkTile("t-acc", "👤"), tAdm = mkTile("t-adm", "🛡️");
tAdm.hidden = true;

function mkSec(id) { var s = document.createElement("section"); s.className = "view"; s.id = id; $("app").appendChild(s); return s; }
mkSec("v-compte"); mkSec("v-admin");
var gate = document.createElement("div"); gate.id = "gate"; gate.hidden = true; document.body.appendChild(gate);
var blk = document.createElement("div"); blk.id = "blk"; blk.hidden = true; document.body.appendChild(blk);

title.compte = "Mon compte"; title.admin = "Espace admin";
var _go = window.go;
window.go = function (v) {
  if (v === "admin" && !isAdmin) { if (ST === "load") { _go("compte"); return; } location.hash = "compte"; return; }
  _go(v);
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
  .catch(function () { ST = "err"; render(); });
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
function onAuth(u) {
  if (busy) return Promise.resolve();
  user = u; prof = null; isAdmin = false;
  if (!u) { ST = "out"; first(); render(); return Promise.resolve(); }
  var em = (u.email || "").toLowerCase();
  if (em === ADMIN) { isAdmin = true; ST = "in"; first(); render(); route(); return Promise.resolve(); }
  var m = em.match(/^(\d+)@(.+)$/);
  if (!m || m[2] !== DOM) { return auth.signOut(); }
  return db.doc("users/" + m[1]).get().then(function (s) {
    if (!s.exists) { notice = "Ce compte n’existe plus. Inscris-toi à nouveau ou contacte l’admin."; return auth.signOut(); }
    prof = s.data(); prof.id = m[1];
    try { if (!sessionStorage.getItem("l1icm_t")) { sessionStorage.setItem("l1icm_t", "1"); var F = firebase.firestore.FieldValue; db.doc("users/" + m[1]).update({ derniereConnexion: F.serverTimestamp(), connexions: F.increment(1) }).catch(noop); } } catch (e) {}
    ST = "in"; first(); render(); route();
  }).catch(function (e) { ST = "err"; notice = fr(e); render(); });
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
      return ref.set({ num: +num, nom: r.n, groupe: r.g, statut: C.validation ? "attente" : "actif", jusqua: null, bgAdmin: true, note: "", creeLe: F.serverTimestamp(), derniereConnexion: F.serverTimestamp(), connexions: 1 });
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
  var blocked = ST === "in" && !isAdmin && prof && eff(prof) !== "actif";
  acc.textContent = ST === "in" ? (isAdmin ? "🛡️" : "👤 " + prof.num) : "👤";
  tAcc.querySelector("b").textContent = ST === "in" ? "Mon compte" : "Compte";
  tAcc.querySelector("span").textContent = ST === "in" ? (isAdmin ? "Connecté en admin" : "N° " + prof.num + " · Groupe " + (prof.num <= G1 ? 1 : 2)) : "Connexion · Inscription";
  tAdm.hidden = !isAdmin;
  tAdm.querySelector("b").textContent = "Espace admin";
  tAdm.querySelector("span").textContent = "Statistiques et comptes";

  var needGate = !!C.obligatoire && ST !== "in";
  gate.hidden = !needGate;
  if (needGate) {
    var g = '<div class="gi2"><img src="' + LOGO + '" alt=""><h2>L1 ICM</h2><p class="sub">Connecte-toi avec ton compte de la classe pour accéder au site.</p><div class="card" id="gb">';
    if (ST === "load") g += "Chargement…"; else if (ST === "err") g += '<p class="msg ko">' + E(notice || "Impossible de joindre le serveur.") + '</p><button class="qgo" onclick="location.reload()">Réessayer</button>';
    gate.innerHTML = g + "</div></div>";
    if (ST === "out") authUI($("gb"));
  }
  blk.hidden = !blocked;
  if (blocked) {
    var s = eff(prof), t = s === "banni" ? ["⛔", "Compte banni", "Ton compte a été banni par l’admin."] : s === "suspendu" ? ["⏸️", "Compte suspendu", prof.jusqua ? "Ton compte est suspendu jusqu’au " + fdt(prof.jusqua) + "." : "Ton compte est suspendu jusqu’à nouvel ordre."] : ["⏳", "Compte en attente", "L’admin doit valider ton inscription. Reviens un peu plus tard."];
    blk.innerHTML = '<div class="gi2"><div class="card" style="text-align:center"><div style="font-size:56px">' + t[0] + "</div><h2>" + t[1] + '</h2><p class="sub" style="margin:0 auto 6px">' + t[2] + ' Pour toute question, contacte l’admin.</p><button class="qgo" id="blko">Se déconnecter</button></div></div>';
    $("blko").onclick = function () { auth.signOut(); };
  }
  if ($("v-compte").classList.contains("on")) viewCompte();
}

function viewCompte() {
  var b = $("v-compte"), h = "<h2>Mon compte</h2>";
  if (ST === "load") { b.innerHTML = h + '<p class="sub">Chargement…</p>'; return; }
  if (ST === "err") { b.innerHTML = h + '<div class="card"><p class="msg ko">' + E(notice || "Impossible de joindre le serveur.") + '</p><button class="qgo" onclick="location.reload()">Réessayer</button></div>'; return; }
  if (ST === "out") { b.innerHTML = h + '<p class="sub">Inscris-toi avec ton nom de la liste de la classe pour créer ton compte.</p><div class="card" id="ab"></div>'; authUI($("ab")); return; }
  if (isAdmin) {
    b.innerHTML = h + '<div class="card"><span class="chip">Admin</span><p style="margin:0 0 4px"><b>Connecté en administrateur</b></p><p class="sub" style="margin:0">' + E(user.email) + '</p><div class="ab"><button class="pr" id="go-adm">🛡️ Espace admin</button><button id="lo">Se déconnecter</button></div></div>';
    $("go-adm").onclick = function () { location.hash = "admin"; }; $("lo").onclick = function () { auth.signOut(); };
    return;
  }
  var p = nm(prof.nom), s = eff(prof);
  b.innerHTML = h + (welcome ? '<div class="ban">Bienvenue ! Ton compte est créé ✅</div>' : "") +
    '<div class="card"><div class="pc"><div class="av">' + av(prof.nom) + "</div>" + nbU(prof) + '<div style="min-width:0;flex:1"><b>' + E(p[0]) + "</b> " + E(p[1]) + '<br><span class="st st-' + s + '">' + LAB[s] + "</span></div></div>" +
    '<p class="sub" style="margin:14px 0 0;font-size:14px">Inscrit le ' + fdt(prof.creeLe) + "</p>" +
    '<div class="ab"><button id="pwb">🔑 Changer le mot de passe</button><button id="lo">Se déconnecter</button></div><div id="pwf"></div></div>';
  $("lo").onclick = function () { auth.signOut(); };
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
  var cnt = { actif: 0, attente: 0, suspendu: 0, banni: 0 }, g1 = 0, g2 = 0;
  U.forEach(function (u) { cnt[eff(u)]++; if (u.num <= G1) g1++; else g2++; });
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
    '<h3 style="margin:18px 2px 0">Comptes</h3><div class="seg" id="af">' + [["all", "Tous", U.length], ["actif", "Actifs", cnt.actif], ["attente", "Attente", cnt.attente], ["suspendu", "Suspendus", cnt.suspendu], ["banni", "Bannis", cnt.banni]].map(function (x) { return '<button data-f="' + x[0] + '"' + (AD.f === x[0] ? ' class="on"' : "") + ">" + x[1] + "<small>" + x[2] + "</small></button>"; }).join("") + "</div>" +
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
    if (s === "suspendu" || s === "banni") h += '<button class="pr" data-a="ok">↩️ Réactiver</button>';
    if (s === "actif" || s === "attente") h += '<button data-a="sus">⏸️ Suspendre</button>';
    if (s !== "banni") h += '<button class="dg" data-a="ban">⛔ Bannir</button>';
    h += '<button data-a="edit">✏️ Modifier</button><button class="dg" data-a="del">🗑️ Supprimer</button><button data-a="x" style="grid-column:1/-1">Fermer</button></div>';
    M.set(h);
    bind({
      ok: function () { save({ statut: "actif", jusqua: null }); },
      sus: durations, ban: function () { confirmM("Bannir " + u.nom + " ?", "Il ne pourra plus utiliser son compte.", "Bannir", function () { save({ statut: "banni", jusqua: null }); }); },
      edit: edit, del: function () { confirmM("Supprimer le compte de " + u.nom + " ?", "Son profil est effacé (statistiques comprises). Il pourra se réinscrire avec le même mot de passe.", "Supprimer", function () { M.el.querySelectorAll("button").forEach(function (b) { b.disabled = true; }); db.doc("users/" + id).delete().then(function () { delete AD.users[id]; M.close(); drawAdmin(); }).catch(function (e) { alert(fr(e)); home(); }); }); },
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

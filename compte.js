/* ============================================================
   COMPTES · inscription réservée à la classe, statistiques,
   espace admin (Supabase). Ce fichier n'a pas besoin d'être modifié.
   Il ne s'active que si infos.js contient compte.url et compte.key.
   ============================================================ */
(function(){
var C=(typeof I!=="undefined"&&I.compte)||{};
if(!C.url||!C.key||!window.fetch)return;
var BASE=C.url.replace(/\/+$/,""),TK="l1icm_tok",VK="l1icm_vid",ACC=null,TOKEN=ls(TK),
 AF="all",AQ="",MEMBERS=[],STATS=null,CODE="",EDIT=null;

function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){}return null}
function hdr(){var h={"Content-Type":"application/json",apikey:C.key};if(/^eyJ/.test(C.key))h.Authorization="Bearer "+C.key;return h}
function api(fn,args){return fetch(BASE+"/rest/v1/rpc/"+fn,{method:"POST",headers:hdr(),body:JSON.stringify(args||{})}).then(function(r){
  return r.text().then(function(t){var j=null;try{j=t?JSON.parse(t):null}catch(e){}
   if(!r.ok)throw new Error(j&&j.message?j.message:"Erreur du serveur");return j})},function(){throw new Error("Pas de connexion internet")})}
function vid(){var v=ls(VK);if(!v){var a=new Uint8Array(8);try{crypto.getRandomValues(a)}catch(e){for(var i=0;i<8;i++)a[i]=Math.floor(Math.random()*256)}
 v=Array.prototype.map.call(a,function(x){return("0"+x.toString(16)).slice(-2)}).join("");ls(VK,v)}return v}
function rowOf(n){n=+n;for(var i=0;i<ROWS.length;i++)if(ROWS[i].nums.indexOf(n)>-1)return ROWS[i];return null}
function who(n){var r=rowOf(n);if(!r)return'<span class="err">Numéro inconnu sur la liste</span>';var p=nm(r.n);return'<b>'+esc(p[0])+'</b> '+esc(p[1])+' · Groupe '+r.g}
function fdt(s){if(!s)return"—";var d=new Date(s);if(isNaN(d))return"—";return d.getDate()+" "+MOIS[d.getMonth()]+" "+String(d.getHours()).padStart(2,"0")+"h"+String(d.getMinutes()).padStart(2,"0")}
var ST={pending:"En attente",active:"Actif",suspended:"Suspendu",banned:"Banni",rejected:"Refusé"};

/* ---------- style ---------- */
var css=document.createElement("style");css.textContent=
'.accbar{display:flex;width:100%;align-items:center;gap:12px;text-align:left;border:1.5px dashed var(--line);background:var(--surface);color:var(--ink);border-radius:18px;padding:14px 16px;margin-bottom:16px;font-size:15px}'+
'.accbar i{font-style:normal;font-size:26px}.accbar span{display:block;color:var(--muted);font-size:13px}'+
'.fm{padding:18px}.fm h3{margin:0 0 4px;font-size:22px;letter-spacing:-.02em}'+
'.fm label{display:block;font-weight:600;font-size:14px;margin:14px 0 0}'+
'.fm input:not([type=checkbox]),.ed input{display:block;width:100%;margin-top:6px;padding:12px 14px;border:1.5px solid var(--line);border-radius:12px;background:var(--surface);color:var(--ink);font:inherit}'+
'.fm .chk{display:flex;gap:12px;align-items:center;margin-top:18px;padding:12px 14px;border:1.5px dashed var(--line);border-radius:12px;font-size:16px}'+
'.fm .chk input{width:24px;height:24px;margin:0;flex:none}'+
'.prv{min-height:1.3em;margin-top:6px;font-size:14px;color:var(--muted)}'+
'.err{color:#e5484d;font-weight:600;margin-top:10px;min-height:1.2em}.okm{color:#2fa36b;font-weight:600;margin-top:10px}'+
'.prof{display:flex;gap:14px;align-items:center;margin-bottom:10px}.prof .av{width:72px;height:72px;margin:0;flex:none}.prof b{font-size:18px;display:block}.prof span.s{color:var(--muted);font-size:14px;display:block}'+
'.st{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:12px 0}'+
'.stc{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:12px 14px;animation:in .3s}'+
'.stc small{display:block;color:var(--muted);font-weight:600;font-size:12px}.stc b{font-size:28px;letter-spacing:-.03em;line-height:1.1}.stc span{display:block;color:var(--muted);font-size:12px}'+
'.bars{display:flex;align-items:flex-end;gap:4px;height:120px;margin-top:12px}'+
'.bar{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;height:100%;font-size:10px;color:var(--muted)}'+
'.bar i{display:block;width:100%;min-height:2px;border-radius:5px 5px 0 0;background:var(--blue);transition:height .6s}'+
'.tp{display:flex;justify-content:space-between;gap:8px;padding:6px 0;border-bottom:1px solid var(--line);font-size:14px}'+
'.mc{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:12px;margin-top:8px}'+
'.mc .t{display:flex;gap:10px;align-items:center}.mc .t>div:last-child{min-width:0;overflow-wrap:anywhere;line-height:1.25;font-size:14px}'+
'.mc .meta{color:var(--muted);font-size:12px;margin-top:6px}'+
'.mc .ac{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}'+
'.mc .ac button{border:0;border-radius:10px;padding:8px 10px;font-weight:700;font-size:13px;background:var(--navy);color:var(--on-navy)}'+
'.mc .ac button.alt{background:var(--surface);color:var(--ink);border:1px solid var(--line)}'+
'.sb{display:inline-block;border-radius:99px;padding:2px 9px;font-size:12px;font-weight:700;background:var(--sky);color:#161848}'+
'.sb.pending{background:#fde8b0}.sb.suspended{background:#ffd9b0}.sb.banned,.sb.rejected{background:#f8c9cb}.sb.active{background:#c9efd9}'+
'.ed{margin-top:10px;padding-top:6px;border-top:1px solid var(--line)}.ed label{display:block;font-size:13px;font-weight:600;margin-top:8px}'+
'.fl{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}.fl button{border:1.5px solid var(--line);background:var(--surface);color:var(--ink);border-radius:99px;padding:6px 12px;font-weight:700;font-size:13px}.fl button.on{background:var(--navy);color:var(--on-navy);border-color:var(--navy)}'+
'details.pw summary{cursor:pointer;font-weight:700;margin-top:14px}';
document.head.appendChild(css);

/* ---------- vues et éléments ---------- */
var host=$("v-cls").parentNode;
host.insertAdjacentHTML("beforeend",'<section class="view" id="v-acc"><div class="qz" id="accbox"></div></section><section class="view" id="v-admin"><div class="qz" id="admbox"></div></section>');
title.acc="Mon compte";title.admin="Espace admin";
var tile=document.createElement("button");tile.className="tile";tile.dataset.v="acc";tile.innerHTML='<i>👤</i><b>Mon compte</b><span>Inscription et connexion</span>';
tile.onclick=function(){location.hash="acc"};$("tiles").insertBefore(tile,$("tiles").lastElementChild);
var bar=document.createElement("button");bar.className="accbar";bar.id="accbar";bar.onclick=function(){location.hash="acc"};
$("qhero").insertAdjacentElement("afterend",bar);

function refresh(){
 if(ACC&&ACC.status==="active"){bar.innerHTML='<i>✅</i><div><b>Connecté : '+esc(nm(ACC.name)[1]||ACC.name)+'</b><span>'+(ACC.role==="admin"?"Administrateur · touche pour ouvrir ton compte":"Touche pour ouvrir ton compte")+'</span></div>';tile.querySelector("b").textContent="Mon compte";tile.querySelector("span").textContent="Ton profil et tes infos"}
 else if(ACC){bar.innerHTML='<i>⏳</i><div><b>Compte en attente</b><span>L’admin doit valider ton inscription</span></div>'}
 else{bar.innerHTML='<i>👤</i><div><b>Crée ton compte</b><span>Réservé aux élèves de L1 ICM</span></div>'}}
function setSession(t,p){TOKEN=t;ACC=p;ls(TK,t);refresh()}
function clearSession(){TOKEN=null;ACC=null;ls(TK,null);refresh()}

/* ---------- connexion / inscription ---------- */
function accShow(){qStop&&qStop();var b=$("accbox");if(ACC)return accProfile();
 b.innerHTML='<h2 style="margin-bottom:10px">Mon compte</h2><div class="seg" id="aseg"><button class="on" data-t="in">Connexion</button><button data-t="up">Inscription</button></div><div id="accf"></div>';
 var bs=b.querySelectorAll("#aseg button");bs.forEach(function(x){x.onclick=function(){bs.forEach(function(y){y.classList.toggle("on",y===x)});x.dataset.t==="in"?formIn():formUp()}});formIn()}
function bindPrev(inp,out){inp.oninput=function(){out.innerHTML=inp.value?who(inp.value):""}}
function formIn(n){var f=$("accf");
 f.innerHTML='<div class="card fm"><h3>Connexion</h3><label>Ton numéro (N°) sur la liste<input id="l-num" inputmode="numeric" pattern="[0-9]*" autocomplete="username"></label><div class="prv" id="l-prv"></div><label>Mot de passe<input id="l-pw" type="password" autocomplete="current-password"></label><div class="err" id="l-err" role="alert"></div><button class="qgo" id="l-go">Se connecter</button><p class="sub" style="margin-top:12px">Mot de passe oublié ? Demande à l’admin de le réinitialiser.</p></div>';
 bindPrev($("l-num"),$("l-prv"));if(n){$("l-num").value=n;$("l-prv").innerHTML=who(n)}
 $("l-go").onclick=function(){var num=$("l-num").value.trim(),pw=$("l-pw").value,er=$("l-err");er.textContent="";
  if(!/^\d+$/.test(num)||!rowOf(num)){er.textContent="Numéro inconnu : regarde ton numéro dans la page « La classe ».";return}
  if(!pw){er.textContent="Entre ton mot de passe.";return}
  var go=$("l-go");go.disabled=true;go.textContent="Connexion…";
  api("login",{p_num:+num,p_password:pw}).then(function(r){
   if(r&&r.error){er.textContent=r.error;return}
   setSession(r.token,r.profile);loadMembers();accShow()}).catch(function(e){er.textContent=e.message}).then(function(){go.disabled=false;go.textContent="Se connecter"})}}
function formUp(){var f=$("accf");
 f.innerHTML='<div class="card fm"><h3>Inscription</h3><p class="sub">Réservée aux élèves de la classe : ton numéro doit figurer sur la liste (page « La classe »). L’admin valide chaque compte.</p>'+
 '<label>Ton numéro (N°) sur la liste<input id="s-num" inputmode="numeric" pattern="[0-9]*"></label><div class="prv" id="s-prv"></div>'+
 '<label>Code de classe<input id="s-code" autocapitalize="characters" autocomplete="off" placeholder="Donné dans le groupe Messenger"></label>'+
 '<label>Lien de ton profil Facebook (facultatif)<input id="s-fb" type="url" placeholder="https://www.facebook.com/…"></label>'+
 '<label>Mot de passe (6 caractères minimum)<input id="s-pw" type="password" autocomplete="new-password"></label>'+
 '<label>Confirme le mot de passe<input id="s-pw2" type="password" autocomplete="new-password"></label>'+
 '<label class="chk"><input type="checkbox" id="s-bg"><span>Bg ny admin</span></label>'+
 '<div class="err" id="s-err" role="alert"></div><button class="qgo" id="s-go">Je m’inscris</button></div>';
 bindPrev($("s-num"),$("s-prv"));
 $("s-go").onclick=function(){var er=$("s-err"),num=$("s-num").value.trim(),pw=$("s-pw").value;er.textContent="";
  if(!/^\d+$/.test(num)||!rowOf(num)){er.textContent="Numéro inconnu : seuls les élèves de la classe peuvent s’inscrire.";return}
  if(!$("s-code").value.trim()){er.textContent="Entre le code de classe.";return}
  if(pw.length<6){er.textContent="Mot de passe : 6 caractères minimum.";return}
  if(pw!==$("s-pw2").value){er.textContent="Les deux mots de passe sont différents.";return}
  if(!$("s-bg").checked){er.textContent="Tu dois cocher « Bg ny admin » pour t’inscrire 😎";return}
  var fb=$("s-fb").value.trim();if(fb&&!okFb(fb)){er.textContent="Lien Facebook invalide (https://www.facebook.com/…).";return}
  var go=$("s-go");go.disabled=true;go.textContent="Envoi…";
  api("register",{p_num:+num,p_password:pw,p_code:$("s-code").value.trim(),p_bg:true,p_facebook:fb||null}).then(function(){
   $("accf").innerHTML='<div class="card fm"><h3>Inscription envoyée ✅</h3><p>Ton compte est <b>en attente de validation</b> par l’admin. Une fois validé, connecte-toi avec ton numéro et ton mot de passe.</p><button class="qgo" id="s-ok">Aller à la connexion</button></div>';
   $("s-ok").onclick=function(){var b0=document.querySelector("#aseg button");b0.click();$("l-num").value=num;$("l-prv").innerHTML=who(num)}
  }).catch(function(e){er.textContent=e.message;go.disabled=false;go.textContent="Je m’inscris"})}}

/* ---------- profil ---------- */
function accProfile(){var b=$("accbox"),r=rowOf(ACC.num),g=r?r.g:(ACC.num<=G1?1:2),ok=ACC.status==="active",p=nm(ACC.name),
 pic=ACC.photo&&okPh(ACC.photo)?'<img alt="" src="'+esc(ACC.photo)+'">':av(ACC.name);
 var h='<h2 style="margin-bottom:10px">Mon compte</h2><div class="card fm"><div class="prof"><div class="av">'+pic+'</div><div><b>'+esc(p[0])+' '+esc(p[1])+'</b><span class="s">N° '+ACC.num+' · Groupe '+g+'</span><span class="sb '+ACC.status+'">'+(ST[ACC.status]||ACC.status)+'</span>'+(ACC.role==="admin"?' <span class="chip">Admin</span>':'')+'</div></div>';
 if(ACC.status==="pending")h+='<p>Ton inscription est <b>en attente de validation</b> par l’admin. Reviens un peu plus tard 🙏</p>';
 else if(!ok)h+='<p class="err">Ce compte n’est pas actif ('+(ST[ACC.status]||ACC.status)+').</p>';
 if(ok&&ACC.role==="admin")h+='<button class="qgo" id="a-adm">🛠️ Ouvrir l’espace admin</button>';
 if(ok)h+='<h3 style="font-size:18px;margin-top:18px">Mon profil public</h3><p class="sub" style="margin:0">Ces infos apparaissent sur ta fiche dans « La classe ».</p><label>Lien de ton profil Facebook<input id="p-fb" type="url" value="'+esc(ACC.facebook||"")+'" placeholder="https://www.facebook.com/…"></label><label>Lien de ta photo (https://… ou photos/nom.jpg)<input id="p-ph" value="'+esc(ACC.photo||"")+'" placeholder="facultatif"></label><div class="err" id="p-msg"></div><button class="qgo" id="p-save">Enregistrer</button>'+
  '<details class="pw"><summary>Changer mon mot de passe</summary><label>Ancien mot de passe<input id="c-old" type="password" autocomplete="current-password"></label><label>Nouveau mot de passe<input id="c-new" type="password" autocomplete="new-password"></label><div class="err" id="c-msg"></div><button class="qgo alt" id="c-save">Changer</button></details>';
 h+='<div><button class="qgo alt" id="a-out">Se déconnecter</button></div></div>';b.innerHTML=h;
 if($("a-adm"))$("a-adm").onclick=function(){location.hash="admin"};
 $("a-out").onclick=function(){var t=TOKEN;clearSession();api("logout",{p_token:t}).catch(function(){});accShow()};
 if($("p-save"))$("p-save").onclick=function(){var m=$("p-msg");m.className="err";m.textContent="";var fb=$("p-fb").value.trim(),ph=$("p-ph").value.trim();
  if(fb&&!okFb(fb)){m.textContent="Lien Facebook invalide (https://www.facebook.com/…).";return}
  if(ph&&!okPh(ph)){m.textContent="Lien de photo invalide (https://… ou photos/nom.jpg).";return}
  api("update_profile",{p_token:TOKEN,p_facebook:fb||null,p_photo:ph||null}).then(function(pf){ACC=pf;m.className="okm";m.textContent="Enregistré ✅";loadMembers()}).catch(function(e){m.textContent=e.message})};
 if($("c-save"))$("c-save").onclick=function(){var m=$("c-msg");m.className="err";m.textContent="";
  api("change_password",{p_token:TOKEN,p_old:$("c-old").value,p_new:$("c-new").value}).then(function(){m.className="okm";m.textContent="Mot de passe changé ✅";$("c-old").value=$("c-new").value=""}).catch(function(e){m.textContent=e.message})}}

/* ---------- espace admin ---------- */
function admShow(){qStop&&qStop();var b=$("admbox");
 if(!ACC||ACC.role!=="admin"||ACC.status!=="active"){location.hash="acc";return}
 b.innerHTML='<h2>Espace admin</h2><p class="sub">Chargement…</p>';admLoad()}
function admLoad(){var y=window.scrollY;
 Promise.all([api("admin_stats",{p_token:TOKEN}),api("admin_members",{p_token:TOKEN}),api("admin_get_code",{p_token:TOKEN})]).then(function(r){
  STATS=r[0];MEMBERS=r[1];CODE=r[2]||"";admDraw();window.scrollTo(0,y)}).catch(function(e){
  if(/Session|Acc/.test(e.message)){clearSession();location.hash="acc";return}
  $("admbox").innerHTML='<h2>Espace admin</h2><p class="err">'+esc(e.message)+'</p>'})}
function statCard(t,v,s){return'<div class="stc"><small>'+t+'</small><b>'+v+'</b><span>'+s+'</span></div>'}
function admDraw(){var s=STATS,m=s.members||{},c=function(k){return m[k]||0},tot=MEMBERS.length,
 mx=Math.max.apply(null,s.days.map(function(d){return d.v}).concat([1])),
 bars=s.days.map(function(d){var dd=d.d.slice(8);return'<div class="bar" title="'+d.d+' : '+d.v+' visites, '+d.u+' visiteurs"><span>'+(d.v||"")+'</span><i style="height:'+Math.max(2,Math.round(d.v/mx*80))+'px"></i><span>'+dd+'</span></div>'}).join(""),
 tp=(s.top_pages||[]).map(function(t){return'<div class="tp"><span>'+esc(title[t.page]||t.page)+'</span><b>'+t.n+'</b></div>'}).join("")||'<p class="sub">Pas encore de visites.</p>';
 var h='<h2>Espace admin</h2><p class="sub">Statistiques et gestion des comptes. Un « visiteur » = un téléphone ou navigateur. Tes propres visites ne sont pas comptées.</p><button class="qgo alt" id="ad-ref" style="margin:0 0 6px">↻ Actualiser</button>'+
 '<div class="st">'+statCard("Visites aujourd’hui",s.visits_today,s.visitors_today+" visiteur"+(s.visitors_today>1?"s":""))+statCard("7 derniers jours",s.visits_7d,s.visitors_7d+" visiteurs")+statCard("30 derniers jours",s.visits_30d,s.visitors_30d+" visiteurs")+statCard("Total",s.visits_total,s.visitors_total+" visiteurs")+'</div>'+
 '<div class="card"><b>Visites · 14 derniers jours</b><div class="bars">'+bars+'</div></div>'+
 '<div class="card" style="margin-top:10px"><b>Pages les plus vues (30 j)</b><div style="margin-top:6px">'+tp+'</div></div>'+
 '<h3 style="margin:20px 0 4px">Comptes</h3><div class="st">'+statCard("Inscrits",tot,"sur "+s.roster+" élèves")+statCard("Actifs",c("active"),c("pending")+" en attente")+statCard("Suspendus",c("suspended"),"")+statCard("Bannis",c("banned"),c("rejected")+" refusés")+'</div>'+
 '<div class="card"><b>Code de classe</b><span class="sub" style="display:block;margin:2px 0 8px">À donner aux camarades pour s’inscrire.</span><div style="display:flex;gap:8px"><input id="ad-code" value="'+esc(CODE)+'" style="flex:1;padding:10px 12px;border:1.5px solid var(--line);border-radius:12px;background:var(--surface);color:var(--ink);font:inherit"><button class="qgo sm" id="ad-codesave">Changer</button></div><div class="err" id="ad-codemsg"></div></div>';
 var pend=c("pending");
 h+='<div class="fl" id="ad-fl">'+[["all","Tous"],["pending","En attente"],["active","Actifs"],["suspended","Suspendus"],["banned","Bannis"]].map(function(x){return'<button data-f="'+x[0]+'" class="'+(AF===x[0]?"on":"")+'">'+x[1]+'</button>'}).join("")+'</div>'+
 (pend?'<button class="qgo" id="ad-bulk" style="margin:0 0 8px">✅ Approuver les '+pend+' en attente</button>':'')+
 '<input id="ad-q" type="search" placeholder="Rechercher un nom ou un numéro" value="'+esc(AQ)+'" style="width:100%"><div id="ad-list"></div>';
 $("admbox").innerHTML=h;
 $("ad-ref").onclick=admLoad;
 $("ad-codesave").onclick=function(){var m=$("ad-codemsg");m.className="err";m.textContent="";api("admin_set_code",{p_token:TOKEN,p_code:$("ad-code").value}).then(function(){m.className="okm";m.textContent="Code changé ✅";CODE=$("ad-code").value.trim()}).catch(function(e){m.textContent=e.message})};
 document.querySelectorAll("#ad-fl button").forEach(function(b){b.onclick=function(){AF=b.dataset.f;document.querySelectorAll("#ad-fl button").forEach(function(x){x.classList.toggle("on",x===b)});admList()}});
 $("ad-q").oninput=function(){AQ=this.value;admList()};
 if($("ad-bulk"))$("ad-bulk").onclick=function(){if(!confirm("Approuver tous les comptes en attente ?"))return;api("admin_bulk_approve",{p_token:TOKEN}).then(admLoad).catch(function(e){alert(e.message)})};
 admList()}
function mcard(m){var r=rowOf(m.num),g=r?r.g:(m.num<=G1?1:2),p=nm(m.name),a="",bt=function(k,t,al){return'<button data-act="'+k+'" data-n="'+m.num+'"'+(al?' class="alt"':'')+'>'+t+'</button>'};
 if(m.role!=="admin"){
  if(m.status==="pending")a+=bt("approve","✅ Approuver")+bt("reject","Refuser",1);
  if(m.status==="active")a+=bt("suspend","⏸ Suspendre",1)+bt("ban","⛔ Bannir",1);
  if(m.status==="suspended")a+=bt("react","▶ Réactiver")+bt("ban","⛔ Bannir",1);
  if(m.status==="banned"||m.status==="rejected")a+=bt("react","▶ Réactiver");
  a+=bt("edit","✏️ Modifier",1)+bt("del","🗑 Supprimer",1)}
 else a+=bt("edit","✏️ Modifier",1);
 var ed=EDIT===m.num?'<div class="ed"><label>Nom<input id="e-name" value="'+esc(m.name)+'"></label><label>Lien Facebook<input id="e-fb" value="'+esc(m.facebook||"")+'"></label><label>Lien photo<input id="e-ph" value="'+esc(m.photo||"")+'"></label><label>Note (visible par toi seul)<input id="e-note" value="'+esc(m.note||"")+'"></label><label>Nouveau mot de passe (laisse vide pour ne pas changer)<input id="e-pw" type="text" autocomplete="off"></label><div class="err" id="e-msg"></div><div class="ac"><button data-act="save" data-n="'+m.num+'">Enregistrer</button><button class="alt" data-act="cancel" data-n="'+m.num+'">Annuler</button></div></div>':"";
 return'<div class="mc"><div class="t"><div class="nb g'+g+'"><b>'+m.num+'</b><small>GROUPE '+g+'</small></div><div><b>'+esc(p[0])+'</b> '+esc(p[1])+'<br><span class="sb '+m.status+'">'+(ST[m.status]||m.status)+'</span>'+(m.role==="admin"?' <span class="chip">Admin</span>':'')+(m.status==="suspended"&&m.suspended_until?' <small>jusqu’au '+fdt(m.suspended_until)+'</small>':'')+'</div></div><div class="meta">Inscrit le '+fdt(m.created_at)+' · dernière connexion '+fdt(m.last_login)+' · '+m.login_count+' connexion'+(m.login_count>1?'s':'')+(m.note?'<br>📝 '+esc(m.note):'')+'</div><div class="ac">'+a+'</div>'+ed+'</div>'}
function admList(){var q=nkey(AQ),num=/^\d+$/.test(AQ.trim())?+AQ.trim():null,L=MEMBERS.filter(function(m){if(AF!=="all"&&m.status!==AF)return false;if(!q)return true;return num!==null?m.num===num:nkey(m.name).indexOf(q)>-1});
 $("ad-list").innerHTML=L.map(mcard).join("")||'<p class="sub" style="margin-top:12px">Aucun compte.</p>';}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("#ad-list button[data-act]");if(!b)return;
 var act=b.dataset.act,n=+b.dataset.n,m=MEMBERS.filter(function(x){return x.num===n})[0];if(!m)return;
 var done=function(){admLoad()},fail=function(er){alert(er.message)},st=function(s,d,note){return api("admin_set_status",{p_token:TOKEN,p_num:n,p_status:s,p_days:d||null,p_note:note||null}).then(done).catch(fail)};
 if(act==="approve"||act==="react")return st("active");
 if(act==="reject"){if(confirm("Refuser l’inscription de "+m.name+" ?"))st("rejected");return}
 if(act==="suspend"){var d=prompt("Suspendre "+m.name+" pendant combien de jours ?","7");if(d===null)return;d=parseInt(d,10);if(!(d>0)){alert("Nombre de jours invalide");return}st("suspended",d);return}
 if(act==="ban"){if(confirm("Bannir "+m.name+" ? Le compte ne pourra plus se connecter."))st("banned");return}
 if(act==="del"){if(confirm("Supprimer le compte de "+m.name+" ? L’élève pourra se réinscrire."))api("admin_delete_member",{p_token:TOKEN,p_num:n}).then(done).catch(fail);return}
 if(act==="edit"){EDIT=n;admList();return}
 if(act==="cancel"){EDIT=null;admList();return}
 if(act==="save"){var msg=$("e-msg"),pw=$("e-pw").value.trim();msg.textContent="";
  api("admin_update_member",{p_token:TOKEN,p_num:n,p_name:$("e-name").value,p_facebook:$("e-fb").value,p_photo:$("e-ph").value,p_note:$("e-note").value}).then(function(){
   return pw?api("admin_reset_password",{p_token:TOKEN,p_num:n,p_password:pw}):null}).then(function(){EDIT=null;admLoad()}).catch(function(er){msg.textContent=er.message})}});

/* ---------- profils publics des inscrits ---------- */
function loadMembers(){api("public_profiles").then(function(a){var m={};(a||[]).forEach(function(x){var r=ROWS.filter(function(y){return y.nums[0]===x.num})[0];if(!r)return;
  var o={};if(x.facebook&&okFb(x.facebook))o.facebook=x.facebook;if(x.photo&&okPh(x.photo))o.photo=x.photo;m[r.n]=o});MEMB=m;pp()}).catch(function(){})}

/* ---------- visites ---------- */
function track(){if(ACC&&ACC.role==="admin")return;var pg=(location.hash.slice(1)||"home").slice(0,30);api("track",{p_vid:vid(),p_page:pg,p_token:TOKEN}).catch(function(){})}
window.addEventListener("hashchange",track);

window.accShow=accShow;window.admShow=admShow;
refresh();loadMembers();
if(TOKEN)api("me",{p_token:TOKEN}).then(function(p){if(p&&!p.error){ACC=p;ls(TK,TOKEN)}else clearSession();refresh();track();if(/^#(acc|admin)$/.test(location.hash))route()}).catch(function(){track()});
else track();
route();
})();

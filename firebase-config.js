/* ============================================================
   CONFIGURATION DES COMPTES · L1 ICM
   Remplis ce fichier UNE SEULE FOIS (voir GUIDE-COMPTES.md).
   Tant que "actif" est false, le site fonctionne comme avant.
   ============================================================ */
var COMPTES = {

  /* Mets true quand tout est rempli ci-dessous */
  actif: true,

  /* Copie ces valeurs depuis Firebase :
     Paramètres du projet → Tes applications → Application Web → Configuration */
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    appId: ""
  },

  /* TON e-mail d'admin (le compte créé dans Firebase → Authentication).
     Il doit être IDENTIQUE à celui écrit dans firestore.rules */
  adminEmail: "",

  /* false = le site reste ouvert à tous, les comptes sont facultatifs
     true  = il faut être connecté avec un compte actif pour voir le site */
  obligatoire: true,

  /* false = le compte est actif tout de suite après l'inscription
     true  = le compte reste « en attente » jusqu'à ce que tu le valides */
  validation: true,

  /* Ne change pas (doit être identique à firestore.rules) */
  domaine: "l1icm.app"
};

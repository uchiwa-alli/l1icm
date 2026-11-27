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
    apiKey: "AIzaSyAIkx4C_fq-eRFKE7XqJXSu2K9zTIZiLz4",
    authDomain: "l1icm-c8994.firebaseapp.com",
    projectId: "l1icm-c8994",
    appId: "1:126090118579:web:99df7cf3262e37ebb737c6"
  },

  /* TON e-mail d'admin (le compte créé dans Firebase → Authentication).
     Il doit être IDENTIQUE à celui écrit dans firestore.rules */
  adminEmail: "uchiwajems@gmail.com",

  /* false = le site reste ouvert à tous, les comptes sont facultatifs
     true  = il faut être connecté avec un compte actif pour voir le site */
  obligatoire: false,

  /* false = le compte est actif tout de suite après l'inscription
     true  = le compte reste « en attente » jusqu'à ce que tu le valides */
  validation: false,

  /* Ne change pas (doit être identique à firestore.rules) */
  domaine: "l1icm.app"
};

/* ============================================================
   CONFIGURATION DES COMPTES · L1 ICM
   Connexion OBLIGATOIRE : sans compte actif, le site reste fermé.
   ============================================================ */
var COMPTES = {

  /* true  = comptes en service (laisse true)
     false = coupe tout le système de comptes et ouvre le site à tout le monde */
  actif: true,

  /* Copie ces valeurs depuis Firebase :
     Paramètres du projet → Tes applications → Application Web → Configuration
     (ces valeurs ne sont pas secrètes : la sécurité vient des règles Firestore) */
  firebase: {
    apiKey: "AIzaSyAIkx4C_fq-eRFKE7XqJXSu2K9zTIZiLz4",
    authDomain: "l1icm-c8994.firebaseapp.com",
    projectId: "l1icm-c8994",
    appId: "1:126090118579:web:99df7cf3262e37ebb737c6"
  },

  /* L'administrateur n'est PLUS reconnu par son e-mail dans ce fichier.
     Il est déclaré dans Firestore : collection « admins », un document dont
     l'ID est l'UID de ton compte (voir les étapes à la fin de firestore.rules). */

  /* true  = il faut être connecté avec un compte ACTIF pour voir le site (recommandé)
     false = le site reste ouvert à tous */
  obligatoire: true,

  /* Ne change pas (doit être identique à firestore.rules) */
  domaine: "l1icm.app"
};

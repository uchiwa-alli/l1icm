/* ============================================================
   INFOS DU JOUR · L1 ICM · EMIT Fianarantsoa
   C'est le SEUL fichier à modifier chaque jour.
   Règles : garde les guillemets "..." et les virgules , entre
   les éléments. Ne supprime pas les crochets [ ] ni les accolades { }.
   ============================================================ */
var INFOS = {

  /* 1) BANDEAU D'ALERTE sur l'accueil (cours annulé, changement de salle…)
        Pour le cacher : mets  texte: ""
        type : "alerte" (rouge) ou "info" (bleu) */
  banniere: { texte: "", type: "alerte" },

  /* 2) SALLE par défaut de tous les cours */
  salle: "B 101",

  /* 3) GROUPES : le groupe 1 va du N° 1 jusqu'à ce numéro,
        le groupe 2 commence au numéro suivant */
  groupe1Max: 173,

  /* 4) ANNONCES (la plus récente en premier)
        jour : "AAAA-MM-JJ" → affiche un compte à rebours (optionnel, sinon mets "") */
  annonces: [
    { date: "26 nov. 2026", jour: "",           titre: "Français des affaires · Dr Fara", texte: "🟢 NB: REHEFA MANAO FRANÇAIS DES AFFAIRES @ Dr FARA ZAY VAO MIZARA GROUPE ✅" },
    { date: "4 déc. 2026",  jour: "2026-12-04", titre: "Début du cours de GSE avec Dr Jacques Aimé", texte: "Le vendredi 4 décembre 2026, de 7h à 10h." },
    { date: "26 nov. 2026", jour: "",           titre: "Nouvel emploi du temps", texte: "Mis à jour le 26 novembre 2026. Tous les cours ont lieu en salle B 101. Français des affaires : Groupe 1 (N° 1 à 173) et Groupe 2 (N° 174 à 345)." }
  ],

  /* 5) LEÇONS PDF (page « Leçons PDF »)
        Mets le fichier PDF dans le dossier "cours" puis ajoute une ligne ici.
        fichier : chemin du PDF, par exemple "cours/SE-MacOS.pdf" */
  lecons: [
    { matiere: "MAC OS", prof: "Mme Sylvie", titre: "Introduction aux systèmes d’exploitation et à MacOS", fichier: "cours/SE-MacOS.pdf" },
    { matiere: "IM", prof: "Mme Sylvie", titre: "Chapitre 1 · Introduction", fichier: "cours/IM-chapitre-1-introduction.pdf" },
    { matiere: "IM", prof: "Mme Sylvie", titre: "Chapitre 2 · Création d’un objet multimédia", fichier: "cours/IM-chapitre-2-creation-objet.pdf" },
    { matiere: "IM", prof: "Mme Sylvie", titre: "Chapitre 3 · Le texte", fichier: "cours/IM-chapitre-3-texte.pdf" },
    { matiere: "IM", prof: "Mme Sylvie", titre: "Chapitre 4 · L’image", fichier: "cours/IM-chapitre-4-image.pdf" },
    { matiere: "IM", prof: "Mme Sylvie", titre: "Chapitre 5 · Le son", fichier: "cours/IM-chapitre-5-son.pdf" },
    { matiere: "IM", prof: "Mme Sylvie", titre: "Chapitre 6 · La vidéo", fichier: "cours/IM-chapitre-6-video.pdf" }
  ],

  /* 6) PROFILS DES CAMARADES (photo + lien Facebook, facultatifs)
        Le nom doit être écrit EXACTEMENT comme dans la liste de la classe.
        photo : chemin d'une image carrée dans le dossier "photos"
        facebook : lien complet du profil (commençant par https://) */
  profils: {
    "ANDRIAHITHARSON Theoddy Ephrem": { photo: "photos/theoddy-ephrem.jpg", facebook: "https://www.facebook.com/profile.php?id=61594108423989" }
  },

  /* 7) FICHES ENVOYÉES PAR LES ÉLÈVES (formulaire Google, validées par toi)
        formulaire : lien du formulaire (bouton « Ajouter ou modifier ma fiche »)
        csv : lien publié de la feuille « Site » (seules les lignes OUI y figurent) */
  fiches: {
    formulaire: "https://forms.gle/g7jhEg6KmKuVRCtr7",
    csv: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7dx8YJFTpscxuHKqN4y_DyEvam8o04NPjJohOXPvbmyN3IVmDc8RrHrs7QiebwgQEpRQvGomTFf5J/pub?gid=1209079916&single=true&output=csv"
  },

  /* 8) EMPLOI DU TEMPS (semaine type)
        [jour, heure début, heure fin, "Matière", "Enseignant", "Salle (optionnel)", "Début le (optionnel)"]
        jour : 1=Lundi 2=Mardi 3=Mercredi 4=Jeudi 5=Vendredi 6=Samedi 0=Dimanche
        Début le : "AAAA-MM-JJ" → avant cette date, le cours affiche un compte à rebours
        Exemple avec une salle différente : [3, 9, 11, "IOB", "Mme Hoby", "B 12"] */
  edt: [
    [1, 8, 10, "Français des affaires", "Dr Fara · Groupe 1"],
    [1, 10, 12, "Français des affaires", "Dr Fara · Groupe 2"],
    [1, 14, 16, "IOB", "Mme Hoby"],
    [2, 10, 12, "MAC OS", "Mme Sylvie"],
    [3, 9, 11, "IOB", "Mme Hoby"],
    [4, 7, 10, "IM", "Mme Sylvie"],
    [4, 14, 17, "METU", "Pr Henri"],
    [5, 7, 10, "GSE", "Dr Jacques Aimé", "", "2026-12-04"],
    [5, 16, 18, "Anglais", "Mr Toky"]
  ]
};

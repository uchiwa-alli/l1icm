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

  /* 3) ANNONCES (la plus récente en premier)
        jour : "AAAA-MM-JJ" → affiche un compte à rebours (optionnel, sinon mets "") */
  annonces: [
    { date: "26 nov. 2026", jour: "",           titre: "🟢 NB · Français des affaires", texte: "🟢NB: REHEFA MANAO FRANÇAIS DES AFFAIRES @ Dr FARA ZAY VAO MIZARA GROUPE ✅" },
    { date: "26 nov. 2026", jour: "",           titre: "Nouvelle liste de la classe", texte: "La liste affiche maintenant les numéros et les groupes. Groupe 1 : n° 1 à 173. Groupe 2 : n° 174 à 345. Va dans « La classe » pour trouver ton numéro." },
    { date: "26 nov. 2026", jour: "",           titre: "Emploi du temps mis à jour", texte: "Français des affaires en 2 groupes (Gp 1 : 8h-10h, Gp 2 : 10h-12h). IM le jeudi et GSE le vendredi passent à 8h-10h. Tous les cours ont lieu en salle B 101." },
    { date: "4 déc. 2026",  jour: "2026-12-04", titre: "GSE avec Dr Jacques Aimé", texte: "Cours de 8h à 10h, le vendredi 4 décembre." }
  ],

  /* 4) LEÇONS PDF (page « Leçons PDF »)
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

  /* 5) PROFILS DES CAMARADES (photo + lien Facebook, facultatifs)
        Le nom doit être écrit EXACTEMENT comme dans la liste de la classe.
        photo : chemin d'une image carrée dans le dossier "photos"
        facebook : lien complet du profil (commençant par https://) */
  profils: {
    "ANDRIAHITHARSON Theoddy Ephrem": { photo: "photos/theoddy-ephrem.jpg", facebook: "https://www.facebook.com/profile.php?id=61594108423989" }
  },

  /* 6) FICHES ENVOYÉES PAR LES ÉLÈVES (formulaire Google, validées par toi)
        formulaire : lien du formulaire (bouton « Ajouter ou modifier ma fiche »)
        csv : lien publié de la feuille « Site » (seules les lignes OUI y figurent) */
  fiches: {
    formulaire: "https://forms.gle/g7jhEg6KmKuVRCtr7",
    csv: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7dx8YJFTpscxuHKqN4y_DyEvam8o04NPjJohOXPvbmyN3IVmDc8RrHrs7QiebwgQEpRQvGomTFf5J/pub?gid=1209079916&single=true&output=csv"
  },

  /* 7) EMPLOI DU TEMPS (semaine type)
        [jour, heure début, heure fin, "Matière", "Enseignant", "Salle (optionnel)"]
        jour : 1=Lundi 2=Mardi 3=Mercredi 4=Jeudi 5=Vendredi 6=Samedi 0=Dimanche
        Exemple avec salle différente : [3, 9, 11, "IOB", "Mme Hoby", "B 12"] */
  edt: [
    [1, 8, 10, "Français des affaires", "Dr Fara · Gp 1"],
    [1, 10, 12, "Français des affaires", "Dr Fara · Gp 2"],
    [1, 14, 16, "IOB", "Mme Hoby"],
    [2, 10, 12, "MAC OS", "Mme Sylvie"],
    [3, 9, 11, "IOB", "Mme Hoby"],
    [4, 8, 10, "IM", "Mme Sylvie"],
    [4, 14, 17, "METU", "Pr Henri"],
    [5, 8, 10, "GSE", "Dr Jacques Aimé"],
    [5, 16, 18, "Anglais", "Mr Toky"]
  ]
};

/* =====================================================================
   ACADÉMIE · banque de questions par matière et par chapitre
   Construite à partir des PDF du dossier « cours ».

   Chaque question s'écrit avec  Qz("Question ?", "Explication", "Bonne réponse", "Faux 1", "Faux 2", "Faux 3")
   (la bonne réponse est TOUJOURS la 3e information ; le site mélange l'ordre à l'affichage).

   Pour ajouter une matière : copie un bloc { id, nom, ... } dans « matieres ».
   Pour ajouter un chapitre : copie un bloc { id, titre, fichier, qs: [ ... ] } dans « chapitres ».
   Un chapitre doit avoir au moins 8 questions.
   ===================================================================== */
var ACADEMIE = (function () {
function Qz(t, e, ok, f1, f2, f3) { return { q: t, o: [ok, f1, f2, f3], a: 0, e: e }; }
return {
  matieres: [

    /* ------------------------------------------------------------ IM */
    { id: "im", nom: "IM · Introduction au multimédia", prof: "Mme Sylvie", emoji: "🎬", chapitres: [

      { id: "im1", titre: "Chapitre 1 · Introduction", fichier: "cours/IM-chapitre-1-introduction.pdf", qs: [
        Qz("Quels sont les 4 objets multimédia de base ?", "Le cours cite : le texte, l’image, le son et la séquence vidéo.", "Texte, image, son, séquence vidéo", "Texte, tableau, graphique, e-mail", "Image, logiciel, réseau, son", "Son, vidéo, réseau, normes"),
        Qz("Qu’est-ce qu’un objet multimédia composite ?", "C’est l’intégration de plusieurs objets multimédia de base dans un seul objet.", "L’intégration de plusieurs objets multimédia de base", "Un objet qui ne contient que du texte", "Un fichier compressé", "Un objet sans son"),
        Qz("Un document multimédia est un document interactif qui comprend…", "Il faut au moins deux signaux de types différents (texte, son, image, vidéo).", "Au moins deux signaux de type différent", "Au moins un seul signal", "Exactement trois signaux", "Uniquement des images"),
        Qz("Lequel n’est PAS un acteur technologique du document multimédia ?", "Les 4 acteurs : les signaux multimédia, les réseaux de télécommunication, l’informatique et la normalisation.", "Le papier", "Les réseaux de télécommunication", "L’informatique", "La normalisation"),
        Qz("Quel réseau est le plus utilisé et le plus vaste pour transmettre des données multimédia ?", "L’Internet est le réseau le plus utilisé et le plus vaste.", "L’Internet", "Le réseau téléphonique", "La télédiffusion", "Le réseau de télédistribution"),
        Qz("À quoi servent les normes (standards) ?", "Un échange d’information n’est possible que s’il existe un « langage » commun : les normes.", "À offrir un langage commun pour échanger l’information", "À ralentir les échanges", "À remplacer les logiciels", "À compresser les fichiers"),
        Qz("Quels exemples de normes le cours cite-t-il ?", "Le cours cite le format A4, les familles H32x, HTML/XML, MPEG et les numéros ISBN.", "HTML, XML, MPEG, ISBN", "Word, Excel, Paint", "Wi-Fi, USB, HDMI", "Facebook, Google, YouTube"),
        Qz("Laquelle est une application PROFESSIONNELLE du multimédia ?", "Professionnel : formation à distance, visioconférence, commerce électronique, réservation en ligne.", "La visioconférence", "Le livre électronique de loisir", "La télévision", "L’encyclopédie électronique"),
        Qz("Pourquoi la vidéo devrait-elle être vue comme un objet composite ?", "Elle associe des images animées et du son.", "Elle associe des images animées et du son", "Elle est trop lourde", "Elle se lit sur écran", "Elle est toujours numérique"),
        Qz("Quels traitements appliquer à l’image et à la vidéo avant diffusion ?", "Le tableau du cours indique : numérisation, amélioration, codage.", "Numérisation, amélioration, codage", "Impression, reliure, envoi", "Saisie, recherche, dessin", "Filtrage uniquement")
      ] },

      { id: "im2", titre: "Chapitre 2 · Création d’un objet multimédia", fichier: "cours/IM-chapitre-2-creation-objet.pdf", qs: [
        Qz("La création d’un objet multimédia nécessite au moins…", "Un dispositif d’acquisition pour le créer et un dispositif de restitution pour le rendre accessible.", "Un dispositif d’acquisition et un dispositif de restitution", "Un logiciel et une imprimante", "Un scanner et un écran", "Un réseau et un serveur"),
        Qz("Quel est le dispositif d’acquisition du son ?", "Le son s’acquiert avec un microphone et se restitue avec un haut-parleur.", "Le microphone", "Le haut-parleur", "L’écran", "L’imprimante"),
        Qz("Quel est le dispositif de restitution du son ?", "Le haut-parleur rend le son accessible à l’utilisateur.", "Le haut-parleur", "Le clavier", "Le scanner", "La webcam"),
        Qz("Quel dispositif permet d’acquérir une image ?", "Image : scanner, appareil photo… Texte : clavier. Vidéo : caméra, webcam.", "Un scanner ou un appareil photo", "Le clavier", "Le microphone", "Le haut-parleur"),
        Qz("Qu’est-ce qu’une chaîne de traitements multimédia ?", "C’est l’ensemble des traitements et modifications possibles sur un objet entre l’acquisition et la restitution.", "L’ensemble des traitements possibles entre l’acquisition et la restitution", "Un réseau d’ordinateurs", "Un type de fichier", "Une marque de logiciel"),
        Qz("Que sont les « données encodées » ?", "Ce sont les données enregistrées depuis le dispositif d’acquisition, sans traitement.", "L’information enregistrée depuis l’acquisition, sans traitement", "Des données déjà compressées", "Des données supprimées", "Des données imprimées"),
        Qz("Que permet le logiciel d’édition ?", "Il lit un fichier, permet de le modifier et de l’enregistrer sous un nouveau fichier.", "Lire un fichier, le modifier et l’enregistrer en nouveau fichier", "Seulement lire le fichier final", "Fabriquer le matériel", "Brancher un microphone"),
        Qz("Quels sont les objectifs de la compression et/ou du recodage ?", "Recoder dans des formats adaptés aux logiciels, et réduire la taille du fichier.", "Recoder dans des formats adaptés et réduire la taille", "Rendre le fichier illisible", "Augmenter la taille des fichiers", "Supprimer l’objet"),
        Qz("À quoi sert le logiciel de rendu ?", "Il lit le fichier final et rend l’objet accessible à l’utilisateur (ex. Winamp pour le son).", "À lire le fichier final et le rendre accessible", "À modifier le fichier", "À acquérir l’information", "À compresser le son"),
        Qz("Quel est un exemple de recodage cité dans le cours ?", "Exemples : .wav vers .mp3 pour le son, .txt vers .html pour le texte.", "Un fichier .wav vers un fichier .mp3", "Papier vers carton", "Texte vers son", "Photo vers vidéo"),
        Qz("Quel est un dispositif de restitution d’une vidéo ?", "Vidéo : écran, haut-parleur, vidéoprojecteur… La caméra et la webcam servent à l’acquisition.", "Le vidéoprojecteur", "La webcam", "Le clavier", "La caméra")
      ] },

      { id: "im3", titre: "Chapitre 3 · Le texte et le codage", fichier: "cours/IM-chapitre-3-texte.pdf", qs: [
        Qz("Quelle est l’unité de base du stockage de l’information ?", "Le bit ne stocke que 1 ou 0.", "Le bit", "L’octet", "Le pixel", "Le mégaoctet"),
        Qz("Un bit peut stocker…", "Une information très simple : 1 ou 0 (vrai/faux, oui/non).", "Soit 1, soit 0", "Une valeur parmi 256", "Un caractère accentué", "Un mot entier"),
        Qz("1 octet vaut…", "Un octet est un paquet de 8 bits.", "8 bits", "4 bits", "16 bits", "10 bits"),
        Qz("1 Ko vaut…", "1 Ko = 2^10 octets = 1024 octets.", "1024 octets", "1000 octets", "2048 octets", "100 octets"),
        Qz("1 Mo vaut…", "1 Mo = 2^20 octets = 1024 Ko = 1 048 576 octets.", "1024 Ko", "1000 Ko", "1024 octets", "2^30 octets"),
        Qz("Quels symboles utilise la base binaire ?", "Le binaire n’utilise que 0 et 1.", "0 et 1", "0 à 9", "0 à 7", "0 à 9 et A à F"),
        Qz("Quels symboles utilise la base hexadécimale ?", "Hexadécimal : 0 à 9, puis A, B, C, D, E et F.", "0 à 9 puis A à F", "0 et 1", "0 à 7", "A à Z"),
        Qz("(19) en décimal s’écrit en binaire…", "19 = 16 + 2 + 1 = 1×2⁴ + 0×2³ + 0×2² + 1×2¹ + 1×2⁰ = 10011.", "10011", "11001", "10101", "11100"),
        Qz("(10111111) en binaire vaut en décimal…", "128 + 32 + 16 + 8 + 4 + 2 + 1 = 191.", "191", "127", "255", "183"),
        Qz("Le code ASCII standard est codé sur…", "7 bits, donc 128 éléments codés.", "7 bits", "8 bits", "16 bits", "32 bits"),
        Qz("Quelle limite du code ASCII le cours mentionne-t-il ?", "Il n’a aucun caractère accentué : il a été conçu pour l’anglais.", "Il n’a aucun caractère accentué (conçu pour l’anglais)", "Il ne code pas les chiffres", "Il ne code que des majuscules", "Il est trop récent"),
        Qz("Quel est le code ASCII décimal de la lettre « M » ?", "Dans l’annexe : M = 77 = 01001101 en binaire = 4D en hexadécimal.", "77", "65", "97", "109")
      ] },

      { id: "im4", titre: "Chapitre 4 · L’image", fichier: "cours/IM-chapitre-4-image.pdf", qs: [
        Qz("Qu’est-ce qu’un pixel ?", "Le pixel est l’unité de base, le plus petit élément d’une image numérique.", "Le plus petit élément d’une image numérique", "Une unité de mesure du son", "Un format de fichier", "Un type de compression"),
        Qz("Quels sont les deux types d’images numériques ?", "Image matricielle (pixels) et image vectorielle (formes géométriques).", "Matricielle et vectorielle", "Binaire et indexée", "Fixe et animée", "JPG et PNG"),
        Qz("Quel est l’avantage de l’image vectorielle ?", "Elle occupe peu de place et se redimensionne sans perte de qualité.", "Elle se redimensionne sans perte de qualité", "Elle est formée de pixels", "Elle est toujours très lourde", "Elle dépend de la résolution"),
        Qz("Combien de bits par pixel pour une image binaire (noir et blanc) ?", "Un seul bit suffit : 1 = blanc, 0 = noir.", "1 bit", "2 bits", "8 bits", "24 bits"),
        Qz("Une image en niveaux de gris est codée sur…", "8 bits par pixel, soit 256 nuances de gris.", "8 bits (256 nuances)", "1 bit (2 nuances)", "16 bits (65 536 nuances)", "24 bits (16 millions)"),
        Qz("Une image « vrai couleur » combine les couches…", "Rouge, Vert et Bleu, avec 256 nuances chacune.", "Rouge, Vert, Bleu", "Cyan, Magenta, Jaune", "Noir, Blanc, Gris", "Rouge, Jaune, Bleu"),
        Qz("Combien de couleurs possibles en RVB (256 × 256 × 256) ?", "256 × 256 × 256 = environ 16 millions de possibilités.", "Environ 16 millions", "Environ 65 000", "256", "Environ 1 million"),
        Qz("À quoi sert la 4e composante parfois ajoutée en vrai couleur ?", "Elle exprime la transparence du point : on passe à 4 octets par point.", "La transparence", "La luminosité", "Le son", "La netteté"),
        Qz("Taille d’une image 640 × 480 en niveaux de gris (8 bits) ?", "640 × 480 × 8 / 8 = 307 200 octets.", "307 200 octets", "921 600 octets", "640 octets", "38 400 octets"),
        Qz("La résolution spatiale s’exprime en…", "En pixels par pouce (ppp, ou dpi en anglais).", "Pixels par pouce (ppp / dpi)", "Décibels", "Hertz", "Bits par seconde"),
        Qz("Quel format utilise une compression SANS perte ?", "Le cours cite le format PNG comme exemple de compression sans perte.", "PNG", "JPEG", "MPEG", "MP3"),
        Qz("Quel format est une compression AVEC perte, adapté aux photos ?", "JPEG est une compression destructive : plus on compresse, plus l’image se dégrade.", "JPEG", "PNG", "GIF", "TIFF"),
        Qz("Quel format sert aux logos et gère l’animation avec 256 couleurs ?", "GIF : 256 couleurs (palette), animation et transparence.", "GIF", "BMP", "JPEG", "TIFF"),
        Qz("Dans une image en couleur indexée, chaque pixel contient…", "Un indice qui pointe vers une couleur précise de la palette.", "Un indice qui pointe vers une couleur de la palette", "Ses trois valeurs RVB", "Un nombre de bits", "Un son")
      ] },

      { id: "im5", titre: "Chapitre 5 · Le son", fichier: "cours/IM-chapitre-5-son.pdf", qs: [
        Qz("Dans quel milieu le son ne peut-il PAS se propager ?", "Il faut un milieu élastique (air, eau, solides). Dans le vide, il n’y a aucun support.", "Le vide", "L’eau", "L’air", "Les matériaux solides"),
        Qz("Quelles sont les 3 actions mises en jeu pour un son ?", "Émission, propagation et réception.", "Émission, propagation, réception", "Saisie, rendu, impression", "Capture, filtre, export", "Codage, décodage, lecture"),
        Qz("L’amplitude (volume sonore) se mesure en…", "En décibels (dB). 0 dB est le seuil d’audibilité.", "Décibels (dB)", "Hertz", "Pixels", "Octets"),
        Qz("Plus la fréquence est élevée, plus le son est…", "Fréquence élevée = son aigu ; fréquence basse = son grave. Elle se mesure en Hz.", "Aigu", "Grave", "Faible", "Lent"),
        Qz("Quel composant convertit le signal analogique en numérique ?", "C’est la carte son, avec ses convertisseurs analogique/numérique.", "La carte son", "Le haut-parleur", "L’écran", "Le clavier"),
        Qz("Quelles sont les 3 étapes de la numérisation du son ?", "Échantillonnage, quantification, codage.", "Échantillonnage, quantification, codage", "Filtrage, compression, lecture", "Émission, propagation, réception", "Capture, édition, rendu"),
        Qz("Quelle fréquence d’échantillonnage correspond à la qualité CD ?", "44 100 Hz = qualité CD. 8 000 Hz = téléphone, 22 050 Hz = radio FM, 48 000 Hz = DVD.", "44 100 Hz", "8 000 Hz", "22 050 Hz", "192 000 Hz"),
        Qz("Combien de valeurs possibles avec une quantification sur 8 bits ?", "2^8 = 256 valeurs possibles.", "256", "8", "64", "65 536"),
        Qz("Plus le nombre de bits de quantification est élevé…", "Plus il y a de paliers, plus l’erreur de quantification est faible.", "Plus l’erreur de quantification est faible", "Plus l’erreur est forte", "Plus le son est grave", "Plus le fichier est petit"),
        Qz("Taille d’un fichier audio non compressé =", "Taux d’échantillonnage × nombre de bits × nombre de secondes × nombre de voies.", "Taux d’échantillonnage × bits × secondes × voies", "Fréquence × amplitude", "Bits ÷ secondes", "Voies + secondes"),
        Qz("Combien de canaux dans le format 5.1 ?", "FL, C, FR, SL, SR et LFE (caisson de grave) = 6 canaux.", "6", "5", "4", "2"),
        Qz("Quel format audio est compressé AVEC perte et très répandu ?", "Le MP3 est le format le plus connu de compression avec perte.", "MP3", "WAV", "AIFF", "FLAC"),
        Qz("Quel format audio compresse SANS perte ?", "FLAC (Free Lossless Audio Codec) est le plus utilisé en compression sans perte.", "FLAC", "MP3", "WMA", "AAC")
      ] },

      { id: "im6", titre: "Chapitre 6 · La vidéo", fichier: "cours/IM-chapitre-6-video.pdf", qs: [
        Qz("Quels sont les deux aspects de l’information optique ?", "La couleur (chrominance) et la lumière (luminance).", "Chrominance (couleur) et luminance (lumière)", "Amplitude et fréquence", "Pixel et octet", "Débit et bande passante"),
        Qz("Qu’est-ce qu’une vidéo ?", "Une succession d’images affichées selon une certaine cadence (fréquence).", "Une succession d’images affichées à une certaine fréquence", "Une image unique", "Un son numérisé", "Un texte animé"),
        Qz("Combien d’images par seconde pour un film au cinéma ?", "24 images/s au cinéma, environ 20 comme seuil d’animation, 29 ou 30 à la télévision.", "24", "20", "30", "60"),
        Qz("Quel est le seuil inférieur pour percevoir une animation ?", "Environ 20 images par seconde.", "Environ 20 images/s", "Environ 5 images/s", "Environ 60 images/s", "Environ 100 images/s"),
        Qz("Un point coloré RVB représente combien de bits ?", "8 bits par couche × 3 = 24 bits, soit environ 16 millions de nuances.", "24 bits", "8 bits", "16 bits", "32 bits"),
        Qz("Dans le format YUV, que représente Y ?", "Y est la luminance. Le vert est recomposé à partir des trois signaux.", "La luminance", "Le vert", "La chrominance rouge", "La transparence"),
        Qz("Quelles sont les 3 normes de la vidéo analogique ?", "NTSC, PAL et SECAM.", "NTSC, PAL, SECAM", "MP4, AVI, MOV", "JPEG, PNG, GIF", "USB, HDMI, VGA"),
        Qz("Combien de lignes et d’images/s pour le PAL ?", "PAL : 625 lignes, 25 images. NTSC : 525 lignes, 29,97 images.", "625 lignes, 25 images", "525 lignes, 29,97 images", "625 lignes, 30 images", "525 lignes, 25 images"),
        Qz("Quel format analogique utilise un seul fil et dégrade la qualité ?", "Le format composite combine luminance et chrominance sur un seul fil, ce qui diminue la qualité.", "Le format composite", "Le format composante", "Le format S-Vidéo", "Le format numérique"),
        Qz("Quel format analogique garantit la meilleure qualité ?", "Le format composante utilise 3 fils (1 luminance, 2 chrominance) pour les équipements professionnels.", "Le format composante (3 fils)", "Le format composite", "Le format S-Vidéo", "Le format VHS"),
        Qz("Comment se calcule le débit d’une vidéo ?", "Débit = taille d’une image × nombre d’images par seconde.", "Taille d’une image × nombre d’images par seconde", "Durée ÷ taille", "Nombre de pixels seulement", "Fréquence du son"),
        Qz("Débit d’une image 24 bits de 640×480 à 30 images/s ?", "Selon le cours : 900 Ko × 30 = 27 Mo/s.", "Environ 27 Mo/s", "Environ 2,7 Mo/s", "Environ 270 Mo/s", "Environ 27 Ko/s"),
        Qz("Que signifie CoDec ?", "CoDec = COmpression / DECompression : des algorithmes qui réduisent le flux de données vidéo.", "COmpression / DECompression", "Code Décimal", "Couleur Directe", "Contrôle Décodé"),
        Qz("Quel format vidéo est très compressé, standardisé et accepté partout ?", ".mp4 (MPEG-4) : forte compression, standardisé, accepté partout.", ".mp4", ".mov", ".avi", ".vob")
      ] }
    ] },

    /* -------------------------------------------------------- MAC OS */
    { id: "mac", nom: "MAC OS · Systèmes d’exploitation", prof: "Mme Sylvie", emoji: "🍎", chapitres: [

      { id: "mac1", titre: "Partie 1 · Introduction aux systèmes d’exploitation", fichier: "cours/SE-MacOS.pdf", qs: [
        Qz("Un système d’exploitation fait la liaison entre…", "Il relie les ressources matérielles de l’ordinateur et les applications de l’utilisateur.", "Le matériel et les applications de l’utilisateur", "L’écran et le clavier", "Internet et le téléphone", "Le disque dur et l’imprimante uniquement"),
        Qz("Quels éléments composent typiquement un SE ?", "Noyau, bibliothèques dynamiques, outils système, programmes applicatifs de base.", "Noyau, bibliothèques dynamiques, outils système, programmes de base", "Écran, clavier, souris", "Dock, Finder, Corbeille", "Texte, image, son"),
        Qz("Que gère le noyau ?", "Le noyau gère les périphériques (pilotes), les processus, les fichiers et les protocoles réseau.", "Les périphériques, les processus, les fichiers, les protocoles réseau", "Seulement l’écran", "Seulement Internet", "Le design des icônes"),
        Qz("Quel SE a été conçu en 1974 par Gary Kildall ?", "CP/M a été conçu pour Intel, pour le processeur 8080.", "CP/M", "MS-DOS", "Windows", "Macintosh"),
        Qz("MS-DOS est lié à quelle machine, en 1980 ?", "En 1980, IBM propose l’IBM PC ; Microsoft fournit PC-DOS / MS-DOS.", "L’IBM PC", "Le Macintosh", "L’iMac", "Le Xerox"),
        Qz("En quelle année le Macintosh est-il sorti ?", "Le Mac est sorti en 1984, directement avec une interface graphique.", "1984", "1974", "1980", "1990"),
        Qz("Pourquoi le Mac a-t-il séduit ?", "Il avait une interface graphique avec fenêtres et souris, très conviviale pour les novices.", "Interface graphique conviviale avec fenêtres et souris", "Il fonctionnait sans écran", "Il n’utilisait que le clavier", "Il était réservé aux informaticiens"),
        Qz("Quels logiciels étaient fournis avec le Mac ?", "MacPaint et MacWrite, déjà orientés vers le graphisme.", "MacPaint et MacWrite", "Word et Excel", "Photoshop et Illustrator", "iTunes et Safari"),
        Qz("À quoi servent les outils système ?", "Ils permettent de configurer le système et de passer le relais aux applications.", "À configurer le système", "À graver des CD uniquement", "À dessiner", "À jouer de la musique"),
        Qz("Windows est le successeur de…", "Windows succède à MS-DOS, influencé par le succès du Macintosh.", "MS-DOS", "CP/M", "Unix", "MacOS")
      ] },

      { id: "mac2", titre: "Partie 2 · Dock, Finder et fichiers", fichier: "cours/SE-MacOS.pdf", qs: [
        Qz("Où se trouve généralement le Dock ?", "Le Dock est un plateau situé le plus souvent en bas de l’écran.", "En bas de l’écran", "En haut de l’écran", "Dans la corbeille", "Dans chaque fenêtre"),
        Qz("Que signifie le petit halo bleu sous une icône du Dock ?", "Il indique que l’application est en cours d’exécution.", "L’application est en cours d’exécution", "L’application est supprimée", "Le fichier est protégé", "La batterie est faible"),
        Qz("Quelle est l’application de gestion des fichiers de MacOS ?", "Le Finder, équivalent de l’Explorer de Windows.", "Le Finder", "Explorer", "Dashboard", "Exposé"),
        Qz("Que dit le cours du Finder ?", "On ne peut pas le quitter par les moyens conventionnels : il est toujours dans le Dock.", "On ne peut pas le quitter par les moyens conventionnels", "Il se quitte avec ⌘Q", "Il disparaît du Dock", "Il se ferme avec F10"),
        Qz("Comment s’appelle un répertoire sous MacOS ?", "Sous MacOS, un répertoire s’appelle un dossier.", "Un dossier", "Une pile", "Un volume", "Un widget"),
        Qz("Comment faire une sélection discontinue de fichiers ?", "En pressant Commande (⌘). Majuscule (⇧) sert à sélectionner une plage.", "Avec Commande (⌘)", "Avec Majuscule (⇧)", "Avec Option (⌥)", "Avec Control (⌃)"),
        Qz("Pour renommer un fichier sélectionné, on appuie sur…", "Sur Entrée ; sous Windows, cela aurait ouvert le fichier.", "Entrée", "Suppr", "Espace", "F2"),
        Qz("Quels sont les 4 modes de visualisation du Finder ?", "Icônes, liste, colonnes et coverflow (couvertures).", "Icônes, liste, colonnes, coverflow", "Grand, moyen, petit, mini", "Texte, image, son, vidéo", "Dock, pile, barre, menu"),
        Qz("Déplacer un fichier en maintenant Option (⌥) permet de…", "Créer une copie au lieu de déplacer le fichier.", "Créer une copie au lieu de le déplacer", "Le supprimer", "Le renommer", "Le verrouiller"),
        Qz("Quel raccourci place un fichier dans la corbeille ?", "Commande-Retour arrière (⌘⌫).", "⌘⌫ (Commande-Retour arrière)", "⌘N", "⌘S", "⌘E"),
        Qz("Quand la corbeille se transforme-t-elle en symbole d’éjection ?", "Quand on déplace un volume (comme une clé USB) à la souris.", "Quand on déplace un volume (clé USB) à la souris", "Quand elle est pleine", "Quand on appuie sur F12", "Quand on éteint le Mac"),
        Qz("Quel fichier invisible mémorise la vue d’un dossier ?", "Le fichier .DS Store : le supprimer réinitialise seulement la vue.", ".DS Store", ".exe", ".doc", ".mov")
      ] },

      { id: "mac3", titre: "Partie 3 · Fenêtres, raccourcis et matériel", fichier: "cours/SE-MacOS.pdf", qs: [
        Qz("Où s’affiche la barre de menus de MacOS ?", "En haut de l’écran, en un seul exemplaire, celle de l’application au premier plan.", "En haut de l’écran, partagée par l’application au premier plan", "Dans chaque fenêtre", "Dans le Dock", "Dans la corbeille"),
        Qz("Que contient le menu pomme ?", "Des actions générales de MacOS : À propos de ce Mac, Préférences Système, éteindre…", "Des actions générales de MacOS", "Les actions du document ouvert", "Seulement la corbeille", "Les widgets"),
        Qz("Quel bouton de fenêtre réduit la fenêtre dans le Dock ?", "Rouge = fermer, orange = réduire, vert = agrandir.", "Le bouton orange", "Le bouton rouge", "Le bouton vert", "Le bouton bleu"),
        Qz("Que signifie un point noir dans le bouton rouge « fermer » ?", "Le document n’est pas sauvegardé.", "Le document n’est pas sauvegardé", "Le document est protégé", "L’application plante", "La fenêtre est agrandie"),
        Qz("Quel raccourci capture tout l’écran ?", "⇧⌘3 capture l’écran ; ⇧⌘4 une zone ; ⇧⌘4 puis espace une fenêtre.", "⇧⌘3", "⇧⌘4", "⌘C", "⌘Q"),
        Qz("Quel raccourci capture une zone précise ?", "⇧⌘4 capture une zone que l’on sélectionne.", "⇧⌘4", "⇧⌘3", "⇧⌘5", "⌘Z"),
        Qz("En ajoutant Control (⌃) à un raccourci de capture…", "Aucun fichier n’est créé : l’image va dans le presse-papiers.", "L’image va dans le presse-papiers", "L’image est envoyée par e-mail", "L’image est supprimée", "L’image est imprimée"),
        Qz("Que fait F11 avec Exposé ?", "F11 écarte les fenêtres pour révéler le Bureau. F9 affiche toutes les fenêtres, F10 celles de l’application.", "Il écarte les fenêtres pour révéler le Bureau", "Il affiche toutes les fenêtres", "Il ouvre le Dashboard", "Il quitte l’application"),
        Qz("Qu’est-ce que Dashboard (F12) ?", "Un tableau de bord de mini-applications appelées widgets.", "Un tableau de bord de widgets", "Un gestionnaire de fichiers", "Un lecteur de CD", "Un navigateur web"),
        Qz("Comment faire un clic droit avec une souris à un seul bouton ?", "En maintenant Control (⌃) enfoncée pendant le clic.", "Control (⌃) + clic", "Double-clic", "Option + clic", "Majuscule + clic"),
        Qz("Où trouve-t-on les caractéristiques matérielles du Mac ?", "Menu pomme > À propos de ce Mac > Plus d’infos.", "Menu pomme > À propos de ce Mac > Plus d’infos", "Dock > Corbeille", "Fichier > Nouveau", "F10"),
        Qz("Quel connecteur relie le Mac à un réseau câblé ?", "Le connecteur RJ 45 sert à câbler au réseau.", "Le RJ 45", "L’USB", "Le FireWire", "Le mini jack"),
        Qz("Comment réparer une application qui plante (roue qui tourne) ?", "Menu pomme, puis « Forcer à quitter ».", "Menu pomme > Forcer à quitter", "Débrancher le Mac", "Vider la corbeille", "Appuyer sur F12")
      ] }
    ] }
  ]
};
})();

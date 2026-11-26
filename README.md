# Studio Akari — site vitrine

Site de Studio Akari, agence de production photo et vidéo à Poitiers, réalisé à partir de la maquette Claude Design (« Studio Akari website design »). Adresse prévue : **https://studio-akari.fr**, hébergement **OVHcloud**.

Le site est **statique** : de simples fichiers HTML, CSS et JavaScript, sans outil de compilation ni dépendance.

## Pages

| Fichier | Page |
| --- | --- |
| `index.html` | Accueil / Le studio : hero, bandeau des savoir-faire, « 明かり », équipe (« Qui sommes-nous ? »), prestations vidéo et photo, méthode |
| `clients.html` | Clients & réalisations : immobilier, vidéos immobilières, annonces mises en valeur, entreprises & PME, formats, galerie filtrable |
| `formules.html` | Les 3 offres (Reportage photo, Pack Shorts / Réseaux sociaux, Film promotionnel — sur devis) et formulaire de demande de devis |
| `mentions-legales.html` | Mentions légales et politique de confidentialité |
| `404.html` | Page affichée pour une adresse inexistante |

## Organisation des fichiers

```
assets/
  css/style.css      Toute la mise en forme (couleurs de la charte en haut du fichier)
  js/main.js         Menu mobile, barre de progression, animations, filtres de la galerie
  js/contact.js      Formulaire de devis (page formules.html uniquement)
  fonts/             Polices Archivo et Noto Serif JP, hébergées avec le site
  img/               Logo, icônes et image de partage sur les réseaux sociaux
.htaccess            Réglages du serveur OVH : https, redirection www, page 404, cache
favicon.ico, robots.txt, sitemap.xml, site.webmanifest
```

## État du site

Le site est prêt à être mis en ligne : photos du studio et de l'équipe en place, offres et réseaux sociaux à jour, mentions légales complètes (d'après le Kbis), formulaire branché sur Formspree, réglages OVH.

Plus tard, quand vous le souhaiterez :

- afficher des tarifs (aujourd'hui toutes les offres sont « Sur devis »), dans les cartes de `formules.html` (`<span class="plan__price">`).

## Réseaux sociaux

Les liens Instagram, Facebook et LinkedIn sont dans la colonne « Suivre » du pied de page de chaque page, et dans les données structurées de `index.html` (`sameAs`). Pour changer une adresse, remplacez-la partout avec la fonction « Rechercher / remplacer » de votre éditeur.

## Voir le site sur son ordinateur

Double-cliquez sur `index.html`. Pour un rendu identique à la mise en ligne, lancez un petit serveur dans le dossier :

```
python3 -m http.server 8000
```

puis ouvrez http://localhost:8000.

## Formulaire de demande de devis (Formspree)

Le formulaire de `formules.html` est relié au formulaire Formspree `xrpeoqlb` (`https://formspree.io/f/xrpeoqlb`) :

- **avec JavaScript** (cas normal), `assets/js/contact.js` vérifie les champs, envoie la demande en arrière-plan et affiche le message « Merci … » sans quitter la page ;
- **sans JavaScript**, le navigateur envoie directement le formulaire à Formspree (attribut `action`).

Chaque demande arrive sur `contact@studio-akari.fr` avec : nom, entreprise, email, téléphone, ville, profil, prestations, offre choisie, mode de contact, créneau de rappel et description du projet. Le bouton « Répondre » de votre messagerie écrit directement au client. Le champ piège `_gotcha` filtre les robots.

**Premier test après la mise en ligne** : envoyez une demande depuis https://studio-akari.fr/formules.html. Si elle n'arrive pas, regardez dans votre espace Formspree (onglet *Submissions*), puis vos courriers indésirables. Si le site affiche « L'envoi n'a pas abouti », vérifiez dans les réglages du formulaire Formspree que la protection reCAPTCHA est désactivée : elle peut bloquer les envois faits en arrière-plan.

Pour changer de formulaire Formspree, remplacez `xrpeoqlb` dans les attributs `action` et `data-endpoint` de la balise `<form>`. Si `data-endpoint` est vidé, le bouton ouvre la messagerie du visiteur avec un email pré-rempli.

Les liens des autres pages pré-remplissent le formulaire : `formules.html?service=video#contact`, `?service=photo`, `?secteur=immobilier`, `?secteur=entreprise`, `?offre=photo`, `?offre=shorts`, `?offre=film`.

## Mise en ligne sur OVHcloud

### 1. Vérifier l'hébergement et le certificat HTTPS

Dans l'espace client OVHcloud, rubrique *Web Cloud* › *Hébergements* › votre hébergement :

- onglet **Multisite** : `studio-akari.fr` et `www.studio-akari.fr` doivent pointer vers le dossier `www`, avec la colonne **SSL** activée ;
- onglet **Informations générales** : le certificat SSL doit être actif (le certificat Let's Encrypt est inclus).

⚠️ Le fichier `.htaccess` redirige tout le trafic vers `https://studio-akari.fr`. Si le certificat HTTPS n'est pas encore actif, le site sera inaccessible : attendez qu'il le soit avant d'envoyer ce fichier.

### 2. Envoyer les fichiers par FTP

1. Onglet **FTP - SSH** : notez le *serveur FTP* (du type `ftp.clusterXXX.hosting.ovh.net`) et l'*identifiant* ; définissez un mot de passe si besoin.
2. Installez [FileZilla](https://filezilla-project.org) et connectez-vous avec ces informations (port 21).
3. Ouvrez le dossier `www` sur le serveur et envoyez-y :
   - `index.html`, `clients.html`, `formules.html`, `mentions-legales.html`, `404.html`
   - le dossier `assets`
   - `favicon.ico`, `robots.txt`, `sitemap.xml`, `site.webmanifest`
   - `.htaccess` (fichier caché : dans FileZilla, vérifiez qu'il apparaît bien côté serveur après l'envoi)
4. Remplacez le fichier `index.html` d'OVH s'il existe, mais **ne supprimez pas** le fichier `.ovhconfig` présent dans `www`.
5. Inutile d'envoyer `README.md`.

Ouvrez ensuite https://studio-akari.fr : vérifiez la navigation, le formulaire, et qu'une adresse inventée (ex. https://studio-akari.fr/test) affiche bien la page 404.

### 3. Après la mise en ligne

- Déclarez le site dans [Google Search Console](https://search.google.com/search-console) et soumettez `https://studio-akari.fr/sitemap.xml`.
- Créez la fiche [Google Business Profile](https://www.google.com/business/) de Studio Akari (Poitiers) en y indiquant l'adresse du site : c'est elle qui fait apparaître le studio dans les recherches locales et sur Google Maps.
- Une fois le site vérifié en https, vous pouvez activer la ligne `Strict-Transport-Security` (commentée) dans `.htaccess`.

## Photos du site

Les photos de Studio Akari sont dans `assets/img/photos/`, déclinées en plusieurs largeurs (le navigateur charge la plus adaptée à l'écran) :

| Emplacement | Fichiers |
| --- | --- |
| Accueil — photo plein écran derrière « Révéler ce qui vous rend unique » (assombrie, réchauffée, avec grain) | `hero-studio-*.jpg` |
| Accueil — « Le studio » (format portrait) | `studio-neon-*.jpg` |
| Accueil — « Qui sommes-nous ? » : Morgan, Maxance, Titouan (portraits 4:5) | `equipe-morgan-*.jpg`, `equipe-maxance-*.jpg`, `equipe-titouan-*.jpg` |
| Accueil — carte « Production vidéo » | `tournage-podcast-*.jpg` |
| Accueil — carte « Reportage photo » | `studio-plateau-*.jpg` |
| Formules & contact — fond du formulaire (photo de l'ordinateur prolongée en haut et en bas par un reflet flouté, sans déformation ; version allongée pour téléphone) | `contact-fond-*.jpg`, `contact-fond-mobile-800.jpg` |
| Clients — bandeau « L'immobilier, notre terrain d'expertise » | `presentation-clients-*.jpg` |
| Clients — galerie « Immobilier » | `interieur-salon-*.jpg` |
| Clients — galerie « Portrait » | `portrait-bureau-*.jpg` |
| Clients — galerie « Drone » | `drone-demeure-*.jpg` |
| Clients — galerie « Entreprise » | `film-entreprise-*.jpg` |
| Clients — galerie « Événementiel » | `evenement-reception-*.jpg` |
| Clients — galerie « Produit » | `produit-parfum-*.jpg` |

Pour changer une photo :

1. Exportez-la en JPG (2000 px de large environ pour les grandes images, 1200 px pour les autres) dans `assets/img/photos/`.
2. Dans la page, remplacez le chemin dans les attributs `src` et `srcset` de la balise `<img>` correspondante (ou supprimez `srcset` et ne gardez que `src`).
3. Pour recadrer, modifiez `--pos` dans l'attribut `style` de l'image (`--pos: 50% 30%` montre davantage le haut, `--pos: 20% 50%` davantage la gauche). `--pos-sm` permet un cadrage propre aux téléphones. La photo du haut de l'accueil est un cas à part : son cadrage est calculé dans `style.css` (section « Accueil : hero plein écran ») pour que l'enseigne Studio Akari reste visible au-dessus du titre ; si vous changez cette photo, ces valeurs sont à recalculer.

Tant qu'une photo n'est pas chargée, une « scène lumineuse » animée aux couleurs du studio s'affiche à sa place, comme dans la maquette.

## Vidéos immobilières (page Clients)

Les vidéos sont dans `assets/videos/`, avec pour chacune son image d'aperçu :

| Bien | Vidéo | Aperçu |
| --- | --- | --- |
| Châtellerault — maison rénovée de 251 m² | `chatellerault.mp4` | `chatellerault-apercu.jpg` |
| Château-Larcher — maison familiale de 217 m² | `chateau-larcher.mp4` | `chateau-larcher-apercu.jpg` |
| Poitiers — longère en pierre de 181 m² | `poitiers.mp4` | `poitiers-apercu.jpg` |

Elles sont converties pour le web (vertical 720 × 1280, H.264, lecture qui démarre avant la fin du téléchargement) : 9 à 19 Mo chacune. Une vidéo ne se charge que lorsque le visiteur clique dessus.

Chaque carte renvoie vers la publication Instagram, la visite 360° Matterport et l'annonce efficity. **Quand un bien est vendu**, l'annonce disparaît d'efficity : retirez alors le lien « Voir l'annonce » de sa carte dans `clients.html`, ou remplacez-le par la mention « Vendu ».

Pour ajouter une vidéo : exportez-la en vertical (1080 × 1920 ou 720 × 1280, H.264), placez-la dans `assets/videos/` avec une image d'aperçu JPEG, puis copiez un bloc `<li class="reel">` existant dans `clients.html` et adaptez les noms de fichiers, textes et liens.

**Mise en ligne** : le dossier `assets/videos` pèse près de 50 Mo. Une fois envoyé chez OVH, inutile de le renvoyer à chaque mise à jour du site : dans FileZilla, choisissez « Écraser si la source est plus récente » ou décochez ce dossier.

## Annonces mises en valeur (page Clients)

Trois annonces de Morgan Louis-Eugène sur efficity, chacune avec 5 photos du reportage (bandeau « À VENDRE » conservé) :

| Bien | Photos |
| --- | --- |
| Châtellerault — maison rénovée de 251 m² | `assets/img/annonces/chatellerault-1…5-*.jpg` |
| Jaunay-Marigny — maison rénovée de 160 m² (exclusivité) | `assets/img/annonces/jaunay-marigny-1…5-*.jpg` |
| Poitiers — maison de maître de 209 m² (exclusivité, bien prestige) | `assets/img/annonces/poitiers-1…5-*.jpg` |

Chaque photo existe en 400, 800 et 1500 px de large. La première est la grande photo de la carte ; un clic sur n'importe quelle photo ouvre la visionneuse plein écran (flèches, clavier, balayage au doigt).

**Quand un bien est vendu** : dans `clients.html`, remplacez `En vente` par `Vendu` dans la carte (`<span class="annonce__status">`) et retirez le bouton « Voir l'annonce », qui ne mènerait plus nulle part. Les prix ne sont volontairement pas affichés.

## Modifier les couleurs ou les textes

- Les couleurs de la charte (or `#D6B86B`, or foncé `#C79B47`, noirs `#1A1A1A` / `#232323`) sont définies en haut de `assets/css/style.css`.
- Les textes se modifient directement dans les fichiers HTML.
- Les animations respectent le réglage « réduire les animations » de l'appareil du visiteur.
- Après une modification de `style.css`, `main.js` ou `contact.js`, changez le numéro `?v=…` qui suit leur nom dans les pages HTML (par exemple la date du jour) : les visiteurs récupèrent ainsi la nouvelle version au lieu de celle gardée en mémoire par leur navigateur.

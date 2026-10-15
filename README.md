# Studio Akari — site vitrine

Site de Studio Akari, agence de production photo et vidéo à Poitiers, réalisé à partir de la maquette Claude Design (« Studio Akari website design »). Adresse prévue : **https://studio-akari.fr**, hébergement **OVHcloud**.

Le site est **statique** : de simples fichiers HTML, CSS et JavaScript, sans outil de compilation ni dépendance.

## Pages

| Fichier | Page |
| --- | --- |
| `index.html` | Accueil / Le studio : hero, bandeau des savoir-faire, « 明かり », prestations vidéo et photo, méthode |
| `clients.html` | Clients & réalisations : immobilier, entreprises & PME, formats, galerie filtrable |
| `formules.html` | Formules Signature (sur devis) et formulaire de demande de devis |
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

Le site est prêt à être mis en ligne : mentions légales complètes (d'après le Kbis), formulaire branché sur Formspree, réglages OVH.

Plus tard, quand vous le souhaiterez :

- remplacer les photos d'illustration Unsplash par vos réalisations ;
- ajouter vos réseaux sociaux dans le pied de page (une colonne « Suivre » est prévue par la maquette) ;
- afficher des tarifs (aujourd'hui toutes les offres sont « Sur devis »).

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

Chaque demande arrive sur `contact@studio-akari.fr` avec : nom, entreprise, email, téléphone, ville, profil, prestations, formule choisie, mode de contact, créneau de rappel et description du projet. Le bouton « Répondre » de votre messagerie écrit directement au client. Le champ piège `_gotcha` filtre les robots.

**Premier test après la mise en ligne** : envoyez une demande depuis https://studio-akari.fr/formules.html. Si elle n'arrive pas, regardez dans votre espace Formspree (onglet *Submissions*), puis vos courriers indésirables. Si le site affiche « L'envoi n'a pas abouti », vérifiez dans les réglages du formulaire Formspree que la protection reCAPTCHA est désactivée : elle peut bloquer les envois faits en arrière-plan.

Pour changer de formulaire Formspree, remplacez `xrpeoqlb` dans les attributs `action` et `data-endpoint` de la balise `<form>`. Si `data-endpoint` est vidé, le bouton ouvre la messagerie du visiteur avec un email pré-rempli.

Les liens des autres pages pré-remplissent le formulaire : `formules.html?service=video#contact`, `?service=photo`, `?secteur=immobilier`, `?secteur=entreprise`, `?formule=production`, `?formule=reportage`, `?formule=complete`.

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

## Remplacer les photos

Les photos actuelles sont des illustrations Unsplash, chargées depuis Unsplash avec le nom de leur auteur affiché en bas à gauche. Pour mettre vos propres images :

1. Exportez vos photos en JPG (environ 2000 px de large pour les grandes images, 1200 px pour les autres) et placez-les dans `assets/img/` (par exemple `assets/img/hero.jpg`).
2. Dans la page, remplacez dans la balise `<img>` correspondante l'attribut `src` par le chemin de votre photo et supprimez l'attribut `srcset`.
3. Supprimez la ligne `<figcaption class="credit">…</figcaption>` juste en dessous (le crédit Unsplash n'a plus lieu d'être).
4. Pour recadrer, modifiez `--pos` dans l'attribut `style` de l'image (`--pos: 50% 30%` montre davantage le haut, `--pos: 70% 50%` davantage la droite).

Tant qu'une photo n'est pas chargée, une « scène lumineuse » animée aux couleurs du studio s'affiche à sa place, comme dans la maquette.

## Modifier les couleurs ou les textes

- Les couleurs de la charte (or `#D6B86B`, or foncé `#C79B47`, noirs `#1A1A1A` / `#232323`) sont définies en haut de `assets/css/style.css`.
- Les textes se modifient directement dans les fichiers HTML.
- Les animations respectent le réglage « réduire les animations » de l'appareil du visiteur.

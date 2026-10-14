# Studio Akari — site vitrine

Site de Studio Akari, agence de production photo et vidéo à Poitiers, réalisé à partir de la maquette Claude Design (« Studio Akari website design »).

Le site est **statique** : de simples fichiers HTML, CSS et JavaScript, sans outil de compilation ni dépendance. Il peut être hébergé n'importe où (GitHub Pages, Netlify, OVHcloud, o2switch…).

## Pages

| Fichier | Page |
| --- | --- |
| `index.html` | Accueil / Le studio : hero, bandeau des savoir-faire, « 明かり », prestations vidéo et photo, méthode |
| `clients.html` | Clients & réalisations : immobilier, entreprises & PME, formats, galerie filtrable |
| `formules.html` | Formules Signature et formulaire de demande de devis |
| `mentions-legales.html` | Mentions légales et politique de confidentialité (à compléter) |

## Organisation des fichiers

```
assets/
  css/style.css      Toute la mise en forme (couleurs de la charte en haut du fichier)
  js/main.js         Menu mobile, barre de progression, animations, filtres de la galerie
  js/contact.js      Formulaire de devis (page formules.html uniquement)
  fonts/             Polices Archivo et Noto Serif JP, hébergées avec le site
  img/               Logo, icônes et image de partage sur les réseaux sociaux
favicon.ico, robots.txt, sitemap.xml
```

## Voir le site sur son ordinateur

Double-cliquez sur `index.html`. Pour un rendu identique à la mise en ligne, vous pouvez aussi lancer un petit serveur dans le dossier :

```
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000.

## À compléter avant la mise en ligne

- [ ] **Mentions légales** (`mentions-legales.html`) : remplacer les textes entre crochets (forme juridique, responsable de publication, SIRET, adresse, hébergeur, durée de conservation).
- [ ] **Réseaux sociaux** : dans le pied de page de chaque page, remplacer les `href="#"` des liens Instagram et LinkedIn par vos adresses.
- [ ] **Formulaire de devis** : brancher un service d'envoi (voir ci-dessous).
- [ ] **Photos** : remplacer les photos d'illustration Unsplash par vos propres réalisations (voir ci-dessous).
- [ ] **Nom de domaine** : le site suppose l'adresse `https://studio-akari.fr`. Si elle est différente, la remplacer dans les balises `og:` des pages, dans `robots.txt` et `sitemap.xml`.

## Formulaire de demande de devis

Sans configuration, le bouton « Envoyer ma demande » ouvre la messagerie du visiteur avec un email pré-rempli adressé à `contact@studio-akari.fr`.

Pour recevoir les demandes directement, sans que le visiteur ait à envoyer l'email lui-même :

1. Créez un formulaire gratuit sur [Formspree](https://formspree.io) avec l'adresse `contact@studio-akari.fr`.
2. Copiez l'adresse fournie (du type `https://formspree.io/f/abcdwxyz`).
3. Dans `formules.html`, collez-la dans l'attribut `data-endpoint` du formulaire :
   ```html
   <form class="form" id="devis-form" method="post" data-endpoint="https://formspree.io/f/abcdwxyz" …>
   ```

Chaque demande arrive alors par email avec : nom, entreprise, email, téléphone, ville, profil, prestations, formule choisie, mode de contact, créneau de rappel et description du projet. Un champ piège invisible filtre les robots.

Les liens des autres pages pré-remplissent le formulaire : `formules.html?service=video#contact`, `?service=photo`, `?secteur=immobilier`, `?secteur=entreprise`, `?formule=production`, `?formule=reportage`, `?formule=complete`.

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

## Mise en ligne

**GitHub Pages** : dans les paramètres du dépôt, rubrique *Pages*, choisissez *Deploy from a branch*, la branche principale et le dossier `/ (root)`. Le nom de domaine `studio-akari.fr` se renseigne dans la même rubrique (*Custom domain*).

**Netlify** : glissez-déposez le dossier du site sur https://app.netlify.com/drop.

**Hébergeur classique (OVHcloud, o2switch…)** : envoyez tout le contenu du dossier par FTP à la racine du site.

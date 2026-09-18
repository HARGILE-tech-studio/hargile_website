# Prompt de reprise : section « Vos accès » de /geo, en style suisse

> Écrit le 18/09/2026 en fin de session. À coller tel quel au début de la
> prochaine session Claude Code, dans `hargile_website`.

---

## Le contexte en une phrase

Le 18/09, la première section de `/geo` (« Comment se faire citer par les
IA ? », composant `geo-answer.jsx`) a été refaite en style suisse, en six
passes avec Mihai à l'écran. La section suivante à traiter est **« Vos
accès »** (`src/components/pages/services/v2/geo/access.jsx` et son
`.module.scss`), même méthode, même goût.

## Ne pas repartir de zéro

Lire dans cet ordre, avant de proposer quoi que ce soit :

1. `docs/geo-swiss-design-plan.md` : le plan de page, la grille `.grid12`,
   les contraintes (texte dans le HTML, un seul accent, reveal qui ne fait
   que soustraire, hero intouchable). Sa §3.1 raconte ce qui a été construit
   et ce qui a été rejeté pour la section 1.
2. `src/components/pages/services/v2/geo/geo-answer.jsx` + `.module.scss`
   (en-têtes de fichiers) : ce qui a été retenu, ce qui a été essayé, et le
   piège Chrome sur `step-end` (progress 0,9999999).
3. `.claude/skills/swiss-design/` : le skill installé le 18/09 à la demande
   de Mihai. Ce qu'on en garde et ce qu'on refuse est noté en tête du
   `.module.scss` de geo-answer : hiérarchie par opacité, un seul accent,
   aucun arrondi structurel, corps ≤ 60ch, `text-wrap: balance`, chiffres
   tabulaires. **Pas** IBM Plex, pas la palette stone, pas les titres en
   maigre : la marque est Outfit 700 sur `#080c16`, accent `#96b9f9`.
4. `src/components/pages/services/v2/geo/access.jsx` : l'état actuel.

## L'état du dépôt

Branche **`pmihai31/geo-swiss-redesign`**, créée le 18/09 depuis la branche
du prompt blog (`8dcf5b5`, qui contient ce prompt-là aussi). Trois commits,
**non poussés** ; Mihai décide du push et du tag (jamais sans son go) :

| Commit | Contenu |
|---|---|
| `a6027ca` | passe de contenu : résumés sous les heros, liens externes, copie de la démo dans fr/en.json |
| `038d5d8` | section 1 en style suisse, `.grid12`, plan, ce prompt, le skill swiss-design, `.work/` ignoré |
| `54ba948` | docs : analyses de contenu (PDF), notes Tenken, images contact-402 |

Reste un fichier non suivi, `prod-geo.tmp.html` (un dump de la page en
prod), volontairement pas commité : à supprimer ou à ignorer.

Pour démarrer : `git checkout pmihai31/geo-swiss-redesign`, `npm run dev`,
ouvrir `http://localhost:3000/fr/geo`.

## Ce que Mihai a retenu, en six passes (à ne pas redécouvrir)

| Rejeté | Retenu |
|---|---|
| Deux cartes « chat » côte à côte | La question tapée en corps d'affiche dans un **bloc plein accent**, l'écran de réponse qui **chevauche** son bord (les références swiss-design.fun : bloc rouge + photo qui mord dessus) |
| Un grand disque accent « géométrique » (« il n'apporte rien ») | Un seul accent **qui veut dire quelque chose** (l'aplat sur la ligne « Votre entreprise ») |
| Une table de quatre grandes rangées (« trop grand ») | Quatre entrées compactes, 40px de haut |
| Une phrase à appels de source en exposant (« trop fade ») | idem |
| Des filets partout (« less borders, more organic ») | Zéro filet dans la figure ; le chevauchement fait la structure |
| Lettres a/b/c, badge « Illustration, pas un résultat » (« ça ne sert à rien ») | Rien : l'ordre est celui de la lecture |
| Trois cellules teintées, escalier de blocs, chiffres géants, bande pleine largeur, escalier typographique, affiches sur la bande, colonne verticale (deux planches, `.work/conditions-sheet-*.jpg`) | La **fiche technique** : glyphe \| titre \| texte, comme la fiche Gillette des références. Peu de hauteur, pas de fond |
| Copie « Quelle agence fait des applications web à Bruxelles ? » (la nôtre) | Un blanc à remplir que le client lit comme le sien |

Règles qui en sortent : le bloc plein de couleur est **la** structure, un
élément le chevauche, le reste est du texte nu ; un accent par section, et
il porte une information ; pas de décor géométrique ; hauteur contenue.

## La méthode de travail (elle compte autant que le résultat)

- Mihai regarde en live sur `http://localhost:3000/fr/geo` (serveur déjà
  lancé) à 1440 et sur son téléphone. Une passe à la fois, il valide à l'œil.
- Quand il faut choisir, **plusieurs propositions sur une planche** : un
  switch temporaire `?xxx=a|b|c` dans le jsx, captures avec
  `.work/shoot.sh` (adapter le sélecteur), planche avec `.work/sheet.mjs`
  (le lancer depuis la racine du projet, copié en `./.sheet-tmp.mjs`, pour
  que `sharp` se résolve), envoi avec l'outil de fichiers. Une fois choisi,
  supprimer le switch et les autres variantes.
- **Jamais de fichier de travail dans le scratchpad ni dans TEMP** : tout
  dans `.work/` (gitignoré). Mihai l'a dit sèchement.
- Copie : les messages sont dans `fr.json` / `en.json`. Les changer est
  permis si ça sert le lecteur (fait pour la démo), mais dire lesquels.
- Chrome : pas de `step-end` pour un effet machine à écrire, un fondu
  linéaire de 20ms.

## La tâche : « Vos accès »

Aujourd'hui : titre, lead de trois phrases, trois pictos en ligne (coffre,
journal, interrupteur) à filet haut, puis un paragraphe « plateformes » et
quatre cartouches CMS (WordPress, Shopify, Webflow, Sites sur mesure) à
filet haut. Propre, et exactement ce que Mihai appelle « bland » : trois
colonnes égales, des filets, rien qui ne fasse image.

Ce que la section dit, et qui doit devenir visible : *vos identifiants ne
sont jamais chez nous* (coffre chiffré), *chaque lecture est tracée* (qui,
quand, pour quoi), *pour arrêter, un message suffit* ; et deux régimes de
plateformes, application automatique (WordPress, Shopify) contre application
à la main (Webflow, sur mesure).

Pistes à proposer sur une planche, trois ou quatre, avant de coder pour de
bon :

- **Le journal comme objet** : la phrase « chaque lecture est tracée : qui,
  quand, pour quoi » devient une ligne de journal réelle, en mono, dans un
  bloc plein accent, qui s'écrit à l'écran comme la question de la section 1
  (même mécanique `data-wait` / `data-play`, un seul observer). C'est la
  preuve montrée plutôt qu'affirmée, la famille d'argument de meta-proof.
- **Deux régimes, deux blocs** : automatique / à la main, un bloc plein et
  un bloc en encre, les CMS dedans en typographie (jamais de logos tiers
  redessinés, contrainte existante), la phrase « plateformes » entre les
  deux.
- **La fiche technique** reprise de la section 1 pour les trois garanties
  (glyphe | titre | texte) : cohérence de page, peu de hauteur. Les pictos
  actuels (trait 1.5, 24px) peuvent servir de glyphes.
- **Le chevauchement** : un bloc plein « Vos accès » sur sept colonnes, et
  la liste des CMS qui mord sur son bord, comme l'écran de réponse mord sur
  le bloc de la question.

Contraintes qui tiennent : un seul accent par section et il signifie
quelque chose ; pas de filets comme structure ; hauteur contenue ; mobile
bord à bord pour un bloc plein (voir `.panel` de geo-answer sous 1100px) ;
le HTML servi est l'état final ; `prefers-reduced-motion` retombe sur un
fondu ; le texte reste dans le HTML.

## Après « Vos accès »

Le plan (`docs/geo-swiss-design-plan.md` §2) donne l'ordre : Process (table
qui × étape, rail retiré), Approval (le document de proposition), MetaProof
(inchangé), MeasuredProof (numéraux sans cadrans), Measures (table + refus
en statement). Chaque section : une planche s'il y a un choix, une passe à
la fois, Mihai valide.

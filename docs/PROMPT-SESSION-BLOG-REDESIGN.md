# Prompt de reprise : la page Blog, intégration + petit re-design

> Écrit le 18/09/2026 en fin de session. À coller tel quel au début de la
> prochaine session Claude Code, dans `hargile_website`.
> Remplace `PROMPT-SESSION-GEO-ACCESS-SWISS.md` (fait, supprimé) et complète
> `PROMPT-SESSION-BLOG-HARG-391.md` (le diagnostic de la PR #7, toujours vrai
> sauf sa section « conflits » : voir plus bas).

---

## Le contexte en une phrase

La page `/geo` est finie (18/09) et sa release est la v0.34.0 : **vérifier
d'abord qu'elle est bien en ligne** (`git tag`, puis les contrôles de
`docs/next-session-prompt.md`). La suite est la section **Blog** ([HARG-391](https://linear.app/hargile/issue/HARG-391/optimiser-geo-hargile)) :
l'intégrer, puis lui donner le même langage visuel que `/geo`, en petit.

## Ne pas repartir de zéro

Lire dans cet ordre :

1. `docs/PROMPT-SESSION-BLOG-HARG-391.md` : ce que fait la PR #7 (Markdown
   rendu côté serveur, contrat de front matter sévère, `draft` comme seul
   verrou), comment la tester, les deux points de copie à faire relire par
   Mihai (tirets cadratins, six titres SEO).
2. `docs/geo-swiss-design-plan.md` **§7** : la grammaire « bento suisse »
   retenue sur `/geo`, et §3.1 (V4g) pour l'affiche.
3. `src/components/pages/services/v2/geo/access.jsx` + `.module.scss` : le
   modèle le plus abouti (l'affiche : aplat décalé, énoncé qui le traverse en
   deux couleurs, photo collée à droite ; puis les cellules, détachées).

## L'état du dépôt

- `main` doit être à v0.34.0 (release lancée par Mihai le 18/09 ; si le tag
  n'existe pas, la branche `pmihai31/geo-swiss-redesign` porte tout le
  travail, non poussée, et la release reste à faire).
- **Le rebase de la PR #7 est déjà fait**, en local : branche
  `rebase/harg-348-articles-pancake` (2 commits au-dessus de v0.33.1, du
  16/09), dans le worktree `C:/Users/Mihai/AppData/Local/Temp/claude/wt-blog`.
  Non poussée. Un merge à blanc avec la branche GEO du 18/09 ne donnait
  **aucun conflit** (`git merge-tree`), mais `fr.json` / `en.json` ont
  beaucoup bougé depuis : refaire le merge à blanc sur `main` v0.34.0 avant
  de conclure, et relancer `npm run test` (24 tests) + `npm run build`.
- Ce worktree est dans TEMP et contient des fichiers non suivis (`build2.log`,
  `dev.log`, `server.log`, `AGENTS.md`, `CLAUDE.md`). Une fois la branche
  reprise ailleurs, le retirer avec `git worktree remove`.

## Ce que Mihai a retenu sur /geo (à ne pas redécouvrir)

| Rejeté | Retenu |
|---|---|
| Colonnes égales à filet haut, pictos, « bland » | Cellules à **filets partagés**, libellé **mono 12px en capitales**, une phrase courte, un **objet en HTML** qui montre au lieu de redire (références : clickup.com, spinxdigital.com, jeton.com) |
| Beaucoup de texte | Une phrase par cellule ; le lead réduit à une ligne ; ce qui est montré n'est pas redit |
| Un aplat qui couvre toute la cellule | L'aplat **décalé**, sur toute la largeur, l'énoncé en corps d'affiche qui démarre avant lui et **change de couleur en le traversant** (affiche « The formation of a new typography »), une **photo** collée à son bord droit |
| Un titre de section faible (« Vos accès ») | Pas de titre : l'énoncé de l'affiche **est** le h2 |
| L'affiche comme première case du bento | L'affiche **seule**, les cellules détachées dessous, un pas de section entre les deux |
| Un champ factice (« identifiant CMS •••• ») | Le vrai nom de l'outil et un lien pour vérifier (Infisical) |
| Une ouverture (h2 + lead + liste) séparée de sa figure | Le lead **dans** la figure, dans son vide ; la copie du lead alignée sur celle de la figure |

Règles : un accent par section et il veut dire quelque chose ; aucun arrondi ;
hauteur contenue ; pas de décor ; le texte reste dans le HTML ; le HTML servi
est l'état final ; `prefers-reduced-motion` retombe sur un fondu ; bascule
unique à 1100px ; marque = Outfit 700 sur `#080c16`, accent `#96b9f9`.

## La méthode de travail

- Mihai regarde en live sur `http://localhost:3000` à 1440 et sur son
  téléphone. Une passe à la fois, il valide à l'œil, et il réagit vite : des
  passes courtes, une capture envoyée à chaque fois (outil de fichiers).
- Captures : `.work/shot.sh <nom> "<bout du h2>" [largeur] [hauteur] [décalage]`
  (session agent-browser dédiée `geo-bento` ; adapter l'URL dans le script
  pour `/blog`). Planche : `.work/sheet.mjs`, lancé depuis la racine, copié en
  `./.sheet-tmp.mjs` pour que `sharp` se résolve.
- **Jamais de fichier de travail dans le scratchpad ni dans TEMP** : tout
  dans `.work/` (gitignoré).
- Build de contrôle sans casser le serveur de dev : worktree jetable dans
  `.work/`, `node_modules` en jonction (`mklink /J`), `npx next build`, puis
  retirer la jonction **avant** de supprimer le worktree.
- Copie : changer `fr.json` / `en.json` est permis si ça sert le lecteur, en
  disant lesquelles. Toujours les deux langues, parité des clés vérifiée.
- Photos : libres de droits seulement (Unsplash bloque les robots ; Wikimedia
  Commons en CC0 / domaine public marche), ou fournies par Mihai. Recadrées et
  passées en webp dans `public/images/pages/`.

## La tâche

1. **Intégrer** : reprendre `rebase/harg-348-articles-pancake`, la remettre
   sur `main` v0.34.0, tests + build, présenter à Mihai les deux arbitrages de
   copie (voir le prompt HARG-391). Ne rien pousser sans son go.
2. **Re-design, petit** : `/blog` (la liste) et `/blog/[slug]` (l'article).
   Pistes, à montrer avant de coder pour de bon :
   - la liste en cellules à filets partagés : date et catégorie en mono,
     titre en `blockHeading`, une phrase ; le dernier article en **affiche**
     (aplat décalé, titre qui le traverse) au-dessus de la grille ;
   - l'article : colonne de lecture ≤ 68ch, métadonnées en mono dans la
     marge (date, temps de lecture, sources), intertitres en Outfit, aucun
     cadre ; les citations et chiffres clés en énoncé ;
   - un état vide honnête : aujourd'hui il n'y a que l'exemple en `draft`.
     Une grille vide se voit ; prévoir ce que la page dit tant qu'il n'y a
     qu'un ou deux articles.
   Contrainte qui prime sur le dessin : **le corps de l'article reste rendu
   côté serveur**, un seul `h1`, rien d'invisible sans JS.
3. **Après la mise en ligne de v0.34.0, deux servitudes de `/geo`** (si pas
   déjà faites) : re-mesurer Lighthouse mobile sur `/geo` et mettre à jour
   `src/data/site-metrics.js` (MeasuredProof publie ces chiffres) ; refaire le
   `curl` de `src/data/seo-source-excerpt.js` (son `fetchedOn` date du 06/08
   et l'URL a changé depuis).

## Le déploiement, pour mémoire

Seul un tag `v*` part en prod (Flux, `ImagePolicy` semver). Pousser `main`
construit une image et ne déploie rien. Détail et vérifications :
`docs/next-session-prompt.md`, section « Comment le déploiement marche ».
Jamais de tag ni de push sans le go explicite de Mihai.

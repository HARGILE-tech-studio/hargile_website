# Prompt de reprise : section Blog (HARG-391)

> Écrit le 16/09/2026 en fin de session. À coller tel quel au début de la
> prochaine session Claude Code, dans `hargile_website`.

---

## Le contexte en une phrase

[HARG-391](https://linear.app/hargile/issue/HARG-391/optimiser-geo-hargile)
(Urgent, assigné à Mihai) demande une section blog sur hargile.com pour
recevoir les articles que Pancake produit chaque semaine et que rien
n'exploite aujourd'hui. **Une PR existe déjà et attend un rebase.**

## Ne pas repartir de zéro

[PR #7](https://github.com/HARGILE-tech-studio/hargile_website/pull/7) —
`dorianduraku/harg-348-articles-pancake`, ouverte, **en conflit**, plus
touchée depuis le 09/09.

Le diff annonce +4508 / 40 fichiers, mais **2825 lignes sont le
`package-lock.json`**. Le code réel est modeste :

| Fichier | Rôle |
|---|---|
| `src/lib/blog.js` (280 l.) | le cœur : lecture Markdown, validation du front matter |
| `src/app/[locale]/(context)/(client)/blog/` | pages `/blog` et `/blog/[slug]` |
| `src/components/pages/blog/` | liste + styles |
| `src/seo/` (json-ld, metadata, sitemap, llms.txt) | exposition aux moteurs |
| `src/lib/__tests__/` + `vitest.config.mjs` | 24 tests — **le repo n'avait aucun lanceur de tests avant** |

Ce que la PR fait, et pourquoi ça compte pour le GEO : le corps de l'article
est rendu **entièrement côté serveur**, titres décalés d'un cran pour ne
jamais émettre un second `h1`. Les robots des moteurs de réponse n'exécutent
pas JS — un blog client-side aurait été invisible pour eux, donc inutile.

Le contrat de front matter est volontairement sévère : champ manquant, date
inexistante (`2026-02-30`), slug mal formé → **le build casse en nommant le
fichier fautif**. La raison est sérieuse : le pipeline amont pose
`draft: true` dès qu'un article porte un bloquant (client nommé, prix hors
grille, garantie de position). **`draft` est le seul verrou entre un article
signalé et une URL publique.** Un `=== true` permissif laissait
`draft: "true"` (la chaîne) publier en silence ; c'est corrigé et testé.

## Les conflits, déjà mesurés

Merge à blanc fait le 16/09 dans un worktree jetable (depuis supprimé) :
**7 fichiers, 18 zones**, 21 commits d'écart avec `main`.

```
6 zones  src/messages/en.json          ← copie FAQ GEO, deux réécritures
4 zones  src/components/footer/Footer.jsx
2 zones  src/app/llms.txt/route.js
2 zones  src/messages/fr.json
2 zones  src/seo/build-json-ld.js
1 zone   src/components/navigation/navbar.jsx
1 zone   src/seo/generate-page-metadata.js
```

**Aucun conflit dans `src/lib/blog.js` ni dans les pages blog : le cœur de la
PR ne bouge pas.** Ce sont des conflits de copie et de navigation, pas de
logique.

Exemple type, la navbar : la PR ajoute `/blog` au menu, `main` a depuis
remplacé `/services` par `/geo`. On garde les deux.

Le `en.json` est du même genre : deux versions d'une même réponse FAQ GEO,
il faut trancher laquelle lit mieux. **C'est un arbitrage éditorial, pas
technique — il revient à un humain.**

## Le point à faire relire par un humain

La PR le signale elle-même : une purge des tirets cadratins (un hook local
refuse d'enregistrer un fichier qui en contient) a modifié de la copie
visible. Deux phrases méritent un avis :

- FR : « votre portfolio parle pour vous, encore faut-il qu'il soit lu »
- EN : « Your portfolio speaks for itself: if it's read »

Et six titres SEO passent de `HARGILE — GEO & SEO` à `HARGILE : GEO & SEO`.

## Comment tester (repris de la PR)

```bash
npm ci
npm run test          # 24 tests
npm run build
PORT=3100 npm run start
```

- `http://localhost:3100/en/blog` → **200 sans redirection** (exigé par le gate Lighthouse)
- `http://localhost:3100/blog` → 200 ; `/fr/blog` → 301 vers `/blog`
- `http://localhost:3100/blog/exemple-hors-ligne` → 404 (article de démo, en `draft`)
- `public/sitemap.xml` contient `/blog` et `/en/blog`, **pas** le brouillon
- `node scripts/validate-json-ld.mjs --site http://localhost:3100` → 0 erreur, 0 avertissement

Pour vérifier la sévérité du contrat : poser un fichier dans
`src/content/blog/fr/` avec `draft: "true"` ou `date: 2026-02-30` — le build
doit échouer en nommant le fichier.

## Ce que la PR ne fait pas

**Aucun article réel n'est publié** : seulement l'exemple en brouillon. Un
blog vide ne se fait citer par personne — la valeur GEO n'arrive qu'avec du
contenu réel dedans. Le premier article Pancake reste à passer dans le
pipeline. `HARG-341` (MCP Pancake) reste ouvert de son côté.

## Où en est le reste de HARG-391

| Case du ticket | Nature | État au 16/09 |
|---|---|---|
| Section blog | dev | PR #7 à rebaser ← **cette session** |
| Notre site tourne sur notre solution | ops | pas commencé |
| Premier run SEO appliqué par le workflow | ops | pas commencé |
| Otterly : −25 Wami, +10-15 HARGILE | clics | **jeu rédigé**, chargement bloqué |

Les 15 prompts HARGILE sont prêts :
`chatseo-workspace/docs/otterly/prompts-hargile-v1.md`, commités sur la
branche `pmihai31/harg-391-prompts-otterly-hargile` (non poussée).

Le chargement attend un arbitrage de Tanguy : le compte Otterly est en plan
Lite (15 prompts) et Wami y occupe déjà 25 prompts, dont dépend son rapport
mensuel ([HARG-394](https://linear.app/hargile/issue/HARG-394), Urgent).
Supprimer les prompts Wami détruirait la série. Option la moins risquée : un
second compte Lite à 29 $/mois plutôt que le Standard à 189 $.

---

## Le prompt à coller

```
Session sur HARG-391, partie section Blog du site hargile.com.

Lis d'abord docs/PROMPT-SESSION-BLOG-HARG-391.md : il contient le diagnostic
complet fait le 16/09 (contenu de la PR #7, mesure des conflits, points à
faire relire).

Objectif : rebaser la PR #7 (dorianduraku/harg-348-articles-pancake) sur main
et la rendre mergeable.

7 fichiers, 18 zones de conflit, toutes de copie ou de navigation — aucune
dans src/lib/blog.js ni dans les pages blog. Résous-les, puis fais tourner
npm run test (24 tests) et npm run build.

Deux choses que tu ne tranches pas seul, tu me les présentes :
- les 6 zones de src/messages/en.json : deux versions d'une même réponse FAQ
  GEO, c'est un choix éditorial ;
- la purge des tirets cadratins a modifié de la copie visible, dont six
  titres SEO.

Ne pousse rien, ne merge rien sans mon accord.
```

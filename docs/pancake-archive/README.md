# Archive Pancake — tout ce que le service a produit pour nous

> Extrait le 21/09/2026 via le MCP Pancake, **avant résiliation de
> l'abonnement**. Pancake facture 99 €/mois et son API n'est accessible que par
> une connexion OAuth navigateur : une fois l'abonnement clos, l'autorisation
> tombe et ce contenu devient irrécupérable. D'où cette archive.

## Ce qu'il y a dedans

**13 articles** dans [`articles/`](./articles/), un fichier par article, nommé
par sa date de publication prévue. Chacun contient le corps Markdown intégral
tel que Pancake l'a rendu, plus son brief et ses métadonnées SEO en front
matter.

Aucune correction n'a été appliquée : ni accents restaurés, ni liens réécrits,
ni slugs nettoyés. C'est volontaire — une archive sert à conserver l'original,
pas une version retravaillée. Les deux articles déjà publiés sur le site ont
leur original ici **et** leur version corrigée dans `src/content/blog/`.

Les fichiers portent `importedToSite: true` ou `false` selon qu'ils sont en
ligne ou non.

| Date prévue | Article | Langue | En ligne |
|---|---|---|---|
| 02/09 | Why Your Brand Is Invisible on ChatGPT and Perplexity | EN | non |
| 03/09 | How We Track Brand Presence Across 25 Fixed Questions | EN | non |
| 04/09 | Your SEO Audit Has 40 Recommendations | EN | non |
| 05/09 | Stratégie AEO : ce qui est réel | FR | non |
| 06/09 | Capacité SEO de l'équipe marketing | FR | non |
| 07/09 | Audit de visibilité IA | FR | non |
| 08/09 | AI Search Visibility Tool | FR | non |
| 09/09 | Audit SEO jamais mis en œuvre | FR | non |
| 10/09 | Être cité par les moteurs de réponse | FR | non |
| 11/09 | Trafic organique en baisse | FR | non |
| 12/09 | SEO uitbesteden : trois questions | FR | non |
| 13/09 | Generative Engine Optimization pour une PME | FR | **oui** |
| 14/09 | Impact des AI Overviews sur le trafic | FR | **oui** |

## Six briefs sans contenu, perdus avec l'abonnement

Le backlog Pancake comptait 19 entrées, mais six n'avaient qu'un brief, sans
article écrit. Ils ne sont pas archivés ici puisqu'il n'y a rien à archiver,
mais voici leurs sujets, au cas où quelqu'un veuille les réécrire ailleurs :

- Google AI Overview aux Pays-Bas (cible : `Google ai overview nederland`)
- Google AI Overview : comment une PME peut encore y apparaître en 2026
- Share of voice in AI search : un chiffre ne suffit pas
- Vindbaar in ChatGPT : de technische stappen (NL)
- Zichtbaarheid in AI-zoekmachines (NL)
- Pourquoi votre marque n'apparaît pas dans les réponses de ChatGPT

## Ce qu'il faut savoir avant de republier

Quatre défauts systématiques, relevés à l'import des deux premiers articles.
Ils valent pour tout le lot.

**Les accents manquent.** « ce que ca veut dire concretement »,
« referencement », « meme ». Douze des treize articles sont dans ce cas. Le
seul exception est celui du 07/09, qui est correctement accentué — donc le
pipeline en était capable et le défaut n'était pas une fatalité.

**Les slugs sont coupés au milieu des accents.** `apparai-tre`,
`ge-ne-ration`, `e-cht`. Inutilisables tels quels dans une URL.

**Les liens internes pointent vers la racine**, pas vers `/blog/`. Un article
qui renvoie à `/mon-autre-article` donne un 404 chez nous. Il y en a jusqu'à
cinq par article, et ils pointent tous vers d'autres articles du même lot.

**Trois articles sont en anglais** (02, 03 et 04/09) alors que le reste est en
français, sans que rien dans le brief ne l'explique.

## Contradictions internes, à trancher avant publication

Le lot se contredit sur des faits commerciaux. Chaque fichier concerné porte un
avertissement en tête.

- **Périmètre CMS** : les articles du 02 et du 04/09 affirment que seuls
  WordPress et Shopify sont couverts, Webflow explicitement hors périmètre.
  Les articles postérieurs incluent Webflow depuis le 03/09/2026.
- **Formule Google seule** : les articles du 02, 04 et 06/09 vendent une
  formule à 499 €/mois couvrant Google sans les moteurs de réponse. Ceux du 12
  et du 13/09 déclarent qu'elle n'existe plus depuis le 11/09/2026.
- **Cadence de mesure** : l'article du 03/09 annonce une lecture *mensuelle* sur
  *deux* moteurs. Les articles français annoncent *quatre lectures par mois* sur
  *quatre* moteurs.

Ces écarts viennent de ce que le contenu a été généré sur trois semaines pendant
que l'offre évoluait, sans que les articles antérieurs soient repris.

## Si on veut republier tout ça

Voir le commentaire du 21/09 sur
[HARG-348](https://linear.app/hargile/issue/HARG-348) pour la méthode d'import
assisté. En résumé : accents, slug, liens et traduction sont quatre corrections
qui demandent un jugement, aucun script ne les fait seul.

Le nom de fichier doit être **identique en FR et EN** — c'est ce qui apparie les
deux langues (`getAvailableLocales` dans `src/lib/blog.js`). Un test le vérifie :
`src/lib/__tests__/content-pairing.test.js`.

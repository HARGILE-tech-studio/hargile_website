# /geo — design system + redesign brief

## 1. Design tokens (exact values, pulled from the codebase)

### Color

| Role | Value | Notes |
|---|---|---|
| Page background | `#080c16` | Near-black navy. Every section sits on this; no section has its own fill. |
| Primary text | `#ededed` | Headings and strong copy. Never pure white. |
| Body text | `rgba(237, 237, 237, 0.68)` | Section leads. |
| Muted text | `rgba(237, 237, 237, 0.62)` | Step copy, descriptions. |
| Faint text / labels | `rgba(237, 237, 237, 0.42)` | Uppercase micro-labels, monospace meta. |
| **Accent (the only one)** | `#96b9f9` | Pale periwinkle blue. Rails, dots, numerals, icon strokes, kickers, card borders. |
| Accent, hairline | `rgba(150, 185, 249, 0.14)` | Unlit rail track. |
| Accent, mid | `rgba(150, 185, 249, 0.42–0.45)` | Card borders, branch bars. |
| Accent, ghost fill | `rgba(150, 185, 249, 0.07)` | Giant background numerals. |
| Accent, outline stroke | `rgba(150, 185, 249, 0.26)` | 1px text-stroke on giant numerals. |
| Hairline / divider | `rgba(255, 255, 255, 0.08 → 0.14)` | All separators. |
| Accent glow | `box-shadow: 0 0 16px rgba(150,185,249,0.9)` | Only on lit rail dots. |

Brand blue `#2563eb` exists globally but **is not used on this page** — `#96b9f9` is the page accent. Keep it that way.

### Type

- **Headings — Outfit** (variable, 100–900), letter-spacing `-0.02em`
- **Body — Manrope** (variable, 200–800), letter-spacing `-0.01em`
- **Mono** — `ui-monospace, "Cascadia Mono", "SF Mono", Menlo, Consolas` — used *only* for log lines and card metadata, and that contrast is meaningful: mono = machine output.

| Style | Size | Weight |
|---|---|---|
| Section heading (h2) | `clamp(34px, 3.6vw, 56px)` | 700, `-0.02em`, line-height 1.1 |
| Block heading (h3) | `clamp(20px, 2vw, 28px)` | 600, `-0.018em` |
| Statement (oversized sentence) | `clamp(18px, 1.9vw, 25px)` | 300 |
| Lead | 16px | 300, line-height 1.6 |
| Body / step text | 14px | 300, line-height 1.6, `max-width: 34ch` |
| Micro-label / kicker | 11–11.5px | 600, `letter-spacing 0.1em`, UPPERCASE |
| Display numeral XL | `clamp(120px, 14vw, 240px)` | 700, line-height 0.82 |
| Display numeral LG | `clamp(88px, 9vw, 168px)` | 700, line-height 0.85 |

### Layout & rhythm

- Container: `max-width: min(1440px, 92vw)`, gutter `40px` (`20px` under 640px)
- Section padding-top: `clamp(112px, 10vw, 200px)` — very generous vertical air
- Radii: `6px` small chips, `10px` cards, `999px` pills
- Borders: **1px hairlines everywhere.** Almost no filled surfaces — the one carded object on the page is the proposal mock, and it's carded *because it's a real object*.
- Icons: 24×24 viewBox, `stroke-width: 1.5`, round caps/joins, no fill. Hand-drawn SVG, no icon library.

### Motion

One signature movement per page: a rail that fills on scroll (`scaleX`/`scaleY`, spring `stiffness 90, damping 24, mass 0.4`), with dots igniting `0.25 → 1` opacity and `0.6 → 1` scale as the fill front reaches them. Everything else is a one-shot reveal on enter. `prefers-reduced-motion` pins the fill to 1. **No looping effects, no ambient backdrops.**

---

## 2. What the page currently is

> Structure only — the **full final copy lives in the content inventory at the end of §3**, which is the single source of truth for text.


`/geo` sells GEO — getting cited by AI answer engines — with SEO positioned as its foundation, not a rival offer. Section order:

1. **Poster hero** — title + one answer sentence over a WebGL wave-grid backdrop
2. **GeoAnswer** — "Moteur de réponse (IA)": before/after assistant-reply cards
3. **Process** — 4 steps on a fill-on-scroll rail; each step carries a *Système* line (automated) and a *Nous* line (human)
4. **Access** — "Vos accès": 3 line-icons (vault / log / kill-switch) + supported CMSs
5. **Approval** — "Rien n'est écrit sans votre accord": 4-step proposal flow on a second rail, plus a mock proposal card (page, before, after, why, accept/reject)
6. **MetaProof** — this page applies what it promises, shown in its own source
7. **MeasuredProof** — Lighthouse scores with measurement date
8. **Measures** — what's measured, and an explicit refusal to guarantee rankings
9. **MiniFaq** → **CtaBand** → `/contact?audit=1`

The voice is deliberately anti-hype: it shows objects rather than illustrating claims, and states its limits out loud.

---

## 3. Prompt for Claude Design

> Redesign the `/geo` page for Hargile — a page that sells GEO (getting cited by AI answer engines like ChatGPT, Claude, Perplexity and Google AI Overviews), with classic SEO positioned as its foundation rather than a competing offer.
>
> **Lay out the real copy, in French, exactly as given in the content inventory at the end of this prompt.** Do not use lorem ipsum, do not paraphrase, do not translate, and do not invent extra headings or metrics. The copy is final and was written deliberately — some sentences are long on purpose because the honesty *is* the argument. Where a block is too long for the layout you want, change the layout, not the sentence. Character counts matter: design around the text you're actually given.
>
> **Keep the existing design language — this is a sharpening, not a reinvention:**
>
> - Background `#080c16`, text `#ededed`, and exactly one accent: `#96b9f9` (pale periwinkle). Do not introduce a second accent hue. Depth comes from opacity steps of those three, not from new colors.
> - Outfit for headings (700 / `-0.02em`), Manrope for body (300), monospace reserved strictly for machine output — log lines, metadata — because that contrast carries meaning.
> - Hairline-led: 1px borders at `rgba(255,255,255,0.08–0.14)`, essentially no filled panels. A box is drawn only around something that is literally an object.
> - Generous vertical rhythm: `clamp(112px, 10vw, 200px)` between sections. Container `min(1440px, 92vw)`.
> - Icons hand-drawn on a 24×24 grid, `stroke-width: 1.5`, round caps, no fill.
> - Motion budget: **one** signature scroll-linked movement, plus one-shot reveals. No loops, no ambient animated backdrops, no parallax decoration. Must degrade cleanly under `prefers-reduced-motion`.
>
> **The problem to solve.** The page is honest and well-built but it reads *flat and procedural* — a sequence of similar full-width sections, each a heading plus a lead plus a grid. Nothing makes a visitor stop and lean in. Two sections lean on the same vertical-rail device, so the page starts to feel like one repeated diagram. The most persuasive assets on the page — the before/after AI answer, the proposal card, the Lighthouse numbers — are laid out with the same weight as everything around them, so none of them lands as a moment.
>
> **What I want:** make it *unique* and make a prospect curious enough to want to know how the content is actually made.
>
> Specifically:
>
> 1. **Give the page one unforgettable hero idea.** Today it's a poster title over a wave grid. I want a hero that dramatizes the core promise — a question being asked to an AI, and our client's name appearing in the answer — as the first thing a visitor understands, in under two seconds. Ideas welcome; the answer/citation is the star.
> 2. **Establish visual hierarchy across sections.** Right now every section weighs the same. Design a rhythm of *hero moment → supporting detail → hero moment*, so two or three sections are unmistakably the peaks and the rest are quieter connective tissue. Vary the shape of sections: full-bleed, offset/asymmetric, split, narrow-measure. Escape the endless centered-column cadence.
> 3. **Break the diagram repetition.** Process (4 method steps) and Approval (4-step proposal flow) both use the fill-on-scroll rail. Keep the rail for exactly one of them — Process, the method — and find a genuinely different visual form for the proposal flow. It's a *decision*, not a timeline: consider branching, a state change, a document being marked up.
> 4. **Make "what the content actually looks like" the curiosity hook.** This is the commercial heart. The proposal card (page / current text / proposed text / why / accept / reject) is the single most convincing object on the page, and today it sits in a modest right-hand column. Promote it. Let the visitor *see* a real before/after rewrite with the reasoning exposed. Make them want to see more of them.
> 5. **Use the oversized numeral system I already have** (`clamp(120px,14vw,240px)`, ghost fill `rgba(150,185,249,0.07)` or 1px outline stroke `rgba(150,185,249,0.26)`) as structural anchors — numerals that hold a column or ground a row, never floating decoration over copy.
> 6. **Respect the voice.** Sober, technical, anti-hype. The page explicitly refuses to promise rankings or guaranteed citations, and that honesty is a selling point. No fake dashboards, no invented metrics, no marketing superlatives. Restraint reads as competence here.
>
> Deliver artboards for: the hero, the AI-answer/citation section, the method rail, the proposal-flow section (new form), and the proposal-card moment. Desktop first at 1440px, plus mobile at 400px for anything whose structure changes. Annotate spacing, type sizes, and opacity values against the tokens above.
>
> ---
>
> ## CONTENT INVENTORY — final French copy, lay out verbatim
>
> ### Hero
> - Eyebrow: `GEO`
> - H1: **Votre visibilité, automatisée**
> - Answer sentence: *Nous rendons les PME visibles là où leurs clients cherchent désormais : dans les réponses de ChatGPT, Perplexity ou Gemini, et sur Google. GEO et SEO, technique, contenu et mesure. Ce qui peut être automatisé l'est. Le reste, on le fait à la main, et on vous montre les deux.*
>
> ### Section 1 — Comment se faire citer par les IA ?
> Lead: *Quand un client demande à ChatGPT ou Perplexity quelle agence développe des applications web à Bruxelles, l'assistant répond en citant ses sources. Être l'une de ces sources, c'est le référencement qui commence, et il se travaille, page par page.*
>
> Intro line to the three columns: *Trois conditions, dans l'ordre où un moteur de réponse les rencontre :*
>
> | Column | Title | Text |
> |---|---|---|
> | 1 | Un contenu lisible par les machines | Les réponses sont dans le HTML dès le premier chargement, sans JavaScript à exécuter. Un moteur qui ne voit qu'une page vide ne cite rien. |
> | 2 | Des données structurées | Chaque page déclare ce qu'elle est et qui l'écrit, au format schema.org. C'est ce qui permet au moteur de rattacher une réponse à une entreprise précise. |
> | 3 | Une page, une vraie question | Chaque page répond nettement à une question que vos clients posent réellement. C'est le format que les moteurs de réponse reprennent et attribuent. |
>
> **The before/after AI answer demo** (this is a key asset — see point 1):
> - Disclaimer chip, must stay visible: `Illustration, pas un résultat`
> - The question being asked: *Quelle agence fait des applications web à Bruxelles ?*
> - Sources label: `Sources`
> - **Before** — label `Aujourd'hui`, answer *Trois agences reviennent le plus souvent :*, names `Agence A / Studio B / Collectif C`, sources `agence-a.be / studio-b.com / collectif-c.be`, caption *Votre site existe. Le moteur ne l'a pas lu.*
> - **After** — label `Après le travail`, answer *Quatre agences reviennent le plus souvent :*, the same three names **plus the client's own brand inserted** (placeholder `Votre marque`, source `votre-site.be/applications-web`), caption *Une page qui répond à cette question, lisible et structurée.*
> - The whole point of this object is the moment the brand appears in the list. Design that moment.
>
> ### Section 2 — Comment on s'y prend
> Lead: *Chaque étape indique ce que fait le système et ce que nous faisons nous-mêmes.*
> Each of the 4 steps carries two labelled lines: `Système :` (automated, gear icon) and `Nous :` (human, hand icon). Note step 3 deliberately puts **Nous** first.
>
> **01 Audit** — *État des lieux au premier jour : ce qui vous rend visible, ce qui vous freine, et où sont les requêtes qui comptent pour votre métier. On mesure aussi votre point de départ dans les réponses des IA, avant de toucher à quoi que ce soit.*
> · Système : vitesse mobile, données terrain Chrome, robots, sitemap, analyse complète du site.
> · Nous : choix des requêtes, des questions IA et des concurrents à suivre.
>
> **02 Technique** — *Un site que les moteurs lisent sans obstacle : vitesse, structure, données structurées, contenu présent dès le premier chargement.*
> · Système : titres et descriptions des pages, proposés puis appliqués sur votre CMS après validation.
> · Nous : schema.org, hreflang, canonical, performance, faits à la main et vérifiés.
>
> **03 Contenu** — *Des pages qui répondent chacune à une vraie question de vos clients, le format que Google et les moteurs de réponse citent.*
> · Nous : la rédaction, avec vous, dans votre vocabulaire : retouches, nouvelles pages, articles de blog quand il en faut.
> · Système : repère, à partir des questions suivies, les textes à retoucher, les pages qui manquent et les sujets d'articles à écrire.
>
> **04 Mesure** — *On repart de la baseline du jour 1 et on suit ce qui change.*
> · Système : votre présence et celle de vos concurrents dans les réponses de ChatGPT, Perplexity, Gemini, Copilot et Google AI Overviews, sur 25 questions réelles de vos clients, en français et en néerlandais ; positions et trafic revus avec vous à chaque point.
> · Nous : choix des concurrents à comparer, lecture, décision, ajustement, à chaque point avec vous.
>
> ### Section 3 — Vos accès
> Text: *Vos identifiants ne sont jamais stockés dans notre base de données. Ils vivent dans un coffre chiffré, et chaque lecture est tracée : qui, quand, pour quoi. Pour arrêter, un message suffit : on retire l'abonnement de notre CRM, le système ne lit plus rien, rien ne casse.*
>
> Three line-icon items: **Coffre chiffré** — *Jamais dans notre base de données.* · **Lecture tracée** — *Qui, quand, pour quoi.* · **Arrêt sur demande** — *Un message, et on retire l'abonnement.*
>
> Platforms line: *WordPress (Yoast, Rank Math, The SEO Framework) et Shopify : les propositions approuvées sont appliquées automatiquement. Webflow et sites sur mesure : même audit, mêmes propositions, application faite par nous, à la main ou dans le code.*
> Rendered as four typographic chips (never redrawn third-party logos): `WordPress` / `Shopify` / `Webflow` / `Sites sur mesure`, each with a small note (`application automatique`, `application à la main`, `application dans le code, par nous`).
>
> ### Section 4 — Rien n'est écrit sur votre site sans votre accord
> Text: *Le système ne modifie pas votre site en direct. Il propose. Chaque recommandation devient une proposition : la page concernée, la valeur actuelle, la valeur proposée, et pourquoi.*
>
> **The 4-step flow** (this is the one to give a NEW form — not a rail): `Analyse` → `Proposition` → `Décision` → `Écriture vérifiée`. Step 3 branches two ways: *vous validez* / *mode automatique*. Step 4 carries a fake log line, monospace, labelled `Journal`: `14/09 09:02 · /services · meta_description · remplacement · vérifié` (last token in accent color).
>
> Kicker **Vous choisissez le mode**, then two modes:
> - **Mode validation** — *Vous recevez chaque proposition et vous l'acceptez ou la refusez. Rien ne part sans votre clic. C'est le mode par défaut.*
> - **Mode automatique** — *Vous nous faites confiance sur les changements de routine (titres, descriptions) : les propositions approuvées par nous sont appliquées chaque matin, avec un plafond quotidien que vous fixez. Vous pouvez repasser en mode validation à tout moment.*
>
> Kicker **Dans les deux modes**, then four rules:
> 1. Le système ne remplace jamais une valeur qu'il n'a pas lue d'abord.
> 2. Chaque écriture est vérifiée après coup et journalisée : quoi, quand, avant, après.
> 3. Au moindre échec d'écriture, le pilote s'arrête de lui-même et nous prévient.
> 4. Vos changements sont dans votre CMS, pas chez nous. Si vous partez, ils restent.
>
> **THE PROPOSAL CARD — promote this, it's the curiosity hook:**
> - Header: title `Proposition`, meta `/services · meta_description` (monospace)
> - Row `Actuel` → `Nos services` (struck through, dimmed)
> - Row `Proposé` → `Développement web, GEO et SEO pour PME à Bruxelles. Audit gratuit en 48 h.`
> - Why line: *Pourquoi : description trop courte (12 caractères), la page n'annonce ni le métier ni la ville.*
> - Two buttons: `Accepter` (accent outline) / `Refuser` (neutral outline). Visual mock only — never real controls.
>
> ### Section 5 — Architecture & source
> Text: *La méthode qu'on vous propose est celle qu'on applique à notre propre site. Affichez le code source de cette page : tout y est.*
> Three points: *Chaque page existe en français et en anglais, avec les balises qui disent aux moteurs laquelle servir.* · *Chaque page porte ses données structurées (schema.org), validées automatiquement avant chaque mise en production.* · *Tout le contenu est présent dans le HTML dès la première réponse, lisible par les moteurs comme par les assistants IA.*
>
> ### Section 6 — Les chiffres de cette page
> Lead: *Mesuré le {date} sur cette page même, avec {tool}, en conditions mobiles. Vous pouvez relancer l'outil et retomber sur les mêmes chiffres, et c'est tout l'intérêt de les publier.*
> Four gauges: `Performance` · `Accessibilité` · `Bonnes pratiques` · `SEO`. Three vitals: `Affichage principal` · `Stabilité visuelle` · `Réponse du serveur`, each with a `seuil {value}` threshold marker.
> Footnote, and it must stay prominent rather than be tucked away — the admission is the point: *L'affichage principal dépasse encore son seuil de 2,5 secondes, et nous le laissons affiché plutôt que de choisir les chiffres qui nous arrangent. C'est le chantier en cours. Une agence qui ne publie que ses bons scores ne vous dit pas ce qu'elle mesure : elle vous dit ce qu'elle montre.*
> Meta: `Lighthouse mobile, mesuré le {date}`
>
> ### Section 7 — Ce qu'on mesure et ce qu'on ne promet pas
> Text: *Vous n'avez pas à nous croire sur parole. On regarde les mêmes chiffres que vous, aux mêmes moments, à partir d'une baseline prise le premier jour.*
> Three points: (1) *Votre présence dans les réponses des IA, et celle des concurrents que vous choisissez : mentions, part de voix, position moyenne, et si votre domaine est utilisé comme source. Sur 25 questions réelles de vos clients, en FR et NL, dans ChatGPT, Perplexity, Gemini, Copilot et Google AI Overviews.* (2) *Les positions sur les requêtes qui comptent pour votre métier, pas sur celles qui font joli dans un rapport, revues avec vous à chaque point.* (3) *Le trafic organique, avec l'échéance honnête : quelques semaines pour la technique, plusieurs mois pour le contenu.*
>
> Cadence line: *Cadence : analyse complète toutes les deux semaines (hebdomadaire ou mensuelle sur demande), application des propositions approuvées chaque matin, point partagé avec vous à chaque analyse.*
>
> Baseline/today comparison table, chip `valeurs d'exemple` — columns `Baseline jour 1` vs `Aujourd'hui`:
> `Mentions` 3/25 → 11/25 · `Part de voix` 4 % → 12 % · `Position moyenne` 5,8 → 3,1 · `Domaine cité en source` 1 fois → 6 fois · `Requêtes Google en top 10` 2/15 → 6/15
>
> **The refusal paragraph — give it real weight, it is a selling point, not fine print:** *Ce que nous ne vendrons pas : la première position garantie, ni la certitude d'être cité par les IA. Personne ne contrôle l'algorithme de Google, personne ne contrôle les modèles, et aucun outil ne « pousse » un site dans leurs réponses. Une agence qui vous le promet vous dit déjà quelque chose sur le reste. Ce sur quoi nous nous engageons : la méthode, et la transparence sur ce qu'elle produit.*
>
> ### Section 8 — FAQ (9 items)
> 1. **Au bout de combien de temps voit-on des résultats ?** — Le SEO est un investissement de fond : les premiers effets se mesurent en semaines pour les corrections techniques, en mois pour le contenu. C'est plus lent qu'une publicité, mais ça ne s'arrête pas quand on coupe le budget.
> 2. **Garantissez-vous la première position sur Google ?** — Non, et personne de sérieux ne le peut : les résultats dépendent d'un algorithme que personne ne contrôle. Ce qu'on garantit, c'est la méthode : technique propre, contenu qui répond aux vraies questions, mesure, et la transparence sur ce qu'elle produit.
> 3. **C'est quoi, être visible dans les réponses des IA ?** — Quand quelqu'un demande à ChatGPT ou Perplexity quelle agence peut créer une application web à Bruxelles, ces assistants citent leurs sources. Être cité, c'est le nouveau référencement, et ça se travaille : contenu lisible par les machines, données structurées, réponses nettes aux questions que les gens posent réellement.
> 4. **Comment suit-on les résultats ?** — Vous n'avez pas à nous croire sur parole : positions, trafic organique et pages citées sont suivis et partagés. On regarde les mêmes chiffres que vous.
> 5. **Que modifiez-vous sur mon site, et qui décide ?** — Rien n'est écrit sans validation. Chaque recommandation est déposée avec la valeur actuelle et la valeur proposée. Vous l'acceptez ou la refusez, ou vous nous confiez les changements de routine en mode automatique, avec un plafond quotidien. Tout est vérifié après écriture et journalisé.
> 6. **Quels CMS ?** — WordPress (Yoast, Rank Math, The SEO Framework) et Shopify pour l'application automatique. Webflow et sites sur mesure : on fait l'audit et les propositions, et on les applique nous-mêmes, à la main ou dans le code.
> 7. **Que faites-vous de mes accès ?** — Ils ne sont jamais stockés dans notre base. Ils vivent dans un coffre chiffré, chaque lecture est tracée. Pour arrêter, un message suffit : on retire l'abonnement et le système ne lit plus rien.
> 8. **Et si j'arrête ?** — Un message, et on retire l'abonnement de notre CRM. Les changements sont dans votre CMS, ils restent. On ne supprime rien, et on vous remet la baseline et le journal.
> 9. **Le contenu est-il écrit par une IA ?** — Non. Les pages sont rédigées avec vous. Ce que le système automatise, c'est l'analyse, les propositions techniques et la mesure.
>
> ### Closing CTA
> *Entrez l'URL de votre site. On vous rend un état des lieux : ce qui freine votre site aujourd'hui, et votre point de départ dans les réponses des IA sur les questions de votre métier.*
> Button leads to a contact form with a "je veux un audit de mon site" checkbox pre-ticked.

---

## 4. Copy-paste token block

```css
--bg:              #080c16;
--text:            #ededed;
--text-body:       rgba(237, 237, 237, 0.68);
--text-muted:      rgba(237, 237, 237, 0.62);
--text-faint:      rgba(237, 237, 237, 0.42);
--accent:          #96b9f9;
--accent-mid:      rgba(150, 185, 249, 0.45);
--accent-hairline: rgba(150, 185, 249, 0.14);
--accent-ghost:    rgba(150, 185, 249, 0.07);
--accent-stroke:   rgba(150, 185, 249, 0.26);
--hairline:        rgba(255, 255, 255, 0.10);
--font-headings:   'Outfit', sans-serif;      /* 100–900 variable */
--font-body:       'Manrope', sans-serif;     /* 200–800 variable */
--font-mono:       ui-monospace, 'Cascadia Mono', 'SF Mono', Menlo, Consolas;
--container-max:   min(1440px, 92vw);
--container-gutter: 40px;                     /* 20px under 640px */
--section-pad:     clamp(112px, 10vw, 200px);
```

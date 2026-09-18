# /geo — Swiss Design plan

Reference: https://swiss-design.fun/ (International Typographic Style).
Builds on docs/geo-redesign-design-prompt.md (same diagnosis: flat, procedural,
two rails, no peaks) and keeps every constraint in docs/geo-design-tokens-brief.md.
Copy is unchanged: fr.json / en.json are not touched by any phase below.

## 0. What "Swiss" means for this page

The reference site names eight features: geometry, whitespace, grids, structure,
simplicity, sans-serif, type hierarchy, photography. Translated to /geo, where
we already have Outfit/Manrope, hairlines, one accent and no fills:

| Swiss principle | What it replaces on /geo today |
|---|---|
| **The grid is visible structure**, not an invisible layout helper | Every section is a centered column: heading, lead, then a 3-col grid. Nothing is placed *on* a grid, everything is stacked. |
| **Typography is the image** (Müller-Brockmann: size, weight and position carry the message) | Chat-bubble mock-ups, dial gauges, pill chips, hand-drawn pictograms. These are the "AI-made diagrams". |
| **Asymmetry, flush-left, ragged right** | Symmetric two-card layouts, centered gauges, mirrored cards. |
| **One mark, used once per composition** (the red dot) | Accent spread over borders, pills, letters, rules, icons, dots. |
| **Objective / documentary**: show the thing, never illustrate it | Already the page's best instinct (source excerpt, proposal card, Lighthouse). Extend it, drop what only *depicts*. |
| **Whitespace as a tool** | Section pad is generous, but *inside* sections everything is evenly spaced, so nothing is emphasised. |

Swiss is not "add a grid overlay and red dots". It is removing every element that
is not text, rule, or number, then placing what remains on a strict grid with
size and position doing the hierarchy. Our accent `#96b9f9` plays the red dot:
**one accent object per section**, everything else is `#ededed` at opacity steps.

Hard constraints carried over:
- Text stays in the HTML (the page practises what it sells). No image of text, ever.
- SSR HTML is the finished state; `useReveal` only subtracts (see useReveal.js).
- One signature scroll-linked movement per page + one-shot reveals. No loops.
- PosterHero geometry is shared by six pages; the hero is **not** touched.
- 1100px single stack point for anything with columns, as today.
- No new dependency. CSS Modules + `motion/react` already installed.

## 1. The grid (one shared helper)

Add to `src/components/pages/homepage/v2/v2-section.module.scss`:

```scss
/* 12-column Swiss grid. Sections place blocks by column span; nothing is
   centered. Collapses to one column at the shared 1100px stack point. */
.grid12 {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: clamp(16px, 2vw, 32px);
  row-gap: 0;
}
@media (max-width: 1100px) {
  .grid12 { grid-template-columns: minmax(0, 1fr); }
}
```

Every section below uses it with explicit `grid-column` spans. The recurring
asymmetric template for *quiet* sections:

```
cols 1–4   : h2 (sticky at top: 120px on desktop, so it holds while the body scrolls)
cols 6–12  : lead + body
```

Peak sections break the template on purpose (full-width type, or a 5/7 split
that flips sides). That alternation *is* the page rhythm.

Optional, judged live: `.gridGuides` — twelve 1px vertical hairlines at
`rgba(255,255,255,0.035)` behind the two peak sections only, drawn once with the
existing `revealStyles.hairline`. This is the most literal Swiss cue and also the
one most likely to read as a backdrop. Build it behind a class, toggle it in the
browser, keep or delete on sight.

## 2. Page rhythm

| # | Section | Role | Form |
|---|---|---|---|
| 1 | GeoAnswer | **peak** | The citation, played: typed question, streamed answer (done) |
| 2 | Process | quiet | A table, not a timeline |
| 3 | Access | quiet | Asymmetric template |
| 4 | Approval | **peak** | The proposal as a marked-up document |
| 5 | MetaProof | quiet | Unchanged (already documentary) |
| 6 | MeasuredProof | **peak** | Four numerals, no gauges |
| 7 | Measures | quiet → ends on a statement | Table + the refusal at statement size |

Three peaks, and they are the three objects the previous brief already named
as the persuasive assets. The rest is connective tissue set on the same grid.

## 3. Section by section

### 3.1 GeoAnswer — peak: the citation (built 2026-09-18)

Shipped as a *played poster*, not a static one. Research on the category's
openers (Profound, Peec, Otterly open on dashboard screenshots; Ahrefs opens
on "type your brand, watch the answer"; Athena on one typographic claim)
pointed to the same conclusion: the wow is watching the AI answer form.

```
cols 1–12  h2
cols 1–6   lead                      cols 8–12  the 3 summary lines as hairline cells

cols 1–12  hairline
cols 1–8   the question, Outfit 700 clamp(40px,5.4vw,88px), typed letter by letter
cols 10–12 legend: Aujourd'hui / Après le travail, stacked, top-aligned

cols 1–12  the answer as full-width rows: outline numeral | name | source (mono)
           01–03 rise in one after another, 04 « Votre marque » lands last,
           its hairline draws and its accent dot pops on a spring
cols 1–12  Illustration, pas un résultat (mono)

cols 1–12  Trois conditions… + the three columns (4/4/4)
```

One observer on the figure (`useChoreo` in geo-answer.jsx) sets `data-wait`
then `data-play`; every child has its cue in geo-answer.module.scss, tuned by
two variables (`$type`, `$row`). SSR HTML is the finished state. Reduced
motion collapses everything to one fade.

Tried and removed the same day: a large accent disc right of the question
(Müller-Brockmann's circle). Mihai: it adds nothing. The only accent object
in the section is the dot on row 04.

Gotcha found while building: Chrome can finish a CSS animation at progress
0.9999999 instead of 1, so `step-end` easing leaves the element on its
*from* keyframe. Use a 20ms linear fade for a typewriter, never a step.

### 3.2 Process — quiet: a table, not a timeline

Today: four steps on the fill-on-scroll rail, each with Système / Nous lines.

The content is a 2×4 matrix (who × step) and Swiss says set it as one:

```
cols 1–12  h2 + lead (asymmetric template: h2 cols 1–4, lead cols 6–12)

cols 1–12  table, hairline rows, no rail, no dots:
                    01 Audit      02 Technique   03 Contenu    04 Mesure
           (title + text, blockHeading + 14px, one row)
           ─────────────────────────────────────────────────────────────
           Système    …            …              (rien)        …
           ─────────────────────────────────────────────────────────────
           Nous       …            …              …             …
```

The step numerals become `numOutline` at `numLg` size sitting *behind* the
column heads (they ground a column, which is what v2-section.module.scss says
they are for). The gear/hand icons stay as row labels at 14px, once per row
instead of eight times. Reading horizontally now answers the visitor's actual
question ("what is automated?") in one glance: that is form following function.

Under 1100px: each step becomes a hairline-topped block, Système / Nous as two
lines, exactly the current mobile rendering. Keep `use-rail-fill.js` since
Approval may still use it (3.4).

The comment block at the top of process.jsx defends the rail as "le moment
signature de la page". Rewrite that comment when the rail goes: the signature
moves to GeoAnswer row 04.

### 3.3 Access — quiet

Asymmetric template. Three items stay (pictograms are Swiss-compatible, they
are already 1.5 stroke on a 24 grid) but sit in cols 6–12 as three hairline
cells, 2/2/3 spans. The four CMS "cartouches" become one tabular list:

```
WordPress        Yoast · Rank Math · The SEO Framework   application automatique
Shopify                                                  application automatique
Webflow                                                  application à la main
Sites sur mesure                                         application dans le code, par nous
```

Hairline rows, mono for the right-hand column (it is machine behaviour).
Remove `.cmsCard` borders.

### 3.4 Approval — peak: the document

Today: vertical rail (Analyse → Proposition → Décision → Écriture vérifiée),
then modes left / proposal card right.

Note the tension: commit b8b177b (14/09) asked for the vertical rail here;
docs/geo-redesign-design-prompt.md asks for "a genuinely different form, it is
a decision not a timeline". This plan follows the brief and **drops the second
rail**; Mihai decides.

Swiss version: the proposal card is promoted to a full-width **marked-up
document**, and the four-step flow becomes its margin.

```
cols 1–4   h2 (sticky)          cols 6–12  lead

cols 1–12  hairline

cols 1–3   flow, as a numbered list in small caps, mono numbers, no rail:
           01 Analyse
           02 Proposition
           03 Décision
              vous validez / mode automatique   (typographic fork: two lines
                                                 indented under 03, hairline
                                                 left on each)
           04 Écriture vérifiée
              Journal  14/09 09:02 · /services · meta_description · remplacement · vérifié

cols 4–12  THE DOCUMENT (the one carded object, because it is an object):
           Proposition                       /services · meta_description
           ───────────────────────────────────────────────────────────
           Actuel    Nos services                    (struck, 0.42)
           Proposé   Développement web, GEO et SEO pour PME à Bruxelles.
                     Audit gratuit en 48 h.          ← set at blockHeading size,
                                                       this is the object of desire
           Pourquoi  description trop courte (12 caractères)…
           ───────────────────────────────────────────────────────────
                                            Refuser        [ Accepter ]  ← accent outline
                                                                            = the section's one accent

cols 6–12  Vous choisissez le mode → the two modes as two hairline cells (3/3)
cols 6–12  Dans les deux modes → the four rules as a numbered list
```

The "Proposé" line at blockHeading size is what makes a prospect lean in: it
is the first time on the page they read a sentence *written for a client*.

### 3.5 MetaProof — unchanged

Already the most Swiss section: a real artefact, line numbers, a numbered
reference from claims to evidence. Only change: put it on `.grid12` (code cols
1–7, notes cols 8–12) so its rules align with the neighbours. The JSON-LD idea
in the geo-schema memory is a separate ticket and is not part of this plan.

### 3.6 MeasuredProof — peak: the numbers

Today: four dial gauges with a count-up.

Gauges are dashboard furniture. Swiss says the number is the image:

```
cols 1–12  h2

cols 1–12  four numerals, numXl, Outfit 700, flush left, one per 3 cols:
           100          100          100          100
           Performance  Accessibilité Bonnes pratiques SEO
           (label 11px uppercase 0.1em under each, hairline top on each cell)

cols 1–12  Lighthouse mobile, mesuré le {date}   ·   lien   (mono, faint)
```

`CountUp` stays (island already admitted). The threshold/vitals block stays
retired as documented in measured-proof.jsx. No accent in this section at all:
four white numerals on dark is the composition. Delete `.dial`, `.track`,
`.arc`, `R`, `CIRC`.

### 3.7 Measures — quiet, ending on the statement

Three points on the grid (4/4/4, hairline top, as now). The two tracking cards
become one table, which is what they are:

```
                        Baseline jour 1    Aujourd'hui      valeurs d'exemple
Mentions                3 / 25             11 / 25
Part de voix            4 %                12 %
Position moyenne        5,8                3,1
Domaine cité en source  1 fois             6 fois
Requêtes Google top 10  2 / 15             6 / 15
```

Hairline rows, numbers in tabular figures (`font-variant-numeric: tabular-nums`),
"Aujourd'hui" column head in accent: the section's one accent.

The refusal keeps the largest vertical step on the page and moves to
`section.statement` size in cols 5–12, flush left, with a full-width hairline
above. That is the page's "one big statement" the M5 doc planned and never
built (docs/m5-immersive-design-concepts.md §3.3).

## 4. Phases

Each phase is shippable alone, SCSS-first, JSX only where markup must change.
Order is by impact per line changed.

| Phase | Files | Adds | Removes |
|---|---|---|---|
| **A. Grid + rhythm** | v2-section.module.scss, all 7 geo `.module.scss` | `.grid12`, asymmetric h2/lead template | centered stacking |
| **B. GeoAnswer table** | geo-answer.jsx, geo-answer.module.scss | tabular answer, row-04 draw-in | chat cards, pills, title gradient |
| **C. MeasuredProof numerals** | measured-proof.jsx, .scss | numXl cells | dials |
| **D. Process table** | process.jsx, process.module.scss | who × step table, ghost numerals | rail on Process |
| **E. Approval document** | approval.jsx, approval.module.scss | full-width proposal, margin flow | second rail |
| **F. Access + Measures tables** | access.*, measures.* | tabular CMS list, tracking table | cms cards, tracking cards |
| G. (optional) grid guides | v2-section.module.scss | `.gridGuides` | — judged live |

Phase A first: it is the cheapest change with the biggest "this is designed"
effect, and B–F each assume the grid exists. B and C are the two phases worth
doing even if nothing else ships.

Each phase ends with a 1440px and a 400px look in the browser (Mihai's live
hot-reload loop), not a screenshot pass.

## 5. Checks before calling any phase done

- `grep -c "96b9f9"` in the section's .scss: one accent object per section,
  so the count should drop, not rise.
- View source: every string from fr.json still present in the served HTML.
- `prefers-reduced-motion: reduce`: the page reads finished with no movement.
- Lighthouse mobile on /geo: not below the numbers MeasuredProof prints
  (src/data/site-metrics.js), because the section would then be lying.
- 1100px and 640px: no horizontal scroll, tables stack to hairline blocks.

## 6. Prompt for the build session

> Sur /geo, applique docs/geo-swiss-design-plan.md phase par phase, en
> commençant par A puis B. Lis d'abord GeoClient.jsx (en-tête), useReveal.js et
> v2-section.module.scss. Copie fr/en intouchée. Une seule couleur accent par
> section. Un seul mouvement signature sur la page (rangée 04 de GeoAnswer).
> Je regarde en live à 1440 et 400 : une phase à la fois, je valide à l'œil.

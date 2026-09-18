"use client";

/* Être cité par les moteurs de réponse, la revendication que cette page doit
   porter.
 *
 * V4, 18/09/2026 (docs/geo-swiss-design-plan.md §3.1) : les deux cartes qui
 * imitaient l'écran d'un assistant sont remplacées par une affiche : la
 * question en corps d'affiche, la réponse en dessous, votre marque en
 * dernier. Un disque accent a été essayé à droite de la question et retiré
 * le jour même (Mihai : « il n'apporte rien ») — le seul accent de la
 * section est le point sur votre nom.
 *
 * V4b, même jour (Mihai : « il faut que ce soit la première chose qu'ils
 * voient et qu'ils fassent wow ») : l'affiche est jouée, pas affichée. Un
 * seul observer sur la figure, et tout ce qu'elle contient suit une
 * chorégraphie CSS : la question se tape lettre à lettre, la réponse arrive
 * comme un assistant qui écrit, votre marque atterrit en dernier. C'est ce
 * que font les bons ouvreurs du secteur (Ahrefs : « tapez votre marque,
 * regardez la réponse ») : on regarde une réponse se former, on ne lit pas
 * un avant/après. Timings dans geo-answer.module.scss ($type, $row).
 *
 * V4c, même jour (Mihai : « trop grand, pas convaincu, à afficher
 * autrement ») : la réponse n'est plus une table de quatre grandes rangées.
 * Une phrase à appels de source en exposant a été essayée, puis jugée
 * « trop fade » ; V4f (skill swiss-design, références/components.md) :
 * quatre entrées compactes, numéro / nom / domaine, la vôtre sur un aplat
 * accent atténué, et les trois conditions en cellules teintées sans filet.
 *
 * L'observer est local (useChoreo) parce que le reveal partagé stagge par
 * index à 90ms et plafonne à 8 : une séquence de quatre secondes ne rentre
 * pas dedans. Même contrat que useReveal : le HTML servi est l'état final,
 * JS ne fait que soustraire (data-wait) puis rendre (data-play).
 *
 * L'avant / après survit en légende, à droite de la question : « Aujourd'hui »
 * et « Après le travail » avec leurs deux phrases. `demo.before.answer`
 * (« Trois agences… ») n'est plus lu : la phrase dit « Quatre » et la légende
 * dit le reste. La clé reste dans fr/en.json.
 *
 * V4e, même jour (Mihai : « quelque chose de plus générique, qui parle au
 * client ») : la question n'est plus la nôtre (« quelle agence fait des
 * applications web à Bruxelles ») mais un blanc à remplir, « Qui
 * recommandez-vous pour [votre métier] à [votre ville] ? », et les noms
 * disent ce qu'ils sont : Concurrent 1, 2, 3, puis Votre entreprise. Les
 * crochets marquent les blancs dans fr/en.json ; ils sont rendus en .slot
 * (maigre, encre atténuée) et ne sont pas tapés à l'écran.
 *
 * C'est une illustration, pas un résultat : les noms sont fictifs, le domaine
 * cité est « votre-site.be », et la figure le dit. Pas de vrai nom de client
 * tant qu'on n'a pas une citation démontrée.
 *
 * Tout est en HTML : la réponse est une phrase et une liste, pas une image,
 * ce qui est précisément l'argument de la condition a. La figure reste
 * aria-hidden (bloc et écran) parce que les trois colonnes portent l'argument en prose.
 *
 * La limite de ce que la page revendique n'est pas ici mais dans
 * measures.refusal, une section plus bas. Ne pas remettre de clôture ici sans
 * retirer l'autre. */

import {useEffect, useRef} from "react";
import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./geo-answer.module.scss";

/* Les trois conditions, dans l'ordre où un moteur les rencontre. Le glyphe
   dit la condition : des lignes de texte, des accolades de données, un point
   d'interrogation. Trait 1.5, même famille que les pictos de process. */
const COLS = [
    {key: "readable", glyph: (
        <svg viewBox="0 0 48 48" aria-hidden="true">
            <path d="M6 12h36M6 24h28M6 36h32"/>
        </svg>
    )},
    {key: "structured", glyph: (
        <svg viewBox="0 0 48 48" aria-hidden="true">
            <path d="M18 6h-3a4 4 0 00-4 4v8a4 4 0 01-4 4 4 4 0 014 4v8a4 4 0 004 4h3M30 6h3a4 4 0 014 4v8a4 4 0 004 4 4 4 0 00-4 4v8a4 4 0 01-4 4h-3"/>
        </svg>
    )},
    {key: "answers", glyph: (
        <svg viewBox="0 0 48 48" aria-hidden="true">
            <path d="M15 17a9 9 0 1115 7.5c-3.5 2-6 4-6 8.5"/>
            <circle cx="24" cy="40" r="1.4"/>
        </svg>
    )},
];

/* Parque la figure si elle est hors écran au boot, la joue quand un cinquième
   entre dans la fenêtre. Déjà à l'écran au boot : on ne touche à rien. */
const useChoreo = () => {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        const io = new IntersectionObserver(([entry], observer) => {
            if (!entry.isIntersecting) {
                el.dataset.wait = "";
                return;
            }
            if ("wait" in el.dataset) {
                delete el.dataset.wait;
                el.dataset.play = "";
            }
            observer.disconnect();
        }, {threshold: 0.2});
        io.observe(el);
        return () => io.disconnect();
    }, []);
    return ref;
};

const GeoAnswer = () => {
    const t = useTranslations("pages.services.detail.seo.geo");
    const reveal = useReveal();
    const choreo = useChoreo();
    const before = t.raw("demo.before");
    const after = t.raw("demo.after");
    /* Les quatre sources, dans l'ordre de la phrase ; la vôtre en dernier. */
    const names = [...after.names, t("demo.you")];
    const sources = [...after.sources, t("demo.yourPage")];
    /* La question, lettre par lettre, avec ses blancs à remplir : les
       segments entre crochets deviennent des .slot, les crochets ne sont pas
       tapés. Espace insécable devant le « ? » français. */
    const typed = t("demo.question").replace(" ?", " ?")
        .split(/(\[[^\]]+\])/)
        .flatMap((seg) => {
            const slot = seg.startsWith("[");
            return Array.from(slot ? seg.slice(1, -1) : seg, (ch) => ({ch, slot}));
        });

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={section.heading} {...reveal(0)}>{t("title")}</h2>

                {/* V4g, 18/09 (Mihai : « il y a une dissonance » entre l'ouverture
                    et l'affiche) : le lead et les trois énoncés sont entrés
                    dans la figure. Le lead occupe le vide en haut à droite du
                    bloc, au-dessus de l'écran de réponse : la question à
                    gauche, ce qui se passe à droite, la réponse dessous. Il
                    reprend la question de l'affiche (votre métier, votre
                    ville) au lieu de la nôtre. Les trois énoncés ferment la
                    figure, sur une ligne. L'ordre du DOM ne change pas (h2,
                    lead, énoncés, figure) : la grille place, le mobile
                    empile dans cet ordre.

                    aria-hidden est descendu sur le bloc et l'écran : les
                    trois colonnes disent en prose ce que la figure montre. Le
                    texte part quand même dans le HTML.

                    Composition suisse (V4d, 18/09, d'après les références de
                    swiss-design.fun envoyées par Mihai) : un bloc plein de
                    couleur sur sept colonnes avec la question dedans, et
                    l'écran de réponse qui chevauche son bord droit, dans la
                    couleur de la page. Aucun filet : le chevauchement fait la
                    structure. Un seul observer (useChoreo) ; chaque enfant a
                    son moment dans le .scss. */}
                <div className={`${section.grid12} ${styles.demo}`} ref={choreo}>
                    <p className={`${section.lead} ${styles.lead}`} {...reveal(1)}>{t("lead")}</p>
                    {/* En bref : trois énoncés pour les lecteurs pressés et les
                        moteurs de réponse (Otterly, 18/09 : Summary Block,
                        pire score de la page). */}
                    <ul className={styles.summary} {...reveal(2)}>
                        {t.raw("summary").map((line) => (
                            <li key={line}>{line}</li>
                        ))}
                    </ul>

                    {/* Le panneau plein : la question, côté « vous ». L'écran
                        de réponse vient mordre sur son bord droit, comme la
                        photo sur le bloc rouge des références suisses. */}
                    <div className={styles.panel} aria-hidden="true">
                        <p className={styles.question}>
                            {typed.map(({ch, slot}, i) => (
                                <span key={i} className={slot ? `${styles.ch} ${styles.slot}` : styles.ch} style={{"--i": i}}>
                                    {ch}
                                </span>
                            ))}
                        </p>
                        <dl className={styles.legend}>
                            <dt>{before.label}</dt>
                            <dd>{before.caption}</dd>
                            <dt>{after.label}</dt>
                            <dd>{after.caption}</dd>
                        </dl>
                    </div>

                    <div className={styles.reply} aria-hidden="true">
                        {/* La réponse : la phrase d'ouverture, puis quatre entrées
                            (numéro, nom, domaine), comme la liste d'un vrai
                            assistant. Le vôtre est le dernier, sur un aplat
                            accent atténué : la seule couleur de l'écran. Chaque
                            entrée a son heure (--r). */}
                        <p className={styles.answerLead}>{after.answer}</p>
                        <ol className={styles.entries}>
                            {names.map((name, i) => {
                                const you = i === names.length - 1;
                                return (
                                    <li key={name} className={you ? styles.entryYou : styles.entry} style={{"--r": i}}>
                                        <span className={styles.n}>{String(i + 1).padStart(2, "0")}</span>
                                        <span className={styles.name}>{name}</span>
                                        <span className={styles.domain}>{sources[i]}</span>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                </div>

                {/* Les trois conditions, en fiche technique : glyphe | titre |
                    texte, comme la fiche du sèche-cheveux Gillette des
                    références suisses. Retenue le 18/09 parmi sept
                    propositions (planches dans .work/) : Mihai voulait moins
                    de hauteur, pas d'escalier, pas de fond. Pas de lettres ni
                    de numéros : l'ordre est celui de la lecture. « Illustration,
                    pas un résultat » a sauté (ça ne sert à rien) ; demo.example
                    reste dans fr/en.json. */}
                <div className={`${section.grid12} ${styles.conditions}`}>
                    <div className={styles.aside} {...reveal(3)}>
                        <span className={styles.mark} aria-hidden="true"/>
                        <p className={styles.asideText}>{t("conditions")}</p>
                    </div>
                    <div className={styles.list}>
                        {COLS.map(({key, glyph}, i) => (
                            <div key={key} className={styles.item} {...reveal(4 + i)}>
                                <span className={styles.glyph} aria-hidden="true">{glyph}</span>
                                <div className={styles.itemBody}>
                                    <h3 className={`${section.blockHeading} ${styles.itemTitle}`}>{t(`cols.${key}.title`)}</h3>
                                    <p className={styles.itemText}>{t(`cols.${key}.text`)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GeoAnswer;

"use client";

/* Être cité par les moteurs de réponse, la revendication que cette page doit
   porter, et la seule dont le titre prend le dégradé identitaire.
 *
 * V3, 14/09/2026 (docs/PAGE-GEO-SEO-refonte.md) : le schéma page → moteur →
 * réponse est remplacé par un avant / après. Deux cartes qui imitent l'écran
 * d'un assistant : la même question, deux réponses. À gauche trois concurrents
 * et votre marque absente ; à droite la même liste, plus vous, et votre page
 * dans les sources. Sous la carte de droite, les repères a / b / c renvoient
 * aux trois conditions en colonnes : le lecteur voit la cause et l'effet.
 *
 * C'est une illustration, pas un résultat : les noms sont fictifs, le domaine
 * cité est « votre-site.be », et la carte le dit. Pas de vrai nom de client
 * tant qu'on n'a pas une citation démontrée.
 *
 * Tout est en HTML : les deux cartes sont des listes et des paragraphes, pas
 * une image, ce qui est précisément l'argument de la condition a. La figure
 * reste aria-hidden parce que les trois colonnes portent l'argument en prose.
 *
 * La limite de ce que la page revendique n'est pas ici mais dans
 * measures.refusal, une section plus bas. Ne pas remettre de clôture ici sans
 * retirer l'autre. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import revealStyles from "@/components/pages/homepage/v2/reveal.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./geo-answer.module.scss";

/* Les trois conditions, dans l'ordre où un moteur les rencontre. Repères en
   lettres : elles tiennent en même temps, rien n'est fait en premier. */
const COLS = [
    {key: "readable", mark: "a"},
    {key: "structured", mark: "b"},
    {key: "answers", mark: "c"},
];

const Card = ({t, side, cited}) => {
    const d = t.raw(`demo.${side}`);
    return (
        <div className={cited ? styles.cardCited : styles.card}>
            <div className={styles.cardHead}>
                <span className={styles.cardLabel}>{d.label}</span>
                <span className={styles.cardDots} aria-hidden="true"><i/><i/><i/></span>
            </div>
            <div className={styles.chat}>
                <p className={styles.question}>{t("demo.question")}</p>
                <div className={styles.answer}>
                    <p className={styles.answerText}>{d.answer}</p>
                    <ul className={styles.names}>
                        {d.names.map((n) => <li key={n}>{n}</li>)}
                        {cited ? <li className={styles.you}>{t("demo.you")}</li> : null}
                    </ul>
                    <div className={styles.sources}>
                        <span className={styles.sourcesLabel}>{t("demo.sourcesLabel")}</span>
                        <ul className={styles.sourceList}>
                            {d.sources.map((s) => <li key={s}>{s}</li>)}
                            {cited ? <li className={styles.yourPage}>{t("demo.yourPage")}</li> : null}
                        </ul>
                    </div>
                </div>
            </div>
            <p className={styles.caption}>{d.caption}</p>
        </div>
    );
};

const GeoAnswer = () => {
    const t = useTranslations("pages.services.detail.seo.geo");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={`${section.heading} ${styles.title}`} {...reveal(0)}>{t("title")}</h2>
                <p className={`${section.lead} ${styles.lead}`} {...reveal(1)}>{t("lead")}</p>

                {/* aria-hidden : les trois colonnes disent en prose ce que les
                    cartes montrent. Le texte part quand même dans le HTML. */}
                <div className={styles.demo} {...reveal(2)} aria-hidden="true">
                    <div className={styles.cards}>
                        <Card t={t} side="before"/>
                        <Card t={t} side="after" cited/>
                    </div>
                    {/* Les trois repères, reliés à la carte de droite par un
                        filet : ce sont ses causes. */}
                    <div className={styles.marks}>
                        <span className={styles.marksRule}/>
                        <ul className={styles.markList}>
                            {COLS.map(({key, mark}) => (
                                <li key={key} className={styles.markPill}>
                                    <span className={styles.markLetter}>{mark}</span>
                                    <span className={styles.markText}>{t(`cols.${key}.title`)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <p className={styles.example}>{t("demo.example")}</p>
                </div>

                <p className={styles.conditions} {...reveal(3)}>{t("conditions")}</p>

                <div className={styles.cols}>
                    {COLS.map(({key, mark}, i) => (
                        <div key={key} className={styles.col}>
                            <span
                                className={`${styles.rule} ${revealStyles.hairline}`}
                                aria-hidden="true"
                                {...reveal(4 + i)}
                            />
                            <div className={styles.body} {...reveal(4 + i)}>
                                <span className={styles.colMark} aria-hidden="true">{mark}</span>
                                <h3 className={section.blockHeading}>{t(`cols.${key}.title`)}</h3>
                                <p className={styles.colText}>{t(`cols.${key}.text`)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GeoAnswer;

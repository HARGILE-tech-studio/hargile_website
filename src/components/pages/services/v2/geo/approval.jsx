"use client";

/* Rien n'est écrit sur votre site sans votre accord.
 *
 * V2, 18/09/2026 (docs/geo-swiss-design-plan.md §3.4, et Mihai : « beaucoup de
 * texte, refaire les modes avec la proposition et le mode validation ») : le
 * second rail a sauté. La section est un seul objet, la proposition telle que
 * le client la voit, et le choix du mode agit dessus :
 *
 *   mode validation  → la proposition attend, Refuser / Accepter
 *   mode automatique → elle est déjà appliquée, et la ligne de journal le dit
 *
 * C'est le seul état interactif de la page, et il ne sert qu'à ça : montrer
 * que le mode change qui décide, pas ce qui est proposé. Le HTML servi est le
 * mode validation (le mode par défaut du produit), et les deux textes de mode
 * sont toujours dans le HTML ; le mode inactif est seulement atténué.
 *
 * Le parcours (Analyse → Proposition → Décision → Écriture vérifiée) est une
 * bande de quatre cellules au-dessus, sans rail ni points. L'accent de la
 * section est le bouton Accepter, en aplat : c'est la décision du client.
 *
 * La carte est une maquette : Refuser / Accepter sont des <span>, pas des
 * <button>, pour qu'un lecteur d'écran ne trouve pas deux actions mortes. Les
 * deux boutons de mode, eux, sont réels. `flow.branch*` et `flow.journal`
 * restent dans fr/en.json, non lus. */

import {useState} from "react";
import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./approval.module.scss";

const MODES = ["validate", "auto"];

const Approval = () => {
    const t = useTranslations("pages.services.detail.seo.approval");
    const reveal = useReveal();
    const flow = t.raw("flow");
    const card = t.raw("card");
    const [mode, setMode] = useState("validate");
    /* Le fondu du pied ne joue qu'après un clic : le HTML servi est fini. */
    const [touched, setTouched] = useState(false);

    return (
        <section className={section.section}>
            <div className={section.container}>
                <div className={`${section.grid12} ${styles.opener}`}>
                    <h2 className={`${section.heading} ${styles.heading}`} {...reveal(0)}>{t("title")}</h2>
                    <p className={`${section.lead} ${styles.lead}`} {...reveal(1)}>{t("text")}</p>
                </div>

                <ol className={styles.flow} {...reveal(2)}>
                    {flow.steps.map((label, i) => (
                        <li key={label}>
                            <span className={styles.flowNum}>{String(i + 1).padStart(2, "0")}</span>
                            {label}
                        </li>
                    ))}
                </ol>

                <div className={`${section.grid12} ${styles.stage}`} data-touched={touched ? "" : undefined}>
                    <div className={styles.modes} {...reveal(3)}>
                        <p className={styles.label}>{t("modesTitle")}</p>
                        {MODES.map((m) => (
                            <button
                                key={m}
                                type="button"
                                className={styles.mode}
                                aria-pressed={mode === m}
                                onClick={() => { setMode(m); setTouched(true); }}
                            >
                                <span className={`${section.blockHeading} ${styles.modeTitle}`}>{t(`modes.${m}.title`)}</span>
                                <span className={styles.modeText}>{t(`modes.${m}.text`)}</span>
                            </button>
                        ))}
                    </div>

                    {/* La proposition, l'objet le plus concret de la page.
                        Maquette : aucune action réelle. */}
                    <div className={styles.card} {...reveal(4)} aria-hidden="true">
                        <div className={styles.cardHead}>
                            <span className={styles.label}>{card.title}</span>
                            <span className={styles.cardMeta}>{card.page} · {card.field}</span>
                        </div>
                        <div className={styles.cardRow}>
                            <span className={styles.cardLabel}>{card.beforeLabel}</span>
                            <span className={styles.cardBefore}>{card.before}</span>
                        </div>
                        <div className={styles.cardRow}>
                            <span className={styles.cardLabel}>{card.afterLabel}</span>
                            <span className={styles.cardAfter}>{card.after}</span>
                        </div>
                        <div className={styles.cardRow}>
                            <span className={styles.cardLabel}>{card.whyLabel}</span>
                            <span className={styles.cardWhy}>{card.why}</span>
                        </div>
                        <div className={styles.cardFoot}>
                            {mode === "validate" ? (
                                <>
                                    <span className={styles.footNote}>{card.pending}</span>
                                    <span className={styles.reject}>{card.reject}</span>
                                    <span className={styles.accept}>{card.accept}</span>
                                </>
                            ) : (
                                <>
                                    <span className={styles.footNote}>{card.applied}</span>
                                    <span className={styles.journalLine}>
                                        {flow.journalLine.map((cell) => <span key={cell}>{cell}</span>)}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <p className={`${styles.label} ${styles.rulesTitle}`} {...reveal(5)}>{t("bothTitle")}</p>
                <ol className={styles.rules} {...reveal(6)}>
                    {t.raw("rules").map((r, i) => (
                        <li key={r}>
                            <span className={styles.flowNum}>{String(i + 1).padStart(2, "0")}</span>
                            {r}
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
};

export default Approval;

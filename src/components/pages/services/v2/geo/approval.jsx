"use client";

/* Rien n'est écrit sur votre site sans votre accord.
 *
 * 14/09/2026 (docs/PAGE-GEO-SEO-refonte.md §4) : la section qui décrit le
 * pilote tel qu'il tourne. Deux objets montrés plutôt qu'illustrés, même
 * famille d'argument que meta-proof : le parcours d'une proposition (Analyse →
 * Proposition → Décision → Écriture vérifiée, avec la bifurcation validation /
 * automatique et une ligne de journal) et la carte de proposition telle que
 * le client la voit (page, actuel, proposé, pourquoi, deux boutons).
 *
 * Le parcours est sur le même rail animé que Process (demande de Mihai,
 * 14/09/2026) : mêmes styles importés de process.module.scss, même hook. C'est
 * une exception au budget d'un mouvement par page, assumée parce que les deux
 * rails disent la même chose, un ordre réel, et se lisent comme un seul motif.
 *
 * La carte est une maquette : les boutons sont des <span>, pas des <button>,
 * pour qu'un lecteur d'écran ne trouve pas deux actions mortes. La ligne de
 * journal est fictive et reprend celle du doc. */

import {useRef} from "react";
import {motion, useTransform} from "motion/react";
import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import {railFillStyle, useRailFill} from "@/components/pages/services/v2/shared/use-rail-fill";
import rail from "./process.module.scss";
import styles from "./approval.module.scss";

const FlowStep = ({label, i, count, fill, reveal, children}) => {
    const at = i / count;
    const ignite = useTransform(fill, [at, at + 0.1], [0, 1]);
    const dotOpacity = useTransform(ignite, [0, 1], [0.25, 1]);
    const dotScale = useTransform(ignite, [0, 1], [0.6, 1]);
    const numOpacity = useTransform(ignite, [0, 1], [0.4, 1]);

    return (
        <li className={rail.step} {...reveal(2 + i)}>
            <motion.div className={`${rail.dot} ${styles.flowDot}`} style={{opacity: dotOpacity, scale: dotScale}}/>
            <div className={`${rail.stepBody} ${styles.flowStepBody}`}>
                <motion.div className={rail.num} style={{opacity: numOpacity}}>
                    {String(i + 1).padStart(2, "0")}
                </motion.div>
                <span className={styles.flowLabel}>{label}</span>
                {children}
            </div>
        </li>
    );
};

const Approval = () => {
    const t = useTranslations("pages.services.detail.seo.approval");
    const reveal = useReveal();
    const flow = t.raw("flow");
    const card = t.raw("card");
    const timelineRef = useRef(null);
    const {fill, vertical} = useRailFill(timelineRef, {alwaysVertical: true});

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={section.heading} {...reveal(0)}>{t("title")}</h2>
                <p className={`${section.lead} ${styles.lead}`} {...reveal(1)}>{t("text")}</p>

                {/* Le parcours d'une proposition. aria-hidden : les modes et
                    les règles en dessous disent tout en prose. */}
                <div className={`${rail.timeline} ${styles.flow}`} ref={timelineRef} aria-hidden="true">
                    <div className={`${rail.rail} ${styles.flowRail}`}>
                        <motion.div
                            className={`${rail.railFill} ${styles.flowRailFill}`}
                            style={railFillStyle(fill, vertical)}
                        />
                    </div>
                    <ol className={`${rail.steps} ${styles.flowList}`}>
                    {flow.steps.map((label, i) => (
                        <FlowStep key={label} label={label} i={i} count={flow.steps.length} fill={fill} reveal={reveal}>
                            {i === 2 ? (
                                <span className={styles.branch}>
                                    <span>{flow.branchValidate}</span>
                                    <span>{flow.branchAuto}</span>
                                </span>
                            ) : null}
                            {i === 3 ? (
                                <span className={styles.journal}>
                                    <span className={styles.journalTitle}>{flow.journal}</span>
                                    <span className={styles.journalLine}>
                                        {flow.journalLine.map((cell) => <span key={cell}>{cell}</span>)}
                                    </span>
                                </span>
                            ) : null}
                        </FlowStep>
                    ))}
                    </ol>
                </div>

                <div className={styles.split}>
                    <div className={styles.modes}>
                        <p className={styles.kicker} {...reveal(3)}>{t("modesTitle")}</p>
                        {["validate", "auto"].map((m, i) => (
                            <div key={m} className={styles.mode} {...reveal(4 + i)}>
                                <h3 className={section.blockHeading}>{t(`modes.${m}.title`)}</h3>
                                <p className={styles.modeText}>{t(`modes.${m}.text`)}</p>
                            </div>
                        ))}
                        <p className={styles.kicker} {...reveal(6)}>{t("bothTitle")}</p>
                        <ul className={styles.rules} {...reveal(6)}>
                            {t.raw("rules").map((r) => <li key={r}>{r}</li>)}
                        </ul>
                    </div>

                    {/* La carte de proposition, l'objet le plus concret de la
                        page. Maquette : aucune action réelle. */}
                    <div className={styles.card} {...reveal(4)} aria-hidden="true">
                        <div className={styles.cardHead}>
                            <span className={styles.cardTitle}>{card.title}</span>
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
                        <p className={styles.cardWhy}>{card.why}</p>
                        <div className={styles.cardActions}>
                            <span className={styles.accept}>{card.accept}</span>
                            <span className={styles.reject}>{card.reject}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Approval;

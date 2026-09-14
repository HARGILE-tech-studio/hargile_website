"use client";

/* Les quatre étapes, sur le rail animé de la homepage.
 *
 * V2, 06/08/2026 (choix de Mihai) : remplace quatre colonnes à filet haut. Le
 * traitement vient de homepage/v2/mvp-promo — rail qui se remplit au scroll,
 * points qui s'allument quand le front du remplissage les atteint. Même
 * mécanique, quatre étapes au lieu de trois.
 *
 * ── POURQUOI LE RAIL EST LÉGITIME ICI ────────────────────────────────────
 * Un rail affirme un ordre. Audit → technique → contenu → mesure en est un
 * vrai : rien ne se corrige avant l'état des lieux, rien ne se mesure avant
 * d'exister. C'est aussi la seule section de cette page où l'ordre est réel —
 * les quatre livrables de /services/applications-web ont perdu leurs numéros
 * pour la raison inverse (web/deliverables.jsx). Les numéraux restent donc, et
 * ils prennent la place que la homepage donne au libellé de semaine.
 *
 * ── LE RAIL EST LE MOMENT SIGNATURE DE LA PAGE ───────────────────────────
 * Budget de mouvement : un seul par page (docs/m5-immersive-design-concepts.md
 * §0.3). C'est celui-ci. Le compteur des scores plus bas est une île déjà
 * admise ailleurs sur le site ; rien d'autre ne doit bouger sur /geo.
 *
 * HARG-302 : la section ouvre toujours la page après le hero. Le fil imposé
 * pour /geo (Contenu → Architecture → Source → Moteur de réponse) décrit ce
 * que les sections suivantes prouvent une à une ; ce rail décrit d'abord
 * comment on y arrive, donc il reste devant plutôt que d'être annexé à
 * l'étape « Contenu » qu'il ne fait que traverser.
 *
 * Le rail passe à la verticale sous 1100px, et non 640px comme sur la
 * homepage : à quatre colonnes, la fenêtre où la grille se replie en deux
 * rangs laisserait le rail horizontal flotter au-dessus d'un second rang qui
 * ne le touche pas. Le seuil doit rester synchronisé avec le @media de
 * process.module.scss. */

import {useRef} from "react";
import {motion, useTransform} from "motion/react";
import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import {railFillStyle, useRailFill} from "@/components/pages/services/v2/shared/use-rail-fill";
import styles from "./process.module.scss";

/* 14/09/2026 (docs/PAGE-GEO-SEO-refonte.md) : chaque étape porte deux lignes,
   Système / Nous, pour qu'un lecteur pressé lise les icônes et sache ce qui
   est automatisé. Contenu inverse l'ordre : « Nous » d'abord, « Système :
   rien » ensuite, parce que c'est la phrase qui compte. */
const STEPS = [
    {key: "audit", num: "01", lines: ["system", "us"]},
    {key: "tech", num: "02", lines: ["system", "us"]},
    {key: "content", num: "03", lines: ["system", "us"]},
    {key: "measure", num: "04", lines: ["system", "us"]},
];

/* Engrenage et main, 14px, trait 1.5 : la même famille de trait que les
   filets. Pas de bibliothèque d'icônes pour deux glyphes. */
const ICONS = {
    system: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>
        </svg>
    ),
    us: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 11V6a1.5 1.5 0 013 0v5M10 10V4.5a1.5 1.5 0 013 0V11M13 10.5V6a1.5 1.5 0 013 0v6M16 12V9.5a1.5 1.5 0 013 0V15a6 6 0 01-6 6h-1.5a6 6 0 01-4.8-2.4L4 15.2a1.6 1.6 0 012.4-2.1L7 14"/>
        </svg>
    ),
};

const Step = ({step, i, fill, reveal, t}) => {
    /* Où le front du remplissage atteint ce point : les points sont au départ
       de chacune des quatre pistes égales, en grille comme en colonne. */
    const at = i / STEPS.length;
    const ignite = useTransform(fill, [at, at + 0.1], [0, 1]);
    const dotOpacity = useTransform(ignite, [0, 1], [0.25, 1]);
    const dotScale = useTransform(ignite, [0, 1], [0.6, 1]);
    const numOpacity = useTransform(ignite, [0, 1], [0.4, 1]);

    return (
        <div className={styles.step} {...reveal(1 + i)}>
            <motion.div className={styles.dot} style={{opacity: dotOpacity, scale: dotScale}}/>
            <div className={styles.stepBody}>
                {/* aria-hidden : l'ordre est déjà porté par l'ordre du DOM. */}
                <motion.div className={styles.num} style={{opacity: numOpacity}} aria-hidden="true">
                    {step.num}
                </motion.div>
                <h3 className={`${section.blockHeading} ${styles.stepTitle}`}>{t(`steps.${step.key}.title`)}</h3>
                <p className={styles.stepText}>{t(`steps.${step.key}.text`)}</p>
                <ul className={styles.who}>
                    {step.lines.map((who) => (
                        <li key={who} className={styles.whoLine}>
                            <span className={styles.whoIcon}>{ICONS[who]}</span>
                            <span className={styles.whoText}>
                                <span className={styles.whoLabel}>{t(`${who}Label`)}</span>
                                {" "}
                                {t(`steps.${step.key}.${who}`)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const Process = () => {
    const t = useTranslations("pages.services.detail.seo.process");
    const reveal = useReveal();
    const timelineRef = useRef(null);
    /* Le rail se remplit pendant que la section traverse l'écran ; mécanique
       partagée avec approval.jsx, voir shared/use-rail-fill.js. */
    const {fill, vertical} = useRailFill(timelineRef);

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={section.heading} {...reveal(0)}>{t("title")}</h2>
                <p className={section.lead} {...reveal(0)}>{t("lead")}</p>

                <div className={styles.timeline} ref={timelineRef}>
                    <div className={styles.rail} aria-hidden="true">
                        <motion.div className={styles.railFill} style={railFillStyle(fill, vertical)}/>
                    </div>
                    <div className={styles.steps}>
                        {STEPS.map((step, i) => (
                            <Step key={step.key} step={step} i={i} fill={fill} reveal={reveal} t={t}/>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Process;

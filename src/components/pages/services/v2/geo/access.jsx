"use client";

/* Vos accès.
 *
 * V2, 18/09/2026 (Mihai : « beaucoup de texte, il faut alléger », références
 * ClickUp et SpinX) : un bento suisse. Des cellules à filets partagés, chacune
 * avec un libellé mono en capitales, une phrase, et un objet qui montre la
 * garantie au lieu de la redire : le champ masqué du coffre, trois lignes du
 * journal de lecture (ses colonnes sont « qui, quand, pour quoi »), le message
 * d'arrêt et l'état qui le suit. Le lead de trois phrases a sauté : sa première
 * phrase est devenue l'énoncé du bloc plein, les deux autres vivent dans les
 * cellules.
 *
 * Un seul accent, et il veut dire quelque chose : l'aplat est sur le coffre,
 * la garantie dont dépendent les deux autres. Même famille que le bloc de la
 * question dans geo-answer.
 *
 * Les deux régimes de plateformes remplacent le paragraphe « plateformes » et
 * les quatre cartouches : deux cellules, les CMS dedans en typographie, jamais
 * de logos tiers redessinés. `access.platforms` et les `cms.*.note` restent
 * dans fr/en.json, non lus.
 *
 * Les objets sont aria-hidden : libellé et phrase disent tout en prose. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./access.module.scss";

const REGIMES = [
    {key: "auto", cms: ["wordpress", "shopify"]},
    {key: "manual", cms: ["webflow", "custom"]},
];

const Access = () => {
    const t = useTranslations("pages.services.detail.seo.access");
    const reveal = useReveal();
    const log = t.raw("log");
    const revoke = t.raw("revoke");

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={section.heading} {...reveal(0)}>{t("title")}</h2>

                <div className={`${section.grid12} ${styles.bento}`}>
                    {/* Le bloc plein : la garantie première, en corps d'affiche. */}
                    <div className={styles.vault} {...reveal(1)}>
                        <p className={styles.label}>{t("items.vault.title")}</p>
                        <p className={styles.statement}>{t("text")}</p>
                        <p className={styles.secret} aria-hidden="true">
                            <span>{t("vaultField")}</span>
                            <span className={styles.dots}>••••••••••••••••</span>
                        </p>
                    </div>

                    <div className={styles.log} {...reveal(2)}>
                        <p className={styles.label}>{t("items.log.title")}</p>
                        <p className={styles.text}>{t("items.log.text")}</p>
                        <div className={styles.journal} aria-hidden="true">
                            <div className={styles.journalHead}>
                                {log.head.map((h) => <span key={h}>{h}</span>)}
                            </div>
                            {log.rows.map((row) => (
                                <div key={row.join()} className={styles.journalRow}>
                                    {row.map((cell) => <span key={cell}>{cell}</span>)}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.revoke} {...reveal(3)}>
                        <p className={styles.label}>{t("items.revoke.title")}</p>
                        <p className={styles.text}>{t("items.revoke.text")}</p>
                        <div className={styles.stop} aria-hidden="true">
                            <p className={styles.message}>{revoke.message}</p>
                            <dl className={styles.status}>
                                {revoke.status.map(([k, v]) => (
                                    <div key={k}>
                                        <dt>{k}</dt>
                                        <dd>{v}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>

                    {REGIMES.map(({key, cms}, i) => (
                        <div key={key} className={styles.regime} {...reveal(4 + i)}>
                            <p className={styles.label}>{t(`regimes.${key}.label`)}</p>
                            <p className={styles.cms}>
                                {cms.map((c) => <span key={c}>{t(`cms.${c}.name`)}</span>)}
                            </p>
                            <p className={styles.text}>{t(`regimes.${key}.text`)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Access;

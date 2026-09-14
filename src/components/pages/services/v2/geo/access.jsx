"use client";

/* Vos accès. 14/09/2026 (docs/PAGE-GEO-SEO-refonte.md §5) : trois
   pictogrammes en ligne (coffre, journal, interrupteur), puis les deux CMS
   pris en charge. Les CMS sont des cartouches typographiques, pas des logos
   redessinés : un logo tiers reproduit à la main en SVG ne serait ni fidèle
   ni à nous. Pictos en trait 1.5, même famille que ceux de process. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./access.module.scss";

const ICONS = {
    vault: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="4" y="10" width="16" height="11" rx="2"/>
            <path d="M8 10V7a4 4 0 018 0v3"/>
            <circle cx="12" cy="15.5" r="1.5"/>
        </svg>
    ),
    log: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 3h9l4 4v14H6z"/>
            <path d="M15 3v4h4M9 12h6M9 16h6"/>
        </svg>
    ),
    revoke: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="8" width="18" height="8" rx="4"/>
            <circle cx="8" cy="12" r="2.5"/>
        </svg>
    ),
};

const ITEMS = ["vault", "log", "revoke"];

const Access = () => {
    const t = useTranslations("pages.services.detail.seo.access");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={section.heading} {...reveal(0)}>{t("title")}</h2>
                <p className={`${section.lead} ${styles.lead}`} {...reveal(1)}>{t("text")}</p>

                <ul className={styles.items}>
                    {ITEMS.map((key, i) => (
                        <li key={key} className={styles.item} {...reveal(2 + i)}>
                            <span className={styles.icon}>{ICONS[key]}</span>
                            <h3 className={styles.itemTitle}>{t(`items.${key}.title`)}</h3>
                            <p className={styles.itemText}>{t(`items.${key}.text`)}</p>
                        </li>
                    ))}
                </ul>

                <div className={styles.platforms} {...reveal(5)}>
                    <p className={styles.platformsText}>{t("platforms")}</p>
                    <ul className={styles.cms} aria-hidden="true">
                        {["wordpress", "shopify", "webflow", "custom"].map((key) => (
                            <li key={key} className={styles.cmsCard}>
                                <span className={styles.cmsName}>{t(`cms.${key}.name`)}</span>
                                <span className={styles.cmsNote}>{t(`cms.${key}.note`)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Access;

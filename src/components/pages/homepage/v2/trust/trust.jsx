"use client";

import {useTranslations} from "next-intl";
import section from "../v2-section.module.scss";
import styles from "./trust.module.scss";
import {useReveal} from "../useReveal";

/* Trust strip: a light band between the verticals grid and the audit CTA.
   No logo assets exist in the repo, so clients are named as plain text
   wordmarks rather than images. */

// Future GEO clients are appended here as they sign.
const CLIENTS = ["Wami Grooming"];

const Trust = () => {
    const t = useTranslations("pages.homepage.sections.trust");
    const reveal = useReveal();

    return (
        <section className={styles.section} aria-labelledby="trust-heading">
            <div className={section.container}>
                <div className={styles.band}>
                    <h2 id="trust-heading" className={styles.heading} {...reveal(0)}>
                        {t("title")}
                    </h2>
                    <ul className={styles.list} {...reveal(1)}>
                        {CLIENTS.map((name) => (
                            <li key={name} className={styles.name}>{name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Trust;

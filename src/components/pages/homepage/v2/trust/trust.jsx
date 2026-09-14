"use client";

import Image from "next/image";
import {useTranslations} from "next-intl";
import section from "../v2-section.module.scss";
import styles from "./trust.module.scss";
import {useReveal} from "../useReveal";

// Future GEO clients are appended here as they sign.
const CLIENTS = [
    {
        name: "Wami Grooming",
        logo: "/images/partners/Wami_Logo.png",
        width: 198,
        height: 46,
        url: "https://wamigrooming.be",
    },
];

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
                        {CLIENTS.map((client) => (
                            <li key={client.name} className={styles.logoItem}>
                                <a
                                    href={client.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.logoLink}
                                    aria-label={client.name}
                                >
                                    <Image
                                        src={client.logo}
                                        alt={client.name}
                                        width={client.width}
                                        height={client.height}
                                        className={styles.logo}
                                    />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Trust;

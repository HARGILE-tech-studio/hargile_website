"use client";

import {useTranslations} from "next-intl";
import CtaLink from "@/components/ui/cta-link/cta-link";
import styles from "./hero.module.scss";
import HeroBackdrop from "./backdrops/hero-backdrop";

/* The hero backdrop is the wave grid, at every width and with no branch left to
   resolve — chosen over cubes and colour bends after comparing them side by
   side, then made the only one (see hero-backdrop.jsx).

   Two things follow from there being no variant, and both are why the branching
   is gone rather than merely unused:

   - There used to be a *viewport* branch — cubes above 1024px, colour bends
     below — which meant two unrelated designs on one page: a lattice on desktop,
     a drifting gradient on a phone. The wave grid answers that split inside
     itself (a live canvas on desktop, its own exported still below 1024px), so
     the design is the same everywhere and only the frame rate changes.
   - The layout is known during render rather than after an effect, which is what
     makes the capability rail server-renderable. That mattered: the rail was
     desktop-only before, so its motion.* reveals never reached the SSR HTML.
     Now they would have, complete with inline `opacity: 0` — the same defect the
     h1 and the old glass cards were each fixed for. They are CSS keyframes
     instead. */

const HeroV2 = () => {
    const t = useTranslations("pages.homepage.sections.hero.v2");

    return (
        <section className={styles.section}>
            <HeroBackdrop/>

            <div className={styles.container}>
                {/* The copy reveals are CSS keyframes (hero.module.scss), not
                    motion.*: a serialized `opacity:0` initial state kept the h1
                    out of the SSR HTML's paint until hydration — LCP waited on
                    the whole JS chain, and AI crawlers read a transparent
                    headline. CSS starts at first style resolution instead. */}
                <div className={styles.copy}>
                    <p className={styles.eyebrow}>
                        {t("eyebrow")}
                    </p>

                    <h1 className={styles.headline}>
                        {t("headline")}
                    </h1>

                    <p className={styles.paragraph}>
                        {t("paragraph")}
                    </p>

                    <div className={styles.ctaRow}>
                        <CtaLink href="/contact?audit=1" variant="primary">
                            {t("ctaAudit")}
                        </CtaLink>
                        <CtaLink href="/geo" variant="ghost">
                            {t("ctaWork")}
                        </CtaLink>
                    </div>

                    <ul className={styles.summary}>
                        {t.raw("summary").map((line) => (
                            <li key={line}>{line}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default HeroV2;

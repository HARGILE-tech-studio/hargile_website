"use client";

/* HARG-302 : fusion de /services/seo en une seule page GEO, à la racine.
 *
 * Il n'existe pas de page GEO séparée à fusionner — le GEO et le SEO étaient
 * déjà une seule page sous /services/seo, avec deux entrées dans les listes
 * d'offres pointant vers la même URL. Cette page devient LA page GEO ; le SEO
 * y reste comme fondation du GEO plutôt que comme offre concurrente (voir
 * measures.jsx et geo-answer.jsx pour cet argument, inchangé).
 *
 * Le fil conducteur imposé pour l'ordre des sections : Contenu → Architecture
 * → Source → Moteur de réponse (IA) → clôture. Mappé sur les sections
 * existantes (rien de neuf, juste redécoupé et repositionné) :
 *
 *   1. Process     → le rail reste la section signature de la page (voir son
 *      en-tête) : audit, technique, CONTENU, mesure. Elle ouvre la page
 *      parce qu'elle est la méthode dans son ensemble, pas une des quatre
 *      étapes du fil — le fil décrit ce que les sections suivantes prouvent
 *      une à une, la page décrit d'abord comment on y arrive.
 *   2. MetaProof    → retitrée "Architecture & source". Ses quatre points se
 *      lisaient déjà en deux moitiés : hreflang + schema.org (structurel =
 *      Architecture) puis "tout est dans le HTML" + l'invitation à voir la
 *      source (Source). Les séparer aurait cassé le mécanisme de renvois
 *      numérotés vers l'extrait de code (src/data/seo-source-excerpt.js) qui
 *      lie les quatre points à des lignes précises — un seul bloc de preuve,
 *      donc les deux titres du fil sur une seule section.
 *   3. MeasuredProof → reste collée à Architecture & source : les scores
 *      Lighthouse sont la preuve chiffrée de la même page, au même endroit
 *      que la preuve par le code. Measured-proof.jsx documente pourquoi ses
 *      Core Web Vitals restent masqués.
 *   4. GeoAnswer    → "Moteur de réponse (IA)", section reine du GEO. Titre
 *      déjà au dégradé identitaire (voir son en-tête) : rien à changer, sa
 *      place dans l'ordre suffit à la mettre en avant.
 *   5. Measures     → clôture, après le moteur de réponse : ce qu'on mesure,
 *      et le refus de garantir une citation ou un classement.
 *
 * SiblingOffers a disparu : il n'existe plus qu'une seule offre (GEO), donc
 * "les autres offres" n'a plus de sens à une seule alternative — voir
 * sibling-offers.jsx, qui documente pourquoi il ne route plus que vers /geo
 * elle-même et pourquoi cette page ne l'appelle plus. */

import {useTranslations} from "next-intl";
import PosterHero from "@/components/pages/services/v2/shared/poster-hero";
import Process from "@/components/pages/services/v2/geo/process";
import MetaProof from "@/components/pages/services/v2/geo/meta-proof";
import MeasuredProof from "@/components/pages/services/v2/geo/measured-proof";
import GeoAnswer from "@/components/pages/services/v2/geo/geo-answer";
import Measures from "@/components/pages/services/v2/geo/measures";
import MiniFaq from "@/components/pages/services/v2/shared/mini-faq";
import CtaBand from "@/components/pages/services/v2/shared/cta-band";
import WaveGridBackdrop from "@/components/pages/services/v2/shared/wave-grid-backdrop";

export default function GeoClient() {
    const t = useTranslations("pages.services.detail.seo.hero");

    return (
        <>
            <PosterHero
                /* The hub pages' poster hero, now shared by all four detail
                   pages: same box, no eyebrow, no aside — the argument for each
                   of those is in poster-hero.jsx and holds for all six. The
                   eyebrow key stays in the messages files; this is a layout
                   call, not a copy deletion.

                   The composition below is the only thing that differs between
                   the six backdrops. Changing this number means exporting all
                   three of its frames first (docs/wave-grid.md). */
                title={t("title")}
                answer={t("answer")}
                backdrop={<WaveGridBackdrop composition="wave-188"/>}
            />
            <Process/>
            <MetaProof/>
            {/* Straight after MetaProof, which makes the claims this section
                then puts numbers on. Figures live in src/data/site-metrics.js
                and carry their measurement date — re-measure after any deploy
                that touches this page. */}
            <MeasuredProof/>
            {/* The three build on each other: MetaProof demonstrates the
                technique on this page, GeoAnswer says what it is as an offer,
                Measures says how we are held to it. The VENIZI proof case stays
                on disk with its copy (shared/proof-case.jsx) — one line brings
                it back if the page ever wants a client site again. */}
            <GeoAnswer/>
            <Measures/>
            <MiniFaq namespace="pages.services.detail.seo.faq"/>
            <CtaBand/>
        </>
    );
}

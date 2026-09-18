"use client";

/* HARG-302 : fusion de /services/seo en une seule page GEO, à la racine.
 *
 * Il n'existe pas de page GEO séparée à fusionner — le GEO et le SEO étaient
 * déjà une seule page sous /services/seo, avec deux entrées dans les listes
 * d'offres pointant vers la même URL. Cette page devient LA page GEO ; le SEO
 * y reste comme fondation du GEO plutôt que comme offre concurrente (voir
 * measures.jsx et geo-answer.jsx pour cet argument, inchangé).
 *
 * 14/09/2026 (Mihai) : le GEO doit passer en premier dans toute la page, pas
 * seulement dans le titre. La première version suivait le fil Contenu →
 * Architecture → Source → Moteur de réponse (IA) dans cet ordre littéral, ce
 * qui mettait le moteur de réponse — la section GEO elle-même — en quatrième
 * position, après trois sections à dominante SEO (méthode, structure,
 * scores). Le fil reste vrai comme *argument* (on ne peut pas prouver qu'on
 * est cité sans d'abord montrer le contenu et l'architecture qui le rendent
 * possible), mais comme *ordre de lecture* il enterrait le GEO. Le hero le
 * dit maintenant aussi (IA citée avant Google dans hero.answer) — la page
 * suit :
 *
 *   1. GeoAnswer    → "Moteur de réponse (IA)" ouvre la page, juste après le
 *      hero. C'est l'offre : être cité par les IA. Le schéma page→moteur→
 *      réponse est le premier argument qu'un visiteur voit, pas le dernier.
 *   2. Process      → la méthode qui rend ça possible (audit, technique,
 *      CONTENU, mesure). Reste la section signature (rail animé, voir son
 *      en-tête) — elle explique comment, une fois que GeoAnswer a dit quoi.
 *   3. MetaProof    → "Architecture & source". Preuve structurelle : cette
 *      page applique elle-même ce qui vient d'être promis.
 *   4. MeasuredProof → collée à Architecture & source, preuve chiffrée de la
 *      même page (Lighthouse).
 *   5. Measures     → clôture : ce qu'on mesure, et le refus de garantir une
 *      citation ou un classement.
 *
 * 14/09/2026, refonte (docs/PAGE-GEO-SEO-refonte.md) : deux sections
 * s'insèrent entre Process et MetaProof. Access (« Vos accès ») et Approval
 * (« Rien n'est écrit sur votre site sans votre accord ») décrivent le pilote
 * tel qu'il tourne : où vivent les identifiants, ce qu'il propose, qui décide.
 * Elles viennent juste après la méthode parce qu'elles en sont la condition de
 * confiance, et avant la preuve par la source qui reste le bloc le plus honnête
 * de la page. Le CTA final reçoit son propre texte.
 *
 * Access passe entre les deux (Mihai, 14/09/2026) : Process et Approval portent
 * tous deux le rail vertical, et adjacents ils donnaient deux fois le même
 * dessin. Les pictos d'Access coupent la répétition.
 *
 * 18/09/2026 : Approval n'a plus de rail et Access n'a plus de pictos. Access,
 * Approval, MetaProof et Measures partagent une grammaire, le « bento suisse »
 * (docs/geo-swiss-design-plan.md §7) ; l'ordre des sections ne change pas.
 *
 * SiblingOffers a disparu : il n'existe plus qu'une seule offre (GEO), donc
 * "les autres offres" n'a plus de sens à une seule alternative — voir
 * sibling-offers.jsx, qui documente pourquoi il ne route plus que vers /geo
 * elle-même et pourquoi cette page ne l'appelle plus. */

import {useTranslations} from "next-intl";
import PosterHero from "@/components/pages/services/v2/shared/poster-hero";
import Process from "@/components/pages/services/v2/geo/process";
import Approval from "@/components/pages/services/v2/geo/approval";
import Access from "@/components/pages/services/v2/geo/access";
import MetaProof from "@/components/pages/services/v2/geo/meta-proof";
import MeasuredProof from "@/components/pages/services/v2/geo/measured-proof";
import GeoAnswer from "@/components/pages/services/v2/geo/geo-answer";
import Measures from "@/components/pages/services/v2/geo/measures";
import MiniFaq from "@/components/pages/services/v2/shared/mini-faq";
import CtaBand from "@/components/pages/services/v2/shared/cta-band";
import WaveGridBackdrop from "@/components/pages/services/v2/shared/wave-grid-backdrop";

export default function GeoClient() {
    const t = useTranslations("pages.services.detail.seo.hero");
    const cta = useTranslations("pages.services.detail.seo.cta");

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
            {/* GEO first: the offer (être cité par les IA), right after the
                hero, ahead of the SEO-flavoured sections below. See the
                14/09/2026 note at the top of this file. */}
            <GeoAnswer/>
            <Process/>
            <Access/>
            <Approval/>
            <MetaProof/>
            {/* Straight after MetaProof, which makes the claims this section
                then puts numbers on. Figures live in src/data/site-metrics.js
                and carry their measurement date — re-measure after any deploy
                that touches this page. */}
            <MeasuredProof/>
            <Measures/>
            <MiniFaq namespace="pages.services.detail.seo.faq"/>
            <CtaBand text={cta("text")} href="/contact?audit=1"/>
        </>
    );
}

/* The wave grid behind the blog index header.

   Deliberately NOT wave-grid-backdrop.jsx from services/v2/shared. That one
   serves the six M4 poster heroes and its own header comment draws the line:
   its quiet zone, mask and 860px band edges are correct for poster-hero's
   100svh copy geometry and "a composition is only portable between pages whose
   copy sits in the same place". This header is shorter and its copy sits
   top-left with the ledger starting under it, so the falloff has to be shaped
   for that instead.

   What IS shared is the artwork: the same exported wave-97 frames the blog
   index already used through PosterHero, including the phone and tablet
   reframes. No new export, no three.js — the live WebGL path exists only to
   produce those files (scripts/export-wave-grid.mjs drives /services), so
   there is nothing here to render live and no client boundary: this is a
   server component, and the frame is in the SSR HTML.

   ⚠️ If the header's copy geometry changes, this layer's mask is what needs
   re-tuning, not the frames. */

import styles from "./blog-index-backdrop.module.scss";

const DIR = "/images/wave-grid";
const FRAMES = {wide: "wave-97", phone: "wave-97-phone", tablet: "wave-97-tablet"};

/* The same band edges the exports were framed for. */
const PHONE_MAX = 640;
const TABLET_MAX = 860;

const BlogIndexBackdrop = () => (
    <div className={styles.backdrop} aria-hidden="true">
        <picture>
            {/* Phone first: <picture> takes the first matching <source>. */}
            <source media={`(max-width: ${PHONE_MAX}px)`} srcSet={`${DIR}/${FRAMES.phone}.avif`} type="image/avif"/>
            <source media={`(max-width: ${PHONE_MAX}px)`} srcSet={`${DIR}/${FRAMES.phone}.webp`} type="image/webp"/>
            <source media={`(max-width: ${TABLET_MAX}px)`} srcSet={`${DIR}/${FRAMES.tablet}.avif`} type="image/avif"/>
            <source media={`(max-width: ${TABLET_MAX}px)`} srcSet={`${DIR}/${FRAMES.tablet}.webp`} type="image/webp"/>
            {/* AVIF first, WebP fallback — browserslist allows edge >= 111 and
                Edge only shipped AVIF in 121. */}
            <source srcSet={`${DIR}/${FRAMES.wide}.avif`} type="image/avif"/>
            <img
                className={styles.still}
                src={`${DIR}/${FRAMES.wide}.webp`}
                alt=""
                width={2560}
                height={1600}
                decoding="async"
                /* Largest thing above the fold and the likely LCP element. */
                fetchPriority="high"
            />
        </picture>
    </div>
);

export default BlogIndexBackdrop;

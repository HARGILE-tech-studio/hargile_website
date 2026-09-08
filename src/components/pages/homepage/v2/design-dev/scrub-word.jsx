"use client";

import {motion, useTransform} from "motion/react";

/* Dim end of the scrub. The words are #ededed on the section's #080c16 ground:
   below 0.37 the composited text drops under the 3:1 WCAG AA asks for large
   text (the manifesto is 24px at its smallest, so 18pt), axe-core fails
   color-contrast, and that is what sank the Lighthouse CI job. 0.38 keeps a
   margin (3.18:1) and still leaves the dim-to-bright travel that carries the
   effect. Do not lower it without recomputing the ratio. */
const SCRUB_FLOOR = 0.38;

/**
 * One word of scroll-scrubbed text: brightens from dim to full as the shared
 * scroll progress crosses its [start, end] slice. Collapses to static text
 * under reduced motion.
 */
const ScrubWord = ({word, progress, start, end, reduced, className}) => {
    const opacity = useTransform(progress, [start, end], [SCRUB_FLOOR, 1]);
    return (
        <motion.span className={className} style={reduced ? undefined : {opacity}}>
            {word}{" "}
        </motion.span>
    );
};

export default ScrubWord;

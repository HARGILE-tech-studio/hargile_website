"use client";

/* Le rail qui se remplit au scroll, partagé par geo/process et geo/approval.
   Sorti de process.jsx le 14/09/2026 quand le parcours d'une proposition a
   pris la même animation : même offsets, même ressort, même seuil vertical.
   Les styles restent dans process.module.scss, importés par les deux.

   Retourne {fill, vertical} : `fill` est une MotionValue 0→1 (1 fixe en
   mouvement réduit), `vertical` suit le @media 1100px de process.module.scss. */

import {useEffect, useState} from "react";
import {useMotionValue, useReducedMotion, useScroll, useSpring} from "motion/react";

export function useRailFill(targetRef) {
    const [vertical, setVertical] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 1100px)");
        const sync = () => setVertical(mq.matches);
        sync();
        mq.addEventListener("change", sync);
        return () => mq.removeEventListener("change", sync);
    }, []);

    const reducedMotion = useReducedMotion();
    const {scrollYProgress} = useScroll({
        target: targetRef,
        offset: ["start 0.85", "end 0.5"],
    });
    const fillSpring = useSpring(scrollYProgress, {stiffness: 90, damping: 24, mass: 0.4});
    const staticFull = useMotionValue(1);

    return {fill: reducedMotion ? staticFull : fillSpring, vertical};
}

/* Le style inline du remplissage, selon l'orientation. */
export const railFillStyle = (fill, vertical) =>
    vertical
        ? {scaleY: fill, transformOrigin: "top"}
        : {scaleX: fill, transformOrigin: "left"};

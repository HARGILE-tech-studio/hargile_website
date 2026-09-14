"use client";

/* Le rail qui se remplit au scroll, partagé par geo/process et geo/approval.
   Sorti de process.jsx le 14/09/2026 quand le parcours d'une proposition a
   pris la même animation : même offsets, même ressort, même seuil vertical.
   Les styles restent dans process.module.scss, importés par les deux.

   Retourne {fill, vertical} : `fill` est une MotionValue 0→1 (1 fixe en
   mouvement réduit), `vertical` suit le @media 1100px de process.module.scss.

   alwaysVertical : approval affiche son parcours en colonne à toutes les
   largeurs, donc son rail est vertical même au-dessus de 1100px. */

import {useEffect, useState} from "react";
import {useMotionValue, useReducedMotion, useScroll, useSpring} from "motion/react";

export function useRailFill(targetRef, {alwaysVertical = false} = {}) {
    const [narrow, setNarrow] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 1100px)");
        const sync = () => setNarrow(mq.matches);
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

    return {fill: reducedMotion ? staticFull : fillSpring, vertical: alwaysVertical || narrow};
}

/* Le style inline du remplissage, selon l'orientation. */
export const railFillStyle = (fill, vertical) =>
    vertical
        ? {scaleY: fill, transformOrigin: "top"}
        : {scaleX: fill, transformOrigin: "left"};

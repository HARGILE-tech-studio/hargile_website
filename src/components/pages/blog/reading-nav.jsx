"use client";

/* The article's reading nav: its own sections, listed in the margin, with the
   one you are reading marked.

   Reference Mihai gave (21/09): tryprofound.com/blog — a short list beside the
   text, quiet, no numbering, no progress bar, the current section picked out.

   `headings` comes from getPost (headingsOf in src/lib/blog.js), so it is
   derived from the same HTML the body renders and its ids are the anchors
   actually in the document. The list is in the server HTML as plain links: a
   reader with no JS gets a working table of contents, and only the
   highlighting needs the client.

   The highlight is a rAF-throttled scroll listener, not an
   IntersectionObserver — see the comment on the effect for why the obvious
   choice is the wrong one here. */

import {useEffect, useState} from "react";
import styles from "./reading-nav.module.scss";

/* Where the "you are here" line sits: a heading becomes current once it has
   scrolled to within this many pixels of the top of the viewport, and stays
   current until the next one does. Clears the floating navbar. */
const MARK = 140;

const ReadingNav = ({headings, label}) => {
    const [activeId, setActiveId] = useState(null);

    useEffect(() => {
        if (headings.length === 0) return undefined;

        const nodes = headings
            .map(({id}) => document.getElementById(id))
            .filter(Boolean);
        if (nodes.length === 0) return undefined;

        /* The last heading whose top has passed the mark is the section being
           read; before the first one has, nothing is marked.

           An IntersectionObserver was tried first and is the wrong tool here:
           it only fires while a heading crosses its band, so once the reader
           is in the middle of a long section — no heading intersecting
           anything — the last event wins and that is whichever heading left
           the band, not the one above the text on screen. Reading positions
           answers the actual question, which is ordering, not visibility.

           rAF-throttled so a scroll burst costs one measurement per frame. */
        let frame = 0;
        const sync = () => {
            frame = 0;
            let current = null;
            for (const node of nodes) {
                if (node.getBoundingClientRect().top <= MARK) current = node.id;
                else break;
            }
            setActiveId(current);
        };
        const onScroll = () => {
            if (frame === 0) frame = requestAnimationFrame(sync);
        };

        sync();
        window.addEventListener("scroll", onScroll, {passive: true});
        window.addEventListener("resize", onScroll, {passive: true});
        return () => {
            if (frame !== 0) cancelAnimationFrame(frame);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <nav className={styles.nav} aria-label={label}>
            <p className={styles.label}>{label}</p>
            <ul className={styles.list}>
                {headings.map(({id, text}) => (
                    <li key={id}>
                        <a
                            href={`#${id}`}
                            className={`${styles.link} ${id === activeId ? styles.active : ""}`}
                            aria-current={id === activeId ? "true" : undefined}
                        >
                            {text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
export default ReadingNav;

"use client";

/* The blog index (V2, 21/09/2026).

   V1 repeated /geo's Access poster — offset flat, title crossing it in two
   colours — and Mihai's call was that the blog must not be a copy of the
   solution page's model. This is proposition A of three shown on 21/09, "le
   registre": a headline and its lead sitting on the wave grid, then the
   archive as a ledger of rows, date set in Outfit at display size rather than
   as a caption. The latest entry keeps a flat, but it starts on the title
   column and runs off the right edge of the screen — a band across the page,
   not a poster cell.

   The wave grid is here for the same reason it is on the other pages: this
   header is the top of a page, and every other top of a page on this site has
   the grid behind it. Its own component (blog-index-backdrop), NOT the M4
   poster-hero one: that backdrop's quiet zone, mask and band edges are tuned
   to poster-hero's exact 100svh copy geometry and its header comment is
   explicit that portability stops there. This header is a different shape —
   shorter, copy top-left, rows starting inside the same box — so it gets a
   layer shaped for that. Same exported frames (wave-97), different treatment.

   `posts` is the already-filtered, already-sorted metadata list from
   getAllPosts(locale) (see src/lib/blog.js), passed down from the server
   page.jsx: this component never touches the filesystem itself. */

import {useLocale, useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import BlogIndexBackdrop from "./blog-index-backdrop";
import styles from "./blog-index.module.scss";

/* The date set as two pieces: day.month big, year small beside it. Intl would
   give a localised string, but this is a typographic object rather than a
   sentence — the pieces are placed, not formatted. The article page still uses
   formatBlogDate for the prose form. */
const dateParts = (date) => {
    const [year, month, day] = date.split("-");
    return {day, month, year};
};

const BlogIndex = ({posts}) => {
    const t = useTranslations("pages.blog");
    const locale = useLocale();
    const reveal = useReveal();
    const [latest, ...rest] = posts;

    return (
        <>
            <header className={styles.head}>
                <BlogIndexBackdrop/>
                <div className={`${section.container} ${section.grid12} ${styles.headInner}`}>
                    <h1 className={styles.title}>{t("hero.title")}</h1>
                    <p className={styles.lead}>{t("hero.answer")}</p>
                </div>
            </header>

            <section className={`${section.section} ${section.sectionEnd} ${styles.archive}`}>
                <div className={section.container}>
                    {posts.length === 0 ? (
                        <p className={styles.empty} {...reveal(0)}>{t("empty")}</p>
                    ) : (
                        <ol className={styles.rows}>
                            <li className={`${section.grid12} ${styles.row} ${styles.first}`} {...reveal(0)}>
                                <p className={styles.date}>
                                    <time dateTime={latest.date}>
                                        {dateParts(latest.date).day}.{dateParts(latest.date).month}
                                        <span>{dateParts(latest.date).year}</span>
                                    </time>
                                </p>
                                <h2 className={styles.name}>
                                    <Link href={`/blog/${latest.slug}`} className={styles.link}>{latest.title}</Link>
                                </h2>
                                {latest.tags.length > 0 ? (
                                    <p className={styles.tags}>{latest.tags.join(" / ")}</p>
                                ) : null}
                                <p className={styles.desc}>{latest.description}</p>
                            </li>

                            {rest.map((post, i) => (
                                <li key={post.slug} className={`${section.grid12} ${styles.row}`} {...reveal(1 + i)}>
                                    <p className={styles.date}>
                                        <time dateTime={post.date}>
                                            {dateParts(post.date).day}.{dateParts(post.date).month}
                                            <span>{dateParts(post.date).year}</span>
                                        </time>
                                    </p>
                                    <h2 className={styles.name}>
                                        <Link href={`/blog/${post.slug}`} className={styles.link}>{post.title}</Link>
                                    </h2>
                                    {post.tags.length > 0 ? (
                                        <p className={styles.tags}>{post.tags.join(" / ")}</p>
                                    ) : null}
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
            </section>
        </>
    );
};

export default BlogIndex;

"use client";

/* The blog index list: one card per published post, title, description, date
   and tags. Modelled on offers-index.jsx: an <article> per row, the h2 carries
   the only link and its ::after is stretched over the whole card, so the card
   is one hit area and one focus stop rather than a title link plus a second
   "read more" link racing it for the same destination.

   `posts` is the already-filtered, already-sorted metadata list from
   getAllPosts(locale) (see src/lib/blog.js), passed down from the server
   page.jsx: this component never touches the filesystem itself. */

import {useLocale, useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import {formatBlogDate} from "@/lib/format-date";
import styles from "./blog-list.module.scss";

const BlogList = ({posts}) => {
    const t = useTranslations("pages.blog");
    const locale = useLocale();
    const reveal = useReveal();

    if (posts.length === 0) {
        return (
            <section className={section.section}>
                <div className={section.container}>
                    <p className={styles.empty} {...reveal(0)}>{t("empty")}</p>
                </div>
            </section>
        );
    }

    /* Same grammar as /geo's Access section: the latest post alone as a
       poster (offset flat, title crossing it in two colours), the older ones
       detached below in cells with shared hairlines. The closing cell keeps
       the grid's last row full while the archive is still short. */
    const [latest, ...rest] = posts;
    const meta = (post) => (
        <p className={styles.label}>
            <time dateTime={post.date}>{formatBlogDate(post.date, locale)}</time>
            {post.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </p>
    );

    return (
        <section className={section.section}>
            <div className={section.container}>
                <article className={styles.poster} {...reveal(0)}>
                    {meta(latest)}
                    <h2 className={styles.statement}>
                        <Link href={`/blog/${latest.slug}`} className={styles.link}>
                            {latest.title}
                        </Link>
                    </h2>
                    <p className={styles.posterNote}>{latest.description}</p>
                    <span className={styles.posterMore} aria-hidden="true">{t("readMore")}</span>
                </article>

                {rest.length === 0 ? null : (
                <ul className={`${section.grid12} ${styles.bento}`}>
                    {rest.map((post, i) => (
                        <li key={post.slug} className={styles.cell}>
                            <article className={styles.card} {...reveal(1 + i)}>
                                {meta(post)}
                                <h2 className={section.blockHeading}>
                                    <Link href={`/blog/${post.slug}`} className={styles.link}>
                                        {post.title}
                                    </Link>
                                </h2>
                                <p className={styles.text}>{post.description}</p>
                            </article>
                        </li>
                    ))}
                    {rest.length % 2 === 0 ? null : (
                        <li className={`${styles.cell} ${styles.next}`} {...reveal(1 + rest.length)}>
                            <p className={styles.label}>{t("next.label")}</p>
                            <p className={styles.text}>{t("next.text")}</p>
                        </li>
                    )}
                </ul>
                )}
            </div>
        </section>
    );
};

export default BlogList;

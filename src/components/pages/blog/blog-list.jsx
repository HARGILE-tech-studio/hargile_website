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

    return (
        <section className={section.section}>
            <div className={section.container}>
                <ul className={styles.list}>
                    {posts.map((post, i) => (
                        <li key={post.slug}>
                            <article className={styles.card} {...reveal(i)}>
                                <p className={styles.meta}>
                                    <time dateTime={post.date}>{formatBlogDate(post.date, locale)}</time>
                                    {post.tags.length > 0 && (
                                        <span className={styles.tags}>
                                            {post.tags.map((tag) => (
                                                <span className={styles.tag} key={tag}>{tag}</span>
                                            ))}
                                        </span>
                                    )}
                                </p>
                                <h2 className={styles.title}>
                                    <Link href={`/blog/${post.slug}`} className={styles.link}>
                                        {post.title}
                                    </Link>
                                </h2>
                                <p className={styles.description}>{post.description}</p>
                                <span className={styles.readMore} aria-hidden="true">{t("readMore")}</span>
                            </article>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default BlogList;

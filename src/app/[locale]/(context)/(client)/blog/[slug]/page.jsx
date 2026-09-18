import {notFound} from "next/navigation";
import {getTranslations} from "next-intl/server";
import {getAllSlugs, getAvailableLocales, getPost} from "@/lib/blog";
import {routing} from "@/i18n/routing";
import {generateContentMetadata} from "@/seo/generate-page-metadata";
import {buildBlogPostJsonLd} from "@/seo/build-json-ld";
import JsonLd from "@/components/seo/JsonLd";
import PosterHero from "@/components/pages/services/v2/shared/poster-hero";
import WaveGridBackdrop from "@/components/pages/services/v2/shared/wave-grid-backdrop";
import {formatBlogDate} from "@/lib/format-date";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import styles from "./blog-post.module.scss";

/* Locales x slugs that exist IN that locale, not a cross join of every locale
   against the union of all slugs. getAllSlugs(locale), not getPostSlugs, on
   purpose: this includes drafts (see the comment on getAllSlugs in
   src/lib/blog.js) so the build always has at least one static param to
   prerender, which Next's Cache Components require. A draft slug still
   renders to a static notFound() below, it is never listed or linked to. */
export function generateStaticParams() {
    return routing.locales.flatMap((locale) =>
        getAllSlugs(locale).map((slug) => ({locale, slug}))
    );
}

/* Unlike the static M4 pages, an article's metadata depends on its own
   content (title, description, dates), which only exists once `slug` is
   resolved, so params is awaited here rather than handed through unread. */
export async function generateMetadata({params}) {
    const {locale, slug} = await params;
    const post = getPost(locale, slug);
    if (!post) return {};

    return generateContentMetadata({
        locale,
        pathSuffix: `/blog/${slug}`,
        title: post.title,
        description: post.description,
        availableLocales: getAvailableLocales(slug),
    });
}

export default async function BlogPostPage({params}) {
    const {locale, slug} = await params;
    const post = getPost(locale, slug);
    if (!post) notFound();

    const availableLocales = getAvailableLocales(slug);
    const jsonLd = await buildBlogPostJsonLd({locale, post, availableLocales});
    const t = await getTranslations({locale, namespace: "pages.blog"});

    return (
        <>
            {jsonLd ? <JsonLd data={jsonLd}/> : null}
            <PosterHero
                title={post.title}
                answer={post.description}
                /* wave-312: exported, unused elsewhere (see BlogPageClient for
                   the sibling comment on wave-97): one frame for the article
                   template, shared by every post rather than the index. */
                backdrop={<WaveGridBackdrop composition="wave-312"/>}
            />
            <section className={section.section}>
                <div className={section.container}>
                    <p className={styles.meta}>
                        <span>{post.author}</span>
                        <span className={styles.metaSeparator} aria-hidden="true">/</span>
                        <span>
                            {t("publishedOn")} <time dateTime={post.date}>{formatBlogDate(post.date, locale)}</time>
                        </span>
                        {post.updated ? (
                            <>
                                <span className={styles.metaSeparator} aria-hidden="true">/</span>
                                <span>
                                    {t("updatedOn")}{" "}
                                    <time dateTime={post.updated}>{formatBlogDate(post.updated, locale)}</time>
                                </span>
                            </>
                        ) : null}
                    </p>

                    {post.tags.length > 0 ? (
                        <ul className={styles.tags}>
                            {post.tags.map((tag) => (
                                <li className={styles.tag} key={tag}>{tag}</li>
                            ))}
                        </ul>
                    ) : null}

                    {/*
                        This Markdown-derived HTML comes from our own repository
                        content (src/content/blog), authored by the Pancake
                        pipeline and reviewed by a human before merge, never
                        from a request at render time. That is the same trust
                        boundary as the rest of this site's own copy, which is
                        why rendering it via dangerouslySetInnerHTML is
                        acceptable here (see the matching comment in
                        src/lib/blog.js, where the HTML is produced). This
                        entire block is server-rendered, no client component
                        wraps it, so the article body is fully present in the
                        first HTML response for crawlers that never run JS.
                    */}
                    <div className={styles.prose} dangerouslySetInnerHTML={{__html: post.html}}/>
                </div>
            </section>
        </>
    );
}

import {notFound} from "next/navigation";
import {getTranslations} from "next-intl/server";
import {getAllSlugs, getAvailableLocales, getPost} from "@/lib/blog";
import {routing} from "@/i18n/routing";
import {Link} from "@/i18n/navigation";
import {generateContentMetadata} from "@/seo/generate-page-metadata";
import {buildBlogPostJsonLd} from "@/seo/build-json-ld";
import JsonLd from "@/components/seo/JsonLd";
import ReadingNav from "@/components/pages/blog/reading-nav";
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
    // ponytail: 200 words a minute over the rendered text, tags stripped.
    const minutes = Math.max(1, Math.round(post.html.replace(/<[^>]+>/g, " ").split(/\s+/).length / 200));

    return (
        <>
            {jsonLd ? <JsonLd data={jsonLd}/> : null}
            <PosterHero
                title={post.title}
                answer={post.description}
                /* wave-312: exported, unused elsewhere (see blog-index-backdrop
                   for the sibling comment on wave-97): one frame for the
                   article template, shared by every post rather than the
                   index. */
                backdrop={<WaveGridBackdrop composition="wave-312"/>}
            />
            <section className={`${section.section} ${section.sectionEnd}`}>
                <div className={section.container}>
                    {/* The byline sits above the article, across the measure,
                        rather than in the margin: who wrote this and when is
                        the first thing a reader checks on a piece about a
                        fast-moving subject, and the margin below is the
                        reading nav's. Reference: tryprofound.com/blog. */}
                    <div className={styles.byline}>
                        <Link href="/blog" className={styles.back}>{t("back")}</Link>
                        <p className={styles.bylineMeta}>
                            <span className={styles.author}>{post.author}</span>
                            <span aria-hidden="true">/</span>
                            <time dateTime={post.date}>{formatBlogDate(post.date, locale)}</time>
                            <span aria-hidden="true">/</span>
                            <span>{t("readingTime", {minutes})}</span>
                            {post.updated ? (
                                <>
                                    <span aria-hidden="true">/</span>
                                    <span>
                                        {t("updatedOn")}{" "}
                                        <time dateTime={post.updated}>{formatBlogDate(post.updated, locale)}</time>
                                    </span>
                                </>
                            ) : null}
                        </p>
                        {post.tags.length > 0 ? (
                            <p className={styles.tags}>{post.tags.join(" / ")}</p>
                        ) : null}
                    </div>

                    <div className={section.grid12}>
                        {/* Sticky in its own column: the nav follows the read
                            without the article having to give up measure for
                            it. Its own component because the active-section
                            highlight needs the client; the list itself is in
                            the server HTML either way. */}
                        <aside className={styles.margin}>
                            <ReadingNav headings={post.headings} label={t("contents")}/>
                        </aside>

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
                </div>
            </section>
        </>
    );
}

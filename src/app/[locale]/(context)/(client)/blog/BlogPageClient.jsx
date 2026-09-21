"use client";

import {useTranslations} from "next-intl";
import BlogIndex from "@/components/pages/blog/blog-index";
import CtaBand from "@/components/pages/services/v2/shared/cta-band";

/* `posts` is fetched server-side (getAllPosts(locale) in page.jsx) and passed
   down as plain, already-serializable data: this client component never
   touches src/lib/blog.js or the filesystem itself.

   No PosterHero here since 21/09: the index carries its own header (title,
   lead and the wave grid behind them) because its copy geometry is not
   poster-hero's — see the header comment in blog-index.jsx. The article page
   still uses PosterHero. */
const BlogPageClient = ({posts}) => {
    const t = useTranslations("pages.blog");

    return (
        <>
            <BlogIndex posts={posts}/>
            <CtaBand secondary={{href: "/geo", label: t("ctaSecondary")}}/>
        </>
    );
};

export default BlogPageClient;

"use client";

import {useTranslations} from "next-intl";
import PosterHero from "@/components/pages/services/v2/shared/poster-hero";
import BlogList from "@/components/pages/blog/blog-list";
import CtaBand from "@/components/pages/services/v2/shared/cta-band";
import WaveGridBackdrop from "@/components/pages/services/v2/shared/wave-grid-backdrop";

/* `posts` is fetched server-side (getAllPosts(locale) in page.jsx) and passed
   down as plain, already-serializable data: this client component never
   touches src/lib/blog.js or the filesystem itself. */
const BlogPageClient = ({posts}) => {
    const t = useTranslations("pages.blog");

    return (
        <>
            <PosterHero
                title={t("hero.title")}
                answer={t("hero.answer")}
                /* wave-97: exported, unused elsewhere (services hub takes the
                   default wave-7, faq wave-70, the two service pages wave-142
                   and wave-188), the blog index gets its own frame rather
                   than repeating a sibling page's. */
                backdrop={<WaveGridBackdrop composition="wave-97"/>}
            />
            <BlogList posts={posts}/>
            <CtaBand secondary={{href: "/services", label: t("ctaSecondary")}}/>
        </>
    );
};

export default BlogPageClient;

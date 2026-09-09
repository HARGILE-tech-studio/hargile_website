import {getAllPosts} from "@/lib/blog";
import BlogPageClient from "@/app/[locale]/(context)/(client)/blog/BlogPageClient";
import {generatePageMetadata} from "@/seo/generate-page-metadata";
import JsonLdForPage from "@/components/seo/JsonLdForPage";

export async function generateMetadata({params}) {
    return generatePageMetadata({params, pagePath: 'blog'});
}

/* Unlike the static M4 pages (faq, services), the index needs the actual post
   list for this locale before it can render, so `params` is awaited here
   rather than passed through unread as a Promise. JsonLdForPage still gets
   the Promise form: it awaits it itself, same as every other page.jsx. */
export default async function BlogPage({params}) {
    const {locale} = await params;
    const posts = getAllPosts(locale);

    return (
        <>
            <JsonLdForPage params={params} pagePath="blog"/>
            <BlogPageClient posts={posts}/>
        </>
    );
}

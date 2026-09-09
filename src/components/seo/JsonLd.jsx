// Server Component: renders a JSON-LD <script> tag inline.
// Doc: https://nextjs.org/docs/app/getting-started/metadata-and-og-images#json-ld
//
// The replace escapes "<" as the JSON string escape < before it reaches
// the HTML. JSON.stringify never produces a bare "<" outside a string value
// (JSON's own grammar has no use for the character), so this cannot corrupt
// the structure, and a parser reading the script's text as JSON decodes
// < back to "<" transparently. Without it, front-matter-derived text
// (an article's title or description, see src/seo/build-json-ld.js) that
// happens to contain the literal sequence "</script>" would close this tag
// early and let whatever follows run as HTML instead of staying inert JSON.
export default function JsonLd({data}) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{__html: JSON.stringify(data).replace(/</g, "\\u003c")}}
        />
    );
}

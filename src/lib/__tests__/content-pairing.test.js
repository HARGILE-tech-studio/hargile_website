import {describe, expect, it} from "vitest";
import fs from "node:fs";
import path from "node:path";

/* The real src/content/blog on disk, not a fixture.
 *
 * getAvailableLocales pairs an article across languages by FILENAME
 * (src/lib/blog.js): fr/<slug>.md and en/<slug>.md are the same article, and a
 * slug present on one side only silently publishes a mono-language article
 * with no hreflang alternate. Nothing throws, nothing warns — the article just
 * quietly stops advertising its translation, which is exactly the kind of SEO
 * regression nobody notices for months.
 *
 * So this test guards the real content, not a behaviour. It fails when a
 * translation is forgotten, which is the only moment it matters. */

const ROOT = path.join(process.cwd(), "src", "content", "blog");

const slugsIn = (locale) => {
    const dir = path.join(ROOT, locale);
    if (!fs.existsSync(dir)) return [];
    return fs
        .readdirSync(dir)
        .filter((name) => name.endsWith(".md"))
        .map((name) => name.replace(/\.md$/, ""));
};

/* The demo article shipped with the blog section: draft, French only, and it
 * exists so generateStaticParams always has one slug to prerender before any
 * real article lands. Delete this exemption with the file. */
const EXEMPT = new Set(["exemple-hors-ligne"]);

describe("blog content is paired across locales", () => {
    it("has an English counterpart for every French article", () => {
        const en = new Set(slugsIn("en"));
        const orphans = slugsIn("fr").filter((slug) => !EXEMPT.has(slug) && !en.has(slug));
        expect(orphans).toEqual([]);
    });

    it("has a French counterpart for every English article", () => {
        const fr = new Set(slugsIn("fr"));
        const orphans = slugsIn("en").filter((slug) => !EXEMPT.has(slug) && !fr.has(slug));
        expect(orphans).toEqual([]);
    });
});

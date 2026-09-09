import path from "node:path";
import {fileURLToPath} from "node:url";
import {afterEach, describe, expect, it, vi} from "vitest";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureRoot = (name) => path.join(dirname, "fixtures", name);

/* blog.js derives its content root from process.cwd() at module load time, so
   each scenario mocks cwd to a dedicated fixture directory and re-imports the
   module fresh (vi.resetModules) rather than mutating shared fixtures. */
async function loadBlogWithCwd(fixtureName) {
    vi.resetModules();
    vi.spyOn(process, "cwd").mockReturnValue(fixtureRoot(fixtureName));
    return import("@/lib/blog.js");
}

afterEach(() => {
    vi.restoreAllMocks();
});

describe("getAllPosts", () => {
    it("sorts posts by date, newest first", async () => {
        const {getAllPosts} = await loadBlogWithCwd("valid");
        const posts = getAllPosts("fr");
        expect(posts.map((p) => p.slug)).toEqual(["deuxieme-article", "premier-article"]);
    });

    it("excludes drafts", async () => {
        const {getAllPosts} = await loadBlogWithCwd("valid");
        const posts = getAllPosts("fr");
        expect(posts.some((p) => p.slug === "brouillon")).toBe(false);
    });

    it("returns metadata without the markdown body", async () => {
        const {getAllPosts} = await loadBlogWithCwd("valid");
        const [post] = getAllPosts("fr").filter((p) => p.slug === "deuxieme-article");
        expect(post).toMatchObject({
            title: "Deuxieme article",
            description: "Description du deuxieme article de test.",
            date: "2026-03-01",
            updated: "2026-03-15",
            author: "HARGILE",
            tags: ["test", "demo"],
            source: "pancake",
        });
        expect(post.content).toBeUndefined();
        expect(post.html).toBeUndefined();
    });

    it("returns an empty array when the content directory does not exist", async () => {
        const {getAllPosts} = await loadBlogWithCwd("empty");
        expect(getAllPosts("fr")).toEqual([]);
    });
});

describe("getPostSlugs", () => {
    it("excludes drafts from the slug list", async () => {
        const {getPostSlugs} = await loadBlogWithCwd("valid");
        expect(getPostSlugs("fr")).toEqual(["deuxieme-article", "premier-article"]);
    });
});

describe("getAllSlugs", () => {
    it("includes drafts, unlike getPostSlugs", async () => {
        const {getAllSlugs} = await loadBlogWithCwd("valid");
        expect(getAllSlugs("fr").sort()).toEqual(
            ["brouillon", "deuxieme-article", "premier-article"].sort()
        );
    });

    it("returns an empty array when the content directory does not exist", async () => {
        const {getAllSlugs} = await loadBlogWithCwd("empty");
        expect(getAllSlugs("fr")).toEqual([]);
    });
});

describe("getPost", () => {
    it("returns the post with its rendered HTML body", async () => {
        const {getPost} = await loadBlogWithCwd("valid");
        const post = getPost("fr", "deuxieme-article");
        expect(post).not.toBeNull();
        expect(post.title).toBe("Deuxieme article");
        expect(post.html).toContain("<strong>deuxieme</strong>");
    });

    it("returns null for a draft", async () => {
        const {getPost} = await loadBlogWithCwd("valid");
        expect(getPost("fr", "brouillon")).toBeNull();
    });

    it("returns null when the slug does not exist", async () => {
        const {getPost} = await loadBlogWithCwd("valid");
        expect(getPost("fr", "does-not-exist")).toBeNull();
    });

    it("returns null instead of throwing on a path traversal attempt", async () => {
        const {getPost} = await loadBlogWithCwd("valid");
        expect(getPost("fr", "../../secret")).toBeNull();
        expect(getPost("fr", "../../../etc/passwd")).toBeNull();
    });
});

describe("front matter validation", () => {
    it("throws an explicit error naming the file when a required field is missing", async () => {
        const {getAllPosts} = await loadBlogWithCwd("missing-field");
        expect(() => getAllPosts("fr")).toThrow(/broken\.md.*description/s);
    });

    it("throws an explicit error naming the file when the date is unparsable", async () => {
        const {getAllPosts} = await loadBlogWithCwd("bad-date");
        expect(() => getAllPosts("fr")).toThrow(/broken\.md.*date/s);
    });

    it("throws an explicit error naming the file when locale disagrees with the folder", async () => {
        const {getAllPosts} = await loadBlogWithCwd("locale-mismatch");
        expect(() => getAllPosts("fr")).toThrow(/broken\.md/);
    });

    it("throws naming the file when a quoted date names a day the month does not have", async () => {
        const {getAllPosts} = await loadBlogWithCwd("bad-calendar-date-quoted");
        expect(() => getAllPosts("fr")).toThrow(/broken\.md.*2026-02-30/s);
    });

    it("throws naming the file when an unquoted date rolls over via YAML's own date parsing", async () => {
        // date: 2026-02-30 (unquoted) is resolved by YAML into 2026-03-02
        // before this module ever sees it. The guard has to catch this from
        // the raw front matter text, not from the already-rolled-over value.
        const {getAllPosts} = await loadBlogWithCwd("bad-calendar-date-unquoted");
        expect(() => getAllPosts("fr")).toThrow(/broken\.md.*2026-02-30/s);
    });

    it("throws naming the file when draft is a string instead of a boolean", async () => {
        const {getAllPosts} = await loadBlogWithCwd("invalid-draft-string");
        expect(() => getAllPosts("fr")).toThrow(/broken\.md.*draft/s);
    });

    it("throws naming the file when draft uses a YAML 1.1 boolean alias (yes)", async () => {
        const {getAllPosts} = await loadBlogWithCwd("invalid-draft-yes");
        expect(() => getAllPosts("fr")).toThrow(/broken\.md.*draft/s);
    });

    it("throws naming the file when the slug derived from the filename is invalid", async () => {
        // Exercises the slug-from-filename branch in parsePost (as opposed to
        // the slug-from-URL branch in getPost, covered by the path traversal
        // test above): Invalid_Slug.md has uppercase and an underscore, both
        // outside SLUG_RE.
        const {getAllPosts, getAllSlugs} = await loadBlogWithCwd("invalid-filename-slug");
        expect(() => getAllPosts("fr")).toThrow(/Invalid_Slug\.md/);
        expect(() => getAllSlugs("fr")).toThrow(/Invalid_Slug\.md/);
    });
});

describe("heading rendering", () => {
    it("shifts markdown heading levels down one so the body never emits a second h1", async () => {
        const {getPost} = await loadBlogWithCwd("heading-shift");
        const post = getPost("fr", "titre-dans-le-corps");
        expect(post.html).not.toContain("<h1>");
        expect(post.html).toContain("<h2>Titre dans le corps</h2>");
        expect(post.html).toContain("<h3>Sous-titre</h3>");
    });
});

describe("getAvailableLocales", () => {
    it("returns only fr for a post that exists in fr alone", async () => {
        const {getAvailableLocales} = await loadBlogWithCwd("valid");
        expect(getAvailableLocales("deuxieme-article")).toEqual(["fr"]);
    });

    it("returns both locales for a post published in fr and en", async () => {
        const {getAvailableLocales} = await loadBlogWithCwd("valid");
        expect(getAvailableLocales("premier-article").sort()).toEqual(["en", "fr"]);
    });

    it("excludes a draft locale variant", async () => {
        const {getAvailableLocales} = await loadBlogWithCwd("valid");
        expect(getAvailableLocales("brouillon")).toEqual([]);
    });

    it("returns an empty array for an invalid slug", async () => {
        const {getAvailableLocales} = await loadBlogWithCwd("valid");
        expect(getAvailableLocales("../../secret")).toEqual([]);
    });
});

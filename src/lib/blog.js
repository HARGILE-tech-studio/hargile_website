// Server-only module: reads and parses the Markdown blog content on disk.
// Never import this from a client component ("use client"): it touches the
// filesystem and has no browser-safe fallback. The `server-only` package is
// not part of this repo's dependency list, so this comment is the guard.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {marked} from "marked";
import {routing} from "@/i18n/routing";

const CONTENT_ROOT = path.join(process.cwd(), "src/content/blog");

/* Slugs come from the filename (trusted, our own repo) or from the URL
   (untrusted). Same regex either way: lowercase alphanumerics separated by
   single hyphens, nothing else: no dot, no slash, no uppercase. This is what
   keeps a request like /blog/../../secret from ever reaching the filesystem. */
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const REQUIRED_FIELDS = ["title", "description", "date", "locale"];

/* marked shifts every Markdown heading down one level on render (h1 -> h2,
   ..., h6 stays h6, clamped rather than overflowing past what HTML defines).
   PosterHero already renders `post.title` as the article's one <h1> (see
   blog/[slug]/page.jsx); a Pancake article's body conventionally opens with a
   "# " restating that same title, and without this shift that becomes a
   second <h1>, an accessibility and SEO fault on the exact per-page gate this
   repo enforces in CI. Configured once at module load via marked.use() rather
   than per-call, so both getPost's marked.parse() calls below share it. */
marked.use({
    gfm: true,
    renderer: {
        heading({tokens, depth}) {
            const level = Math.min(depth + 1, 6);
            return `<h${level}>${this.parser.parseInline(tokens)}</h${level}>\n`;
        },
    },
});

function isValidSlug(slug) {
    return typeof slug === "string" && SLUG_RE.test(slug);
}

function localeDir(locale) {
    return path.join(CONTENT_ROOT, locale);
}

/* `draft` is the only technical gate against publishing an article the
   Pancake pipeline flagged as blocked (a named client, an off-grid price, a
   ranking guarantee): it sets `draft: true` automatically whenever such a
   blocker fires. `data.draft === true` silently treats anything that is not
   the exact boolean `true` as "not draft", so a typo (`draft: "true"`,
   `draft: yes`, both valid YAML that gray-matter happily returns as a
   string) publishes the article instead of blocking it. Validate the shape
   explicitly: only the booleans `true`/`false`, or the field absent
   entirely, are accepted. Anything else throws, naming the file, exactly
   like every other front matter field below. */
function assertValidDraftField(value, filePath) {
    if (value === undefined || value === true || value === false) return;
    throw new Error(
        `Blog post ${filePath} has an invalid "draft" field (${JSON.stringify(value)}). ` +
        `Expected the boolean true, the boolean false, or the field omitted.`
    );
}

/* Rejects a calendar date that does not survive a round trip: "2026-02-30" is
   shaped like a date but names a day February does not have. Two ways this
   value can reach us:
     - quoted in the front matter ("2026-02-30") - gray-matter/js-yaml leave it
       as the literal string, DATE_RE and Date.parse both let it through since
       Date.parse rolls Feb 30 forward into March 2 instead of returning NaN.
     - unquoted (the contract's own form, `date: 2026-02-30`) - YAML's default
       schema resolves it to a native Date at parse time, and that resolution
       *also* rolls it to March 2nd, silently, before this module ever sees
       the value. There is no way to recover "the day was 30" from the
       resulting Date object; it is already a different, internally
       consistent date.
   So this checks the RAW front matter text (gray-matter's `.matter` string),
   before either of those roll-overs, against the calendar directly: build a
   UTC date from the literal year/month/day and confirm it reports back the
   same year/month/day. A value that isn't shaped like a plain YYYY-MM-DD in
   the raw text (missing, garbage, or another format entirely) is left to
   normalizeDate below, which handles those cases. */
function assertValidCalendarDate(rawMatterText, field, filePath) {
    const fieldRe = new RegExp(`^${field}:[ \\t]*(.*)$`, "m");
    const match = fieldRe.exec(rawMatterText);
    if (!match) return;

    let rawValue = match[1].trim();
    const quoted =
        (rawValue.startsWith('"') && rawValue.endsWith('"')) ||
        (rawValue.startsWith("'") && rawValue.endsWith("'"));
    if (quoted) rawValue = rawValue.slice(1, -1);

    const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(rawValue);
    if (!dateMatch) return;

    const [, yearStr, monthStr, dayStr] = dateMatch;
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);
    const asUtc = new Date(Date.UTC(year, month - 1, day));
    const roundTrips =
        asUtc.getUTCFullYear() === year &&
        asUtc.getUTCMonth() === month - 1 &&
        asUtc.getUTCDate() === day;

    if (!roundTrips) {
        throw new Error(
            `Blog post ${filePath} has an invalid calendar date for "${field}": ` +
            `"${rawValue}" is not a real date.`
        );
    }
}

/* Front matter dates are written unquoted in the contract (`date: 2026-09-09`),
   which YAML's default schema parses as a native Date at midnight UTC rather
   than a string. Both shapes have to normalize to the same "YYYY-MM-DD",
   never `new Date()`, always the value the file declared. Calendar-validity
   (does the day exist in that month) is assertValidCalendarDate's job above,
   run against the raw text before this function ever sees the value: by the
   time a value reaches here it may already have been silently rolled to a
   different, validly-formed date by YAML, which this function has no way to
   detect on its own. */
function normalizeDate(value, field, filePath) {
    if (value instanceof Date) {
        if (Number.isNaN(value.getTime())) {
            throw new Error(`Blog post ${filePath} has an unparsable "${field}" date.`);
        }
        return value.toISOString().slice(0, 10);
    }
    const str = String(value);
    if (!DATE_RE.test(str) || Number.isNaN(Date.parse(str))) {
        throw new Error(
            `Blog post ${filePath} has an unparsable "${field}" date "${value}". Expected YYYY-MM-DD.`
        );
    }
    return str;
}

function readMarkdownFilenames(locale) {
    let entries;
    try {
        entries = fs.readdirSync(localeDir(locale), {withFileTypes: true});
    } catch (err) {
        if (err.code === "ENOENT") return [];
        throw err;
    }
    return entries
        .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
        .map((entry) => entry.name);
}

/* Parses and strictly validates one Markdown file's front matter. Throws with
   the offending file path on any contract violation: a malformed article
   must break the build, never publish half-formed. */
function parsePost(locale, filename) {
    const filePath = path.join(localeDir(locale), filename);
    const slug = filename.replace(/\.md$/, "");

    if (!isValidSlug(slug)) {
        throw new Error(`Invalid blog slug "${slug}" derived from file ${filePath}. Slugs must match ${SLUG_RE}.`);
    }

    const raw = fs.readFileSync(filePath, "utf8");

    let data;
    let content;
    let rawMatterText;
    try {
        const parsed = matter(raw);
        ({data, content} = parsed);
        rawMatterText = parsed.matter;
    } catch (err) {
        throw new Error(`Blog post ${filePath} has invalid front matter YAML: ${err.message}`);
    }

    for (const field of REQUIRED_FIELDS) {
        if (data[field] === undefined || data[field] === null || data[field] === "") {
            throw new Error(`Blog post ${filePath} is missing required front matter field "${field}".`);
        }
    }

    if (data.locale !== locale) {
        throw new Error(
            `Blog post ${filePath} declares locale "${data.locale}" but lives in the "${locale}" folder.`
        );
    }

    assertValidDraftField(data.draft, filePath);

    assertValidCalendarDate(rawMatterText, "date", filePath);
    const date = normalizeDate(data.date, "date", filePath);

    let updated;
    if (data.updated !== undefined && data.updated !== null && data.updated !== "") {
        assertValidCalendarDate(rawMatterText, "updated", filePath);
        updated = normalizeDate(data.updated, "updated", filePath);
    }

    return {
        slug,
        title: String(data.title),
        description: String(data.description),
        date,
        updated,
        author: data.author ? String(data.author) : "HARGILE",
        locale,
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        source: data.source ? String(data.source) : undefined,
        draft: data.draft === true,
        content,
    };
}

function loadLocale(locale) {
    return readMarkdownFilenames(locale).map((filename) => parsePost(locale, filename));
}

/* Published posts for a locale, newest first, front matter only (no body). */
export function getAllPosts(locale) {
    return loadLocale(locale)
        .filter((post) => !post.draft)
        .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
        .map(({content, ...meta}) => meta);
}

export function getPostSlugs(locale) {
    return getAllPosts(locale).map((post) => post.slug);
}

/* Every slug that exists on disk for a locale, drafts included. This exists
   only for generateStaticParams on the article route: Next's Cache
   Components build requires every generateStaticParams to return at least
   one result, and before the first real post ships the only content is the
   draft demo article. Including it here gives the build one static param to
   prerender, which resolves to a static 404 (getPost still returns null for
   a draft, so the page calls notFound()), rather than failing the whole
   build over an empty dynamic route. Never used for anything user-facing:
   getAllPosts, getPostSlugs and getAvailableLocales all keep excluding
   drafts, so a draft still cannot be listed, linked to, or found published. */
export function getAllSlugs(locale) {
    return loadLocale(locale).map((post) => post.slug);
}

/* A single published post with its rendered HTML body, or null when it does
   not exist, is a draft, or `slug` fails validation (the URL-facing path). */
export function getPost(locale, slug) {
    if (!isValidSlug(slug)) return null;

    const filePath = path.join(localeDir(locale), `${slug}.md`);
    if (!fs.existsSync(filePath)) return null;

    const post = parsePost(locale, `${slug}.md`);
    if (post.draft) return null;

    const {content, ...meta} = post;
    // This Markdown comes from our own repository content, authored by the
    // Pancake pipeline and reviewed by a human before merge, never from a
    // request at render time. That is the same trust boundary as the rest of
    // this site's own copy, which is why rendering it via
    // dangerouslySetInnerHTML is acceptable here. Reconsider this the day
    // blog content can arrive from an unreviewed or user-submitted source.
    const html = marked.parse(content);

    return {...meta, html};
}

/* Locales in which a given slug exists and is publishable (not draft). Drives
   the hreflang alternates: a post that only exists in French must not
   advertise an English alternate. */
export function getAvailableLocales(slug) {
    if (!isValidSlug(slug)) return [];
    return routing.locales.filter((locale) => {
        const filePath = path.join(localeDir(locale), `${slug}.md`);
        if (!fs.existsSync(filePath)) return false;
        return !parsePost(locale, `${slug}.md`).draft;
    });
}

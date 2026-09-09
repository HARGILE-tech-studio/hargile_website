/* Shared by the blog list (client) and the blog article page (server): both
   need to render the same "9 septembre 2026" / "September 9, 2026" style
   date from a post's ISO "YYYY-MM-DD" front matter value. timeZone: "UTC"
   keeps the result identical on the server and after hydration regardless of
   the machine's local timezone, since the input has no time component of its
   own to begin with. */
export function formatBlogDate(isoDate, locale) {
    return new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(isoDate));
}

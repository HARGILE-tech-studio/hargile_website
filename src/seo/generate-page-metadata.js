import {getTranslations} from 'next-intl/server';
import {SITE_URL} from '@/lib/site-url';
import {localeUrl} from '@/seo/locale-url';
import {NOINDEX_PAGES, ROUTES} from '@/seo/routes';

/**
 * Generate metadata for specific page with optimized SEO descriptions
 *
 * @param {Object} params - Parameters object
 * @param pagePath dot notations
 * @param {Object} params.params - Next.js params object containing locale
 * @param {string} params.pagePath - Path identifier for the page
 * @returns {Object} - Metadata object for Next.js
 */
export async function generatePageMetadata({params, pagePath}) {
    const {locale} = await params || {locale: 'fr'};

    try {
        // Load global translations
        const globalT = await getTranslations({
            locale,
            namespace: 'seo.global'
        });

        // Load page-specific translations
        const pageT = await getTranslations({
            locale,
            namespace: `seo.pages.${pagePath}`
        });

        // Base URL configuration (unified on SITE_URL, hargile.com).
        // French is unprefixed, English is /en: localeUrl owns that rule.
        const pathSuffix = ROUTES[pagePath] ?? `/${pagePath.replaceAll('.', '/')}`;
        const baseUrl = localeUrl(locale, pathSuffix);
        // 1200x630, padded from the dark TECH STUDIO lockup (see shared-metadata.js)
        const imageUrl = `${SITE_URL}/images/brand/og-hargile-tech-studio.png`;
        const indexable = !NOINDEX_PAGES.has(pagePath);

        return {
            metadataBase: new URL(SITE_URL),
            title: pageT('title'),
            description: pageT('description'),
            applicationName: globalT('siteName'),

            alternates: {
                canonical: baseUrl,
                languages: {
                    'fr': localeUrl('fr', pathSuffix),
                    'en': localeUrl('en', pathSuffix),
                    // French is the default locale, so it doubles as x-default.
                    'x-default': localeUrl('fr', pathSuffix),
                },
            },

            openGraph: {
                type: 'website',
                locale: locale,
                url: baseUrl,
                siteName: globalT('siteName'),
                title: pageT('og.title'),
                description: pageT('og.description'),
                images: [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: pageT('og.imageAlt'),
                    },
                ],
            },

            /* No `creator`/`site`: HARGILE has no X account. The handle that
               used to sit here (@hargile_agency) came from a 2025 SEO scaffold
               and never pointed at a real profile: a published handle that
               resolves to nothing is a corroboration signal that fails when an
               engine checks it. The card/title/description/images stay: they
               drive link previews and don't claim an account exists. */
            twitter: {
                card: 'summary_large_image',
                title: pageT('og.title'),
                description: pageT('og.description'),
                images: [imageUrl],
            },

            robots: {
                index: indexable,
                follow: true,
                nocache: false,
                googleBot: {
                    index: indexable,
                    follow: true,
                    'max-image-preview': 'large',
                    'max-snippet': -1,
                },
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);

        // Fallback metadata if translations fail to load
        return {
            title: 'HARGILE',
            description: locale === 'fr'
                ? 'GEO et SEO pour entreprises en Belgique. Soyez nommé par ChatGPT, Perplexity et les moteurs de réponse IA.'
                : 'GEO and SEO for businesses in Belgium. Get named by ChatGPT, Perplexity and AI answer engines.'
        };
    }
}

/**
 * Metadata for a piece of dynamic content that has no seo.pages.* entry of its
 * own, such as a blog post: title/description come from the content's own
 * front matter instead of the translation files, and the hreflang alternates
 * are limited to the locales the content actually exists in (`availableLocales`)
 * rather than every site locale. Kept separate from generatePageMetadata
 * rather than folded into it, since that function's whole shape assumes a
 * static seo.pages.<pagePath> lookup.
 *
 * @param {Object} params
 * @param {string} params.locale
 * @param {string} params.pathSuffix - e.g. `/blog/my-post`, no locale prefix
 * @param {string} params.title
 * @param {string} params.description
 * @param {string[]} params.availableLocales - locales this content exists in
 * @returns {Promise<Object>} Metadata object for Next.js
 */
export async function generateContentMetadata({locale, pathSuffix, title, description, availableLocales}) {
    try {
        const globalT = await getTranslations({locale, namespace: 'seo.global'});

        const baseUrl = localeUrl(locale, pathSuffix);
        const imageUrl = `${SITE_URL}/images/brand/og-hargile-tech-studio.png`;

        const languages = Object.fromEntries(
            availableLocales.map((l) => [l, localeUrl(l, pathSuffix)])
        );
        // x-default only makes sense once the default locale actually carries
        // this content: a French-only post must not claim x-default via an
        // English URL that 404s.
        if (availableLocales.includes('fr')) {
            languages['x-default'] = localeUrl('fr', pathSuffix);
        }

        return {
            metadataBase: new URL(SITE_URL),
            title,
            description,
            applicationName: globalT('siteName'),

            alternates: {
                canonical: baseUrl,
                languages,
            },

            openGraph: {
                type: 'article',
                locale,
                url: baseUrl,
                siteName: globalT('siteName'),
                title,
                description,
                images: [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: title,
                    },
                ],
            },

            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: [imageUrl],
            },

            robots: {
                index: true,
                follow: true,
                nocache: false,
                googleBot: {
                    index: true,
                    follow: true,
                    'max-image-preview': 'large',
                    'max-snippet': -1,
                },
            },
        };
    } catch (error) {
        console.error('Error generating content metadata:', error);
        return {title, description};
    }
}

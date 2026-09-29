// HARG-386 : erreurs serveur vers Sentry (GlitchTip). Serveur seulement :
// aucun code Sentry n'est chargé dans le navigateur.
//
// L'import est dynamique et limité au runtime Node : sans SENTRY_DSN, le SDK
// n'est même pas chargé et le site tourne exactement comme avant.
import {buildSentryOptions} from '@/lib/sentry/config.mjs';

export async function register() {
    if (process.env.NEXT_RUNTIME !== 'nodejs') return;
    const options = buildSentryOptions(process.env);
    if (!options) return;

    // Un échec d'import ou d'init ne doit jamais empêcher le pod de démarrer.
    try {
        const Sentry = await import('@sentry/node');
        Sentry.init(options);
    } catch (error) {
        console.error('[sentry] initialisation ignorée :', messageDe(error));
    }
}

function messageDe(error) {
    return error instanceof Error ? error.message : 'erreur inconnue';
}

// Appelé par Next pour toute erreur non gérée (server components, route
// handlers, server actions, proxy, rendu serveur). Le chemin est envoyé sans
// query string, jamais le corps ni les en-têtes.
export async function onRequestError(error, request, context) {
    if (process.env.NEXT_RUNTIME !== 'nodejs') return;
    if (!buildSentryOptions(process.env)) return;

    try {
        const Sentry = await import('@sentry/node');
        Sentry.withScope((scope) => {
            scope.setTag('router_kind', context.routerKind);
            scope.setTag('route_type', context.routeType);
            scope.setTag('route_path', context.routePath);
            scope.setContext('request', {
                method: request.method,
                path: String(request.path ?? '').split('?')[0],
            });
            Sentry.captureException(error);
        });
    } catch (echec) {
        console.error('[sentry] capture ignorée :', messageDe(echec));
    }
}

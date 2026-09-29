// HARG-386 : configuration Sentry (compatible GlitchTip), SERVEUR uniquement.
//
// Fichier en .mjs volontairement : il est partagé par l'application
// (src/instrumentation.ts) et par le script de vérification en prod
// (scripts/sentry-smoke.mjs, lancé avec `node` dans le pod, sans compilation).
// Aucun import ici : les fonctions sont pures et testables sans le SDK.
//
// Contrat : pas de code Sentry côté navigateur, pas de DSN exposé au client,
// pas de tracing, pas de replay, pas de tunnel.

// En-têtes conservés (liste blanche) : tout le reste est retiré, y compris
// x-forwarded-*, x-real-ip, forwarded, referer, x-hub-signature, les
// identités oauth2-proxy (x-auth-request-*) et tout en-tête d'authentification.
const EN_TETES_AUTORISES = new Set([
  "user-agent",
  "host",
  "content-type",
  "accept",
  "accept-language",
]);

// Intégrations par défaut retirées : Console (arguments de console.log/error
// dans les breadcrumbs), Http et NodeFetch (breadcrumbs et propagation de
// sentry-trace/baggage vers les requêtes sortantes, suivi de sessions),
// ProcessSession (envoi de sessions "release health").
const INTEGRATIONS_RETIREES = new Set([
  "Console",
  "Http",
  "NodeFetch",
  "ProcessSession",
]);

/**
 * Filtre la liste des intégrations par défaut du SDK.
 *
 * @template {{ name: string }} I
 * @param {I[]} integrationsParDefaut
 * @returns {I[]}
 */
export function filterIntegrations(integrationsParDefaut) {
  return integrationsParDefaut.filter(
    (integration) => !INTEGRATIONS_RETIREES.has(integration.name),
  );
}

/**
 * Options d'initialisation, ou null si SENTRY_DSN est absente ou vide
 * (le SDK n'est alors PAS initialisé et l'appli tourne comme avant).
 *
 * @param {Record<string, string | undefined>} env
 */
export function buildSentryOptions(env) {
  const dsn = (env.SENTRY_DSN ?? "").trim();
  if (dsn === "") return null;

  return {
    dsn,
    environment: (env.SENTRY_ENVIRONMENT ?? "").trim() || "production",
    // Absent en local : le SDK ignore alors la release.
    release: (env.APP_VERSION ?? "").trim() || undefined,
    sendDefaultPii: false,
    // Pas de tracing : tracesSampleRate n'est volontairement PAS défini (le
    // définir, même à 0, active le tracing et la propagation d'en-têtes).
    // Aucune propagation sentry-trace/baggage vers les tiers.
    tracePropagationTargets: [],
    sendClientReports: false,
    integrations: filterIntegrations,
    beforeSend: scrubEvent,
    beforeBreadcrumb: scrubBreadcrumb,
  };
}

/**
 * beforeBreadcrumb : supprime les breadcrumbs de console (arguments libres) et
 * retire query string et fragment des URL, ainsi que data.arguments. Fonction
 * pure : renvoie un nouvel objet, ne modifie pas l'entrée.
 *
 * @template T
 * @param {T} breadcrumb
 * @returns {T | null}
 */
export function scrubBreadcrumb(breadcrumb) {
  if (breadcrumb === null || typeof breadcrumb !== "object") return breadcrumb;
  /** @type {Record<string, any>} */
  const copie = { ...breadcrumb };
  if (copie.category === "console") return null;

  if (copie.data && typeof copie.data === "object") {
    const data = { ...copie.data };
    delete data.arguments;
    for (const cle of ["url", "from", "to"]) {
      if (typeof data[cle] === "string") data[cle] = sansQuery(data[cle]);
    }
    copie.data = data;
  }
  return /** @type {T} */ (copie);
}

/** @param {string} url */
function sansQuery(url) {
  return url.split("?")[0].split("#")[0];
}

/**
 * beforeSend : retire cookies, corps de requête, query string, adresse IP et
 * tous les en-têtes hors liste blanche ; nettoie aussi les breadcrumbs déjà
 * attachés. Fonction pure : renvoie un nouvel objet, ne modifie pas
 * l'événement reçu.
 *
 * @template T
 * @param {T} event
 * @returns {T}
 */
export function scrubEvent(event) {
  if (event === null || typeof event !== "object") return event;
  /** @type {Record<string, any>} */
  const copie = { ...event };

  if (copie.request && typeof copie.request === "object") {
    const request = { ...copie.request };
    delete request.cookies;
    delete request.data;
    delete request.query_string;
    delete request.env;
    if (typeof request.url === "string") request.url = sansQuery(request.url);
    if (request.headers && typeof request.headers === "object") {
      /** @type {Record<string, unknown>} */
      const headers = {};
      for (const [nom, valeur] of Object.entries(request.headers)) {
        if (EN_TETES_AUTORISES.has(nom.toLowerCase())) headers[nom] = valeur;
      }
      request.headers = headers;
    }
    copie.request = request;
  }

  if (copie.user && typeof copie.user === "object") {
    const user = { ...copie.user };
    delete user.ip_address;
    copie.user = user;
  }

  if (Array.isArray(copie.breadcrumbs)) {
    copie.breadcrumbs = copie.breadcrumbs
      .map(scrubBreadcrumb)
      .filter((b) => b !== null);
  }

  return /** @type {T} */ (copie);
}

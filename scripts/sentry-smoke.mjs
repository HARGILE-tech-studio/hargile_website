// HARG-386 : vérification en prod de la chaîne Sentry (GlitchTip).
// Envoie UNE erreur de test étiquetée puis vide la file d'envoi.
//
// Usage dans le pod (l'image contient ce script et le SDK) :
//   kubectl exec -n <ns> deploy/<site> -- node scripts/sentry-smoke.mjs
//
// Utilise exactement les mêmes options que l'application (config.mjs),
// lues depuis l'environnement du pod (SENTRY_DSN, SENTRY_ENVIRONMENT,
// APP_VERSION). Code de sortie 0 si l'événement est parti, 1 sinon.
import * as Sentry from "@sentry/node";
import { buildSentryOptions } from "../src/lib/sentry/config.mjs";

const options = buildSentryOptions(process.env);
if (!options) {
  console.error("SENTRY_DSN absente ou vide : rien à envoyer.");
  process.exit(1);
}

// debug : affiche sur stderr un éventuel échec d'envoi (DSN erronée, réseau),
// car flush() renvoie true même si la livraison a échoué.
Sentry.init({ ...options, debug: true });
const id = Sentry.captureException(new Error("HARG-386 smoke test site"));
const envoye = await Sentry.flush(10_000);
console.log(`event_id=${id} environment=${options.environment} release=${options.release ?? "(absente)"}`);
console.log(
  envoye
    ? "flush OK (aucune erreur d'envoi ci-dessus = livré ; confirmer dans GlitchTip)"
    : "flush expiré : événement peut-être non livré",
);
process.exit(envoye ? 0 : 1);

import { describe, expect, it } from "vitest";
import {
  buildSentryOptions,
  filterIntegrations,
  scrubBreadcrumb,
  scrubEvent,
} from "../sentry/config.mjs";

const DSN = "https://cle@glitchtip.example.com/1";

describe("buildSentryOptions", () => {
  it("renvoie null (SDK non initialisé) quand SENTRY_DSN est absente", () => {
    expect(buildSentryOptions({})).toBeNull();
  });

  it("renvoie null quand SENTRY_DSN est vide ou blanche", () => {
    expect(buildSentryOptions({ SENTRY_DSN: "" })).toBeNull();
    expect(buildSentryOptions({ SENTRY_DSN: "   " })).toBeNull();
  });

  it("désactive le PII, le tracing et la propagation d'en-têtes", () => {
    const options = buildSentryOptions({ SENTRY_DSN: DSN });
    expect(options?.sendDefaultPii).toBe(false);
    expect(options).not.toHaveProperty("tracesSampleRate");
    expect(options?.tracePropagationTargets).toEqual([]);
    expect(options?.sendClientReports).toBe(false);
    expect(options?.dsn).toBe(DSN);
  });

  it("branche filterIntegrations et scrubBreadcrumb", () => {
    const options = buildSentryOptions({ SENTRY_DSN: DSN });
    expect(options?.integrations).toBe(filterIntegrations);
    expect(options?.beforeBreadcrumb).toBe(scrubBreadcrumb);
  });

  it("prend production comme environnement par défaut", () => {
    expect(buildSentryOptions({ SENTRY_DSN: DSN })?.environment).toBe(
      "production",
    );
    expect(
      buildSentryOptions({ SENTRY_DSN: DSN, SENTRY_ENVIRONMENT: "" })
        ?.environment,
    ).toBe("production");
  });

  it("respecte SENTRY_ENVIRONMENT quand elle est posée", () => {
    expect(
      buildSentryOptions({ SENTRY_DSN: DSN, SENTRY_ENVIRONMENT: "staging" })
        ?.environment,
    ).toBe("staging");
  });

  it("prend la release dans APP_VERSION, absente en local", () => {
    expect(
      buildSentryOptions({ SENTRY_DSN: DSN, APP_VERSION: "v0.35.1" })?.release,
    ).toBe("v0.35.1");
    expect(buildSentryOptions({ SENTRY_DSN: DSN })?.release).toBeUndefined();
  });

  it("branche scrubEvent comme beforeSend", () => {
    expect(buildSentryOptions({ SENTRY_DSN: DSN })?.beforeSend).toBe(
      scrubEvent,
    );
  });
});

describe("scrubEvent", () => {
  const evenement = {
    message: "boom",
    user: { id: "7", ip_address: "203.0.113.9" },
    request: {
      url: "https://hargile.com/leads?token=secret#x",
      method: "POST",
      query_string: "token=secret",
      cookies: { hargile_session: "abc" },
      data: { email: "a@b.c" },
      headers: {
        Cookie: "hargile_session=abc",
        Authorization: "Bearer xyz",
        "X-Api-Key": "k",
        "x-auth-request-user": "dorian",
        "X-Auth-Request-Email": "d@h.com",
        "user-agent": "curl/8",
      },
    },
  };

  it("retire cookies, corps, query string et adresse IP", () => {
    const propre = scrubEvent(evenement);
    expect(propre.request).not.toHaveProperty("cookies");
    expect(propre.request).not.toHaveProperty("data");
    expect(propre.request).not.toHaveProperty("query_string");
    expect(propre.request.url).toBe("https://hargile.com/leads");
    expect(propre.user).not.toHaveProperty("ip_address");
    expect(propre.user.id).toBe("7");
  });

  it("garde seulement les en-têtes de la liste blanche, quelle que soit la casse", () => {
    const noms = Object.keys(scrubEvent(evenement).request.headers);
    expect(noms).toEqual(["user-agent"]);
  });

  it("retire les en-têtes d'identité, de proxy et de referer", () => {
    const propre = scrubEvent({
      request: {
        headers: {
          "X-Forwarded-For": "203.0.113.9",
          "x-real-ip": "203.0.113.9",
          Forwarded: "for=203.0.113.9",
          "x-forwarded-user": "dorian",
          "x-forwarded-email": "d@h.com",
          "x-hub-signature-256": "sha256=abc",
          Referer: "https://hargile.com/leads?email=a@b.c",
          "proxy-authorization": "Basic xx",
          Host: "hargile.com",
          "Content-Type": "application/json",
          Accept: "*/*",
          "Accept-Language": "fr",
        },
        env: { REMOTE_ADDR: "203.0.113.9" },
      },
    });
    expect(Object.keys(propre.request.headers).sort()).toEqual(
      ["Accept", "Accept-Language", "Content-Type", "Host"].sort(),
    );
    expect(propre.request).not.toHaveProperty("env");
  });

  it("nettoie les breadcrumbs déjà attachés à l'événement", () => {
    const propre = scrubEvent({
      breadcrumbs: [
        { category: "console", message: "email a@b.c" },
        { category: "http", data: { url: "https://x.io/a?e=a@b.c" } },
      ],
    });
    expect(propre.breadcrumbs).toEqual([
      { category: "http", data: { url: "https://x.io/a" } },
    ]);
  });

  it("ne modifie pas l'événement d'origine", () => {
    scrubEvent(evenement);
    expect(evenement.request.headers.Cookie).toBe("hargile_session=abc");
    expect(evenement.user.ip_address).toBe("203.0.113.9");
  });

  it("tolère un événement sans request ni user", () => {
    expect(scrubEvent({ message: "x" })).toEqual({ message: "x" });
  });
});

describe("scrubBreadcrumb", () => {
  it("supprime les breadcrumbs de console", () => {
    expect(
      scrubBreadcrumb({ category: "console", message: "a@b.c", data: { arguments: ["a@b.c"] } }),
    ).toBeNull();
  });

  it("retire query, fragment et data.arguments", () => {
    const entree = {
      category: "http",
      data: { url: "https://api.io/x?email=a@b.c#f", arguments: ["s"], method: "GET" },
    };
    const propre = scrubBreadcrumb(entree);
    expect(propre?.data).toEqual({ url: "https://api.io/x", method: "GET" });
    expect(entree.data.url).toContain("?email=");
  });

  it("laisse passer un breadcrumb sans data", () => {
    expect(scrubBreadcrumb({ category: "x", message: "ok" })).toEqual({
      category: "x",
      message: "ok",
    });
  });
});

describe("filterIntegrations", () => {
  it("retire Console, Http, NodeFetch et ProcessSession, garde le reste", () => {
    const noms = filterIntegrations([
      { name: "Console" },
      { name: "Http" },
      { name: "NodeFetch" },
      { name: "ProcessSession" },
      { name: "LinkedErrors" },
      { name: "OnUncaughtException" },
    ]).map((i) => i.name);
    expect(noms).toEqual(["LinkedErrors", "OnUncaughtException"]);
  });
});

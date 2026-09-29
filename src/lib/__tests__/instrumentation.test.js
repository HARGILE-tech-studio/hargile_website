import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Compteur d'évaluation : prouve que le SDK n'est pas importé sans DSN.
const sdk = vi.hoisted(() => ({
  charge: vi.fn(),
  init: vi.fn(),
  captureException: vi.fn(),
  setTag: vi.fn(),
  setContext: vi.fn(),
}));

vi.mock("@sentry/node", () => {
  sdk.charge();
  return {
    init: sdk.init,
    captureException: sdk.captureException,
    withScope: (cb) =>
      cb({ setTag: sdk.setTag, setContext: sdk.setContext }),
  };
});

import { onRequestError, register } from "../../instrumentation.js";

const DSN = "https://cle@glitchtip.example.com/1";

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe("register", () => {
  it("n'importe pas le SDK sans SENTRY_DSN", async () => {
    vi.stubEnv("NEXT_RUNTIME", "nodejs");
    vi.stubEnv("SENTRY_DSN", "");
    await register();
    expect(sdk.charge).not.toHaveBeenCalled();
    expect(sdk.init).not.toHaveBeenCalled();
  });

  it("ne fait rien hors runtime nodejs, même avec un DSN", async () => {
    vi.stubEnv("NEXT_RUNTIME", "edge");
    vi.stubEnv("SENTRY_DSN", DSN);
    await register();
    expect(sdk.charge).not.toHaveBeenCalled();
    expect(sdk.init).not.toHaveBeenCalled();
  });

  it("initialise le SDK avec les options quand DSN et runtime nodejs", async () => {
    vi.stubEnv("NEXT_RUNTIME", "nodejs");
    vi.stubEnv("SENTRY_DSN", DSN);
    await register();
    expect(sdk.charge).toHaveBeenCalled();
    expect(sdk.init).toHaveBeenCalledTimes(1);
    expect(sdk.init.mock.calls[0][0]).toMatchObject({
      dsn: DSN,
      sendDefaultPii: false,
    });
  });

  it("n'échoue pas si l'init lève une erreur (le pod démarre quand même)", async () => {
    vi.stubEnv("NEXT_RUNTIME", "nodejs");
    vi.stubEnv("SENTRY_DSN", DSN);
    sdk.init.mockImplementationOnce(() => {
      throw new Error("init cassée");
    });
    const erreur = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(register()).resolves.toBeUndefined();
    expect(erreur).toHaveBeenCalledTimes(1);
    erreur.mockRestore();
  });
});

describe("onRequestError", () => {
  const contexte = {
    routerKind: "App Router",
    routePath: "/leads/[id]",
    routeType: "render",
  };

  it("n'envoie rien sans DSN", async () => {
    vi.stubEnv("NEXT_RUNTIME", "nodejs");
    vi.stubEnv("SENTRY_DSN", "");
    await onRequestError(new Error("x"), { path: "/a", method: "GET" }, contexte);
    expect(sdk.captureException).not.toHaveBeenCalled();
  });

  it("envoie le chemin sans query string, jamais en-têtes ni corps", async () => {
    vi.stubEnv("NEXT_RUNTIME", "nodejs");
    vi.stubEnv("SENTRY_DSN", DSN);
    const erreur = new Error("boom");
    await onRequestError(
      erreur,
      { path: "/leads/7?email=a@b.c&token=s", method: "POST" },
      contexte,
    );
    expect(sdk.captureException).toHaveBeenCalledWith(erreur);
    expect(sdk.setContext).toHaveBeenCalledWith("request", {
      method: "POST",
      path: "/leads/7",
    });
    expect(sdk.setTag).toHaveBeenCalledWith("route_path", "/leads/[id]");
  });
});

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Environment variables

The site builds and renders with none of these set. Only the contact form and unsubscribe links need values: without them, `/api/contact` and `/api/unsubscribe` fail. `.env*` is gitignored, so a local `.env.local` stays out of Git.

- `NEXT_PUBLIC_SITE_URL`: canonical host (with or without `https://`) for metadata, JSON-LD, sitemap and image remote patterns; falls back to `hargile.com`.
- `NEXT_PUBLIC_BUILD_YEAR`: footer copyright year, computed by `next.config.mjs` on every build; no need to set it.
- `NEXT_PUBLIC_DEPLOY_ID`: version returned by `/api/health` (`unknown` when unset); not set by the Dockerfile, `docker.yml` or hargile-infra.
- `RESEND_API_KEY`: Resend API key used by `/api/contact` to send the message.
- `CONTACT_FORM_FROM_EMAIL`: sender address, on the domain verified in Resend.
- `CONTACT_FORM_TO_EMAIL`: inbox that receives contact form messages.
- `UNSUBSCRIBE_SECRET`: HMAC key that verifies unsubscribe link tokens.
- `SUPPRESSION_API_URL`: access-layer endpoint where `/api/unsubscribe` records opt-outs; resolves only inside the cluster.
- `SUPPRESSION_API_KEY`: `X-API-Key` header sent to that endpoint.

`NEXT_PUBLIC_*` values are inlined by `next build`, so set them before building. `NODE_ENV` is set by Next.js and the Dockerfile. Two maintenance scripts read optional variables: `EXPORT_ORIGIN` (site origin captured by `images:wavegrid*`) and `PORTFOLIO_REPO` (portfolio checkout read by `sync:portfolio`).

Production secrets live in the `hargile-website-secrets` SealedSecret in [HARGILE-tech-studio/hargile-infra](https://github.com/HARGILE-tech-studio/hargile-infra) (`apps/hargile-website/sealed-secret.yaml`). `SUPPRESSION_API_URL`, not a secret, is set in that app's `kustomization.yaml`; `NEXT_PUBLIC_SITE_URL` comes from the Dockerfile `ARG` default.

## Getting Started

Requires Node.js >= 20.9.0 (the `engines` range of `next` 16.2.10).

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



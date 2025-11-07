const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: {
    header:
      "eyJmaWQiOjE0NTAyMzEsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg4NzYyRGM2N0U1ZENkNDMzYjBmNDhCYWMxZTIzYkJkYTEwNjMxNDYwIn0",
    payload: "eyJkb21haW4iOiJiYXNlLW1pbmktYXBwLWRlbHRhLnZlcmNlbC5hcHAifQ",
    signature:
      "bM82hp9ii4FrANJyJQGYBHUpgimNnCvAQ80GKQulync6gCN3I53W6YZeFZqPgATUySJqVp61pXrX3x8o7XepVxw=",
  },
  miniapp: {
    version: "1",
    name: "Cubey",
    subtitle: "Your AI Ad Companion",
    description: "Ads",
    screenshotUrls: [`${ROOT_URL}screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}blue-icon.png`,
    splashImageUrl: `${ROOT_URL}blue-hero.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}api/webhook`,
    primaryCategory: "social",
    tags: ["marketing", "ads", "quickstart", "waitlist"],
    heroImageUrl: `${ROOT_URL}blue-hero.png`,
    tagline: "",
    ogTitle: "",
    ogDescription: "",
    ogImageUrl: `${ROOT_URL}blue-hero.png`,
  },
  baseBuilder: {
    ownerAddress: "0x7F438a895fA3e7dB5D53Ec330c98F6152637BCa0",
  },
} as const;

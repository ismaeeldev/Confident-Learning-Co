export const brand = {
  name: "The Confident Learning Co.",
  tagline: "Empowered Parents. Confident Learners.",
} as const;

/**
 * UK consumer law trader-identity disclosure (Annexe B section 3.1). Exact
 * wording, defined once and reused everywhere it must appear (site footer,
 * and later the Pathway/booking pages per Annexe B section 13). Never
 * paraphrase — the hyphen in Parker-Steed is always present, and the
 * trading name never appears alone as the legal identity.
 */
export const traderIdentity = {
  legalName: "Adam Parker-Steed, a sole trader, trading as The Confident Learning Co.",
  address: "49 Station Road, Polegate, East Sussex, BN26 6EA",
  icoRegistration: "ICO registration ZC219573",
} as const;

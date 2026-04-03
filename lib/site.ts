export type Locale = "en" | "de";

export type LocalizedText = Record<Locale, string>;

export type ReelItem = {
  id: "commercial" | "cinematic" | "narration" | "promo" | "character";
  label: LocalizedText;
  title: string;
  description: string;
  note: string;
  src: string;
  mimeType: string;
  category: string;
  featured?: boolean;
};

export type ServiceCard = {
  id: "voiceover" | "operations" | "creative" | "custom";
  title: string;
  body: LocalizedText;
};

export const siteName = "Jordan Bailey";
export const siteDescription =
  "Voice actor, creative, and Tier 3 Operations Engineer with real presence, real range, and no wasted motion.";
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jordanbailey.app";

export function getLocalizedText(text: LocalizedText, locale: Locale) {
  return text[locale];
}

export const contactDetails = {
  email: "jrdnbailey23@gmail.com",
  emailHref: "mailto:jrdnbailey23@gmail.com",
  phoneDisplay: "678-559-9787",
  phoneHref: "tel:+16785599787",
  instagramHandle: "young_link3",
  instagramHref: "https://instagram.com/young_link3",
  linkedinHref: "https://www.linkedin.com/in/jordanbailey23",
};

export const navigationItems = [
  { href: "/reels", label: { en: "Reels", de: "Reels" } },
  { href: "/about", label: { en: "About", de: "Über" } },
  { href: "/book", label: { en: "Book", de: "Buchen" } },
  { href: "/#contact", label: { en: "Contact", de: "Kontakt" } },
] satisfies Array<{ href: string; label: LocalizedText }>;

export const homeHero = {
  kicker: {
    en: "Voice actor. Creative. Tier 3 Operations Engineer.",
    de: "Voice Actor. Kreativer. Tier-3-Operations-Engineer.",
  },
  headline: "Cinematic when it counts. Human the whole time.",
  subhead: {
    en: "Jordan Bailey. Voice actor, creative, and Tier 3 Operations Engineer with real presence, real range, and no wasted motion. Clean reads, sharp delivery, and the technical depth to back the brand.",
    de: "Jordan Bailey. Voice Actor, Kreativer und Tier-3-Operations-Engineer mit echter Präsenz, echter Bandbreite und ohne verschwendete Bewegung. Saubere Reads, präzise Delivery und die technische Tiefe hinter der Marke.",
  },
  note: {
    en: "Atlanna smooth. Frankfurt precision. No wasted takes.",
    de: "Atlanna smooth. Frankfurter Präzision. Keine verschwendeten Takes.",
  },
  primaryCta: { en: "Book Jordan", de: "Jordan buchen" },
  secondaryCta: { en: "Listen Now", de: "Jetzt hören" },
};

export const identityItems: LocalizedText[] = [
  { en: "Cinematic", de: "Cinematic" },
  { en: "Commercial", de: "Commercial" },
  { en: "Narration", de: "Narration" },
  { en: "Character", de: "Character" },
  { en: "Promo", de: "Promo" },
  { en: "Tier 3 Operations", de: "Tier 3 Operations" },
  { en: "Creative Strategy", de: "Creative Strategy" },
];

export const reels: ReelItem[] = [
  {
    id: "commercial",
    label: { en: "Commercial", de: "Commercial" },
    title: "Commercial",
    description: "Clean, natural, and believable. No fake polish. Just a read people trust.",
    note: "Clean read. Heavy landing.",
    src: "/media/reels/commercial-demo.m4a",
    mimeType: "audio/mp4",
    category: "featured",
    featured: true,
  },
  {
    id: "cinematic",
    label: { en: "Cinematic", de: "Cinematic" },
    title: "Cinematic",
    description: "Weight, pacing, atmosphere, and control. This is where the edge gets sharper.",
    note: "Warm when needed. Dangerous if required.",
    src: "/media/reels/cinematic-demo.m4a",
    mimeType: "audio/mp4",
    category: "featured",
  },
  {
    id: "narration",
    label: { en: "Narration", de: "Narration" },
    title: "Narration",
    description: "Steady, clear, and human. You follow the voice instead of fighting it.",
    note: "Polished, not plastic.",
    src: "/media/reels/narration-demo.m4a",
    mimeType: "audio/mp4",
    category: "featured",
  },
  {
    id: "promo",
    label: { en: "Promo", de: "Promo" },
    title: "Promo",
    description: "Energy with discipline. Sharp enough to move people without turning into noise.",
    note: "Rhythm matters. I don’t rush the line.",
    src: "/media/reels/intro-demo.mp3",
    mimeType: "audio/mpeg",
    category: "featured",
  },
  {
    id: "character",
    label: { en: "Character", de: "Character" },
    title: "Character",
    description: "Range with control. Not chaos. Actual personality.",
    note: "Subtle beats loud every time.",
    src: "/media/reels/character-demo.m4a",
    mimeType: "audio/mp4",
    category: "featured",
  },
];

export const reelMicrocopy: LocalizedText[] = [
  { en: "Clean read. Heavy landing.", de: "Sauber gelesen. Schweres Landing." },
  { en: "Warm when needed. Dangerous if required.", de: "Warm, wenn nötig. Gefährlich, wenn gefordert." },
  { en: "Polished, not plastic.", de: "Poliert, nicht künstlich." },
  { en: "Rhythm matters. I don’t rush the line.", de: "Rhythmus zählt. Ich hetze keine Zeile." },
  { en: "Subtle beats loud every time.", de: "Subtil schlägt laut. Jedes Mal." },
  { en: "Real tone over fake announcer voice. Always.", de: "Echter Ton vor falscher Sprecherstimme. Immer." },
];

export const aboutPreview: LocalizedText[] = [
  {
    en: "I care about how something feels when it lands. Not just the words. The timing. The space between them. The weight behind them.",
    de: "Ich achte darauf, wie etwas wirkt, wenn es landet. Nicht nur auf die Worte. Auf das Timing. Den Raum dazwischen. Das Gewicht dahinter.",
  },
  {
    en: "I am not here to sound like a voice actor. I am here to sound like the right voice for that exact moment. Sometimes that means clean and simple. Sometimes it means darker, sharper, and more precise.",
    de: "Ich bin nicht hier, um wie ein Voice Actor zu klingen. Ich bin hier, um für genau diesen Moment die richtige Stimme zu sein. Manchmal heißt das klar und einfach. Manchmal dunkler, schärfer und präziser.",
  },
  {
    en: "Either way, it is intentional.",
    de: "So oder so: Es ist absichtlich gesetzt.",
  },
];

export const bilingualEdge = {
  title: {
    en: "Fluent in German and English, with adaptation that still sounds natural.",
    de: "Fließend in Deutsch und Englisch, mit Adaption, die trotzdem natürlich klingt.",
  },
  body: {
    en: "That matters when copy needs to move between languages without losing control, tone, or credibility. This is not a decorative skill. It is a real edge.",
    de: "Das zählt, wenn Copy zwischen Sprachen wechseln muss, ohne Kontrolle, Ton oder Glaubwürdigkeit zu verlieren. Das ist kein dekoratives Extra. Das ist ein echter Vorteil.",
  },
  badge: {
    en: "German / English",
    de: "Deutsch / Englisch",
  },
  badgeBody: {
    en: "Natural both ways. Not translated-looking. Not stiff.",
    de: "Natürlich in beide Richtungen. Nicht wie übersetzt. Nicht steif.",
  },
};

export const serviceCards: ServiceCard[] = [
  {
    id: "voiceover",
    title: "Voiceover",
    body: {
      en: "Commercials, trailers, narration, and character work. If it needs tone, timing, and presence, I bring all three.",
      de: "Commercials, Trailer, Narration und Character-Arbeit. Wenn Ton, Timing und Präsenz zählen, bringe ich alle drei.",
    },
  },
  {
    id: "operations",
    title: "Tier 3 Operations Engineer for Hire",
    body: {
      en: "Production support, incident response, infrastructure stability, and systems visibility. When it has to work, I am already thinking ahead.",
      de: "Production Support, Incident Response, Infrastrukturstabilität und System-Transparenz. Wenn es funktionieren muss, denke ich bereits voraus.",
    },
  },
  {
    id: "creative",
    title: "Creative / Collaboration",
    body: {
      en: "Campaigns, concepts, voice direction, and brand energy. Bring me in early and the work gets sharper.",
      de: "Kampagnen, Konzepte, Voice Direction und Brand-Energy. Holt mich früh rein und die Arbeit wird schärfer.",
    },
  },
  {
    id: "custom",
    title: "Custom",
    body: {
      en: "Specific, unusual, or hard-to-label projects welcome. Those tend to be the best ones.",
      de: "Spezifische, ungewöhnliche oder schwer einzuordnende Projekte sind willkommen. Genau die werden oft die besten.",
    },
  },
];

export const aboutPageCopy: LocalizedText[] = [
  {
    en: "I like things that feel real.",
    de: "Ich mag Dinge, die sich echt anfühlen.",
  },
  {
    en: "Not overdone. Not trying too hard. Not buried under noise. Just right.",
    de: "Nicht überzogen. Nicht zu bemüht. Nicht unter Lärm vergraben. Genau richtig.",
  },
  {
    en: "I have spent years around systems, pressure, and environments where details matter. That carries directly into how I approach performance, communication, and execution.",
    de: "Ich habe Jahre in Systemen, unter Druck und in Umgebungen verbracht, in denen Details zählen. Das prägt direkt, wie ich Performance, Kommunikation und Umsetzung angehe.",
  },
  {
    en: "Timing matters. Tone matters. Knowing when to pull back matters.",
    de: "Timing zählt. Ton zählt. Zu wissen, wann man zurücknimmt, zählt.",
  },
  {
    en: "The goal is simple: make it land, and make it feel like it was always supposed to sound that way.",
    de: "Das Ziel ist einfach: Es muss landen, und es muss so wirken, als hätte es immer genau so klingen sollen.",
  },
];

export const bookingIntro: LocalizedText = {
  en: "Clear briefs help. Honest timelines help. Either way, give me enough to move decisively and I will handle the rest.",
  de: "Klare Briefings helfen. Ehrliche Timelines helfen. So oder so: Geben Sie mir genug, um entschlossen zu arbeiten, und ich übernehme den Rest.",
};

export const bookingFields = [
  {
    name: "name",
    label: { en: "Name", de: "Name" },
    type: "text",
    required: true,
    minLength: 2,
  },
  {
    name: "email",
    label: { en: "Email", de: "E-Mail" },
    type: "email",
    required: true,
  },
  {
    name: "companyProject",
    label: { en: "Company / Project", de: "Unternehmen / Projekt" },
    type: "text",
    required: true,
  },
  {
    name: "workType",
    label: { en: "What are we working on?", de: "Woran arbeiten wir?" },
    type: "select",
    required: true,
    options: [
      { value: "voiceover", label: { en: "Voiceover", de: "Voiceover" } },
      {
        value: "operations",
        label: {
          en: "Tier 3 Operations Engineer for Hire",
          de: "Tier 3 Operations Engineer for Hire",
        },
      },
      { value: "creative", label: { en: "Creative / Collaboration", de: "Creative / Kollaboration" } },
      { value: "other", label: { en: "Something Else", de: "Etwas anderes" } },
    ],
  },
  {
    name: "budgetRange",
    label: { en: "Budget Range", de: "Budgetrahmen" },
    type: "text",
    required: true,
  },
  {
    name: "timeline",
    label: { en: "Timeline", de: "Zeitrahmen" },
    type: "text",
    required: true,
  },
  {
    name: "projectDetails",
    label: { en: "Project Details", de: "Projektdetails" },
    type: "textarea",
    required: true,
  },
  {
    name: "referenceLink",
    label: { en: "Script / Reference Link (Optional)", de: "Script / Referenzlink (optional)" },
    type: "url",
    required: false,
  },
] as const;

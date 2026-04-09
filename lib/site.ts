export type Locale = "en" | "de";

export type LocalizedText = Record<Locale, string>;

export type NavigationItem = {
  href: "/home" | "/about" | "/reels" | "/book";
  folio: string;
  label: LocalizedText;
  cue: LocalizedText;
};

export type ReelItem = {
  id: "cinematic" | "audiobook" | "promo" | "character";
  label: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  note: LocalizedText;
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
  "Jordan Bailey is a voice actor for games, animation, commercial, corporate, and cinematic work, with fluent English/German adaptation and Tier 3 calm when things get ugly.";
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://jordanbaileyvoice.com";

export function getLocalizedText(text: LocalizedText, locale: Locale) {
  return text[locale];
}

export const contactDetails = {
  email: "jrdnbailey23@gmail.com",
  emailHref: "mailto:jrdnbailey23@gmail.com",
  phoneDisplay: "404-913-9124",
  phoneHref: "tel:+14049139124",
  instagramHandle: "young_link3",
  instagramHref: "https://instagram.com/young_link3",
  linkedinHref: "https://www.linkedin.com/in/jordanbailey23",
};

export const navigationItems: NavigationItem[] = [
  {
    href: "/home",
    folio: "I",
    label: { en: "Home", de: "Start" },
    cue: { en: "Act I", de: "Akt I" },
  },
  {
    href: "/about",
    folio: "II",
    label: { en: "About", de: "Dossier" },
    cue: { en: "Act II", de: "Akt II" },
  },
  {
    href: "/reels",
    folio: "III",
    label: { en: "Reels", de: "Reels" },
    cue: { en: "Act III", de: "Akt III" },
  },
  {
    href: "/book",
    folio: "IV",
    label: { en: "Book", de: "Buchen" },
    cue: { en: "Act IV", de: "Akt IV" },
  },
];

export const reels: ReelItem[] = [
  {
    id: "cinematic",
    label: { en: "Cinematic", de: "Cinematic" },
    title: { en: "Cinematic", de: "Cinematic" },
    description: {
      en: "Weight, atmosphere, and enough room for the scene to breathe.",
      de: "Gewicht, Pace, Bedrohung und Zurückhaltung. Die Zeile vor dem Einschlag zählt genauso wie der Treffer.",
    },
    note: {
      en: "Smooth when it helps. Dangerous when it counts.",
      de: "Warm, wenn nötig. Gefährlich auf den Takt.",
    },
    src: "/media/reels/cinematic-demo.mp3",
    mimeType: "audio/mpeg",
    category: "featured",
    featured: true,
  },
  {
    id: "audiobook",
    label: { en: "Audiobook", de: "Hörbuch" },
    title: { en: "Audiobook", de: "Hörbuch" },
    description: {
      en: "Long-form storytelling with the patience to let scenes land. Voice you can sit with for hours.",
      de: "Langform mit Geduld. Eine Stimme, mit der man stundenlang sitzen kann, ohne dass sie ermüdet.",
    },
    note: {
      en: "Built for the long read.",
      de: "Gebaut für den langen Read.",
    },
    src: "/media/reels/audiobook-demo.mp3",
    mimeType: "audio/mpeg",
    category: "featured",
  },
  {
    id: "promo",
    label: { en: "Promo", de: "Promo" },
    title: { en: "Promo", de: "Promo" },
    description: {
      en: "Energy without turning into noise. Push where it helps. Back off where it doesn't.",
      de: "Energie mit Disziplin. Scharf genug, um zu bewegen, ohne zu Lärm zu werden.",
    },
    note: {
      en: "Quick on the turn.",
      de: "Rhythmus zählt. Ich hetze keine Zeile.",
    },
    src: "/media/reels/intro-demo.mp3",
    mimeType: "audio/mpeg",
    category: "featured",
  },
  {
    id: "character",
    label: { en: "Character", de: "Character" },
    title: { en: "Character", de: "Character" },
    description: {
      en: "Texture, point of view, and the good kind of trouble.",
      de: "Range mit Kontrolle. Nicht Chaos. Tatsächliche Persönlichkeit mit Timing dahinter.",
    },
    note: {
      en: "Range that still reads clean.",
      de: "Subtil schlägt laut. Jedes Mal.",
    },
    src: "/media/reels/character-demo.m4a",
    mimeType: "audio/mp4",
    category: "featured",
  },
];

export const reelMicrocopy: LocalizedText[] = [
  { en: "Real reads. No announcer cosplay.", de: "Echter Ton vor falscher Ansager-Energie." },
  { en: "Easy to direct. Fast on pickups.", de: "Direction-friendly und schnell bei Pickups." },
  { en: "English and German both keep the same rhythm.", de: "Englisch und Deutsch, ohne den Rhythmus zu verlieren." },
  { en: "Quiet control when the line needs teeth.", de: "Ruhige Kontrolle, wenn die Zeile Zähne braucht." },
];

export const homeHero = {
  kicker: {
    en: "Voice actor. Games, animation, cinematic. English / German.",
    de: "Sprecher. Games, Animation, Cinematic. Englisch / Deutsch.",
  },
  headline: "The performance starts when the line gets specific.",
  subhead: {
    en: "Voice for games, animation, cinematic work, and anything that needs elegance before it gets loud.",
    de: "Voice für Games, Animation, Cinematic-Arbeit und alles, was Eleganz braucht, bevor es laut wird.",
  },
  note: {
    en: "Precision over noise. Always.",
    de: "Präzision vor Lärm. Immer.",
  },
  primaryCta: { en: "Book Jordan", de: "Jordan buchen" },
  secondaryCta: { en: "Listen Now", de: "Jetzt hören" },
};

export const identityItems: LocalizedText[] = [
  { en: "games", de: "Games" },
  { en: "animation", de: "Animation" },
  { en: "cinematic", de: "Cinematic" },
  { en: "english / german", de: "Englisch / Deutsch" },
  { en: "direction-friendly", de: "direction-friendly" },
  { en: "calm under pressure", de: "ruhig unter Druck" },
];

export const aboutPreview: LocalizedText[] = [
  {
    en: "The work should feel like someone knew exactly how much force the line needed.",
    de: "Die Arbeit sollte sich so anfühlen, als hätte jemand genau gewusst, wie viel Druck die Zeile braucht.",
  },
  {
    en: "Too much performance is still bad performance. Control is the part people remember.",
    de: "Zu viel Performance ist immer noch schlechte Performance. Kontrolle ist der Teil, an den man sich erinnert.",
  },
  {
    en: "That applies in the booth, in collaboration, and when the project gets messy.",
    de: "Das gilt in der Booth, in der Zusammenarbeit und wenn das Projekt unordentlich wird.",
  },
];

export const bilingualEdge = {
  title: {
    en: "Fluent in German and English, with adaptation that still sounds natural.",
    de: "Fließend in Deutsch und Englisch, mit Adaption, die trotzdem natürlich klingt.",
  },
  body: {
    en: "If the line works in one language and falls apart in the other, the adaptation failed. This is part of the job, not a little bonus skill.",
    de: "Wenn eine Zeile in einer Sprache funktioniert und in der anderen stirbt, ist die Adaption gescheitert. Das ist echter Vorteil, keine dekorative Fußnote.",
  },
  badge: {
    en: "German / English",
    de: "Deutsch / Englisch",
  },
  badgeBody: {
    en: "Natural both ways. No translated-looking stiffness.",
    de: "Natürlich in beide Richtungen. Keine steife Übersetzungsenergie.",
  },
};

export const serviceCards: ServiceCard[] = [
  {
    id: "voiceover",
    title: "Voiceover",
    body: {
      en: "Games, animation, trailers, narration, and character work that needs control before spectacle.",
      de: "Games, Animation, Trailer, Narration und Character-Arbeit, die zuerst Kontrolle und dann Spektakel braucht.",
    },
  },
  {
    id: "operations",
    title: "Tier 3 Operations Engineer for Hire",
    body: {
      en: "Escalations, ugly incidents, brittle systems, and the people part of getting them under control.",
      de: "Eskalationen, hässliche Incidents, fragile Systeme und der menschliche Teil, sie wieder unter Kontrolle zu bekommen.",
    },
  },
  {
    id: "creative",
    title: "Creative / Collaboration",
    body: {
      en: "Voice direction, world tone, and sharp collaboration before the work gets watered down.",
      de: "Voice Direction, Welt-Ton und scharfe Kollaboration, bevor die Arbeit verwässert wird.",
    },
  },
  {
    id: "custom",
    title: "Custom",
    body: {
      en: "Specific, weird, or hard-to-label projects are usually the fun ones.",
      de: "Spezifische, seltsame oder schwer einzuordnende Projekte sind meistens die guten.",
    },
  },
];

export const aboutPageCopy: LocalizedText[] = [
  {
    en: "What matters to me most is not just how a read sounds, but whether it actually reaches out and connects with the audience. If the tone is off, the pacing feels forced, or the message gets lost, none of the rest of it matters.",
    de: "Was mir am wichtigsten ist, ist nicht nur wie ein Read klingt, sondern ob er wirklich beim Publikum ankommt. Wenn der Ton nicht stimmt, das Pacing gezwungen wirkt oder die Message verloren geht, ist der Rest egal.",
  },
  {
    en: "I find what the project is really asking for and meet you there. Sometimes that means restraint. Sometimes it means presence. Sometimes it means giving the line just enough weight to make people feel it without pushing too hard. I\u2019m not interested in doing the most. I\u2019m interested in getting it right.",
    de: "Ich finde heraus, was das Projekt wirklich braucht, und treffe dich dort. Manchmal heißt das Zurückhaltung. Manchmal Präsenz. Manchmal heißt es, der Zeile gerade genug Gewicht zu geben, damit sie ankommt, ohne zu drücken. Es geht mir nicht darum, das Maximum rauszuholen. Es geht mir darum, es richtig zu machen.",
  },
  {
    en: "I\u2019m easy to direct, quick to adjust, and serious about making sessions feel smooth from start to finish. English and German both come through naturally, with the same ear, the same care, and the same standard behind them. Book now.",
    de: "Ich bin leicht zu directen, passe mich schnell an und sorge dafür, dass Sessions von Anfang bis Ende smooth laufen. Englisch und Deutsch kommen beide natürlich rüber \u2014 mit demselben Gehör, derselben Sorgfalt und demselben Standard dahinter. Jetzt buchen.",
  },
];

export const bookingIntro: LocalizedText = {
  en: "Give me enough detail to move decisively and I will handle the rest. Clean briefs help. Honest timelines help more.",
  de: "Gib mir genug Details, damit ich entschlossen arbeiten kann, und ich übernehme den Rest. Klare Briefings helfen. Ehrliche Timelines helfen mehr.",
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

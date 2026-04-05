import type { LocalizedText } from "@/lib/site";

export type SupportCard = {
  eyebrow: LocalizedText;
  title: LocalizedText;
  body: LocalizedText;
};

export const coverContent = {
  eyebrow: {
    en: "Voice actor / English + German / Animation, Commercial, Audiobooks etc.",
    de: "Sprecher / Englisch + Deutsch / Animation, Commercial, Audiobooks etc.",
  },
  title: {
    en: "Jordan Bailey",
    de: "Jordan Bailey",
  },
  body: {
    en: "Voice work should feel locked in. Specific. Controlled. No wasted motion.",
    de: "Voice-Arbeit sollte sich so anfühlen, als hätte der Raum sich absichtlich gesammelt. Klarer Fokus. Echter Druck. Keine verschwendete Bewegung.",
  },
  enter: {
    en: "Enter",
    de: "Eintreten",
  },
  hint: {
    en: "Step into Act I.",
    de: "Tritt in Akt I ein.",
  },
};

export const pageOne = {
  folio: "I",
  cue: {
    en: "Overture",
    de: "Ouvertüre",
  },
  title: {
    en: "If I’m right for it, you’ll know fast.",
    de: "Der erste Eindruck sollte exakt, teuer und leicht gefährlich wirken.",
  },
  body: {
    en: "Games, animation, commercial. Both languages natural. Fast adjustments. Calm under pressure.",
    de: "Games, Animation, Commercial. Beide Sprachen natürlich. Schnelle Anpassung. Ruhig unter Druck.",
  },
  capabilityQuote: {
    en: "Commercial, corporate, animation. All of it.",
    de: "Commercial, Corporate, Animation. Alles davon.",
  },
  primaryCta: {
    en: "Jump to Page IV",
    de: "Direkt zu Seite IV",
  },
  secondaryCta: {
    en: "Play the reel",
    de: "Reel starten",
  },
  video: {
    eyebrow: {
      en: "First impression",
      de: "Erster Eindruck",
    },
    title: {
      en: "If you want the voice first, start here.",
      de: "Wenn du zuerst die Stimme hören willst, fang hier an.",
    },
    body: {
      en: "Easier than reading the whole page and trying to guess.",
      de: "Ist einfacher, als die ganze Seite zu lesen und dann zu raten.",
    },
    src: "/media/home/voice-impression.mp4",
    poster: "/media/home/voice-impression-poster.png",
  },
  cards: [
    {
      eyebrow: { en: "Voice first", de: "Voice zuerst" },
      title: { en: "Commercial, corporate, animation, games", de: "Games, Animation, Cinematic" },
      body: {
        en: "Funny, warm, dangerous. Still sounds human.",
        de: "Lustig, warm, bedrohlich. Klingt trotzdem menschlich.",
      },
    },
    {
      eyebrow: { en: "English / German", de: "Englisch / Deutsch" },
      title: { en: "A real edge, not a fun fact", de: "Ein echter Vorteil, keine nette Randnotiz" },
      body: {
        en: "Same tone in both languages.",
        de: "Gleicher Ton in beiden Sprachen.",
      },
    },
    {
      eyebrow: { en: "Tier 3 ops", de: "Tier-3-Ops" },
      title: { en: "Calm when the project gets weird", de: "Ruhig, wenn der Raum anfängt zu lügen" },
      body: {
        en: "Stays useful when things get loud.",
        de: "Bleibt nützlich, wenn es laut wird.",
      },
    },
  ] satisfies SupportCard[],
  reaction: {
    label: {
      en: "Visual evidence",
      de: "Reaktionsbild",
    },
    title: {
      en: "Still waiting.",
      de: "Ehrlichkeitspause",
    },
    caption: {
      en: "How I look wondering why you haven't booked me yet.",
      de: "Ich, wenn du sagst, dass du mit jemand anderem buchst.",
    },
    alt: {
      en: "Jordan Bailey leaning back in a chair wearing a hoodie and sunglasses.",
      de: "Ein Standbild von Seth aus Superbad, der beleidigt und verwirrt aussieht.",
    },
    src: "/media/home/why-havent-you-booked-me-yet.jpeg",
  },
  teaser: {
    eyebrow: {
      en: "Page II",
      de: "Seite II",
    },
    title: {
      en: "Page II is where the 'why me' part gets specific.",
      de: "Auf Seite II hört Kontrolle auf, abstrakt zu sein.",
    },
    body: {
      en: "No fake inspirational bio. Just how I work, how I take notes, and why the reads land the way they do.",
      de: "Keine Filler-Bio. Nur genug Wahrheit, um zu verstehen, wie ich arbeite, wie ich Direction aufnehme und warum Zurückhaltung in den Reads ständig auftaucht.",
    },
  },
};

export const pageTwo = {
  folio: "II",
  cue: {
    en: "Dossier",
    de: "Dossier",
  },
  title: {
    en: "Clean reads. Fast adjustments. No weird ego in the room.",
    de: "Gemessene Kraft. Saubere Reads. Kein Interesse daran, generisch zu klingen.",
  },
  intro: {
    en: "I like work with pulse. Games, animation, commercial, corporate, cinematic. Funny when it helps, grounded when it matters, and big when the line actually earns it. I take direction well, I adjust fast, and I do not make the room about me.",
    de: "Die Kurzversion: Timing zählt, Ton zählt, und die Zeile sollte einen Abdruck hinterlassen, ohne darum zu betteln. Voice ist die erste Klinge. Englisch und Deutsch sind echter Vorteil. Ops-Erfahrung ist der Grund, warum Druck den Raum nicht zerlegt.",
  },
  bilingualTitle: {
    en: "German and English. Same tone. Same standard.",
    de: "Gebaut für Skripte, die Geschmack, Timing und Druckkontrolle brauchen.",
  },
  bilingualBody: {
    en: "I don’t just speak both. I know where the line lives in both, so the read doesn’t get stiff on the way over.",
    de: "Natürlich in beide Richtungen. Nicht wie übersetzt. Nicht steif. Und definitiv kein Nebentalent.",
  },
  markers: [
    { en: "Commercial / corporate / animation / games", de: "Games, Animation, Cinematic, Promo" },
    { en: "English / German that still sounds natural", de: "Englisch / Deutsch ohne Steifheit" },
    { en: "Tier 3 calm when things go sideways", de: "Ruhig, wenn der Raum laut wird" },
  ] satisfies LocalizedText[],
  detailCards: [
    {
      en: "Give me the note and I’ll turn it fast. I’m not precious about the take.",
      de: "Direction landet besser, wenn niemand versucht, Direktionsfähigkeit zu performen.",
    },
    {
      en: "Direction is easy. Changes are quick. No ego nonsense in the middle.",
      de: "Jahre in Ops haben Klarheit, Tempo und Zurückhaltung auf die bestmögliche Weise teuer wirken lassen.",
    },
    {
      en: "I also do Tier 3 operations support for hire. If the problem is messy, high-pressure, under-documented, or already ruining everybody’s day, I can help there too.",
      de: "Tier-3-Ops-Support ist auch buchbar.",
    },
  ] satisfies LocalizedText[],
};

export const pageThree = {
  folio: "III",
  cue: {
    en: "Listen",
    de: "Hören",
  },
  title: {
    en: "Commercial. Cinematic. Character. Narration. Same standard.",
    de: "Verschiedene Spuren. Gleicher Standard. Nichts Weiches dazwischen.",
  },
  body: {
    en: "Pick a lane, hit play, and trust your gut. If it fits, you will know pretty fast.",
    de: "Das hier ist der Listening Room. Wähl die Spur, drück Play und entscheide zügig. Die Bühne wird hier absichtlich dunkler.",
  },
  heroImage: {
    src: "/media/reels/cinematic-hero-purple-mic.jpeg",
    alt: {
      en: "Jordan Bailey lit in purple beside a microphone.",
      de: "Jordan Bailey steht am Wasser mit schwarzer Cap und schwarzem Shirt.",
    },
  },
  video: {
    cue: {
      en: "First impression",
      de: "Erster Eindruck",
    },
    src: "/media/reels/reels-feature-video.mp4",
    poster: "/media/reels/reels-feature-video-poster.png",
    alt: {
      en: "A featured Jordan Bailey video clip on the reels page.",
      de: "Ein Video-Clip von Jordan Bailey auf der Reels-Seite.",
    },
  },
  waitImage: {
    src: "/media/reels/waiting-to-be-booked.jpeg",
    alt: {
      en: "A person seated at a microphone with a patient look.",
      de: "Eine Person sitzt an einem Mikrofon und wartet geduldig.",
    },
    caption: {
      en: "How I'm sitting here waiting for you to book me.",
      de: "How I'm sitting here waiting for you to book me.",
    },
  },
  tags: [
    { en: "playable reads", de: "spielbare Reads" },
    { en: "direction-friendly", de: "direction-friendly" },
    { en: "games first", de: "Games zuerst" },
    { en: "commercial + corporate too", de: "kein falscher Trailer-Aufpreis" },
  ] satisfies LocalizedText[],
};

export const pageFour = {
  folio: "IV",
  cue: {
    en: "Book",
    de: "Buchen",
  },
  title: {
    en: "Send the brief. I’ll take it from there.",
    de: "Schick das Briefing. Ich übernehme ab da.",
  },
  availabilityQuote: {
    en: "I am availble for booking right now! Please send me and email and let's get to work on your next project!",
    de: "Ich bin gerade für Buchungen verfügbar!",
  },
  body: {
    en: "Send the brief, the messy note, the half-finished thought, the reference link at 1:13. If it is commercial, corporate, animation, games, or something harder to label, send it.",
    de: "Scope, Usage, Ton, Timing und was die Arbeit leisten soll. Je sauberer das Briefing, desto schneller der Handoff. Wenn das Briefing noch halb Chaos ist, schick es trotzdem.",
  },
  heroImage: {
    src: "/media/performance-book/book-hero-portrait.jpeg",
    alt: {
      en: "Jordan Bailey leaning on a railing at sunset overlooking the water.",
      de: "Jordan Bailey lehnt bei Sonnenuntergang an einem Geländer mit Blick aufs Wasser.",
    },
  },
  formMarkers: [
    { en: "voice work", de: "Voice-Arbeit" },
    { en: "EN / DE adaptation", de: "EN / DE Adaption" },
    { en: "games, animation, cinematic", de: "Games, Animation, Cinematic" },
  ] satisfies LocalizedText[],
  duoCaption: {
    en: "The second you hit \"book now\" we'll start cooking up!",
    de: "So sehen wir aus, wenn wir dein Projekt kochen.",
  },
  duoImages: [
    {
      src: "/media/performance-book/customer-mike.jpeg",
      alt: {
        en: "Mike Wazowski looking tired and overwhelmed.",
        de: "Mike Wazowski sieht müde und überfordert aus.",
      },
      label: {
        en: "You, sending the brief",
        de: "Du, der Kunde",
      },
    },
    {
      src: "/media/performance-book/jordan-jerry.jpeg",
      alt: {
        en: "Jerry from Tom and Jerry looking smug and pleased.",
        de: "Jerry aus Tom und Jerry sieht zufrieden und selbstgefällig aus.",
      },
      label: {
        en: "Me, already cooking",
        de: "Ich, komplett im Tunnel",
      },
    },
  ] satisfies Array<{ src: string; alt: LocalizedText; label: LocalizedText }>,
};

export const reelsShowcaseCopy = {
  homeEyebrow: { en: "Featured reel", de: "Featured Reel" },
  homeTitle: { en: "Hit play before you keep scrolling.", de: "Drück Play, bevor du weiter scrollst." },
  homeDescription: {
    en: "You will know pretty quickly if this is the right fit.",
    de: "Die Idee ist einfach: Hör die Arbeit früh und triff die Entscheidung schnell.",
  },
  pageEyebrow: { en: "Listening lanes", de: "Listening-Lanes" },
  pageTitle: {
    en: "Pick a lane and let the work speak for itself.",
    de: "Wähl die Spur und lass die Stimme überzeugen.",
  },
  pageDescription: {
    en: "Commercial, cinematic, character, narration, promo. Different jobs. Same standard.",
    de: "Character, Cinematic, Narration, Promo, Commercial. Gleiche Stimme. Andere Druckkurven.",
  },
  panelTitle: {
    en: "Not doing the fake announcer thing.",
    de: "Keine falsche Ansagerstimme.",
  },
  panelBody: {
    en: "Commercial, corporate, games, animation, whatever lane you throw me in, I’m not sanding all the personality off it first.",
    de: "Wähl die Spur und ich treffe sie, ohne vorher jede Persönlichkeit wegzuschleifen.",
  },
  bullets: [
    { en: "Easy to direct. Fast on pickups.", de: "Direction-friendly und schnell bei Pickups." },
    { en: "Commercial and corporate without sounding like a salesman.", de: "Echter Ton vor falschem Hochglanz." },
    { en: "Can be funny. Can bite. Depends what the read needs.", de: "Ruhige Kontrolle, wenn die Zeile Zähne braucht." },
    { en: "English and German both keep the same rhythm.", de: "Englisch und Deutsch, ohne den Rhythmus zu verlieren." },
  ] satisfies LocalizedText[],
  footer: {
    en: "Real reads. No announcer cosplay.",
    de: "Echter Ton vor falscher Ansager-Energie. Immer.",
  },
};

export const contactCopy = {
  eyebrow: {
    en: "Last page",
    de: "Letzte Seite",
  },
  title: {
    en: "If it already sounds right in your head, you probably do not need a sales pitch from me.",
    de: "Wenn es in deinem Kopf schon richtig klingt, ist Seite IV der Move.",
  },
  body: {
    en: "Email, call, or use the booking page. Send the brief or the half-brief. We can sort it out fast.",
    de: "Mail, Anruf oder die Booking-Seite. Der Punkt ist, sich zu bewegen, solange die Idee noch Hitze hat.",
  },
};

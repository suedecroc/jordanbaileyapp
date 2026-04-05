import type { LocalizedText } from "@/lib/site";

export type SupportCard = {
  eyebrow: LocalizedText;
  title: LocalizedText;
  body: LocalizedText;
};

export const coverContent = {
  eyebrow: {
    en: "Voice actor / English + German / Games, Animation, Commercial",
    de: "Sprecher / Englisch + Deutsch / Games, Animation, Commercial",
  },
  title: {
    en: "You'll know in the first read.",
    de: "Du weißt es beim ersten Read.",
  },
  body: {
    en: "Jordan Bailey. Voice actor with presence, control, and range. Easy to direct. Hard to forget.",
    de: "Jordan Bailey. Sprecher mit Präsenz, Kontrolle und Range. Leicht zu lenken. Schwer zu vergessen.",
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
    en: "Tier 3 Operations taught me how to stay calm when everything gets loud.",
    de: "Tier-3-Ops haben mir beigebracht, wie man ruhig bleibt, wenn alles laut wird.",
  },
  body: {
    en: "That carries over. Sessions stay focused. Direction lands. Work gets done. English and German both sound right. Not close. Right.",
    de: "Das überträgt sich. Sessions bleiben fokussiert. Direction sitzt. Arbeit wird gemacht. Englisch und Deutsch klingen beide richtig. Nicht fast. Richtig.",
  },
  capabilityQuote: {
    en: "Presence, control, range.",
    de: "Präsenz, Kontrolle, Range.",
  },
  primaryCta: {
    en: "Play the work",
    de: "Arbeit hören",
  },
  secondaryCta: {
    en: "Book me",
    de: "Jetzt buchen",
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
  cards: [] satisfies SupportCard[],
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
    en: "I'm a voice actor with a background in high-pressure technical environments.",
    de: "Ich bin Sprecher mit Erfahrung in stressigen, technischen Umgebungen.",
  },
  intro: {
    en: "Tier 3 Operations, escalations, systems that don't behave. That's where I learned how to stay calm, listen closely, and adjust fast. It translates well. Sessions stay clean. Direction lands quickly. My reads are controlled, intentional, and just the way you asked. I'm not here to overcomplicate things. I'm here to get it right.",
    de: "Tier-3-Ops, Eskalationen, Systeme die nicht mitspielen. Dort habe ich gelernt, wie man ruhig bleibt, genau zuhört und schnell anpasst. Das überträgt sich. Sessions laufen sauber. Direction sitzt schnell. Meine Reads sind kontrolliert, gewollt und genau wie du es brauchst. Ich bin nicht hier, um Dinge kompliziert zu machen. Ich bin hier, um es richtig zu machen.",
  },
  bilingualTitle: {
    en: "I work in English and German at a native level.",
    de: "Ich arbeite auf Muttersprachler-Niveau auf Englisch und Deutsch.",
  },
  bilingualBody: {
    en: "If the tone matters, it carries in both.",
    de: "Wenn der Ton zählt, dann sitzt er in beiden Sprachen.",
  },
  markers: [
    { en: "Games, animation, commercial, cinematic", de: "Games, Animation, Commercial, Cinematic" },
    { en: "English and German", de: "Englisch und Deutsch" },
    { en: "Tier 3 Ops experience", de: "Tier-3-Ops Erfahrung" },
  ] satisfies LocalizedText[],
  detailCards: [] satisfies LocalizedText[],
  primaryCta: {
    en: "Book now",
    de: "Jetzt buchen",
  },
};

export const pageThree = {
  folio: "III",
  cue: {
    en: "Listen",
    de: "Hören",
  },
  title: {
    en: "Pick a lane and let the work speak for itself.",
    de: "Wähl die Spur und lass die Arbeit für sich sprechen.",
  },
  body: {
    en: "Whatever lane you choose, it holds up. Same control. Same attention to detail.",
    de: "Egal welche Spur du wählst, sie sitzt. Gleiche Kontrolle. Gleiche Aufmerksamkeit zum Detail.",
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
    en: "Let’s get to work",
    de: "Lass uns arbeiten",
  },
  availabilityQuote: {
    en: "You don’t need a long pitch. You just need the right voice.",
    de: "Du brauchst keinen langen Pitch. Du brauchst nur die richtige Stimme.",
  },
  body: {
    en: "Send what you’ve got. Script, references, direction. I’ll meet you there and make it land. I’m quick to adjust, easy to work with and even easier to book.",
    de: "Schick, was du hast. Script, Referenzen, Direction. Ich treffe dich dort und mache es landen. Ich bin schnell anpassbar, einfach zu arbeiten und noch einfacher zu buchen.",
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
    { en: "Tier 3 Ops if needed", de: "Tier-3-Ops wenn nötig" },
    { en: "games, animation, cinematic", de: "Games, Animation, Cinematic" },
  ] satisfies LocalizedText[],
  duoCaption: {
    en: "The second you hit \"book now\" we'll start cooking up!",
    de: "Sobald du auf Buchen klickst, fangen wir an!",
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
    en: "You're here. Now let's book.",
    de: "Du bist hier. Lass uns jetzt buchen.",
  },
  body: {
    en: "Email, call, or use the booking form. Whatever works. jordan@jordanbaileyvoice.com or 678-559-9787.",
    de: "Mail, Anruf oder Booking-Formular. Was für dich passt. jordan@jordanbaileyvoice.com oder 678-559-9787.",
  },
};

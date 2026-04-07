"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { FadeIn } from "@/components/fade-in";
import { useLanguage } from "@/components/language-provider";
import { ReelsShowcase } from "@/components/reels-showcase";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { pageThree } from "@/lib/home";
import { getLocalizedText } from "@/lib/site";

export function ReelsPage() {
  const { locale } = useLanguage();

  return (
    <section className="section-anchor pb-8 pt-3 sm:pb-10 sm:pt-4">
      <Container>
        <div className="book-page book-page--paper p-5 sm:p-7 lg:p-8">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,0.78fr)_minmax(320px,0.58fr)] xl:items-start">
            <FadeIn>
              <div>
                <div className="book-page__number">
                  <span className="folio-pill">{pageThree.folio}</span>
                  <p className="cue-label">{getLocalizedText(pageThree.cue, locale)}</p>
                </div>
                <h1 className="mt-5 max-w-[13ch] font-serif text-[2.85rem] leading-[0.9] tracking-[0.01em] text-foreground sm:text-[3.8rem]">
                  {getLocalizedText(pageThree.title, locale)}
                </h1>
                <p className="mt-4 max-w-[35rem] text-base leading-7 text-muted-strong sm:text-lg sm:leading-8">
                  {getLocalizedText(pageThree.body, locale)}
                </p>
                <p className="stage-epigraph mt-6">
                  I am a singer without a song
                </p>
                <div className="mt-7">
                  <ButtonLink href="/book">
                    {getLocalizedText(
                      { en: "If it hits, book it", de: "Wenn es landet, buch es" },
                      locale,
                    )}
                    <ArrowRight className="ml-3 h-4 w-4" />
                  </ButtonLink>
                </div>

                <div className="reels-left-tags mt-8">
                  {pageThree.tags.map((tag) => (
                    <span key={tag.en} className="paper-tag paper-tag--soft">
                      {getLocalizedText(tag, locale)}
                    </span>
                  ))}
                </div>

                <div className="reels-left-card mt-6">
                  <p className="cue-label">{getLocalizedText({ en: "What you can expect", de: "Was du erwarten kannst" }, locale)}</p>
                  <p className="mt-3 text-base leading-7 text-muted">
                    {getLocalizedText(
                      {
                        en: "Every read carries its own tone. I find it quick and stay in the pocket. Just the right energy, delivered just the way you imagined.",
                        de: "Jeder Read hat seinen eigenen Ton. Ich finde ihn schnell und bleibe drin. Genau die richtige Energie, genau so wie du es dir vorgestellt hast.",
                      },
                      locale,
                    )}
                  </p>
                  <div className="stage-rule mt-5" />
                  <p className="mt-5 text-base leading-7 text-muted">
                    {getLocalizedText(
                      {
                        en: "I know when to leave space and when to take control of it. Pacing isn't a technique. It's instinct.",
                        de: "Ich weiß, wann ich Raum lasse und wann ich ihn übernehme. Pacing ist keine Technik. Es ist Instinkt.",
                      },
                      locale,
                    )}
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <div className="reels-side-stack">
                <div className="hero-portrait min-h-[360px] sm:min-h-[420px]">
                  <Image
                    src={pageThree.heroImage.src}
                    alt={getLocalizedText(pageThree.heroImage.alt, locale)}
                    width={1200}
                    height={1600}
                    priority
                    sizes="(max-width: 1279px) 100vw, 38vw"
                    className="h-full min-h-[360px] w-full object-cover object-[center_28%] sm:min-h-[420px]"
                  />
                </div>

                <figure className="reels-side-figure">
                  <div className="hero-portrait aspect-square">
                    <Image
                      src={pageThree.waitImage.src}
                      alt={getLocalizedText(pageThree.waitImage.alt, locale)}
                      width={1284}
                      height={1264}
                      sizes="(max-width: 1279px) 100vw, 38vw"
                      className="h-full w-full object-cover object-[center_18%]"
                    />
                  </div>
                  <figcaption className="reels-side-caption mt-3 text-sm leading-6 text-muted">
                    {getLocalizedText(pageThree.waitImage.caption, locale)}
                  </figcaption>
                </figure>

                <div className="panel-soft reels-video-card rounded-[1.05rem] p-3.5 sm:rounded-[1.15rem] sm:p-5">
                  <p className="cue-label">
                    {getLocalizedText(pageThree.video.cue, locale)}
                  </p>
                  <div className="reels-video-frame mt-4">
                    <video
                      className="reels-video"
                      controls
                      playsInline
                      muted
                      preload="metadata"
                      poster={pageThree.video.poster}
                      aria-label={getLocalizedText(pageThree.video.alt, locale)}
                    >
                      <source src={pageThree.video.src} type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="stage-rule mt-7" />

          <div className="listening-stage mt-7">
            <ReelsShowcase mode="page" />
          </div>
        </div>
      </Container>
    </section>
  );
}

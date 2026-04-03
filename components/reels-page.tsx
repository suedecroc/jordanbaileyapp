"use client";

import { ContactStrip } from "@/components/contact-strip";
import { ReelsShowcase } from "@/components/reels-showcase";
import { FadeIn } from "@/components/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { Container } from "@/components/ui/container";
import { reels } from "@/lib/site";

export function ReelsPage() {
  return (
    <>
      <section className="section-anchor py-16 sm:py-24">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="Reels"
              title="The work."
              description="Different tones. Same standard. It has to land."
            />
          </FadeIn>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {reels.map((reel, index) => (
              <FadeIn key={reel.id} delay={index * 0.04}>
                <article className="panel-soft h-full rounded-[1.5rem] p-5">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-accent">
                    {reel.label.en}
                  </p>
                  <h3 className="mt-4 font-serif text-[2rem] leading-none text-foreground">{reel.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-muted">{reel.description}</p>
                </article>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <ReelsShowcase mode="page" />
      <ContactStrip />
    </>
  );
}

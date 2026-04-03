"use client";

import { BookingForm } from "@/components/booking-form";
import { ContactStrip } from "@/components/contact-strip";
import { FadeIn } from "@/components/fade-in";
import { useLanguage } from "@/components/language-provider";
import { SectionHeading } from "@/components/section-heading";
import { Container } from "@/components/ui/container";
import { bookingIntro, getLocalizedText } from "@/lib/site";

export function BookPage() {
  const { locale } = useLanguage();

  return (
    <>
      <section className="section-anchor py-16 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.75fr)]">
            <FadeIn>
              <div>
                <SectionHeading
                  eyebrow="Book Jordan"
                  title="Give me the details. I’ll take it from there."
                  description={getLocalizedText(bookingIntro, locale)}
                />
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <BookingForm />
            </FadeIn>
          </div>
        </Container>
      </section>

      <ContactStrip />
    </>
  );
}

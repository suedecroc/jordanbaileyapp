"use client";

import { ArrowRight, BriefcaseBusiness, Camera, Mail, Phone } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { contactDetails, getLocalizedText } from "@/lib/site";

const actions = [
  {
    label: { en: "Email Jordan", de: "Jordan mailen" },
    href: contactDetails.emailHref,
    icon: Mail,
  },
  {
    label: { en: "Call Jordan", de: "Jordan anrufen" },
    href: contactDetails.phoneHref,
    icon: Phone,
  },
  {
    label: { en: "Instagram", de: "Instagram" },
    href: contactDetails.instagramHref,
    icon: Camera,
  },
  {
    label: { en: "LinkedIn", de: "LinkedIn" },
    href: contactDetails.linkedinHref,
    icon: BriefcaseBusiness,
  },
];

export function ContactStrip() {
  const { locale } = useLanguage();

  return (
    <section className="section-anchor py-16 sm:py-24" id="contact">
      <Container>
        <div className="panel rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10 lg:flex lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-accent">Contact</p>
            <h2 className="mt-4 font-serif text-4xl leading-none text-foreground sm:text-5xl">
              {getLocalizedText({ en: "You already know if this fits.", de: "Sie wissen schon, ob das passt." }, locale)}
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted">
              {getLocalizedText({ en: "If it sounds right, let’s move.", de: "Wenn es passt, gehen wir los." }, locale)}
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:mt-0 lg:min-w-[420px]">
            {actions.map((action) => {
              const Icon = action.icon;

              return (
                <ButtonLink key={action.href} href={action.href} variant="secondary" className="justify-between">
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {getLocalizedText(action.label, locale)}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

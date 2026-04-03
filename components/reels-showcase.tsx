"use client";

import { motion } from "framer-motion";
import { Radio, Sparkles } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import { useLanguage } from "@/components/language-provider";
import { ReelPlayer } from "@/components/reel-player";
import { SectionHeading } from "@/components/section-heading";
import { Container } from "@/components/ui/container";
import { getLocalizedText, reelMicrocopy, reels } from "@/lib/site";
import { cn } from "@/lib/utils";

export function ReelsShowcase({
  mode = "home",
}: {
  mode?: "home" | "page";
}) {
  const { locale } = useLanguage();
  const [activeId, setActiveId] = useState(reels[0]?.id ?? "commercial");
  const [isPending, transition] = useTransition();

  const activeReel = useMemo(
    () => reels.find((reel) => reel.id === activeId) ?? reels[0],
    [activeId],
  );

  return (
    <section className="section-anchor py-16 sm:py-24" id={mode === "home" ? "featured-reels" : undefined}>
      <Container>
        {mode === "home" ? (
          <SectionHeading
            eyebrow="Featured reels"
            title="Listen first. Decide fast."
            description="Different tones. Same standard. It has to land."
          />
        ) : (
          <SectionHeading
            eyebrow="The work"
            title="Different tones. Same standard. It has to land."
            description="Clean playback, quick reads, and no filler between the decision and the listen."
          />
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.84fr)_minmax(320px,0.42fr)] lg:items-start">
          <motion.div
            key={activeReel.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <ReelPlayer reel={activeReel} />
          </motion.div>

          <div className="space-y-4">
            <div className="panel-soft rounded-[1.75rem] p-4">
              <div className="flex flex-wrap gap-3">
                {reels.map((reel) => {
                  const active = reel.id === activeId;
                  return (
                    <button
                      key={reel.id}
                      type="button"
                      onClick={() => transition(() => setActiveId(reel.id))}
                      className={cn(
                        "rounded-full border px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em]",
                        active
                          ? "border-[rgba(240,213,168,0.3)] bg-[rgba(240,213,168,0.1)] text-foreground"
                          : "border-[var(--line)] text-muted hover:border-[var(--line-strong)] hover:text-foreground",
                      )}
                      aria-pressed={active}
                    >
                      {getLocalizedText(reel.label, locale)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4">
              {reelMicrocopy.map((item) => (
                <div key={item.en} className="panel-soft rounded-[1.5rem] p-4">
                  <div className="flex items-start gap-3">
                    {item.en.includes("Rhythm") ? (
                      <Radio className="mt-1 h-4 w-4 text-accent" />
                    ) : (
                      <Sparkles className="mt-1 h-4 w-4 text-accent" />
                    )}
                    <p className="text-sm leading-6 text-muted-strong">{getLocalizedText(item, locale)}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="px-1 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-muted">
              {isPending ? "Loading the next lane." : "Real tone over fake announcer voice. Always."}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

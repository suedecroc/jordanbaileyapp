"use client";

import { useActionState, useEffect, useRef } from "react";
import { ArrowRight, Mail } from "lucide-react";

import { submitBookingRequest } from "@/app/actions";
import { useLanguage } from "@/components/language-provider";
import { ButtonLink } from "@/components/ui/button-link";
import { contactDetails, getLocalizedText } from "@/lib/site";
import { initialBookingFormState } from "@/lib/validation";
import { cn } from "@/lib/utils";

function FieldError({
  errors,
}: {
  errors?: string[];
}) {
  if (!errors?.length) {
    return null;
  }

  return <p className="mt-2 text-sm text-[#f1be9c]">{errors[0]}</p>;
}

export function BookingForm() {
  const { locale } = useLanguage();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [state, formAction, pending] = useActionState(
    submitBookingRequest,
    initialBookingFormState,
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <div className="sheet-card rounded-[1.9rem] p-5 sm:p-6">
      <form ref={formRef} action={formAction} className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="form-field block">
            <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted">
              {getLocalizedText({ en: "Name", de: "Name" }, locale)}
            </span>
            <input
              name="name"
              type="text"
              required
              minLength={2}
              className="input-shell"
            />
            <FieldError errors={state.fieldErrors.name} />
          </label>
          <label className="form-field block">
            <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted">
              {getLocalizedText({ en: "Email", de: "E-Mail" }, locale)}
            </span>
            <input
              name="email"
              type="email"
              required
              className="input-shell"
            />
            <FieldError errors={state.fieldErrors.email} />
          </label>
        </div>

        <input
          type="text"
          name="honeypot"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        {state.message ? (
          <div
            className={cn(
              "rounded-[1.35rem] border px-4 py-4 text-sm leading-6 form-success-enter",
              state.status === "success"
                ? "border-[rgba(111,67,35,0.14)] bg-[rgba(255,255,255,0.72)] text-foreground"
                : "border-[rgba(149,94,63,0.18)] bg-[rgba(252,244,236,0.86)] text-[var(--paper-ink)]",
            )}
            aria-live="polite"
          >
            <p className="font-semibold uppercase tracking-[0.18em]">
              {state.status === "success"
                ? locale === "de"
                  ? "Verstanden."
                  : "Got it."
                : locale === "de"
                  ? "Details schärfen."
                  : "Tighten the details."}
            </p>
            <p className="mt-2">{state.message}</p>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={pending}
            className="button-rail inline-flex min-h-[3.35rem] flex-1 items-center justify-center px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? (
              locale === "de" ? (
                "Wird gesendet"
              ) : (
                "Sending request"
              )
            ) : (
              <>
                {getLocalizedText({ en: "Send Request", de: "Anfrage senden" }, locale)}
                <ArrowRight className="ml-3 h-4 w-4" />
              </>
            )}
          </button>
          <ButtonLink
            href={contactDetails.emailHref}
            variant="secondary"
            className="inline-flex min-h-[3.35rem] items-center justify-center px-6 py-3"
          >
            <Mail className="mr-3 h-4 w-4" />
            {getLocalizedText({ en: "Email Jordan", de: "Jordan mailen" }, locale)}
          </ButtonLink>
        </div>
      </form>
    </div>
  );
}

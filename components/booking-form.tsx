"use client";

import { useActionState, useEffect, useRef } from "react";
import { ArrowRight, Mail, Phone } from "lucide-react";

import { submitBookingRequest } from "@/app/actions";
import { useLanguage } from "@/components/language-provider";
import { ButtonLink } from "@/components/ui/button-link";
import { bookingFields, contactDetails, getLocalizedText } from "@/lib/site";
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
          {bookingFields.slice(0, 2).map((field) => (
            <label key={field.name} className="block">
              <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted">
                {getLocalizedText(field.label, locale)}
              </span>
              <input
                name={field.name}
                type={field.type}
                required={field.required}
                minLength={"minLength" in field ? field.minLength : undefined}
                className="input-shell"
              />
              <FieldError errors={state.fieldErrors[field.name]} />
            </label>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {bookingFields.slice(2, 4).map((field) =>
            field.type === "select" ? (
              <label key={field.name} className="block">
                <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted">
                  {getLocalizedText(field.label, locale)}
                </span>
                <select
                  name={field.name}
                  required={field.required}
                  defaultValue=""
                  className="input-shell"
                >
                  <option value="" disabled>
                    {locale === "de" ? "Bitte auswählen" : "Select one"}
                  </option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {getLocalizedText(option.label, locale)}
                    </option>
                  ))}
                </select>
                <FieldError errors={state.fieldErrors[field.name]} />
              </label>
            ) : (
              <label key={field.name} className="block">
                <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted">
                  {getLocalizedText(field.label, locale)}
                </span>
                <input
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  className="input-shell"
                />
                <FieldError errors={state.fieldErrors[field.name]} />
              </label>
            ),
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {bookingFields.slice(4, 6).map((field) => (
            <label key={field.name} className="block">
              <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted">
                {getLocalizedText(field.label, locale)}
              </span>
              <input
                name={field.name}
                type={field.type}
                required={field.required}
                className="input-shell"
              />
              <FieldError errors={state.fieldErrors[field.name]} />
            </label>
          ))}
        </div>

        <label className="block">
          <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted">
            {getLocalizedText(bookingFields[6].label, locale)}
          </span>
          <textarea
            name="projectDetails"
            required
            minLength={24}
            rows={6}
            className="input-shell min-h-[11rem] resize-y"
          />
          <FieldError errors={state.fieldErrors.projectDetails} />
        </label>

        <label className="block">
          <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted">
            {getLocalizedText(bookingFields[7].label, locale)}
          </span>
          <input name="referenceLink" type="url" className="input-shell" />
          <FieldError errors={state.fieldErrors.referenceLink} />
        </label>

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
              "rounded-[1.35rem] border px-4 py-4 text-sm leading-6",
              state.status === "success"
                ? "border-[rgba(111,67,35,0.14)] bg-[rgba(255,255,255,0.72)] text-foreground"
                : state.status === "fallback"
                  ? "border-[rgba(149,94,63,0.18)] bg-[rgba(252,244,236,0.86)] text-[var(--paper-ink)]"
                  : "border-[rgba(149,94,63,0.18)] bg-[rgba(252,244,236,0.86)] text-[var(--paper-ink)]",
            )}
            aria-live="polite"
          >
            <p className="font-semibold uppercase tracking-[0.18em]">
              {state.status === "success"
                ? locale === "de"
                  ? "Verstanden."
                  : "Got it."
                : state.status === "fallback"
                  ? locale === "de"
                    ? "Direkter Ausweg."
                    : "Direct fallback."
                  : locale === "de"
                    ? "Details schärfen."
                    : "Tighten the details."}
            </p>
            <p className="mt-2">{state.message}</p>

            {state.status === "fallback" ? (
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={contactDetails.emailHref} variant="secondary">
                  <Mail className="mr-3 h-4 w-4" />
                  {getLocalizedText({ en: "Email Jordan", de: "Jordan mailen" }, locale)}
                </ButtonLink>
                <ButtonLink href={contactDetails.phoneHref} variant="secondary">
                  <Phone className="mr-3 h-4 w-4" />
                  {getLocalizedText({ en: "Call Jordan", de: "Jordan anrufen" }, locale)}
                </ButtonLink>
              </div>
            ) : null}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="button-rail inline-flex min-h-[3.35rem] items-center justify-center px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] disabled:cursor-not-allowed disabled:opacity-70"
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
      </form>
    </div>
  );
}

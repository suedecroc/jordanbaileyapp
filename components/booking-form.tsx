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
  const [state, formAction, pending] = useActionState(submitBookingRequest, initialBookingFormState);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <div className="panel rounded-[2rem] p-6 sm:p-8">
      <form ref={formRef} action={formAction} className="grid gap-5" noValidate={false}>
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
                className="w-full rounded-[1.25rem] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] px-4 py-3.5 text-base text-foreground placeholder:text-[rgba(244,237,224,0.32)]"
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
                  className="w-full rounded-[1.25rem] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] px-4 py-3.5 text-base text-foreground"
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
                  className="w-full rounded-[1.25rem] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] px-4 py-3.5 text-base text-foreground placeholder:text-[rgba(244,237,224,0.32)]"
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
                className="w-full rounded-[1.25rem] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] px-4 py-3.5 text-base text-foreground placeholder:text-[rgba(244,237,224,0.32)]"
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
            className="w-full rounded-[1.25rem] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] px-4 py-3.5 text-base text-foreground placeholder:text-[rgba(244,237,224,0.32)]"
          />
          <FieldError errors={state.fieldErrors.projectDetails} />
        </label>

        <label className="block">
          <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted">
            {getLocalizedText(bookingFields[7].label, locale)}
          </span>
          <input
            name="referenceLink"
            type="url"
            className="w-full rounded-[1.25rem] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] px-4 py-3.5 text-base text-foreground placeholder:text-[rgba(244,237,224,0.32)]"
          />
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
                ? "border-[rgba(240,213,168,0.22)] bg-[rgba(240,213,168,0.08)] text-foreground"
                : state.status === "fallback"
                  ? "border-[rgba(241,190,156,0.22)] bg-[rgba(241,190,156,0.08)] text-[#ffe0cd]"
                  : "border-[rgba(241,190,156,0.22)] bg-[rgba(241,190,156,0.08)] text-[#ffd9bf]",
            )}
            aria-live="polite"
          >
            <p className="font-semibold uppercase tracking-[0.18em]">
              {state.status === "success" ? "Got it." : state.status === "fallback" ? "Direct fallback." : "Tighten the details."}
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
          className="button-shine relative inline-flex min-h-13 items-center justify-center rounded-full border border-[rgba(240,213,168,0.34)] bg-[linear-gradient(180deg,#f3dfbb_0%,#dfbe86_34%,#b88d52_100%)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#1a130b] shadow-[0_18px_38px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.36)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? (
            locale === "de" ? "Wird gesendet" : "Sending request"
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

"use server";

import { sendBookingEmail } from "@/lib/mail";
import {
  bookingClientFieldNames,
  bookingFormSchema,
  type BookingFormState,
  initialBookingFormState,
} from "@/lib/validation";

function getValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function submitBookingRequest(
  _previousState: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const rawValues = Object.fromEntries(
    bookingClientFieldNames.map((name) => [name, getValue(formData, name)]),
  );

  if (rawValues.honeypot) {
    return {
      ...initialBookingFormState,
      status: "success",
      message: "Got it. I’ll take a look and get back to you shortly. If it’s a fit, we move fast.",
    };
  }

  const parsed = bookingFormSchema.safeParse(rawValues);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    return {
      status: "error",
      message: "Take another pass through the form and tighten the details where needed.",
      fieldErrors,
    };
  }

  const result = await sendBookingEmail(parsed.data);

  if (!result.ok) {
    return {
      status: "fallback",
      message:
        "The direct form handoff is not available right now. Use Email Jordan or Call Jordan below and we can still move quickly.",
      fieldErrors: {},
    };
  }

  return {
    status: "success",
    message: "Got it. I’ll take a look and get back to you shortly. If it’s a fit, we move fast.",
    fieldErrors: {},
  };
}

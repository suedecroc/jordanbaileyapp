import { Resend } from "resend";

import type { BookingFormValues } from "@/lib/validation";

type MailResult = {
  ok: boolean;
};

export async function sendBookingEmail(payload: BookingFormValues): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.BOOKING_FROM_EMAIL;
  const toEmail = process.env.BOOKING_TO_EMAIL || "jrdnbailey23@gmail.com";

  if (!apiKey || !fromEmail) {
    return { ok: false };
  }

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: payload.email,
      subject: `Booking request: ${payload.workType} | ${payload.name}`,
      text: [
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        `Company / Project: ${payload.companyProject}`,
        `Work type: ${payload.workType}`,
        `Budget range: ${payload.budgetRange}`,
        `Timeline: ${payload.timeline}`,
        `Project details: ${payload.projectDetails}`,
        `Reference link: ${payload.referenceLink || "Not provided"}`,
      ].join("\n"),
    });

    return { ok: true };
  } catch {
    return { ok: false };
  }
}

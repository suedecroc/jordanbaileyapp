import type { BookingFormValues } from "@/lib/validation";

type MailResult = {
  ok: boolean;
};

export async function sendBookingEmail(payload: BookingFormValues): Promise<MailResult> {
  const FORMSPREE_ID = "mvzvabnk";

  try {
    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        companyProject: payload.companyProject,
        workType: payload.workType,
        budgetRange: payload.budgetRange,
        timeline: payload.timeline,
        projectDetails: payload.projectDetails,
        referenceLink: payload.referenceLink || "Not provided",
        _subject: `Booking request: ${payload.workType} | ${payload.name}`,
      }),
    });

    return { ok: response.ok };
  } catch {
    return { ok: false };
  }
}

import { z } from "zod";

export const bookingClientFieldNames = [
  "name",
  "email",
  "companyProject",
  "workType",
  "budgetRange",
  "timeline",
  "projectDetails",
  "referenceLink",
  "honeypot",
] as const;

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || "")
  .refine((value) => value === "" || /^https?:\/\/.+/i.test(value), {
    message: "Use a full URL when adding a reference link.",
  });

export const bookingFormSchema = z.object({
  name: z.string().trim().min(2, "Add a real name so I know who is reaching out."),
  email: z.string().trim().email("Use a valid email address."),
  companyProject: z.string().trim().min(2, "Add the company or project name."),
  workType: z.string().trim().min(1, "Choose the lane we are working in."),
  budgetRange: z.string().trim().min(2, "Share at least a rough budget range."),
  timeline: z.string().trim().min(2, "Add the timeline so I can judge the pace."),
  projectDetails: z
    .string()
    .trim()
    .min(24, "Give me enough detail to understand the scope quickly."),
  referenceLink: optionalUrl,
  honeypot: z.string().optional().default(""),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export type BookingFormState = {
  status: "idle" | "success" | "error" | "fallback";
  message: string;
  fieldErrors: Partial<Record<(typeof bookingClientFieldNames)[number], string[]>>;
};

export const initialBookingFormState: BookingFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

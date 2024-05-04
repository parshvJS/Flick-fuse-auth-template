import { Resend } from "resend";

export const resend = new Resend(process.env.EMAIL_RESENT_API)
import { resend } from "@/lib/resend_email";
import { ApiResponse } from "@/types/ApiResponse";
import EmailVerification from "../../email_templates/EmailVerification";

export async function sentVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const sentEmail = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'FeedHub | Email Verification OTP',
            react: EmailVerification({ username, otp: verifyCode })
        });
        if (sentEmail) {
            return {
                success: true,
                message: "Email Sented successfully !"
            }
        }
        return {
            success: false,
            message:"something went wrong !" 
        }
    } catch (error: any) {
        console.log("Error while senting email : ", error.message);
        return {
            success: false,
            message: "cant sent email !"
        };
    }
}
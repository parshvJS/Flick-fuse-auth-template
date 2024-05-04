import { z } from 'zod';

export const usernameValidate = z.string()
    .min(5, { message: "Minimum 5 characters !" })
    .max(30, { message: "More than 30 characters not allowed !" });

export const signUpSchema = z.object({
    username: usernameValidate,

    email: z.string().email(),

    password: z.string()
        .min(6, { message: "Minimum 6 characters !" })
        .max(30, { message: "More than 30 characters not allowed !" }),

})
import { z } from 'zod';

export const verifySchema = z.object({
    code:z
    .string()
    .length(6,{message:"Please Enter Valid Verification Code !"})
})
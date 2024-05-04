import { z } from 'zod';

export const signInSchema = z.object({
    // username:z.string()
    // .min(5,{message:"Minimum 5 characters !"})
    // .max(30,{message:"More than 30 characters not allowed !"}),

    identifier:z.string(),
    
    password:z.string()
    .min(6,{message:"Minimum 6 characters !"})
    .max(30,{message:"More than 30 characters not allowed !"}),

})
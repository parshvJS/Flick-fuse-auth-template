import { dbConnect } from "@/lib/dbConnect";
import userModel from "@/models/UserModel";
import { z } from 'zod';
import { usernameValidate } from "@/schemas/signUpSchema";
import { checkRequestMethod } from "@/lib/checkRequestMethod";

const usernameQuerySchema = z.object({
    username: usernameValidate,
})

export async function GET(request: Request) {

    await dbConnect();
    try {
        const { searchParams } = new URL(request.url)
        const usernameFromParam = {
            username: searchParams.get("username")
        }

        // validate using zod
        const validUsername = usernameQuerySchema.safeParse(usernameFromParam);

        console.log(validUsername, "is here from zod ! ");

        if (!validUsername.success) {
            const usernameError = validUsername.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameError.length > 0 ?
                    usernameError.join(" ") : "invalid Query Parameter !"
            }, { status: 400 })
        }
        const { username } = validUsername.data
        const dbUsername = await userModel.findOne({
            username,
            isVerified: true
        })

        if (!dbUsername) {
            return Response.json({
                success: true,
                message: "Username Available !"
            }, { status: 200 })
        }

        return Response.json({
            success: false,
            message: "Usernama Is Taken Already !"
        }, { status: 400 })

    } catch (error: any) {

        console.error("error in checkUsernameUnique", error.message);

        return Response.json(
            {
                success: false,
                message: error.emssage
            },
            { status: 500 }
        )

    }

}
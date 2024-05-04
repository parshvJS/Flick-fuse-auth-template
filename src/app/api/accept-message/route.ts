import { getServerSession } from "next-auth";
import { dbConnect } from "@/lib/dbConnect";
import userModel from "@/models/UserModel";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session?.user) {
        return Response.json({
            success: false,
            message: "Not Authanticated"
        }, { status: 405 });
    }

    const userId = user?._id;

    try {
        const { acceptUserMessage } = await request.json();
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptUserMessage },
            { new: true }
        );
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "failed To update user"
            }, { status: 400 });
        }

        return Response.json({
            success: true,
            message: "Successfully changed message Acceptence !",
            user: updatedUser
        }, { status: 200 });

    } catch (error: any) {
        console.log("Error :", error.message)
        return Response.json({
            success: false,
            message: error.message
        }, { status: 400 });

    }

}


export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session?.user) {
        return Response.json({
            success: false,
            message: "Not Authanticated"
        }, { status: 405 });
    }

    const userId = user._id
    try {
        const userFromData = await userModel.findById(userId);
        if (!userFromData) {
            return Response.json({
                success: false,
                message: "can't find accepting message Status !"
            })
        }

        return Response.json({
            success: true,
            isAcceptingMessage: userFromData.isAcceptingMessage
        })
    } catch (error:any) {
        return Response.json({
            success: false,
            message:error.message
        })
    }


}
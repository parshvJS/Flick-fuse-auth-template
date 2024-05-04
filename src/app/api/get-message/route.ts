import { getServerSession } from "next-auth";
import { dbConnect } from "@/lib/dbConnect";
import userModel from "@/models/UserModel";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

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

    const userId = new mongoose.Types.ObjectId(user._id)
    try {
        const user = await userModel.aggregate([
            { $match: { id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: "$_id", messages: { $push: '$messages' } } }
        ])


        if (!user) {
            return Response.json({
                success: false,
                message: "Can't find user"
            }, { status: 405 });
        }
        return Response.json({
            success: true,
            message: user[0].messages
        }, { status: 200 });

    } catch (error: any) {
        return Response.json({
            success: false,
            message: error.message
        })
    }
}
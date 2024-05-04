import userModel from "@/models/UserModel";
import { dbConnect } from "@/lib/dbConnect";
import { Message } from "@/models/UserModel";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, content } = await request.json();

        const user = await userModel.findOne({ username: username });

        if (!user) {
            return Response.json({
                success: false,
                message: "Can't find user!"
            }, { status: 400 })
        }

        // check if user is accepting message

        if (!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "User is not Accepting Message !"
            }, { status: 400 });
        }

        const newMessage = {
            content: content,
            createdAt: new Date()
        }

        user.messages.push(newMessage as Message);

        return Response.json({
            success: true,
            message: "Message Sent successfully!"
        }, { status: 200 });


    } catch (error: any) {
        return Response.json({
            success: false,
            message: error.message
        }, { status: 400 })
    }
}
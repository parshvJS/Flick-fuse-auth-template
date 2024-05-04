import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document {
    content:string;
    createdAt:Date
}

const MessageSchema:Schema<Message> = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true
    }
})

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    isVerified:boolean;
    verifyCodeExpiry : Date;
    isAcceptingMessage:boolean;
    messages:Message[];
}


const UserSchema:Schema<User> = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is required !"],
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:[true,"email is required !"],
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    verifyCode:{
        type:String,
    },
    verifyCodeExpiry:{
        type:Date
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema]

})

const userModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User",UserSchema);

// const MessageModel = mongoose.models.Message as mongoose.Model<Message> || mongoose.model<Message>("Message",MessageSchema);

export default userModel;


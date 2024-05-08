import mongoose,{Schema,Document} from "mongoose";

export interface User extends Document{
    username:string;
    imp_keywords:string;
    
    verifyCode:string;
    isVerified:boolean;
    verifyCodeExpiry : Date;
    isAcceptingMessage:boolean
}


const UserSchema:Schema<User> = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is required !"],
        unique:true,
        trim:true
    },
    imp_keywords:{
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
        default:true
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    }

})

const userModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User",UserSchema);

// const MessageModel = mongoose.models.Message as mongoose.Model<Message> || mongoose.model<Message>("Message",MessageSchema);

export default userModel;


import { dbConnect } from "@/lib/dbConnect";
import userModel from "@/models/UserModel";


export async function POST(request:Request){
    await dbConnect();
    try {
        const {username,code} =await request.json();

        const verifyCodeByUsername =  await userModel.findOne({username})

        if(!verifyCodeByUsername){
            return Response.json({
                success:false,
                message:"User not found !"
            },{status:400})
        }
        if(verifyCodeByUsername.isVerified === true){
            return Response.json({
                success:true,
                message:"You Are Already Verified ! Please Log in"
            },{status:202})
        }
        const isCodeValid = verifyCodeByUsername.verifyCode === code;
        const isCodeNotExpired = new Date(verifyCodeByUsername.verifyCodeExpiry) >= new Date();

        if(!isCodeValid){
            return Response.json({
                success:false,
                message:"Verification Code Not Matched !"
            },{status:400})
        }
        else if(!isCodeNotExpired){
            return Response.json({
                success:false,
                message:"Verification Code Time Expired ! Please Generate New One !"
            },{status:400})
        }
        else if(isCodeNotExpired && isCodeValid){
            verifyCodeByUsername.isVerified = true;
            verifyCodeByUsername.verifyCode = "";
            await verifyCodeByUsername.save();

            return Response.json({
                success:true,
                message:"verification successfull !"
            },{status:200})
        }
        
    } catch (error:any) {
        console.log("something went wrong in verify code !",error.message);
        return Response.json({
            success:false,
            message:error.message
        },{status:400})
        
    }

}
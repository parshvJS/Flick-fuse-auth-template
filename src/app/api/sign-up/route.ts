import { dbConnect } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server"
import userModel from "@/models/UserModel";
import bcrypt from 'bcryptjs'
import { sentVerificationEmail } from "@/utils/sentVerificationEmail";

export async function POST(request: NextRequest) {
    await dbConnect()

    try {
        const { username, email, password } = await request.json();
        const existingUser = await userModel.findOne({
            username,
            isVerified: true
        });
        if (existingUser) {
            return NextResponse.json({
                success: false,
                message: "Username is already taken !"
            })
        }

        const existingUserByEmail = await userModel.findOne({ email });
        
        // generating OTP details
        const verificationOTP = Math.floor(99999 + Math.random() * 900000).toString()
        const verificationOTPExpiry = new Date(Date.now() + 3600000);
        

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: "User with this email already exist !"
                })
            }
            else {
                // user is not verified | give new opt
                existingUserByEmail.verifyCode = verificationOTP;
                existingUserByEmail.verifyCodeExpiry = verificationOTPExpiry;
                await existingUserByEmail.save();
            }
        }
        else {
            // creating new user

            //make password hashed
            const hashedPassword = await bcrypt.hash(password,13);

            // create database document for new user
            const newUser = new userModel({
                username:username,
                email:email,
                password:hashedPassword,
                verifyCode: verificationOTP,
                verifyCodeExpiry: verificationOTPExpiry,
                messages: [],
            })

            await newUser.save();
        }

        // sent verification email
        const VerifyUserEmail = await sentVerificationEmail(email, username, verificationOTP!)
        console.log("here 1");
        
        if (!VerifyUserEmail.success) {
            return NextResponse.json({
                success: false,
                message: VerifyUserEmail.message
            }, { status: 500 })
        }
        return NextResponse.json({
            success: true,
            message: "user Registered Successfully Check Email Box !"
        }, { status: 200 })
        
    } catch (error: any) {
        console.log(error.message, "Is error in sign up functionality !")
        console.log("here 2");
        return Response.json({
            success: false,
            message: error.message.toString()
        }, { status: 500 })
    }
}
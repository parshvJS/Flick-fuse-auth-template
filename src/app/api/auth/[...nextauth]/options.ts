import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import { dbConnect } from '@/lib/dbConnect';
import userModel from '@/models/UserModel';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials: any): Promise<any> {
                try {
                    await dbConnect();
                    console.log(credentials, "and", credentials.identifier, "is details");

                    const user = await userModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })
                    if (!user) throw new Error("no user found with this email !");

                    if (!user.isVerified) throw new Error("Verify your email to Continue !");

                    const isPasswordCorrect
                    = await bcrypt.compare(user.password, credentials.password)
                    if (!isPasswordCorrect) {
                        return user
                    }
                    else {
                        return null
                    }
                } catch (error: any) {
                    throw new Error(error.message)

                }
            }
        })
    ],
    pages: {
        signIn: "/sign-In",
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_URL,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString(),
                    token.isVerified = user.isVerified,
                    token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
            }
            return token
        },
        async session({ session, user, token }) {
            if (token) {
                session.user._id = token._id,
                    session.user.isVerified = token.isVerified,
                    session.user.isAcceptingMessage = token.isAcceptingMessage,
                    token.username = user.username
            }
            return session
        }
    }
} 
import { dbConnect } from "@/lib/dbConnect";
import analyzedPaperModel from "@/models/analyzedPapers";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
    await dbConnect()
    try {
        const { id } = await req.json();
        // find data of it

        const document = await analyzedPaperModel.findById(id);
        
        if (!document) {
            return NextResponse.json({
                success: false,
                message: "Can't find any data of this domain !"
            })
        }
        return NextResponse.json({
            success: true,
            message: "data succesully fetched !",
            document
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message
        })

    }
}
import { dbConnect } from "@/lib/dbConnect";
import analyzedPaperModel from "@/models/analyzedPapers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    await dbConnect();

    try {

        const { searchParams } = new URL(request.url)
        const searchQueryFromParams = {
            search: searchParams.get("search")
        }
        console.log(searchQueryFromParams, "searching ...");

        const results = await analyzedPaperModel.find({
            exam_name: { $regex: searchQueryFromParams.search, $options: 'i' }
        },
            "exam_name -_id"
        ).limit(10);

        if (!results || results.length == 0) {
            return NextResponse.json({
                success: false,
                message: "No Document Found !",
            }, { status: 300 })
        }
        console.log(results, "are here ");
        let searchResults: string[] = []
        results.forEach(result => {
            searchResults.push(result.exam_name);
        })
        const nonDuplicateSearchResult = [...new Set(searchResults)]
        return NextResponse.json({
            success: true,
            message: "Search successfull !",
            searchResults: nonDuplicateSearchResult
        }, { status: 200 })

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message
        })
    }
}
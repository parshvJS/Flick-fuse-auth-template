import { dbConnect } from "@/lib/dbConnect";
import analyzedPaperModel from "@/models/analyzedPapers";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalDocuments: number;
}

export async function GET(req: NextRequest) {
  await dbConnect();

  // Parse the URL to get query parameters
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const page = parseInt(url.searchParams.get('page')!) || 1;
  const limit = parseInt(url.searchParams.get('limit')!) || 10;
  const skip = (page - 1) * limit;

  try {
    const results = await analyzedPaperModel.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("total_qa imp_count file_count exam_name username")
      ;

    const totalDocuments = await analyzedPaperModel.countDocuments({});
    const totalPages = Math.ceil(totalDocuments / limit);

    const pagination: PaginationInfo = {
      currentPage: page,
      totalPages: totalPages,
      pageSize: limit,
      totalDocuments: totalDocuments
    };

    return NextResponse.json({
      success: true,
      data: results,
      pagination: pagination
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json({ success: false, message: "Server Error" });
  }
}

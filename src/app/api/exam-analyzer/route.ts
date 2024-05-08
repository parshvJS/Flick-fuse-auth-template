import { getResponseFromText } from "@/lib/ai/getResponseFromText";
import { File } from "buffer";
import { writeFile } from "fs/promises"; // Using promises for async compatibility
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import PdfParse from "pdf-parse";


const removeHeaderFooter = (text: string, threshold = 0.01) => {
  const nonEnglishRegex = /[^a-zA-Z0-9\s.,?!'"()\[\]{}:;-]/g;
  // Remove non-English characters from the text
  let cleanedTexts = text.replace(nonEnglishRegex, '');
  const refinedText = cleanedTexts.replace(/^\s*[\r\n]/gm, '').trim();

  const lines = refinedText.split('\n');

  const yPosThreshold = threshold * lines.length;

  let cleanedText = lines.filter((line, index) => index >= yPosThreshold).join('\n');

  cleanedText = cleanedText.split('\n').reverse().filter((line, index) => index >= yPosThreshold).reverse().join('\n');

  return cleanedText;
};

// Handle POST requests to extract content from PDF files
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData(); // Get form data from request
    const files: File[] = []; // Initialize an array to store files

    // Extract files from form data
    for (const value of formData.values()) {
      if (value instanceof File) {
        files.push(value); // Collect files
      }
    }

    if (files.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No files provided",
      });
    }

    // Initialize an object to store extracted text from PDFs
    const exam_paper: Record<string, string> = {};

    // Iterate through all files, extract content from each
    for (const file of files) {
      const byteArray = await file.arrayBuffer(); // Get the file content
      const buffer = Buffer.from(byteArray); // Convert to buffer

      const extractedData = await PdfParse(buffer); // Extract text from PDF
      const cleanedData = removeHeaderFooter(extractedData.text)
      exam_paper[file.name] = cleanedData; // Store extracted text in exam_paper
    }

    console.log(exam_paper, "original data");
    const analayzedData = await getResponseFromText(exam_paper)

    return NextResponse.json({
      success: true,
      message: "Files uploaded and cleaned successfully",
      data: analayzedData,
    });

  } catch (error: any) {
    console.error("Error in POST handler:", error.message);
    return NextResponse.json({
      success: false,
      message: `An error occurred: ${error.message}`,
    });
  }
}

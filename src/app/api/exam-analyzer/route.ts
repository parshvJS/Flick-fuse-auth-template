import { getResponseFromText } from "@/lib/ai/getResponseFromText";
import { uploadOnCloudinary } from "@/lib/uploadToCloudinary";
import { File } from "buffer";
import { unlinkSync, writeFile } from "fs"; // Using promises for async compatibility
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import PdfParse from "pdf-parse";
import { buffer } from "stream/consumers";
import fs from 'fs';

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
    const pdf_url: Record<string, string> = {};
  
    for (const file of files) {
      try {
        // Convert file to ArrayBuffer and then to Buffer
        const byteArray = await file.arrayBuffer();
        const buffer = Buffer.from(byteArray);
  
        // Determine the path to the 'public' folder
        const rootPath = process.cwd(); // Get the current working directory
        const publicPath = join(rootPath, 'public', file.name); // Append the filename
  
        // Write the file to the 'public' folder
        await new Promise((resolve, reject) => {
          writeFile(publicPath, buffer, (err) => {
            if (err) {
              reject(err);
            } else {
              console.log(`File '${file.name}' uploaded to public folder.`);
              resolve('success')
            }
          });
        });
  
        // Upload the file to Cloudinary
        const cloudinaryUrl = await uploadOnCloudinary(publicPath);
        pdf_url[file.name] = cloudinaryUrl!;
  
        // Parse the PDF and clean the text
        const extractedData = await PdfParse(buffer);
        const cleanedData = removeHeaderFooter(extractedData.text);
  
        // Store the extracted text in 'exam_paper'
        exam_paper[file.name] = cleanedData;
  
        // Remove the written file after processing
        unlinkSync(publicPath);
        console.log(`File '${file.name}' deleted from public folder.`);
  
      } catch (error) {
        console.error(`Error processing file '${file.name}':`, error);
      }
    }

    console.log(exam_paper, pdf_url, "original data");
    const analayzedData = await getResponseFromText(exam_paper)
    console.log(analayzedData,"is meee");
    
    // console.log(typeof(analayzedData),JSON.parse(analayzedData!),"is type -----------------");

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

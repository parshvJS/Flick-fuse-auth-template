import { getResponseFromText } from "@/lib/ai/getResponseFromText";
import { uploadOnCloudinary } from "@/lib/uploadToCloudinary";
import { File } from "buffer";
import { unlinkSync, writeFile } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import PdfParse from "pdf-parse";
import analayzedPaperModel from "@/models/analyzedPapers";
import { dbConnect } from "@/lib/dbConnect";

// Utility function that removes unwanted text from data
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
  await dbConnect();
  try {
    console.log("Received POST request");
    const formData = await req.formData();
    console.log("Form data received:", formData);

    const files: File[] = [];
    console.log("Checking form data values...");
    if (!formData.values()) {
      console.log("No values in form data");
      return NextResponse.json({
        success: false,
        message: "Please Enter Name of the Exam !"
      }, { status: 400 });
    }

    console.log("Extracting files from form data...");
    for (const value of formData.values()) {
      if (value instanceof File) {
        console.log("Found a file:", value.name);
        files.push(value);
      }
    }

    if (files.length <= 1) {
      console.log("Less than 2 files found");
      return NextResponse.json({
        success: false,
        message: "Upload At least 2 Files !",
      });
    }

    console.log("Processing", files.length, "files...");

    const exam_paper: Record<string, string> = {};
    const pdf_url: string[] = [];

    for (const file of files) {
      try {
        console.log("Processing file:", file.name);
        const byteArray = await file.arrayBuffer();
        const buffer = Buffer.from(byteArray);

        const rootPath = process.cwd();
        const publicPath = join(rootPath, 'public', file.name);

        console.log("Writing file to public folder...");
        await new Promise((resolve, reject) => {
          writeFile(publicPath, buffer, (err) => {
            if (err) {
              console.error("Error writing file:", file.name, err);
              reject(err);
            } else {
              console.log(`File '${file.name}' uploaded to public folder.`);
              resolve('success');
            }
          });
        });

        console.log("Uploading to Cloudinary...");
        const cloudinaryUrl = await uploadOnCloudinary(publicPath);
        pdf_url.push(cloudinaryUrl!);

        console.log("Parsing PDF...");
        const extractedData = await PdfParse(buffer);
        const cleanedData = removeHeaderFooter(extractedData.text);

        exam_paper[file.name] = cleanedData;
        unlinkSync(publicPath);
        console.log(`File '${file.name}' deleted from public folder.`);
      } catch (error) {
        console.error(`Error processing file '${file.name}':`, error);
      }
    }

    console.log("Analyzing extracted data...");
    const analayzedData = await getResponseFromText(exam_paper);
    const cleanedAnalayzedData = analayzedData?.replaceAll('`','').replaceAll('javascript','').replaceAll('js','');
    console.log(cleanedAnalayzedData,"is here -----------------------------------------------------------",analayzedData,"is not ```````````````````````````````````````");
    
    console.log("Saving analyzed data to database...");
    const analyzedJson = JSON.parse(cleanedAnalayzedData!);
    console.log(analyzedJson, "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
    console.log(formData, "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");

    const newExamAnalyzed = new analayzedPaperModel({
      pdf_url,
      imp_keywords: JSON.stringify(analyzedJson.imp_keywords),
      high_topic_frequency: JSON.stringify(analyzedJson.topic_frequency.high),
      low_topic_frequency: JSON.stringify(analyzedJson.topic_frequency.low),
      exam_difficulty: JSON.stringify(analyzedJson.exam_difficulty),
      all_questions: JSON.stringify(analyzedJson.all_questions),
      blueprint: JSON.stringify(analyzedJson.blueprint),
      imp_qa: JSON.stringify(analyzedJson.imp_qa),
      exam_name: formData.get('name'),
      username: formData.get('username')
    });

    const response = await newExamAnalyzed.save();
    const resSend = {
      id:response._id,
      analayzedResponse:analayzedData
    }
    if (!response) {
      console.log("Error saving to database");
      return NextResponse.json({
        success: false,
        message: "Can't Provide you data right now ! Please try After Some Time !",
      });
    }

    console.log("Analysis and saving successful!");
    return NextResponse.json({
      success: true,
      message: "All Files Saved and Analyzed Successfully!",
      data: resSend,
    });

  } catch (error: any) {
    console.error("Error in POST handler:", error.message);
    return NextResponse.json({
      success: false,
      message: `An error occurred: ${error.message}`,
    });
  }
}

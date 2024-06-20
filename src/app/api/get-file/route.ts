import { NextRequest, NextResponse } from "next/server";
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as unknown as File;
  if (!file) {
    return NextResponse.json({ success: false, error: "No file uploaded" });
  }

  const fileBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileBuffer);

  const fileName = file.name;
  const filePath = path.join(process.cwd(), 'public', fileName);
  
  try {
    await fs.writeFile(filePath, buffer);
    return NextResponse.json({ success: true, fileName });
  } catch (error) {
    console.error("Error writing file:", error);
    return NextResponse.json({ success: false, error: "Failed to write file" });
  }
}

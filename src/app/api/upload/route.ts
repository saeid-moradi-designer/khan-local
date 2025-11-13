import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ success: false, error: "فایل ارسال نشده" });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const imagesDir = path.join(process.cwd(), "public", "images");

  // اگر پوشه وجود ندارد، بساز
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // نام فایل یکتا
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(imagesDir, fileName);

  fs.writeFileSync(filePath, buffer);

  return NextResponse.json({ success: true, fileName });
};

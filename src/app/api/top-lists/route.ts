import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const TOP_LISTS_PATH = path.join(process.cwd(), "data", "top-lists.json");

export async function GET() {
  try {
    if (!fs.existsSync(TOP_LISTS_PATH)) {
      return NextResponse.json({ lists: {} });
    }
    const raw = fs.readFileSync(TOP_LISTS_PATH, "utf-8");
    const lists = JSON.parse(raw);
    return NextResponse.json({ lists });
  } catch {
    return NextResponse.json({ lists: {} });
  }
}

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DEALS_PATH = path.join(process.cwd(), "data", "deals.json");

export async function GET() {
  try {
    if (!fs.existsSync(DEALS_PATH)) {
      return NextResponse.json({ sections: [] });
    }
    const raw = fs.readFileSync(DEALS_PATH, "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ sections: [] });
  }
}

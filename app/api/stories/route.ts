import { NextResponse } from "next/server";
import { getAllStories } from "@/data/stories";

export async function GET() {
  const stories = getAllStories();
  return NextResponse.json(stories, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

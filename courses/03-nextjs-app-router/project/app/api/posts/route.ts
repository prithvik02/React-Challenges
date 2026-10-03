import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    posts: [
      {
        id: 1,
        title: "First Post",
        body: "This is the first post.",
      },
      {
        id: 2,
        title: "Second Post",
        body: "This is the second post.",
      },
    ],
  });
}
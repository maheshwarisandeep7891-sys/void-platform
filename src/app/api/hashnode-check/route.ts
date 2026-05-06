import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const apiKey = process.env.HASHNODE_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "No API key" });

  try {
    // Get user info and publication ID
    const res = await fetch("https://gql.hashnode.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": apiKey,
      },
      body: JSON.stringify({
        query: `{
          me {
            id
            username
            name
            publications(first: 5) {
              edges {
                node {
                  id
                  title
                  url
                }
              }
            }
          }
        }`,
      }),
    });

    const data = await res.json();
    return NextResponse.json({ status: res.status, data });
  } catch (error) {
    return NextResponse.json({ error: String(error) });
  }
}

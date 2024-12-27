import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";

export async function POST(req: any) {
  const cookie = (await cookies()).get("session")?.value;
  const { action } = await req.json();

  if (cookie && action === "LOGOUT") {
    const response = NextResponse.json({ message: "Logged out successfully" }); // Use new URL to resolve the path correctly
    response.cookies.delete('session'); // Clear session cookie
    return response;
  }

  if (cookie && action === "LOGIN") {
    const session = await verifyToken(cookie);
    return NextResponse.json(
      { ID_User: session?.ID_User, Username: session?.Username },
      { status: 200 }
    );
  }

  return NextResponse.json(null, { status: 200 });
}

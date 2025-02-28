import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";
const allowedBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export async function POST(req: any) {
     const referer = req.headers.get('referer');
      if (!referer || !referer.startsWith(allowedBaseUrl)) {
        return NextResponse.json(
          { error: "Unauthorized access" },
          { status: 403 }
        );
      }
  const cookie = (await cookies()).get("session")?.value;
  const { action } = await req.json();

  if (cookie && action === "LOGOUT") {
    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.delete('session'); 
    return response;
  }

  if (cookie && action === "LOGIN") {
    // console.log("LOGIN_WORKING");
    return NextResponse.json(
      { message: "LOGIN successfully" },
      { status: 200 }
    );
    
  }
  if (cookie && action === "USER") {
    // console.log("USER_WORKING");
    const session = await verifyToken(cookie);
    return NextResponse.json(
      { ID_User: session?.ID_User, Username: session?.Username },
      { status: 201 }
    );
    
  }
  

  return NextResponse.json(null, { status: 200 });
}

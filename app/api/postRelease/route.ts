import { NextResponse } from "next/server";

import { getConnection } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";
const allowedBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export async function POST(req: Request) {
  const referer = req.headers.get("referer");
  if (!referer || !referer.startsWith(allowedBaseUrl)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }
  const body: any[] = await req.json();
  // console.log("Received Data:", body);

  const cookie = (await cookies()).get("session")?.value;
  let session = null;
  if (cookie) {
    try {
      session = await verifyToken(cookie);
    } catch (error) {
      console.error("Failed to verify session", error);
    }
  }
  console.log("session", session);
  const ID_User = session?.ID_User; // Correct property name
  console.log("ID_User", ID_User);

  const connection = await getConnection();
  const insertStatusQuery = `
  INSERT INTO Status (FK_RepairID, FK_UserID, FK_StatusID, StatusDate)
  VALUES (?, ?, ?, ?);
`;
  const bookupdate = `
 UPDATE Books SET Bookstate='ดูที่ชั้น' WHERE BookQR = ?;
`;
  try {
    const promises = body.map(async (dataquery) => {
      const { Repair_ID, BookQR } = dataquery;
      await connection.query(insertStatusQuery, [
        Repair_ID,
        ID_User,
        5,
        new Date(),
      ]);
      await connection.query(bookupdate, [BookQR]);
    });

    await Promise.all(promises);
    await connection.commit();
    return NextResponse.json({ message: "Data inserted successfully" });
  } catch (error) {
    console.error("Database Insertion Error:", error);
    return NextResponse.json(
      { error: "Database insertion failed" },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}

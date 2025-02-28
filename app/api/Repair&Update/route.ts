import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/session';
const allowedBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export async function POST(req: Request) {
     const referer = req.headers.get('referer');
      if (!referer || !referer.startsWith(allowedBaseUrl)) {
        return NextResponse.json(
          { error: "Unauthorized access" },
          { status: 403 }
        );
      }
  const connection = await getConnection();
  const body: any[] = await req.json(); // Parse incoming JSON data

  const cookie = (await cookies()).get('session')?.value;
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

  try {
    console.log("Received Data:", body);
    
    await connection.beginTransaction();

    const insertStatusQuery = `
      INSERT INTO Status (FK_RepairID, FK_UserID, FK_StatusID, StatusDate)
      VALUES (?, ?, ?, ?);
    `;

    const promises = body.map(async book => {
      const { Repair_ID, status, StatusDate } = book;
      const date = new Date(StatusDate);
      date.setHours(date.getHours() + 7); // Adjust for 7-hour difference
      const formattedStatusDate = date.toISOString().slice(0, 19).replace('T', ' ');

      await connection.query(insertStatusQuery, [Repair_ID, ID_User, status, formattedStatusDate]);
      // console.log("Status inserted successfully.", connection.query(insertStatusQuery, [Repair_ID, ID_User, status, formattedStatusDate]));
    });
    
    await Promise.all(promises);
    await connection.commit();
    console.log("Transaction committed successfully.");
    return NextResponse.json({ message: "ได้ทำการเรียบร้อย" }, { status: 200 });
  } catch (error) {
    console.error("Error inserting book data:", error);

    if (connection) await connection.rollback();

    return NextResponse.json(
      { message: "Failed to insert books data", error: error.message, stack: error.stack },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
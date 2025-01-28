import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/session';

export async function POST(req: Request) {
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

    const checkService = `SELECT RD.Repair_ID,SV.Service FROM RepairDocs RD
                    JOIN Service SV ON RD.Repair_ID = SV.FK_RepairID
                    WHERE RD.Repair_ID = ? AND SV.Service = ?;`;

    const insertSeverviceQuery = `
      INSERT INTO Service (FK_RepairID, Service, ServiceNote, ServiceDate, FK_UserID)
      VALUES (?, ?, ?, ?, ?);
    `;
    const insertStatusQuery = `
      INSERT INTO Status (FK_RepairID, FK_UserID, FK_StatusID, StatusDate)
      VALUES (?, ?, ?, ?);
    `;

    const promises = body.map(async book => {
      const { Repair_ID, service, serviceNote, serviceDate, status, StatusDate } = book;
    
      const [ServiceChecked] = await connection.query(checkService, [Repair_ID, service]);
    
      if (ServiceChecked.length > 0) {
        console.log("insert Status");
        await connection.query(insertStatusQuery, [Repair_ID, ID_User, status, StatusDate]);

      } else {
        console.log("insert service and status");
        await connection.query(insertSeverviceQuery, [Repair_ID, service, serviceNote, serviceDate, ID_User]);
        await connection.query(insertStatusQuery, [Repair_ID, ID_User, status, StatusDate]);
      }
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
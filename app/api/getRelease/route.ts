import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
    const connection = await getConnection();
  try {
    // Fetch ข้อมูลใหม่จากฐานข้อมูล
    const rows = await connection.query(`
                WITH LatestService AS (
                    SELECT *, 
                        ROW_NUMBER() OVER (PARTITION BY FK_RepairID ORDER BY ServiceDate DESC) AS rn
                    FROM Service
                ), 
                LatestStatus AS (
                    SELECT *, 
                        ROW_NUMBER() OVER (PARTITION BY FK_RepairID ORDER BY StatusDate DESC) AS rn
                    FROM Status
                )
                SELECT 
                    RD.Repair_ID,
                    U.UserAdminName,
                    RD.FK_BookID,
                    B.BookQR,
                    B.Bookname,
                    B.BookType,
                    B.Bookaddress,
                    B.Bookstate,
                    RD.ServiceByName,
                    SV.Service, 
                    SV.ServiceNote, 
                    SV.ServiceDate, 
                    ST.StatusName,
                    S.StatusDate
                FROM Books B
                JOIN RepairDocs RD ON B.BookID = RD.FK_BookID
                JOIN LatestService SV ON RD.Repair_ID = SV.FK_RepairID AND SV.rn = 1  -- เลือก Service ล่าสุด
                JOIN LatestStatus S ON RD.Repair_ID = S.FK_RepairID AND S.rn = 1  -- เลือก Status ล่าสุดก่อน
                JOIN StatusType ST ON S.FK_StatusID = ST.StatusID
                JOIN users U ON U.id = RD.FK_User_ID
                WHERE S.FK_StatusID != 5; 
    `);

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}

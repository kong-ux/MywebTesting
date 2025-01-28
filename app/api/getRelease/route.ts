import { NextResponse } from 'next/server';

import { getConnection } from '@/lib/db';


export async function GET() {

  try {
    // Fetch ข้อมูลใหม่จากฐานข้อมูล
    const connection = await getConnection();
    const rows = await connection.query(`
      SELECT 
        RD.Repair_ID, 
        RD.FK_User_ID, 
        RD.FK_BookID, 
        B.BookQR, 
        B.BookID, 
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
      FROM
        Books B
      JOIN
        RepairDocs RD ON B.BookID = RD.FK_BookID 
      JOIN
        Service SV ON RD.Repair_ID = SV.FK_RepairID 
      JOIN
        Status S ON RD.Repair_ID = S.FK_RepairID 
      JOIN
        StatusType ST ON S.FK_StatusID = ST.StatusID 
      WHERE 
        SV.ServiceDate = (SELECT MAX(ServiceDate) FROM Service WHERE FK_RepairID = RD.Repair_ID) 
      AND
        S.StatusDate = (SELECT MAX(StatusDate) FROM Status WHERE FK_RepairID = RD.Repair_ID)
      AND
        S.FK_StatusID = 6 
    `);

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }

}
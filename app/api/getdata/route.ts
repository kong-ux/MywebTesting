import { NextResponse } from 'next/server';

import { getConnection } from '@/lib/db';

let cache = null; // ตัวแปรสำหรับเก็บ cache
let cacheTimestamp = null; // เก็บเวลาที่ข้อมูลถูกเก็บ

export async function GET() {
  const CACHE_DURATION = 60 * 1000; // Cache 60 วินาที
  const currentTime = Date.now();

  // ตรวจสอบว่าข้อมูลอยู่ใน cache และยังไม่หมดอายุ
  if (cache && currentTime - cacheTimestamp < CACHE_DURATION) {
    console.log("Serving from in-memory cache");
    return NextResponse.json(cache);
  }

  try {
    // Fetch ข้อมูลใหม่จากฐานข้อมูล
    const connection = await getConnection();
    const rows = await connection.query(`
      SELECT
          RD.Repair_ID,
          RD.FK_User_ID,
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
          AND S.StatusDate = (SELECT MAX(StatusDate) FROM Status WHERE FK_RepairID = RD.Repair_ID);
    `);

    cache = rows[0]; // เก็บข้อมูลใน cache
    cacheTimestamp = currentTime; // บันทึกเวลา

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }

}
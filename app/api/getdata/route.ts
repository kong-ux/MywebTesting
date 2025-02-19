import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

let cache = null; // ตัวแปรสำหรับเก็บ cache
let cacheTimestamp = null; // เก็บเวลาที่ข้อมูลถูกเก็บ

export async function GET() {
  console.log("GET_WORKING ");
  const CACHE_DURATION = 50 * 1000; // Cache 50 วินาที
  const currentTime = Date.now();

  // ตรวจสอบว่าข้อมูลอยู่ใน cache และยังไม่หมดอายุ
  if (cache && currentTime - cacheTimestamp < CACHE_DURATION) {
    console.log("Serving from in-memory cache");
    return NextResponse.json(cache);
  }
  const connection = await getConnection();

  try {
    if (!connection) {
      throw new Error("Database connection failed");
    }

    // ดึงข้อมูลจากฐานข้อมูล
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
    U.Username,
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
JOIN LatestStatus S ON RD.Repair_ID = S.FK_RepairID AND S.rn = 1  -- เลือก Status ล่าสุด
JOIN StatusType ST ON S.FK_StatusID = ST.StatusID
JOIN USER U ON U.ID_User = RD.FK_User_ID
ORDER BY SV.ServiceDate ASC;
    `);

    if (!rows.length) {
      throw new Error("No data found");
    }

    cache = rows[0]; // เก็บข้อมูลลง cache
    cacheTimestamp = currentTime; // บันทึกเวลาที่ cache ถูกอัปเดต
    console.log("Cache updated");

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Database error:", error.message);

    // หากมี cache เก่า ให้ใช้ข้อมูลจาก cache แทน
    if (cache && currentTime - cacheTimestamp < CACHE_DURATION) {
      console.log("Database error, serving from cache");
      return NextResponse.json(cache);
    }

    return NextResponse.json(
      { error: error.message || "Failed to fetch data" },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
  // }
}

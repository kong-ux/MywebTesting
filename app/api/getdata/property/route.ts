import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";


let cache = null; // ตัวแปรสำหรับเก็บ cache
let cacheTimestamp = null; // เก็บเวลาที่ข้อมูลถูกเก็บ

const allowedBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export async function GET(request) {
  const referer = request.headers.get('referer');
  if (!referer || !referer.startsWith(allowedBaseUrl)) {
    return NextResponse.json(
      { error: "Unauthorized access" },
      { status: 403 }
    );
  }

  const CACHE_DURATION = 3 * 1000; // Cache 3 วินาที
  const currentTime = Date.now();

  // ตรวจสอบว่าข้อมูลอยู่ใน cache และยังไม่หมดอายุ
  if (cache && currentTime - cacheTimestamp < CACHE_DURATION) {
    console.log("ดึงขอมูลจาก cache");
    return NextResponse.json(cache);
  }
  const connection = await getConnection();

  try {
    if (!connection) {
      throw new Error("Database connection failed");
    }

    // ดึงข้อมูลจากฐานข้อมูล
    const rows = await connection.query(`
WITH LatestRepair AS (
    SELECT *, 
           ROW_NUMBER() OVER (PARTITION BY FK_BookID ORDER BY Repair_ID DESC) AS rn
    FROM RepairDocs
),
LatestService AS (
    SELECT *, 
           ROW_NUMBER() OVER (PARTITION BY FK_RepairID ORDER BY ServiceDate DESC) AS rn
    FROM Service
), 
LatestStatus AS (
    SELECT *, 
           ROW_NUMBER() OVER (PARTITION BY FK_RepairID ORDER BY StatusDate DESC) AS rn
    FROM Status
)
SELECT DISTINCT  -- ใช้ DISTINCT เพื่อลดความซ้ำซ้อน
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
JOIN LatestRepair RD ON B.BookID = RD.FK_BookID AND RD.rn = 1  -- เลือก Repair ล่าสุด
LEFT JOIN LatestService SV ON RD.Repair_ID = SV.FK_RepairID AND SV.rn = 1  -- เลือก Service ล่าสุด
LEFT JOIN LatestStatus S ON RD.Repair_ID = S.FK_RepairID AND S.rn = 1  -- เลือก Status ล่าสุด
LEFT JOIN StatusType ST ON S.FK_StatusID = ST.StatusID
LEFT JOIN users U ON U.id = S.FK_UserID
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
}

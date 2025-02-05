import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(request) {
  const connection = await getConnection();

  try {
    const { inputDataArray } = await request.json();

    // ตรวจสอบข้อมูลที่รับเข้ามา
    if (
      !Array.isArray(inputDataArray) ||
      inputDataArray.some((id) => typeof id !== "string")
    ) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    // ใช้ `IN (?)` เพื่อดึงข้อมูลทั้งหมดใน Query เดียว
    const placeholders = inputDataArray.map(() => "?").join(",");
    const query = `
WITH LatestService AS (
  SELECT FK_RepairID, MAX(ServiceDate) AS MaxServiceDate
  FROM Service
  GROUP BY FK_RepairID
),
LatestStatus AS (
  SELECT FK_RepairID, MAX(StatusDate) AS MaxStatusDate
  FROM Status
  GROUP BY FK_RepairID
),
LatestRepair AS (
  SELECT RD1.FK_BookID, RD1.Repair_ID
  FROM RepairDocs RD1
  LEFT JOIN Service SV1 ON SV1.FK_RepairID = RD1.Repair_ID
  LEFT JOIN Status S1 ON S1.FK_RepairID = RD1.Repair_ID
  WHERE RD1.FK_BookID IS NOT NULL
  GROUP BY RD1.FK_BookID, RD1.Repair_ID
  HAVING GREATEST(
    COALESCE(MAX(SV1.ServiceDate), '1900-01-01'), 
    COALESCE(MAX(S1.StatusDate), '1900-01-01')
  ) = (
    SELECT MAX(GREATEST(
      COALESCE(SV2.ServiceDate, '1900-01-01'), 
      COALESCE(S2.StatusDate, '1900-01-01')
    ))
    FROM RepairDocs RD2
    LEFT JOIN Service SV2 ON SV2.FK_RepairID = RD2.Repair_ID
    LEFT JOIN Status S2 ON S2.FK_RepairID = RD2.Repair_ID
    WHERE RD2.FK_BookID = RD1.FK_BookID
  )
)
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
FROM Books B
JOIN RepairDocs RD ON B.BookID = RD.FK_BookID
JOIN LatestRepair LR ON RD.Repair_ID = LR.Repair_ID
LEFT JOIN Service SV ON RD.Repair_ID = SV.FK_RepairID
  AND SV.ServiceDate = (SELECT MaxServiceDate FROM LatestService WHERE FK_RepairID = RD.Repair_ID)
LEFT JOIN Status S ON RD.Repair_ID = S.FK_RepairID
  AND S.StatusDate = (SELECT MaxStatusDate FROM LatestStatus WHERE FK_RepairID = RD.Repair_ID)
LEFT JOIN StatusType ST ON S.FK_StatusID = ST.StatusID
WHERE 
  B.Bookstate = 'อยู่ในละหว่างดำเนินการ'
  AND B.BookQR IN (${placeholders});
`;

    // ดึงข้อมูลทั้งหมดใน Query เดียว
    const [queryResults] = await connection.query(query, inputDataArray);

    // แปลงผลลัพธ์เป็น Map เพื่อค้นหาได้เร็วขึ้น
    const resultMap = new Map(
      queryResults.map((item) => [item.BookQR, item])
    );

    // จัดกลุ่มข้อมูลเป็น valid และ invalid items
    const validItems = [];
    const invalidItems = [];

    for (const itemId of inputDataArray) {
      if (resultMap.has(itemId)) {
        validItems.push({
          itemId,
          data: resultMap.get(itemId),
        });
      } else {
        invalidItems.push({
          itemId,
          message: `รหัสบาร์โค้ด ${itemId} ไม่ได้อยู่ในละหว่างดำเนินการหรือรหัสไม่ถูกต้อง`,
        });
      }
    }

    // ถ้ามี invalid items ให้ return 404
    if (invalidItems.length > 0) {
      return NextResponse.json(
        {
          itemId: invalidItems.map((item) => item.itemId),
          message: invalidItems.map((item) => item.message),
          status: 404,
        }
      );
    }

    // Return ข้อมูลที่สำเร็จ
    return NextResponse.json({
      message: "All items processed successfully",
      data: validItems,
      status: 200,
    });

  } catch (error) {
    return NextResponse.json({
      error: "Database query failed",
      details: error.message,
      status: 500,
    });
  } finally {
    connection.end();
  }
}

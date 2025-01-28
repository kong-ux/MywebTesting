import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(request: Request) {
  const connection = await getConnection();

  try {
    const { inputDataArray } = await request.json();

    // Validate input
    if (
      !Array.isArray(inputDataArray) ||
      inputDataArray.some((id) => typeof id !== "string")
    ) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    const query = `
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
LEFT JOIN
  Service SV ON RD.Repair_ID = SV.FK_RepairID AND SV.ServiceDate = (
    SELECT MAX(SV1.ServiceDate)
    FROM Service SV1
    WHERE SV1.FK_RepairID = RD.Repair_ID
  )
LEFT JOIN
  Status S ON RD.Repair_ID = S.FK_RepairID AND S.StatusDate = (
    SELECT MAX(S1.StatusDate)
    FROM Status S1
    WHERE S1.FK_RepairID = RD.Repair_ID
  )
LEFT JOIN
  StatusType ST ON S.FK_StatusID = ST.StatusID
WHERE 
  RD.Repair_ID = (
    SELECT RD1.Repair_ID
    FROM RepairDocs RD1
    WHERE RD1.FK_BookID = B.BookID
    ORDER BY (
      SELECT MAX(GREATEST(
        COALESCE(SV1.ServiceDate, '1900-01-01'), 
        COALESCE(S1.StatusDate, '1900-01-01')
      ))
      FROM Service SV1
      LEFT JOIN Status S1 ON SV1.FK_RepairID = S1.FK_RepairID
      WHERE SV1.FK_RepairID = RD1.Repair_ID
    ) DESC
    LIMIT 1
  )
  AND B.Bookstate = 'อยู่ในละหว่างดำเนินการ'
  AND B.BookQR = ?;

    `;

    const invalidItems = [];
    const validItems = [];

    // Loop through input data
    for (const itemId of inputDataArray) {
      try {
        const [queryResult] = await connection.query(query, [itemId]);

        if (queryResult.length === 0) {
          invalidItems.push({
            itemId,
            message: `รหัสบาร์โค้ด ${itemId} ไม่ได้อยู่ในละหว่างดำเนินการหรือรหัสไม่ถูกต้อง`,
          });
        } else {
          validItems.push({
            itemId,
            data: queryResult,
          });
        }
      } catch (error) {
        return NextResponse.json({
          error: "Database query failed",
          details: error.message,
          status: 500,
        });
      }
    }

    // If there are invalid items, return them with a 404 status
    if (invalidItems.length > 0) {
      return NextResponse.json({
        itemId: invalidItems.map((item) => item.itemId),
        message: invalidItems.map((item) => item.message),
        status: 404,
      });
    }

    // If all items are valid, return success
    return NextResponse.json({
      message: "All items processed successfully",
      data: validItems,
      status: 200,
    });
  } finally {
    connection.end();
  }
}

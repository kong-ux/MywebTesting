import { NextResponse } from 'next/server';
import {getConnection} from "@/lib/db";
export async function GET() {
  try {
    const connection = await getConnection(); // เชื่อมต่อฐานข้อมูล

    // คำสั่ง SQL สำหรับดึงข้อมูล จากตาราง RepairDocs ที่Status ล่าสุด
    const sql = `
SELECT 
    RD.Repair_ID,
    RD.User_ID,
    RD.Book_ID,
    RD.Bookname,
    RD.BookType,
    RD.Bookaddress,
    RD.Service,
    RD.ServiceByName,
    RD.ServiceNote,
    RD.ServiceDate,
    ST.StatusName,
    S.StatusDate

FROM 
    RepairDocs RD
JOIN 
    Status S ON RD.Repair_ID = S.Repair_ID
JOIN 
    StatusType ST ON S.Status = ST.StatusID
WHERE 
    S.StatusDate = (
        SELECT MAX(S2.StatusDate)
        FROM Status S2
        WHERE S2.Repair_ID = RD.Repair_ID
    );

    `;

    // ดำเนินการคิวรี
    const rows = await connection.query(sql);
    
    // ส่งผลลัพธ์เป็น JSON
    return NextResponse.json(rows[0]);

  } catch (error) {

    console.error('Database connection failed:', error);
    return NextResponse.json({ message: 'Database connection failed! Error details: ' }, { status: 500 });
  }
}

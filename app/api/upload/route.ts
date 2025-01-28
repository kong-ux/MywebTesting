import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/session';

export async function POST(req) {
  const connection = await getConnection();
  const body = await req.json(); // Parse incoming JSON data

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

    const checkDataBook = `SELECT BookQR FROM Books WHERE BookQR = ?;`;
    const checkstatebook = `SELECT BookID, Bookstate FROM Books WHERE BookQR = ?;`;
    const updatestatebook = `UPDATE Books SET Bookstate='อยู่ในละหว่างดำเนินการ' WHERE BookQR = ?;`;

    const insertBooksQuery = `    
    INSERT INTO Books (BookQR, BookID, Bookname, Booktype, Bookaddress, Bookstate)
    VALUES (?, ?, ?, ?, ?, 'อยู่ในละหว่างดำเนินการ');
    `;

    const insertRepairDocsQuery = `
      INSERT INTO RepairDocs (FK_User_ID, FK_BookID, ServiceByName)
      VALUES (?, ?, ?);
    `;

    const insertSeverviceQuery = `
      INSERT INTO Service (FK_RepairID, Service, ServiceDate, FK_UserID)
      VALUES (?, "รับเรื่องแจ้งแล้ว", ?, ?);
    `;
    const insertStatusQuery = `
      INSERT INTO Status (FK_RepairID, FK_UserID, FK_StatusID, StatusDate)
      VALUES (?, ?, 1, ?);
    `;

    const promises = body.map(async book => {
      const { bookqr, bookid, bookname, booktype, bookaddress, servicebyname, dateservice } = book;
    
      const [bookData] = await connection.query(checkDataBook, [bookqr]);
    
      if (bookData.length > 0) {
        const [stateData] = await connection.query(checkstatebook, [bookqr]);
    
        if (stateData[0].Bookstate === 'อยู่ในละหว่างดำเนินการ') {
          console.log("อยู่ในละหว่างดำเนินการ");
          return { status: 201, message: `รหัสบาร์โค้ด ${bookqr} อยู่ในละหว่างดำเนินการ` };
        } else {
          await connection.query(updatestatebook, [bookqr]);
          const [repairDocsResult] = await connection.query(insertRepairDocsQuery, [ID_User, bookid, servicebyname]);
          const repairId = repairDocsResult.insertId; // ใช้ insertId แทน
          console.log("RepairID after update:", repairId);
          await connection.query(insertSeverviceQuery, [repairId, dateservice, ID_User]);
          await connection.query(insertStatusQuery, [repairId, ID_User, dateservice]);
          return { status: 200 };
        }
      } else {
        await connection.query(insertBooksQuery, [bookqr, bookid, bookname, booktype, bookaddress]);
        const [repairDocsResult] = await connection.query(insertRepairDocsQuery, [ID_User, bookid, servicebyname]);
        const repairId = repairDocsResult.insertId; // ใช้ insertId แทน
        console.log("RepairID after insert:", repairId);
        await connection.query(insertSeverviceQuery, [repairId, dateservice, ID_User]);
        await connection.query(insertStatusQuery, [repairId, ID_User, dateservice]);
        return { status: 200 };
      }
    });

    const results = await Promise.all(promises);

    await connection.commit();
    console.log("Transaction committed successfully.");

    const errorResult = results.find(result => result.status === 201);
    if (errorResult) {
      return NextResponse.json({ message: errorResult.message }, { status: 201 });
    }

    return NextResponse.json({ message: "ได้ทำการแจ้งเรื่องเรียบร้อย" }, { status: 200 });
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
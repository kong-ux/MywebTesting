import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";
const allowedBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export async function POST(req) {
  const referer = req.headers.get("referer");
  if (!referer || !referer.startsWith(allowedBaseUrl)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }
  const connection = await getConnection();
  const body = await req.json(); // Parse incoming JSON data

  const cookie = (await cookies()).get("session")?.value;
  let session = null;
  if (cookie) {
    try {
      session = await verifyToken(cookie);
    } catch (error) {
      console.error("Failed to verify session", error);
    }
  }
  // console.log("session", session);
  const ID_User = session?.ID_User; // Correct property name
  // console.log("ID_User", ID_User);

  try {
    // console.log("Received Data:", body);

    await connection.beginTransaction();

    const checkDataBook = `SELECT BookQR FROM Books WHERE BookQR = ?;`;
    const checkstatebook = `SELECT BookID, Bookstate FROM Books WHERE BookQR = ?;`;
    const updatestatebook = `UPDATE Books SET Bookstate='อยู่ระหว่างการทำรายการ' WHERE BookQR = ?;`;

    const insertBooksQuery = `    
    INSERT INTO Books (BookQR, BookID, Bookname, Booktype, Bookaddress, Bookstate)
    VALUES (?, ?, ?, ?, ?, 'อยู่ระหว่างการทำรายการ');
    `;

    const updateBooksQuery = `
      UPDATE Books
      SET BookQR = ?, Bookname = ?, Booktype = ?, Bookaddress = ?, Bookstate = 'อยู่ระหว่างการทำรายการ'
      WHERE BookID = ?;
    `;

    const insertRepairDocsQuery = `
      INSERT INTO RepairDocs (FK_User_ID, FK_BookID, ServiceByName)
      VALUES (?, ?, ?);
    `;

    const insertSeverviceQuery = `
      INSERT INTO Service (FK_RepairID, Service, ServiceDate, FK_UserID)
      VALUES (?, ?, ?, ?);
    `;
    const insertStatusQuery = `
      INSERT INTO Status (FK_RepairID, FK_UserID, FK_StatusID, StatusDate)
      VALUES (?, ?, 1, ?);
    `;

    const promises = body.map(async (book) => {
      const {
        bookqr,
        bookid,
        bookname,
        booktype,
        bookaddress,
        servicebyname,
        dateservice,
        service,
      } = book;

      const [bookData] = await connection.query(checkDataBook, [bookqr]);

      if (bookData.length > 0) {
        const [stateData] = await connection.query(checkstatebook, [bookqr]);

        if (stateData[0].Bookstate === "อยู่ระหว่างการทำรายการ") {
          return {
            status: 201,
            message: `รหัสบาร์โค้ด ${bookqr} อยู่ระหว่างการทำรายการ`,
          };
        } else {
          await connection.query(updatestatebook, [bookqr]);
          const [repairDocsResult] = await connection.query(
            insertRepairDocsQuery,
            [ID_User, bookid, servicebyname]
          );
          const repairId = repairDocsResult.insertId; // ใช้ insertId แทน
          // console.log("RepairID after update:", repairId);
          await connection.query(insertSeverviceQuery, [
            repairId,
            service,
            dateservice,
            ID_User,
          ]);
          await connection.query(insertStatusQuery, [
            repairId,
            ID_User,
            dateservice,
          ]);
          return { status: 200 };
        }
      } else {
        try {
          await connection.query(insertBooksQuery, [
            bookqr,
            bookid,
            bookname,
            booktype,
            bookaddress,
          ]);
        } catch (error) {
          if (error.code === "ER_DUP_ENTRY") {
            await connection.query(updateBooksQuery, [
              bookqr,
              bookname,
              booktype,
              bookaddress,
              bookid,
            ]);
          } else {
            throw error;
          }
        }
        const [repairDocsResult] = await connection.query(
          insertRepairDocsQuery,
          [ID_User, bookid, servicebyname]
        );
        const repairId = repairDocsResult.insertId; // ใช้ insertId แทน
        console.log("RepairID after insert:", repairId);
        await connection.query(insertSeverviceQuery, [
          repairId,
          service,
          dateservice,
          ID_User,
        ]);
        await connection.query(insertStatusQuery, [
          repairId,
          ID_User,
          dateservice,
        ]);
        return { status: 200 };
      }
    });

    const results = await Promise.all(promises);

    await connection.commit();
    console.log("Transaction committed successfully.");

    const errorResult = results.find((result) => result.status === 201);
    if (errorResult) {
      return NextResponse.json(
        { message: errorResult.message },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { message: "ได้ทำการแจ้งเรื่องเรียบร้อย" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error inserting book data:", error);

    if (connection) await connection.rollback();

    return NextResponse.json(
      {
        message: "Failed to insert books data",
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

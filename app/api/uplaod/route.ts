import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(req) {;
  const connection = await getConnection();
  const body = await req.json(); // Parse incoming JSON data

  try {
    console.log("Received Data:", body);
  
    await connection.beginTransaction();
  
    for (const book of body) {
      const { BIBID, TITLE, ITEMCLASSNAME, SERVICBYNAME, DATE } = book;
  
      const escapedBIBID = connection.escape(BIBID);
      const escapedTITLE = connection.escape(TITLE);
      const escapedITEMCLASSNAME = connection.escape(ITEMCLASSNAME);
      const escapedSERVICBYNAME = connection.escape(SERVICBYNAME);
      const escapedDATE = connection.escape(DATE);
  
      const InsertQuery = `
        INSERT INTO RepairDocs (Book_ID, Bookname, BookType, Bookaddress, ServiceByName)
        VALUES (${escapedBIBID}, ${escapedTITLE}, ${escapedITEMCLASSNAME}, ${escapedSERVICBYNAME}, ${escapedDATE});
        SET @last_id = LAST_INSERT_ID();
  
        INSERT INTO Status (Status_book_ID, Status, Date_Status)
        VALUES 
        (@last_id, 1, ${escapedDATE});
      `;
  
      console.log("Executing Query:", InsertQuery);
      await connection.query(InsertQuery);
    }
  
    await connection.commit();
    console.log("Transaction committed successfully.");
  
    return NextResponse.json({ message: "Books data inserted successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error inserting book data:", error);
  
    if (connection) await connection.rollback();
  
    return NextResponse.json(
      { message: "Failed to insert books data", error: error.message, stack: error.stack },
      { status: 500 }
    );
  } finally {
    if (connection) connection.end();
  }
  
}

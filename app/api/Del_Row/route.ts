import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

const allowedBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export async function DELETE(req) {
   const referer = req.headers.get('referer');
    if (!referer || !referer.startsWith(allowedBaseUrl)) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }
  const connection = await getConnection();
  const body = await req.json(); // Parse incoming JSON data

  const { Repair_ID, BookQR } = body;

  try {
    const Delrow = 'DELETE FROM RepairDocs WHERE Repair_ID = ?';
    const UpdateBook = 'UPDATE Books SET Bookstate = "ดูที่ชั้น" WHERE BookQR = ?';
    
    await connection.execute(Delrow, [Repair_ID]);
    await connection.execute(UpdateBook, [BookQR]);
    
    return NextResponse.json({ message: 'Row deleted successfully' });
  } catch (error) {
    console.error('Error deleting row:', error);
    return NextResponse.json({ message: 'Error deleting row' }, { status: 500 });
  } finally {
    connection.end();
  }
}
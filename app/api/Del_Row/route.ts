import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function DELETE(req) {
  const connection = await getConnection();
  const body = await req.json(); // Parse incoming JSON data

  const { Repair_ID, BookQR } = body;

  try {
    const Delrow = 'DELETE FROM RepairDocs WHERE Repair_ID = ?';
    const UpdateBook = 'UPDATE Books SET Bookstate = "ออกจำหนายแล้ว" WHERE BookQR = ?';
    
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
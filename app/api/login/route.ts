"use server";
// นำเข้าโมดูลที่จำเป็น
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import bcrypt from "bcrypt";
import { createSession } from "@/lib/session";
const allowedBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export async function POST(req: Request) {
  const referer = req.headers.get("referer");
  if (!referer || !referer.startsWith(allowedBaseUrl)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }
  try {
    // อ่านข้อมูลจาก request body
    const body = await req.json();
    const { username, password } = body;

    // สร้างการเชื่อมต่อกับฐานข้อมูล
    const connection = await getConnection();
    const [rows]: any = await connection.query(
      `SELECT * FROM users WHERE UserAdminID = ?`,
      [username]
    );

    // ตรวจสอบว่าพบผู้ใช้หรือไม่
    if (rows.length === 0) {
      return NextResponse.json({ message: "Login Fail(s)", status: 401 });
    }
    const user = rows[0];

    // ตรวจสอบรหัสผ่าน
    const chekpass = await bcrypt.compare(password, user.Password);
    const payload = {
      ID_User: user.id,
      Username: user.UserAdminName,
    };
    if (!chekpass) {
      return NextResponse.json({ message: "Login Fail", status: 401 });
    }

    // สร้าง session
    await createSession(payload);
    return NextResponse.json({ message: "Login Success", status: 200 });
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json(
      { error: "API Error fetching users" },
      { status: 500 }
    );
  }
}

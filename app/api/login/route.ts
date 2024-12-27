'use server';
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import bcrypt from "bcrypt";
import {createSession} from "@/lib/session";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;
    const connection = await getConnection();
    const [rows]: any = await connection.query(
      `SELECT * FROM USER WHERE Username = ?`,
      [username]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "Login Fail(s)", status: 401 });
    }
    const user = rows[0];;
    const chekpass = await bcrypt.compare(password, user.pass);
    const payload =  {
        ID_User: user.ID_User,
        Username: user.Username
      }
    if (!chekpass) {
      return NextResponse.json({ message: "Login Fail", status: 401, });
    }
    await createSession(payload);
    return NextResponse.json({ message: "Login Success", status: 200 });
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json({ error: "API Error fetching users" }, { status: 500 });
  }
}

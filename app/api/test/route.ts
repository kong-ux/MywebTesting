'use server';
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { cookies } from 'next/headers'
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
      return NextResponse.json({ message: "Login Fail (ไม่เจอ USER)", status: 401 });
    }
    const user = rows[0];
    console.log("user", user);
    // console.log("password", password);
    // console.log("user.pass", user.pass);

    const chekpass = await bcrypt.compare(password, user.pass);
    const payload = {
      ID_User: user.ID_User,
      Username: user.Username
    }
    const token = jwt.sign(payload, "kong", { expiresIn: '1h' });

    if (!chekpass) {
      
      return NextResponse.json({ message: "Login Fail", status: 401, });

    }
    (await cookies()).set("token", token, {
      maxAge: 60 * 60,
      httpOnly: true,
      secure: false,
      sameSite: "none"
    }); 
    return NextResponse.json({ message: "Login Success", status: 200 });
    
    
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json({ error: "API Error fetching users" }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

const API_url = "https://library.psru.ac.th/portal/book_api/";
const Header_token = "271724c92d334b54f4388164c216a03c";

export async function POST(request: Request) {
  const { Input_data_Array } = await request.json();  // รับข้อมูลจาก body ของ request

  const result: Array<{ itemId: string, data: object | null, error?: string, status: number }> = [];

  for (let i = 0; i < Input_data_Array.length; i++) {
    const itemId = Input_data_Array[i];
    const url = `${API_url}item/${itemId}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "token": Header_token,
          "Content-Type": "application/json",
        },
      });

      const status = response.status; // ดึงสถานะการตอบกลับ

      if (!response.ok) {
        throw new Error(`Error fetching data for ${itemId}: ${response.statusText}`);
      }

      const data = await response.json();
      result.push({ itemId, data, status });
    } catch (error: unknown) {
      if (error instanceof Error) {
        result.push({ itemId, data: null, error: error.message, status: 500 });
      } else {
        result.push({ itemId, data: null, error: "Unknown error", status: 500 });
      }
    }
  }

  return NextResponse.json(result);  // ส่งกลับข้อมูลในรูปแบบ JSON
}

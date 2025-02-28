import { NextResponse } from 'next/server';
import { getConnection } from "@/lib/db";
const API_url = "https://library.psru.ac.th/portal/book_api/";
const Header_token = "271724c92d334b54f4388164c216a03c";
const allowedBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(request: Request) {
  const referer = request.headers.get('referer');
  if (!referer || !referer.startsWith(allowedBaseUrl)) {
    return NextResponse.json(
      { error: "Unauthorized access" },
      { status: 403 }
    );
  }

  const connection = await getConnection();

  try {
    const { Input_data_Array } = await request.json();

    if (!Array.isArray(Input_data_Array) || Input_data_Array.some(id => typeof id !== 'string')) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    const checkstatebook = `SELECT BookID, Bookstate FROM Books WHERE BookQR = ?;`;
    const inProgressItems: { itemId: string; message: string; status: 201 }[] = [];

    for (const itemId of Input_data_Array) {
      try {
        const [stateData] = await connection.query(checkstatebook, [itemId]);
        if (stateData.length > 0 && stateData[0].Bookstate === 'อยู่ระหว่างการทำรายการ') {
          inProgressItems.push({
            itemId,
            message: `รหัสบาร์โค้ด ${itemId} อยู่ระหว่างการทำรายการ`,
            status: 201,
          });
        }
      } catch (error) {
        return NextResponse.json({
          itemId,
          data: null,
          error: "Database query failed",
          status: 500,
        });
      }
    }

    if (inProgressItems.length > 0) {
      // Return all in-progress items
      return NextResponse.json(inProgressItems, { status: 201 });
    }

    const promises = Input_data_Array.map(async (itemId) => {
      try {
        const response = await fetch(`${API_url}item/${itemId}`, {
          method: "GET",
          headers: {
            "token": Header_token,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching data for ${itemId}: ${response.statusText}`);
        }

        const data = await response.json();
        return { itemId, data, status: response.status };
      } catch (error) {
        return { itemId, data: null, error: error.message || "Unknown error", status: 500 };
      }
    });

    const result = await Promise.all(promises);
    return NextResponse.json(result, { status: 200 });
  } finally {
    connection.end();
  }
}




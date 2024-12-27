import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

async function verifyToken(token: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode("kong");
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const [header, payload, signature] = token.split(".");

    // Decode the base64url signature to Uint8Array
    const signatureBuffer = base64urlToUint8Array(signature);

    // Verify the signature
    const data = `${header}.${payload}`;
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBuffer,
      encoder.encode(data)
    );

    return valid;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
}

// Function to convert base64url to Uint8Array
function base64urlToUint8Array(base64url: string): Uint8Array {
  // Replace base64url specific characters with base64 characters
  const base64 = base64url
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  // Add padding if necessary
  const padding = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));

  // Decode to Uint8Array
  const binary = atob(base64 + padding);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return array;
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value; s


  if (!token || !(await verifyToken(token))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/Table/:path*', // ใช้ middleware กับ path /Table/*
};

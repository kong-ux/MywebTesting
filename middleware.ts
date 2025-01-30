import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/session'
import { cookies } from 'next/headers'

const protectedRoutes = ['/Release', '/Repair&Update', '/Report-form', '/TableData', '/Dashboard'] 
const publicRoutes = ['/']

export default async function middleware(req: NextRequest) {
  // ตรวจสอบว่าเส้นทางปัจจุบัน Specify protected or public routes
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  const cookie = (await cookies()).get('session')?.value
  let session = null;
  if (cookie) {
    try {
      session = await verifyToken(cookie)
    } catch (error) {
      console.error("Failed to verify session", error)
    }
  }
  if (isProtectedRoute && !session?.ID_User) {
    const url = new URL('/', req.nextUrl)
    url.searchParams.set('user', 'login')
    return NextResponse.redirect(url)
  }
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith('/')
  ) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
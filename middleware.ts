import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/session'
import { cookies } from 'next/headers'
 
// 1. Specify protected and public routes
const protectedRoutes = ['/Table', '/Serivce']
const publicRoutes = ['/login', '/signup', '/']
 
export default async function middleware(req: NextRequest) {
// ตรวจสอบว่าเส้นทางปัจจุบัน Specify protected or public routes
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)
 

  const cookie = (await cookies()).get('session')?.value
  const session = await verifyToken(cookie)
  console.log(session?.ID_User)
 
  if (isProtectedRoute && !session?.ID_User) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
 
  // 5. Redirect to /dashboard if the user is authenticated
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
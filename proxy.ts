import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const apexHost = "jordanbaileyvoice.com";
const wwwHost = `www.${apexHost}`;

export function proxy(request: NextRequest) {
  if (request.headers.get("host") === wwwHost) {
    const redirectUrl = new URL(request.url);

    redirectUrl.host = apexHost;

    return NextResponse.redirect(redirectUrl, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};

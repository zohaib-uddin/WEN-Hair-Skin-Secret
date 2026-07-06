import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Publicly accessible paths that do not require valid session authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/shop",
  "/product(.*)",
  "/about",
  "/contact",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/products(.*)",
  "/api/categories(.*)",
  "/api/search(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // If visitor is unauthenticated and attempting to visit a protected route, redirect to Sign In
  if (!userId && !isPublicRoute(req)) {
    return (await auth()).redirectToSignIn({ returnBackUrl: req.url });
  }

  // Authenticated traffic is approved at middleware tier. 
  // Custom roles checks (e.g., admin role check) are delegated to layout and api middleware bounds.
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Avoid running on passive styling or static asset requests
    "/((?!_next|[^?]*\\.(?:html|css|js|gif|svg|jpg|jpeg|png|woff|woff2|ico|csv|docx|xlsx|zip|webmanifest)).*)",
    // Always validate on API and trpc endpoints
    "/(api|trpc)(.*)"
  ]
};

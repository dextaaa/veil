export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/discover/:path*",
    "/matches/:path*",
    "/messages/:path*",
    "/profile/:path*",
    "/onboarding/:path*",
  ],
};

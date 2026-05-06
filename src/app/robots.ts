import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/settings/",
          "/messages/",
          "/notifications/",
          "/welcome/",
          "/admin/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/auth/", "/settings/", "/messages/"],
      },
    ],
    sitemap: "https://void-platform.vercel.app/sitemap.xml",
    host: "https://void-platform.vercel.app",
  };
}

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://sorteigram.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/sorteios/", "/analytics/", "/configuracoes/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

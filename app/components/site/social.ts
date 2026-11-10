import type { Metadata } from "next";
import { businessData } from "@/lib/business-data";

/**
 * Open Graph / Twitter tags for a page other than the homepage. A page's
 * `openGraph` replaces the layout's whole object (Next.js doesn't deep-merge),
 * so the site name, image, locale and type are repeated here from the layout.
 */
export function pageSocial(path: string, title: string, description: string): Pick<Metadata, "openGraph" | "twitter"> {
  const og = businessData.seo.openGraph;
  return {
    openGraph: {
      title,
      description,
      url: `https://www.keyfoby.com${path}`,
      siteName: businessData.name,
      images: [{ url: og.image, width: 1200, height: 630, alt: og.imageAlt }],
      locale: "en_CA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [og.image],
    },
  };
}

import { businessData } from "@/lib/business-data";

// Homepage-only structured data. The business entity itself (Locksmith,
// @id /#business) is emitted once by the root layout on every page; these
// blocks reference it instead of repeating it.
export default function LocalBusinessSchema() {
  const businessId = businessData.seo.schema["@id"];

  // FAQ answers here must match the visible FAQ section word for word.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: businessData.faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: businessData.name,
    url: businessData.url,
    inLanguage: "en-CA",
    publisher: { "@id": businessId },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webSiteSchema),
        }}
      />
    </>
  );
}

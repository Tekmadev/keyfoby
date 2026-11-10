import { businessData } from "@/lib/business-data";
import { HOME_FAQ } from "./faq";

// Homepage-only structured data. The business entity itself (Locksmith,
// @id /#business, no ratings or reviews) is emitted once by the root layout
// on every page; these blocks reference it instead of repeating it.
export default function HomeSchema() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: businessData.name,
    url: businessData.url,
    inLanguage: "en-CA",
    publisher: { "@id": businessData.seo.schema["@id"] },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
    </>
  );
}

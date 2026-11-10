import { businessData } from "@/lib/business-data";

// The homepage shows these eight questions (the approved mock's selection and
// order). Answers come word for word from businessData.faqItems, and the
// FAQPage JSON-LD is built from this same list, so the two always match.
const HOME_FAQ_QUESTIONS = [
  "How much does car key replacement cost in Hamilton?",
  "Do you charge extra after hours?",
  "Can you replace a car key when I have lost all my keys?",
  "What car makes and models can you program keys for?",
  "How long does key programming take?",
  "How quickly can you get to me?",
  "Do you offer a warranty on key programming services?",
  "Do you work on house or business locks?",
];

export const HOME_FAQ = HOME_FAQ_QUESTIONS.map((q) => {
  const item = businessData.faqItems.find((f) => f.question === q);
  if (!item) throw new Error(`FAQ question missing from business-data: ${q}`);
  return item;
});

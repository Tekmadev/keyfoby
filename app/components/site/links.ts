import { businessData } from "@/lib/business-data";

// Every contact link on the new site is built from lib/business-data.ts.
const { contact, reviews } = businessData;

export const PHONE = contact.phoneDisplay; // (905) 467-6860
export const TEL = contact.phoneHref; // tel:+19054676860
export const EMAIL = contact.email;
export const MAILTO = `mailto:${contact.email}`;

/** wa.me wants the number without "+" (https://wa.me/19054676860). */
export const WA_BASE = `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`;
export const WA_DEFAULT_TEXT = "Hi KeyFoby, I need help with my car key.";
export const waLink = (text: string) => `${WA_BASE}?text=${encodeURIComponent(text)}`;
export const WA_DEFAULT = waLink(WA_DEFAULT_TEXT);
export const WA_PHOTO = waLink("Hi KeyFoby, here's a photo of my car key for a quote.");

export const REVIEWS_URL = reviews.url;

/** Stored with every quote request (CASL proof); must match the SQL seed. */
export const CONSENT_VERSION = "2026-11-10";

export type KeyType = "blade" | "remote" | "flip" | "smart";

export const KEYS: {
  key: KeyType;
  label: string;
  short: string;
  hint: string;
  aria: string;
  start: string;
  desc: string;
}[] = [
  {
    key: "blade",
    label: "Blade key",
    short: "Blade",
    hint: "No buttons",
    aria: "Blade key: no buttons",
    start: "Turn to start",
    desc: "A metal key with a plain head and no buttons. If it has a chip inside, we program that too.",
  },
  {
    key: "remote",
    label: "Remote key",
    short: "Remote",
    hint: "Buttons + blade",
    aria: "Remote key: buttons on the head",
    start: "Usually turn to start",
    desc: "The blade and the lock and unlock buttons in one head. We cut the blade, then program the chip and the buttons.",
  },
  {
    key: "flip",
    label: "Flip key",
    short: "Flip",
    hint: "Folding blade",
    aria: "Flip key: folding blade",
    start: "Usually turn to start",
    desc: "The blade folds into the fob. We cut it, program it and pair the buttons, or move it into a new shell.",
  },
  {
    key: "smart",
    label: "Smart key",
    short: "Smart",
    hint: "Push-to-start",
    aria: "Smart key: push-to-start",
    start: "Push to start",
    desc: "No key to turn: you press Start. A new smart key is programmed to your car.",
  },
];

export const IMG = "/images/site";

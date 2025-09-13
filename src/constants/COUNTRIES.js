// src/constants/countries.js
import flagSA from "@/assets/authentication/flag.svg"; // replace with actual flags for each if available

export const COUNTRIES = [
  { name: "السعودية", code: "+966", flag: flagSA, iso2: "sa" },
  { name: "الإمارات", code: "+971", flag: flagSA, iso2: "ae" },
  { name: "الكويت", code: "+965", flag: flagSA, iso2: "kw" },
  { name: "قطر", code: "+974", flag: flagSA, iso2: "qa" },
  { name: "البحرين", code: "+973", flag: flagSA, iso2: "bh" },
  { name: "عُمان", code: "+968", flag: flagSA, iso2: "om" },
];

// Default country is Saudi Arabia
export const DEFAULT_COUNTRY = COUNTRIES[0];

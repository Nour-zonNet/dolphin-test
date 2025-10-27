// utils/countryDetection.js

/**
 * Detect user's country using IP (preferred), language (fallback), then default.
 * Cached in localStorage for faster performance.
 * @returns {Promise<string>} ISO2 country code (e.g., "eg", "sa")
 */
export async function detectUserCountry() {
  // ✅ Check cache first
  const cached = localStorage.getItem("userCountry");
  if (cached) return cached;

  let country = "sa"; // fallback

  // 1️⃣ Try IP-based detection
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (res.ok) {
      const data = await res.json();
      if (data?.country_code) {
        country = data.country_code.toLowerCase();
      }
    }
  } catch (err) {
    // IP detection failed
  }

  // 2️⃣ Fallback: Browser language
  if (country === "sa") {
    try {
      const lang =
        navigator.language || (navigator.languages && navigator.languages[0]);
      const code = lang?.split("-")[1]?.toLowerCase();
      if (code) country = code;
    } catch (err) {
      // Language detection failed
    }
  }

  // ✅ Save in cache
  localStorage.setItem("userCountry", country);

  return country;
}

/**
 * Get Arabic country name by ISO2 code
 */
export const getCountryNameArabic = (code) => {
  const names = {
    sa: "السعودية",
    ae: "الإمارات",
    kw: "الكويت",
    qa: "قطر",
    bh: "البحرين",
    om: "عُمان",
    eg: "مصر",
    jo: "الأردن",
    lb: "لبنان",
    sy: "سوريا",
    iq: "العراق",
    ye: "اليمن",
    ps: "فلسطين",
    ma: "المغرب",
    tn: "تونس",
    dz: "الجزائر",
    ly: "ليبيا",
    sd: "السودان",
    so: "الصومال",
    dj: "جيبوتي",
    km: "جزر القمر",
    mr: "موريتانيا",
  };
  return names[code] || "السعودية";
};

/**
 * Get dial code for country
 */
export const getDialCode = (code) => {
  const dialCodes = {
    sa: "+966",
    ae: "+971",
    kw: "+965",
    qa: "+974",
    bh: "+973",
    om: "+968",
    eg: "+20",
    jo: "+962",
    lb: "+961",
    sy: "+963",
    iq: "+964",
    ye: "+967",
    ps: "+970",
    ma: "+212",
    tn: "+216",
    dz: "+213",
    ly: "+218",
    sd: "+249",
    so: "+252",
    dj: "+253",
    km: "+269",
    mr: "+222",
  };
  return dialCodes[code] || "+966";
};

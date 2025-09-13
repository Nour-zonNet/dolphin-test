// Country auto-detection utilities

/**
 * Detect user's country using multiple methods
 * @returns {Promise<string>} Country code (sa, eg, qa, etc.)
 */
export const detectUserCountry = async () => {
  // Try multiple detection methods in order of preference

  // 1. Try IP-based geolocation
  try {
    const response = await fetch('https://ipapi.co/json/', {
      timeout: 3000 // 3 second timeout
    });

    if (response.ok) {
      const data = await response.json();
      const countryCode = data.country_code?.toLowerCase();

      // Map all Arabic countries to our supported list
      const countryMapping = {
        'sa': 'sa', // السعودية
        'ae': 'ae', // الإمارات
        'kw': 'kw', // الكويت
        'qa': 'qa', // قطر
        'bh': 'bh', // البحرين
        'om': 'om', // عُمان
        'eg': 'eg', // مصر
        'jo': 'jo', // الأردن
        'lb': 'lb', // لبنان
        'sy': 'sy', // سوريا
        'iq': 'iq', // العراق
        'ye': 'ye', // اليمن
        'ps': 'ps', // فلسطين
        'ma': 'ma', // المغرب
        'tn': 'tn', // تونس
        'dz': 'dz', // الجزائر
        'ly': 'ly', // ليبيا
        'sd': 'sd', // السودان
        'so': 'so', // الصومال
        'dj': 'dj', // جيبوتي
        'km': 'km', // جزر القمر
        'mr': 'mr'  // موريتانيا
      };

      if (countryMapping[countryCode]) {
        console.log('Country detected via IP:', countryCode, '-> mapped to:', countryMapping[countryCode]);
        return countryMapping[countryCode];
      }
    }
  } catch (error) {
    console.log('IP-based country detection failed:', error.message);
  }

  // 2. Try browser language/locale detection
  try {
    const lang = navigator.language.toLowerCase();
    const locale = navigator.language;

    // Check for Arabic locales first
    if (locale.includes('ar-sa') || lang.includes('sa')) return 'sa';
    if (locale.includes('ar-eg') || lang.includes('eg')) return 'eg';
    if (locale.includes('ar-qa') || lang.includes('qa')) return 'qa';

    // Check for general Arabic
    if (lang.startsWith('ar')) {
      console.log('Arabic language detected, defaulting to Saudi Arabia');
      return 'sa';
    }
  } catch (error) {
    console.log('Language detection failed:', error.message);
  }

  // 3. Try timezone-based detection
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (timezone.includes('Riyadh') || timezone.includes('Saudi')) return 'sa';
    if (timezone.includes('Cairo') || timezone.includes('Egypt')) return 'eg';
    if (timezone.includes('Qatar') || timezone.includes('Doha')) return 'qa';

    // Gulf region timezones
    if (timezone.includes('Dubai') || timezone.includes('Kuwait')) return 'sa';
  } catch (error) {
    console.log('Timezone detection failed:', error.message);
  }

  // 4. Default fallback - Saudi Arabia
  console.log('All detection methods failed, defaulting to Saudi Arabia');
  return 'sa';
};

/**
 * Get country display name in Arabic
 * @param {string} countryCode - ISO country code
 * @returns {string} Arabic country name
 */
export const getCountryNameArabic = (countryCode) => {
  const countryNames = {
    'sa': 'السعودية',
    'ae': 'الإمارات',
    'kw': 'الكويت',
    'qa': 'قطر',
    'bh': 'البحرين',
    'om': 'عُمان',
    'eg': 'مصر',
    'jo': 'الأردن',
    'lb': 'لبنان',
    'sy': 'سوريا',
    'iq': 'العراق',
    'ye': 'اليمن',
    'ps': 'فلسطين',
    'ma': 'المغرب',
    'tn': 'تونس',
    'dz': 'الجزائر',
    'ly': 'ليبيا',
    'sd': 'السودان',
    'so': 'الصومال',
    'dj': 'جيبوتي',
    'km': 'جزر القمر',
    'mr': 'موريتانيا'
  };

  return countryNames[countryCode] || 'السعودية';
};

/**
 * Get dial code for country
 * @param {string} countryCode - ISO country code
 * @returns {string} Dial code with + prefix
 */
export const getDialCode = (countryCode) => {
  const dialCodes = {
    'sa': '+966',  // السعودية
    'ae': '+971',  // الإمارات
    'kw': '+965',  // الكويت
    'qa': '+974',  // قطر
    'bh': '+973',  // البحرين
    'om': '+968',  // عُمان
    'eg': '+20',   // مصر
    'jo': '+962',  // الأردن
    'lb': '+961',  // لبنان
    'sy': '+963',  // سوريا
    'iq': '+964',  // العراق
    'ye': '+967',  // اليمن
    'ps': '+970',  // فلسطين
    'ma': '+212',  // المغرب
    'tn': '+216',  // تونس
    'dz': '+213',  // الجزائر
    'ly': '+218',  // ليبيا
    'sd': '+249',  // السودان
    'so': '+252',  // الصومال
    'dj': '+253',  // جيبوتي
    'km': '+269',  // جزر القمر
    'mr': '+222'   // موريتانيا
  };

  return dialCodes[countryCode] || '+966';
};
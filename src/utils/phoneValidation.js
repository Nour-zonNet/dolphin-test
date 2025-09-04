// utils/phoneValidation.js


export const getPhoneValidationError = (phone, countryCode = null) => {
  // Check if phone is empty
  if (!phone || phone.trim() === "") {
    return "رقم الهاتف مطلوب";
  }
  const cleanPhone = phone.trim();

  // If no country code, just check basic format
  if (!countryCode) {
    return cleanPhone.length >= 7 ? null : "رقم الهاتف غير صحيح";
  }

  // Country-specific validation
  switch (countryCode) {
    case "SA": {
      if (!cleanPhone.startsWith("+966")) {
        return "رقم الهاتف السعودي يجب أن يبدأ بـ +966";
      }
      if (cleanPhone === "+966") {
        return "رقم الهاتف مطلوب";
      }
      const phoneNumber = cleanPhone.replace("+966", "");
      if (phoneNumber.length < 9 || phoneNumber.length > 9) {
        return "رقم الهاتف السعودي يجب أن يكون 9 أرقام";
      }
      break;
    }
    case "EG": {
      if (!cleanPhone.startsWith("+20")) {
        return "رقم الهاتف المصري يجب أن يبدأ بـ +20";
      }
      if (cleanPhone === "+20") {
        return "رقم الهاتف مطلوب";
      }
      const phoneNumber = cleanPhone.replace("+20", "");
      if (phoneNumber.length < 10 || phoneNumber.length > 10) {
        return "رقم الهاتف المصري يجب أن يكون 10 أرقام";
      }
      break;
    }
    case "QA": {
      if (!cleanPhone.startsWith("+974")) {
        return "رقم الهاتف القطري يجب أن يبدأ بـ +974";
      }
      if (cleanPhone === "+974") {
        return "رقم الهاتف مطلوب";
      }
      const phoneNumber = cleanPhone.replace("+974", "");
      if (phoneNumber.length < 8 || phoneNumber.length > 8) {
        return "رقم الهاتف القطري يجب أن يكون 8 أرقام";
      }
      break;
    }
    default:
      return "دولة غير مدعومة";
  }

  return null; // Valid phone number
};

/**
 * Simple boolean validation function
 * @param {string} phone - Phone number to validate
 * @param {string} countryCode - Country code
 * @returns {boolean} True if valid, false otherwise
 */
export const validatePhone = (phone, countryCode = null) => {
  return getPhoneValidationError(phone, countryCode) === null;
};

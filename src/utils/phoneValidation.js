// utils/phoneValidation.js
import { PhoneNumberUtil } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();

export const validatePhone = (phone, countryCode = null) => {
  console.log(phone,countryCode)
  try {
    const number = countryCode
      ? phoneUtil.parseAndKeepRawInput(phone, countryCode)
      : phoneUtil.parseAndKeepRawInput(phone);

    return phoneUtil.isValidNumber(number) || "رقم الهاتف غير صحيح";
  } catch {
    return "رقم الهاتف غير صحيح";
  }
};

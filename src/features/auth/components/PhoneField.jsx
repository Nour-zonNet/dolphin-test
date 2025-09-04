import { Controller } from "react-hook-form";
import MyPhone from "../../../components/ui/PhoneInput/PhoneInput";
import { getPhoneValidationError } from "../../../utils/phoneValidation";


const PhoneField = ({ control, setValue, setPhoneNumber, errors, watch, touchedFields }) => {
  // Watch the countryCode field to get real-time updates
  const countryCode = watch("countryCode");

  const handlePhoneChange = (phone, newCountryCode) => {
    // Update form values but don't trigger validation immediately
    setValue("mobile", phone, { shouldValidate: false });
    setValue("countryCode", newCountryCode, { shouldValidate: false });
    setPhoneNumber(phone);
  };

  const handlePhoneBlur = () => {
    // Trigger validation only on blur
    setValue("mobile", watch("mobile"), { shouldValidate: true });
  };

  // Only show errors if the field has been touched
  const shouldShowError = touchedFields.mobile && errors.mobile;

  return (
    <>
      <Controller
        name="mobile"
        control={control}
        rules={{
          required: "رقم الهاتف مطلوب",
          validate: (value) => getPhoneValidationError(value, countryCode),
        }}
        render={({ field: { value } }) => (
          <div onBlur={handlePhoneBlur}>
            <MyPhone
              value={value}
              onChange={handlePhoneChange}
            />
          </div>
        )}
      />

      {shouldShowError && (
        <p className="text-btnClicked text-xs sm:text-sm ">
          {errors.mobile.message}
        </p>
      )}
    </>
  );
};

export default PhoneField;

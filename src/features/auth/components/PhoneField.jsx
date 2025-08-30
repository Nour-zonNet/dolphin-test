import { Controller } from "react-hook-form";
import MyPhone from "../../../components/ui/PhoneInput/PhoneInput";
import { validatePhone } from "../../../utils/phoneValidation";

const PhoneField = ({ control, setValue, setPhoneNumber, errors }) => (
  <>
    <Controller
      name="mobile"
      control={control}
      rules={{
        required: "رقم الهاتف مطلوب",
        validate: (value, { countryCode }) =>
          validatePhone(value, countryCode) || "رقم الهاتف غير صالح",
      }}
      render={({ field: { onChange, value } }) => (
        <MyPhone
          value={value}
          onChange={(phone, countryCode) => {
            onChange(phone);
            setPhoneNumber(phone);
            setValue("countryCode", countryCode, { shouldValidate: true });
          }}
        />
      )}
    />

    {errors.mobile && (
      <p className="text-red-500 text-xs sm:text-sm text-right">
        {errors.mobile.message}
      </p>
    )}
  </>
);

export default PhoneField;

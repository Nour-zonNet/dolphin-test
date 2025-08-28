import IntlTelInput from "intl-tel-input/reactWithUtils";
import "intl-tel-input/styles";
import "./styles.css";
const PhoneInput = ({ setNumber, setIsValid }) => {
  return (
    <div className="w-full">
      <IntlTelInput
        onChangeNumber={setNumber}
        onChangeValidity={setIsValid}
        initOptions={{
          initialCountry: "sa",
          onlyCountries: ["qa", "eg", "sa"],
        }}
      />
    </div>
  );
};

export default PhoneInput;

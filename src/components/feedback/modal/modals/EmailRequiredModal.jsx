import { useTranslation } from "react-i18next";
import { Cross } from "../../../../utils/icons";
import { useState } from "react";

const EmailRequiredModal = ({ onClose, onNavigateToProfile }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic email validation
    if (!email.trim()) {
      setError("يرجى إدخال البريد الإلكتروني");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("صيغة البريد الإلكتروني غير صحيحة");
      return;
    }

    setError("");

    // If you need to navigate or save email
    if (onNavigateToProfile) {
      onNavigateToProfile(email);
    }

    onClose();
  };

  return (
    <div className="relative w-screen max-w-md bg-white rounded-2xl p-6 shadow-lg z-50">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100"
      >
        <Cross width="14" height="14" />
      </button>

      {/* Title */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-800 text-center font-cairo">
          {t("emailRequired.title")}
        </h2>
      </div>

      {/* Separator */}
      <div className="mt-4 border-t border-dashed border-gray-300"></div>

      {/* Message */}
      <div className="mt-6">
        <p className="text-center text-gray-700 text-base font-cairo">
          {t("emailRequired.message")}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 w-full mt-4">
        <div>
          <label className="font-semibold text-lg text-navyteall">
            البريد الإلكتروني
          </label>
        </div>

        <div className="relative w-full h-[50px] rounded-[100px] border-[0.5px] border-solid border-[#aaaaaa] overflow-hidden">
          <input
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-full px-10 text-[12px] md:text-lg text-[#5d6062] bg-transparent outline-none disabled:bg-gray-50"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center font-cairo">{error}</p>
        )}

        {/* Submit Button */}
        <div className="flex justify-center items-center mt-8">
          <button
            type="submit"
            className="w-full bg-orangedeep hover:cursor-pointer text-navyteal font-bold py-3 px-6 rounded-full transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span className="text-navyteal font-bold font-cairo">تحديث</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailRequiredModal;

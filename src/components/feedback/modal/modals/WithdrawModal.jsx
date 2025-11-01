import React, { useState } from "react";
import { ClosePopup } from "@/utils/icons";
import FormatWithCurrency from "@/utils/FormatWithCurrency";
import coinIcon from "@/assets/images/cions.png";
import stcLogo from "@/assets/images/stc.png";
import bankIcon from "@/assets/images/bank.png";

const WithdrawModal = ({ onClose }) => {
  const [selectedMethod, setSelectedMethod] = useState("stc");
  const [stcNumber, setStcNumber] = useState("");
  const [bankData, setBankData] = useState({
    bankName: "",
    accountNumber: "",
    iban: "",
    accountHolderName: "",
  });

  const withdrawableBalance = 50; // TODO: Get from API

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
    if (method === "bank") {
      setStcNumber("");
    } else {
      setBankData({
        bankName: "",
        accountNumber: "",
        iban: "",
        accountHolderName: "",
      });
    }
  };

  return (
    <div className="relative w-[80%] mx-auto max-w-3xl bg-white rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto withdraw-modal-scroll">
      <style>{`
        .withdraw-modal-scroll::-webkit-scrollbar {
          display: none;
        }
        .withdraw-modal-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      {/* Header */}
      <div className="flex flex-col items-center justify-center py-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-gray-200 rounded-full border border-gray-300 p-2 transition-colors"
          aria-label="Close"
        >
          <ClosePopup className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Gold Coins Icon */}
        <img src={coinIcon} alt="coins" className="w-12 h-12 md:w-16 md:h-16 mb-3" />

        {/* Title */}
        <h2 className="text-base md:text-xl lg:text-2xl font-bold text-black">
          الرصيد
        </h2>

        {/* Dashed Line */}
        <div className="w-full border-t border-dashed border-gray-300 mt-4"></div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-12 pb-6 md:pb-8">
        {/* Withdrawable Balance */}
        <div className="mb-6 text-center">
          <p className="text-sm md:text-base text-black mb-2 font-bold text-center">رصيدك القابل للسحب</p>
          <FormatWithCurrency
            amount={withdrawableBalance}
            fractionDigits={0}
            className="text-[#2E7D32] font-bold text-lg md:text-xl lg:text-2xl flex items-center justify-center"
            symbolFill="#2E7D32"
            symbolClass="w-6 h-6"
          />
        </div>

        {/* Withdrawal Method Selection */}
        <div className="space-y-4">
          <p className="text-sm md:text-base text-black font-medium mb-4">
            اختر طريقة السحب :
          </p>

          {/* STC Pay Option */}
          <div>
            <button
              onClick={() => handleMethodChange("stc")}
              className={`w-full flex items-center justify-between p-4 rounded-full border transition-all ${
                selectedMethod === "stc"
                  ? "border-orangedeep bg-orange-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              {/* Radio Button */}
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedMethod === "stc"
                    ? "border-orangedeep bg-orangedeep"
                    : "border-gray-400"
                }`}
              >
                {selectedMethod === "stc" && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-black font-medium text-sm md:text-base">
                  STC Pay
                </span>
                {/* STC Logo */}
                <div className="">
                  <img src={stcLogo} alt="stc" className="w-8 lg:w-10" />
                </div>
              </div>
            </button>

            {/* STC Pay Input Field */}
            {selectedMethod === "stc" && (
              <div className="mt-4">
                <label className="block text-sm md:text-base text-navyteal mb-2">
                  الرقم
                </label>
                <input
                  type="tel"
                  value={stcNumber}
                  onChange={(e) => setStcNumber(e.target.value)}
                  placeholder="اكتب رقمك"
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-orangedeep focus:border-transparent text-sm md:text-base"
                />
              </div>
            )}
          </div>

          {/* Bank Account Option */}
          <div>
            <button
              onClick={() => handleMethodChange("bank")}
              className={`w-full flex items-center justify-between p-4 rounded-full border transition-all ${
                selectedMethod === "bank"
                  ? "border-orangedeep bg-orange-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              {/* Radio Button */}
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedMethod === "bank"
                    ? "border-orangedeep bg-orangedeep"
                    : "border-gray-400"
                }`}
              >
                {selectedMethod === "bank" && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-black font-medium text-sm md:text-base">
                  حساب بنكي
                </span>
                {/* Bank Icon */}
                <div className="">
                  <img src={bankIcon} alt="bank" className="w-7" />
                </div>
              </div>
            </button>

            {/* Bank Account Input Fields */}
            {selectedMethod === "bank" && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm md:text-base text-navyteal mb-2">
                    اسم البنك
                  </label>
                  <input
                    type="text"
                    value={bankData.bankName}
                    onChange={(e) =>
                      setBankData({ ...bankData, bankName: e.target.value })
                    }
                    placeholder="اكتب اسم البنك"
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-orangedeep focus:border-transparent text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm md:text-base text-navyteal mb-2">
                    رقم الحساب
                  </label>
                  <input
                    type="text"
                    value={bankData.accountNumber}
                    onChange={(e) =>
                      setBankData({ ...bankData, accountNumber: e.target.value })
                    }
                    placeholder="اكتب رقم الحساب"
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-orangedeep focus:border-transparent text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm md:text-base text-navyteal mb-2">
                    رقم الآيبان
                  </label>
                  <input
                    type="text"
                    value={bankData.iban}
                    onChange={(e) =>
                      setBankData({ ...bankData, iban: e.target.value })
                    }
                    placeholder="اكتب رقم الآيبان"
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-orangedeep focus:border-transparent text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm md:text-base text-navyteal mb-2">
                    اسم صاحب الحساب
                  </label>
                  <input
                    type="text"
                    value={bankData.accountHolderName}
                    onChange={(e) =>
                      setBankData({
                        ...bankData,
                        accountHolderName: e.target.value,
                      })
                    }
                    placeholder="اكتب اسم صاحب الحساب"
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-orangedeep focus:border-transparent text-sm md:text-base"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Withdraw Button */}
        <div className="mt-6 md:mt-8">
          <button
            onClick={() => {
              // TODO: Handle withdrawal submission
              console.log("Withdraw clicked", {
                method: selectedMethod,
                stcNumber,
                bankData,
              });
            }}
            className="w-full bg-orangedeep hover:bg-btnClicked text-navyteal font-semibold py-3 px-6 rounded-full transition-colors text-sm md:text-base cursor-pointer"
          >
            سحب المبلغ
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;


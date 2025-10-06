import React, { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useComplaints } from "../hooks/useComplaints";
import FileUpload from "./FileUpload";

const ComplaintForm = ({ onClose, onSuccess }) => {
  const { t } = useTranslation();
  const { submitComplaint, submitLoading, submitError } = useComplaints();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "technical",
    files: [],
  });

  const [errors, setErrors] = useState({});

  // Memoized categories to prevent recreation on every render
  const categories = useMemo(
    () => [
      { value: "technical", label: t("complaints.categories.technical") },
      { value: "content", label: t("complaints.categories.content") },
      { value: "teacher", label: t("complaints.categories.teacher") },
      { value: "schedule", label: t("complaints.categories.schedule") },
      { value: "payment", label: t("complaints.categories.payment") },
      { value: "other", label: t("complaints.categories.other") },
    ],
    [t]
  );

  // Memoized input change handler
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors]
  );

  // Memoized file change handler
  const handleFileChange = useCallback((files) => {
    setFormData((prev) => ({
      ...prev,
      files: files,
    }));
  }, []);

  // Memoized validation function
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = t("complaints.validation.titleRequired");
    }

    if (!formData.description.trim()) {
      newErrors.description = t("complaints.validation.descriptionRequired");
    }

    if (formData.description.trim().length < 10) {
      newErrors.description = t("complaints.validation.descriptionMinLength");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.title, formData.description, t]);

  // Memoized submit handler
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      try {
        await submitComplaint(formData);
        onSuccess();
      } catch (error) {
        console.error("Error submitting complaint:", error);
      }
    },
    [validateForm, submitComplaint, formData, onSuccess]
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3 sm:p-4 md:p-5">
      <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b   bg-gradient-to-r bg-orangedeep  text-white rounded-t-2xl">
          <h2 className=" font-bold m-0 text-base md:text-lg sm:text-lg ">
            {t("complaints.addComplaint")}
          </h2>
          <button
            className="bg-transparent border-none text-white text-3xl cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-full border-orangedeep outline-orangedeep hover:bg-white hover:bg-opacity-20 transition-colors duration-300"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-5">
            <label
              htmlFor="title"
              className="block mb-2 font-semibold text-navyteal text-base "
            >
              {t("complaints.form.title")}
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full p-3 border-1 border-gray-300 bg-[#F9F9F9] rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-blue-500 ${
                errors.title ? "border-red-500" : ""
              }`}
              placeholder={t("complaints.form.titlePlaceholder")}
            />
            {errors.title && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.title}
              </span>
            )}
          </div>

          <div className="mb-5">
            <label
              htmlFor="category"
              className="block mb-2 font-semibold text-navyteal text-base "
            >
              {t("complaints.form.category")}
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-3 border-1 border-gray-300 bg-[#F9F9F9] rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-blue-500"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <label
              htmlFor="description"
              className="block mb-2 font-semibold text-navyteal text-base "
            >
              {t("complaints.form.description")}
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`w-full p-3 border-1 border-gray-300 bg-[#F9F9F9] rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-blue-500 resize-y min-h-[100px] ${
                errors.description ? "border-red-500" : ""
              }`}
              placeholder={t("complaints.form.descriptionPlaceholder")}
              rows="5"
            />
            {errors.description && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.description}
              </span>
            )}
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-semibold text-navyteal text-base ">
              {t("complaints.form.attachments")}
            </label>
            <FileUpload
              onFileChange={handleFileChange}
              maxFiles={5}
              acceptedTypes={["image/*", "video/*", "application/pdf"]}
            />
            <small className="text-gray-500 text-sm mt-1 block">
              {t("complaints.form.attachmentsHelp")}
            </small>
          </div>

          {submitError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-5 border border-red-200">
              {submitError}
            </div>
          )}

          <div className="flex gap-4  flex-col-reverse md:flex-row justify-end mt-8 pt-5 border-t  border-gray-200">
            <button
              type="button"
              className="px-6 py-3 border-2 cursor-pointer border-gray-300 bg-gray-50 text-gray-600 rounded-full font-semibold hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 min-w-[100px]"
              onClick={onClose}
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r flex items-center justify-center gap-2 bg-orangedeep text-navyteal rounded-full font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 min-w-[100px] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              disabled={submitLoading}
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 19 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_3531_1962)">
                  <path
                    d="M4.2168 15.0936L8.2083 15.0936L10.8475 17.7298C10.9894 17.8724 11.158 17.9856 11.3438 18.0628C11.5295 18.1401 11.7287 18.1798 11.9298 18.1798C12.0621 18.1796 12.1939 18.1627 12.322 18.1296C12.581 18.0642 12.8181 17.9318 13.0096 17.7456C13.201 17.5594 13.34 17.3261 13.4125 17.0691L18.0678 1.2373L4.2168 15.0936Z"
                    fill="#08233F"
                  />
                  <path
                    d="M3.14096 14.0437L17.0047 0.177734L1.18421 4.84348C0.926611 4.91674 0.692643 5.05608 0.505516 5.24767C0.31839 5.43926 0.184609 5.67644 0.117446 5.9357C0.0502824 6.19495 0.052071 6.46726 0.122634 6.72561C0.193197 6.98396 0.330082 7.21937 0.519709 7.40848L3.14096 10.0275L3.14096 14.0437Z"
                    fill="#08233F"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3531_1962">
                    <rect
                      width="18"
                      height="18"
                      fill="white"
                      transform="translate(0.0761719 0.168945)"
                    />
                  </clipPath>
                </defs>
              </svg>

              {submitLoading ? t("common.loading") : t("complaints.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(ComplaintForm);

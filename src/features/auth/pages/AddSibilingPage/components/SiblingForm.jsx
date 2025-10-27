import React from "react";
import ImageUpload from "./ImageUpload";
import FormField from "./FormField";
import GradeSelect from "./GradeSelect";
import SubmitButton from "./SubmitButton";

const SiblingForm = ({
  fullName,
  setFullName,
  gradeLevel,
  setGradeLevel,
  classes,
  loading,
  isSubmitting,
  imagePreview,
  onImageChange,
  onRemoveImage,
  onSubmit,
}) => {
  return (
    <div className="w-full" id="sibling-form">
      <form
        onSubmit={onSubmit}
        className="py-4 md:py-6 space-y-4 md:space-y-6"
      >
        {/* Profile Picture Section */}
        <ImageUpload
          imagePreview={imagePreview}
          onImageChange={onImageChange}
          onRemoveImage={onRemoveImage}
        />

        {/* Full Name Field */}
        <FormField label="الأسم الكامل">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="اكتب الاسم الكامل"
            className="w-full h-10 sm:h-12 px-4 sm:px-6 rounded-[100px] border-[0.5px] border-solid border-[#3c3c4366] placeholder:text-[#5d5f62] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm sm:text-base [font-family:'Cairo',Helvetica]"
            required
          />
        </FormField>

        {/* Grade Level Field */}
        <FormField label="الصف الدراسي">
          <GradeSelect
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            classes={classes}
            loading={loading}
          />
        </FormField>

        {/* Submit Button */}
        <SubmitButton isSubmitting={isSubmitting} onSubmit={onSubmit} />
      </form>
    </div>
  );
};

export default SiblingForm;

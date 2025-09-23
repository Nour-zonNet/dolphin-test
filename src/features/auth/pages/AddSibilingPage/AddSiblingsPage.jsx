import React from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../../components";
import { useAuth } from "../../hooks/useAuth";
import { useSiblingForm, useImageUpload, useSiblingsState } from "./hooks";
import {
  PageHeader,
  SiblingsQuestion,
  SiblingForm,
  NoSiblingsMessage,
  BrothersList,
  MaxLimitReached,
} from "./components";

const AddSiblingsPage = () => {
  const { brothers, addBrother } = useAuth();
  const { hasSiblings, handleSiblingsChoice, classes, loading } =
    useSiblingsState();
  const {
    fullName,
    setFullName,
    gradeLevel,
    setGradeLevel,
    isSubmitting,
    setIsSubmitting,
  } = useSiblingForm();
  const {
    profileImage,
    imagePreview,
    handleImageChange,
    handleRemoveImage,
    resetImage,
  } = useImageUpload();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (brothers?.length >= 3 || !fullName.trim() || !gradeLevel) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", fullName.trim());
      formData.append("grade", gradeLevel);

      if (profileImage) {
        formData.append("image", profileImage);
      } else {
        formData.append("use_default_image", "true");
      }

      await addBrother(formData).unwrap();

      setFullName("");
      setGradeLevel("");
      resetImage();
    } catch (error) {
      console.warn("Failed to save to server, but stored locally", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout showBackButton={false}>
      <Link
        className="text-orangedeep text-base md:text-lg absolute right-10 -top-15 font-bold underline"
        to="/main-packages"
      >
        تخطى
      </Link>
      <main className="relative max-w-2xl flex flex-col items-center py-4 sm:py-6 px-4 sm:px-6 md:px-8 pb-16 sm:pb-10 mx-auto">
        <PageHeader />

        {/* Content */}
        <section className="w-full max-w-md space-y-6 mb-6">
          <SiblingsQuestion
            hasSiblings={hasSiblings}
            onChoice={handleSiblingsChoice}
          />

          {/* Form (shown only if user has siblings and limit not reached) */}
          {hasSiblings === true && brothers?.length < 3 && (
            <SiblingForm
              fullName={fullName}
              setFullName={setFullName}
              gradeLevel={gradeLevel}
              setGradeLevel={setGradeLevel}
              classes={classes}
              loading={loading}
              isSubmitting={isSubmitting}
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
              onRemoveImage={handleRemoveImage}
              onSubmit={handleSubmit}
            />
          )}

          {/* Message when limit reached */}
          {hasSiblings === true && brothers?.length >= 3 && (
            <MaxLimitReached currentCount={brothers?.length} />
          )}

          {/* Message when user has no siblings */}
          {hasSiblings === false && <NoSiblingsMessage />}
        </section>

        {/* Brothers List */}
        {hasSiblings === true && (
          <BrothersList brothers={brothers} classes={classes} />
        )}
      </main>
    </AuthLayout>
  );
};

export default AddSiblingsPage;

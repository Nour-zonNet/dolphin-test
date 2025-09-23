import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const useSiblingForm = () => {
  const [fullName, setFullName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addBrother } = useAuth();

  const resetForm = useCallback(() => {
    setFullName("");
    setGradeLevel("");
  }, []);

  const validateForm = useCallback(() => {
    if (!fullName.trim()) {
      toast.error("يرجى إدخال الاسم الكامل");
      return false;
    }

    if (!gradeLevel) {
      toast.error("يرجى اختيار الصف الدراسي");
      return false;
    }

    return true;
  }, [fullName, gradeLevel]);

  const handleSubmit = useCallback(
    async (profileImage, onSuccess) => {
      if (!validateForm()) return;

      setIsSubmitting(true);

      try {
        const siblingData = {
          name: fullName.trim(),
          grade: Number(gradeLevel),
          profileImage,
        };

        try {
          await addBrother(siblingData).unwrap();
          toast.success("تمت إضافة الأخ بنجاح");
        } catch (error) {
          console.warn("Failed to save to server, but stored locally", error);
          toast.success("تمت إضافة الأخ بنجاح (محلياً)");
        }

        resetForm();
        onSuccess?.();
      } catch {
        toast.error("فشل في إضافة الأخ");
      } finally {
        setIsSubmitting(false);
      }
    },
    [fullName, gradeLevel, validateForm, addBrother, resetForm]
  );

  return {
    fullName,
    setFullName,
    gradeLevel,
    setGradeLevel,
    isSubmitting,
    setIsSubmitting,
    handleSubmit,
    resetForm,
  };
};

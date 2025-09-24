import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const useImageUpload = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Handle image preview when profile image changes
  useEffect(() => {
    if (profileImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(profileImage);
    } else {
      setImagePreview(null);
    }
  }, [profileImage]);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error("حجم الصورة يجب أن يكون أقل من 5MB");
        return;
      }
      setProfileImage(file);
    }
  }, []);

  const handleRemoveImage = useCallback(() => {
    setProfileImage(null);
    setImagePreview(null);
  }, []);

  const resetImage = useCallback(() => {
    setProfileImage(null);
    setImagePreview(null);
  }, []);

  return {
    profileImage,
    imagePreview,
    handleImageChange,
    handleRemoveImage,
    resetImage,
  };
};

import React, { useRef } from "react";
import { X } from "lucide-react";

// Import all avatars
import avatar1 from "@/assets/avatars/avatar1.webp";
import avatar2 from "@/assets/avatars/avatar2.webp";
import avatar3 from "@/assets/avatars/avatar3.webp";
import avatar4 from "@/assets/avatars/avatar4.webp";
import avatar5 from "@/assets/avatars/avatar5.webp";
import avatar6 from "@/assets/avatars/avatar6.webp";
import avatar7 from "@/assets/avatars/avatar7.webp";
import avatar8 from "@/assets/avatars/avatar8.webp";
import avatar9 from "@/assets/avatars/avatar9.webp";
import avatar10 from "@/assets/avatars/avatar10.webp";
import avatar11 from "@/assets/avatars/avatar11.webp";
import imgUpload from "@/assets/avatars/img-upload.webp";

const avatars = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
  avatar9,
  avatar10,
  avatar11,
];

const AvatarModal = ({ onClose, onSelect }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      const fileUrl = URL.createObjectURL(file);
      onSelect(fileUrl, file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
        >
          <X className="w-5 h-5 text-navyteal" />
        </button>

        {/* Avatar Grid */}
        <div className="grid grid-cols-3 gap-6 place-items-center mt-6">
          {avatars.map((src, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(src, null)}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-transparent hover:border-orangedeep transition-all overflow-hidden hover:cursor-pointer"
            >
              <img
                src={src}
                alt={`Avatar ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}

          {/* Upload Button */}
          <button
            onClick={handleUploadClick}
            className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center bg-amber-100 hover:bg-amber-200 rounded-full transition-all hover:cursor-pointer overflow-hidden"
          >
            <img
              src={imgUpload}
              alt="Upload avatar"
              className="w-full h-full object-cover"
            />
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default AvatarModal;

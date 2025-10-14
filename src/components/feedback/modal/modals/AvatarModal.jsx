import React, { useRef } from "react";
import { X, Plus } from "lucide-react";

const avatars = [
  "/src/assets/avatars/avatar1.png",
  "/src/assets/avatars/avatar2.png",
  "/src/assets/avatars/avatar3.png",
  "/src/assets/avatars/avatar4.png",
  "/src/assets/avatars/avatar5.png",
  "/src/assets/avatars/avatar6.png",
  "/src/assets/avatars/avatar7.png",
  "/src/assets/avatars/avatar8.png",
  "/src/assets/avatars/avatar9.png",
  "/src/assets/avatars/avatar10.png",
  "/src/assets/avatars/avatar11.png",
];


const AvatarModal = ({ onClose, onSelect }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      // Create object URL for preview and pass to parent
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
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Title */}

        {/* Avatar Grid */}
        <div className="grid grid-cols-3 gap-6 place-items-center mt-6">
          {avatars.map((src, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(src, null)}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-transparent hover:border-blue-400 transition-all overflow-hidden hover:cursor-pointer"
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
            className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center bg-amber-100 hover:bg-amber-200 rounded-full transition-all hover:cursor-pointer"
          >
            <img
              src={"/src/assets/avatars/img-upload.png"}
              alt={`upload`}
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
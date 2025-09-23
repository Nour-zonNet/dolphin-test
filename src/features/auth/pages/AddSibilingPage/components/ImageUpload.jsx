import React from "react";

const ImageUpload = ({ imagePreview, onImageChange, onRemoveImage }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <label className="flex flex-col items-center justify-center cursor-pointer relative">
        <div className="relative">
          {imagePreview ? (
            <img
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover border-2  border-gray-400 border-dashed"
              alt="Add photo"
              src={
                imagePreview ||
                "https://c.animaapp.com/mf2i8zbdeyVMjf/img/group-39988.png"
              }
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover border-2 flex justify-center items-center  border-gray-400 border-dashed">
              <svg
                width="38"
                className="w-8 h-8 md:w-10 md:h-10"
                height="51"
                viewBox="0 0 38 51"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.9997 25.5385C25.9303 25.5385 31.5487 19.9201 31.5487 12.9894C31.5487 6.05882 25.9303 0.44043 18.9997 0.44043C12.0691 0.44043 6.45068 6.05882 6.45068 12.9894C6.45068 19.9201 12.0691 25.5385 18.9997 25.5385Z"
                  fill="#8C8C8C"
                />
                <path
                  d="M18.9998 29.7217C8.60862 29.7332 0.187838 38.154 0.17627 48.5452C0.17627 49.7003 1.11264 50.6367 2.26774 50.6367H35.7318C36.8869 50.6367 37.8232 49.7003 37.8232 48.5452C37.8118 38.154 29.391 29.7332 18.9998 29.7217Z"
                  fill="#8C8C8C"
                />
              </svg>
            </div>
          )}

          <div className="absolute bottom-0 right-0 bg-orangedeep rounded-full p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onImageChange}
        />
      </label>
      <div className="font-semibold text-black text-sm sm:text-base text-center [font-family:'Cairo',Helvetica]">
        {imagePreview ? "تم اختيار صورة" : "أضف صورة"}
      </div>
      {imagePreview && (
        <button
          type="button"
          onClick={onRemoveImage}
          className="text-red-500 text-sm mt-1"
        >
          إزالة الصورة
        </button>
      )}
    </div>
  );
};

export default ImageUpload;

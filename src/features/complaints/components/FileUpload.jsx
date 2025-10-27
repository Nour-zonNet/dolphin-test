import React, { useState, useRef, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

const FileUpload = ({
  onFileChange,
  maxFiles = 5,
  acceptedTypes = ["image/*", "video/*"],
}) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Memoized utility functions
  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  const getFileIcon = useCallback((file) => {
    if (file.type.startsWith("image/")) {
      return "🖼️";
    } else if (file.type.startsWith("video/")) {
      return "🎥";
    } else if (file.type === "application/pdf") {
      return "📄";
    }
    return "📎";
  }, []);

  // Memoized file validation
  const validateFile = useCallback(
    (file) => {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return `${file.name}: ${t("complaints.fileSizeError")}`;
      }

      // Check file type
      const isValidType = acceptedTypes.some((type) => {
        if (type.endsWith("/*")) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
      });

      if (!isValidType) {
        return `${file.name}: ${t("complaints.fileTypeError")}`;
      }

      return null;
    },
    [acceptedTypes, t]
  );

  // Memoized file handling
  const handleFiles = useCallback(
    (fileList) => {
      const newFiles = Array.from(fileList);
      const validFiles = [];
      const errors = [];

      newFiles.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          errors.push(error);
          return;
        }

        // Check total files limit
        if (files.length + validFiles.length >= maxFiles) {
          errors.push(t("complaints.maxFilesError"));
          return;
        }

        validFiles.push(file);
      });

      if (errors.length > 0) {
        alert(errors.join("\n"));
      }

      if (validFiles.length > 0) {
        const updatedFiles = [...files, ...validFiles];
        setFiles(updatedFiles);
        onFileChange(updatedFiles);
      }
    },
    [files, maxFiles, validateFile, onFileChange, t]
  );

  // Memoized drag handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleFileInputChange = useCallback(
    (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  const removeFile = useCallback(
    (index) => {
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      onFileChange(updatedFiles);
    },
    [files, onFileChange]
  );

  // Memoized file list items
  const fileItems = useMemo(
    () =>
      files.map((file, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-2 sm:p-3 bg-white rounded-md shadow-sm"
        >
          <div className="flex items-center flex-1 min-w-0">
            <span className="text-lg sm:text-xl mr-2 sm:mr-3 flex-shrink-0">{getFileIcon(file)}</span>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-medium text-navyteal break-all text-xs sm:text-sm truncate">
                {file.name}
              </span>
              <span className="text-xs text-gray-500">
                {formatFileSize(file.size)}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center hover:bg-red-600 transition-colors duration-300 text-sm sm:text-lg flex-shrink-0 ml-2"
            onClick={() => removeFile(index)}
            title={t("complaints.removeFile")}
          >
            ×
          </button>
        </div>
      )),
    [files, getFileIcon, formatFileSize, removeFile, t]
  );

  // Memoized dropzone content
  const dropzoneContent = useMemo(
    () => (
      <div className="pointer-events-none">
        <div className="text-3xl sm:text-4xl md:text-5xl mx-auto flex justify-center items-center mb-3 sm:mb-4 opacity-60">
          <svg
            width="32"
            height="26"
            viewBox="0 0 49 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="sm:w-[40px] sm:h-[32px] md:w-[49px] md:h-[40px]"
          >
            <path
              d="M37.196 10.46C34.574 4.158 28.406 0 21.5 0C12.126 0 4.5 7.626 4.5 17C4.5 18.102 4.606 19.194 4.814 20.266C2.12 22.33 0.5 25.558 0.5 29C0.5 35.064 4.986 40 10.5 40H33.5C41.772 40 48.5 33.272 48.5 25C48.5 18.066 43.812 12.128 37.196 10.46ZM31.086 24.584L26.5 19.998V31.998H22.5V19.998L17.914 24.584L15.086 21.756L21.672 15.17C23.23 13.612 25.77 13.612 27.328 15.17L33.914 21.756L31.086 24.584Z"
              fill="#0088FF"
            />
          </svg>
        </div>
        <p className="text-sm sm:text-base md:text-lg font-semibold text-navyteal mb-2">
          {t("complaints.dragDropFiles")}
        </p>
        <p className="text-xs sm:text-sm md:text-base text-gray-500 mb-3 sm:mb-4">{t("complaints.orClickToSelect")}</p>
        <p className="text-xs sm:text-sm text-gray-400 mb-2">
          {t("complaints.supportedFormats")}: {acceptedTypes.join(", ")}
        </p>
        <p className="text-xs text-gray-400">
          {t("complaints.maxFiles")}: {maxFiles} | {t("complaints.maxSize")}:
          10MB
        </p>
      </div>
    ),
    [t, acceptedTypes, maxFiles]
  );

  return (
    <div className="mt-2">
      <div
        className={`border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 md:p-8 text-center cursor-pointer transition-all duration-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50 ${
          dragActive ? "border-blue-500 bg-blue-50 scale-105" : ""
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {dropzoneContent}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(",")}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {files.length > 0 && (
        <div className="mt-4 sm:mt-5 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <h4 className="text-navyteal font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
            {t("complaints.selectedFiles")} ({files.length})
          </h4>
          <div className="grid grid-cols-1 gap-2">{fileItems}</div>
        </div>
      )}
    </div>
  );
};

export default React.memo(FileUpload);

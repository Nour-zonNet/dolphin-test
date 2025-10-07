import React, { memo } from "react";
import { useTranslation } from "react-i18next";

const ComplaintItem = memo(
  ({ complaint, formatDate, getStatusClass, getStatusText, getFileIcon }) => {
    const { t } = useTranslation();

    return (
      <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-5 border  border-bordercolor/50 border-r-8 border-r-orangedeep hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-2 sm:gap-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 flex-1 leading-tight">
            {complaint?.title}
          </h3>
          <div className="flex flex-col sm:items-end gap-2">
            <span className="text-gray-500 text-xs sm:text-sm">
              {formatDate(complaint?.date)}
            </span>
            <div></div>
          </div>
        </div>

        <div className="flex  flex-row gap-2 justify-between mb-3 sm:mb-4">
          <div className=" bg-orangedeep tracking-wider text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium  inline-block">
            {t(`complaints.categories.${complaint?.type}`)}
          </div>
          <span
            className={`px-2 sm:px-3 py-1 flex items-center justify-center     rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusClass(
              complaint?.status
            )}`}
          >
            {getStatusText(complaint?.status)}
          </span>
        </div>

        <p className="text-gray-600 leading-relaxed mb-4 sm:mb-5 text-sm sm:text-base">
          {complaint?.description}
        </p>

        {complaint?.contents && complaint?.contents.length > 0 && (
          <div className="mt-4 sm:mt-5 p-3 sm:p-4 ">
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-1 sm:gap-3">
              {complaint?.contents.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center bg-[#F2F2F7] p-2 sm:p-3 rounded-lg shadow-sm"
                >
                  <span className="text-base bg-[#C4D6E1] p-2 rounded-full sm:text-lg mr-2 sm:mr-3 flex-shrink-0">
                    <svg
                      width="22"
                      height="24"
                      viewBox="0 0 22 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 0C4.175 0 3.5 0.675 3.5 1.5V22.5C3.5 23.325 4.175 24 5 24H20C20.825 24 21.5 23.325 21.5 22.5V6L15.5 0H5Z"
                        fill="#E2E5E7"
                      />
                      <path
                        d="M17 6H21.5L15.5 0V4.5C15.5 5.325 16.175 6 17 6Z"
                        fill="#B0B7BD"
                      />
                      <path d="M21.5 10.5L17 6H21.5V10.5Z" fill="#CAD1D8" />
                      <path
                        d="M18.5 19.5C18.5 19.9125 18.1625 20.25 17.75 20.25H1.25C0.8375 20.25 0.5 19.9125 0.5 19.5V12C0.5 11.5875 0.8375 11.25 1.25 11.25H17.75C18.1625 11.25 18.5 11.5875 18.5 12V19.5Z"
                        fill="#F15642"
                      />
                      <path
                        d="M3.76953 14.2099C3.76953 14.0119 3.92553 13.7959 4.17678 13.7959H5.56203C6.34203 13.7959 7.04403 14.3179 7.04403 15.3184C7.04403 16.2664 6.34203 16.7944 5.56203 16.7944H4.56078V17.5864C4.56078 17.8504 4.39278 17.9996 4.17678 17.9996C3.97878 17.9996 3.76953 17.8504 3.76953 17.5864V14.2099ZM4.56078 14.5511V16.0451H5.56203C5.96403 16.0451 6.28203 15.6904 6.28203 15.3184C6.28203 14.8991 5.96403 14.5511 5.56203 14.5511H4.56078ZM8.21853 17.9996C8.02053 17.9996 7.80453 17.8916 7.80453 17.6284V14.2219C7.80453 14.0066 8.02053 13.8499 8.21853 13.8499H9.59178C12.3323 13.8499 12.2723 17.9996 9.64578 17.9996H8.21853ZM8.59653 14.5819V17.2684H9.59178C11.211 17.2684 11.283 14.5819 9.59178 14.5819H8.59653ZM13.2443 14.6299V15.5831H14.7735C14.9895 15.5831 15.2055 15.7991 15.2055 16.0084C15.2055 16.2064 14.9895 16.3684 14.7735 16.3684H13.2443V17.6276C13.2443 17.8376 13.095 17.9989 12.885 17.9989C12.621 17.9989 12.4598 17.8376 12.4598 17.6276V14.2211C12.4598 14.0059 12.6218 13.8491 12.885 13.8491H14.9903C15.2543 13.8491 15.4103 14.0059 15.4103 14.2211C15.4103 14.4131 15.2543 14.6291 14.9903 14.6291H13.2443V14.6299Z"
                        fill="white"
                      />
                      <path
                        d="M17.75 20.25H3.5V21H17.75C18.1625 21 18.5 20.6625 18.5 20.25V19.5C18.5 19.9125 18.1625 20.25 17.75 20.25Z"
                        fill="#CAD1D8"
                      />
                    </svg>

                    {/* <img src={getFileIcon(file?.type)} alt="file" className="w-6 h-6" /> */}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium mr-2 text-gray-700 break-all text-xs sm:text-sm truncate block">
                      {file?.name || file?.type === "image"
                        ? "صورة"
                        : file?.type === "video"
                        ? "فيديو"
                        : file?.type === "pdf"
                        ? "ملف PDF"
                        : file?.name || "ملف"}
                    </span>
                  </div>
                  <a
                    href={file?.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-xs font-medium px-2 py-1 rounded  hover:bg-orangedeep hover:text-white transition-all duration-300 flex-shrink-0 ml-2"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M1.70918 11.2002C1.92135 11.2002 2.12484 11.2845 2.27486 11.4345C2.42489 11.5845 2.50918 11.788 2.50918 12.0002V13.6002C2.50918 13.8124 2.59346 14.0159 2.74349 14.1659C2.89352 14.3159 3.09701 14.4002 3.30918 14.4002H12.9092C13.1214 14.4002 13.3248 14.3159 13.4749 14.1659C13.6249 14.0159 13.7092 13.8124 13.7092 13.6002V12.0002C13.7092 11.788 13.7935 11.5845 13.9435 11.4345C14.0935 11.2845 14.297 11.2002 14.5092 11.2002C14.7214 11.2002 14.9248 11.2845 15.0749 11.4345C15.2249 11.5845 15.3092 11.788 15.3092 12.0002V13.6002C15.3092 14.2367 15.0563 14.8472 14.6062 15.2973C14.1561 15.7473 13.5457 16.0002 12.9092 16.0002H3.30918C2.67266 16.0002 2.06221 15.7473 1.61212 15.2973C1.16204 14.8472 0.90918 14.2367 0.90918 13.6002V12.0002C0.90918 11.788 0.993465 11.5845 1.14349 11.4345C1.29352 11.2845 1.49701 11.2002 1.70918 11.2002Z"
                        fill="#08233F"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M3.5438 6.63388C3.69382 6.4839 3.89727 6.39965 4.1094 6.39965C4.32153 6.39965 4.52498 6.4839 4.675 6.63388L8.1094 10.0683L11.5438 6.63388C11.6176 6.55747 11.7059 6.49653 11.8035 6.4546C11.9011 6.41267 12.0061 6.3906 12.1123 6.38968C12.2185 6.38876 12.3238 6.409 12.4222 6.44922C12.5205 6.48945 12.6098 6.54885 12.6849 6.62396C12.76 6.69908 12.8194 6.7884 12.8597 6.88672C12.8999 6.98503 12.9201 7.09038 12.9192 7.1966C12.9183 7.30282 12.8962 7.4078 12.8543 7.5054C12.8124 7.60301 12.7514 7.69128 12.675 7.76508L8.675 11.7651C8.52498 11.9151 8.32153 11.9993 8.1094 11.9993C7.89727 11.9993 7.69382 11.9151 7.5438 11.7651L3.5438 7.76508C3.39382 7.61506 3.30957 7.41161 3.30957 7.19948C3.30957 6.98735 3.39382 6.7839 3.5438 6.63388Z"
                        fill="#08233F"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8.10957 0.799805C8.32174 0.799805 8.52523 0.88409 8.67526 1.03412C8.82528 1.18415 8.90957 1.38763 8.90957 1.5998V11.1998C8.90957 11.412 8.82528 11.6155 8.67526 11.7655C8.52523 11.9155 8.32174 11.9998 8.10957 11.9998C7.8974 11.9998 7.69391 11.9155 7.54389 11.7655C7.39386 11.6155 7.30957 11.412 7.30957 11.1998V1.5998C7.30957 1.38763 7.39386 1.18415 7.54389 1.03412C7.69391 0.88409 7.8974 0.799805 8.10957 0.799805Z"
                        fill="#08233F"
                      />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {complaint?.replay && (
          <div className="mt-4 sm:mt-5 p-3 sm:p-4 bg-green-50 rounded-lg border-r-3 border-green-500">
            <h4 className="text-green-700 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
              {t("complaints.response")}:
            </h4>
            <p className="text-green-700 leading-relaxed mb-2 sm:mb-3 text-sm sm:text-base">
              {complaint?.replay}
            </p>
            {/* {complaint?.replay && (
              <span className="text-xs text-gray-500 italic">
                {t("complaints.responseDate")}:{" "}
                {formatDate(complaint?.replay)}
              </span>
            )} */}
          </div>
        )}
      </div>
    );
  }
);

ComplaintItem.displayName = "ComplaintItem";

export default ComplaintItem;

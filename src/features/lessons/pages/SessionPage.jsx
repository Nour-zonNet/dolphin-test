import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useLessons } from "../hooks/useLessons";
import { Header } from "../../../components/layout";
import { formatDayAndDate } from "../../../utils/dateHelpers";

const SessionPage = () => {
  const { id: sessionId } = useParams();
  const { session } = useLocation().state;
  const { getContentsBySessionId } = useLessons();
  const [contents, setContents] = useState([]);

  const displayTitle = session.subject;
  const displayDate = session.date;

  const [selectedVideo, setSelectedVideo] = useState(
    contents?.find((content) => content.type === "video") || null
  );
  const [activeTab, setActiveTab] = useState("videos");

  const videos = contents?.filter((content) => content.type === "video");
  const pdfs = contents?.filter(
    (content) => content.type === "pdf" || content.type === "file"
  );
  const exams = contents?.filter((content) => content.type === "exam_link");

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  const getFileName = (content) => {
    if (content.name) return content.name;
    if (content.type === "video") return `فيديو الجلسة ${content.id}`;
    if (content.type === "exam_link") return `رابط الامتحان ${content.id}`;
    return `ملف ${content.id}`;
  };

  const formatFileName = (fileName) => {
    return fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
  };

  useEffect(() => {
    const fetchContents = async () => {
      const res = await getContentsBySessionId(sessionId).unwrap();
      if (res) {
        setContents(res);
        setSelectedVideo(
          res?.find((content) => content.type === "video") || null
        );
      }
    };
    fetchContents();
  }, [sessionId, getContentsBySessionId]);

  
 

  return (
    <div className="min-h-screen 0">
      <Header onBack={"/schedule"} title={displayTitle} />
      <div className="container mx-auto px-4 py-6">
        {/* رأس الصفحة */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {displayTitle}
                </h1>
                <p className="text-gray-600 mb-2">
                  وصف الدرس - محتوى تعليمي شامل
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center w-full">
                <div className="flex gap-3 flex-wrap">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {formatDayAndDate(displayDate)}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    {contents?.length} عنصر
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* العمود الأيسر - الفيديو الرئيسي */}
          <div className="lg:col-span-2 space-y-6">
            {/* الفيديو الرئيسي */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg
                    className="w-5 h-5 ml-2 text-orangedeep"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  الفيديو الرئيسي
                </h2>
              </div>
              <div className="p-0">
                {selectedVideo ? (
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={selectedVideo.link}
                      title="فيديو الجلسة"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-96 border-0 rounded-b-lg"
                    ></iframe>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg
                      className="w-16 h-16 text-gray-400 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-gray-500">لا يوجد فيديو متاح</p>
                  </div>
                )}
              </div>
              {selectedVideo && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {getFileName(selectedVideo)}
                    </span>
                    <button
                      className="inline-flex items-center px-3 py-2 border border-orange-300 text-sm leading-4 font-medium rounded-md text-orange-700 bg-orange-50 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orangedeep"
                      onClick={() => window.open(selectedVideo.link, "_blank")}
                    >
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      فتح في نافذة جديدة
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* قائمة الفيديوهات */}
            {videos?.length > 1 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg
                      className="w-5 h-5 ml-2 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                    فيديوهات أخرى
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {videos?.map((video, index) => (
                      <div
                        key={video.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedVideo?.id === video.id
                            ? "border-orangedeep bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleVideoSelect(video)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg
                              className="w-8 h-8 text-orangedeep ml-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                              />
                            </svg>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                فيديو {index + 1}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {getFileName(video)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* العمود الأيمن - الملفات والامتحانات */}
          <div className="space-y-6">
            {/* تبويب المحتويات */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    className={`flex-1 py-3 px-4 text-center font-medium text-sm flex items-center justify-center ${
                      activeTab === "videos"
                        ? "bg-orangedeep text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveTab("videos")}
                  >
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    الفيديوهات ({videos?.length})
                  </button>
                  <button
                    className={`flex-1 py-3 px-4 text-center font-medium text-sm flex items-center justify-center ${
                      activeTab === "files"
                        ? "bg-orangedeep text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveTab("files")}
                  >
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    الملفات ({pdfs?.length})
                  </button>
                  <button
                    className={`flex-1 py-3 px-4 text-center font-medium text-sm flex items-center justify-center ${
                      activeTab === "exams"
                        ? "bg-orangedeep text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveTab("exams")}
                  >
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    الامتحانات ({exams?.length})
                  </button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto p-4">
                {/* تبويب الفيديوهات */}
                {activeTab === "videos" && (
                  <div>
                    <h6 className="text-sm font-medium text-gray-900 mb-3">
                      فيديوهات الجلسة
                    </h6>
                    {videos?.map((video, index) => (
                      <div
                        key={video.id}
                        className={`flex items-center p-3 border rounded-lg mb-2 cursor-pointer transition-colors ${
                          selectedVideo?.id === video.id
                            ? "bg-orangedeep text-white border-orangedeep"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                        onClick={() => handleVideoSelect(video)}
                      >
                        <svg
                          className="w-5 h-5 ml-3 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            فيديو {index + 1}
                          </div>
                          <div
                            className={`text-xs truncate ${
                              selectedVideo?.id === video.id
                                ? "text-orange-100"
                                : "text-gray-500"
                            }`}
                          >
                            {video.name || `فيديو الجلسة ${index + 1}`}
                          </div>
                        </div>
                      </div>
                    ))}
                    {videos?.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <svg
                          className="w-12 h-12 mx-auto mb-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-sm">لا توجد فيديوهات</p>
                      </div>
                    )}
                  </div>
                )}

                {/* تبويب الملفات */}
                {activeTab === "files" && (
                  <div>
                    <h6 className="text-sm font-medium text-gray-900 mb-3">
                      ملفات الجلسة
                    </h6>
                    {pdfs?.map((pdf) => (
                      <div
                        key={pdf.id}
                        className="flex items-center p-3 border border-gray-200 rounded-lg mb-2 bg-white hover:bg-gray-50"
                      >
                        <svg
                          className="w-5 h-5 ml-3 text-red-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {formatFileName(getFileName(pdf))}
                          </div>
                          <div className="text-xs text-gray-500">PDF</div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            className="p-1 text-orange-600 hover:text-orange-800 transition-colors"
                            onClick={() => window.open(pdf.link, "_blank")}
                            title="عرض الملف"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                          <button
                            className="p-1 text-green-600 hover:text-green-800 transition-colors"
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = pdf.link;
                              link.download = getFileName(pdf);
                              link.click();
                            }}
                            title="تحميل الملف"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                    {pdfs?.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <svg
                          className="w-12 h-12 mx-auto mb-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="text-sm">لا توجد ملفات</p>
                      </div>
                    )}
                  </div>
                )}

                {/* تبويب الامتحانات */}
                {activeTab === "exams" && (
                  <div>
                    <h6 className="text-sm font-medium text-gray-900 mb-3">
                      روابط الامتحانات
                    </h6>
                    {exams?.map((exam, index) => (
                      <div
                        key={exam.id}
                        className="flex items-center p-3 border border-gray-200 rounded-lg mb-2 bg-white hover:bg-gray-50"
                      >
                        <svg
                          className="w-5 h-5 ml-3 text-green-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900">
                            امتحان {index + 1}
                          </div>
                          <div className="text-xs text-gray-500">
                            رابط خارجي
                          </div>
                        </div>
                        <button
                          className="p-1 bg-orangedeep text-white rounded hover:bg-orange-600 transition-colors"
                          onClick={() => window.open(exam.link, "_blank")}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                    {exams?.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <svg
                          className="w-12 h-12 mx-auto mb-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                        <p className="text-sm">لا توجد امتحانات</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* معلومات سريعة */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg
                    className="w-5 h-5 ml-2 text-orangedeep"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  معلومات سريعة
                </h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="border border-gray-200 rounded-lg p-3">
                    <svg
                      className="w-6 h-6 text-orangedeep mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <div className="font-bold text-lg text-gray-900">
                      {videos?.length}
                    </div>
                    <div className="text-xs text-gray-500">فيديو</div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <svg
                      className="w-6 h-6 text-red-500 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div className="font-bold text-lg text-gray-900">
                      {pdfs?.length}
                    </div>
                    <div className="text-xs text-gray-500">ملف</div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <svg
                      className="w-6 h-6 text-green-500 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    <div className="font-bold text-lg text-gray-900">
                      {exams?.length}
                    </div>
                    <div className="text-xs text-gray-500">امتحان</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionPage;

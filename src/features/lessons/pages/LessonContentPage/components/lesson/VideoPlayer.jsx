// components/VideoPlayer.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import playVideo from "@/assets/schedule/play-video.svg";
import stopVideo from "@/assets/schedule/stop-video.svg";
import { Fullscreen, Settings, DatePicker, Clock, Teacher } from "@/utils/icons";
import { useTranslation } from "react-i18next";
import lessonVideo from "@/assets/videos/lesson.mp4";
import { useContent } from "@/features/lessons/hooks/useContent";
import poster from "@/assets/schedule/poster.svg";
// ---------- Fallbacks ----------
const DEFAULT_POSTER =
  poster;
// Use your test clip as default embed when API has no video
const DEFAULT_YT_EMBED = "https://www.youtube.com/embed/7sLqMVQaVZg";

// Arabic month names
const AR_MONTHS = [
  "يناير","فبراير","مارس","أبريل","مايو","يونيو",
  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"
];
const formatDayMonthAr = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return "";
  const day = d.getDate();
  const monthName = AR_MONTHS[d.getMonth()] || "";
  return `${day} ${monthName}`;
};

// Helpers
const formatTime = (sec) => {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const s = Math.floor(sec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
};
const isMobileOrTablet = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(max-width: 1024px)").matches ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
const isIOS = () =>
  typeof navigator !== "undefined" &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

// Detect what player to use
const toYouTubeEmbed = (url) => {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      // https://youtu.be/VIDEOID?t=...
      const id = u.pathname.replace("/", "");
      const t = u.searchParams.get("t");
      return `https://www.youtube.com/embed/${id}${t ? `?start=${parseInt(t, 10)}` : ""}`;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      const t = u.searchParams.get("t");
      if (id) {
        return `https://www.youtube.com/embed/${id}${t ? `?start=${parseInt(t, 10)}` : ""}`;
      }
      if (u.pathname.startsWith("/embed/")) return url; // already embed
    }
  } catch {}
  return null;
};
const toVimeoEmbed = (url) => {
  try {
    const u = new URL(url);
    if (u.hostname.includes("vimeo.com")) {
      // vimeo.com/12345 or player.vimeo.com/video/12345
      const parts = u.pathname.split("/").filter(Boolean);
      const id = parts.pop();
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
      if (u.hostname.includes("player.vimeo.com")) return url; // already embed
    }
  } catch {}
  return null;
};

const classifyVideo = (rawUrl) => {
  if (!rawUrl) {
    return { kind: "iframe", src: DEFAULT_YT_EMBED }; // fallback
  }
  const url = String(rawUrl);

  // Known iframe providers
  const yt = toYouTubeEmbed(url);
  if (yt) return { kind: "iframe", src: yt };

  const vm = toVimeoEmbed(url);
  if (vm) return { kind: "iframe", src: vm };

  if (/iframe\.mediadelivery\.net\/embed/i.test(url)) {
    return { kind: "iframe", src: url };
  }

  // HLS
  if (/\.m3u8(\?|$)/i.test(url)) {
    return { kind: "video", src: url, type: "application/vnd.apple.mpegurl" };
  }

  // Direct files
  if (/\.mp4(\?|$)/i.test(url)) {
    return { kind: "video", src: url, type: "video/mp4" };
  }
  if (/\.webm(\?|$)/i.test(url)) {
    return { kind: "video", src: url, type: "video/webm" };
  }

  // Unknown → try native video first; if it fails, user can still open in new tab
  return { kind: "video", src: url, type: "video/mp4" };
};

const VideoPlayer = ({ lessonId }) => {
  const { t } = useTranslation();

  // Pull content from API
  const { content, getContent } = useContent(lessonId);
  useEffect(() => {
    if (lessonId) getContent(lessonId);
  }, [lessonId, getContent]);

  // Meta (fallback to sensible defaults)
  const lessonTitle = content?.title || "الدرس";
  const teacherName = content?.teacher || "—";
  const dateText = formatDayMonthAr(content?.session_date) || "—";

  // Video source classification
  const source = useMemo(() => {
    const urlFromApi = content?.videoUrl; // normalized in your slice
    return classifyVideo(urlFromApi || null);
  }, [content?.videoUrl]);

  // ---------- refs & state ----------
  const stageRef = useRef(null);
  const videoRef = useRef(null);
  const [videoEl, setVideoEl] = useState(null);
  const progressTrackRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [bufferedEnd, setBufferedEnd] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [revealed, setRevealed] = useState(false);  
  const [showIframe, setShowIframe] = useState(false); 
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEmulatedFS, setIsEmulatedFS] = useState(false);
  const [rotateFallback, setRotateFallback] = useState(false);

  const isIframe = source.kind === "iframe";
  const showUI = !isIframe && (showSettings || !isPlaying || (isHovered && !isFullscreen && !isEmulatedFS));

  const setVideoRef = (el) => {
    videoRef.current = el;
    setVideoEl(el);
  };

  const togglePlay = () => {
    if (isIframe) return; // cannot control iframe
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  };

  // Attach native video events only when using <video>
  useEffect(() => {
    if (isIframe) return;
    const v = videoEl;
    if (!v) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTime = () => setCurrent(v.currentTime || 0);
    const onLoadedMeta = () => setDuration(v.duration || 0);
    const onDur = () => setDuration(v.duration || 0);
    const onProgress = () => {
      try {
        if (v.buffered?.length) setBufferedEnd(v.buffered.end(v.buffered.length - 1));
      } catch {}
    };

    if (!isNaN(v.duration)) setDuration(v.duration || 0);
    setCurrent(v.currentTime || 0);
    onProgress();

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onLoadedMeta);
    v.addEventListener("durationchange", onDur);
    v.addEventListener("progress", onProgress);

    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onLoadedMeta);
      v.removeEventListener("durationchange", onDur);
      v.removeEventListener("progress", onProgress);
    };
  }, [videoEl, source.kind, source.src]);

  // Smooth progress updates
  useEffect(() => {
    if (isIframe) return;
    let rafId = null;
    const tick = () => {
      const v = videoRef.current;
      if (v && !v.paused && !v.ended) {
        const t = v.currentTime || 0;
        setCurrent((prev) => (Math.abs(prev - t) > 0.05 ? t : prev));
        rafId = requestAnimationFrame(tick);
      }
    };
    if (!isIframe && isPlaying) rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isPlaying, isIframe]);

  useEffect(() => {
    if (isIframe) return;
    const v = videoEl;
    if (!v) return;
    const onLoadedData = () => {
      if (!isNaN(v.duration)) setDuration(v.duration || 0);
      setCurrent(v.currentTime || 0);
    };
    v.addEventListener("loadeddata", onLoadedData);
    return () => v.removeEventListener("loadeddata", onLoadedData);
  }, [videoEl, isIframe]);

  // Reset times on src change (video mode)
  useEffect(() => {
    if (isIframe) return;
    setCurrent(0);
    setDuration(0);
  }, [source.src, isIframe]);

  // ---------- fullscreen ----------
  const canRealFullscreen = () =>
    typeof document !== "undefined" &&
    stageRef.current &&
    !!stageRef.current.requestFullscreen &&
    !isIOS();

  const enterRealFS = async () => {
    if (!stageRef.current) return;
    await stageRef.current.requestFullscreen();
  };
  const exitRealFS = async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
  };
  const toggleFullscreen = async () => {
    if (canRealFullscreen()) {
      if (isFullscreen) await exitRealFS();
      else await enterRealFS();
    } else {
      setIsEmulatedFS((v) => !v);
    }
    setIsHovered(false);
    setShowSettings(false);
  };

  useEffect(() => {
    if (!isFullscreen && !isEmulatedFS) return;
    let t;
    const onMove = () => {
      setIsHovered(true);
      clearTimeout(t);
      t = setTimeout(() => setIsHovered(false), 1500);
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      clearTimeout(t);
    };
  }, [isFullscreen, isEmulatedFS]);

  const lockOrRotateLandscape = async () => {
    if (!isMobileOrTablet()) return;
    const canLock =
      typeof screen !== "undefined" &&
      screen.orientation &&
      typeof screen.orientation.lock === "function";
    if (canLock) {
      try {
        await screen.orientation.lock("landscape");
        setRotateFallback(false);
        return;
      } catch {}
    }
    setRotateFallback(true);
  };

  const clearOrientation = async () => {
    if (rotateFallback) setRotateFallback(false);
    if (typeof screen !== "undefined" && screen.orientation && screen.orientation.unlock) {
      try {
        screen.orientation.unlock();
      } catch {}
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      setIsHovered(false);
      if (fs) lockOrRotateLandscape();
      else clearOrientation();
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, [rotateFallback]);

  useEffect(() => {
    if (!isEmulatedFS) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lockOrRotateLandscape();
    return () => {
      document.body.style.overflow = prev;
      clearOrientation();
    };
  }, [isEmulatedFS, rotateFallback]);

  // ---------- settings ----------
  const setSpeed = (r) => {
    if (isIframe) return;
    setPlaybackRate(r);
    if (videoRef.current) videoRef.current.playbackRate = r;
    setShowSettings(false);
  };
  const toggleMute = () => {
    if (isIframe) return;
    const m = !muted;
    setMuted(m);
    if (videoRef.current) videoRef.current.muted = m;
  };
  const setVol = (v) => {
    if (isIframe) return;
    const val = Math.min(1, Math.max(0, v));
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      if (val > 0 && muted) {
        videoRef.current.muted = false;
        setMuted(false);
      }
    }
  };

  const settingsRef = useRef(null);

  useEffect(() => {
    if (!showSettings) return;

    const onDown = (e) => {
      if (!settingsRef.current) return;
      if (settingsRef.current.contains(e.target)) return;
      setShowSettings(false);
    };

    const onKey = (e) => {
      if (e.key === "Escape") setShowSettings(false);
    };

    document.addEventListener("mousedown", onDown, { capture: true });
    document.addEventListener("touchstart", onDown, { capture: true, passive: true });
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onDown, { capture: true });
      document.removeEventListener("touchstart", onDown, { capture: true });
      document.removeEventListener("keydown", onKey);
    };
  }, [showSettings]);

  const togglePiP = async () => {
    if (isIframe) return;
    if (!videoRef.current) return;
    if (!("pictureInPictureEnabled" in document)) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch {}
  };

  // ---------- keyboard shortcuts (video only) ----------
  useEffect(() => {
    if (isIframe) return;
    const onKey = (e) => {
      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "arrowleft":
          if (videoRef.current) videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
          break;
        case "arrowright":
          if (videoRef.current) videoRef.current.currentTime = Math.min(duration, (videoRef.current.currentTime || 0) + 5);
          break;
        case "arrowup":
          e.preventDefault();
          setVol(volume + 0.05);
          break;
        case "arrowdown":
          e.preventDefault();
          setVol(volume - 0.05);
          break;
        case "m":
          toggleMute();
          break;
        case "f":
          toggleFullscreen();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [duration, volume, muted, isIframe]);

  // ---------- scrubbing (video only) ----------
  const [scrubbing, setScrubbing] = useState(false);
  const pctFromClientX = (clientX) => {
    const track = progressTrackRef.current;
    if (!track || !duration) return 0;
    const rect = track.getBoundingClientRect();
    const x = Math.min(rect.right, Math.max(rect.left, clientX)) - rect.left;
    return Math.min(1, Math.max(0, x / rect.width));
    };
  const seekToPct = (pct) => {
    if (!videoRef.current || !duration) return;
    const newTime = pct * duration;
    videoRef.current.currentTime = newTime;
    setCurrent(newTime);
  };
  const onPointerDown = (e) => {
    if (isIframe) return;
    e.preventDefault();
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
    if (clientX == null) return;
    setScrubbing(true);
    seekToPct(pctFromClientX(clientX));
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onPointerUp);
  };
  const onPointerMove = (e) => {
    if (!scrubbing) return;
    e.preventDefault();
    seekToPct(pctFromClientX(e.clientX));
  };
  const onTouchMove = (e) => {
    if (!scrubbing) return;
    if (!e.touches?.length) return;
    seekToPct(pctFromClientX(e.touches[0].clientX));
  };
  const onPointerUp = () => {
    setScrubbing(false);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchend", onPointerUp);
  };

  const progressPct = duration ? (current / duration) * 100 : 0;
  const bufferPct = duration ? (Math.min(bufferedEnd, duration) / duration) * 100 : 0;

  // ---------- stage (video or iframe) ----------
  const StageInner = (
    <div
      className="relative w-full h-full"
      style={{
        backgroundImage: DEFAULT_POSTER ? `url("${DEFAULT_POSTER}")` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {isIframe ? (
        <iframe
          title="lesson-video"
          src={source.src}
          className="w-full h-full"
          allow="aclipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <video
          ref={setVideoRef}
          className="w-full h-full object-cover block"
          poster={DEFAULT_POSTER}
          preload="metadata"
          playsInline
          crossOrigin="anonymous"
        >
          <source src={source.src || lessonVideo} type={source.type || 'video/mp4'} />
          متصفحك لا يدعم تشغيل الفيديو.
        </video>
      )}

      {/* Top bar (title) */}
      <div
        className={`absolute top-0 left-0 right-0 px-4 py-2 md:py-4 bg-black/10 to-transparent
          text-white md:text-base text-sm font-semibold
          transition-opacity ${isIframe ? "opacity-100" : showUI ? "opacity-100" : "opacity-0"}`}
      >
        {lessonTitle}
      </div>

      {/* Center overlay (play/pause) — hide for iframe since we can't control it */}
      {!isIframe && (!isPlaying || (!isFullscreen && !isEmulatedFS && isHovered)) && (
        <div
          onClick={togglePlay}
          className={`absolute inset-0 flex flex-col items-center justify-center bg-black/1 cursor-pointer ${
            showSettings ? "pointer-events-none" : ""
          }`}
        >
          <button aria-label={isPlaying ? "Pause" : "Play"}>
            <img
              src={!isPlaying ? stopVideo : playVideo}
              alt={!isPlaying ? "Play" : "Pause"}
              className="w-10 md:w-14 cursor-pointer"
            />
          </button>

          <p
            className={`lg:mt-6 mt-3 font-semibold text-white text-sm md:text-xl z-10 transition-opacity duration-200 ${
              isPlaying ? "opacity-0 invisible" : "opacity-100 visible"
            }`}
            aria-hidden={isPlaying}
          >
            {t("lesson_content.watch_recorded")}
          </p>
        </div>
      )}

      {/* Bottom controls (video only) */}
      {!isIframe && (
        <>
          <div
            className={`absolute left-0 right-0 md:bottom-12 bottom-6 px-6 flex items-center justify-between text-white
              transition-opacity ${showUI ? "opacity-100" : "opacity-0"}`}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="cursor-pointer focus:outline-0"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                title={(isFullscreen || isEmulatedFS) ? (t("Exit fullscreen") || "Exit fullscreen") : (t("Fullscreen") || "Fullscreen")}
              >
                <Fullscreen className="w-4 md:w-5" />
              </button>

              <button
                type="button"
                className="cursor-pointer focus:outline-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSettings((v) => !v);
                }}
                title={t("Settings") || "Settings"}
              >
                <Settings fill="white" className="w-4 md:w-5" />
              </button>
            </div>

            <span className="bg-black/50 rounded-[64px] px-3 py-1 text-sm select-none">
              {formatTime(duration)} / {formatTime(current)}
            </span>
          </div>

          {/* Progress bar */}
          <div className={`absolute left-4 right-4 bottom-2 md:bottom-8 transition-opacity ${showUI ? "opacity-100" : "opacity-0"}`}>
            <div
              ref={progressTrackRef}
              className="relative h-2 bg-white/20 cursor-pointer rounded-full"
              onPointerDown={onPointerDown}
              onTouchStart={onPointerDown}
            >
              <div className="absolute left-0 top-0 h-full bg-white/35 rounded-full" style={{ width: `${bufferPct}%` }} />
              <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${progressPct}%`, backgroundColor: "#E89B32" }} />
              <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow" style={{ left: `calc(${progressPct}% - 6px)` }} />
            </div>
          </div>

          {/* Settings popover */}
          {showSettings && (
            <div
              ref={settingsRef}
              className="absolute right-18 bottom-0 lg:right-6 lg:bottom-18 w-56 rounded-xl p-3 bg-black/80 text-white border border-white/10 backdrop-blur-sm z-30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="md:mb-2 text-sm font-semibold">{t("Playback speed") || "Playback speed"}</div>
              <div className="grid grid-cols-4 gap-2">
                {[0.5, 1, 1.25, 1.5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setSpeed(r)}
                    className={`lg:px-2 py-1 rounded-md border text-[12px] lg:text-sm ${
                      playbackRate === r ? "bg-white text-black" : "border-white/30 hover:bg-white/10"
                    }`}
                  >
                    {r}×
                  </button>
                ))}
              </div>

              <div className="mt-3 border-top border-white/10 pt-3 md:space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>{t("Mute") || "Mute"}</span>
                  <button onClick={toggleMute} className="px-2 py-1 rounded-md border border-white/30 hover:bg-white/10 text-xs">
                    {muted || volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>{t("Volume") || "Volume"}</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={muted ? 0 : volume}
                    onChange={(e) => setVol(parseFloat(e.target.value))}
                    className="w-28 accent-white"
                  />
                </div>

                {"pictureInPictureEnabled" in document && (
                  <div className="flex items-center justify-between text-sm">
                    <span>{t("Picture-in-Picture") || "Picture-in-Picture"}</span>
                    <button onClick={togglePiP} className="px-2 py-1 rounded-md border border-white/30 hover:bg-white/10 text-xs">
                      {document.pictureInPictureElement ? (t("Exit") || "Exit") : (t("Toggle") || "Toggle")}
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span>{t("Loop") || "Loop"}</span>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (videoRef.current) videoRef.current.loop = e.target.checked;
                    }}
                    className="accent-white"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  // ---------- Inline stage ----------
  const InlineStage = (
    <div
      ref={stageRef}
      className="relative lg:h-[500px] md:h-[290px] h-[200px] w-full bg-black group overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0">
        <div className="relative w-full h-full overflow-hidden">{StageInner}</div>
      </div>
    </div>
  );

  // ---------- Emulated fullscreen ----------
  const EmulatedFS = (
    <div className="fixed inset-0 z-[9999] bg-black">
      <div className="absolute inset-0">
        {rotateFallback ? (
          <div
            className="absolute top-1/2 left-1/2"
            style={{
              width: "100vh",
              height: "100vw",
              transform: "translate(-50%, -50%) rotate(90deg)",
              transformOrigin: "center center",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative w-full h-full overflow-hidden">{StageInner}</div>
          </div>
        ) : (
          <div
            className="absolute inset-0"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative w-full h-full overflow-hidden">{StageInner}</div>
          </div>
        )}
      </div>
    </div>
  );

  // ---------- Render ----------
  return (
    <div className="w-full lg:h-[630px] mx-auto lg:mt-0 rounded-2xl overflow-hidden border border-[#00000066]">
      {!isEmulatedFS && InlineStage}
      {isEmulatedFS && EmulatedFS}

      {/* Meta block */}
      <div className="md:p-6 p-2">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-sm md:text-xl text-normalblue">{lessonTitle}</h2>
            <div className="flex items-center gap-6 text-[#BA7C28] mt-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 md:w-5" />
                <span className="font-semibold text-[12px] md:text-lg">50 دقيقة</span>
              </div>
              <div className="flex items-center gap-2">
                <DatePicker className="w-4 md:w-5" />
                <span className="font-semibold text-[12px] md:text-lg">{dateText}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-navyteal">
            <Teacher className="w-4 md:w-5" />
            <span className="font-semibold text-sm md:text-lg">{teacherName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;

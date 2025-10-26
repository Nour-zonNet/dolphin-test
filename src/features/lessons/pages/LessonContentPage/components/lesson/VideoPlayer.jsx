// components/VideoPlayer.jsx
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react"; 
import stopVideo from "@/assets/schedule/stop-video.svg";
import { DatePicker, Teacher } from "@/utils/icons";
import { useTranslation } from "react-i18next";
import { useContent } from "@/features/lessons/hooks/useContent";
import poster from "@/assets/schedule/poster.svg";
// ---------- Fallbacks ----------
const DEFAULT_POSTER = poster;
const DEFAULT_YT_EMBED = "https://www.youtube.com/embed/NUMz00m8ySk";

// Arabic month names
const AR_MONTHS = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
const formatDayMonthAr = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return "";
  const day = d.getDate();
  const monthName = AR_MONTHS[d.getMonth()] || "";
  return `${day} ${monthName}`;
};

// Helpers
// const formatTime = (sec) => {
//   if (!isFinite(sec) || sec < 0) return "0:00";
//   const s = Math.floor(sec);
//   const m = Math.floor(s / 60);
//   const r = s % 60;
//   return `${m}:${String(r).padStart(2, "0")}`;
// };

const isMobileOrTablet = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(max-width: 1024px)").matches ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));

const isIOS = () =>
  typeof navigator !== "undefined" &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

// Detect provider / player
const toYouTubeEmbed = (url) => {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      const t = u.searchParams.get("t");
      return `https://www.youtube.com/embed/${id}${t ? `?start=${parseInt(t, 10)}` : ""}`;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      const t = u.searchParams.get("t");
      if (id) return `https://www.youtube.com/embed/${id}${t ? `?start=${parseInt(t, 10)}` : ""}`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
  } catch {
    // Ignore URL parsing errors
  }
  return null;
};

const toVimeoEmbed = (url) => {
  try {
    const u = new URL(url);
    if (u.hostname.includes("vimeo.com")) {
      const parts = u.pathname.split("/").filter(Boolean);
      const id = parts.pop();
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
      if (u.hostname.includes("player.vimeo.com")) return url;
    }
  } catch {
    // Ignore URL parsing errors
  }
  return null;
};

const classifyVideo = (rawUrl) => {
  if (!rawUrl) return { kind: "iframe", src: DEFAULT_YT_EMBED };
  const url = String(rawUrl);

  const yt = toYouTubeEmbed(url);
  if (yt) return { kind: "iframe", src: yt };

  const vm = toVimeoEmbed(url);
  if (vm) return { kind: "iframe", src: vm };

  if (/iframe\.mediadelivery\.net\/embed/i.test(url)) return { kind: "iframe", src: url };

  if (/\.m3u8(\?|$)/i.test(url)) return { kind: "video", src: url, type: "application/vnd.apple.mpegurl" };
  if (/\.mp4(\?|$)/i.test(url))  return { kind: "video", src: url, type: "video/mp4" };
  if (/\.webm(\?|$)/i.test(url)) return { kind: "video", src: url, type: "video/webm" };

  // Unknown → try native video first
  return { kind: "video", src: url, type: "video/mp4" };
};

const withAutoplay = (src) => {
  try {
    const u = new URL(src);
    if (u.hostname.includes("youtube.com")) {
      u.searchParams.set("autoplay", "1");
      u.searchParams.set("playsinline", "1");
      u.searchParams.set("rel", "0");
      u.searchParams.set("mute", "1"); // improves autoplay on mobile
    } else if (u.hostname.includes("vimeo.com")) {
      u.searchParams.set("autoplay", "1");
      u.searchParams.set("muted", "1");
      u.searchParams.set("playsinline", "1");
    }
    return u.toString();
  } catch {
    return src.includes("?") ? `${src}&autoplay=1&mute=1` : `${src}?autoplay=1&mute=1`;
  }
};

const VideoPlayer = ({ lessonId }) => {
  const { t } = useTranslation();

  // Pull content from API
  const { content, getContent } = useContent(lessonId);
  useEffect(() => { if (lessonId) getContent(lessonId); }, [lessonId, getContent]);

  // Meta
  const lessonTitle = content?.title || "الدرس";
  const teacherName = content?.teacher || "—";
  const dateText = formatDayMonthAr(content?.session_date) || "—";

  // Source (supports iframe or native video)
  const source = useMemo(() => {
    const urlFromApi = content?.videoUrl || DEFAULT_YT_EMBED; // default to local video
    return classifyVideo(urlFromApi);
  }, [content?.videoUrl]);

  const isIframe = source.kind === "iframe";

  // ---------- refs & state ----------
  const stageRef = useRef(null);
  const videoRef = useRef(null);
  const [videoEl, setVideoEl] = useState(null);
  // const progressTrackRef = useRef(null);
  const settingsRef = useRef(null);

  // Cover: keep poster until user clicks & playback actually starts
  const [showCover, setShowCover] = useState(true);
  const [userTriedPlay, setUserTriedPlay] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const [showSettings, setShowSettings] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [current, setCurrent] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [isHovered, setIsHovered] = useState(false);
  // const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEmulatedFS, setIsEmulatedFS] = useState(false);
  const [rotateFallback, setRotateFallback] = useState(false);

  // const showUI = !showCover && !isIframe && (showSettings || !isPlaying || (isHovered && !isFullscreen && !isEmulatedFS));

  const setVideoRef = (el) => { videoRef.current = el; setVideoEl(el); };

  // Build iframe src only after user intent
  const iframeSrc = useMemo(() => {
    if (!isIframe) return null;
    return userTriedPlay ? withAutoplay(source.src) : null;
  }, [isIframe, userTriedPlay, source.src]);

  // Cover click → start playback (video) or mount iframe (with autoplay)
  const handleCoverClick = useCallback(async () => {
    setUserTriedPlay(true);

    if (isIframe) {
      // wait for iframe onLoad below to hide cover, avoids black-frame flash
      return;
    }

    const v = videoRef.current;
    if (!v) return;

    const onPlaying = () => {
      setShowCover(false);
      v.removeEventListener("playing", onPlaying);
    };
    v.addEventListener("playing", onPlaying, { once: true });

    try {
      await v.play();
    } catch {
      try {
        v.muted = true; // mobile safe autoplay
        await v.play();
      } catch {
        v.removeEventListener("playing", onPlaying);
        // keep cover; user may need to tap native control
      }
    }
  }, [isIframe]);

  // Hide cover after iframe is loaded (post user intent)
  useEffect(() => {
    if (!isIframe) return;
    if (userTriedPlay && iframeLoaded) {
      const t = setTimeout(() => setShowCover(false), 300);
      return () => clearTimeout(t);
    }
  }, [isIframe, userTriedPlay, iframeLoaded]);

  // ---------- native video events ----------
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
      // Track video progress
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
  }, [videoEl, source.kind, source.src, isIframe]);

  // Smooth progress while playing
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
    if (isPlaying) rafId = requestAnimationFrame(tick);
    return () => { if (rafId) cancelAnimationFrame(rafId); };
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

  // Reset times on src change (native video)
  useEffect(() => {
    if (isIframe) return;
    setDuration(0);
    setShowCover(true); // return to poster when video source changes
  }, [source.src, isIframe]);

  // Add near other effects
  useEffect(() => {
    const updateRotate = () => {
      // In fullscreen OR emulated FS + "mobile-ish" layout → use rotated fallback
      const mobileLike = isMobileOrTablet() || window.innerWidth < 1024;
      const inFS =
        !!document.fullscreenElement ||
        !!document.webkitFullscreenElement ||
        !!document.msFullscreenElement ||
        isEmulatedFS;

      // If we can't lock orientation (desktop/devtools/iOS), enable fallback rotate
      const canLock =
        typeof screen !== "undefined" &&
        screen.orientation &&
        typeof screen.orientation.lock === "function";

      setRotateFallback(inFS && mobileLike && !canLock);
    };

    updateRotate();
    window.addEventListener("resize", updateRotate);
    window.addEventListener("orientationchange", updateRotate);
    return () => {
      window.removeEventListener("resize", updateRotate);
      window.removeEventListener("orientationchange", updateRotate);
    };
  }, [isEmulatedFS]);

  const togglePlay = useCallback(() => {
    if (isIframe || showCover) return;
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  }, [isIframe, showCover]);

  // ---------- fullscreen & rotation ----------
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
      } catch {
        // Ignore orientation lock errors
      }
    }
    // iOS / unsupported → use emulated fullscreen if requested later
    setRotateFallback(true);
  };

  const clearOrientation = useCallback(async () => {
    if (rotateFallback) setRotateFallback(false);
    if (typeof screen !== "undefined" && screen.orientation && screen.orientation.unlock) {
      try { 
        screen.orientation.unlock(); 
      } catch {
        // Ignore orientation unlock errors
      }
    }
  }, [rotateFallback]);

  const enterIOSNativeFS = () => {
    const v = videoRef.current;
    if (v && v.webkitEnterFullscreen) {
      try { 
        v.webkitEnterFullscreen(); 
      } catch {
        // Ignore fullscreen errors
      }
      return true;
    }
    return false;
  };

  const enterRealFS = async () => {
    const el = stageRef.current;
    if (!el) return;
    const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (req) await req.call(el);
  };

  const exitRealFS = async () => {
    const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
    if (exit) await exit.call(document);
  };

  const toggleFullscreen = useCallback(async () => {
    // iOS: prefer native video fullscreen (more reliable + auto-rotation UI)
    if (isIOS()) {
      if (!enterIOSNativeFS()) {
        // fallback to emulated fullscreen if no native method available
        setIsEmulatedFS((v) => !v);
      }
      setShowSettings(false);
      return;
    }

    const fs =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement;

    if (fs) await exitRealFS();
    else await enterRealFS();

    setIsHovered(false);
    setShowSettings(false);
  }, []);

  // Listen for FS changes (all vendors)
  useEffect(() => {
    const onFsChange = () => {
      const fs =
        !!document.fullscreenElement ||
        !!document.webkitFullscreenElement ||
        !!document.msFullscreenElement;

      setIsFullscreen(fs);

      if (fs) lockOrRotateLandscape();
      else clearOrientation();
    };

    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    document.addEventListener("MSFullscreenChange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
      document.removeEventListener("MSFullscreenChange", onFsChange);
    };
  }, [clearOrientation]);

  // iOS native end-fullscreen
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !isIOS()) return;
    const onEndFS = () => {
      setIsFullscreen(false);
    };
    v.addEventListener("webkitendfullscreen", onEndFS);
    return () => v.removeEventListener("webkitendfullscreen", onEndFS);
  }, []);


  // Emulated fullscreen page scroll handling
  useEffect(() => {
    if (!isEmulatedFS) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lockOrRotateLandscape();
    return () => {
      document.body.style.overflow = prev;
      clearOrientation();
    };
  }, [isEmulatedFS, clearOrientation]);

  // Show/hide controls fade on movement in FS
  useEffect(() => {
    if (!isFullscreen && !isEmulatedFS) return;
    let t;
    const onMove = () => {
      clearTimeout(t);
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      clearTimeout(t);
    };
  }, [isFullscreen, isEmulatedFS]);

  // ---------- settings ----------
  // const setSpeed = (r) => {
  //   if (isIframe) return;
  //   setPlaybackRate(r);
  //   if (videoRef.current) videoRef.current.playbackRate = r;
  //   setShowSettings(false);
  // };
  const toggleMute = useCallback(() => {
    if (isIframe) return;
    const m = !muted;
    setMuted(m);
    if (videoRef.current) videoRef.current.muted = m;
  }, [isIframe, muted]);
  const setVol = useCallback((v) => {
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
  }, [isIframe, muted]);

  useEffect(() => {
    if (!showSettings) return;
    const onDown = (e) => {
      if (!settingsRef.current) return;
      if (settingsRef.current.contains(e.target)) return;
      setShowSettings(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setShowSettings(false); };
    document.addEventListener("mousedown", onDown, { capture: true });
    document.addEventListener("touchstart", onDown, { capture: true, passive: true });
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown, { capture: true });
      document.removeEventListener("touchstart", onDown, { capture: true });
      document.removeEventListener("keydown", onKey);
    };
  }, [showSettings]);

  // const togglePiP = async () => {
  //   if (isIframe) return;
  //   if (!videoRef.current) return;
  //   if (!("pictureInPictureEnabled" in document)) return;
  //   try {
  //     if (document.pictureInPictureElement) await document.exitPictureInPicture();
  //     else await videoRef.current.requestPictureInPicture();
  //   } catch {
  //     // Ignore PiP errors
  //   }
  // };

  // ---------- keyboard shortcuts (video only) ----------
  useEffect(() => {
    if (isIframe) return;
    const onKey = (e) => {
      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          if (showCover) handleCoverClick();
          else togglePlay();
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
        case "f":
          toggleFullscreen();
          break;
        case "m":
          toggleMute();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [duration, volume, muted, isIframe, showCover, handleCoverClick, setVol, toggleFullscreen, toggleMute, togglePlay]);

  // ---------- scrubbing (video only) ----------
  // const [scrubbing, setScrubbing] = useState(false);
  // const pctFromClientX = (clientX) => {
  //   const track = progressTrackRef.current;
  //   if (!track || !duration) return 0;
  //   const rect = track.getBoundingClientRect();
  //   const x = Math.min(rect.right, Math.max(rect.left, clientX)) - rect.left;
  //   return Math.min(1, Math.max(0, x / rect.width));
  // };
  // const seekToPct = (pct) => {
  //   if (!videoRef.current || !duration) return;
  //   const newTime = pct * duration;
  //   videoRef.current.currentTime = newTime;
  //   setCurrent(newTime);
  // };
  // const onPointerDown = (e) => {
  //   if (isIframe || showCover) return;
  //   e.preventDefault();
  //   const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
  //   if (clientX == null) return;
  //   setScrubbing(true);
  //   seekToPct(pctFromClientX(clientX));
  //   window.addEventListener("pointermove", onPointerMove);
  //   window.addEventListener("pointerup", onPointerUp);
  //   window.addEventListener("touchmove", onTouchMove, { passive: false });
  //   window.addEventListener("touchend", onPointerUp);
  // };
  // const onPointerMove = (e) => {
  //   if (!scrubbing) return;
  //   e.preventDefault();
  //   seekToPct(pctFromClientX(e.clientX));
  // };
  // const onTouchMove = (e) => {
  //   if (!scrubbing) return;
  //   if (!e.touches?.length) return;
  //   seekToPct(pctFromClientX(e.touches[0].clientX));
  // };
  // const onPointerUp = () => {
  //   setScrubbing(false);
  //   window.removeEventListener("pointermove", onPointerMove);
  //   window.removeEventListener("pointerup", onPointerUp);
  //   window.removeEventListener("touchmove", onTouchMove);
  //   window.removeEventListener("touchend", onPointerUp);
  // };

  // const progressPct = duration ? (current / duration) * 100 : 0;
  // const bufferPct = duration ? (Math.min(bufferedEnd, duration) / duration) * 100 : 0;

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
      {/* Media element */}
      {isIframe ? (
        iframeSrc && (
          <iframe
            title="lesson-video"
            src={iframeSrc}
            className="w-full h-full"
            allow="autoplay; fullscreen; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            onLoad={() => setIframeLoaded(true)}
          />
        )
      ) : (
        <video
          ref={setVideoRef}
          className="w-full h-full object-cover block"
          poster={DEFAULT_POSTER}
          preload="metadata"
          playsInline
          crossOrigin="anonymous"
        >
          <source src={source.src || DEFAULT_YT_EMBED} type={source.type || "video/mp4"} />

          متصفحك لا يدعم تشغيل الفيديو.
        </video>
      )}

      {/* COVER overlay — keeps poster until actual playback/ready */}
      {showCover && (
        <button
          type="button"
          onClick={handleCoverClick}
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 cursor-pointer"
          aria-label="Play video"
        >
          <img src={stopVideo} alt="Play" className="w-12 md:w-14 drop-shadow" />
          <p className="lg:mt-6 mt-3 font-semibold text-white text-sm md:text-xl">
            {t("lesson_content.watch_recorded")}
          </p>
        </button>
      )}

      {/* Top title bar (hidden while cover is up) */}
      {!showCover && (
        <div className="absolute top-0 left-0 right-0 px-4 py-2 md:py-4 bg-black/10 text-white md:text-base text-sm font-semibold">
          {lessonTitle}
        </div>
      )}
    </div>
  );

  // ---------- Inline stage ----------
  const InlineStage = (
    <div
      ref={stageRef}
      className="relative lg:h-[500px] md:h-[290px] h-[200px] w-full bg-black group overflow-hidden"
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
          >
            <div className="relative w-full h-full overflow-hidden">{StageInner}</div>
          </div>
        ) : (
          <div
            className="absolute inset-0"
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

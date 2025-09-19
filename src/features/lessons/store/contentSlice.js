// store/contentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { contentService } from "../services/content.services";
import api from "@/services/api";

/* ----------------------------- Helpers ----------------------------- */

/** Make all lesson IDs consistent as string keys */
const asKey = (id) => (id == null ? "" : String(id));

/**
 * Decide which origin to use for public files (PDFs/images) when API returns relative filenames.
 * Priority:
 *   1) VITE_PUBLIC_FILES_ORIGIN (e.g., https://cdn.example.com)
 *   2) Origin of axios baseURL (https://host) — path like /api is stripped
 *   3) window.location.origin (browser)
 *   4) '' (no origin; relative files won't resolve)
 */
const getFilesOrigin = () => {
  // 1) explicit env override
  const envOrigin = (import.meta?.env?.VITE_PUBLIC_FILES_ORIGIN || "").trim();
  if (envOrigin) {
    try {
      const u = new URL(envOrigin);
      return `${u.protocol}//${u.host}`;
    } catch {
      // if dev accidentally passed a bare host, try to coerce
      try {
        const u2 = new URL(`https://${envOrigin.replace(/^\/+|\/+$/g, "")}`);
        return `${u2.protocol}//${u2.host}`;
      } catch {}
    }
  }

  // 2) axios baseURL origin (strip any path like /api)
  try {
    const b = api?.defaults?.baseURL || "";
    if (b) {
      const u = new URL(b);
      return `${u.protocol}//${u.host}`;
    }
  } catch {
    // ignore
  }

  // 3) browser origin
  if (typeof window !== "undefined" && window?.location?.origin) {
    return window.location.origin;
  }

  // 4) fallback empty
  return "";
};

/** Clean absolute URLs: unwrap double-domain and ensure protocol */
function fixAbsoluteUrl(linkRaw) {
  if (!linkRaw) return null;
  let link = String(linkRaw).trim();

  // unwrap pattern like: https://host/<actual-absolute-url>
  link = link.replace(/https?:\/\/[^/]+\/(https?:\/\/.*)/i, "$1");

  if (!/^https?:\/\//i.test(link)) link = `https://${link}`;
  try {
    return new URL(link).toString();
  } catch {
    return null;
  }
}

/**
 * Resolve attachment URL based on type and whether it's relative or absolute.
 * - exam_link & video usually absolute → cleaned via fixAbsoluteUrl
 * - pdf & image might be relative filenames → joined with filesOrigin and known folders
 */
function resolveAttachmentUrl(type, linkRaw) {
  if (!linkRaw) return null;

  // Absolute → just clean
  if (/^https?:\/\//i.test(linkRaw)) {
    return fixAbsoluteUrl(linkRaw);
  }

  // Relative → mount on chosen origin
  const origin = getFilesOrigin(); // e.g., https://admintest.learnadolphin.com or CDN origin
  if (!origin) return null; // cannot resolve relative safely

  const path = String(linkRaw).trim();

  // If starts with "/", join directly
  if (path.startsWith("/")) {
    return `${origin}${path}`;
  }

  // Bare filenames: mount on known folders by type
  if (type === "pdf") {
    return `${origin}/lesson/pdf/${path}`;
  }
  if (type === "image") {
    return `${origin}/lesson/images/${path}`;
  }

  // Fallback: just join at root
  return `${origin}/${path}`;
}

/** Normalize API payload into a UI-friendly object */
const normalizeLesson = (raw) => {
  if (!raw) return null;

  const attachments = (raw.attachments || [])
    .map((a) => {
      const url =
        a.type === "exam_link" || a.type === "video"
          ? fixAbsoluteUrl(a.link) // absolute typically
          : resolveAttachmentUrl(a.type, a.link); // pdf/image may be relative

      return {
        id: a.id,
        type: a.type, // "pdf" | "video" | "image" | "exam_link" | ...
        link: url,
        // If your API later adds a title or size per attachment, keep them:
        title: a.title ?? undefined,
        size: a.size ?? undefined,
      };
    })
    .filter((a) => !!a.link);

  const exam = attachments.find((a) => a.type === "exam_link");
  const video = attachments.find((a) => a.type === "video");

  return {
    id: raw.lesson_id,
    title: raw.lesson_data?.name || "",
    session_date: raw.lesson_data?.session_date || "",
    class_session_id: raw.lesson_data?.class_session_id ?? null,

    attachments, // keep full metadata
    examLink: exam?.link ?? null,
    videoUrl: video?.link ?? null,
    hasVideo: !!video,

    training_link: raw.training_link ?? null,
    package: raw.package?.[0] ?? null,
    teacher: raw.teacher?.name || null,
  };
};

/** Standardized error mapper */
const handleError = async (error, thunkAPI) => {
  const msg =
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    "Unknown error";
  return thunkAPI.rejectWithValue(msg);
};

/* ----------------------------- Thunks ------------------------------ */

export const fetchContentByLessonId = createAsyncThunk(
  "content/fetchByLessonId",
  async (lessonId, thunkAPI) => {
    try {
      const idKey = asKey(lessonId);
      const res = await contentService.getByLessonId(idKey, {
        signal: thunkAPI.signal,
      });

      if (!res?.success || !res?.data) {
        throw new Error(res?.message || "Failed to fetch content");
      }

      return {
        lessonId: idKey,
        content: normalizeLesson(res.data),
        raw: res.data,
      };
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  },
  {
    condition: (lessonId, { getState }) => {
      const idKey = asKey(lessonId);
      const loading = getState()?.content?.loadingById?.[idKey];
      return !loading;
    },
  }
);

/* ----------------------------- Slice ------------------------------- */

const contentSlice = createSlice({
  name: "content",
  initialState: {
    byId: {},
    rawById: {},
    loadingById: {},
    errorById: {},

    loading: false,
    error: null,
  },
  reducers: {
    clearContent(state, action) {
      const id = asKey(action.payload);
      delete state.byId[id];
      delete state.rawById[id];
      delete state.loadingById[id];
      delete state.errorById[id];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContentByLessonId.pending, (state, action) => {
        const id = asKey(action.meta.arg);
        state.loading = true;
        state.error = null;
        state.loadingById[id] = true;
        state.errorById[id] = null;
      })
      .addCase(fetchContentByLessonId.fulfilled, (state, action) => {
        const { lessonId, content, raw } = action.payload;
        state.loading = false;

        state.byId[lessonId] = content;
        state.rawById[lessonId] = raw;

        state.loadingById[lessonId] = false;
        state.errorById[lessonId] = null;
      })
      .addCase(fetchContentByLessonId.rejected, (state, action) => {
        const id = asKey(action.meta.arg);
        const msg = action.payload || action.error?.message || "Error";
        state.loading = false;
        state.error = msg;
        state.loadingById[id] = false;
        state.errorById[id] = msg;
      });
  },
});

export const { clearContent } = contentSlice.actions;

/* ---------------------------- Selectors ---------------------------- */

export const selectContent = (s, lessonId) =>
  s?.content?.byId?.[asKey(lessonId)];

export const selectContentRaw = (s, lessonId) =>
  s?.content?.rawById?.[asKey(lessonId)];

export const selectContentLoading = (s, lessonId) =>
  !!s?.content?.loadingById?.[asKey(lessonId)];

export const selectContentError = (s, lessonId) =>
  s?.content?.errorById?.[asKey(lessonId)] || null;

export default contentSlice.reducer;

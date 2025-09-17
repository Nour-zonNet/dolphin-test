// store/contentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { contentService } from "../services/content.services";

const handleError = async (error, thunkAPI) => {
  if (error?.response?.data) {
    return thunkAPI.rejectWithValue(
      error.response.data.error || error.response.data.message || "Server error"
    );
  }
  return thunkAPI.rejectWithValue(error?.message || "Unknown error");
};

function fixExamLink(linkRaw) {
  if (!linkRaw) return null;
  let link = String(linkRaw).trim();
  // keep the inner absolute url if wrapped like https://hostA/https://hostB/...
  link = link.replace(/https?:\/\/[^/]+\/(https?:\/\/.*)/i, "$1");
  if (!/^https?:\/\//i.test(link)) link = `https://${link}`;
  try { return new URL(link).toString(); } catch { return null; }
}

const normalizeLesson = (raw) => {
  if (!raw) return null;
  const exam = (raw.attachments || []).find((a) => a.type === "exam_link");

  return {
    id: raw.lesson_id,
    title: raw.lesson_data?.name || "",
    session_date: raw.lesson_data?.session_date || "",
    class_session_id: raw.lesson_data?.class_session_id ?? null,
    video: raw.video ?? null,
    attachments: (raw.attachments || []).map((a) => a.link),
    examLink: fixExamLink(exam?.link),            // 👈 cleaned once here
    training_link: raw.training_link ?? null,
    package: raw.package?.[0] ?? null,
    hasVideo: !!raw.video,
  };
};

export const fetchContentByLessonId = createAsyncThunk(
  "content/fetchByLessonId",
  async (lessonId, thunkAPI) => {
    try {
      const res = await contentService.getByLessonId(lessonId);
      if (!res?.success || !res?.data) {
        throw new Error(res?.message || "Failed to fetch content");
      }
      return {
        lessonId,
        content: normalizeLesson(res.data),
        raw: res.data,
      };
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  },
  {
    condition: (lessonId, { getState }) => {
      const loading = getState()?.content?.loadingById?.[lessonId];
      return !loading;
    },
  }
);

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
      const id = action.payload;
      delete state.byId[id];
      delete state.rawById[id];
      delete state.loadingById[id];
      delete state.errorById[id];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContentByLessonId.pending, (state, action) => {
        const id = action.meta.arg;
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
        const id = action.meta.arg;
        const msg = action.payload || action.error?.message || "Error";
        state.loading = false;
        state.error = msg;
        state.loadingById[id] = false;
        state.errorById[id] = msg;
      });
  },
});

export const { clearContent } = contentSlice.actions;
export default contentSlice.reducer;

export const selectContent        = (s, lessonId) => s?.content?.byId?.[lessonId];
export const selectContentRaw     = (s, lessonId) => s?.content?.rawById?.[lessonId];
export const selectContentLoading = (s, lessonId) => !!s?.content?.loadingById?.[lessonId];
export const selectContentError   = (s, lessonId) => s?.content?.errorById?.[lessonId] || null;

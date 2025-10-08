import React, { Fragment, useState, useRef, useMemo, useEffect } from "react";
import { Card, Col, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";

import Seo from "../../../../shared/layouts-components/seo/seo";
import SpkTooltips from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-tooltips";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkTables from "../../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import { Taskstable } from "../../../../shared/data/applications/task/listviewdata";
import CancelModal from "./components/modals/CancelModal";
import DelayModal from "./components/modals/DelayModal";
import UpdateModal, { type UpdateValues } from "./components/modals/UpdateModal";
import type { DelayValues } from "./components/modals/DelayModal";

// FullCalendar
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import arLocale from "@fullcalendar/core/locales/ar";
import { Class, Group, Lesson, Subject, Time } from "../../../../utils/icons";

// API hook
import { useSchedule } from "../../../../hooks/useSchedule";

// ===================== helpers outside component =====================
type UITask = {
  id: string;
  title: string;
  lesson: string;
  date: string;       // YYYY-MM-DD
  startDate: string;  // same as date
  time: string;       // HH:mm
  startTime: string;  // same as time
  group: string;
  groupName: string;
  sessionUrl: string;
  status?: string;    // active | postponed | postpand | alternate | canceled | ...
  classNames: string[];
  logicalKey: string; // group + lesson (no date)
  sourceId?: string;  // original API id this row is derived from
  isAlternate?: boolean;
};

const makeLogicalKeyFromApi = (s: any) =>
  `${s.group_id || s.group_name}|${s.name || s.subject || ""}`;

const normalizeHm = (t?: string) => {
  if (!t) return "";
  const m = String(t).trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  return m ? `${m[1].padStart(2, "0")}:${m[2]}` : String(t).slice(0, 5);
};

const mapApiToUITask = (s: any): UITask => ({
  id: String(s.id),
  title: s.subject ?? "—",
  lesson: s.name ?? "—",
  date: s.date ? String(s.date).slice(0, 10) : "",
  startDate: s.date ? String(s.date).slice(0, 10) : "",
  time: s.start_time ? normalizeHm(String(s.start_time)) : "",
  startTime: s.start_time ? normalizeHm(String(s.start_time)) : "",
  group: s.group_name ?? "—",
  groupName: s.group_name ?? "—",
  sessionUrl: s.session_link ?? "#!",
  status: s.status ?? "",
  classNames: Array.isArray(s.class_names) ? s.class_names : s.class_names ? [s.class_names] : [],
  logicalKey: makeLogicalKeyFromApi(s),
  sourceId: s._sourceId ? String(s._sourceId) : String(s.id),
  isAlternate: Boolean(s._isAlternate),
});

// backend wants DD-MM-YYYY
const toDDMMYYYYParam = (d: Date) => {
  const dd = d.getDate();
  const mm = d.getMonth() + 1;
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

// --------- finished status helpers ---------
const taskDateTime = (t: UITask) => {
  const d = (t.date || t.startDate || "").slice(0, 10);
  const hm = (t.time || t.startTime || "00:00").slice(0, 5);
  if (!d) return null;
  const iso = `${d}T${/^\d{2}:\d{2}$/.test(hm) ? hm : "00:00"}:00`;
  const dt = new Date(iso);
  return Number.isNaN(dt.getTime()) ? null : dt;
};

const isFinished = (t: UITask) => {
  const dt = taskDateTime(t);
  if (!dt) return false;
  return dt.getTime() < Date.now();
};

// Use this derived status in rendering
const effectiveStatus = (t: UITask) => (isFinished(t) ? "finished" : (t.status || ""));

// Status chip
const StatusChip: React.FC<{ status?: string }> = ({ status }) => {
  const st = (status || "").toLowerCase();
  if (st === "alternate")
    return <span className="badge bg-warning-subtle text-warning-emphasis">بديلة</span>;
  if (st === "active")
    return <span className="badge bg-success-subtle text-success-emphasis">فعالة</span>;
  if (st === "postpand" || st === "postponed")
    return <span className="badge bg-secondary-subtle text-secondary-emphasis">مؤجَّلة</span>; // gray
  if (st === "finished")
    return <span className="badge bg-dark-subtle text-dark-emphasis">منتهية</span>;
  if (st === "canceled" || st === "cancelled")
    return <span className="badge bg-danger-subtle text-danger-emphasis">ملغاة</span>;
  return <span className="badge bg-light text-dark">—</span>;
};
// =====================================================================

interface TaskListViewProps {}

const TaskListView: React.FC<TaskListViewProps> = () => {
  // ---------- FullCalendar demo ----------
  let eventGuid = 0;
  const createEventId = () => String(++eventGuid);
  const todayStr = new Date().toISOString().replace(/T.*$/, "");
  const INITIAL_EVENTS = [
    { id: createEventId(), title: "Meeting", start: todayStr },
    { id: createEventId(), title: "Meeting Time", start: todayStr + "T16:00:00" },
  ];

  // ---------- view state ----------
  const [calendarView, setCalendarView] =
    useState<"timeGridWeek" | "listDay">("timeGridWeek");
  const [currentDay, setCurrentDay] = useState<Date>(new Date());
  const calendarRef = useRef<FullCalendar | null>(null);

  // API hook
  const { items: apiItems, loading, error, loadDay, loadWeek, postpone, cancelSession, updateSession } = useSchedule();

  // ---------- modals ----------
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [activeTask, setActiveTask] = useState<UITask | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelTask, setCancelTask] = useState<UITask | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateTask, setUpdateTask] = useState<UITask | null>(null);

  const openCancel = (task: UITask) => {
    setCancelTask(task);
    setShowCancelModal(true);
  };
  const closeCancel = () => {
    setShowCancelModal(false);
    setCancelTask(null);
  };

  const submitCancel = async () => {
    if (!cancelTask) return;
    try {
      await cancelSession(cancelTask.id); // call endpoint

      // Optimistic: mark this exact row as canceled
      setAllData(prev =>
        prev.map(t => (t.id === cancelTask.id ? { ...t, status: "canceled" } : t))
      );

      // Also pin override so any refetch keeps it canceled
      setOverridesById(prev => ({ ...prev, [String(cancelTask.id)]: { ...cancelTask, status: "canceled" } as any }));

      // Refresh active view
      const dayParam = toDDMMYYYYParam(currentDay);
      if (calendarView === "timeGridWeek") await loadWeek(dayParam);
      else await loadDay(dayParam);

      closeCancel();
    } catch (e: any) {
      console.error("cancel failed:", e?.response || e);
      alert(
        e?.response?.data?.message ||
        (e?.response?.data?.errors && JSON.stringify(e.response.data.errors)) ||
        e?.message ||
        "فشل إلغاء الجلسة"
      );
    }
  };

  const openDelay = (task: UITask) => {
    setActiveTask(task);
    setShowDelayModal(true);
  };
  const closeDelay = () => {
    setShowDelayModal(false);
    setActiveTask(null);
  };

  const openUpdate = (task: UITask) => {
    setUpdateTask(task);
    setShowUpdateModal(true);
  };
  const closeUpdate = () => {
    setShowUpdateModal(false);
    setUpdateTask(null);
  };

  // submit handler: UPDATE
  const submitUpdate = async (values: UpdateValues) => {
    if (!updateTask) return;

    const apiId = updateTask.sourceId ?? updateTask.id;
    try {
      const res = await updateSession(apiId, {
        name: values.name?.trim() || undefined,
        session_link: values.link?.trim() || undefined,
      });
      const updated = res.data;

      const idsToTouch = new Set([
        String(apiId),          // what we asked to update (base id)
        String(updated.id),     // what backend returned
        String(updateTask.id),  // the row we clicked (may be parent_session.id)
      ]);

      setAllData(prev =>
        prev.map(t => {
          if (idsToTouch.has(String(t.id)) || idsToTouch.has(String(t.sourceId))) {
            return {
              ...t,
              lesson: updated.name ?? t.lesson,
              title: updated.subject ?? t.title,
              sessionUrl: updated.session_link ?? t.sessionUrl,
              status: updated.status ?? t.status,
              date: updated.date ? String(updated.date).slice(0, 10) : t.date,
              time: updated.start_time ? String(updated.start_time).slice(0, 5) : t.time,
              classNames: Array.isArray(updated.class_names) ? updated.class_names : t.classNames,
              group: updated.group_name ?? t.group,
              groupName: updated.group_name ?? t.groupName,
            };
          }
          return t;
        })
      );

      setOverridesById(prev => {
        const next = { ...prev };
        for (const id of idsToTouch) {
          next[id] = {
            ...mapApiToUITask({ ...updated, id }), // normalize under either id
            _sourceId: String(updated.id),
          } as any;
        }
        return next;
      });

      const dayParam = toDDMMYYYYParam(currentDay);
      if (calendarView === "timeGridWeek") await loadWeek(dayParam);
      else await loadDay(dayParam);

<<<<<<< HEAD
export const Cancel = ({ className = "" ,fill = "black"}) => (
  <svg
    fill={fill}
    className={className}
    width="19"
    height="18"
    viewBox="0 0 19 18"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1126_2335)">
      <path
        d="M9.5 0C4.52943 0 0.5 4.02943 0.5 9C0.5 13.9706 4.52943 18 9.5 18C14.4706 18 18.5 13.9706 18.5 9C18.4946 4.03165 14.4684 0.00537891 9.5 0ZM12.5 10.9402C12.8048 11.2207 12.8244 11.6952 12.5439 12C12.2634 12.3048 11.789 12.3244 11.4842 12.0439C11.4689 12.0299 11.4543 12.0152 11.4402 12L9.5 10.0605L7.5605 12C7.26255 12.2877 6.78777 12.2795 6.50001 11.9815C6.21932 11.6909 6.21932 11.2301 6.50001 10.9395L8.43951 9L6.50001 7.0605C6.21226 6.76255 6.22052 6.28777 6.51847 6.00001C6.80911 5.71932 7.26986 5.71932 7.5605 6.00001L9.5 7.93951L11.4402 6.00001C11.7207 5.69524 12.1952 5.67555 12.5 5.95607C12.8048 6.23658 12.8244 6.71105 12.5439 7.01582C12.5299 7.03107 12.5152 7.0457 12.5 7.05976L10.5605 9L12.5 10.9402Z"
        fill={fill}
      />
    </g>
    <defs>
      <clipPath id="clip0_1126_2335">
        <rect width="18" height="18" fill="white" transform="translate(0.5)" />
      </clipPath>
    </defs>
  </svg>
);
=======
      closeUpdate();
    } catch (e: any) {
      console.error("update failed:", e?.response || e);
      alert(
        e?.response?.data?.message ||
          (e?.response?.data?.errors && JSON.stringify(e.response.data.errors)) ||
          e?.message ||
          "فشل تحديث الجلسة"
      );
    }
  };
>>>>>>> feature/loader

  // normalize to "HH:mm"
  const toHm = (t: string) => {
    if (!t) return t;
    const m = t.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (!m) return t;
    return `${m[1].padStart(2, "0")}:${m[2]}`;
  };

  // ---------- table data ----------
  const [allData, setAllData] = useState<UITask[]>(
    (Taskstable as any[]).map((x) => ({
      ...x,
      logicalKey: `${x.groupName || x.group}|${x.lesson || x.title || ""}`,
    }))
  );

  // In-memory overrides by **id** (not by logicalKey) so alternate+postponed can coexist
  const [overridesById, setOverridesById] = useState<Record<string, UITask>>({});

  const [selectedTasks, setSelectedTasks] = useState(
    Taskstable.map((_, index) => index === 1 || index === 4 || index === 5 || index === 7)
  );

  const handleSelectAll = () => {
    const areAllSelected = selectedTasks.every((s) => s);
    setSelectedTasks(Taskstable.map(() => !areAllSelected));
  };

  // ---------- util ----------
  const fmtYMD = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const cardsForDay = useMemo(() => {
    const dayYMD = fmtYMD(currentDay);
    return allData.filter((task) => {
      const date = task.date ?? task.startDate ?? "";
      if (!date) return false;
      const ymd = (String(date).includes("T") ? String(date).split("T")[0] : String(date)).slice(0, 10);
      return ymd === dayYMD;
    });
  }, [allData, currentDay]);

  // ---------- fetch on view/day changes ----------
  useEffect(() => {
    const dayParam = toDDMMYYYYParam(currentDay);
    if (calendarView === "timeGridWeek") {
      loadWeek(dayParam);
    } else {
      loadDay(dayParam);
    }
  }, [calendarView, currentDay, loadWeek, loadDay]);

  // ---------- submitDelay (optimistic + refresh) ----------
  const submitDelay = async (values: DelayValues) => {
    if (!activeTask) return;
    if (!values.date || !values.time) {
      alert("من فضلك اختر التاريخ والوقت.");
      return;
    }

    const payload = {
      date: values.date,                    // YYYY-MM-DD
      start_time: toHm(values.time.trim()), // HH:mm
      ...(values.link?.trim() ? { session_link: values.link.trim() } : {}),
    };

    try {
      const res = await postpone(activeTask.id, payload);
      const { postponed_session, alternate_session } = res.data;

      const postponedTask = mapApiToUITask(postponed_session);
      const altTask = alternate_session ? mapApiToUITask(alternate_session) : undefined;

      // Optimistic update by **id**
      setAllData((prev) => {
        let next = prev.filter(
          (t) => t.id !== String(postponedTask.id) && (!altTask || t.id !== String(altTask.id))
        );
        next.push(postponedTask);
        if (altTask) next.push(altTask);

        // sort: by group, then date, then time
        next.sort((a, b) => {
          const g = (a.group || "").localeCompare(b.group || "");
          if (g) return g;
          const d = (a.date || "").localeCompare(b.date || "");
          if (d) return d;
          return (a.time || "").localeCompare(b.time || "");
        });
        return next;
      });

      // Pin overrides by **id**
      setOverridesById((prev) => {
        const o: Record<string, UITask> = { ...prev, [postponedTask.id]: postponedTask };
        if (altTask) o[altTask.id] = altTask;
        return o;
      });

      // Refresh the active view
      const dayParam = toDDMMYYYYParam(currentDay);
      if (calendarView === "timeGridWeek") {
        await loadWeek(dayParam);
      } else {
        await loadDay(dayParam);
      }

      closeDelay();
    } catch (e: any) {
      console.error("postpone failed:", e?.response || e);
      alert(
        e?.response?.data?.message ||
          (e?.response?.data?.errors && JSON.stringify(e.response.data.errors)) ||
          e?.message ||
          "فشل تأجيل الحصة"
      );
    }
  };

  // ---------- calendar handlers ----------
  const handleDateSelect = (selectInfo: any) => {
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();
    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  };

  const renderEventContent = (eventInfo: any) => (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );

  const handleEventClick = (clickInfo: any) => {
    if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  };

  const handleEvents = () => {};

  // ---------- Expand alt + postponed and apply overrides ----------
  useEffect(() => {
    if (!Array.isArray(apiItems)) return;

    // Expand: if a row is canceled/postpand/postponed AND has parent_session.status === "alternate",
    // push TWO rows: (1) original, (2) synthetic alternate from its parent_session
    const expanded: any[] = [];
    for (const s of apiItems as any[]) {
      const ps = s.parent_session;
      const st = String(s.status || "").toLowerCase();

      const hasAltParent =
        ps && (st === "canceled" || st === "postpand" || st === "postponed") && String(ps.status).toLowerCase() === "alternate";

      if (hasAltParent) {
        // original row (tag with source info)
        expanded.push({ ...s, _sourceId: String(s.id), _isAlternate: false });

        // synthetic alternate row from parent_session, but preserve subject/group/class_names
        expanded.push({
          ...s,
          id: String(ps.id ?? `${s.id}-alt`), // ensure unique id
          date: ps.date ?? s.date,
          start_time: ps.start_time ?? s.start_time,
          session_link: ps.session_link ?? s.session_link,
          status: "alternate",
          has_alternative_session: true,
          alternate_session: null,
          _sourceId: String(s.id),
          _isAlternate: true,
        });
      } else {
        expanded.push({ ...s, _sourceId: String(s.id), _isAlternate: false });
      }
    }

    // Map to UI tasks
    let next = expanded.map(mapApiToUITask);

    // Apply overrides **by id**
    next = next.map((row) => {
      const ov = overridesById[row.id];
      if (!ov) return row;
      const sameTime = (ov.time || "") === (row.time || "");
      const sameLink = (ov.sessionUrl || "") === (row.sessionUrl || "");
      const sameDate = (ov.date || "") === (row.date || "");
      if (sameTime && sameLink && sameDate && (ov.status || row.status) === row.status) return row;
      return {
        ...row,
        ...ov,
        classNames: row.classNames?.length ? row.classNames : ov.classNames,
        status: ov.status || row.status,
      };
    });

    // Sort: group, date, time (keeps alternate & postponed next to each other naturally)
    next.sort((a, b) => {
      const g = (a.group || "").localeCompare(b.group || "");
      if (g) return g;
      const d = (a.date || "").localeCompare(b.date || "");
      if (d) return d;
      return (a.time || "").localeCompare(b.time || "");
    });

    // Commit if changed
    setAllData((prev) => {
      if (prev.length === next.length) {
        let equal = true;
        for (let i = 0; i < prev.length; i++) {
          if (
            prev[i].id !== next[i].id ||
            prev[i].time !== next[i].time ||
            prev[i].date !== next[i].date ||
            prev[i].sessionUrl !== next[i].sessionUrl ||
            prev[i].status !== next[i].status ||
            prev[i].lesson !== next[i].lesson ||
            prev[i].title !== next[i].title
          ) {
            equal = false;
            break;
          }
        }
        if (equal) return prev;
      }
      return next;
    });
  }, [apiItems, overridesById]);

  return (
    <Fragment>
      <Seo title="Tasks-List View" />

      <Card.Body>
        <div id="fc-root" className={`${calendarView === "timeGridWeek" ? "fc-hide-content" : ""}`}>
          <FullCalendar
            ref={calendarRef as any}
            locales={[arLocale]}
            locale="ar"
            direction="rtl"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            headerToolbar={{
              left: calendarView === "listDay" ? "prev,next today" : "prev,next",
              center: "title",
              right: "timeGridWeek,listDay",
            }}
            buttonText={{ today: "اليوم" }}
            views={{ timeGridWeek: { buttonText: "أسبوعي" }, listDay: { buttonText: "يومي" } }}
            initialView="timeGridWeek"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            initialEvents={INITIAL_EVENTS}
            select={handleDateSelect}
            eventContent={renderEventContent}
            eventClick={handleEventClick}
            eventsSet={handleEvents}
            height="100%"
            expandRows={true}
            contentHeight="auto"
            datesSet={(arg) => {
              const type = arg.view.type as "timeGridWeek" | "listDay";
              if (type !== calendarView) setCalendarView(type);
              const viewStart: Date = arg.view.currentStart;
              if (currentDay.toDateString() !== viewStart.toDateString()) {
                setCurrentDay(viewStart);
              }
            }}
          />
        </div>
      </Card.Body>

      {(loading || error) && (
        <Col xxl={12} xl={12}>
          <Card className="custom-card">
            <Card.Body className="py-3">
              {loading && <div className="text-muted">جارِ التحميل…</div>}
              {error && <div className="text-danger">{error}</div>}
            </Card.Body>
          </Card>
        </Col>
      )}

      {/* Day view -> Cards */}
      {calendarView === "listDay" && (
        <Col xxl={12} xl={12}>
          <Card className="custom-card">
            <Card.Body className="pt-3">
              {cardsForDay.length === 0 ? (
                <div className="p-4 text-center text-muted">لا توجد حصص في هذا اليوم.</div>
              ) : (
                <div className="row g-3">
                  {cardsForDay.map((task) => {
                    const subject = (task as any).subject ?? task.title ?? "—";
                    const lesson = task.lesson ?? task.title ?? "—";
                    const group = task.group ?? task.groupName ?? "—";
                    const time = task.time ?? task.startTime ?? (task as any).slot ?? "—";
                    const sessionUrl = task.sessionUrl ?? "#!";

                    const statusNow = effectiveStatus(task);
                    const isCanceled =
                      statusNow === "canceled" || statusNow === "cancelled";
                    const finished = statusNow === "finished";

                    return (
                      <div className="col-12 col-md-6 col-xl-3" key={task.id}>
                        <Card className="daily-card">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div className="fs-5 fw-bold">
                                <Subject /> {subject}
                              </div>
                            </div>

                            <div className="small text-muted mb-3">
                              <div className="fs-6 fw-semibold mb-2">
                                <Lesson /> {lesson}
                              </div>

                              <div className="fs-6 d-inline-flex gap-1 fw-semibold mb-2">
                                <Class />{" "}
                                {Array.isArray(task.classNames) && task.classNames.length ? (
                                  <span className="d-inline-flex flex-wrap gap-1 align-items-center">
                                    {task.classNames.map((n, i) => (
                                      <span key={i} className="badge bg-light text-dark border">
                                        {n}
                                      </span>
                                    ))}
                                  </span>
                                ) : (
                                  <span>
                                    {(task as any).class ?? (task as any).className ?? (task as any).code ?? "—"}
                                  </span>
                                )}
                              </div>

                              <div className="d-flex justify-content-between align-items-center">
                                <div className="fs-6 fw-semibold me-4">
                                  <Group /> {group}
                                </div>
                                <div className="fs-6 fw-semibold">
                                  <Time /> {time}
                                </div>
                              </div>
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                              <div className="small">
                                الحالة: <StatusChip status={statusNow} />
                              </div>

                              {finished ? (
                                <div className="d-flex gap-1">
                                  <SpkButton Buttonvariant="" Customclass="btn btn-outline-primary btn-sm">
                                    عرض المحتوى
                                  </SpkButton>
                                  <SpkButton Buttonvariant="" Customclass="btn btn-primary btn-sm">
                                    إضافة محتوى
                                  </SpkButton>
                                </div>
                              ) : isCanceled ? (
                                <span className="text-muted small">لا يوجد رابط للحصة</span>
                              ) : (
                                <Link to={sessionUrl} className="btn btn-sm btn-primary">
                                  الدخول للحصة
                                </Link>
                              )}
                            </div>
                          </Card.Body>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      )}

      {/* Week view -> Table */}
      {calendarView === "timeGridWeek" && (
        <Col xxl={12} xl={12}>
          <Card className="custom-card">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <SpkTables
                  tableClass="text-nowrap"
                  headerClass="table-light"
                  checked={selectedTasks.every((selected) => selected)}
                  onChange={handleSelectAll}
                  showCheckbox={false}
                  header={[
                    { title: "المجموعة" },
                    { title: "الصف" },
                    { title: "التاريخ" },
                    { title: "الوقت" },
                    { title: "الدرس" },
                    { title: "الحالة" },  // status column
                    { title: "المحتوي" },
                    { title: "الدخول للحصة" },
                    { title: "الإجراءات" },
                  ]}
                >
                  {allData.map((task) => {
                    const group = task.group ?? task.groupName ?? "المجموعة الأولي";
                    const date = task.date ?? task.startDate ?? "-";
                    const time = task.time ?? task.startTime ?? (task as any).slot ?? "09:00";
                    const lesson = task.lesson ?? task.title ?? "-";
                    const sessionUrl = task.sessionUrl ?? "#!";

                    const statusNow = effectiveStatus(task);
                    const isCanceled =
                      statusNow === "canceled" || statusNow === "cancelled";
                    const finished = statusNow === "finished";
                    const canDelay = statusNow === "active"; // delay only when active

                    return (
                      <tr className="task-list" key={task.id}>
                        <td>{group}</td>

                        <td>
                          {Array.isArray(task.classNames) && task.classNames.length ? (
                            <div className="d-flex flex-wrap gap-1">
                              {task.classNames.map((n, i) => (
                                <span key={i} className="badge bg-light text-dark border">
                                  {n}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="fw-medium">
                              {(task as any).class ?? (task as any).className ?? (task as any).code ?? "—"}
                            </span>
                          )}
                        </td>

                        <td>{date}</td>
                        <td>{time}</td>
                        <td>{lesson}</td>

                        <td><StatusChip status={statusNow} /></td>

                        <td>
                          {finished ? (
                            <div className="d-flex gap-1">
                              <SpkButton
                                Buttonvariant=""
                                Customclass="btn btn-outline-primary btn-sm"
                                onClickfunc={() => console.log("Show content for", task.id)}
                              >
                                عرض المحتوى
                              </SpkButton>
                              <SpkButton
                                Buttonvariant=""
                                Customclass="btn btn-primary btn-sm"
                                onClickfunc={() => console.log("Add content for", task.id)}
                              >
                                إضافة محتوى
                              </SpkButton>
                            </div>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>

                        <td>
                          {isCanceled ? (
                            <span className="text-muted">—</span>
                          ) : (
                            <Link to={sessionUrl} className="btn-sm enter-session-btn">
                              الدخول للحصة
                            </Link>
                          )}
                        </td>

                        <td>
                          {isCanceled ? (
                            <span className="text-muted">—</span>
                          ) : (
                            <>
                              <SpkTooltips placement="top" title="تعديل">
                                <SpkButton
                                  Buttonvariant=""
                                  Customclass="btn btn-primary-light btn-icon"
                                  onClickfunc={() => openUpdate(task)}
                                >
                                  <i className="ri-edit-line"></i>
                                </SpkButton>
                              </SpkTooltips>

                              <SpkTooltips placement="top" title="إلغاء">
                                <SpkButton
                                  Buttonvariant=""
                                  onClickfunc={() => openCancel(task)}
                                  Customclass="btn btn-danger-light btn-icon ms-1 task-delete-btn"
                                >
                                  <i className="ri-close-line"></i>
                                </SpkButton>
                              </SpkTooltips>

                              {canDelay && (
                                <SpkTooltips placement="top" title="تأجيل">
                                  <SpkButton
                                    Buttonvariant=""
                                    Customclass="btn btn-info-light btn-icon ms-1 delay"
                                    Style={{ color: "#1B648E" }}
                                    onClickfunc={() => openDelay(task)}
                                  >
                                    <i className="ri-refresh-line"></i>
                                  </SpkButton>
                                </SpkTooltips>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  <DelayModal
                    show={showDelayModal}
                    onClose={closeDelay}
                    onSubmit={submitDelay}
                    initial={{
                      date: (activeTask?.date ?? activeTask?.startDate ?? "").slice(0, 10),
                      time: activeTask?.time ?? activeTask?.startTime ?? "",
                      link: activeTask?.sessionUrl ?? "",
                    }}
                    title="تأجيل الجلسة"
                  />
                  <CancelModal
                    show={showCancelModal}
                    onClose={closeCancel}
                    onConfirm={submitCancel}
                    summary={
                      cancelTask
                        ? {
                            subject: cancelTask.title,
                            lesson: cancelTask.lesson,
                            classes: cancelTask.classNames,
                            time: cancelTask.time,
                            group: cancelTask.group,
                          }
                        : undefined
                    }
                  />
                  <UpdateModal
                    show={showUpdateModal}
                    onClose={closeUpdate}
                    onSubmit={submitUpdate}
                    initial={{
                      name: updateTask?.lesson || updateTask?.title || "",
                      link: updateTask?.sessionUrl || "",
                    }}
                    title="تحديث الجلسة"
                  />
                </SpkTables>
              </div>
            </Card.Body>

            <Card.Footer>
              <div className="d-flex align-items-center">
                <div>
                  Showing 10 Entries <i className="bi bi-arrow-right ms-2 fw-semibold"></i>
                </div>
                <div className="ms-auto">
                  <nav aria-label="Page navigation" className="pagination-style-2">
                    <Pagination className="mb-0 flex-wrap">
                      <Pagination.Prev disabled>Prev</Pagination.Prev>
                      <Pagination.Item>1</Pagination.Item>
                      <Pagination.Item active>2</Pagination.Item>
                      <Pagination.Item>
                        <i className="bi bi-three-dots"></i>
                      </Pagination.Item>
                      <Pagination.Item>17</Pagination.Item>
                      <Pagination.Next className="text-primary">Next</Pagination.Next>
                    </Pagination>
                  </nav>
                </div>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      )}
    </Fragment>
  );
};

export default TaskListView;

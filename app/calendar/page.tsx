"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Clock,
  X,
  CalendarDays,
  Tag,
} from "lucide-react";

/* ─── types ─────────────────────────────────────────────────────── */

interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  time: string; // HH:MM
  description: string;
  category: "Study" | "Meeting" | "Deadline" | "Other";
}

const STORAGE_KEY = "intellex_calendar_events";

const CATEGORY_COLORS: Record<CalendarEvent["category"], { bg: string; text: string; dot: string }> = {
  Study:    { bg: "bg-blue-500/15 dark:bg-blue-400/20",   text: "text-blue-700 dark:text-blue-300",   dot: "bg-blue-500" },
  Meeting:  { bg: "bg-violet-500/15 dark:bg-violet-400/20", text: "text-violet-700 dark:text-violet-300", dot: "bg-violet-500" },
  Deadline: { bg: "bg-red-500/15 dark:bg-red-400/20",     text: "text-red-700 dark:text-red-300",     dot: "bg-red-500" },
  Other:    { bg: "bg-amber-500/15 dark:bg-amber-400/20",  text: "text-amber-700 dark:text-amber-300", dot: "bg-amber-500" },
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CATEGORIES: CalendarEvent["category"][] = ["Study", "Meeting", "Deadline", "Other"];

/* ─── helpers ───────────────────────────────────────────────────── */

function pad(n: number) { return n.toString().padStart(2, "0"); }

function fmtDate(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

function getMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();

  const cells: { day: number; month: number; year: number; current: boolean }[] = [];

  // previous month tail
  for (let i = startDay - 1; i >= 0; i--) {
    const pm = month === 0 ? 11 : month - 1;
    const py = month === 0 ? year - 1 : year;
    cells.push({ day: prevDays - i, month: pm, year: py, current: false });
  }
  // current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month, year, current: true });
  }
  // next month head
  const rem = 42 - cells.length;
  for (let d = 1; d <= rem; d++) {
    const nm = month === 11 ? 0 : month + 1;
    const ny = month === 11 ? year + 1 : year;
    cells.push({ day: d, month: nm, year: ny, current: false });
  }
  return cells;
}

function todayStr() {
  const d = new Date();
  return fmtDate(d.getFullYear(), d.getMonth(), d.getDate());
}

/* ─── component ─────────────────────────────────────────────────── */

export default function CalendarPage() {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewEvent, setViewEvent] = useState<CalendarEvent | null>(null);

  // form state
  const [formTitle, setFormTitle] = useState("");
  const [formTime, setFormTime] = useState("09:00");
  const [formDesc, setFormDesc] = useState("");
  const [formCategory, setFormCategory] = useState<CalendarEvent["category"]>("Study");

  // Load events
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEvents(JSON.parse(raw));
    } catch { /* empty */ }
  }, []);

  // Save events
  const persist = useCallback((evts: CalendarEvent[]) => {
    setEvents(evts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(evts));
  }, []);

  const goToday = () => { setViewYear(now.getFullYear()); setViewMonth(now.getMonth()); };
  const prev = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); } else setViewMonth(viewMonth - 1); };
  const next = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); } else setViewMonth(viewMonth + 1); };

  const monthLabel = new Date(viewYear, viewMonth).toLocaleString("default", { month: "long", year: "numeric" });
  const cells = getMonthGrid(viewYear, viewMonth);
  const today = todayStr();

  const eventsForDate = (d: string) => events.filter((e) => e.date === d);

  // upcoming 7 days
  const upcoming = (() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    const end = new Date(t);
    end.setDate(end.getDate() + 7);
    return events
      .filter((e) => { const ed = new Date(e.date + "T00:00:00"); return ed >= t && ed <= end; })
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  })();

  const handleAdd = () => {
    if (!formTitle.trim() || !selectedDate) return;
    const newEvt: CalendarEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      date: selectedDate,
      title: formTitle.trim(),
      time: formTime,
      description: formDesc.trim(),
      category: formCategory,
    };
    persist([...events, newEvt]);
    setFormTitle(""); setFormDesc(""); setFormTime("09:00"); setFormCategory("Study");
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    persist(events.filter((e) => e.id !== id));
    setViewEvent(null);
  };

  const openAdd = (date: string) => {
    setSelectedDate(date);
    setShowAddModal(true);
  };

  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
            <CalendarDays className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Calendar</h1>
            <p className="text-sm text-muted-foreground">Schedule study sessions, deadlines & meetings</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Calendar Grid ─────────────────────────────────── */}
          <Card className="flex-1 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={prev}><ChevronLeft className="w-5 h-5" /></Button>
                <h2 className="text-lg font-bold min-w-[180px] text-center">{monthLabel}</h2>
                <Button variant="ghost" size="icon" onClick={next}><ChevronRight className="w-5 h-5" /></Button>
              </div>
              <Button variant="outline" size="sm" onClick={goToday} className="text-xs font-semibold">
                <Calendar className="w-3.5 h-3.5 mr-1.5" /> Today
              </Button>
            </CardHeader>

            <CardContent className="p-3 sm:p-4">
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">{d}</div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-px bg-border/50 rounded-lg overflow-hidden">
                {cells.map((cell, i) => {
                  const dateStr = fmtDate(cell.year, cell.month, cell.day);
                  const isToday = dateStr === today;
                  const dayEvents = eventsForDate(dateStr);
                  const show = dayEvents.slice(0, 2);
                  const overflow = dayEvents.length - 2;

                  return (
                    <button
                      key={i}
                      onClick={() => openAdd(dateStr)}
                      className={`relative min-h-[70px] sm:min-h-[90px] p-1.5 text-left transition-colors bg-card hover:bg-muted/60 focus:outline-none focus:ring-1 focus:ring-primary/40 ${
                        !cell.current ? "opacity-40" : ""
                      }`}
                    >
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                          isToday
                            ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                            : "text-foreground"
                        }`}
                      >
                        {cell.day}
                      </span>

                      <div className="mt-0.5 space-y-0.5">
                        {show.map((evt) => (
                          <div
                            key={evt.id}
                            onClick={(e) => { e.stopPropagation(); setViewEvent(evt); }}
                            className={`truncate text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md font-medium cursor-pointer ${CATEGORY_COLORS[evt.category].bg} ${CATEGORY_COLORS[evt.category].text}`}
                          >
                            {evt.title}
                          </div>
                        ))}
                        {overflow > 0 && (
                          <span className="text-[10px] text-muted-foreground pl-1">+{overflow} more</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* ── Sidebar — Upcoming Events ─────────────────────── */}
          <div className="lg:w-80 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> Upcoming (7 days)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[420px] overflow-y-auto">
                {upcoming.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No upcoming events</p>
                ) : (
                  upcoming.map((evt) => (
                    <button
                      key={evt.id}
                      onClick={() => setViewEvent(evt)}
                      className="w-full text-left flex items-start gap-3 p-3 rounded-lg hover:bg-muted/60 transition-colors"
                    >
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${CATEGORY_COLORS[evt.category].dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{evt.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(evt.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {evt.time}
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[evt.category].bg} ${CATEGORY_COLORS[evt.category].text}`}>
                        {evt.category}
                      </span>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => {
                const count = events.filter((e) => e.category === cat).length;
                return (
                  <div key={cat} className={`rounded-xl p-3 ${CATEGORY_COLORS[cat].bg}`}>
                    <p className={`text-lg font-extrabold ${CATEGORY_COLORS[cat].text}`}>{count}</p>
                    <p className="text-xs text-muted-foreground font-medium">{cat}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Add Event Modal ────────────────────────────────── */}
        <AnimatePresence>
          {showAddModal && selectedDate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md"
              >
                <Card className="shadow-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Plus className="w-5 h-5 text-primary" /> Add Event
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground font-medium">
                      📅 {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    </p>

                    <div className="space-y-2">
                      <Label htmlFor="evt-title">Title</Label>
                      <Input id="evt-title" placeholder="e.g. React study session" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="evt-time">Time</Label>
                        <Input id="evt-time" type="time" value={formTime} onChange={(e) => setFormTime(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {CATEGORIES.map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setFormCategory(cat)}
                              className={`text-xs font-semibold px-2 py-1.5 rounded-lg border transition-all ${
                                formCategory === cat
                                  ? `${CATEGORY_COLORS[cat].bg} ${CATEGORY_COLORS[cat].text} border-current`
                                  : "border-border text-muted-foreground hover:border-foreground/30"
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="evt-desc">Description (optional)</Label>
                      <textarea
                        id="evt-desc"
                        rows={2}
                        placeholder="Notes about this event..."
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                    </div>

                    <Button className="w-full font-bold" onClick={handleAdd} disabled={!formTitle.trim()}>
                      <Plus className="w-4 h-4 mr-2" /> Add Event
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── View Event Modal ────────────────────────────────── */}
        <AnimatePresence>
          {viewEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={() => setViewEvent(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm"
              >
                <Card className="shadow-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-lg truncate pr-2">{viewEvent.title}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setViewEvent(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[viewEvent.category].bg} ${CATEGORY_COLORS[viewEvent.category].text}`}>
                        <Tag className="w-3 h-3 inline mr-1" />{viewEvent.category}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {viewEvent.time}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(viewEvent.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    {viewEvent.description && (
                      <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">{viewEvent.description}</p>
                    )}
                    <Button variant="destructive" size="sm" className="w-full font-semibold" onClick={() => handleDelete(viewEvent.id)}>
                      <Trash2 className="w-4 h-4 mr-2" /> Delete Event
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthGuard>
  );
}

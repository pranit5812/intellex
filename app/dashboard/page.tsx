"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Summary, { Meeting } from "@/components/component/summary/summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthGuard } from "@/components/auth-guard";
import { CreateMeetingModal } from "@/components/component/create-meeting-modal";
import { getStoredMeetings, saveMeeting, removeMeeting } from "@/lib/meetings";
import {
  Plus,
  Users,
  Search,
  Video,
  Trophy,
  BookOpen,
  Sparkles,
  TrendingUp,
  Clock,
  Award,
} from "lucide-react";

export default function Dashboard() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getStoredMeetings();
      setMeetings(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleAddMeeting = async (newMeetingData: Omit<Meeting, "id">) => {
    const saved = await saveMeeting(newMeetingData);
    setMeetings((prev) => [saved, ...prev]);
  };

  const handleDeleteMeeting = async (meeting: Meeting, index: number) => {
    await removeMeeting(meeting.id, index);
    setMeetings((prev) => prev.filter((_, i) => i !== index));
  };

  const filteredMeetings = meetings.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.user1.name.toLowerCase().includes(q) ||
      m.user1.description.toLowerCase().includes(q) ||
      m.user2.name.toLowerCase().includes(q) ||
      m.user2.description.toLowerCase().includes(q) ||
      m.summary.toLowerCase().includes(q)
    );
  });

  // Calculate dynamic stats
  const totalSessions = meetings.length;
  const uniqueParticipants = new Set([
    ...meetings.map((m) => m.user1.name),
    ...meetings.map((m) => m.user2.name),
  ]).size;
  const totalHours = (totalSessions * 1.2).toFixed(1);

  return (
    <AuthGuard>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            Collaboration Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-xl">
            Track, review, and initiate 1-on-1 skill exchanges between mentors and learners.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 shadow-sm font-semibold text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4" /> Add Meeting / Users
          </Button>

          <Link href="/match">
            <Button variant="outline" className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <Users className="w-4 h-4" /> Find Peers
            </Button>
          </Link>

          <Link href="/session">
            <Button variant="secondary" className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <Video className="w-4 h-4" /> Live Room
            </Button>
          </Link>

          <Link href="/leaderboard">
            <Button variant="ghost" className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <Trophy className="w-4 h-4 text-amber-500" /> Leaderboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border bg-card/60 backdrop-blur-sm shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold">{totalSessions}</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Total Sessions
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border bg-card/60 backdrop-blur-sm shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold">{uniqueParticipants}</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Active Peers
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border bg-card/60 backdrop-blur-sm shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold">{totalHours}h</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Hours Exchanged
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border bg-card/60 backdrop-blur-sm shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold">Top 5%</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Reward Tier
            </div>
          </div>
        </div>
      </div>

      {/* Search & Actions Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search sessions by participant or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground w-full sm:w-auto justify-end">
          <span>Showing {filteredMeetings.length} of {meetings.length} sessions</span>
        </div>
      </div>

      {/* Meetings Feed */}
      <div className="w-full flex flex-col items-center">
        {loading ? (
          <div className="py-20 text-muted-foreground animate-pulse text-sm">
            Loading collaboration sessions...
          </div>
        ) : filteredMeetings.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 my-6 border-2 border-dashed rounded-3xl w-full max-w-xl text-center bg-card/40 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Users className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold mb-2">No matching sessions found</h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm">
              {meetings.length === 0
                ? "Start exchanging knowledge by creating your first custom peer session!"
                : "No meetings matched your search criteria."}
            </p>
            <div className="flex items-center gap-3">
              <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create New Meeting
              </Button>
              <Link href="/match">
                <Button variant="outline">
                  Browse Matching Peers
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <Summary meetings={filteredMeetings} onDelete={handleDeleteMeeting} />
        )}
      </div>

      <CreateMeetingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddMeeting}
      />
    </div>
    </AuthGuard>
  );
}

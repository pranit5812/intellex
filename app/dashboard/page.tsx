"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Summary, { Meeting } from "@/components/component/summary/summary";
import { Button } from "@/components/ui/button";
import { CreateMeetingModal } from "@/components/component/create-meeting-modal";
import { getStoredMeetings, saveMeeting, removeMeeting } from "@/lib/meetings";
import { Plus, Users } from "lucide-react";

const Dashboard = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
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

  return (
    <div className="flex flex-col items-center justify-between min-h-screen py-10 px-4">
      <div className="w-full max-w-4xl flex flex-col items-center">
        <h1 className="text-center text-4xl font-extrabold tracking-tight mb-4">
          Collaboration Dashboard
        </h1>
        <p className="text-muted-foreground text-center mb-8 max-w-lg">
          Track and review skill-sharing sessions between peer learners and mentors.
        </p>

        {loading ? (
          <div className="py-20 text-muted-foreground animate-pulse">
            Loading sessions...
          </div>
        ) : meetings.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 my-8 border-2 border-dashed rounded-2xl w-full max-w-xl text-center bg-card/40">
            <Users className="w-12 h-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold mb-2">No meetings created yet</h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm">
              Create your own users and collaborate on topics by adding your first session.
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create Your First Meeting
            </Button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            <Summary meetings={meetings} onDelete={handleDeleteMeeting} />
          </div>
        )}
      </div>

      <div className="mt-12 mb-6 flex flex-wrap gap-4 justify-center">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="font-bold py-2 px-6 rounded-lg flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4" /> Add Meeting / Users
        </Button>

        <Link href="/dashboard/create">
          <Button variant="outline" className="font-bold py-2 px-6 rounded-lg">
            Full Create Page
          </Button>
        </Link>

        <Link href="/leaderboard">
          <Button variant="secondary" className="font-bold py-2 px-6 rounded-lg">
            View Leaderboard
          </Button>
        </Link>
      </div>

      <CreateMeetingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddMeeting}
      />
    </div>
  );
};

export default Dashboard;

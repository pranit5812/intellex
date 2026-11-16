"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2, Video, Copy, Check, ArrowRight, Link2, Share2 } from "lucide-react";

export interface User {
  name: string;
  photoURL?: string;
  description: string;
}

export interface Meeting {
  id?: string;
  roomCode?: string;
  user1: User;
  user2: User;
  summary: string;
}

interface SummaryProps {
  meetings: Meeting[];
  onDelete?: (meeting: Meeting, index: number) => void;
}

const Summary: React.FC<SummaryProps> = ({ meetings, onDelete }) => {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedLinkRoom, setCopiedLinkRoom] = useState<string | null>(null);

  if (!meetings || meetings.length === 0) {
    return null;
  }

  const getInitials = (name: string) => {
    if (!name) return "//";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleCopySummary = (meeting: Meeting, id: string) => {
    const text = `Session: ${meeting.user1.name} & ${meeting.user2.name}\nRoom: ${meeting.roomCode || "N/A"}\n\nTakeaways:\n` +
      meeting.summary
        .split(";")
        .map((p) => `• ${p.trim()}`)
        .join("\n");
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyInviteLink = (roomCode?: string) => {
    if (!roomCode) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const inviteUrl = `${origin}/session?room=${encodeURIComponent(roomCode)}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLinkRoom(roomCode);
    setTimeout(() => setCopiedLinkRoom(null), 2500);
  };

  return (
    <div className="flex flex-col items-center w-full space-y-4">
      {meetings.map((meeting, index) => {
        const meetingKey = meeting.id || `meeting-${index}`;
        const activeRoom = meeting.roomCode || `INTX-${meetingKey.slice(-4).toUpperCase()}`;

        return (
          <Card
            key={meetingKey}
            className="relative w-full max-w-3xl flex flex-col p-6 border bg-card/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all hover:border-primary/30"
          >
            {/* Top Right Actions */}
            <div className="absolute top-4 right-4 flex items-center space-x-1">
              <button
                type="button"
                onClick={() => handleCopySummary(meeting, meetingKey)}
                className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-muted transition-colors"
                title="Copy meeting summary"
              >
                {copiedId === meetingKey ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(meeting, index)}
                  className="text-muted-foreground hover:text-red-500 p-1.5 rounded-md hover:bg-red-500/10 transition-colors"
                  title="Delete this meeting"
                  aria-label="Delete meeting"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Room Code & Share Banner */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 pr-12">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-muted border font-bold flex items-center gap-1.5 text-foreground">
                  <Link2 className="w-3.5 h-3.5 text-primary" />
                  Room: {activeRoom}
                </span>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopyInviteLink(activeRoom)}
                  className="h-7 px-2 text-xs text-primary hover:text-primary hover:bg-primary/10 flex items-center gap-1"
                >
                  {copiedLinkRoom === activeRoom ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500 font-semibold">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Copy Invite Link</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Participants Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full pr-6 gap-4">
              {/* User 1 */}
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12 border-2 border-primary/20 shrink-0">
                  <AvatarImage src={meeting.user1.photoURL} alt={meeting.user1.name} />
                  <AvatarFallback className="font-bold text-xs bg-primary/10 text-primary">
                    {getInitials(meeting.user1.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base font-bold">{meeting.user1.name || "User 1"}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    {meeting.user1.description || "Participant"}
                  </CardDescription>
                </div>
              </div>

              <div className="hidden sm:block text-xs uppercase font-extrabold tracking-widest text-muted-foreground/60 px-2">
                ⇄
              </div>

              {/* User 2 */}
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12 border-2 border-primary/20 shrink-0">
                  <AvatarImage src={meeting.user2.photoURL} alt={meeting.user2.name} />
                  <AvatarFallback className="font-bold text-xs bg-primary/10 text-primary">
                    {getInitials(meeting.user2.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base font-bold">{meeting.user2.name || "User 2"}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    {meeting.user2.description || "Participant"}
                  </CardDescription>
                </div>
              </div>
            </div>

            {/* Discussion Points */}
            <div className="w-full mt-5 pt-4 border-t border-border/50">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                Session Takeaways
              </span>
              <ul className="list-disc list-inside space-y-1.5 pl-1">
                {meeting.summary
                  .split(";")
                  .map((point) => point.trim())
                  .filter(Boolean)
                  .map((point, ptIndex) => (
                    <li key={ptIndex} className="text-sm text-foreground/90 leading-relaxed">
                      {point}
                    </li>
                  ))}
              </ul>
            </div>

            {/* Quick Action Footer */}
            <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Collaborative peer session
              </span>

              <Button
                size="sm"
                variant="ghost"
                className="text-xs flex items-center gap-1.5 text-primary hover:text-primary hover:bg-primary/10 font-semibold"
                onClick={() => router.push(`/session?room=${encodeURIComponent(activeRoom)}`)}
              >
                <Video className="w-3.5 h-3.5" />
                Join Room ({activeRoom}) <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default Summary;

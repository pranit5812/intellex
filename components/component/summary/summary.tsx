"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";

export interface User {
  name: string;
  photoURL?: string;
  description: string;
}

export interface Meeting {
  id?: string;
  user1: User;
  user2: User;
  summary: string;
}

interface SummaryProps {
  meetings: Meeting[];
  onDelete?: (meeting: Meeting, index: number) => void;
}

const Summary: React.FC<SummaryProps> = ({ meetings, onDelete }) => {
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

  return (
    <div className="flex flex-col items-center w-full">
      {meetings.map((meeting, index) => (
        <Card
          key={meeting.id || index}
          className="relative m-4 w-[38rem] max-w-[95vw] flex flex-col p-6 shadow-md transition-all hover:shadow-lg"
        >
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(meeting, index)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 p-1.5 rounded-md hover:bg-red-500/10 transition-colors"
              title="Delete this meeting"
              aria-label="Delete meeting"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <div className="flex flex-row justify-between w-full pr-8">
            {/* User 1 */}
            <div className="flex flex-row items-center mr-4">
              <Avatar className="m-2 mr-3 h-12 w-12 border">
                <AvatarImage src={meeting.user1.photoURL} alt={meeting.user1.name} />
                <AvatarFallback className="font-semibold text-xs">
                  {getInitials(meeting.user1.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{meeting.user1.name || "User 1"}</CardTitle>
                <CardDescription className="text-xs">
                  {meeting.user1.description || "No description"}
                </CardDescription>
              </div>
            </div>

            {/* User 2 */}
            <div className="flex flex-row items-center">
              <Avatar className="m-2 mr-3 h-12 w-12 border">
                <AvatarImage src={meeting.user2.photoURL} alt={meeting.user2.name} />
                <AvatarFallback className="font-semibold text-xs">
                  {getInitials(meeting.user2.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{meeting.user2.name || "User 2"}</CardTitle>
                <CardDescription className="text-xs">
                  {meeting.user2.description || "No description"}
                </CardDescription>
              </div>
            </div>
          </div>

          {/* Meeting Points */}
          <div className="w-full mt-6 pt-4 border-t border-border/50">
            <ul className="list-disc list-inside pl-2 text-left space-y-2">
              {meeting.summary
                .split(";")
                .map((point) => point.trim())
                .filter(Boolean)
                .map((point, ptIndex) => (
                  <li key={ptIndex} className="text-sm text-foreground/90 pl-1 leading-relaxed">
                    {point}
                  </li>
                ))}
            </ul>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Summary;

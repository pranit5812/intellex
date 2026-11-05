"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { Meeting } from "./summary/summary";

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meeting: Omit<Meeting, "id">) => void;
}

export const CreateMeetingModal: React.FC<CreateMeetingModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [user1Name, setUser1Name] = useState("");
  const [user1Desc, setUser1Desc] = useState("");
  const [user1Photo, setUser1Photo] = useState("");

  const [user2Name, setUser2Name] = useState("");
  const [user2Desc, setUser2Desc] = useState("");
  const [user2Photo, setUser2Photo] = useState("");

  const [points, setPoints] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user1Name.trim() || !user2Name.trim()) {
      setError("Please provide names for both users.");
      return;
    }

    if (!points.trim()) {
      setError("Please add at least one discussion point / summary item.");
      return;
    }

    // Convert newline-separated or semicolon-separated points to semicolon-delimited string
    const formattedSummary = points
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean)
      .join("; ");

    onSave({
      user1: {
        name: user1Name.trim(),
        description: user1Desc.trim() || "Member",
        photoURL: user1Photo.trim(),
      },
      user2: {
        name: user2Name.trim(),
        description: user2Desc.trim() || "Member",
        photoURL: user2Photo.trim(),
      },
      summary: formattedSummary,
    });

    // Reset fields
    setUser1Name("");
    setUser1Desc("");
    setUser1Photo("");
    setUser2Name("");
    setUser2Desc("");
    setUser2Photo("");
    setPoints("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <Card className="relative w-full max-w-2xl bg-background border shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
          type="button"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold">Create Meeting / User Pair</CardTitle>
          <CardDescription>
            Enter the details for both users and the summary of their collaboration.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User 1 */}
              <div className="space-y-3 p-4 rounded-xl border bg-muted/20">
                <h3 className="font-semibold text-sm tracking-wide uppercase text-muted-foreground">
                  User 1
                </h3>
                <div>
                  <Label htmlFor="u1-name">Full Name *</Label>
                  <Input
                    id="u1-name"
                    placeholder="e.g. Alex Rivera"
                    value={user1Name}
                    onChange={(e) => setUser1Name(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="u1-desc">Role / Description</Label>
                  <Input
                    id="u1-desc"
                    placeholder="e.g. Frontend Developer"
                    value={user1Desc}
                    onChange={(e) => setUser1Desc(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="u1-photo">Avatar URL (Optional)</Label>
                  <Input
                    id="u1-photo"
                    placeholder="https://..."
                    value={user1Photo}
                    onChange={(e) => setUser1Photo(e.target.value)}
                  />
                </div>
              </div>

              {/* User 2 */}
              <div className="space-y-3 p-4 rounded-xl border bg-muted/20">
                <h3 className="font-semibold text-sm tracking-wide uppercase text-muted-foreground">
                  User 2
                </h3>
                <div>
                  <Label htmlFor="u2-name">Full Name *</Label>
                  <Input
                    id="u2-name"
                    placeholder="e.g. Jordan Lee"
                    value={user2Name}
                    onChange={(e) => setUser2Name(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="u2-desc">Role / Description</Label>
                  <Input
                    id="u2-desc"
                    placeholder="e.g. AI Researcher"
                    value={user2Desc}
                    onChange={(e) => setUser2Desc(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="u2-photo">Avatar URL (Optional)</Label>
                  <Input
                    id="u2-photo"
                    placeholder="https://..."
                    value={user2Photo}
                    onChange={(e) => setUser2Photo(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Discussion Points / Summary */}
            <div className="space-y-2">
              <Label htmlFor="summary-points">Meeting Discussion Points (One per line) *</Label>
              <textarea
                id="summary-points"
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder={"Alex explained Next.js App Router structure&#10;Jordan shared insights on fine-tuning models&#10;Both planned to build an interactive prototype"}
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Each new line will become a bullet point on the meeting card.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Add to Dashboard
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

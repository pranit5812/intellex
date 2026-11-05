"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveMeeting } from "@/lib/meetings";
import { ArrowLeft, UserPlus } from "lucide-react";

const CreateMeetingPage = () => {
  const router = useRouter();

  const [user1Name, setUser1Name] = useState("");
  const [user1Desc, setUser1Desc] = useState("");
  const [user1Photo, setUser1Photo] = useState("");

  const [user2Name, setUser2Name] = useState("");
  const [user2Desc, setUser2Desc] = useState("");
  const [user2Photo, setUser2Photo] = useState("");

  const [points, setPoints] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user1Name.trim() || !user2Name.trim()) {
      setError("Please provide names for both users.");
      return;
    }

    if (!points.trim()) {
      setError("Please enter at least one summary point.");
      return;
    }

    setIsSubmitting(true);

    const formattedSummary = points
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean)
      .join("; ");

    try {
      await saveMeeting({
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

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to save meeting. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 max-w-4xl mx-auto">
      <div className="w-full mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
        </Link>
      </div>

      <Card className="w-full shadow-xl border bg-card">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
            <UserPlus className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Create New Meeting</CardTitle>
          <CardDescription className="text-base max-w-md mx-auto">
            Define your own custom users and meeting takeaways to showcase on the dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User 1 */}
              <div className="space-y-4 p-5 rounded-2xl border bg-muted/20">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-semibold text-sm tracking-wider uppercase text-muted-foreground">
                    First Participant
                  </h3>
                </div>
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
                  <Label htmlFor="u1-desc">Title / Role</Label>
                  <Input
                    id="u1-desc"
                    placeholder="e.g. Frontend Engineer"
                    value={user1Desc}
                    onChange={(e) => setUser1Desc(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="u1-photo">Avatar Image URL (Optional)</Label>
                  <Input
                    id="u1-photo"
                    placeholder="https://..."
                    value={user1Photo}
                    onChange={(e) => setUser1Photo(e.target.value)}
                  />
                </div>
              </div>

              {/* User 2 */}
              <div className="space-y-4 p-5 rounded-2xl border bg-muted/20">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-semibold text-sm tracking-wider uppercase text-muted-foreground">
                    Second Participant
                  </h3>
                </div>
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
                  <Label htmlFor="u2-desc">Title / Role</Label>
                  <Input
                    id="u2-desc"
                    placeholder="e.g. AI Researcher"
                    value={user2Desc}
                    onChange={(e) => setUser2Desc(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="u2-photo">Avatar Image URL (Optional)</Label>
                  <Input
                    id="u2-photo"
                    placeholder="https://..."
                    value={user2Photo}
                    onChange={(e) => setUser2Photo(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Discussion Points */}
            <div className="space-y-2">
              <Label htmlFor="summary-points">Key Discussion Points (One per line) *</Label>
              <textarea
                id="summary-points"
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder={
                  "Discussed project architecture and technical stack\nReviewed UI components and design specifications\nAgreed on next sprint goals and deliverables"
                }
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Each line will render as an individual bullet point on the card.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
              <Link href="/dashboard">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Meeting & View Dashboard"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateMeetingPage;

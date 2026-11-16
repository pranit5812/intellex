"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthGuard } from "@/components/auth-guard";
import { useAuthContext } from "@/components/auth-provider";
import { getStoredMeetings, generateRoomCode, saveMeeting } from "@/lib/meetings";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Award,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Swords,
  Flame,
  Zap,
  Users,
  Copy,
  Check,
  Share2,
  Download,
  Timer,
  Crown,
  ArrowUpRight,
  X,
  Shield,
  Medal,
} from "lucide-react";

interface LeaderboardUser {
  rank: number;
  name: string;
  role: string;
  photoURL?: string;
  sessions: number;
  hours: number;
  streak: number;
  xp: number;
  badge: "Gold" | "Silver" | "Bronze" | "Member";
}

interface PeerDuel {
  id: string;
  challenger: string;
  target: string;
  mode: string;
  roomCode: string;
  xpStake: number;
  status: "Open" | "In Battle" | "Completed";
}

const DEFAULT_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    name: "Elena Rostova",
    role: "AI & ML Specialist",
    photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    sessions: 14,
    hours: 18.5,
    streak: 7,
    xp: 4850,
    badge: "Gold",
  },
  {
    rank: 2,
    name: "Marcus Vance",
    role: "Full-Stack Architect",
    photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    sessions: 11,
    hours: 14.0,
    streak: 5,
    xp: 3720,
    badge: "Silver",
  },
  {
    rank: 3,
    name: "Liam O'Connor",
    role: "UI/UX Systems Lead",
    photoURL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    sessions: 9,
    hours: 11.2,
    streak: 4,
    xp: 2950,
    badge: "Bronze",
  },
  {
    rank: 4,
    name: "Aria Chen",
    role: "Smart Contract Developer",
    photoURL: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    sessions: 7,
    hours: 8.5,
    streak: 3,
    xp: 2150,
    badge: "Member",
  },
  {
    rank: 5,
    name: "Devon Reed",
    role: "DevOps Engineer",
    photoURL: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    sessions: 5,
    hours: 6.2,
    streak: 2,
    xp: 1600,
    badge: "Member",
  },
];

const CHALLENGE_MODES = [
  { id: "speed-code", title: "15-Min Speed Coding Duel", icon: Zap, desc: "Race to solve an algorithmic problem first", xp: 150 },
  { id: "debugging", title: "Live Bug Hunt Showdown", icon: Swords, desc: "Find and fix 3 hidden bugs before your rival", xp: 200 },
  { id: "ui-race", title: "Frontend UI Sprint", icon: Sparkles, desc: "Replicate a target component with Tailwind in 20 min", xp: 180 },
  { id: "study-pomodoro", title: "Co-Focus Pomodoro Duel", icon: Timer, desc: "Stay uninterrupted for 25 mins with mutual review", xp: 100 },
];

export default function LeaderboardPage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const [users, setUsers] = useState<LeaderboardUser[]>(DEFAULT_LEADERBOARD);
  const [selectedRival, setSelectedRival] = useState<LeaderboardUser | null>(null);

  // Challenge modal state
  const [challengePeer, setChallengePeer] = useState<LeaderboardUser | null>(null);
  const [selectedMode, setSelectedMode] = useState(CHALLENGE_MODES[0].id);
  const [duelRoomCode, setDuelRoomCode] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Certificate / Award modal state
  const [showCertificate, setShowCertificate] = useState(false);
  const [claimedSuccess, setClaimedSuccess] = useState(false);
  const [certId, setCertId] = useState("");

  // Live Duels
  const [openDuels, setOpenDuels] = useState<PeerDuel[]>([
    {
      id: "duel-1",
      challenger: "Elena Rostova",
      target: "Open to anyone",
      mode: "15-Min Speed Coding Duel",
      roomCode: "INTX-DUEL-8821",
      xpStake: 150,
      status: "Open",
    },
    {
      id: "duel-2",
      challenger: "Marcus Vance",
      target: "Open to anyone",
      mode: "Live Bug Hunt Showdown",
      roomCode: "INTX-DUEL-4409",
      xpStake: 200,
      status: "Open",
    },
  ]);

  useEffect(() => {
    async function loadData() {
      const meetings = await getStoredMeetings();
      if (meetings && meetings.length > 0) {
        const counts: Record<string, { sessions: number; role: string; photoURL?: string }> = {};
        meetings.forEach((m) => {
          if (m.user1?.name) {
            counts[m.user1.name] = {
              sessions: (counts[m.user1.name]?.sessions || 0) + 1,
              role: m.user1.description || "Active Peer",
              photoURL: m.user1.photoURL,
            };
          }
          if (m.user2?.name) {
            counts[m.user2.name] = {
              sessions: (counts[m.user2.name]?.sessions || 0) + 1,
              role: m.user2.description || "Active Peer",
              photoURL: m.user2.photoURL,
            };
          }
        });

        const derived: LeaderboardUser[] = Object.entries(counts)
          .map(([name, data]) => ({
            rank: 0,
            name,
            role: data.role,
            photoURL: data.photoURL,
            sessions: data.sessions,
            hours: Number((data.sessions * 1.3).toFixed(1)),
            streak: Math.min(10, Math.max(1, data.sessions + 1)),
            xp: data.sessions * 280 + 350,
            badge: "Member" as const,
          }))
          .sort((a, b) => b.sessions - a.sessions);

        derived.forEach((u, i) => {
          u.rank = i + 1;
          if (i === 0) u.badge = "Gold";
          else if (i === 1) u.badge = "Silver";
          else if (i === 2) u.badge = "Bronze";
        });

        if (derived.length > 0) {
          setUsers(derived);
          setSelectedRival(derived[0]);
        }
      } else {
        setSelectedRival(DEFAULT_LEADERBOARD[0]);
      }
    }
    loadData();
  }, []);

  const openChallengeModal = (peer: LeaderboardUser) => {
    setChallengePeer(peer);
    setDuelRoomCode(generateRoomCode());
  };

  const handleLaunchDuel = async () => {
    if (!challengePeer) return;
    const modeObj = CHALLENGE_MODES.find((m) => m.id === selectedMode) || CHALLENGE_MODES[0];

    // Save as a scheduled session
    await saveMeeting({
      roomCode: duelRoomCode,
      user1: {
        name: user?.displayName || "You",
        description: "Challenger",
      },
      user2: {
        name: challengePeer.name,
        description: challengePeer.role,
      },
      summary: `⚔️ Live Peer Duel: ${modeObj.title} with ${challengePeer.name}. XP at stake: ${modeObj.xp} XP.`,
    });

    // Add to open duels feed
    setOpenDuels((prev) => [
      {
        id: `duel-${Date.now()}`,
        challenger: user?.displayName || "You",
        target: challengePeer.name,
        mode: modeObj.title,
        roomCode: duelRoomCode,
        xpStake: modeObj.xp,
        status: "In Battle",
      },
      ...prev,
    ]);

    // Navigate to session with duel room code
    router.push(`/session?room=${duelRoomCode}`);
  };

  const handleCopyDuelLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    navigator.clipboard.writeText(`${origin}/session?room=${duelRoomCode}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleClaimAward = () => {
    const generatedId = `INTX-CERT-${Date.now().toString().slice(-6)}`;
    setCertId(generatedId);
    setClaimedSuccess(true);
    setShowCertificate(true);
  };

  const getBadgePill = (badge: string) => {
    switch (badge) {
      case "Gold":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center gap-1">
            <Trophy className="w-3 h-3" /> Gold Tier
          </span>
        );
      case "Silver":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-300/15 text-slate-300 border border-slate-300/30 flex items-center gap-1">
            <Medal className="w-3 h-3" /> Silver Tier
          </span>
        );
      case "Bronze":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-700/15 text-amber-600 border border-amber-700/30 flex items-center gap-1">
            <Shield className="w-3 h-3" /> Bronze Tier
          </span>
        );
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">Peer Member</span>;
    }
  };

  const currentUserStats = {
    name: user?.displayName || "You (Active Learner)",
    role: "Full-Stack Learner",
    sessions: users.length > 0 ? users[0].sessions : 2,
    hours: users.length > 0 ? users[0].hours : 2.6,
    streak: 4,
    xp: 1450,
  };

  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-2">
              <Swords className="w-3.5 h-3.5" /> Peer Arena & League Season 4
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-500" />
              Learner Leaderboard & Peer Duels
            </h1>
            <p className="text-muted-foreground text-sm mt-1 max-w-xl">
              Rank up by completing sessions, challenge peers to real-time skill duels, and claim verifiable achievement awards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link href="/session">
              <Button size="sm" className="bg-primary flex items-center gap-1.5 font-bold">
                <Zap className="w-4 h-4" /> Enter Arena
              </Button>
            </Link>
          </div>
        </div>

        {/* Weekly League Division Banner */}
        <Card className="border border-primary/20 bg-gradient-to-r from-primary/10 via-card to-amber-500/10 shadow-sm overflow-hidden">
          <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-xl border border-amber-500/30">
                💎
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base sm:text-lg">Diamond League • Division 1</h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                    🟢 Promotion Zone Active
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Top 3 learners at season close get promoted to Master League + 500 Bonus XP.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 sm:pl-6">
              <div className="text-center sm:text-left">
                <span className="text-[11px] text-muted-foreground uppercase font-semibold flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5 text-primary" /> Season Resets In
                </span>
                <span className="text-sm font-mono font-extrabold text-foreground">2d 14h 28m</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openChallengeModal(users[0] || DEFAULT_LEADERBOARD[0])}
                className="text-xs font-bold flex items-center gap-1.5"
              >
                <Swords className="w-3.5 h-3.5 text-amber-500" /> Start a Duel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Grid: Leaderboard & Rewards / Rivalry */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Leaderboard Table (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
              <CardHeader className="p-6 border-b bg-muted/20 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-500" /> Top Peers of the Week
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Click &apos;Challenge&apos; on any peer to enter a head-to-head live workspace showdown!
                  </CardDescription>
                </div>
                <div className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Live Rankings
                </div>
              </CardHeader>

              <Table>
                <TableHeader>
                  <TableRow className="text-xs uppercase">
                    <TableHead className="w-16 text-center">Rank</TableHead>
                    <TableHead>Peer Learner</TableHead>
                    <TableHead className="text-center">Sessions</TableHead>
                    <TableHead className="text-center">Streak</TableHead>
                    <TableHead className="text-center">Tier</TableHead>
                    <TableHead className="text-right pr-6">Compete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((peerUser) => {
                    const isTop3 = peerUser.rank <= 3;
                    return (
                      <TableRow key={peerUser.rank} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="text-center font-extrabold text-base">
                          {peerUser.rank === 1 ? (
                            <span className="text-amber-500 text-lg">🥇</span>
                          ) : peerUser.rank === 2 ? (
                            <span className="text-slate-400 text-lg">🥈</span>
                          ) : peerUser.rank === 3 ? (
                            <span className="text-amber-700 text-lg">🥉</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">#{peerUser.rank}</span>
                          )}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 border">
                              <AvatarImage src={peerUser.photoURL} alt={peerUser.name} />
                              <AvatarFallback className="font-bold text-xs bg-primary/10 text-primary">
                                {peerUser.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-bold text-sm flex items-center gap-1.5">
                                {peerUser.name}
                                {isTop3 && (
                                  <span className="text-[10px] text-emerald-500 font-bold">▲ Promote</span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">{peerUser.role}</div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-center font-mono font-bold text-sm">
                          {peerUser.sessions}
                          <span className="block text-[10px] text-muted-foreground font-normal">{peerUser.hours}h</span>
                        </TableCell>

                        <TableCell className="text-center">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">
                            <Flame className="w-3 h-3 fill-current" /> {peerUser.streak}d
                          </span>
                        </TableCell>

                        <TableCell className="text-center">
                          {getBadgePill(peerUser.badge)}
                        </TableCell>

                        <TableCell className="text-right pr-6">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openChallengeModal(peerUser)}
                            className="h-8 text-xs font-bold hover:bg-primary hover:text-primary-foreground border-primary/40 flex items-center gap-1 ml-auto"
                          >
                            <Swords className="w-3.5 h-3.5 text-amber-500" /> Challenge
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>

            {/* Live Peer Duels Feed */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Swords className="w-4 h-4 text-primary" /> Active Community Duels & Open Challenges
                  </span>
                  <span className="text-xs font-normal text-muted-foreground">Jump in to earn XP</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {openDuels.map((duel) => (
                  <div
                    key={duel.id}
                    className="p-3.5 rounded-xl border bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-foreground">{duel.challenger}</span>
                        <span className="text-xs text-muted-foreground">vs</span>
                        <span className="text-xs font-semibold text-primary">{duel.target}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500">
                          +{duel.xpStake} XP
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-500" /> {duel.mode} • Room: <code className="text-foreground font-mono">{duel.roomCode}</code>
                      </p>
                    </div>

                    <Link href={`/session?room=${duel.roomCode}`}>
                      <Button size="sm" className="h-8 text-xs font-bold bg-primary flex items-center gap-1">
                        Accept Battle <ArrowUpRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: 1v1 Rivalry Widget & Instant Achievement Award */}
          <div className="space-y-6">
            {/* 1v1 Rivalry Showdown Card */}
            <Card className="border border-border shadow-md bg-gradient-to-b from-card to-muted/20 overflow-hidden">
              <CardHeader className="pb-3 bg-muted/30 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Swords className="w-4 h-4 text-amber-500" /> Head-to-Head Showdown
                  </CardTitle>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase">1v1 Comparison</span>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-5">
                {/* Peer Selection dropdown */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                    Select Your Rival:
                  </label>
                  <select
                    value={selectedRival?.name || ""}
                    onChange={(e) => {
                      const found = users.find((u) => u.name === e.target.value);
                      if (found) setSelectedRival(found);
                    }}
                    className="w-full text-xs rounded-lg border bg-background px-3 py-2 text-foreground font-semibold"
                  >
                    {users.map((u) => (
                      <option key={u.name} value={u.name}>
                        #{u.rank} {u.name} ({u.sessions} sessions)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Head-to-Head Faceoff */}
                {selectedRival && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-muted/40 border">
                      {/* You */}
                      <div className="text-center flex-1">
                        <Avatar className="w-12 h-12 mx-auto border-2 border-primary">
                          <AvatarFallback className="font-extrabold text-xs bg-primary text-primary-foreground">
                            YOU
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-xs font-bold mt-1.5 truncate">You</p>
                        <p className="text-[10px] text-muted-foreground">{currentUserStats.sessions} Sessions</p>
                      </div>

                      {/* VS Emblem */}
                      <div className="shrink-0 w-8 h-8 rounded-full bg-amber-500 text-black font-extrabold text-xs flex items-center justify-center shadow-md">
                        VS
                      </div>

                      {/* Rival */}
                      <div className="text-center flex-1">
                        <Avatar className="w-12 h-12 mx-auto border-2 border-amber-500">
                          <AvatarImage src={selectedRival.photoURL} />
                          <AvatarFallback className="font-extrabold text-xs">
                            {selectedRival.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-xs font-bold mt-1.5 truncate">{selectedRival.name.split(" ")[0]}</p>
                        <p className="text-[10px] text-muted-foreground">{selectedRival.sessions} Sessions</p>
                      </div>
                    </div>

                    {/* Stat Bars Comparison */}
                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between text-muted-foreground mb-1">
                          <span>Study Hours</span>
                          <span className="font-bold text-foreground">{currentUserStats.hours}h vs {selectedRival.hours}h</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                          <div
                            className="bg-primary h-full"
                            style={{ width: `${Math.round((currentUserStats.hours / (currentUserStats.hours + selectedRival.hours || 1)) * 100)}%` }}
                          />
                          <div
                            className="bg-amber-500 h-full"
                            style={{ width: `${Math.round((selectedRival.hours / (currentUserStats.hours + selectedRival.hours || 1)) * 100)}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-muted-foreground mb-1">
                          <span>Study Streak</span>
                          <span className="font-bold text-foreground">{currentUserStats.streak}d vs {selectedRival.streak}d</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                          <div
                            className="bg-primary h-full"
                            style={{ width: `${Math.round((currentUserStats.streak / (currentUserStats.streak + selectedRival.streak || 1)) * 100)}%` }}
                          />
                          <div
                            className="bg-amber-500 h-full"
                            style={{ width: `${Math.round((selectedRival.streak / (currentUserStats.streak + selectedRival.streak || 1)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => openChallengeModal(selectedRival)}
                      className="w-full font-bold text-xs flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black shadow-md"
                    >
                      <Swords className="w-3.5 h-3.5" /> Challenge {selectedRival.name.split(" ")[0]} Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instant Achievement Award Card (NO WALLET ADDRESS REQUIRED!) */}
            <Card className="relative overflow-hidden border-2 border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-card to-card shadow-lg">
              <div className="absolute top-0 right-0 p-3">
                <span className="text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full bg-amber-500 text-black">
                  Certified
                </span>
              </div>

              <CardHeader className="text-center pb-2 pt-6">
                <div className="mx-auto w-24 h-24 relative mb-2">
                  <Image
                    src="/goldbadge.png"
                    alt="Intellex Gold Badge"
                    width={96}
                    height={96}
                    className="drop-shadow-[0_10px_20px_rgba(245,158,11,0.35)] hover:scale-105 transition-transform"
                  />
                </div>
                <CardTitle className="text-xl font-bold">The Intellex Gold Award</CardTitle>
                <CardDescription className="text-xs">
                  Official verifiable digital credential awarded to top collaborative learners.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-2">
                <div className="p-3.5 rounded-xl border bg-muted/40 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Recipient:</span>
                    <span className="font-bold text-foreground">{user?.displayName || "Active Learner"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Award Tier:</span>
                    <span className="font-bold text-amber-500">Gold Distinction (Top 10%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">XP Value:</span>
                    <span className="font-mono font-bold text-foreground">+500 Peer XP</span>
                  </div>
                </div>

                <Button
                  onClick={handleClaimAward}
                  className="w-full font-bold shadow-md flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black"
                >
                  <Award className="w-4 h-4" /> Claim Award & Certificate
                </Button>

                <p className="text-[11px] text-center text-muted-foreground">
                  Instantly unlocked directly to your account. No crypto wallet required.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Challenge Peer Modal ────────────────────────────── */}
        <AnimatePresence>
          {challengePeer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setChallengePeer(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg"
              >
                <Card className="shadow-2xl border border-primary/30">
                  <CardHeader className="flex flex-row items-center justify-between pb-3 bg-muted/20 border-b">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                        <Swords className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Challenge {challengePeer.name}</CardTitle>
                        <CardDescription className="text-xs">Setup a real-time collaborative duel in the Live Session</CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setChallengePeer(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </CardHeader>

                  <CardContent className="p-6 space-y-5">
                    {/* Choose Battle Mode */}
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-foreground">Select Challenge Arena Mode:</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {CHALLENGE_MODES.map((mode) => {
                          const Icon = mode.icon;
                          const isSel = selectedMode === mode.id;
                          return (
                            <button
                              key={mode.id}
                              type="button"
                              onClick={() => setSelectedMode(mode.id)}
                              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                isSel
                                  ? "bg-primary/10 border-primary text-foreground ring-1 ring-primary"
                                  : "border-border hover:bg-muted/50 text-muted-foreground"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <Icon className={`w-4 h-4 ${isSel ? "text-primary" : "text-muted-foreground"}`} />
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted">
                                  +{mode.xp} XP
                                </span>
                              </div>
                              <p className="text-xs font-bold text-foreground">{mode.title}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{mode.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Room Code & Invite Link */}
                    <div className="p-3.5 rounded-xl border bg-muted/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">Generated Duel Room Code:</span>
                        <code className="text-xs font-mono font-extrabold text-primary px-2 py-0.5 rounded bg-primary/10">
                          {duelRoomCode}
                        </code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          readOnly
                          value={typeof window !== "undefined" ? `${window.location.origin}/session?room=${duelRoomCode}` : duelRoomCode}
                          className="text-xs font-mono h-8 bg-background"
                        />
                        <Button size="sm" variant="outline" onClick={handleCopyDuelLink} className="h-8 text-xs shrink-0">
                          {copiedLink ? <Check className="w-3.5 h-3.5 mr-1 text-green-500" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                          {copiedLink ? "Copied" : "Copy"}
                        </Button>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 pt-2">
                      <Button variant="outline" onClick={() => setChallengePeer(null)} className="flex-1 text-xs font-semibold">
                        Cancel
                      </Button>
                      <Button onClick={handleLaunchDuel} className="flex-1 text-xs font-bold flex items-center justify-center gap-1.5 bg-primary">
                        <Swords className="w-4 h-4" /> Launch Arena Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Official Certificate Modal ──────────────────────── */}
        <AnimatePresence>
          {showCertificate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setShowCertificate(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md"
              >
                <Card className="shadow-2xl border-2 border-amber-500/50 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3">
                    <Button variant="ghost" size="icon" onClick={() => setShowCertificate(false)} className="text-zinc-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Award className="w-8 h-8" />
                    </div>

                    <div>
                      <span className="text-[10px] tracking-widest uppercase text-amber-400 font-extrabold">Certificate of Excellence</span>
                      <h2 className="text-2xl font-extrabold tracking-tight mt-1">Intellex Gold Achievement</h2>
                      <p className="text-xs text-zinc-400 mt-1">Verifiable Peer-to-Peer Learning Distinction</p>
                    </div>

                    <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2 text-xs">
                      <div className="flex justify-between text-zinc-400">
                        <span>Awarded To:</span>
                        <strong className="text-white text-sm">{user?.displayName || "Active Learner"}</strong>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Date Issued:</span>
                        <span className="text-zinc-200">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Credential ID:</span>
                        <code className="text-amber-400 font-mono font-bold">{certId}</code>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Rank Status:</span>
                        <span className="text-emerald-400 font-semibold">Verified Distinction</span>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <Button
                        onClick={() => {
                          alert(`Certificate ${certId} verified and saved to your learner profile!`);
                          setShowCertificate(false);
                        }}
                        className="flex-1 font-bold bg-amber-500 hover:bg-amber-600 text-black text-xs"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1.5" /> Save to Profile
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowCertificate(false)}
                        className="text-xs font-semibold"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthGuard>
  );
}

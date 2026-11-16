"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AuthGuard } from "@/components/auth-guard";
import { saveMeeting, generateRoomCode } from "@/lib/meetings";
import {
  PenTool,
  Code2,
  FileText,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  RotateCcw,
  Download,
  Copy,
  Check,
  Play,
  Pause,
  Save,
  CheckCircle2,
  Trash2,
  Sparkles,
  Link2,
  Share2,
} from "lucide-react";

export default function SessionWorkspace() {
  return (
    <AuthGuard>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <SessionWorkspaceContent />
      </Suspense>
    </AuthGuard>
  );
}

function SessionWorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active Workspace Tab: 'whiteboard' | 'code' | 'notes'
  const [activeTab, setActiveTab] = useState<"whiteboard" | "code" | "notes">("whiteboard");

  // Room Code & Sharing State
  const initialRoom = searchParams.get("room") || "";
  const [currentRoomCode, setCurrentRoomCode] = useState(initialRoom || generateRoomCode());
  const [copiedLink, setCopiedLink] = useState(false);
  const [customRoomInput, setCustomRoomInput] = useState("");

  // Media / Video Call State
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Stop all camera and audio hardware tracks completely
  const stopCameraTracks = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    setIsVideoOn(false);
  };

  // Stop screen sharing tracks completely
  const stopScreenTracks = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      screenStreamRef.current = null;
    }
    if (screenRef.current) {
      screenRef.current.pause();
      screenRef.current.srcObject = null;
    }
    setIsScreenSharing(false);
  };

  // Guaranteed cleanup: Stop all camera and media tracks on component unmount
  useEffect(() => {
    return () => {
      stopCameraTracks();
      stopScreenTracks();
    };
  }, []);

  const handleCopyInviteLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const inviteUrl = `${origin}/session?room=${encodeURIComponent(currentRoomCode)}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleGenerateNewRoom = () => {
    const newCode = generateRoomCode();
    setCurrentRoomCode(newCode);
    router.replace(`/session?room=${encodeURIComponent(newCode)}`);
  };

  const handleJoinCustomRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRoomInput.trim()) return;
    const cleanCode = customRoomInput.trim().toUpperCase();
    setCurrentRoomCode(cleanCode);
    router.replace(`/session?room=${encodeURIComponent(cleanCode)}`);
    setCustomRoomInput("");
  };

  // Timer State
  const [seconds, setSeconds] = useState(1500); // 25 min default
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && seconds > 0) {
      interval = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else if (seconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, seconds]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  };

  // ----------------------------------------------------
  // 1. WHITEBOARD LOGIC
  // ----------------------------------------------------
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#6366f1");
  const [brushSize, setBrushSize] = useState(4);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = 550;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = isEraser ? "#09090b" : brushColor;
    ctx.lineWidth = isEraser ? brushSize * 4 : brushSize;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `intellex-whiteboard-${currentRoomCode}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  // ----------------------------------------------------
  // 2. CODE PLAYGROUND LOGIC
  // ----------------------------------------------------
  const starterCodeTemplates: Record<string, string> = {
    javascript: `// Intellex Collaborative JavaScript Playground\nfunction binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}\n\nconsole.log(binarySearch([1, 3, 5, 7, 9], 7));`,
    python: `# Intellex Python Peer Session Snippet\ndef predict_engagement(sessions, hours):\n    """Simple heuristic for top learner progression"""\n    score = (sessions * 1.5) + (hours * 2.0)\n    badge_eligible = score >= 10.0\n    return {"score": score, "eligible_for_nft": badge_eligible}\n\nresult = predict_engagement(5, 4.5)\nprint(result)`,
    solidity: `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\ncontract IntellexBadge {\n    string public name = "Intellex Skill Award";\n    mapping(address => uint256) public completedSessions;\n\n    function rewardPeer(address learner) external {\n        completedSessions[learner] += 1;\n    }\n}`,
  };

  const [language, setLanguage] = useState("javascript");
  const [codeContent, setCodeContent] = useState(starterCodeTemplates.javascript);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCodeContent(starterCodeTemplates[lang] || "");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeContent);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // ----------------------------------------------------
  // 3. SESSION NOTES & SAVE TO DASHBOARD LOGIC
  // ----------------------------------------------------
  const [participant1, setParticipant1] = useState("Peer Mentor");
  const [participant1Role, setParticipant1Role] = useState("Lead Instructor");
  const [participant2, setParticipant2] = useState("Learner");
  const [participant2Role, setParticipant2Role] = useState("Software Developer");
  const [sessionNotes, setSessionNotes] = useState(
    "Introduced system design fundamentals\nWalked through binary search implementation and time complexity\nPracticed whiteboard problem solving\nAgreed on next milestone: Build React state machine"
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveToDashboard = async () => {
    if (!participant1.trim() || !participant2.trim() || !sessionNotes.trim()) return;

    const formattedSummary = sessionNotes
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .join("; ");

    await saveMeeting({
      roomCode: currentRoomCode,
      user1: {
        name: participant1.trim(),
        description: participant1Role.trim(),
      },
      user2: {
        name: participant2.trim(),
        description: participant2Role.trim(),
      },
      summary: formattedSummary,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // ----------------------------------------------------
  // 4. WEBRTC CAMERA & MIC CONTROLS
  // ----------------------------------------------------
  const toggleCamera = async () => {
    if (isVideoOn) {
      stopCameraTracks();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: isAudioOn,
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setIsVideoOn(true);
      } catch (err) {
        console.error("Camera access error:", err);
        alert("Camera access denied or unavailable: " + (err as Error).message);
        setIsVideoOn(false);
      }
    }
  };

  const toggleMic = () => {
    if (!mediaStreamRef.current) return;
    const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioOn(audioTrack.enabled);
    } else {
      setIsAudioOn(!isAudioOn);
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      stopScreenTracks();
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = screenStream;
        if (screenRef.current) {
          screenRef.current.srcObject = screenStream;
          screenRef.current.play().catch(() => {});
        }
        setIsScreenSharing(true);
        screenStream.getVideoTracks()[0].onended = () => {
          stopScreenTracks();
        };
      } catch (err) {
        console.warn("Screen share cancelled", err);
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col space-y-6">
      {/* Top Room & Invite Bar */}
      <div className="p-4 rounded-2xl border bg-card/60 backdrop-blur-md shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Active Room Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Active Room Code:
              </span>
              <span className="font-mono font-bold text-sm px-2 py-0.5 rounded bg-muted border text-foreground">
                {currentRoomCode}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Peers who open your link will join this collaboration room.
            </p>
          </div>
        </div>

        {/* Right: Room Actions & Timer */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            size="sm"
            onClick={handleCopyInviteLink}
            className="flex items-center gap-1.5 text-xs font-semibold shadow-sm"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Invite Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Copy Shareable Link</span>
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleGenerateNewRoom}
            className="text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> New Room
          </Button>

          {/* Timer Control */}
          <div className="flex items-center gap-2 bg-muted/40 px-3 py-1.5 rounded-xl border">
            <span className="font-mono text-sm font-bold tracking-wider">{formatTimer(seconds)}</span>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={() => setTimerRunning(!timerRunning)}
            >
              {timerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={() => {
                setTimerRunning(false);
                setSeconds(1500);
              }}
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>

          {/* Media Controls */}
          <div className="flex items-center gap-1.5 border-l pl-2">
            <Button
              size="sm"
              variant={isVideoOn ? "destructive" : "outline"}
              className="h-8 text-xs flex items-center gap-1"
              onClick={toggleCamera}
            >
              {isVideoOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
              {isVideoOn ? "Cam Off" : "Cam On"}
            </Button>
            <Button
              size="sm"
              variant={isAudioOn ? "default" : "outline"}
              className="h-8 text-xs flex items-center gap-1"
              onClick={toggleMic}
            >
              {isAudioOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            </Button>
            <Button
              size="sm"
              variant={isScreenSharing ? "secondary" : "outline"}
              className="h-8 text-xs flex items-center gap-1"
              onClick={toggleScreenShare}
            >
              <Monitor className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid: Workspace & Media Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: 3-Column Collaborative Workspace */}
        <div className="lg:col-span-3 space-y-4">
          {/* Workspace Tabs Header */}
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex space-x-2">
              <Button
                variant={activeTab === "whiteboard" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("whiteboard")}
                className="flex items-center gap-1.5 text-xs font-semibold"
              >
                <PenTool className="w-3.5 h-3.5" /> Interactive Whiteboard
              </Button>
              <Button
                variant={activeTab === "code" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("code")}
                className="flex items-center gap-1.5 text-xs font-semibold"
              >
                <Code2 className="w-3.5 h-3.5" /> Code Playground
              </Button>
              <Button
                variant={activeTab === "notes" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("notes")}
                className="flex items-center gap-1.5 text-xs font-semibold"
              >
                <FileText className="w-3.5 h-3.5" /> Session Notes & Export
              </Button>
            </div>

            {/* Contextual actions based on tab */}
            {activeTab === "whiteboard" && (
              <div className="flex items-center gap-2">
                {/* Palette */}
                <div className="hidden sm:flex items-center gap-1.5">
                  {["#6366f1", "#10b981", "#ef4444", "#f59e0b", "#38bdf8", "#ffffff"].map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setBrushColor(color);
                        setIsEraser(false);
                      }}
                      className={`w-5 h-5 rounded-full border transition-transform ${
                        brushColor === color && !isEraser ? "scale-125 border-white ring-2 ring-primary" : "opacity-80"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <Button
                  size="sm"
                  variant={isEraser ? "secondary" : "ghost"}
                  onClick={() => setIsEraser(!isEraser)}
                  className="h-8 text-xs"
                >
                  Eraser
                </Button>
                <Button size="sm" variant="outline" onClick={clearCanvas} className="h-8 text-xs">
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
                </Button>
                <Button size="sm" variant="outline" onClick={downloadCanvas} className="h-8 text-xs">
                  <Download className="w-3.5 h-3.5 mr-1" /> Export PNG
                </Button>
              </div>
            )}

            {activeTab === "code" && (
              <div className="flex items-center gap-2">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="text-xs rounded-md border bg-background px-2 py-1 text-foreground"
                >
                  <option value="javascript">JavaScript / TypeScript</option>
                  <option value="python">Python</option>
                  <option value="solidity">Solidity (Web3)</option>
                </select>
                <Button size="sm" variant="outline" onClick={handleCopyCode} className="h-8 text-xs">
                  {copiedCode ? <Check className="w-3.5 h-3.5 mr-1 text-green-500" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  {copiedCode ? "Copied" : "Copy"}
                </Button>
              </div>
            )}
          </div>

          {/* TAB 1: WHITEBOARD */}
          {activeTab === "whiteboard" && (
            <div className="relative border rounded-2xl overflow-hidden bg-black shadow-inner flex flex-col items-center justify-center">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="cursor-crosshair w-full block touch-none"
              />
              <div className="absolute bottom-3 left-3 text-xs bg-black/60 px-3 py-1 rounded-full text-zinc-400 backdrop-blur-md">
                Room: <span className="text-primary font-mono font-bold">{currentRoomCode}</span> • Draw diagrams, architecture, or equations
              </div>
            </div>
          )}

          {/* TAB 2: CODE PLAYGROUND */}
          {activeTab === "code" && (
            <div className="border rounded-2xl overflow-hidden bg-zinc-950 text-zinc-100 shadow-md font-mono text-sm">
              <div className="bg-zinc-900/80 px-4 py-2 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                <span>session_editor.{language === "python" ? "py" : language === "solidity" ? "sol" : "ts"}</span>
                <span>Room: {currentRoomCode} • Ready</span>
              </div>
              <textarea
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                rows={22}
                className="w-full bg-transparent p-4 focus:outline-none resize-none text-zinc-200 leading-relaxed font-mono"
                spellCheck={false}
              />
            </div>
          )}

          {/* TAB 3: NOTES & SUMMARY */}
          {activeTab === "notes" && (
            <Card className="border shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Session Summary & Takeaways</CardTitle>
                    <CardDescription>
                      Document what was learned during Room {currentRoomCode}. Save directly to your Dashboard.
                    </CardDescription>
                  </div>
                  <span className="font-mono text-xs px-2.5 py-1 bg-muted border rounded font-bold">
                    {currentRoomCode}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">Participant 1 (Host / Mentor)</Label>
                    <Input
                      value={participant1}
                      onChange={(e) => setParticipant1(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="mt-1"
                    />
                    <Input
                      value={participant1Role}
                      onChange={(e) => setParticipant1Role(e.target.value)}
                      placeholder="Role (e.g. Senior Architect)"
                      className="mt-1.5 text-xs text-muted-foreground"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Participant 2 (Learner / Peer)</Label>
                    <Input
                      value={participant2}
                      onChange={(e) => setParticipant2(e.target.value)}
                      placeholder="e.g. Jordan Lee"
                      className="mt-1"
                    />
                    <Input
                      value={participant2Role}
                      onChange={(e) => setParticipant2Role(e.target.value)}
                      placeholder="Role (e.g. Junior Developer)"
                      className="mt-1.5 text-xs text-muted-foreground"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Discussion Points & Milestones (One per line)</Label>
                  <textarea
                    rows={6}
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    className="w-full rounded-md border bg-background p-3 text-sm focus:outline-none mt-1 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  {saveSuccess ? (
                    <span className="text-xs text-green-500 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Successfully saved to Dashboard!
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Will be saved with Room Code: {currentRoomCode}
                    </span>
                  )}
                  <div className="space-x-3">
                    <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
                      View Dashboard
                    </Button>
                    <Button size="sm" onClick={handleSaveToDashboard} className="flex items-center gap-1.5">
                      <Save className="w-3.5 h-3.5" /> Save Session to Dashboard
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Live Video & Room Switcher */}
        <div className="space-y-4">
          {/* Video Preview Card */}
          <Card className="overflow-hidden border shadow-sm">
            <CardHeader className="p-3 pb-2 bg-muted/30 border-b">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Camera Stream</span>
                {isVideoOn && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
              </CardTitle>
            </CardHeader>
            <div className="relative aspect-video bg-zinc-950 flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${isVideoOn ? "block" : "hidden"}`}
              />
              {!isVideoOn && (
                <div className="flex flex-col items-center text-zinc-500 text-xs gap-1.5">
                  <VideoOff className="w-6 h-6" />
                  <span>Camera is turned off</span>
                </div>
              )}
            </div>
            <div className="p-3 text-center">
              <Button size="sm" variant={isVideoOn ? "destructive" : "outline"} className="w-full text-xs" onClick={toggleCamera}>
                {isVideoOn ? "Turn Off Camera" : "Turn On Camera Preview"}
              </Button>
            </div>
          </Card>

          {/* Screen Share Card if active */}
          {isScreenSharing && (
            <Card className="overflow-hidden border">
              <CardHeader className="p-3 pb-2 bg-muted/30 border-b flex items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Your Screen Share
                </CardTitle>
                <Button size="sm" variant="ghost" onClick={stopScreenTracks} className="h-6 text-xs text-red-500">
                  Stop
                </Button>
              </CardHeader>
              <div className="aspect-video bg-zinc-950">
                <video ref={screenRef} autoPlay playsInline muted className="w-full h-full object-contain" />
              </div>
            </Card>
          )}

          {/* Join Different Room by Code */}
          <Card className="border shadow-sm p-4 space-y-3">
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-primary" /> Join Another Room
            </h3>
            <p className="text-xs text-muted-foreground">
              Enter a room code you received from a peer:
            </p>
            <form onSubmit={handleJoinCustomRoom} className="space-y-2">
              <Input
                placeholder="e.g. INTX-4892-8172"
                value={customRoomInput}
                onChange={(e) => setCustomRoomInput(e.target.value)}
                className="font-mono text-xs uppercase"
              />
              <Button type="submit" size="sm" variant="secondary" className="w-full text-xs">
                Switch to Room
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

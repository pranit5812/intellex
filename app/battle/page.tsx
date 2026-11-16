"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AuthGuard } from "@/components/auth-guard";
import { useAuthContext } from "@/components/auth-provider";
import { generateRoomCode } from "@/lib/meetings";
import { motion, AnimatePresence } from "framer-motion";
import {
  Swords,
  Camera,
  CameraOff,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Timer,
  Trophy,
  Play,
  Flame,
  Zap,
  RotateCcw,
  ShieldCheck,
  Eye,
  EyeOff,
  HelpCircle,
  ArrowLeft,
  Copy,
  Check,
  Award,
  Users,
  Code2,
  Bug,
} from "lucide-react";

export default function BattleArenaPage() {
  return (
    <AuthGuard>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <BattleArenaContent />
      </Suspense>
    </AuthGuard>
  );
}

// ----------------------------------------------------
// CHALLENGE CONTENT (IDENTICAL FOR BOTH SIDES)
// ----------------------------------------------------
const BUGGY_CODE_STARTER = `function findUniqueNumbers(arr) {
  const counts = {};
  for (let i = 0; i < arr.length; i++) {
    const num = arr[i];
    // BUG: Overwriting count to 1 instead of incrementing
    counts[num] = 1;
  }
  const result = [];
  for (let key in counts) {
    // BUG: Checking > 1 instead of === 1
    if (counts[key] > 1) {
      result.push(Number(key));
    }
  }
  return result;
}`;

const SPEED_ALGO_STARTER = `function isPalindromeValid(s) {
  // Your code here: return true if s is palindrome (ignoring casing and non-alphanumeric chars)
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  return clean === clean.split("").reverse().join("");
}`;

const MCQ_QUESTIONS = [
  {
    id: "q1",
    question: "What is the output of typeof NaN in JavaScript?",
    options: ['"number"', '"NaN"', '"undefined"', '"object"'],
    correct: 0,
  },
  {
    id: "q2",
    question: "What is the average time complexity of searching in a Balanced Binary Search Tree?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correct: 1,
  },
  {
    id: "q3",
    question: "In React, which hook is used to memoize expensive calculation results across renders?",
    options: ["useEffect", "useCallback", "useMemo", "useRef"],
    correct: 2,
  },
];

function BattleArenaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthContext();

  const [roomCode, setRoomCode] = useState("INTX-DUEL-8821");
  const [copiedLink, setCopiedLink] = useState(false);

  // Proctor state
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [strikes, setStrikes] = useState(0);
  const [showStrikeWarning, setShowStrikeWarning] = useState(false);

  // Battle status
  const [battleState, setBattleState] = useState<"ready" | "in_battle" | "won" | "forfeit">("ready");
  const [battlePoints, setBattlePoints] = useState(0);

  // Timer state
  const [elapsedMs, setElapsedMs] = useState(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Active Challenge Tab
  const [activeStage, setActiveStage] = useState<"debugging" | "mcq" | "algorithm">("debugging");

  // Round 1: Debugging Code State
  const [debugCode, setDebugCode] = useState(BUGGY_CODE_STARTER);
  const [debugStatus, setDebugStatus] = useState<"idle" | "running" | "passed" | "failed">("idle");
  const [debugLog, setDebugLog] = useState("");

  // Round 2: MCQs State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [mcqStatus, setMcqStatus] = useState<"idle" | "passed" | "failed">("idle");
  const [mcqError, setMcqError] = useState("");

  // Round 3: Speed Algorithm State
  const [algoCode, setAlgoCode] = useState(SPEED_ALGO_STARTER);
  const [algoStatus, setAlgoStatus] = useState<"idle" | "running" | "passed" | "failed">("idle");
  const [algoLog, setAlgoLog] = useState("");

  // Simulated Opponent Progress
  const [opponentProgress, setOpponentProgress] = useState({
    debug: false,
    mcq: false,
    algo: false,
    percentage: 15,
  });

  // 1. Initialize Room & Points
  useEffect(() => {
    const r = searchParams.get("room") || generateRoomCode();
    setRoomCode(r);

    const storedPts = localStorage.getItem("intellex_battle_points");
    if (storedPts) {
      setBattlePoints(parseInt(storedPts, 10) || 0);
    }
  }, [searchParams]);

  // 2. Camera Proctoring (Hardware controls)
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240 },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn("Camera access denied/unavailable:", err);
      setCameraError("Camera is required for battle proctoring. Please grant permission.");
    }
  };

  const stopCamera = () => {
    // 1. Stop all tracks on the stream ref directly
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        track.enabled = false;
        track.stop();
      });
      mediaStreamRef.current = null;
    }

    // 2. Stop and clear the video element
    if (videoRef.current) {
      if (videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => {
          track.enabled = false;
          track.stop();
        });
        videoRef.current.srcObject = null;
      }
      videoRef.current.pause();
    }

    setCameraActive(false);
  };

  // Start camera on mount, stop when unmounting
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // When battle ends (won or forfeit), turn camera hardware OFF immediately
  useEffect(() => {
    if (battleState === "won" || battleState === "forfeit") {
      stopCamera();
    }
  }, [battleState]);

  // 3. Anti-Cheat: Screen / Tab Switching Detection
  useEffect(() => {
    if (battleState !== "in_battle") return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setStrikes((prev) => {
          const next = prev + 1;
          setShowStrikeWarning(true);
          return next;
        });
      }
    };

    const handleWindowBlur = () => {
      setStrikes((prev) => {
        const next = prev + 1;
        setShowStrikeWarning(true);
        return next;
      });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [battleState]);

  // 4. Timer Handling
  useEffect(() => {
    if (battleState === "in_battle") {
      const startTime = Date.now() - elapsedMs;
      timerIntervalRef.current = setInterval(() => {
        setElapsedMs(Date.now() - startTime);
      }, 100);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [battleState]);

  // 5. Simulated Rival Progress
  useEffect(() => {
    if (battleState !== "in_battle") return;

    const interval = setInterval(() => {
      setOpponentProgress((prev) => {
        const nextPct = Math.min(95, prev.percentage + Math.floor(Math.random() * 8) + 2);
        return {
          debug: nextPct > 40,
          mcq: nextPct > 70,
          algo: nextPct > 90,
          percentage: nextPct,
        };
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [battleState]);

  // 6. Format Time: mm:ss.s
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const tenths = Math.floor((ms % 1000) / 100);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${tenths}`;
  };

  // 7. Test Debugging Solution
  const handleTestDebugging = () => {
    setDebugStatus("running");
    setDebugLog("Running test cases on your debugged function...");

    setTimeout(() => {
      try {
        const runner = new Function(`
          ${debugCode}
          return findUniqueNumbers;
        `);
        const fn = runner();

        // Run Test 1
        const res1 = fn([1, 2, 2, 3, 4, 4, 5]);
        const pass1 = Array.isArray(res1) && res1.sort().join(",") === "1,3,5";

        // Run Test 2
        const res2 = fn([7, 7, 8, 9, 9]);
        const pass2 = Array.isArray(res2) && res2.join(",") === "8";

        // Run Test 3
        const res3 = fn([10, 20, 30]);
        const pass3 = Array.isArray(res3) && res3.sort().join(",") === "10,20,30";

        if (pass1 && pass2 && pass3) {
          setDebugStatus("passed");
          setDebugLog("✅ All 3 Test Cases Passed! You solved the bug.");
          checkOverallCompletion(true, mcqStatus === "passed", algoStatus === "passed");
        } else {
          setDebugStatus("failed");
          setDebugLog(`❌ Failed test cases:
Test 1 ([1, 2, 2, 3, 4, 4, 5] -> [1, 3, 5]): ${pass1 ? "PASS" : "FAIL (got " + JSON.stringify(res1) + ")"}
Test 2 ([7, 7, 8, 9, 9] -> [8]): ${pass2 ? "PASS" : "FAIL (got " + JSON.stringify(res2) + ")"}
Test 3 ([10, 20, 30] -> [10, 20, 30]): ${pass3 ? "PASS" : "FAIL"}`);
        }
      } catch (err: any) {
        setDebugStatus("failed");
        setDebugLog(`❌ Execution Error: ${err.message}`);
      }
    }, 400);
  };

  // 8. Test MCQs
  const handleSubmitMCQ = () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < MCQ_QUESTIONS.length) {
      setMcqError("Please answer all 3 questions before submitting.");
      return;
    }

    const allCorrect = MCQ_QUESTIONS.every((q, idx) => selectedAnswers[idx] === q.correct);

    if (allCorrect) {
      setMcqStatus("passed");
      setMcqError("");
      checkOverallCompletion(debugStatus === "passed", true, algoStatus === "passed");
    } else {
      setMcqStatus("failed");
      setMcqError("Some answers are incorrect. Review and submit again!");
    }
  };

  // 9. Test Algorithm Solution
  const handleTestAlgorithm = () => {
    setAlgoStatus("running");
    setAlgoLog("Evaluating palindrome algorithm...");

    setTimeout(() => {
      try {
        const runner = new Function(`
          ${algoCode}
          return isPalindromeValid;
        `);
        const fn = runner();

        const pass1 = fn("A man, a plan, a canal: Panama") === true;
        const pass2 = fn("race a car") === false;
        const pass3 = fn("Was it a car or a cat I saw?") === true;

        if (pass1 && pass2 && pass3) {
          setAlgoStatus("passed");
          setAlgoLog("✅ All test cases passed successfully!");
          checkOverallCompletion(debugStatus === "passed", mcqStatus === "passed", true);
        } else {
          setAlgoStatus("failed");
          setAlgoLog(`❌ Test suite failed.
Test 1 ("A man, a plan, a canal: Panama"): ${pass1 ? "PASS" : "FAIL"}
Test 2 ("race a car"): ${pass2 ? "PASS" : "FAIL"}
Test 3 ("Was it a car or a cat I saw?"): ${pass3 ? "PASS" : "FAIL"}`);
        }
      } catch (err: any) {
        setAlgoStatus("failed");
        setAlgoLog(`❌ Error: ${err.message}`);
      }
    }, 400);
  };

  // 10. Check If Entire Battle Is Completed
  const checkOverallCompletion = (dPassed: boolean, mPassed: boolean, aPassed: boolean) => {
    if (dPassed && mPassed && aPassed) {
      // The battle is WON! Immediately power down camera hardware
      stopCamera();
      setBattleState("won");
      const newPoints = battlePoints + 1;
      setBattlePoints(newPoints);
      localStorage.setItem("intellex_battle_points", newPoints.toString());
    }
  };

  const handleStartBattle = () => {
    startCamera();
    setBattleState("in_battle");
    setElapsedMs(0);
    setStrikes(0);
    setDebugStatus("idle");
    setMcqStatus("idle");
    setAlgoStatus("idle");
    setOpponentProgress({ debug: false, mcq: false, algo: false, percentage: 10 });
  };

  const handleCopyLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    navigator.clipboard.writeText(`${origin}/battle?room=${roomCode}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const completedCount = (debugStatus === "passed" ? 1 : 0) + (mcqStatus === "passed" ? 1 : 0) + (algoStatus === "passed" ? 1 : 0);
  const completionPercentage = Math.round((completedCount / 3) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* ── Top Battle Arena HUD Header ─────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/80 border border-border/80 backdrop-blur-md p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-extrabold border border-amber-500/30">
            <Swords className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight">1v1 Peer Skill Battle Arena</h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                Live Duel
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Room: <span className="font-mono font-bold text-primary">{roomCode}</span> • Both contenders receive the exact same challenges
            </p>
          </div>
        </div>

        {/* HUD Center: Timer & Points */}
        <div className="flex items-center gap-4">
          <div className="bg-muted/60 border px-3.5 py-1.5 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center justify-center gap-1">
              <Timer className="w-3 h-3 text-primary" /> Battle Clock
            </span>
            <span className="text-base sm:text-lg font-mono font-extrabold text-foreground">
              {formatTime(elapsedMs)}
            </span>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-amber-500 flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3" /> Your Win Points
            </span>
            <span className="text-base sm:text-lg font-mono font-extrabold text-amber-500">
              {battlePoints} pts
            </span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyLink}
            className="text-xs font-semibold h-10 flex items-center gap-1.5"
            title="Share Duel Link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedLink ? "Copied" : "Copy Link"}
          </Button>

          <Link href="/leaderboard">
            <Button size="sm" variant="ghost" className="h-10 text-xs">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Exit
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Anti-Cheat & Camera Proctoring Warning Banner ────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Proctor Camera Status */}
        <div className="p-3.5 rounded-xl border bg-card flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cameraActive ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"}`}>
              {cameraActive ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">
                {cameraActive ? "Proctor Camera: Active 🟢" : "Proctor Camera: Inactive 🔴"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Camera must remain active throughout the duel
              </p>
            </div>
          </div>
          {!cameraActive && (
            <Button size="sm" onClick={startCamera} className="text-xs font-bold h-7 bg-primary">
              Enable Camera
            </Button>
          )}
        </div>

        {/* Tab Switch Protection Status */}
        <div className="p-3.5 rounded-xl border bg-card flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${strikes === 0 ? "bg-emerald-500/20 text-emerald-500" : "bg-amber-500/20 text-amber-500"}`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">
                Anti-Cheat Screen Lock: {strikes === 0 ? "Compliant 🛡️" : `Warning (${strikes} Tab Switches)`}
              </p>
              <p className="text-[11px] text-muted-foreground">
                No screen switching or tab-out permitted during rounds
              </p>
            </div>
          </div>
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${strikes === 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>
            Strikes: {strikes}/3
          </span>
        </div>
      </div>

      {/* Screen Switch Warning Modal Overlay */}
      <AnimatePresence>
        {showStrikeWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          >
            <div className="bg-card border-2 border-red-500/80 p-6 rounded-2xl max-w-md w-full shadow-2xl text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-red-500/20 text-red-500 flex items-center justify-center border border-red-500/40">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-red-500">Screen Switch Detected!</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  You switched tabs or left the battle window. Proctor rules require you to stay focused on the challenge screen.
                </p>
              </div>
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-mono font-bold text-red-400">
                Warning Strike: {strikes} of 3
              </div>
              <Button
                onClick={() => setShowStrikeWarning(false)}
                className="w-full font-bold bg-primary text-primary-foreground text-xs"
              >
                Return to Battle & Acknowledge
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Arena: Split Screen Layout ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Col: Live Camera HUD & Competitors Standings */}
        <div className="space-y-4 lg:col-span-1">
          {/* Your Camera Feed */}
          <Card className="overflow-hidden border border-border shadow-sm">
            <CardHeader className="p-3 bg-muted/40 border-b flex flex-row items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${cameraActive ? "bg-emerald-500 animate-pulse" : "bg-zinc-600"}`}></span>
                You (Challenger)
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {cameraActive ? "Camera ON" : "Camera OFF (Battle Done)"}
              </span>
            </CardHeader>
            <div className="relative bg-black h-36 flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />
              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 text-xs gap-1 p-2 text-center bg-zinc-950">
                  <CameraOff className="w-6 h-6 mb-1 text-zinc-600" />
                  <span>Proctor Camera Off</span>
                </div>
              )}
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-zinc-300 font-mono backdrop-blur-sm">
                Progress: {completionPercentage}%
              </div>
            </div>
          </Card>

          {/* Opponent Camera & Progress Feed */}
          <Card className="overflow-hidden border border-border shadow-sm">
            <CardHeader className="p-3 bg-muted/40 border-b flex flex-row items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5 text-amber-500">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                Opponent (Elena Rostova)
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">Live</span>
            </CardHeader>
            <div className="relative bg-zinc-950 h-36 flex flex-col items-center justify-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold mb-1">
                ER
              </div>
              <p className="text-xs font-bold text-zinc-300">Elena Rostova</p>
              <p className="text-[10px] text-zinc-500">AI Specialist • 14 Sessions</p>
              <div className="w-full mt-2 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all duration-500"
                  style={{ width: `${opponentProgress.percentage}%` }}
                />
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 font-mono">
                Opponent Progress: {opponentProgress.percentage}%
              </span>
            </div>
          </Card>

          {/* Round Checklist */}
          <Card className="border p-4 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              Required Test Rounds
            </h4>
            <div className="space-y-2 text-xs font-medium">
              <button
                onClick={() => setActiveStage("debugging")}
                className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition-colors ${
                  activeStage === "debugging" ? "bg-primary text-primary-foreground font-bold" : "bg-muted/40 hover:bg-muted"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Bug className="w-3.5 h-3.5" /> 1. Code Debugging
                </span>
                {debugStatus === "passed" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-[10px] opacity-70">Pending</span>
                )}
              </button>

              <button
                onClick={() => setActiveStage("mcq")}
                className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition-colors ${
                  activeStage === "mcq" ? "bg-primary text-primary-foreground font-bold" : "bg-muted/40 hover:bg-muted"
                }`}
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5" /> 2. Rapid-Fire MCQs
                </span>
                {mcqStatus === "passed" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-[10px] opacity-70">Pending</span>
                )}
              </button>

              <button
                onClick={() => setActiveStage("algorithm")}
                className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition-colors ${
                  activeStage === "algorithm" ? "bg-primary text-primary-foreground font-bold" : "bg-muted/40 hover:bg-muted"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" /> 3. Speed Algorithm
                </span>
                {algoStatus === "passed" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-[10px] opacity-70">Pending</span>
                )}
              </button>
            </div>
          </Card>
        </div>

        {/* Right Col: Active Challenge Workspace (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Ready Overlay or Active Test Arena */}
          {battleState === "ready" ? (
            <Card className="p-8 text-center space-y-6 border-2 border-primary/30 bg-gradient-to-b from-card to-primary/5">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-extrabold shadow-md">
                <Swords className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h2 className="text-2xl font-extrabold tracking-tight">Ready for the 1v1 Skill Battle?</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Both you and your opponent receive the exact same 3 challenges: Code Debugging, Technical MCQs, and Speed Algorithm.
                  First to complete all tests with camera on wins the battle round and earns +1 point!
                </p>
              </div>

              <div className="p-4 rounded-xl border bg-muted/40 max-w-sm mx-auto text-left text-xs space-y-2">
                <p className="font-bold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Battle Rules & Anti-Cheat:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 text-[11px]">
                  <li>Live camera feed required throughout round.</li>
                  <li>No tab or window switching allowed.</li>
                  <li>Instant victory triggered on passing all 3 tests.</li>
                  <li>+1 Win Point awarded to victor.</li>
                </ul>
              </div>

              <Button
                size="lg"
                onClick={handleStartBattle}
                className="font-extrabold text-sm px-8 py-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black shadow-xl"
              >
                <Zap className="w-5 h-5 mr-2" /> Start Battle Round Now
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* STAGE 1: CODE DEBUGGING */}
              {activeStage === "debugging" && (
                <Card className="border shadow-md">
                  <CardHeader className="p-4 bg-muted/30 border-b flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold flex items-center gap-2">
                        <Bug className="w-4 h-4 text-amber-500" /> Round 1: Fix the Bug in findUniqueNumbers
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        Task: The function should return numbers that appear exactly once. Fix the logic and test!
                      </CardDescription>
                    </div>
                    {debugStatus === "passed" && (
                      <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                      </span>
                    )}
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div className="rounded-xl overflow-hidden border border-zinc-800 bg-[#0d0d11]">
                      <div className="bg-zinc-900 px-4 py-2 text-[11px] text-zinc-400 font-mono border-b border-zinc-800 flex justify-between">
                        <span>buggy_code.js</span>
                        <span>JavaScript</span>
                      </div>
                      <textarea
                        value={debugCode}
                        onChange={(e) => setDebugCode(e.target.value)}
                        rows={12}
                        className="w-full bg-transparent p-4 font-mono text-xs sm:text-sm text-zinc-200 focus:outline-none resize-none leading-relaxed"
                        spellCheck={false}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Button
                        size="sm"
                        onClick={handleTestDebugging}
                        disabled={debugStatus === "running"}
                        className="font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        {debugStatus === "running" ? "Testing Fix..." : "Run & Test Debugging Fix"}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveStage("mcq")}
                        className="text-xs font-semibold"
                      >
                        Next: MCQs ➔
                      </Button>
                    </div>

                    {debugLog && (
                      <div
                        className={`p-3 rounded-xl border font-mono text-xs whitespace-pre-wrap ${
                          debugStatus === "passed"
                            ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/40"
                            : "bg-red-950/20 text-red-400 border-red-900/40"
                        }`}
                      >
                        {debugLog}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* STAGE 2: RAPID-FIRE MCQS */}
              {activeStage === "mcq" && (
                <Card className="border shadow-md">
                  <CardHeader className="p-4 bg-muted/30 border-b flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-primary" /> Round 2: Rapid-Fire Technical MCQs
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        Select the correct answer for all 3 questions. Exact same test for both contenders!
                      </CardDescription>
                    </div>
                    {mcqStatus === "passed" && (
                      <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                      </span>
                    )}
                  </CardHeader>
                  <CardContent className="p-5 space-y-6">
                    {MCQ_QUESTIONS.map((q, idx) => (
                      <div key={q.id} className="space-y-2.5 p-3.5 rounded-xl border bg-muted/20">
                        <p className="text-xs font-extrabold text-foreground">
                          {idx + 1}. {q.question}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = selectedAnswers[idx] === optIdx;
                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => setSelectedAnswers((prev) => ({ ...prev, [idx]: optIdx }))}
                                className={`text-left p-2.5 rounded-lg border text-xs transition-all font-mono ${
                                  isSelected
                                    ? "bg-primary text-primary-foreground border-primary font-bold shadow-sm"
                                    : "border-border hover:bg-muted text-muted-foreground"
                                }`}
                              >
                                <span className="font-bold mr-2 text-[10px] opacity-70">
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {mcqError && (
                      <div className="p-3 rounded-xl border bg-red-500/10 text-red-500 text-xs font-semibold">
                        {mcqError}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Button
                        size="sm"
                        onClick={handleSubmitMCQ}
                        className="font-bold text-xs bg-primary text-primary-foreground"
                      >
                        Lock In MCQ Answers
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveStage("algorithm")}
                        className="text-xs font-semibold"
                      >
                        Next: Speed Algorithm ➔
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* STAGE 3: SPEED ALGORITHM */}
              {activeStage === "algorithm" && (
                <Card className="border shadow-md">
                  <CardHeader className="p-4 bg-muted/30 border-b flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" /> Round 3: Valid Palindrome Algorithm Sprint
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        Task: Return true if the string is a palindrome (ignoring casing and punctuation).
                      </CardDescription>
                    </div>
                    {algoStatus === "passed" && (
                      <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                      </span>
                    )}
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div className="rounded-xl overflow-hidden border border-zinc-800 bg-[#0d0d11]">
                      <div className="bg-zinc-900 px-4 py-2 text-[11px] text-zinc-400 font-mono border-b border-zinc-800 flex justify-between">
                        <span>palindrome_algo.js</span>
                        <span>JavaScript</span>
                      </div>
                      <textarea
                        value={algoCode}
                        onChange={(e) => setAlgoCode(e.target.value)}
                        rows={10}
                        className="w-full bg-transparent p-4 font-mono text-xs sm:text-sm text-zinc-200 focus:outline-none resize-none leading-relaxed"
                        spellCheck={false}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Button
                        size="sm"
                        onClick={handleTestAlgorithm}
                        disabled={algoStatus === "running"}
                        className="font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        {algoStatus === "running" ? "Testing..." : "Submit Algorithm Solution"}
                      </Button>
                    </div>

                    {algoLog && (
                      <div
                        className={`p-3 rounded-xl border font-mono text-xs whitespace-pre-wrap ${
                          algoStatus === "passed"
                            ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/40"
                            : "bg-red-950/20 text-red-400 border-red-900/40"
                        }`}
                      >
                        {algoLog}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── VICTORY CELEBRATION MODAL ───────────────────────── */}
      <AnimatePresence>
        {battleState === "won" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              className="bg-card border-2 border-amber-500/80 p-8 rounded-3xl max-w-md w-full shadow-2xl text-center space-y-6"
            >
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl animate-bounce">
                <Trophy className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-500 font-extrabold">
                  Battle Concluded
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight mt-1 text-foreground">
                  VICTORY! YOU WON! 🏆
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  You completed all 3 battle test rounds first with full proctor compliance!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Elapsed Battle Time:</span>
                  <span className="font-mono font-extrabold text-foreground text-sm">
                    {formatTime(elapsedMs)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Points Earned:</span>
                  <span className="font-mono font-extrabold text-emerald-500 text-sm">
                    +1 Battle Point
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Career Win Points:</span>
                  <span className="font-mono font-extrabold text-amber-500 text-sm">
                    {battlePoints} Points
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Opponent Status:</span>
                  <span className="text-zinc-400 font-medium">Defeated (Did not finish)</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleStartBattle}
                  className="flex-1 font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs h-11"
                >
                  <RotateCcw className="w-4 h-4 mr-1.5" /> Play Rematch
                </Button>
                <Link href="/leaderboard" className="flex-1">
                  <Button variant="outline" className="w-full text-xs font-bold h-11">
                    Leaderboard Standings
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

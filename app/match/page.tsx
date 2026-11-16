"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthGuard } from "@/components/auth-guard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { saveMeeting } from "@/lib/meetings";
import {
  Users,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Star,
  PlusCircle,
  X,
  CheckCircle,
} from "lucide-react";

interface Peer {
  id: string;
  name: string;
  role: string;
  photoURL?: string;
  teaches: string[];
  learns: string[];
  rating: number;
  sessionsCount: number;
  available: boolean;
}

const DEFAULT_PEERS: Peer[] = [
  {
    id: "p1",
    name: "Elena Rostova",
    role: "Senior AI Researcher",
    photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    teaches: ["Machine Learning", "PyTorch", "LLM Fine-Tuning"],
    learns: ["Smart Contracts", "Next.js 14", "Solidity"],
    rating: 4.9,
    sessionsCount: 14,
    available: true,
  },
  {
    id: "p2",
    name: "Marcus Vance",
    role: "Full-Stack Web Architect",
    photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    teaches: ["TypeScript", "Next.js", "GraphQL", "Tailwind"],
    learns: ["Kubernetes", "DevOps", "Rust"],
    rating: 4.8,
    sessionsCount: 22,
    available: true,
  },
  {
    id: "p3",
    name: "Aria Chen",
    role: "Web3 & Protocol Engineer",
    photoURL: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    teaches: ["Solidity", "Zero-Knowledge Proofs", "EVM"],
    learns: ["Generative AI", "Prompt Engineering"],
    rating: 5.0,
    sessionsCount: 9,
    available: false,
  },
  {
    id: "p4",
    name: "Liam O'Connor",
    role: "Lead Product Designer",
    photoURL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    teaches: ["Design Systems", "Figma", "UI Animation", "UX Audits"],
    learns: ["Frontend Dev", "React Native"],
    rating: 4.9,
    sessionsCount: 17,
    available: true,
  },
];

const PEERS_STORAGE_KEY = "intellex_matched_peers_pool";

export default function MatchPage() {
  const router = useRouter();
  const [peers, setPeers] = useState<Peer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [matchedPeer, setMatchedPeer] = useState<Peer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Peer Form State
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newTeaches, setNewTeaches] = useState("");
  const [newLearns, setNewLearns] = useState("");
  const [newPhoto, setNewPhoto] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(PEERS_STORAGE_KEY);
    if (saved) {
      try {
        setPeers(JSON.parse(saved));
        return;
      } catch (e) {
        console.error(e);
      }
    }
    setPeers(DEFAULT_PEERS);
  }, []);

  const savePeersToStorage = (updated: Peer[]) => {
    setPeers(updated);
    localStorage.setItem(PEERS_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleAddPeer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRole.trim()) return;

    const newPeerObj: Peer = {
      id: `custom-${Date.now()}`,
      name: newName.trim(),
      role: newRole.trim(),
      photoURL: newPhoto.trim(),
      teaches: newTeaches
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      learns: newLearns
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean),
      rating: 5.0,
      sessionsCount: 1,
      available: true,
    };

    const updated = [newPeerObj, ...peers];
    savePeersToStorage(updated);
    setIsModalOpen(false);

    // Reset fields
    setNewName("");
    setNewRole("");
    setNewTeaches("");
    setNewLearns("");
    setNewPhoto("");
  };

  const handleInstantMatch = async (peer: Peer) => {
    // Automatically register a session on the dashboard
    await saveMeeting({
      user1: {
        name: "You (Active Learner)",
        description: `Learning ${peer.teaches[0] || "Advanced Topics"}`,
      },
      user2: {
        name: peer.name,
        description: peer.role,
        photoURL: peer.photoURL,
      },
      summary: `Matched through Intellex Peer Matcher;Exploring ${peer.teaches.join(", ")};Exchanging insights on ${peer.learns.join(", ")}`,
    });

    setMatchedPeer(peer);
  };

  const categories = ["All", "Machine Learning", "Next.js", "Solidity", "TypeScript", "Figma", "Rust"];

  const filteredPeers = peers.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.teaches.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.learns.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All" ||
      p.teaches.some((t) => t.toLowerCase().includes(selectedCategory.toLowerCase())) ||
      p.learns.some((l) => l.toLowerCase().includes(selectedCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Smart Peer Skill Matcher
          </h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-xl">
            Find peers who can teach you the skills you need in exchange for what you already know.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Add Peer Profile
          </Button>
          <Link href="/session">
            <Button variant="outline" className="flex items-center gap-2">
              Open Workspace
            </Button>
          </Link>
        </div>
      </div>

      {/* Instant Match Notification Banner */}
      {matchedPeer && (
        <div className="p-4 rounded-2xl border border-primary/30 bg-primary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm font-medium">
              You matched with <span className="font-bold">{matchedPeer.name}</span>! Session added to your Collaboration Dashboard.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button size="sm" variant="default" className="text-xs">
                View on Dashboard
              </Button>
            </Link>
            <Link href="/session">
              <Button size="sm" variant="outline" className="text-xs">
                Launch Live Room
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search by skill, name, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Peer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredPeers.map((peer) => (
          <Card
            key={peer.id}
            className="overflow-hidden border bg-card/60 backdrop-blur-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <CardHeader className="p-6 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-14 h-14 border-2 border-primary/20">
                    <AvatarImage src={peer.photoURL} alt={peer.name} />
                    <AvatarFallback className="font-bold text-sm">
                      {peer.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      {peer.name}
                      {peer.available && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" title="Available for session" />
                      )}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-0.5">
                      {peer.role}
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2 py-1 rounded-md text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{peer.rating.toFixed(1)}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 pt-0 space-y-4">
              {/* Can Teach */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5 mb-2">
                  <GraduationCap className="w-3.5 h-3.5" /> Can Teach
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {peer.teaches.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Wants to Learn */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                  <BookOpen className="w-3.5 h-3.5" /> Wants to Learn
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {peer.learns.map((skill, lIdx) => (
                    <span
                      key={lIdx}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {peer.sessionsCount} completed sessions
                </span>

                <Button
                  size="sm"
                  onClick={() => handleInstantMatch(peer)}
                  className="flex items-center gap-1.5 text-xs font-semibold shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Instant Match & Connect
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Peer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg bg-background border shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-md text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <CardHeader>
              <CardTitle className="text-xl">Add Custom Peer Profile</CardTitle>
              <CardDescription>
                Expand the matching directory with your own profile or a peer learner.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddPeer} className="space-y-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Alex Chen"
                    required
                  />
                </div>
                <div>
                  <Label>Role / Specialization *</Label>
                  <Input
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Backend Go Developer"
                    required
                  />
                </div>
                <div>
                  <Label>Skills You Can Teach (Comma-separated)</Label>
                  <Input
                    value={newTeaches}
                    onChange={(e) => setNewTeaches(e.target.value)}
                    placeholder="Go, Microservices, Docker"
                  />
                </div>
                <div>
                  <Label>Skills You Want to Learn (Comma-separated)</Label>
                  <Input
                    value={newLearns}
                    onChange={(e) => setNewLearns(e.target.value)}
                    placeholder="React, CSS Animations, UI Design"
                  />
                </div>
                <div>
                  <Label>Avatar Photo URL (Optional)</Label>
                  <Input
                    value={newPhoto}
                    onChange={(e) => setNewPhoto(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Peer</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
    </AuthGuard>
  );
}

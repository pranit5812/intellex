"use client";

import { Button } from "@/components/ui/button";
import { signInFunc } from "@/lib/sign-in-or-create";
import { SiGoogle } from "react-icons/si";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Video,
  Award,
  Sparkles,
  ArrowRight,
  Code2,
  BrainCircuit,
  ShieldCheck,
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 18,
      },
    },
  };

  const features = [
    {
      icon: Users,
      title: "Smart Peer Matching",
      description: "Match with skilled peers based on complementary learning goals and mutual domain expertise.",
    },
    {
      icon: Video,
      title: "Live Collaborative Workspace",
      description: "Interactive canvas whiteboard, shared code editor, and live notes designed for hands-on sessions.",
    },
    {
      icon: Award,
      title: "Verifiable Web3 Badges",
      description: "Earn on-chain NFT credentials via Verbwire on Polygon as proof of continuous learning.",
    },
  ];

  return (
    <>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col items-center justify-center">
        <motion.div
          className="space-y-6 flex flex-col items-center text-center max-w-3xl mx-auto"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Badge */}
          <motion.div variants={item}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Decentralized Skill Exchange</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent"
            variants={item}
          >
            Swap skills. <br />
            <span className="text-primary">Grow together in real-time.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed"
            variants={item}
          >
            Connect 1-on-1 with developers, researchers, and creators. Teach what you know,
            learn what you need, and earn verifiable on-chain certificates.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={item}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <Button
              size="lg"
              className="text-base font-semibold px-6 py-6 shadow-lg shadow-primary/20 flex items-center gap-2.5"
              onClick={() => signInFunc(router)}
            >
              <SiGoogle className="w-4 h-4" />
              Sign in with Google
            </Button>

            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-base font-semibold px-6 py-6">
                Open Dashboard <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <Link href="/match">
              <Button size="lg" variant="secondary" className="text-base font-semibold px-6 py-6">
                Find Peers
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Metrics Bar */}
        <div className="mt-16 w-full max-w-4xl p-6 rounded-2xl border bg-card/40 backdrop-blur-md grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-extrabold text-primary">100%</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Peer to Peer</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-primary">1-on-1</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Interactive Calls</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-primary">Web3</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">NFT Credentials</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-primary">Real-time</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Collaborative Tools</div>
          </div>
        </div>
      </main>
    </>
  );
}

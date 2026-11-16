"use client";

import React, { useState, useEffect } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  BookOpen,
  Code,
  Brain,
  Palette,
  Cloud,
  Database,
  ExternalLink,
  CheckCircle2,
  Search,
  GraduationCap,
  Clock,
  Star,
  ChevronRight,
  Circle,
} from "lucide-react";

/* ─── types ─────────────────────────────────────────────────────── */

interface Resource {
  name: string;
  url: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  resources: Resource[];
}

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  milestones: Milestone[];
}

const STORAGE_KEY = "intellex_course_progress";

/* ─── data ──────────────────────────────────────────────────────── */

const CATEGORIES: Category[] = [
  {
    id: "webdev",
    name: "Web Development",
    icon: Code,
    color: "text-blue-500",
    gradient: "from-blue-500/20 to-cyan-500/10",
    milestones: [
      { id: "webdev-1", title: "HTML & CSS Fundamentals", description: "Learn the building blocks of the web — semantic HTML5, CSS selectors, Flexbox, Grid, and responsive design.", difficulty: "Beginner", duration: "2-3 weeks", resources: [{ name: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Learn" }, { name: "freeCodeCamp HTML/CSS", url: "https://www.freecodecamp.org/learn/responsive-web-design/" }, { name: "CSS-Tricks Flexbox Guide", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/" }] },
      { id: "webdev-2", title: "JavaScript Essentials", description: "Master JS fundamentals: variables, functions, DOM manipulation, async/await, and ES6+ features.", difficulty: "Beginner", duration: "3-4 weeks", resources: [{ name: "JavaScript.info", url: "https://javascript.info/" }, { name: "freeCodeCamp JS", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" }, { name: "Eloquent JavaScript", url: "https://eloquentjavascript.net/" }] },
      { id: "webdev-3", title: "React Fundamentals", description: "Components, props, state, hooks, routing, and building interactive UIs with React.", difficulty: "Intermediate", duration: "3-4 weeks", resources: [{ name: "React Official Docs", url: "https://react.dev/learn" }, { name: "Scrimba React Course", url: "https://scrimba.com/learn/learnreact" }, { name: "React Tutorial — Robin Wieruch", url: "https://www.robinwieruch.de/react-hooks/" }] },
      { id: "webdev-4", title: "Next.js & Full-Stack", description: "Server components, API routes, SSR/SSG, middleware, and deploying production apps with Next.js.", difficulty: "Advanced", duration: "4-5 weeks", resources: [{ name: "Next.js Official Docs", url: "https://nextjs.org/docs" }, { name: "Next.js Learn Course", url: "https://nextjs.org/learn" }, { name: "Vercel Templates", url: "https://vercel.com/templates/next.js" }] },
    ],
  },
  {
    id: "aiml",
    name: "AI & Machine Learning",
    icon: Brain,
    color: "text-purple-500",
    gradient: "from-purple-500/20 to-pink-500/10",
    milestones: [
      { id: "aiml-1", title: "Python for Data Science", description: "Python fundamentals, NumPy, Pandas, Matplotlib — the essential toolkit for ML.", difficulty: "Beginner", duration: "2-3 weeks", resources: [{ name: "Python Official Tutorial", url: "https://docs.python.org/3/tutorial/" }, { name: "Kaggle Python Course", url: "https://www.kaggle.com/learn/python" }, { name: "NumPy Quickstart", url: "https://numpy.org/doc/stable/user/quickstart.html" }] },
      { id: "aiml-2", title: "Machine Learning Fundamentals", description: "Supervised/unsupervised learning, regression, classification, model evaluation, and scikit-learn.", difficulty: "Intermediate", duration: "4-6 weeks", resources: [{ name: "Andrew Ng ML — Coursera", url: "https://www.coursera.org/learn/machine-learning" }, { name: "Kaggle Intro to ML", url: "https://www.kaggle.com/learn/intro-to-machine-learning" }, { name: "scikit-learn Docs", url: "https://scikit-learn.org/stable/tutorial/" }] },
      { id: "aiml-3", title: "Deep Learning & Neural Networks", description: "Neural network architectures, CNNs, RNNs, transformers, and training with PyTorch/TensorFlow.", difficulty: "Advanced", duration: "6-8 weeks", resources: [{ name: "fast.ai Practical DL", url: "https://course.fast.ai/" }, { name: "Deep Learning Book", url: "https://www.deeplearningbook.org/" }, { name: "PyTorch Tutorials", url: "https://pytorch.org/tutorials/" }] },
      { id: "aiml-4", title: "NLP & Generative AI", description: "Text processing, embeddings, transformers, LLMs, prompt engineering, and fine-tuning.", difficulty: "Advanced", duration: "4-6 weeks", resources: [{ name: "Hugging Face NLP Course", url: "https://huggingface.co/learn/nlp-course" }, { name: "LangChain Docs", url: "https://python.langchain.com/docs/get_started/introduction" }, { name: "OpenAI Cookbook", url: "https://cookbook.openai.com/" }] },
    ],
  },
  {
    id: "web3",
    name: "Blockchain & Web3",
    icon: Star,
    color: "text-emerald-500",
    gradient: "from-emerald-500/20 to-teal-500/10",
    milestones: [
      { id: "web3-1", title: "Blockchain Basics", description: "Understand decentralization, consensus, wallets, transactions, and how blockchains work.", difficulty: "Beginner", duration: "1-2 weeks", resources: [{ name: "Ethereum.org Learn", url: "https://ethereum.org/en/learn/" }, { name: "Blockchain Demo", url: "https://andersbrownworth.com/blockchain/" }, { name: "Bitcoin Whitepaper", url: "https://bitcoin.org/bitcoin.pdf" }] },
      { id: "web3-2", title: "Solidity & Smart Contracts", description: "Write, compile, and deploy smart contracts on Ethereum using Solidity.", difficulty: "Intermediate", duration: "3-4 weeks", resources: [{ name: "CryptoZombies", url: "https://cryptozombies.io/" }, { name: "Solidity Docs", url: "https://docs.soliditylang.org/" }, { name: "Hardhat Getting Started", url: "https://hardhat.org/tutorial" }] },
      { id: "web3-3", title: "DApp Development", description: "Build full-stack dApps with ethers.js/web3.js, IPFS, and connect smart contracts to React frontends.", difficulty: "Advanced", duration: "4-5 weeks", resources: [{ name: "Alchemy University", url: "https://www.alchemy.com/university" }, { name: "ethers.js Docs", url: "https://docs.ethers.org/" }, { name: "The Graph Docs", url: "https://thegraph.com/docs/" }] },
      { id: "web3-4", title: "DeFi & NFTs", description: "Understand DeFi protocols, liquidity pools, token standards (ERC-20, ERC-721), and NFT marketplaces.", difficulty: "Advanced", duration: "3-4 weeks", resources: [{ name: "Finematics DeFi", url: "https://finematics.com/" }, { name: "OpenZeppelin Contracts", url: "https://docs.openzeppelin.com/contracts/" }, { name: "NFT School", url: "https://nftschool.dev/" }] },
    ],
  },
  {
    id: "design",
    name: "UI/UX Design",
    icon: Palette,
    color: "text-pink-500",
    gradient: "from-pink-500/20 to-rose-500/10",
    milestones: [
      { id: "design-1", title: "Design Principles", description: "Color theory, typography, spacing, visual hierarchy, and Gestalt principles.", difficulty: "Beginner", duration: "1-2 weeks", resources: [{ name: "Laws of UX", url: "https://lawsofux.com/" }, { name: "Google Design", url: "https://design.google/" }, { name: "Refactoring UI Tips", url: "https://www.refactoringui.com/" }] },
      { id: "design-2", title: "Figma Mastery", description: "Components, auto-layout, prototyping, design systems, and collaboration in Figma.", difficulty: "Intermediate", duration: "2-3 weeks", resources: [{ name: "Figma Learn", url: "https://help.figma.com/hc/en-us/categories/360002051613" }, { name: "Figma YouTube", url: "https://www.youtube.com/@Figma" }, { name: "Figma Community", url: "https://www.figma.com/community" }] },
      { id: "design-3", title: "Prototyping & Testing", description: "Interactive prototypes, user flows, usability testing, and iterating on designs.", difficulty: "Intermediate", duration: "2-3 weeks", resources: [{ name: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/" }, { name: "Maze Design Testing", url: "https://maze.co/guides/usability-testing/" }, { name: "UX Design Institute", url: "https://www.uxdesigninstitute.com/blog/" }] },
      { id: "design-4", title: "Design Systems", description: "Build scalable design systems with tokens, component libraries, and documentation.", difficulty: "Advanced", duration: "3-4 weeks", resources: [{ name: "Material Design 3", url: "https://m3.material.io/" }, { name: "Storybook", url: "https://storybook.js.org/" }, { name: "Design Systems Repo", url: "https://designsystemsrepo.com/" }] },
    ],
  },
  {
    id: "devops",
    name: "DevOps & Cloud",
    icon: Cloud,
    color: "text-orange-500",
    gradient: "from-orange-500/20 to-amber-500/10",
    milestones: [
      { id: "devops-1", title: "Git & GitHub", description: "Version control, branching strategies, pull requests, and collaborative workflows.", difficulty: "Beginner", duration: "1-2 weeks", resources: [{ name: "GitHub Skills", url: "https://skills.github.com/" }, { name: "Pro Git Book", url: "https://git-scm.com/book/en/v2" }, { name: "Atlassian Git Tutorials", url: "https://www.atlassian.com/git/tutorials" }] },
      { id: "devops-2", title: "Docker & Containers", description: "Containerize applications, write Dockerfiles, docker-compose, and container networking.", difficulty: "Intermediate", duration: "2-3 weeks", resources: [{ name: "Docker Getting Started", url: "https://docs.docker.com/get-started/" }, { name: "Play with Docker", url: "https://labs.play-with-docker.com/" }, { name: "Docker Curriculum", url: "https://docker-curriculum.com/" }] },
      { id: "devops-3", title: "Kubernetes", description: "Orchestrate containers with K8s: pods, services, deployments, ingress, and Helm charts.", difficulty: "Advanced", duration: "4-6 weeks", resources: [{ name: "Kubernetes Docs", url: "https://kubernetes.io/docs/tutorials/" }, { name: "KillerCoda Labs", url: "https://killercoda.com/playgrounds/scenario/kubernetes" }, { name: "Lens IDE", url: "https://k8slens.dev/" }] },
      { id: "devops-4", title: "CI/CD & Cloud (AWS)", description: "Build CI/CD pipelines with GitHub Actions, deploy to AWS/GCP, infrastructure as code.", difficulty: "Advanced", duration: "3-4 weeks", resources: [{ name: "GitHub Actions Docs", url: "https://docs.github.com/en/actions" }, { name: "AWS Free Tier", url: "https://aws.amazon.com/free/" }, { name: "Terraform Learn", url: "https://developer.hashicorp.com/terraform/tutorials" }] },
    ],
  },
  {
    id: "datasci",
    name: "Data Science",
    icon: Database,
    color: "text-cyan-500",
    gradient: "from-cyan-500/20 to-blue-500/10",
    milestones: [
      { id: "datasci-1", title: "Statistics & Probability", description: "Descriptive stats, distributions, hypothesis testing, and statistical thinking.", difficulty: "Beginner", duration: "2-3 weeks", resources: [{ name: "Khan Academy Stats", url: "https://www.khanacademy.org/math/statistics-probability" }, { name: "Seeing Theory", url: "https://seeing-theory.brown.edu/" }, { name: "StatQuest YouTube", url: "https://www.youtube.com/@statquest" }] },
      { id: "datasci-2", title: "Python & Pandas", description: "Data wrangling, cleaning, transformation, and analysis with Pandas and NumPy.", difficulty: "Intermediate", duration: "2-3 weeks", resources: [{ name: "Kaggle Pandas Course", url: "https://www.kaggle.com/learn/pandas" }, { name: "Pandas User Guide", url: "https://pandas.pydata.org/docs/user_guide/index.html" }, { name: "Real Python Pandas", url: "https://realpython.com/learning-paths/pandas-data-science/" }] },
      { id: "datasci-3", title: "Data Visualization", description: "Create compelling charts with Matplotlib, Seaborn, and Plotly. Tell stories with data.", difficulty: "Intermediate", duration: "2-3 weeks", resources: [{ name: "Kaggle Visualization", url: "https://www.kaggle.com/learn/data-visualization" }, { name: "Plotly Python Docs", url: "https://plotly.com/python/" }, { name: "Storytelling with Data", url: "https://www.storytellingwithdata.com/" }] },
      { id: "datasci-4", title: "SQL & Databases", description: "Relational databases, SQL queries, joins, aggregations, and database design.", difficulty: "Intermediate", duration: "2-3 weeks", resources: [{ name: "SQLBolt", url: "https://sqlbolt.com/" }, { name: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial/" }, { name: "Kaggle SQL", url: "https://www.kaggle.com/learn/intro-to-sql" }] },
    ],
  },
];

const DIFFICULTY_STYLES: Record<string, string> = {
  Beginner: "bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30",
  Intermediate: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  Advanced: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30",
};

/* ─── component ─────────────────────────────────────────────────── */

export default function CoursesPage() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [search, setSearch] = useState("");
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  // load progress
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProgress(JSON.parse(raw));
    } catch { /* empty */ }
  }, []);

  const toggleMilestone = (id: string) => {
    const next = { ...progress, [id]: !progress[id] };
    setProgress(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const category = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];
  const filtered = category.milestones.filter(
    (m) =>
      !search ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase())
  );

  const completedCount = category.milestones.filter((m) => progress[m.id]).length;
  const progressPct = category.milestones.length > 0 ? Math.round((completedCount / category.milestones.length) * 100) : 0;

  return (
    <AuthGuard>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Courses & Roadmaps</h1>
            <p className="text-sm text-muted-foreground">Curated learning paths with free resources</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-3 mb-6 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = cat.id === activeCategory;
            const done = cat.milestones.filter((m) => progress[m.id]).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.name}
                {done > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"}`}>
                    {done}/{cat.milestones.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search + Progress */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search milestones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-3 min-w-[200px]">
            <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-sm font-bold text-primary">{progressPct}%</span>
          </div>
        </div>

        {/* Category Header Card */}
        <Card className={`mb-8 overflow-hidden bg-gradient-to-r ${category.gradient}`}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-background/80 flex items-center justify-center ${category.color}`}>
              <category.icon className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{category.name} Roadmap</h2>
              <p className="text-sm text-muted-foreground">
                {completedCount} of {category.milestones.length} milestones completed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Milestones */}
        <div className="space-y-0">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">No milestones match your search</p>
            </div>
          ) : (
            filtered.map((milestone, idx) => {
              const isComplete = !!progress[milestone.id];
              return (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="flex gap-4"
                >
                  {/* Timeline line + dot */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => toggleMilestone(milestone.id)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        isComplete
                          ? "bg-primary border-primary text-primary-foreground scale-110"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-bold">{idx + 1}</span>
                      )}
                    </button>
                    {idx < filtered.length - 1 && (
                      <div className={`w-0.5 flex-1 min-h-[24px] ${isComplete ? "bg-primary/50" : "bg-border"}`} />
                    )}
                  </div>

                  {/* Card */}
                  <Card className={`flex-1 mb-4 transition-all ${isComplete ? "border-primary/30 bg-primary/[0.03]" : ""}`}>
                    <CardContent className="p-5">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <h3 className={`font-bold text-base ${isComplete ? "line-through opacity-60" : ""}`}>
                          {milestone.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${DIFFICULTY_STYLES[milestone.difficulty]}`}>
                            {milestone.difficulty}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {milestone.duration}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>

                      <div className="flex flex-wrap gap-2">
                        {milestone.resources.map((res) => (
                          <a
                            key={res.url}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-muted/70 hover:bg-muted text-foreground transition-colors group"
                          >
                            <ExternalLink className="w-3 h-3 text-primary group-hover:scale-110 transition-transform" />
                            {res.name}
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </AuthGuard>
  );
}

"use client";

import * as React from "react";
import { ModeToggle } from "./mode-toggle";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "@/components/auth-provider";
import { signInFunc } from "@/lib/sign-in-or-create";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SiGoogle } from "react-icons/si";
import {
  LayoutDashboard,
  Users,
  Video,
  Trophy,
  CalendarDays,
  GraduationCap,
  Swords,
  PlusCircle,
  Menu,
  X,
  LogOut,
} from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuthContext();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Calendar", href: "/calendar", icon: CalendarDays },
    { name: "Courses", href: "/courses", icon: GraduationCap },
    { name: "Find Peers", href: "/match", icon: Users },
    { name: "Live Session", href: "/session", icon: Video },
    { name: "Battle Arena", href: "/battle", icon: Swords },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Image
              src="/intellex_logo.svg"
              width={26}
              height={26}
              alt="Intellex Logo"
              className="dark:invert transition-transform group-hover:scale-105"
            />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Intellex
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Auth & Theme */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <Link href="/dashboard/create">
                <Button size="sm" variant="outline" className="flex items-center gap-1.5 text-xs font-semibold">
                  <PlusCircle className="w-3.5 h-3.5" />
                  New Meeting
                </Button>
              </Link>

              <div className="flex items-center space-x-2 border-l pl-3">
                <Avatar className="w-8 h-8 border">
                  <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                  <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                    {user.displayName?.slice(0, 2).toUpperCase() || "ME"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-semibold max-w-[100px] truncate" title={user.displayName || ""}>
                  {user.displayName?.split(" ")[0] || "Account"}
                </span>
                <button
                  onClick={handleSignOut}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => signInFunc(router)}
              className="flex items-center gap-2 text-xs font-semibold shadow-sm"
            >
              <SiGoogle className="w-3.5 h-3.5" /> Sign In
            </Button>
          )}

          <ModeToggle />
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center space-x-2">
          <ModeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-background/95 backdrop-blur-lg px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-3 py-1">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-7 h-7">
                      <AvatarImage src={user.photoURL || ""} />
                      <AvatarFallback className="text-xs">{user.displayName?.slice(0, 2) || "ME"}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-semibold">{user.displayName || user.email}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-xs text-red-500">
                    <LogOut className="w-3.5 h-3.5 mr-1" /> Sign Out
                  </Button>
                </div>
                <Link href="/dashboard/create" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full text-xs font-semibold flex items-center justify-center gap-2">
                    <PlusCircle className="w-4 h-4" />
                    Create New Meeting
                  </Button>
                </Link>
              </div>
            ) : (
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signInFunc(router);
                }}
                className="w-full text-xs font-semibold flex items-center justify-center gap-2"
              >
                <SiGoogle className="w-3.5 h-3.5" /> Sign in with Google
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

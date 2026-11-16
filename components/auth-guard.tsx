"use client";

import React from "react";
import { useAuthContext } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Lock, ArrowLeft } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInFunc } from "@/lib/sign-in-or-create";

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse font-medium">
          Checking authentication status...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-12">
        <Card className="w-full max-w-md border shadow-2xl bg-card/80 backdrop-blur-md text-center p-6">
          <CardHeader className="flex flex-col items-center pb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-extrabold">Sign In Required</CardTitle>
            <CardDescription className="text-sm max-w-sm mt-1">
              You need to sign in with your account to access collaboration sessions, peer matching, and platform features.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <Button
              size="lg"
              className="w-full font-bold flex items-center justify-center gap-2.5 shadow-md py-6 text-sm"
              onClick={() => signInFunc(router)}
            >
              <SiGoogle className="w-4 h-4" /> Sign in with Google
            </Button>

            <div>
              <Link
                href="/"
                className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors pt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return to Homepage
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

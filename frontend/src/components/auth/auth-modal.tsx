"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/auth-store";
import { Sparkles, Mail, Lock, User, ArrowRight, Loader2, ShieldCheck } from "lucide-react";

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    openAuthModal,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    resetPassword,
    error,
    setError,
  } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await loginWithGoogle();
    } catch {
      // Error handled in store
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (authModalTab === "login") {
        await loginWithEmail(email, password);
      } else if (authModalTab === "register") {
        await registerWithEmail(email, password, name);
      } else if (authModalTab === "forgot") {
        await resetPassword(email);
        setSuccessMsg("Password reset email sent. Please check your inbox.");
      }
    } catch {
      // Handled in store
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open: boolean) => !open && closeAuthModal()}>
      <DialogContent className="sm:max-w-md bg-surface/95 backdrop-blur-xl border-border shadow-2xl p-6">
        <DialogHeader className="space-y-2 text-left">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Sparkles className="w-4 h-4 text-ai-accent" />
            </div>
            <DialogTitle className="text-xl font-extrabold text-foreground tracking-tight">
              {authModalTab === "login" && "Sign In to NEXUS BI"}
              {authModalTab === "register" && "Create Cloud Workspace"}
              {authModalTab === "forgot" && "Reset Your Password"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            {authModalTab === "login" && "Access your personalized enterprise workspaces, custom datasets, and persistent reports."}
            {authModalTab === "register" && "Deploy your autonomous decision intelligence workspace backed by Firebase Cloud."}
            {authModalTab === "forgot" && "Enter your verified corporate email to receive recovery instructions."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-xs">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-lg bg-success/10 border border-success/20 text-success text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {authModalTab !== "forgot" && (
          <>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleGoogleSignIn}
              className="w-full h-10 rounded-lg border border-border bg-surface-elevated hover:bg-surface text-foreground font-semibold text-xs flex items-center justify-center gap-2.5 transition-colors shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google Workspace</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-3 text-muted-foreground text-[10px] uppercase font-mono tracking-wider">
                Or with corporate email
              </span>
              <div className="flex-grow border-t border-border"></div>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authModalTab === "register" && (
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-foreground">Full Name</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Satya Nadella"
                  className="w-full bg-surface-elevated border border-border rounded-lg pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-foreground">Corporate Email</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="leader@enterprise.com"
                className="w-full bg-surface-elevated border border-border rounded-lg pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary"
              />
            </div>
          </div>

          {authModalTab !== "forgot" && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-medium text-foreground">Password</label>
                {authModalTab === "login" && (
                  <button
                    type="button"
                    onClick={() => openAuthModal("forgot")}
                    className="text-[11px] text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-surface-elevated border border-border rounded-lg pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>
                  {authModalTab === "login" && "Sign In"}
                  {authModalTab === "register" && "Create Account"}
                  {authModalTab === "forgot" && "Send Reset Link"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-muted-foreground">
          {authModalTab === "login" ? (
            <span>
              Don&apos;t have a cloud workspace?{" "}
              <button
                type="button"
                onClick={() => openAuthModal("register")}
                className="text-primary hover:underline font-semibold"
              >
                Register
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="text-primary hover:underline font-semibold"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

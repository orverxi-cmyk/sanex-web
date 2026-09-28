
"use client";

import React from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { useUser, useDoc, useFirestore, useAuth } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  verifyPasswordResetCode,
  confirmPasswordReset
} from "firebase/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { 
  Users, 
  ShieldAlert, 
  ArrowRight, 
  Loader2, 
  LogIn, 
  Shield, 
  KeyRound, 
  Mail, 
  ClipboardList, 
  Image as ImageIcon,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useUser();
  const { auth } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  const [loginEmail, setLoginEmail] = React.useState("orverxi@gmail.com");
  const [loginPassword, setLoginPassword] = React.useState("");
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  
  const [showResetForm, setShowResetForm] = React.useState(false);
  const [resetEmail, setResetEmail] = React.useState("orverxi@gmail.com");
  const [isResetting, setIsResetting] = React.useState(false);

  // In-app password reset code handling (from email links)
  const [resetCode, setResetCode] = React.useState<string | null>(null);
  const [resetAccountEmail, setResetAccountEmail] = React.useState<string | null>(null);
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isVerifyingCode, setIsVerifyingCode] = React.useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = React.useState(false);
  const [codeError, setCodeError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined" || !auth) return;
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    const oobCode = params.get("oobCode");

    if (mode === "resetPassword" && oobCode) {
      setResetCode(oobCode);
      setIsVerifyingCode(true);
      verifyPasswordResetCode(auth, oobCode)
        .then((email) => {
          setResetAccountEmail(email);
          setIsVerifyingCode(false);
        })
        .catch((err) => {
          console.error("Invalid reset code:", err);
          setCodeError("This password reset link is invalid or has expired. Please request a new link.");
          setIsVerifyingCode(false);
        });
    }
  }, [auth]);

  const userDocRef = React.useMemo(() => (db && user ? doc(db, "users", user.uid) : null), [db, user?.uid]);
  const { data: userProfile, loading: profileLoading } = useDoc(userDocRef);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    
    setIsLoggingIn(true);
    try {
      const result = await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
      if (db) {
        try {
          const userRef = doc(db, "users", result.user.uid);
          await setDoc(userRef, {
            lastLogin: Date.now(),
          }, { merge: true });
        } catch (firestoreErr) {
          console.warn("Could not update lastLogin timestamp:", firestoreErr);
        }
      }
      toast({ title: "Welcome back", description: "Authentication successful." });
    } catch (error: any) {
      console.error("Login error:", error);
      let description = "Invalid email or password. Please try again.";
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
        description = "Invalid access key or credentials. Please check your details and try again.";
      } else if (error.code === "auth/too-many-requests") {
        description = "Access temporarily disabled due to multiple failed attempts. Please reset your password.";
      } else if (error.message) {
        description = error.message;
      }
      toast({
        variant: "destructive",
        title: "Login Error",
        description,
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setIsLoggingIn(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (db) {
        try {
          const userRef = doc(db, "users", result.user.uid);
          await setDoc(userRef, {
            lastLogin: Date.now(),
          }, { merge: true });
        } catch (e) {
          console.warn("Could not update lastLogin in Firestore:", e);
        }
      }
      toast({ title: "Welcome back", description: "Successfully authenticated with Google." });
    } catch (error: any) {
      if (error.code !== "auth/popup-closed-by-user") {
        console.error("Google sign in error:", error);
        toast({
          variant: "destructive",
          title: "Sign In Error",
          description: error.message || "Failed to sign in with Google.",
        });
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !resetEmail) return;
    
    setIsResetting(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail.trim());
      toast({
        title: "Reset Email Sent",
        description: `A password reset link has been dispatched to ${resetEmail.trim()}. Please check your Inbox and Spam/Junk folder.`,
      });
      setShowResetForm(false);
    } catch (error: any) {
      console.error("Reset error:", error);
      let description = "Failed to send reset email.";
      if (error.code === "auth/user-not-found") {
        description = "No registered account found with that email address.";
      } else if (error.message) {
        description = error.message;
      }
      toast({
        variant: "destructive",
        title: "Reset Error",
        description,
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !resetCode) return;
    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Weak Password",
        description: "Access key must be at least 6 characters long.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Mismatch",
        description: "Access keys do not match.",
      });
      return;
    }

    setIsConfirmingReset(true);
    try {
      await confirmPasswordReset(auth, resetCode, newPassword);
      toast({
        title: "Access Key Updated",
        description: "Your new password has been set. You can now sign in.",
      });
      setResetCode(null);
      if (resetAccountEmail) {
        setLoginEmail(resetAccountEmail);
      }
      setLoginPassword(newPassword);
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error: any) {
      console.error("Confirm reset error:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Failed to update access key. The link may have expired.",
      });
    } finally {
      setIsConfirmingReset(false);
    }
  };

  if (authLoading || (user && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Handle in-app password reset link landing
  if (resetCode) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-muted/30 px-4 py-8 font-arial">
          <Card className="w-full max-w-md shadow-xl border-none">
            <CardHeader className="text-center">
              <KeyRound className="mx-auto h-12 w-12 text-primary mb-2" />
              <CardTitle className="text-xl font-bold">Set New Access Key</CardTitle>
              <CardDescription className="text-[14px]">
                {isVerifyingCode ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Verifying recovery link...
                  </span>
                ) : codeError ? (
                  <span className="text-destructive font-medium">{codeError}</span>
                ) : (
                  <span>Updating password for <strong>{resetAccountEmail}</strong></span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {codeError ? (
                <div className="space-y-4">
                  <Button 
                    className="w-full h-12 bg-primary text-black font-bold uppercase tracking-widest text-[12px] rounded-full"
                    onClick={() => {
                      setResetCode(null);
                      setCodeError(null);
                      setShowResetForm(true);
                      window.history.replaceState({}, document.title, window.location.pathname);
                    }}
                  >
                    Request New Reset Link
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full h-12 font-bold uppercase tracking-widest text-[10px]"
                    onClick={() => {
                      setResetCode(null);
                      setCodeError(null);
                      window.history.replaceState({}, document.title, window.location.pathname);
                    }}
                  >
                    Back to Login
                  </Button>
                </div>
              ) : !isVerifyingCode ? (
                <form onSubmit={handleConfirmReset} className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">New Access Key / Password</Label>
                    <Input 
                      type="password" 
                      required 
                      className="h-10 text-sm" 
                      placeholder="At least 6 characters" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Confirm Access Key</Label>
                    <Input 
                      type="password" 
                      required 
                      className="h-10 text-sm" 
                      placeholder="Re-type new password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isConfirmingReset} 
                    className="w-full h-12 gap-2 bg-primary text-black font-bold uppercase tracking-widest text-[12px] rounded-full"
                  >
                    {isConfirmingReset ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Save & Sign In
                  </Button>
                </form>
              ) : null}
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-muted/30 px-4 py-8 font-arial">
          <Card className="w-full max-w-md shadow-xl border-none">
            <CardHeader className="text-center">
              {showResetForm ? <KeyRound className="mx-auto h-12 w-12 text-primary mb-2" /> : <Shield className="mx-auto h-12 w-12 text-primary mb-2" />}
              <CardTitle className="text-xl font-bold">
                {showResetForm ? "Reset Access Key" : "Admin Portal Access"}
              </CardTitle>
              <CardDescription className="text-[14px] font-normal">
                {showResetForm ? "Enter your admin email to receive a recovery link" : "Secure credentials required for operations"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showResetForm ? (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Admin Work Email</Label>
                    <Input 
                      type="email" 
                      required 
                      className="h-10 text-sm" 
                      placeholder="orverxi@gmail.com" 
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground">Access Key / Password</Label>
                      <Button 
                        type="button" 
                        variant="link" 
                        className="p-0 h-auto text-[10px] text-primary font-bold uppercase tracking-widest"
                        onClick={() => {
                          setResetEmail(loginEmail);
                          setShowResetForm(true);
                        }}
                      >
                        Forgot?
                      </Button>
                    </div>
                    <Input 
                      type="password" 
                      required 
                      className="h-10 text-sm" 
                      placeholder="••••••••" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                  <div className="pt-2 flex flex-col gap-3 w-full">
                    <Button type="submit" disabled={isLoggingIn} className="w-full h-12 gap-2 bg-primary text-black font-bold uppercase tracking-widest text-[12px] rounded-full">
                      {isLoggingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />} Sign In to Operations
                    </Button>
                    
                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-muted"></div>
                      <span className="flex-shrink mx-4 text-[10px] font-bold uppercase text-muted-foreground">OR</span>
                      <div className="flex-grow border-t border-muted"></div>
                    </div>

                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleGoogleSignIn}
                      disabled={isLoggingIn}
                      className="w-full h-11 gap-2 font-bold uppercase tracking-widest text-[11px] rounded-full hover:bg-muted"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      Sign In with Google
                    </Button>

                    <Button asChild variant="ghost" className="w-full h-10 font-bold uppercase tracking-widest text-[10px]">
                      <Link href="/">Return to Site</Link>
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Registered Admin Email</Label>
                    <Input 
                      type="email" 
                      required 
                      className="h-10 text-sm" 
                      placeholder="orverxi@gmail.com" 
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                    />
                  </div>
                  <div className="pt-2 flex flex-col gap-2 w-full">
                    <Button type="submit" disabled={isResetting} className="w-full h-12 gap-2 bg-primary text-black font-bold uppercase tracking-widest text-[12px] rounded-full">
                      {isResetting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />} Send Recovery Link
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setShowResetForm(false)} className="w-full h-10 font-bold uppercase tracking-widest text-[10px]">
                      Back to Login
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const isAuthorized = 
    userProfile?.role === "admin" || 
    (user as any)?.admin === true || 
    user?.email?.toLowerCase() === "orverxi@gmail.com" ||
    user?.email?.toLowerCase() === "sanexcompany@gmail.com";

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-muted/30 px-4 py-5 font-arial">
          <Card className="w-full max-w-md shadow-xl border-t-4 border-t-destructive border-x-0 border-b-0">
            <CardHeader className="text-center">
              <ShieldAlert className="mx-auto h-12 w-12 text-destructive mb-2" />
              <CardTitle className="text-xl font-bold">Unauthorized Access</CardTitle>
              <CardDescription className="text-sm">
                Account <strong>{user.email}</strong> does not have operational permissions.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-xs text-muted-foreground">Please request administrative status from the master admin at sanexcompany@gmail.com.</p>
              <div className="flex flex-wrap gap-x-[5px] gap-y-[20px] w-full">
                <Button asChild variant="secondary" className="flex-grow h-12 font-bold uppercase tracking-widest text-[10px]">
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-arial text-[14px]">
      <Navbar />
      <main className="flex-grow py-5 bg-muted/10">
        <div className="container mx-auto px-4 md:px-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-4">
            <div>
              <h1 className="text-3xl font-bold font-headline">Operations Center</h1>
              <p className="text-[14px] text-muted-foreground">Managing SANEX Company digital infrastructure.</p>
            </div>
            
            <Card className="bg-white border-primary/20 w-full md:w-auto shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Auth Status</div>
                  <div className="text-black font-bold text-sm">Operator: {userProfile?.displayName || user.email}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Card className="group hover:shadow-lg transition-all border-none bg-white">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <CardTitle className="text-[16px] font-bold">Service Requests</CardTitle>
                <CardDescription className="text-[12px] font-normal">Monitor and update status for all client liquid waste bookings.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-x-[5px] gap-y-[20px] w-full">
                  <Button asChild variant="outline" className="flex-grow h-10 font-bold uppercase tracking-widest text-[10px] group-hover:bg-primary group-hover:text-black transition-colors">
                    <Link href="/admin/bookings">View Bookings <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all border-none bg-white">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <CardTitle className="text-[16px] font-bold">Web Presence</CardTitle>
                <CardDescription className="text-[12px] font-normal">Update Branding, Gallery, Services, and Public Articles.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-x-[5px] gap-y-[20px] w-full">
                  <Button asChild variant="outline" className="flex-grow h-10 font-bold uppercase tracking-widest text-[10px] group-hover:bg-primary group-hover:text-black transition-colors">
                    <Link href="/admin/content">Content Manager <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all border-none bg-white">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle className="text-[16px] font-bold">Directory Access</CardTitle>
                <CardDescription className="text-[12px] font-normal">Provision new accounts and manage system roles.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-x-[5px] gap-y-[20px] w-full">
                  <Button asChild variant="outline" className="flex-grow h-10 font-bold uppercase tracking-widest text-[10px] group-hover:bg-primary group-hover:text-black transition-colors">
                    <Link href="/admin/users">Manage Users <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

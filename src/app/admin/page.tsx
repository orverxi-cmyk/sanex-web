
"use client";

import React from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { useUser, useDoc, useFirestore, useAuth, useCollection } from "@/firebase";
import { doc, setDoc, collection, updateDoc } from "firebase/firestore";
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
import { Badge } from "@/components/ui/badge";
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
  CheckCircle2,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  Phone,
  ExternalLink,
  Filter,
  ArrowUpRight,
  TrendingUp,
  BarChart3,
  Search,
  X,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ChannelAnalyticsDashboard, BookingData } from "@/components/admin/ChannelAnalyticsDashboard";

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

  const isAuthorized = 
    userProfile?.role === "admin" || 
    (user as any)?.admin === true || 
    user?.email?.toLowerCase() === "orverxi@gmail.com" ||
    user?.email?.toLowerCase() === "sanexcompany@gmail.com";

  const bookingsQuery = React.useMemo(() => {
    if (!db || !user || !isAuthorized) return null;
    return collection(db, "bookings");
  }, [db, user, isAuthorized]);

  const { data: firestoreBookings, loading: bookingsLoading } = useCollection(bookingsQuery);

  const [statusFilter, setStatusFilter] = React.useState<"all" | "pending" | "confirmed" | "completed" | "cancelled">("all");
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const statusCounts = React.useMemo(() => {
    let pending = 0;
    let confirmed = 0;
    let completed = 0;
    let cancelled = 0;
    (firestoreBookings || []).forEach((b: any) => {
      const s = (b.status || 'pending').toLowerCase();
      if (s === 'confirmed') confirmed++;
      else if (s === 'completed') completed++;
      else if (s === 'cancelled') cancelled++;
      else pending++;
    });
    return {
      all: (firestoreBookings || []).length,
      pending,
      confirmed,
      completed,
      cancelled,
    };
  }, [firestoreBookings]);

  const filteredBookings = React.useMemo(() => {
    return (firestoreBookings || []).filter((b: any) => {
      const s = (b.status || 'pending').toLowerCase();
      if (statusFilter !== 'all') {
        if (statusFilter === 'pending' && s !== 'pending') return false;
        if (statusFilter === 'confirmed' && s !== 'confirmed') return false;
        if (statusFilter === 'completed' && s !== 'completed') return false;
        if (statusFilter === 'cancelled' && s !== 'cancelled') return false;
      }
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = b.customerName?.toLowerCase().includes(term);
        const matchesEmail = b.email?.toLowerCase().includes(term);
        const matchesPhone = b.phone?.toLowerCase().includes(term);
        const matchesService = b.serviceType?.toLowerCase().includes(term);
        const matchesSource = b.referralSource?.toLowerCase().includes(term);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesService && !matchesSource) {
          return false;
        }
      }
      return true;
    }).sort((a: any, b: any) => {
      const tA = typeof a.createdAt === 'number' ? a.createdAt : new Date(a.createdAt || 0).getTime();
      const tB = typeof b.createdAt === 'number' ? b.createdAt : new Date(b.createdAt || 0).getTime();
      return tB - tA;
    });
  }, [firestoreBookings, statusFilter, searchTerm]);

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    if (!db) return;
    setUpdatingId(bookingId);
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: newStatus,
        updatedAt: Date.now()
      });
      toast({ title: "Status Updated", description: `Request marked as ${newStatus}.` });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Update Failed", description: err.message });
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status?: string) => {
    const s = (status || 'pending').toLowerCase();
    switch (s) {
      case 'confirmed':
        return <Badge className="bg-blue-500 text-white font-bold text-[10px]">Confirmed</Badge>;
      case 'completed':
        return <Badge className="bg-green-500 text-black font-bold text-[10px]">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="font-bold text-[10px]">Cancelled</Badge>;
      default:
        return <Badge className="bg-amber-100 text-amber-900 border-amber-300 font-bold text-[10px]">Pending</Badge>;
    }
  };

  const bookingsList: BookingData[] = React.useMemo(() => {
    return (firestoreBookings || []).map((b: any) => ({
      id: b.id,
      customerName: b.customerName,
      email: b.email,
      phone: b.phone,
      serviceType: b.serviceType,
      status: b.status,
      referralSource: b.referralSource,
      description: b.description,
      createdAt: b.createdAt
    }));
  }, [firestoreBookings]);

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
                Account <strong>{user?.email}</strong> does not have operational permissions.
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
      <main className="flex-grow py-8 bg-muted/10">
        <div className="container mx-auto px-4 md:px-16 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold font-headline">Operations Center</h1>
              <p className="text-[14px] text-muted-foreground">Managing SANEX Company digital infrastructure and marketing insights.</p>
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

          {/* Quick Access Operational Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="group hover:shadow-lg transition-all border-none bg-white">
              <CardHeader className="pb-3">
                <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <CardTitle className="text-[15px] font-bold">Service Requests</CardTitle>
                <CardDescription className="text-[12px] font-normal">Monitor and update client waste collection requests.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full h-9 font-bold uppercase tracking-widest text-[10px] group-hover:bg-primary group-hover:text-black transition-colors">
                  <Link href="/admin/bookings">View Bookings <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all border-none bg-white">
              <CardHeader className="pb-3">
                <div className="h-11 w-11 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-3">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <CardTitle className="text-[15px] font-bold">Channel Analytics</CardTitle>
                <CardDescription className="text-[12px] font-normal">Marketing intelligence on lead channels & conversion.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full h-9 font-bold uppercase tracking-widest text-[10px] group-hover:bg-primary group-hover:text-black transition-colors">
                  <Link href="/admin/analytics">Analytics Center <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all border-none bg-white">
              <CardHeader className="pb-3">
                <div className="h-11 w-11 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-3">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <CardTitle className="text-[15px] font-bold">Web Presence</CardTitle>
                <CardDescription className="text-[12px] font-normal">Update Branding, Gallery, Services, and Articles.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full h-9 font-bold uppercase tracking-widest text-[10px] group-hover:bg-primary group-hover:text-black transition-colors">
                  <Link href="/admin/content">Content Manager <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all border-none bg-white">
              <CardHeader className="pb-3">
                <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
                  <Users className="h-5 w-5" />
                </div>
                <CardTitle className="text-[15px] font-bold">Directory Access</CardTitle>
                <CardDescription className="text-[12px] font-normal">Provision operators and manage system roles.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full h-9 font-bold uppercase tracking-widest text-[10px] group-hover:bg-primary group-hover:text-black transition-colors">
                  <Link href="/admin/users">Manage Users <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Service Requests Pipeline with Status Filters */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <Badge className="bg-primary/20 text-black border-primary/30 font-bold uppercase text-[9px] tracking-wider">
                    Workflow Pipeline
                  </Badge>
                  <span className="text-xs text-muted-foreground">• Live Status Management</span>
                </div>
                <h2 className="text-xl font-bold font-headline text-foreground">
                  Service Requests by Status
                </h2>
              </div>
              <Button asChild variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest gap-1.5">
                <Link href={statusFilter === 'all' ? '/admin/bookings' : `/admin/bookings?status=${statusFilter}`}>
                  Open Full Bookings Manager <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>

            {/* 4 Interactive Status Filter Cards: Request (Pending), Confirmed, Completed, Canceled */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filter 1: Request (Pending) */}
              <button
                type="button"
                onClick={() => setStatusFilter(prev => prev === 'pending' ? 'all' : 'pending')}
                className={cn(
                  "text-left p-4 rounded-xl border bg-white shadow-sm transition-all relative overflow-hidden group cursor-pointer",
                  statusFilter === 'pending'
                    ? "border-amber-400 ring-2 ring-amber-400/50 bg-amber-50/40 shadow-md"
                    : "hover:border-amber-300 hover:shadow"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="h-9 w-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Clock className="h-4 w-4" />
                  </div>
                  <Badge className={cn(
                    "text-[10px] font-bold transition-colors",
                    statusFilter === 'pending' ? "bg-amber-500 text-black" : "bg-amber-100 text-amber-800 border-amber-200"
                  )}>
                    {statusFilter === 'pending' ? 'Active Filter' : 'Filter'}
                  </Badge>
                </div>
                <div className="text-2xl font-bold font-headline text-foreground">{statusCounts.pending}</div>
                <div className="text-xs font-bold text-amber-900/90 mt-0.5">Requests (Pending)</div>
                <p className="text-[11px] text-muted-foreground mt-0.5">Awaiting operator confirmation</p>
              </button>

              {/* Filter 2: Confirmed */}
              <button
                type="button"
                onClick={() => setStatusFilter(prev => prev === 'confirmed' ? 'all' : 'confirmed')}
                className={cn(
                  "text-left p-4 rounded-xl border bg-white shadow-sm transition-all relative overflow-hidden group cursor-pointer",
                  statusFilter === 'confirmed'
                    ? "border-blue-500 ring-2 ring-blue-500/50 bg-blue-50/40 shadow-md"
                    : "hover:border-blue-300 hover:shadow"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="h-9 w-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <Badge className={cn(
                    "text-[10px] font-bold transition-colors",
                    statusFilter === 'confirmed' ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-800 border-blue-200"
                  )}>
                    {statusFilter === 'confirmed' ? 'Active Filter' : 'Filter'}
                  </Badge>
                </div>
                <div className="text-2xl font-bold font-headline text-foreground">{statusCounts.confirmed}</div>
                <div className="text-xs font-bold text-blue-900/90 mt-0.5">Confirmed</div>
                <p className="text-[11px] text-muted-foreground mt-0.5">Scheduled for collection</p>
              </button>

              {/* Filter 3: Completed */}
              <button
                type="button"
                onClick={() => setStatusFilter(prev => prev === 'completed' ? 'all' : 'completed')}
                className={cn(
                  "text-left p-4 rounded-xl border bg-white shadow-sm transition-all relative overflow-hidden group cursor-pointer",
                  statusFilter === 'completed'
                    ? "border-emerald-500 ring-2 ring-emerald-500/50 bg-emerald-50/40 shadow-md"
                    : "hover:border-emerald-300 hover:shadow"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <Badge className={cn(
                    "text-[10px] font-bold transition-colors",
                    statusFilter === 'completed' ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-800 border-emerald-200"
                  )}>
                    {statusFilter === 'completed' ? 'Active Filter' : 'Filter'}
                  </Badge>
                </div>
                <div className="text-2xl font-bold font-headline text-foreground">{statusCounts.completed}</div>
                <div className="text-xs font-bold text-emerald-900/90 mt-0.5">Completed</div>
                <p className="text-[11px] text-muted-foreground mt-0.5">Fulfilled service operations</p>
              </button>

              {/* Filter 4: Canceled */}
              <button
                type="button"
                onClick={() => setStatusFilter(prev => prev === 'cancelled' ? 'all' : 'cancelled')}
                className={cn(
                  "text-left p-4 rounded-xl border bg-white shadow-sm transition-all relative overflow-hidden group cursor-pointer",
                  statusFilter === 'cancelled'
                    ? "border-rose-400 ring-2 ring-rose-400/50 bg-rose-50/40 shadow-md"
                    : "hover:border-rose-300 hover:shadow"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="h-9 w-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                    <XCircle className="h-4 w-4" />
                  </div>
                  <Badge className={cn(
                    "text-[10px] font-bold transition-colors",
                    statusFilter === 'cancelled' ? "bg-rose-500 text-white" : "bg-rose-100 text-rose-800 border-rose-200"
                  )}>
                    {statusFilter === 'cancelled' ? 'Active Filter' : 'Filter'}
                  </Badge>
                </div>
                <div className="text-2xl font-bold font-headline text-foreground">{statusCounts.cancelled}</div>
                <div className="text-xs font-bold text-rose-900/90 mt-0.5">Canceled</div>
                <p className="text-[11px] text-muted-foreground mt-0.5">Declined or withdrawn</p>
              </button>
            </div>

            {/* Filter Toolbar + Request List Container */}
            <Card className="border bg-white shadow-sm overflow-hidden">
              <CardHeader className="pb-3 border-b bg-muted/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Status Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground mr-1 shrink-0 flex items-center gap-1">
                      <Filter className="h-3 w-3" /> Filter:
                    </span>
                    {[
                      { key: "all", label: `All (${statusCounts.all})` },
                      { key: "pending", label: `Requests (${statusCounts.pending})` },
                      { key: "confirmed", label: `Confirmed (${statusCounts.confirmed})` },
                      { key: "completed", label: `Completed (${statusCounts.completed})` },
                      { key: "cancelled", label: `Canceled (${statusCounts.cancelled})` }
                    ].map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => setStatusFilter(tab.key as any)}
                        className={cn(
                          "px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0",
                          statusFilter === tab.key 
                            ? "bg-primary text-black shadow-sm" 
                            : "bg-white text-muted-foreground border hover:text-foreground"
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Search Input */}
                  <div className="relative flex-grow max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 h-8 text-xs bg-white"
                    />
                    {searchTerm && (
                      <button 
                        onClick={() => setSearchTerm("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {bookingsLoading && filteredBookings.length === 0 ? (
                  <div className="py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="mt-2 text-xs text-muted-foreground">Loading service requests...</p>
                  </div>
                ) : filteredBookings.length > 0 ? (
                  <div className="divide-y divide-border">
                    {filteredBookings.slice(0, 5).map((booking: any) => (
                      <div key={booking.id} className="p-4 hover:bg-muted/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(booking.status)}
                            {booking.referralSource && (
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                                Via {booking.referralSource}
                              </span>
                            )}
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "Recent"}
                            </span>
                          </div>
                          <div className="font-bold text-sm text-foreground flex items-center gap-2">
                            {booking.customerName}
                            <span className="text-xs font-normal text-muted-foreground">
                              • {booking.serviceType}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            {booking.email && (
                              <span className="flex items-center gap-1"><Mail className="h-3 w-3 text-primary" /> {booking.email}</span>
                            )}
                            {booking.phone && (
                              <span className="flex items-center gap-1"><Phone className="h-3 w-3 text-primary" /> {booking.phone}</span>
                            )}
                            {booking.appointmentDate && (
                              <span className="text-black font-semibold bg-muted px-2 py-0.5 rounded text-[11px]">
                                Appt: {booking.appointmentDate} {booking.preferredTime ? `(${booking.preferredTime})` : ''}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status Quick Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {(!booking.status || booking.status === 'pending') && (
                            <Button
                              size="sm"
                              className="h-8 text-xs font-bold gap-1.5 bg-primary text-black hover:bg-primary/90"
                              onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                              disabled={updatingId === booking.id}
                            >
                              {updatingId === booking.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Clock className="h-3.5 w-3.5" />}
                              Confirm
                            </Button>
                          )}
                          {booking.status === 'confirmed' && (
                            <Button
                              size="sm"
                              className="h-8 text-xs font-bold gap-1.5 bg-green-500 hover:bg-green-600 text-black"
                              onClick={() => handleUpdateStatus(booking.id, 'completed')}
                              disabled={updatingId === booking.id}
                            >
                              {updatingId === booking.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                              Complete
                            </Button>
                          )}
                          {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 text-xs font-bold text-destructive hover:bg-destructive/10"
                              onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                              disabled={updatingId === booking.id}
                            >
                              Cancel
                            </Button>
                          )}
                          {(booking.status === 'completed' || booking.status === 'cancelled') && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs font-bold text-muted-foreground"
                              onClick={() => handleUpdateStatus(booking.id, 'pending')}
                              disabled={updatingId === booking.id}
                            >
                              Reset
                            </Button>
                          )}
                          <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-primary hover:bg-primary/10">
                            <Link href={`/admin/bookings?status=${booking.status || 'pending'}`}>
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}

                    {filteredBookings.length > 5 && (
                      <div className="p-3 text-center bg-muted/20">
                        <Button asChild variant="link" size="sm" className="text-xs font-bold uppercase tracking-wider text-primary">
                          <Link href={statusFilter === 'all' ? '/admin/bookings' : `/admin/bookings?status=${statusFilter}`}>
                            View all {filteredBookings.length} {statusFilter === 'all' ? '' : statusFilter} requests in Bookings Hub <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-center p-4">
                    <ClipboardList className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-2" />
                    <p className="text-sm font-bold text-foreground">
                      No {statusFilter === 'all' ? '' : statusFilter} requests found
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {statusFilter !== 'all' ? `No bookings currently marked as ${statusFilter}.` : 'No incoming requests have been placed yet.'}
                    </p>
                    {statusFilter !== 'all' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStatusFilter('all')}
                        className="mt-3 h-7 text-xs font-bold"
                      >
                        Show All Requests
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Embedded Real-Time Marketing Channel Performance Dashboard */}
          <div className="pt-2">
            <ChannelAnalyticsDashboard 
              bookings={bookingsList} 
              isRefreshing={bookingsLoading}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


"use client";

import React from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { useUser, useDoc, useFirestore, useAuth } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { 
  Users, 
  LayoutDashboard, 
  Image as ImageIcon, 
  ShieldAlert, 
  ArrowRight,
  Loader2,
  LogIn,
  ClipboardList,
  Shield,
  Key
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useUser();
  const { auth } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const { data: userProfile, loading: profileLoading } = useDoc(
    db && user ? doc(db, "users", user.uid) : null
  );

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;
    
    setIsLoggingIn(true);
    try {
      const result = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      const userRef = doc(db, "users", result.user.uid);
      await setDoc(userRef, {
        lastLogin: Date.now(),
      }, { merge: true });
      toast({ title: "Welcome back", description: "Authentication successful." });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "Invalid email or password. Please try again.",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-muted/30 px-4 py-5 font-arial">
          <Card className="w-full max-w-md shadow-xl border-none">
            <CardHeader className="text-center">
              <Shield className="mx-auto h-12 w-12 text-primary mb-2" />
              <CardTitle className="text-xl font-bold">Admin Portal Access</CardTitle>
              <CardDescription className="text-[14px] font-normal">Secure credentials required for entry</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Work Email</Label>
                  <Input 
                    type="email" 
                    required 
                    className="h-10 text-sm" 
                    placeholder="admin@sanex.rw" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Access Key / Password</Label>
                  <Input 
                    type="password" 
                    required 
                    className="h-10 text-sm" 
                    placeholder="••••••••" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <div className="pt-2 flex flex-wrap gap-x-[5px] gap-y-[20px] w-full">
                  <Button type="submit" disabled={isLoggingIn} className="flex-grow h-12 gap-2 bg-primary text-black font-bold uppercase tracking-widest text-[12px] rounded-full">
                    {isLoggingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />} Sign In to Operations
                  </Button>
                </div>
              </form>
              <div className="mt-4 flex flex-wrap gap-x-[5px] gap-y-[20px] w-full">
                <Button asChild variant="ghost" className="flex-grow h-12 font-bold uppercase tracking-widest text-[10px]">
                  <Link href="/">Return to Site</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const isAuthorized = userProfile?.role === "admin";

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
                  <div className="text-black font-bold text-sm">Operator: {userProfile.displayName || user.email}</div>
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

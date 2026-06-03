
"use client";

import React from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { useUser, useDoc, useFirestore, useFunctions, useAuth } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useUser();
  const { auth } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  const { data: userProfile, loading: profileLoading } = useDoc(
    db && user ? doc(db, "users", user.uid) : null
  );

  const handleSignIn = async () => {
    if (!auth || !db) return;
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userRef = doc(db, "users", result.user.uid);
      await setDoc(userRef, {
        email: result.user.email,
        displayName: result.user.displayName,
        lastLogin: Date.now(),
      }, { merge: true });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Error",
        description: error.message,
      });
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
              <LayoutDashboard className="mx-auto h-12 w-12 text-primary mb-2" />
              <CardTitle className="text-xl font-bold">Admin Portal Access</CardTitle>
              <CardDescription className="text-sm">Secure sign-in for SANEX authorized personnel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-center text-muted-foreground mb-4">
                Please sign in with your authorized organizational account to manage site operations.
              </p>
              <Button onClick={handleSignIn} className="w-full h-12 gap-2 bg-primary text-black font-bold uppercase tracking-widest text-[12px] rounded-full">
                <LogIn className="h-4 w-4" /> Sign In with Google
              </Button>
              <Button asChild variant="ghost" className="w-full h-12 font-bold uppercase tracking-widest text-[10px]">
                <Link href="/">Return to Site</Link>
              </Button>
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
                Account <strong>{user.email}</strong> does not have administrative permissions.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-xs text-muted-foreground">If you believe this is an error, please contact the master administrator at sanexcompany@gmail.com.</p>
              <Button asChild variant="secondary" className="w-full h-12 font-bold uppercase tracking-widest text-[10px]">
                <Link href="/">Back to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-arial">
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
                  <div className="text-black font-bold text-sm">Administrator: {userProfile.displayName || user.email}</div>
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
                <CardDescription className="text-[12px]">Monitor and update status for all client liquid waste bookings.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full h-10 font-bold uppercase tracking-widest text-[10px] group-hover:bg-primary group-hover:text-black transition-colors">
                  <Link href="/admin/bookings">View Bookings <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all border-none bg-white">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <CardTitle className="text-[16px] font-bold">Web Presence</CardTitle>
                <CardDescription className="text-[12px]">Update Branding, Gallery, Services, and Public Articles.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full h-10 font-bold uppercase tracking-widest text-[10px] group-hover:bg-primary group-hover:text-black transition-colors">
                  <Link href="/admin/content">Content Manager <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all border-none bg-white">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle className="text-[16px] font-bold">Directory Access</CardTitle>
                <CardDescription className="text-[12px]">Provision new accounts and manage system roles.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full h-10 font-bold uppercase tracking-widest text-[10px] group-hover:bg-primary group-hover:text-black transition-colors">
                  <Link href="/admin/users">Manage Users <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

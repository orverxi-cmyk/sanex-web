
"use client";

import React from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { useUser, useDoc, useFirestore, useFunctions, useAuth } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Users, 
  LayoutDashboard, 
  Image as ImageIcon, 
  ShieldAlert, 
  ShieldCheck,
  ArrowRight,
  Loader2,
  LogIn,
  ClipboardList,
  Database,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useUser();
  const { auth } = useAuth();
  const db = useFirestore();
  const functions = useFunctions();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSeeding, setIsSeeding] = React.useState(false);

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

  const handleBootstrap = async () => {
    if (!user || !functions) return;
    setIsSubmitting(true);
    try {
      const bootstrapFunc = httpsCallable(functions, 'adminBootstrapMaster');
      await bootstrapFunc({});
      toast({ title: "Success", description: "Master Admin initialized securely." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSeedData = async () => {
    if (!functions) return;
    setIsSeeding(true);
    try {
      const seedFunc = httpsCallable(functions, 'adminSeedInitialData');
      await seedFunc({});
      toast({ title: "System Seeded", description: "Initial front-end content has been loaded into Firestore." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Seeding Failed", description: err.message });
    } finally {
      setIsSeeding(false);
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
        <main className="flex-grow flex items-center justify-center bg-muted/30 px-4">
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="text-center">
              <LayoutDashboard className="mx-auto h-12 w-12 text-primary mb-2" />
              <CardTitle>Admin Access</CardTitle>
              <CardDescription>Secure login required for SANEX dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-center text-muted-foreground mb-4">
                Please sign in with an authorized account to access administrative tools.
              </p>
              <Button onClick={handleSignIn} className="w-full gap-2">
                <LogIn className="h-4 w-4" /> Sign In with Google
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/">Back to Home</Link>
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
        <main className="flex-grow flex items-center justify-center bg-muted/30 px-4">
          <Card className="w-full max-w-md shadow-xl border-t-4 border-t-destructive">
            <CardHeader className="text-center">
              <ShieldAlert className="mx-auto h-12 w-12 text-destructive mb-2" />
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                Account <strong>{user.email}</strong> is not an authorized administrator.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">If you are the master administrator, you can initialize your account securely.</p>
              <Button onClick={handleBootstrap} variant="secondary" className="w-full gap-2" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} Bootstrap Master Admin
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user.displayName}. Control center is active.</p>
            </div>
            
            <Card className="bg-primary/5 border-primary/20 w-full md:w-auto">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">System Status</div>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary font-bold"
                    onClick={handleSeedData}
                    disabled={isSeeding}
                  >
                    {isSeeding ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <CheckCircle className="h-3 w-3 mr-2" />}
                    Seed Initial Content
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all border-l-4 border-l-primary">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <CardTitle>Service Requests</CardTitle>
                <CardDescription>Review and manage customer bookings and service statuses.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-white">
                  <Link href="/admin/bookings">Manage Bookings <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all border-l-4 border-l-secondary">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>Update gallery photos and site highlights via server-side logic.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full group-hover:bg-secondary group-hover:text-white">
                  <Link href="/admin/content">Manage Content <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all border-l-4 border-l-accent">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Secure role promotion using Cloud Functions and Custom Claims.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full group-hover:bg-accent group-hover:text-white">
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

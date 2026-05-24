
"use client";

import React from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { useUser, useDoc, useFirestore, useFunctions } from "@/firebase";
import { doc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Users, 
  LayoutDashboard, 
  Settings, 
  Image as ImageIcon, 
  ShieldAlert, 
  ShieldCheck,
  ArrowRight,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const functions = useFunctions();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { data: userProfile, loading: profileLoading } = useDoc(
    db && user ? doc(db, "users", user.uid) : null
  );

  const handleBootstrap = async () => {
    if (!user || !functions) return;
    setIsSubmitting(true);
    try {
      const bootstrapFunc = httpsCallable(functions, 'adminBootstrapMaster');
      await bootstrapFunc({});
      toast({ title: "Success", description: "Master Admin initialized securely via Cloud Function." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsSubmitting(false);
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
            <CardContent>
              <p className="text-sm text-center text-muted-foreground mb-6">
                Please sign in with an authorized account to access administrative tools.
              </p>
              <Button asChild className="w-full">
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
          <div className="mb-10">
            <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.displayName}. System is online.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all border-l-4 border-l-primary">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Secure role promotion using Cloud Functions and Custom Claims.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-white">
                  <Link href="/admin/users">Manage Users <ArrowRight className="ml-2 h-4 w-4" /></Link>
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
                  <Settings className="h-6 w-6" />
                </div>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure global site configurations through secure endpoints.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full group-hover:bg-accent group-hover:text-white">
                  <Link href="/admin/content">Manage Settings <ArrowRight className="ml-2 h-4 w-4" /></Link>
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

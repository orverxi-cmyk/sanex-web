
"use client";

import React from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { useAuth, useCollection, useDoc, useFirestore, useUser } from "@/firebase";
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  setDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Plus, 
  Trash2, 
  Video, 
  Image as ImageIcon, 
  LogOut, 
  LogIn,
  Save,
  Pencil,
  LayoutDashboard,
  ShieldAlert,
  Users,
  Settings,
  UserCheck,
  UserX,
  ShieldCheck
} from "lucide-react";
import Image from "next/image";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { bootstrapMasterAdmin, updateUserRole } from "@/app/actions/admin";

export default function AdminPage() {
  const { user, loading: authLoading } = useUser();
  const { auth } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  const [photoUrl, setPhotoUrl] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [videoUrl, setVideoUrl] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // Firestore Queries
  const galleryQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, "gallery"), orderBy("createdAt", "desc"));
  }, [db]);

  const usersQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, "users"), orderBy("lastLogin", "desc"));
  }, [db]);

  const { data: photos } = useCollection(galleryQuery);
  const { data: registeredUsers } = useCollection(usersQuery);
  const { data: settings } = useDoc(db ? doc(db, "settings", "general") : null);
  const { data: userProfile, loading: profileLoading } = useDoc(db && user ? doc(db, "users", user.uid) : null);

  const handleBootstrap = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await bootstrapMasterAdmin(user.uid, user.email!, user.displayName || "Admin");
      toast({ title: "Success", description: "Master Admin initialized successfully." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleRole = async (targetUser: any) => {
    if (!user) return;
    const newRole = targetUser.role === "admin" ? "user" : "admin";
    try {
      await updateUserRole(user.uid, targetUser.id, newRole);
      toast({ title: "Updated", description: `User role changed to ${newRole}.` });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Action Failed", description: err.message });
    }
  };

  React.useEffect(() => {
    if (settings?.heroVideoUrl) setVideoUrl(settings.heroVideoUrl);
  }, [settings]);

  const handleLogin = () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const handleLogout = () => {
    if (!auth) return;
    signOut(auth);
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !photoUrl || !description) return;
    setIsSubmitting(true);
    
    if (editingId) {
      const docRef = doc(db, "gallery", editingId);
      const data = { imageUrl: photoUrl, description, updatedAt: serverTimestamp() };
      setDoc(docRef, data, { merge: true })
        .then(() => {
          setEditingId(null);
          setPhotoUrl("");
          setDescription("");
        })
        .catch(async (err) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: docRef.path,
            operation: 'update',
            requestResourceData: data,
          }));
        })
        .finally(() => setIsSubmitting(false));
    } else {
      const colRef = collection(db, "gallery");
      const data = { imageUrl: photoUrl, description, createdAt: Date.now() };
      addDoc(colRef, data)
        .then(() => {
          setPhotoUrl("");
          setDescription("");
        })
        .catch(async (err) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: colRef.path,
            operation: 'create',
            requestResourceData: data,
          }));
        })
        .finally(() => setIsSubmitting(false));
    }
  };

  const handleDelete = (id: string) => {
    if (!db || !confirm("Are you sure?")) return;
    const docRef = doc(db, "gallery", id);
    deleteDoc(docRef)
      .catch(async (err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete',
        }));
      });
  };

  const handleUpdateVideo = () => {
    if (!db || !videoUrl) return;
    setIsSubmitting(true);
    const docRef = doc(db, "settings", "general");
    const data = { heroVideoUrl: videoUrl };
    setDoc(docRef, data, { merge: true })
      .catch(async (err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: data,
        }));
      })
      .finally(() => setIsSubmitting(false));
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
              <CardDescription>Secure login for SANEX dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleLogin} className="w-full gap-2">
                <LogIn className="h-4 w-4" /> Sign in with Google
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
              <p className="text-sm text-muted-foreground">If you are the owner, use the bootstrap option below if available.</p>
              <Button onClick={handleBootstrap} variant="secondary" className="w-full gap-2" disabled={isSubmitting}>
                <ShieldCheck className="h-4 w-4" /> Try Bootstrap Master Admin
              </Button>
              <Button onClick={handleLogout} variant="outline" className="w-full">Sign Out</Button>
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
              <h1 className="text-3xl font-bold font-headline">Admin Control Center</h1>
              <p className="text-muted-foreground">Logged in as {user.displayName} (Administrator)</p>
            </div>
            <Button variant="destructive" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>

          <Tabs defaultValue="content" className="space-y-6">
            <TabsList className="bg-white border w-full lg:w-auto p-1 h-auto flex flex-wrap lg:inline-flex">
              <TabsTrigger value="content" className="flex-1 lg:flex-none gap-2 px-6 py-2.5">
                <ImageIcon className="h-4 w-4" /> Content
              </TabsTrigger>
              <TabsTrigger value="users" className="flex-1 lg:flex-none gap-2 px-6 py-2.5">
                <Users className="h-4 w-4" /> User Management
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1 lg:flex-none gap-2 px-6 py-2.5">
                <Settings className="h-4 w-4" /> Site Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 shadow-sm h-fit">
                  <CardHeader>
                    <CardTitle className="text-lg">Add Gallery Photo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddPhoto} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Image URL</Label>
                        <Input 
                          placeholder="https://..." 
                          value={photoUrl}
                          onChange={(e) => setPhotoUrl(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input 
                          placeholder="Short caption..." 
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {editingId ? "Update Photo" : "Add Photo"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2 shadow-sm">
                  <CardHeader><CardTitle className="text-lg">Gallery Preview</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {photos?.map((photo) => (
                        <div key={photo.id} className="flex gap-4 p-3 border rounded-lg items-center bg-white">
                          <div className="relative h-12 w-12 rounded overflow-hidden flex-shrink-0">
                            <Image src={photo.imageUrl} alt="" fill className="object-cover" />
                          </div>
                          <div className="flex-grow">
                            <p className="font-bold text-sm">{photo.description}</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(photo.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Role Management</CardTitle>
                  <CardDescription>Change user roles. This is protected by server-side verification.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left">User</th>
                          <th className="px-4 py-3 text-left">Role</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {registeredUsers?.map((u) => (
                          <tr key={u.id}>
                            <td className="px-4 py-3">
                              <div className="font-medium">{u.displayName}</div>
                              <div className="text-xs text-muted-foreground">{u.email}</div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                u.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                              }`}>
                                {u.role || "user"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleToggleRole(u)}
                                disabled={u.isMaster}
                              >
                                {u.role === "admin" ? <><UserX className="h-3 w-3 mr-1" /> Demote</> : <><UserCheck className="h-3 w-3 mr-1" /> Promote</>}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="max-w-xl shadow-sm">
                <CardHeader><CardTitle className="text-lg">Homepage Video</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>YouTube Embed URL</Label>
                    <Input 
                      placeholder="https://www.youtube.com/embed/..." 
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleUpdateVideo} className="w-full gap-2" disabled={isSubmitting}>
                    <Save className="h-4 w-4" /> Save Video URL
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}

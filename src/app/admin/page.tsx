
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
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  UserX
} from "lucide-react";
import Image from "next/image";

const BOOTSTRAP_ADMIN = "orverxi@gmail.com";

export default function AdminPage() {
  const { user, loading: authLoading } = useUser();
  const { auth } = useAuth();
  const db = useFirestore();

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

  const { data: photos, loading: photosLoading } = useCollection(galleryQuery);
  const { data: registeredUsers, loading: usersLoading } = useCollection(usersQuery);
  const { data: settings } = useDoc(db ? doc(db, "settings", "general") : null);
  const { data: userProfile, loading: profileLoading } = useDoc(db && user ? doc(db, "users", user.uid) : null);

  // Sync user profile and check role
  React.useEffect(() => {
    if (db && user) {
      const userRef = doc(db, "users", user.uid);
      setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        lastLogin: Date.now(),
        // Initial admin gets the role automatically if they are the bootstrap email
        ...(user.email === BOOTSTRAP_ADMIN ? { role: "admin" } : {})
      }, { merge: true });
    }
  }, [db, user]);

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

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !photoUrl || !description) return;
    setIsSubmitting(true);
    
    try {
      if (editingId) {
        await setDoc(doc(db, "gallery", editingId), {
          imageUrl: photoUrl,
          description,
          updatedAt: serverTimestamp(),
        }, { merge: true });
        setEditingId(null);
      } else {
        await addDoc(collection(db, "gallery"), {
          imageUrl: photoUrl,
          description,
          createdAt: Date.now(),
        });
      }
      setPhotoUrl("");
      setDescription("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (photo: any) => {
    setEditingId(photo.id);
    setPhotoUrl(photo.imageUrl);
    setDescription(photo.description);
  };

  const handleDelete = async (id: string) => {
    if (!db || !confirm("Are you sure?")) return;
    await deleteDoc(doc(db, "gallery", id));
  };

  const handleUpdateVideo = async () => {
    if (!db || !videoUrl) return;
    setIsSubmitting(true);
    try {
      await setDoc(doc(db, "settings", "general"), {
        heroVideoUrl: videoUrl
      }, { merge: true });
      alert("Video updated successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleUserRole = async (targetUser: any) => {
    if (!db) return;
    const newRole = targetUser.role === "admin" ? "user" : "admin";
    if (targetUser.email === BOOTSTRAP_ADMIN && newRole === "user") {
      alert("Bootstrap admin role cannot be removed.");
      return;
    }
    await updateDoc(doc(db, "users", targetUser.id), { role: newRole });
  };

  const isAuthorized = user?.email === BOOTSTRAP_ADMIN || userProfile?.role === "admin";

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
              <p className="text-sm text-muted-foreground">Please contact the system administrator to request access.</p>
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
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold font-headline">Admin Control Center</h1>
              <p className="text-muted-foreground">Logged in as {user.displayName} ({userProfile?.role || "Bootstrap Admin"})</p>
            </div>
            <Button variant="destructive" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>

          <Tabs defaultValue="content" className="space-y-6">
            <TabsList className="bg-white border w-full lg:w-auto p-1 h-auto flex flex-wrap lg:inline-flex">
              <TabsTrigger value="content" className="flex-1 lg:flex-none gap-2 px-6 py-2.5">
                <ImageIcon className="h-4 w-4" /> Content Management
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
                    <CardTitle className="text-lg flex items-center gap-2">
                      {editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      {editingId ? "Edit Photo" : "Add Gallery Photo"}
                    </CardTitle>
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
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1" disabled={isSubmitting}>
                          {editingId ? "Update" : "Add Photo"}
                        </Button>
                        {editingId && (
                          <Button variant="outline" onClick={() => {setEditingId(null); setPhotoUrl(""); setDescription("");}}>
                            Cancel
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Gallery Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {photos?.map((photo) => (
                        <div key={photo.id} className="flex gap-4 p-3 border rounded-lg items-center bg-white">
                          <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
                            <Image src={photo.imageUrl} alt="" fill className="object-cover" />
                          </div>
                          <div className="flex-grow">
                            <p className="font-bold text-sm">{photo.description}</p>
                            <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">{photo.imageUrl}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(photo)}>
                              <Pencil className="h-4 w-4 text-primary" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(photo.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
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
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" /> Authorized Personnel
                  </CardTitle>
                  <CardDescription>Grant or revoke admin permissions for users who have logged in.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3 text-left">User</th>
                          <th className="px-4 py-3 text-left">Role</th>
                          <th className="px-4 py-3 text-left">Last Active</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {registeredUsers?.map((u) => (
                          <tr key={u.id} className="hover:bg-muted/30">
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
                            <td className="px-4 py-3 text-xs text-muted-foreground">
                              {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "N/A"}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button 
                                variant={u.role === "admin" ? "outline" : "default"} 
                                size="sm" 
                                className="h-8 gap-2"
                                onClick={() => toggleUserRole(u)}
                                disabled={u.email === BOOTSTRAP_ADMIN}
                              >
                                {u.role === "admin" ? (
                                  <><UserX className="h-3 w-3" /> Demote</>
                                ) : (
                                  <><UserCheck className="h-3 w-3" /> Promote</>
                                )}
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
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Video className="h-4 w-4" /> Global Video Highlight
                  </CardTitle>
                </CardHeader>
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
                  {videoUrl && (
                    <div className="aspect-video mt-4 rounded-lg overflow-hidden border">
                      <iframe src={videoUrl} className="w-full h-full" allowFullScreen></iframe>
                    </div>
                  )}
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

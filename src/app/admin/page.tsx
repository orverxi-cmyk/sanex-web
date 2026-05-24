
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
  LayoutDashboard
} from "lucide-react";
import Image from "next/image";

export default function AdminPage() {
  const { user, loading: authLoading } = useUser();
  const { auth } = useAuth();
  const db = useFirestore();

  const [photoUrl, setPhotoUrl] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [videoUrl, setVideoUrl] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const galleryQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, "gallery"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: photos, loading: photosLoading } = useCollection(galleryQuery);
  const { data: settings } = useDoc(db ? doc(db, "settings", "general") : null);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  if (authLoading) {
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
          <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                <LayoutDashboard className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-headline">Admin Access</CardTitle>
              <CardDescription>Secure login for SANEX Content Management</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleLogin} className="w-full gap-3 h-12 text-lg">
                <LogIn className="h-5 w-5" /> Sign in with Google
              </Button>
              <p className="mt-6 text-xs text-center text-muted-foreground">
                Authorized personnel only. Access is monitored and recorded.
              </p>
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
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold font-headline tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user.displayName}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2 border-destructive text-destructive hover:bg-destructive hover:text-white">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Gallery Management */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    {editingId ? <Pencil className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
                    {editingId ? "Edit Photo Information" : "Add New Gallery Photo"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddPhoto} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="photoUrl">Image URL</Label>
                      <Input 
                        id="photoUrl"
                        placeholder="https://images.unsplash.com/..." 
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="desc">Photo Description</Label>
                      <Input 
                        id="desc"
                        placeholder="e.g. SANEX truck servicing a school in Musanze" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" className="flex-1 gap-2 h-11" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin" /> : editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        {editingId ? "Update Entry" : "Add to Gallery"}
                      </Button>
                      {editingId && (
                        <Button variant="outline" className="h-11" onClick={() => { setEditingId(null); setPhotoUrl(""); setDescription(""); }}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <ImageIcon className="h-5 w-5 text-primary" /> Current Gallery ({photos?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {photosLoading ? (
                    <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>
                  ) : (
                    <div className="grid gap-4">
                      {photos && photos.length > 0 ? (
                        photos.map((photo) => (
                          <div key={photo.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-xl bg-white hover:border-primary/50 transition-all shadow-sm">
                            <div className="relative h-24 w-full sm:w-32 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                              <Image src={photo.imageUrl} alt="" fill className="object-cover" />
                            </div>
                            <div className="flex-grow space-y-1">
                              <p className="font-bold text-lg leading-tight">{photo.description}</p>
                              <p className="text-xs text-muted-foreground break-all">{photo.imageUrl}</p>
                            </div>
                            <div className="flex sm:flex-col gap-2 justify-end sm:justify-start">
                              <Button variant="ghost" size="icon" className="h-10 w-10 text-primary bg-primary/5 hover:bg-primary hover:text-white" onClick={() => handleEdit(photo)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-10 w-10 text-destructive bg-destructive/5 hover:bg-destructive hover:text-white" onClick={() => handleDelete(photo.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-muted-foreground italic">
                          No photos in the gallery yet. Add one above!
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Settings Management */}
            <div className="space-y-8">
              <Card className="shadow-sm border-l-4 border-l-secondary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Video className="h-5 w-5 text-secondary" /> Highlight Video
                  </CardTitle>
                  <CardDescription>Update the main operational video on the homepage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="vidUrl">YouTube Embed URL</Label>
                    <Input 
                      id="vidUrl"
                      placeholder="https://www.youtube.com/embed/..." 
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="h-11"
                    />
                    <p className="text-[10px] text-muted-foreground bg-muted p-2 rounded">
                      Ensure you use the <strong>Embed</strong> URL format (e.g., https://www.youtube.com/embed/VIDEO_ID)
                    </p>
                  </div>
                  <Button onClick={handleUpdateVideo} className="w-full gap-2 h-11 bg-secondary hover:bg-secondary/90" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Save className="h-4 w-4" />} Update Global Video
                  </Button>

                  {videoUrl && (
                    <div className="mt-4 aspect-video rounded-xl overflow-hidden bg-black border-2 border-secondary/20 shadow-inner">
                      <iframe 
                        src={videoUrl} 
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-primary text-primary-foreground shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center text-sm border-b border-white/20 pb-2">
                    <span>Database Connection</span>
                    <span className="flex items-center gap-1 font-bold"><span className="h-2 w-2 rounded-full bg-green-400"></span> Active</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/20 pb-2">
                    <span>Auth Service</span>
                    <span className="flex items-center gap-1 font-bold"><span className="h-2 w-2 rounded-full bg-green-400"></span> Active</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Admin User</span>
                    <span className="font-bold truncate max-w-[120px]">{user.email}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


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
  Pencil
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
      alert("Video updated!");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-muted/30">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Admin Access</CardTitle>
              <CardDescription>Sign in with your corporate account to manage content</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleLogin} className="w-full gap-2 h-12">
                <LogIn className="h-5 w-5" /> Sign in with Google
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
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Gallery Management */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" /> {editingId ? "Edit Photo" : "Add New Photo"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddPhoto} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input 
                        placeholder="https://example.com/photo.jpg" 
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input 
                        placeholder="e.g. Vacuum truck operation in Kigali" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1 gap-2" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin" /> : editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        {editingId ? "Update Photo" : "Add to Gallery"}
                      </Button>
                      {editingId && (
                        <Button variant="outline" onClick={() => { setEditingId(null); setPhotoUrl(""); setDescription(""); }}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" /> Gallery Inventory
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {photosLoading ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                  ) : (
                    <div className="space-y-4">
                      {photos?.map((photo) => (
                        <div key={photo.id} className="flex gap-4 p-4 border rounded-xl bg-white hover:border-primary/50 transition-colors">
                          <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={photo.imageUrl} alt="" fill className="object-cover" />
                          </div>
                          <div className="flex-grow">
                            <p className="font-medium line-clamp-1">{photo.description}</p>
                            <p className="text-xs text-muted-foreground truncate">{photo.imageUrl}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => handleEdit(photo)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(photo.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Video Management */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" /> Homepage Highlight Video
                  </CardTitle>
                  <CardDescription>Update the video showcased on the landing page</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Video Embed URL</Label>
                    <Input 
                      placeholder="YouTube/Vimeo Embed URL" 
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />
                    <p className="text-[10px] text-muted-foreground italic">
                      Use the "Embed" URL (e.g., https://www.youtube.com/embed/VIDEO_ID)
                    </p>
                  </div>
                  <Button onClick={handleUpdateVideo} className="w-full gap-2" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Save className="h-4 w-4" />} Update Video
                  </Button>

                  {videoUrl && (
                    <div className="mt-4 aspect-video rounded-lg overflow-hidden bg-black border">
                      <iframe src={videoUrl} className="w-full h-full"></iframe>
                    </div>
                  )}
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

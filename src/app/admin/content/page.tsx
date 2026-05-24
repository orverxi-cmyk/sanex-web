
"use client";

import React from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { useUser, useDoc, useFirestore, useCollection } from "@/firebase";
import { doc, collection, query, orderBy, setDoc, addDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { 
  ChevronLeft, 
  ImageIcon, 
  Video, 
  Plus, 
  Trash2, 
  Pencil, 
  Save, 
  Loader2, 
  ShieldAlert,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function ContentManagementPage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [photoUrl, setPhotoUrl] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [videoUrl, setVideoUrl] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { data: userProfile, loading: profileLoading } = useDoc(
    db && user ? doc(db, "users", user.uid) : null
  );

  const galleryQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, "gallery"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: photos, loading: photosLoading } = useCollection(galleryQuery);
  const { data: settings } = useDoc(db ? doc(db, "settings", "general") : null);

  React.useEffect(() => {
    if (settings?.heroVideoUrl) setVideoUrl(settings.heroVideoUrl);
  }, [settings]);

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
          toast({ title: "Updated", description: "Gallery item updated successfully." });
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
          toast({ title: "Added", description: "New photo added to gallery." });
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

  const handleEdit = (photo: any) => {
    setEditingId(photo.id);
    setPhotoUrl(photo.imageUrl);
    setDescription(photo.description);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (!db || !confirm("Are you sure you want to delete this photo?")) return;
    const docRef = doc(db, "gallery", id);
    deleteDoc(docRef)
      .then(() => {
        toast({ title: "Deleted", description: "Photo removed from gallery." });
      })
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
      .then(() => {
        toast({ title: "Saved", description: "Homepage video highlight updated." });
      })
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

  const isAuthorized = userProfile?.role === "admin";

  if (!user || !isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4">
          <Card className="w-full max-w-md text-center py-12">
            <ShieldAlert className="mx-auto h-12 w-12 text-destructive mb-4" />
            <CardTitle>Unauthorized Access</CardTitle>
            <p className="mt-2 text-muted-foreground">You do not have permission to view this page.</p>
            <Button asChild className="mt-6">
              <Link href="/admin">Return to Dashboard</Link>
            </Button>
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
          <Button asChild variant="ghost" className="mb-6 -ml-2">
            <Link href="/admin"><ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
          </Button>
          
          <h1 className="text-3xl font-bold font-headline mb-10 flex items-center gap-3">
            <Globe className="h-8 w-8 text-primary" /> Content Management
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1 space-y-8">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" /> 
                    {editingId ? "Edit Photo" : "Add Gallery Photo"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddPhoto} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input 
                        placeholder="https://images.unsplash.com/..." 
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input 
                        placeholder="Short descriptive caption" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1" disabled={isSubmitting}>
                        {editingId ? "Update Item" : "Add to Gallery"}
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

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-secondary">
                    <Video className="h-5 w-5" /> Homepage Highlight
                  </CardTitle>
                  <CardDescription>Update the cinematic video on the landing page.</CardDescription>
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
                  <Button onClick={handleUpdateVideo} variant="secondary" className="w-full gap-2" disabled={isSubmitting}>
                    <Save className="h-4 w-4" /> Save Highlight URL
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-sm h-full">
                <CardHeader className="border-b bg-white/50 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Gallery Items</CardTitle>
                    <CardDescription>Manage your visual portfolio</CardDescription>
                  </div>
                  <Badge variant="secondary" className="h-6">
                    {photos?.length || 0} Total Items
                  </Badge>
                </CardHeader>
                <CardContent className="p-6">
                  {photosLoading ? (
                    <div className="py-20 text-center">
                      <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
                    </div>
                  ) : photos && photos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {photos.map((photo) => (
                        <div key={photo.id} className="group relative rounded-xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition-all">
                          <div className="relative h-48 w-full">
                            <Image src={photo.imageUrl} alt="" fill className="object-cover" />
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleEdit(photo)}>
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(photo.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="p-4">
                            <p className="text-sm font-medium line-clamp-2">{photo.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 opacity-50">
                      <ImageIcon className="h-12 w-12 mx-auto mb-4" />
                      <p>Your gallery is empty. Add your first photo to get started.</p>
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

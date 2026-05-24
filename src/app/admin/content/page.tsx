
"use client";

import React from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { useUser, useDoc, useFirestore, useCollection, useFunctions } from "@/firebase";
import { doc, collection, query, orderBy } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
  Globe,
  Layout,
  Type,
  List,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function ContentManagementPage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const functions = useFunctions();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Firestore Data
  const { data: userProfile, loading: profileLoading } = useDoc(
    db && user ? doc(db, "users", user.uid) : null
  );

  const { data: heroData } = useDoc(db ? doc(db, "settings", "hero") : null);
  const { data: servicesData } = useDoc(db ? doc(db, "settings", "services") : null);
  const { data: videoData } = useDoc(db ? doc(db, "settings", "video") : null);

  const galleryQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, "gallery"), orderBy("createdAt", "desc"));
  }, [db]);
  const { data: photos, loading: photosLoading } = useCollection(galleryQuery);

  const handleUpdateSection = async (sectionId: string, content: any) => {
    if (!functions) return;
    setIsSubmitting(true);
    try {
      const updateFunc = httpsCallable(functions, 'adminUpdateSiteSection');
      await updateFunc({ sectionId, content });
      toast({ title: "Saved", description: `${sectionId} updated successfully.` });
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
          
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
              <Layout className="h-8 w-8 text-primary" /> Site Content Manager
            </h1>
            {isSubmitting && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
          </div>

          <Tabs defaultValue="hero" className="space-y-8">
            <TabsList className="bg-white border p-1 h-auto flex-wrap justify-start gap-2">
              <TabsTrigger value="hero" className="gap-2"><Sparkles className="h-4 w-4" /> Hero Section</TabsTrigger>
              <TabsTrigger value="services" className="gap-2"><List className="h-4 w-4" /> Services</TabsTrigger>
              <TabsTrigger value="video" className="gap-2"><Video className="h-4 w-4" /> Video</TabsTrigger>
              <TabsTrigger value="gallery" className="gap-2"><ImageIcon className="h-4 w-4" /> Gallery</TabsTrigger>
            </TabsList>

            {/* HERO SECTION */}
            <TabsContent value="hero">
              <HeroEditor initialData={heroData} onSave={(data) => handleUpdateSection('hero', data)} />
            </TabsContent>

            {/* SERVICES SECTION */}
            <TabsContent value="services">
              <ServicesEditor initialData={servicesData} onSave={(data) => handleUpdateSection('services', data)} />
            </TabsContent>

            {/* VIDEO SECTION */}
            <TabsContent value="video">
              <VideoEditor initialData={videoData} onSave={(data) => handleUpdateSection('video', data)} />
            </TabsContent>

            {/* GALLERY SECTION */}
            <TabsContent value="gallery">
              <GalleryManager photos={photos} loading={photosLoading} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function HeroEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = React.useState(initialData || {});

  React.useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Hero Section</CardTitle>
        <CardDescription>Main top section of your homepage.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Badge Text</Label>
              <Input value={formData.badge || ""} onChange={e => setFormData({...formData, badge: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Title (Main)</Label>
              <Input value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Title Accent (Colored)</Label>
              <Input value={formData.titleAccent || ""} onChange={e => setFormData({...formData, titleAccent: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={formData.imageUrl || ""} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <Button type="submit" className="gap-2"><Save className="h-4 w-4" /> Update Hero</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ServicesEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = React.useState(initialData || { items: [] });

  React.useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...(formData.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Services Section</CardTitle>
        <CardDescription>Configure the 4 main service blocks.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Section Subtitle</Label>
            <Input value={formData.subtitle || ""} onChange={e => setFormData({...formData, subtitle: e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(formData.items || []).map((item: any, i: number) => (
            <Card key={i} className="bg-muted/30">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Service Item #{i + 1}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Title</Label>
                  <Input value={item.title || ""} onChange={e => updateItem(i, 'title', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Description</Label>
                  <Textarea className="h-20" value={item.description || ""} onChange={e => updateItem(i, 'description', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Image URL</Label>
                  <Input value={item.imageUrl || ""} onChange={e => updateItem(i, 'imageUrl', e.target.value)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button onClick={() => onSave(formData)} className="gap-2"><Save className="h-4 w-4" /> Save Services</Button>
      </CardContent>
    </Card>
  );
}

function VideoEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = React.useState(initialData || {});

  React.useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Video Highlight</CardTitle>
        <CardDescription>Featured YouTube video on the homepage.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>
        <div className="space-y-2">
          <Label>YouTube Embed URL</Label>
          <Input placeholder="https://www.youtube.com/embed/..." value={formData.videoUrl || ""} onChange={e => setFormData({...formData, videoUrl: e.target.value})} />
        </div>
        <Button onClick={() => onSave(formData)} className="gap-2"><Save className="h-4 w-4" /> Save Video</Button>
      </CardContent>
    </Card>
  );
}

function GalleryManager({ photos, loading }: { photos: any, loading: boolean }) {
  const functions = useFunctions();
  const { toast } = useToast();
  const [photoUrl, setPhotoUrl] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!functions || !photoUrl) return;
    setIsSubmitting(true);
    try {
      const addFunc = httpsCallable(functions, 'adminAddGalleryItem');
      await addFunc({ imageUrl: photoUrl, description });
      setPhotoUrl(""); setDescription("");
      toast({ title: "Success", description: "Gallery item added." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!functions || !confirm("Delete this photo?")) return;
    try {
      const delFunc = httpsCallable(functions, 'adminDeleteGalleryItem');
      await delFunc({ id });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1 h-fit">
        <CardHeader>
          <CardTitle>Add to Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Caption</Label>
              <Input value={description} onChange={e => setDescription(e.target.value)} required />
            </div>
            <Button className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Photo"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Existing Photos</CardTitle>
          <Badge variant="outline">{photos?.length || 0}</Badge>
        </CardHeader>
        <CardContent>
          {loading ? <Loader2 className="h-8 w-8 animate-spin mx-auto" /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {photos?.map((p: any) => (
                <div key={p.id} className="group relative rounded-lg overflow-hidden border">
                  <div className="relative h-40 w-full">
                    <Image src={p.imageUrl} alt="" fill className="object-cover" />
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(p.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-3 text-sm truncate">{p.description}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

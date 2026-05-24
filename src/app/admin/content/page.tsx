
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
  Save, 
  Loader2, 
  ShieldAlert,
  Layout,
  Sparkles,
  List,
  Target,
  Globe,
  Milestone
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
  const { data: highlightsData } = useDoc(db ? doc(db, "settings", "highlights") : null);
  const { data: impactData } = useDoc(db ? doc(db, "settings", "impact") : null);
  const { data: milestonesData } = useDoc(db ? doc(db, "settings", "milestones") : null);
  const { data: regionalData } = useDoc(db ? doc(db, "settings", "regional") : null);

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
      toast({ title: "Saved", description: `${sectionId} section updated successfully.` });
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
            <div className="overflow-x-auto pb-2">
              <TabsList className="bg-white border p-1 h-auto flex-nowrap justify-start gap-2 min-w-max">
                <TabsTrigger value="hero" className="gap-2"><Sparkles className="h-4 w-4" /> Hero</TabsTrigger>
                <TabsTrigger value="highlights" className="gap-2"><Target className="h-4 w-4" /> Highlights</TabsTrigger>
                <TabsTrigger value="services" className="gap-2"><List className="h-4 w-4" /> Services</TabsTrigger>
                <TabsTrigger value="impact" className="gap-2"><Sparkles className="h-4 w-4" /> Impact</TabsTrigger>
                <TabsTrigger value="milestones" className="gap-2"><Milestone className="h-4 w-4" /> Milestones</TabsTrigger>
                <TabsTrigger value="regional" className="gap-2"><Globe className="h-4 w-4" /> Regional</TabsTrigger>
                <TabsTrigger value="video" className="gap-2"><Video className="h-4 w-4" /> Video</TabsTrigger>
                <TabsTrigger value="gallery" className="gap-2"><ImageIcon className="h-4 w-4" /> Gallery</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="hero">
              <HeroEditor initialData={heroData} onSave={(data) => handleUpdateSection('hero', data)} />
            </TabsContent>

            <TabsContent value="highlights">
              <HighlightsEditor initialData={highlightsData} onSave={(data) => handleUpdateSection('highlights', data)} />
            </TabsContent>

            <TabsContent value="services">
              <ServicesEditor initialData={servicesData} onSave={(data) => handleUpdateSection('services', data)} />
            </TabsContent>

            <TabsContent value="impact">
              <ImpactEditor initialData={impactData} onSave={(data) => handleUpdateSection('impact', data)} />
            </TabsContent>

            <TabsContent value="milestones">
              <MilestonesEditor initialData={milestonesData} onSave={(data) => handleUpdateSection('milestones', data)} />
            </TabsContent>

            <TabsContent value="regional">
              <RegionalEditor initialData={regionalData} onSave={(data) => handleUpdateSection('regional', data)} />
            </TabsContent>

            <TabsContent value="video">
              <VideoEditor initialData={videoData} onSave={(data) => handleUpdateSection('video', data)} />
            </TabsContent>

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
        <CardTitle>Hero Section</CardTitle>
        <CardDescription>Main headline and top imagery.</CardDescription>
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
          <Button type="submit" className="gap-2"><Save className="h-4 w-4" /> Save Hero</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function HighlightsEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [items, setItems] = React.useState<any[]>(initialData?.items || []);

  React.useEffect(() => {
    if (initialData?.items) setItems(initialData.items);
  }, [initialData]);

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { icon: "shield", title: "", description: "" }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Highlights Section</CardTitle>
          <CardDescription>Key features shown below the hero.</CardDescription>
        </div>
        <Button size="sm" onClick={addItem} className="gap-2"><Plus className="h-4 w-4" /> Add Item</Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <Card key={i} className="p-4 space-y-3 bg-muted/20">
              <div className="flex justify-between">
                <Label className="text-xs font-bold">Highlight #{i + 1}</Label>
                <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => removeItem(i)}><Trash2 className="h-3 w-3" /></Button>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">Icon (Lucide name)</Label>
                <Input value={item.icon || ""} onChange={e => updateItem(i, 'icon', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">Title</Label>
                <Input value={item.title || ""} onChange={e => updateItem(i, 'title', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">Description</Label>
                <Textarea value={item.description || ""} onChange={e => updateItem(i, 'description', e.target.value)} className="h-20" />
              </div>
            </Card>
          ))}
        </div>
        <Button onClick={() => onSave({ items })} className="gap-2"><Save className="h-4 w-4" /> Save Highlights</Button>
      </CardContent>
    </Card>
  );
}

function ServicesEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = React.useState(initialData || { title: "", subtitle: "", items: [] });

  React.useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...(formData.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => setFormData({ ...formData, items: [...(formData.items || []), { title: "", description: "", icon: "truck", imageUrl: "" }] });
  const removeItem = (index: number) => setFormData({ ...formData, items: formData.items.filter((_:any, i:number) => i !== index) });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Services Section</CardTitle>
          <CardDescription>Main service blocks.</CardDescription>
        </div>
        <Button size="sm" onClick={addItem} className="gap-2"><Plus className="h-4 w-4" /> Add Service</Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Card key={i} className="bg-muted/30 p-4 space-y-3">
              <div className="flex justify-between">
                <Label className="text-xs">Service Item #{i + 1}</Label>
                <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => removeItem(i)}><Trash2 className="h-3 w-3" /></Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Title</Label>
                  <Input value={item.title || ""} onChange={e => updateItem(i, 'title', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Icon</Label>
                  <Input value={item.icon || ""} onChange={e => updateItem(i, 'icon', e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Description</Label>
                <Textarea value={item.description || ""} onChange={e => updateItem(i, 'description', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Image URL</Label>
                <Input value={item.imageUrl || ""} onChange={e => updateItem(i, 'imageUrl', e.target.value)} />
              </div>
            </Card>
          ))}
        </div>
        <Button onClick={() => onSave(formData)} className="gap-2"><Save className="h-4 w-4" /> Save Services</Button>
      </CardContent>
    </Card>
  );
}

function ImpactEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = React.useState(initialData || { title: "", subtitle: "", items: [] });

  React.useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...(formData.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => setFormData({ ...formData, items: [...(formData.items || []), { title: "", icon: "leaf", points: [""] }] });
  const removeItem = (index: number) => setFormData({ ...formData, items: formData.items.filter((_:any, i:number) => i !== index) });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Impact Stats</CardTitle>
          <CardDescription>Environmental and community impact data.</CardDescription>
        </div>
        <Button size="sm" onClick={addItem} className="gap-2"><Plus className="h-4 w-4" /> Add Impact Area</Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Section Subtitle</Label>
            <Textarea value={formData.subtitle || ""} onChange={e => setFormData({...formData, subtitle: e.target.value})} />
          </div>
        </div>

        <div className="space-y-4">
          {(formData.items || []).map((item: any, i: number) => (
            <Card key={i} className="p-4 bg-muted/20">
              <div className="flex justify-between mb-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-primary">Impact Area #{i + 1}</Label>
                <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => removeItem(i)}><Trash2 className="h-3 w-3" /></Button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="space-y-1">
                  <Label className="text-xs">Title</Label>
                  <Input value={item.title || ""} onChange={e => updateItem(i, 'title', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Icon</Label>
                  <Input value={item.icon || ""} onChange={e => updateItem(i, 'icon', e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Bullet Points (JSON array format or newline separated)</Label>
                <Textarea 
                  value={item.points?.join("\n") || ""} 
                  onChange={e => updateItem(i, 'points', e.target.value.split("\n"))} 
                  placeholder="Point 1&#10;Point 2"
                  className="h-24"
                />
              </div>
            </Card>
          ))}
        </div>
        <Button onClick={() => onSave(formData)} className="gap-2"><Save className="h-4 w-4" /> Save Impact Content</Button>
      </CardContent>
    </Card>
  );
}

function MilestonesEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = React.useState(initialData || { title: "", description: "", items: [] });

  React.useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...(formData.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => setFormData({ ...formData, items: [...(formData.items || []), { year: "2024", title: "", description: "", icon: "rocket" }] });
  const removeItem = (index: number) => setFormData({ ...formData, items: formData.items.filter((_:any, i:number) => i !== index) });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Milestone Timeline</CardTitle>
          <CardDescription>Historical and future milestones.</CardDescription>
        </div>
        <Button size="sm" onClick={addItem} className="gap-2"><Plus className="h-4 w-4" /> Add Milestone</Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Introduction Text</Label>
            <Textarea value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
        </div>

        <div className="space-y-4">
          {(formData.items || []).map((item: any, i: number) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-lg bg-muted/10 relative">
              <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-6 w-6 text-destructive" onClick={() => removeItem(i)}><Trash2 className="h-3 w-3" /></Button>
              <div className="md:col-span-2 space-y-1">
                <Label className="text-xs">Year</Label>
                <Input value={item.year || ""} onChange={e => updateItem(i, 'year', e.target.value)} />
              </div>
              <div className="md:col-span-3 space-y-1">
                <Label className="text-xs">Title</Label>
                <Input value={item.title || ""} onChange={e => updateItem(i, 'title', e.target.value)} />
              </div>
              <div className="md:col-span-2 space-y-1">
                <Label className="text-xs">Icon</Label>
                <Input value={item.icon || ""} onChange={e => updateItem(i, 'icon', e.target.value)} />
              </div>
              <div className="md:col-span-5 space-y-1">
                <Label className="text-xs">Description</Label>
                <Textarea value={item.description || ""} onChange={e => updateItem(i, 'description', e.target.value)} className="h-16" />
              </div>
            </div>
          ))}
        </div>
        <Button onClick={() => onSave(formData)} className="gap-2"><Save className="h-4 w-4" /> Save Milestones</Button>
      </CardContent>
    </Card>
  );
}

function RegionalEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = React.useState(initialData || { title: "", description: "", items: [] });

  React.useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...(formData.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => setFormData({ ...formData, items: [...(formData.items || []), { name: "", status: "", capacity: "" }] });
  const removeItem = (index: number) => setFormData({ ...formData, items: formData.items.filter((_:any, i:number) => i !== index) });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Regional Availability</CardTitle>
          <CardDescription>Locations where SANEX operates.</CardDescription>
        </div>
        <Button size="sm" onClick={addItem} className="gap-2"><Plus className="h-4 w-4" /> Add Region</Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Portal Title</Label>
            <Input value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Portal Description</Label>
            <Textarea value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(formData.items || []).map((item: any, i: number) => (
            <Card key={i} className="p-4 space-y-3 bg-muted/20 relative">
              <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-6 w-6 text-destructive" onClick={() => removeItem(i)}><Trash2 className="h-3 w-3" /></Button>
              <div className="space-y-1">
                <Label className="text-[10px]">Location Name</Label>
                <Input value={item.name || ""} onChange={e => updateItem(i, 'name', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">Status (e.g. Operational)</Label>
                <Input value={item.status || ""} onChange={e => updateItem(i, 'status', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">Capacity (e.g. Full Fleet)</Label>
                <Input value={item.capacity || ""} onChange={e => updateItem(i, 'capacity', e.target.value)} />
              </div>
            </Card>
          ))}
        </div>
        <Button onClick={() => onSave(formData)} className="gap-2"><Save className="h-4 w-4" /> Save Regional Portal</Button>
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
        <CardTitle>Video Highlight</CardTitle>
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

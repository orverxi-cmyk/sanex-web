
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
import { MediaPicker } from "@/components/MediaPicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Milestone,
  RefreshCw,
  Settings,
  Mail,
  Phone,
  Layers,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function ContentManagementPage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const functions = useFunctions();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { data: userProfile, loading: profileLoading } = useDoc(
    db && user ? doc(db, "users", user.uid) : null
  );

  const { data: generalData } = useDoc(db ? doc(db, "settings", "general") : null);
  const { data: heroData } = useDoc(db ? doc(db, "settings", "hero") : null);
  const { data: sliderData } = useDoc(db ? doc(db, "settings", "slider") : null);
  const { data: servicesData } = useDoc(db ? doc(db, "settings", "services") : null);
  const { data: videoData } = useDoc(db ? doc(db, "settings", "video") : null);
  const { data: highlightsData } = useDoc(db ? doc(db, "settings", "highlights") : null);
  const { data: impactData } = useDoc(db ? doc(db, "settings", "impact") : null);
  const { data: regionalData } = useDoc(db ? doc(db, "settings", "regional") : null);

  const galleryQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, "gallery"), orderBy("createdAt", "desc"));
  }, [db]);
  const { data: photos, loading: photosLoading } = useCollection(galleryQuery);

  const articlesQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, "articles"), orderBy("createdAt", "desc"));
  }, [db]);
  const { data: articles, loading: articlesLoading } = useCollection(articlesQuery);

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
            <div>
              <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
                <Layout className="h-8 w-8 text-primary" /> Site Content Manager
              </h1>
              <p className="text-muted-foreground">Update branding, pages, and case studies.</p>
            </div>
          </div>

          <Tabs defaultValue="general" className="space-y-8">
            <div className="overflow-x-auto pb-2">
              <TabsList className="bg-white border p-1 h-auto flex-nowrap justify-start gap-2 min-w-max">
                <TabsTrigger value="general" className="gap-2"><Settings className="h-4 w-4" /> Branding</TabsTrigger>
                <TabsTrigger value="articles" className="gap-2"><FileText className="h-4 w-4" /> Articles</TabsTrigger>
                <TabsTrigger value="slider" className="gap-2"><Layers className="h-4 w-4" /> Slider</TabsTrigger>
                <TabsTrigger value="hero" className="gap-2"><Sparkles className="h-4 w-4" /> Hero</TabsTrigger>
                <TabsTrigger value="services" className="gap-2"><List className="h-4 w-4" /> Services</TabsTrigger>
                <TabsTrigger value="impact" className="gap-2"><RefreshCw className="h-4 w-4" /> Impact UI</TabsTrigger>
                <TabsTrigger value="regional" className="gap-2"><Globe className="h-4 w-4" /> Regional</TabsTrigger>
                <TabsTrigger value="gallery" className="gap-2"><ImageIcon className="h-4 w-4" /> Gallery</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="general">
              <GeneralEditor initialData={generalData} onSave={(data) => handleUpdateSection('general', data)} />
            </TabsContent>

            <TabsContent value="articles">
              <ArticleManager articles={articles} loading={articlesLoading} />
            </TabsContent>

            <TabsContent value="slider">
              <SliderEditor initialData={sliderData} onSave={(data) => handleUpdateSection('slider', data)} />
            </TabsContent>

            <TabsContent value="hero">
              <HeroEditor initialData={heroData} onSave={(data) => handleUpdateSection('hero', data)} />
            </TabsContent>

            <TabsContent value="services">
              <ServicesEditor initialData={servicesData} onSave={(data) => handleUpdateSection('services', data)} />
            </TabsContent>

            <TabsContent value="impact">
              <ImpactEditor initialData={impactData} onSave={(data) => handleUpdateSection('impact', data)} />
            </TabsContent>

            <TabsContent value="regional">
              <RegionalEditor initialData={regionalData} onSave={(data) => handleUpdateSection('regional', data)} />
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

function ArticleManager({ articles, loading }: { articles: any, loading: boolean }) {
  const functions = useFunctions();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    title: "", excerpt: "", content: "", imageUrl: "", category: "Impact", author: "SANEX Team"
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!functions) return;
    try {
      if (isEditing) {
        const updateFunc = httpsCallable(functions, 'adminUpdateArticle');
        await updateFunc({ id: isEditing, ...formData });
        toast({ title: "Updated", description: "Article saved successfully." });
      } else {
        const addFunc = httpsCallable(functions, 'adminAddArticle');
        await addFunc(formData);
        toast({ title: "Created", description: "Article published." });
      }
      setIsEditing(null);
      setFormData({ title: "", excerpt: "", content: "", imageUrl: "", category: "Impact", author: "SANEX Team" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  const handleEdit = (article: any) => {
    setIsEditing(article.id);
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      imageUrl: article.imageUrl,
      category: article.category,
      author: article.author
    });
  };

  const handleDelete = async (id: string) => {
    if (!functions || !confirm("Delete this article?")) return;
    try {
      const delFunc = httpsCallable(functions, 'adminDeleteArticle');
      await delFunc({ id });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1 h-fit">
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Article" : "New Article"}</CardTitle>
          <CardDescription>Create impact stories and case studies.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Content (Full Details)</Label>
              <Textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="min-h-[200px]" required />
            </div>
            <MediaPicker label="Featured Image" value={formData.imageUrl} onChange={url => setFormData({...formData, imageUrl: url})} />
            <div className="flex gap-2">
              <Button type="submit" className="flex-grow">{isEditing ? "Save Changes" : "Publish Article"}</Button>
              {isEditing && <Button type="button" variant="outline" onClick={() => setIsEditing(null)}>Cancel</Button>}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Existing Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? <Loader2 className="h-8 w-8 animate-spin mx-auto" /> : articles?.map((a: any) => (
              <div key={a.id} className="flex gap-4 p-4 border rounded-lg hover:bg-muted/10">
                <div className="relative h-20 w-20 flex-shrink-0 bg-muted rounded overflow-hidden">
                  {a.imageUrl && <Image src={a.imageUrl} alt="" fill className="object-cover" />}
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold">{a.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{a.excerpt}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(a)}><Settings className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(a.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SliderEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [items, setItems] = React.useState<any[]>(initialData?.items || []);

  React.useEffect(() => {
    if (initialData?.items) setItems(initialData.items);
  }, [initialData]);

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { title: "", description: "", imageUrl: "", link: "/articles", buttonText: "Learn More" }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Homepage Slider</CardTitle>
          <CardDescription>Side-by-side featured carousel.</CardDescription>
        </div>
        <Button size="sm" onClick={addItem} className="gap-2"><Plus className="h-4 w-4" /> Add Slide</Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {items.map((item, i) => (
            <Card key={i} className="p-6 space-y-4 bg-muted/20 relative group">
              <Button size="icon" variant="destructive" className="absolute top-4 right-4 h-8 w-8 opacity-0 group-hover:opacity-100" onClick={() => removeItem(i)}><Trash2 className="h-4 w-4" /></Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1"><Label>Title</Label><Input value={item.title} onChange={e => updateItem(i, 'title', e.target.value)} /></div>
                  <div className="space-y-1"><Label>Description</Label><Textarea value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><Label>Btn Text</Label><Input value={item.buttonText} onChange={e => updateItem(i, 'buttonText', e.target.value)} /></div>
                    <div className="space-y-1">
                      <Label>Link Path</Label>
                      <Input value={item.link} onChange={e => updateItem(i, 'link', e.target.value)} placeholder="/articles" />
                    </div>
                  </div>
                </div>
                <MediaPicker label="Slide Image" value={item.imageUrl} onChange={(url) => updateItem(i, 'imageUrl', url)} />
              </div>
            </Card>
          ))}
        </div>
        <Button onClick={() => onSave({ items })} className="gap-2"><Save className="h-4 w-4" /> Save Slider Config</Button>
      </CardContent>
    </Card>
  );
}

function GeneralEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = React.useState(initialData || { siteName: "SANEX Company Ltd", logoUrl: "", phone: "", email: "" });
  React.useEffect(() => { if (initialData) setFormData(initialData); }, [initialData]);
  return (
    <Card>
      <CardHeader><CardTitle>Branding</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2"><Label>Site Name</Label><Input value={formData.siteName} onChange={e => setFormData({...formData, siteName: e.target.value})} /></div>
            <MediaPicker label="Company Logo" value={formData.logoUrl} onChange={(url) => setFormData({...formData, logoUrl: url})} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2"><Label>Phone</Label><Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
          </div>
          <Button type="submit" className="gap-2"><Save className="h-4 w-4" /> Save branding</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function HeroEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = React.useState(initialData || {});
  React.useEffect(() => { if (initialData) setFormData(initialData); }, [initialData]);
  return (
    <Card>
      <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2"><Label>Badge</Label><Input value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} /></div>
            <div className="space-y-2"><Label>Title Part 1</Label><Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
            <div className="space-y-2"><Label>Title Accent</Label><Input value={formData.titleAccent} onChange={e => setFormData({...formData, titleAccent: e.target.value})} /></div>
            <MediaPicker label="Hero Media" value={formData.imageUrl} onChange={url => setFormData({...formData, imageUrl: url})} />
          </div>
          <div className="space-y-2"><Label>Description</Label><Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
          <Button type="submit"><Save className="h-4 w-4 mr-2" /> Save Hero</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ServicesEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = React.useState(initialData || { items: [] });
  React.useEffect(() => { if (initialData) setFormData(initialData); }, [initialData]);
  const updateItem = (i: number, f: string, v: string) => {
    const ni = [...formData.items]; ni[i] = { ...ni[i], [f]: v }; setFormData({ ...formData, items: ni });
  };
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Services</CardTitle>
        <Button size="sm" onClick={() => setFormData({...formData, items: [...formData.items, {title: "", description: "", icon: "truck", imageUrl: ""}]})}><Plus className="h-4 w-4" /></Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {formData.items.map((item: any, i: number) => (
            <Card key={i} className="p-4 space-y-4">
              <Input value={item.title} onChange={e => updateItem(i, 'title', e.target.value)} placeholder="Title" />
              <Textarea value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} placeholder="Desc" />
              <MediaPicker value={item.imageUrl} onChange={u => updateItem(i, 'imageUrl', u)} />
              <Button size="icon" variant="destructive" onClick={() => setFormData({...formData, items: formData.items.filter((_:any, idx:number) => idx !== i)})}><Trash2 className="h-4 w-4" /></Button>
            </Card>
          ))}
        </div>
        <Button onClick={() => onSave(formData)}><Save className="h-4 w-4 mr-2" /> Save Services</Button>
      </CardContent>
    </Card>
  );
}

function ImpactEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = React.useState(initialData || { items: [] });
  React.useEffect(() => { if (initialData) setFormData(initialData); }, [initialData]);
  return (
    <Card>
      <CardHeader><CardTitle>Impact UI Stats</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {formData.items.map((item: any, i: number) => (
            <div key={i} className="p-4 border rounded">
              <Input value={item.title} onChange={e => {
                const ni = [...formData.items]; ni[i].title = e.target.value; setFormData({...formData, items: ni});
              }} className="mb-2" />
              <Textarea value={item.points?.join("\n")} onChange={e => {
                const ni = [...formData.items]; ni[i].points = e.target.value.split("\n"); setFormData({...formData, items: ni});
              }} className="h-20" />
            </div>
          ))}
        </div>
        <Button onClick={() => onSave(formData)}><Save className="h-4 w-4 mr-2" /> Save Impact</Button>
      </CardContent>
    </Card>
  );
}

function RegionalEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = React.useState(initialData || { items: [] });
  React.useEffect(() => { if (initialData) setFormData(initialData); }, [initialData]);
  return (
    <Card>
      <CardHeader><CardTitle>Regional Presence</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formData.items.map((item: any, i: number) => (
            <div key={i} className="p-4 border rounded">
              <Input value={item.name} onChange={e => {
                const ni = [...formData.items]; ni[i].name = e.target.value; setFormData({...formData, items: ni});
              }} className="mb-2" />
              <Input value={item.status} onChange={e => {
                const ni = [...formData.items]; ni[i].status = e.target.value; setFormData({...formData, items: ni});
              }} />
            </div>
          ))}
        </div>
        <Button onClick={() => onSave(formData)}><Save className="h-4 w-4 mr-2" /> Save Regions</Button>
      </CardContent>
    </Card>
  );
}

function GalleryManager({ photos, loading }: { photos: any, loading: boolean }) {
  const functions = useFunctions();
  const { toast } = useToast();
  const [photoUrl, setPhotoUrl] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!functions || !photoUrl) return;
    try {
      const addFunc = httpsCallable(functions, 'adminAddGalleryItem');
      await addFunc({ imageUrl: photoUrl, description });
      setPhotoUrl(""); setDescription("");
      toast({ title: "Success", description: "Photo added." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1 h-fit">
        <CardHeader><CardTitle>Add to Gallery</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="space-y-4">
            <MediaPicker value={photoUrl} onChange={setPhotoUrl} />
            <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Caption" />
            <Button className="w-full">Add Photo</Button>
          </form>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>Photos</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : photos?.map((p: any) => (
              <div key={p.id} className="relative aspect-video rounded-lg overflow-hidden border">
                <Image src={p.imageUrl} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

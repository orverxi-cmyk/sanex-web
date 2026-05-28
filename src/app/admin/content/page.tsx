"use client";

import React, { Suspense } from "react";
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
import { RichTextEditor } from "@/components/RichTextEditor";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  ChevronLeft, 
  ImageIcon, 
  Plus, 
  Trash2, 
  Save, 
  Loader2, 
  ShieldAlert,
  Layout,
  Sparkles,
  List,
  Globe,
  RefreshCw,
  Settings,
  Layers,
  FileText,
  Navigation as NavigationIcon,
  Clock,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

function ContentManagementContent() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const functions = useFunctions();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "general";
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const userDocRef = React.useMemo(() => (db && user ? doc(db, "users", user.uid) : null), [db, user]);
  const { data: userProfile, loading: profileLoading } = useDoc(userDocRef);

  const generalRef = React.useMemo(() => (db ? doc(db, "settings", "general") : null), [db]);
  const heroRef = React.useMemo(() => (db ? doc(db, "settings", "hero") : null), [db]);
  const sliderRef = React.useMemo(() => (db ? doc(db, "settings", "slider") : null), [db]);
  const servicesRef = React.useMemo(() => (db ? doc(db, "settings", "services") : null), [db]);
  const highlightsRef = React.useMemo(() => (db ? doc(db, "settings", "highlights") : null), [db]);
  const impactRef = React.useMemo(() => (db ? doc(db, "settings", "impact") : null), [db]);
  const regionalRef = React.useMemo(() => (db ? doc(db, "settings", "regional") : null), [db]);
  const milestonesRef = React.useMemo(() => (db ? doc(db, "settings", "milestones") : null), [db]);

  const { data: generalData } = useDoc(generalRef);
  const { data: heroData } = useDoc(heroRef);
  const { data: sliderData } = useDoc(sliderRef);
  const { data: servicesData } = useDoc(servicesRef);
  const { data: highlightsData } = useDoc(highlightsRef);
  const { data: impactData } = useDoc(impactRef);
  const { data: regionalData } = useDoc(regionalRef);
  const { data: milestonesData } = useDoc(milestonesRef);

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
    <div className="min-h-screen flex flex-col font-arial">
      <Navbar />
      <main className="flex-grow py-5 bg-muted/10">
        <div className="container mx-auto px-4">
          <Button asChild variant="ghost" className="mb-5 -ml-2">
            <Link href="/admin"><ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
          </Button>
          
          <div className="flex justify-between items-center mb-5">
            <div>
              <h1 className="text-[16px] font-bold font-headline flex items-center gap-3">
                <Layout className="h-8 w-8 text-primary" /> Site Content Manager
              </h1>
              <p className="text-[14px] font-normal text-muted-foreground">Update branding, pages, and dynamic site sections.</p>
            </div>
          </div>

          <Tabs defaultValue={defaultTab} className="space-y-5">
            <div className="overflow-x-auto pb-2">
              <TabsList className="bg-white border p-1 h-auto flex-nowrap justify-start gap-2 min-w-max">
                <TabsTrigger value="general" className="gap-2 text-[10px] font-bold uppercase"><Settings className="h-3 w-3 text-primary" /> Branding</TabsTrigger>
                <TabsTrigger value="navigation" className="gap-2 text-[10px] font-bold uppercase"><NavigationIcon className="h-3 w-3 text-primary" /> Menu</TabsTrigger>
                <TabsTrigger value="articles" className="gap-2 text-[10px] font-bold uppercase"><FileText className="h-3 w-3 text-primary" /> Articles</TabsTrigger>
                <TabsTrigger value="slider" className="gap-2 text-[10px] font-bold uppercase"><Layers className="h-3 w-3 text-primary" /> Slider</TabsTrigger>
                <TabsTrigger value="hero" className="gap-2 text-[10px] font-bold uppercase"><Sparkles className="h-3 w-3 text-primary" /> Hero</TabsTrigger>
                <TabsTrigger value="highlights" className="gap-2 text-[10px] font-bold uppercase"><Shield className="h-3 w-3 text-primary" /> Highlights</TabsTrigger>
                <TabsTrigger value="services" className="gap-2 text-[10px] font-bold uppercase"><List className="h-3 w-3 text-primary" /> Services</TabsTrigger>
                <TabsTrigger value="impact" className="gap-2 text-[10px] font-bold uppercase"><RefreshCw className="h-3 w-3 text-primary" /> Impact UI</TabsTrigger>
                <TabsTrigger value="milestones" className="gap-2 text-[10px] font-bold uppercase"><Clock className="h-3 w-3 text-primary" /> Who We Are</TabsTrigger>
                <TabsTrigger value="regional" className="gap-2 text-[10px] font-bold uppercase"><Globe className="h-3 w-3 text-primary" /> Presence</TabsTrigger>
                <TabsTrigger value="gallery" className="gap-2 text-[10px] font-bold uppercase"><ImageIcon className="h-3 w-3 text-primary" /> Gallery</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="general">
              <GeneralEditor initialData={generalData} onSave={(data) => handleUpdateSection('general', data)} />
            </TabsContent>

            <TabsContent value="navigation">
              <NavigationEditor initialData={generalData} onSave={(data) => handleUpdateSection('general', data)} />
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

export default function ContentManagementPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <ContentManagementContent />
    </Suspense>
  );
}

function NavigationEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [navLinks, setNavLinks] = React.useState<any[]>(initialData?.navLinks || []);

  React.useEffect(() => {
    if (initialData?.navLinks) setNavLinks(initialData.navLinks);
  }, [initialData]);

  const addLink = () => {
    setNavLinks([...navLinks, { name: "New Page", href: "/" }]);
  };

  const removeLink = (index: number) => {
    setNavLinks(navLinks.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: string, value: string) => {
    const newLinks = [...navLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setNavLinks(newLinks);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Navigation Menu</CardTitle>
          <CardDescription className="text-xs">Manage links in the top header and footer.</CardDescription>
        </div>
        <Button size="sm" onClick={addLink} className="gap-2 h-9 text-[10px] font-bold uppercase tracking-widest"><Plus className="h-4 w-4" /> Add Link</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {navLinks.map((link, i) => (
            <div key={i} className="flex gap-2 p-3 border rounded-lg bg-muted/20 relative group">
              <div className="flex-grow space-y-2">
                <div className="space-y-1">
                  <Label className="text-[8px] font-bold uppercase text-muted-foreground">Label Name</Label>
                  <Input 
                    className="h-8 text-xs" 
                    value={link.name} 
                    onChange={e => updateLink(i, 'name', e.target.value)} 
                    placeholder="e.g. Services"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[8px] font-bold uppercase text-muted-foreground">URL Path</Label>
                  <Input 
                    className="h-8 text-xs font-mono" 
                    value={link.href} 
                    onChange={e => updateLink(i, 'href', e.target.value)} 
                    placeholder="e.g. /services"
                  />
                </div>
              </div>
              <Button 
                size="icon" 
                variant="destructive" 
                className="h-7 w-7 mt-5" 
                onClick={() => removeLink(i)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        <Button 
          onClick={() => onSave({ ...initialData, navLinks })} 
          className="gap-2 h-10 text-[10px] font-bold uppercase tracking-widest w-full bg-primary text-black"
        >
          <Save className="h-4 w-4" /> Save Navigation Menu
        </Button>
      </CardContent>
    </Card>
  );
}

function ArticleManager({ articles, loading }: { articles: any, loading: boolean }) {
  const functions = useFunctions();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    title: "", excerpt: "", content: "", imageUrl: "", imageWidth: 1200, imageHeight: 600, category: "Impact", author: "SANEX Team"
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
      setFormData({ title: "", excerpt: "", content: "", imageUrl: "", imageWidth: 1200, imageHeight: 600, category: "Impact", author: "SANEX Team" });
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
      imageWidth: article.imageWidth || 1200,
      imageHeight: article.imageHeight || 600,
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <Card className="lg:col-span-1 h-fit">
        <CardHeader>
          <CardTitle className="text-xl">{isEditing ? "Edit Article" : "New Article"}</CardTitle>
          <CardDescription className="text-xs">Create styled impact stories and case studies.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Title</Label>
              <Input className="h-9 text-xs" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Category</Label>
                <Input className="h-9 text-xs" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Author</Label>
                <Input className="h-9 text-xs" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Excerpt</Label>
              <Textarea className="min-h-[60px] text-xs" value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} />
            </div>
            <RichTextEditor 
              label="Content" 
              value={formData.content} 
              onChange={content => setFormData({...formData, content})} 
            />
            <MediaPicker label="Featured Image" value={formData.imageUrl} onChange={url => setFormData({...formData, imageUrl: url})} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Width (px)</Label>
                <Input type="number" className="h-9 text-xs" value={formData.imageWidth} onChange={e => setFormData({...formData, imageWidth: Number(e.target.value)})} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Height (px)</Label>
                <Input type="number" className="h-9 text-xs" value={formData.imageHeight} onChange={e => setFormData({...formData, imageHeight: Number(e.target.value)})} />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-grow h-10 text-xs font-bold uppercase tracking-widest">{isEditing ? "Save Changes" : "Publish Article"}</Button>
              {isEditing && <Button type="button" variant="outline" className="h-10 text-xs font-bold uppercase tracking-widest" onClick={() => setIsEditing(null)}>Cancel</Button>}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-xl">Existing Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loading ? <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /> : articles?.map((a: any) => (
              <div key={a.id} className="flex gap-4 p-4 border rounded-lg hover:bg-muted/10 transition-colors">
                <div className="relative h-16 w-16 flex-shrink-0 bg-muted rounded overflow-hidden">
                  {a.imageUrl && <Image src={a.imageUrl} alt="" fill className="object-cover" />}
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-sm">{a.title}</h4>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">{a.excerpt}</p>
                  <div className="mt-1 flex gap-2">
                    <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest px-1.5 py-0">{a.category}</Badge>
                    <span className="text-[8px] text-muted-foreground">{a.imageWidth}x{a.imageHeight}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => handleEdit(a)}><Settings className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(a.id)}><Trash2 className="h-4 w-4" /></Button>
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

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { title: "", description: "", imageUrl: "", width: 1200, height: 600, link: "/articles", buttonText: "Learn More" }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Homepage Slider</CardTitle>
          <CardDescription className="text-xs">Manage featured carousel slides.</CardDescription>
        </div>
        <Button size="sm" onClick={addItem} className="gap-2 h-9 text-[10px] font-bold uppercase tracking-widest"><Plus className="h-4 w-4" /> Add Slide</Button>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-5">
          {items.map((item, i) => (
            <Card key={i} className="p-5 space-y-4 bg-muted/20 relative group border-primary/20">
              <Button size="icon" variant="destructive" className="absolute top-4 right-4 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeItem(i)}><Trash2 className="h-4 w-4" /></Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div className="space-y-1"><Label className="text-[10px] font-bold uppercase text-muted-foreground">Title</Label><Input className="h-9 text-xs" value={item.title} onChange={e => updateItem(i, 'title', e.target.value)} /></div>
                  <RichTextEditor 
                    label="Description" 
                    value={item.description} 
                    onChange={val => updateItem(i, 'description', val)} 
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><Label className="text-[10px] font-bold uppercase text-muted-foreground">Width (px)</Label><Input type="number" className="h-9 text-xs" value={item.width} onChange={e => updateItem(i, 'width', Number(e.target.value))} /></div>
                    <div className="space-y-1"><Label className="text-[10px] font-bold uppercase text-muted-foreground">Height (px)</Label><Input type="number" className="h-9 text-xs" value={item.height} onChange={e => updateItem(i, 'height', Number(e.target.value))} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><Label className="text-[10px] font-bold uppercase text-muted-foreground">Btn Text</Label><Input className="h-9 text-xs" value={item.buttonText} onChange={e => updateItem(i, 'buttonText', e.target.value)} /></div>
                    <div className="space-y-1"><Label className="text-[10px] font-bold uppercase text-muted-foreground">Link</Label><Input className="h-9 text-xs" value={item.link} onChange={e => updateItem(i, 'link', e.target.value)} /></div>
                  </div>
                </div>
                <MediaPicker label="Slide Image/Video" value={item.imageUrl} onChange={(url) => updateItem(i, 'imageUrl', url)} />
              </div>
            </Card>
          ))}
        </div>
        <Button onClick={() => onSave({ items })} className="gap-2 h-10 text-[10px] font-bold uppercase tracking-widest w-full bg-primary text-black"><Save className="h-4 w-4" /> Save Slider Config</Button>
      </CardContent>
    </Card>
  );
}

function GeneralEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = React.useState(initialData || { siteName: "SANEX Company Ltd", logoUrl: "", logoWidth: 160, logoHeight: 40, logoSpacing: 8, phone: "", email: "" });
  
  React.useEffect(() => { 
    if (initialData) setFormData(initialData); 
  }, [initialData]);

  return (
    <Card>
      <CardHeader><CardTitle className="text-xl">Branding</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Site Name</Label>
              <Input className="h-9 text-xs" value={formData.siteName} onChange={e => setFormData({...formData, siteName: e.target.value})} />
            </div>
            <MediaPicker label="Company Logo" value={formData.logoUrl} onChange={(url) => setFormData({...formData, logoUrl: url})} />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Logo Width (px)</Label>
              <Input type="number" className="h-9 text-xs" value={formData.logoWidth} onChange={e => setFormData({...formData, logoWidth: Number(e.target.value)})} />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Logo Height (px)</Label>
              <Input type="number" className="h-9 text-xs" value={formData.logoHeight} onChange={e => setFormData({...formData, logoHeight: Number(e.target.value)})} />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Logo Spacing (px)</Label>
              <Input type="number" className="h-9 text-xs" value={formData.logoSpacing} onChange={e => setFormData({...formData, logoSpacing: Number(e.target.value)})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Phone</Label>
              <Input className="h-9 text-xs" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Email</Label>
              <Input className="h-9 text-xs" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>
          <Button type="submit" className="gap-2 h-10 text-[10px] font-bold uppercase tracking-widest w-full bg-primary text-black"><Save className="h-4 w-4" /> Save branding</Button>
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
      <CardHeader><CardTitle className="text-xl">Hero Section</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1"><Label className="text-[10px] font-bold uppercase text-muted-foreground">Badge</Label><Input className="h-9 text-xs" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} /></div>
            <div className="space-y-1"><Label className="text-[10px] font-bold uppercase text-muted-foreground">Title Part 1</Label><Input className="h-9 text-xs" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
            <div className="space-y-1"><Label className="text-[10px] font-bold uppercase text-muted-foreground">Title Accent</Label><Input className="h-9 text-xs" value={formData.titleAccent} onChange={e => setFormData({...formData, titleAccent: e.target.value})} /></div>
            <MediaPicker label="Hero Media" value={formData.imageUrl} onChange={url => setFormData({...formData, imageUrl: url})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label className="text-[10px] font-bold uppercase text-muted-foreground">Width (px)</Label><Input type="number" className="h-9 text-xs" value={formData.imageWidth} onChange={e => setFormData({...formData, imageWidth: Number(e.target.value)})} /></div>
            <div className="space-y-1"><Label className="text-[10px] font-bold uppercase text-muted-foreground">Height (px)</Label><Input type="number" className="h-9 text-xs" value={formData.imageHeight} onChange={e => setFormData({...formData, imageHeight: Number(e.target.value)})} /></div>
          </div>
          <RichTextEditor 
            label="Description" 
            value={formData.description} 
            onChange={val => setFormData({...formData, description: val})} 
          />
          <Button type="submit" className="h-10 text-[10px] font-bold uppercase tracking-widest w-full bg-primary text-black"><Save className="h-4 w-4 mr-2" /> Save Hero</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function HighlightsEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = React.useState(initialData || { items: [] });
  React.useEffect(() => { if (initialData) setFormData(initialData); }, [initialData]);

  const updateItem = (i: number, f: string, v: any) => {
    const ni = [...formData.items]; ni[i] = { ...ni[i], [f]: v }; setFormData({ ...formData, items: ni });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Value Highlights</CardTitle>
        <Button size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest" onClick={() => setFormData({...formData, items: [...formData.items, {title: "", description: "", icon: "shield"}]})}><Plus className="h-4 w-4" /> Add Highlight</Button>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {formData.items.map((item: any, i: number) => (
            <Card key={i} className="p-4 space-y-3 relative border-primary/20 bg-muted/5">
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Title</Label>
                <Input className="h-9 text-xs font-bold" value={item.title} onChange={e => updateItem(i, 'title', e.target.value)} placeholder="e.g. Nationwide Coverage" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Icon Identifier</Label>
                <Input className="h-9 text-xs" value={item.icon} onChange={e => updateItem(i, 'icon', e.target.value)} placeholder="e.g. shield, globe, zap" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Description</Label>
                <Textarea className="min-h-[60px] text-xs" value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} />
              </div>
              <Button size="icon" variant="destructive" className="h-7 w-7 absolute top-2 right-2" onClick={() => setFormData({...formData, items: formData.items.filter((_:any, idx:number) => idx !== i)})}><Trash2 className="h-3 w-3" /></Button>
            </Card>
          ))}
        </div>
        <Button onClick={() => onSave(formData)} className="h-10 text-[10px] font-bold uppercase tracking-widest w-full bg-primary text-black"><Save className="h-4 w-4 mr-2" /> Save Highlights</Button>
      </CardContent>
    </Card>
  );
}

function ServicesEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = React.useState(initialData || { items: [] });
  React.useEffect(() => { if (initialData) setFormData(initialData); }, [initialData]);
  const updateItem = (i: number, f: string, v: any) => {
    const ni = [...formData.items]; ni[i] = { ...ni[i], [f]: v }; setFormData({ ...formData, items: ni });
  };
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Services</CardTitle>
        <Button size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest" onClick={() => setFormData({...formData, items: [...formData.items, {title: "", description: "", icon: "truck", imageUrl: "", width: 800, height: 600}]})}><Plus className="h-4 w-4" /> Add Service</Button>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {formData.items.map((item: any, i: number) => (
            <Card key={i} className="p-4 space-y-3 relative border-primary/20">
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Service Title</Label>
                <Input className="h-9 text-xs font-bold" value={item.title} onChange={e => updateItem(i, 'title', e.target.value)} placeholder="Title" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Icon Identifier</Label>
                <Input className="h-9 text-xs" value={item.icon} onChange={e => updateItem(i, 'icon', e.target.value)} placeholder="e.g. truck, droplets, settings" />
              </div>
              <RichTextEditor 
                label="Description" 
                value={item.description} 
                onChange={val => updateItem(i, 'description', val)} 
              />
              <MediaPicker value={item.imageUrl} onChange={u => updateItem(i, 'imageUrl', u)} />
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Width</Label>
                  <Input type="number" className="h-8 text-[10px]" value={item.width} onChange={e => updateItem(i, 'width', Number(e.target.value))} />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Height</Label>
                  <Input type="number" className="h-8 text-[10px]" value={item.height} onChange={e => updateItem(i, 'height', Number(e.target.value))} />
                </div>
              </div>
              <Button size="icon" variant="destructive" className="h-8 w-8 absolute top-2 right-2" onClick={() => setFormData({...formData, items: formData.items.filter((_:any, idx:number) => idx !== i)})}><Trash2 className="h-4 w-4" /></Button>
            </Card>
          ))}
        </div>
        <Button onClick={() => onSave(formData)} className="h-10 text-[10px] font-bold uppercase tracking-widest w-full bg-primary text-black"><Save className="h-4 w-4 mr-2" /> Save Services</Button>
      </CardContent>
    </Card>
  );
}

function ImpactEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = React.useState(initialData || { items: [] });
  React.useEffect(() => { if (initialData) setFormData(initialData); }, [initialData]);

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { title: "New Impact", icon: "sparkles", points: ["<p>Describe impact point here.</p>"] }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Impact UI Stats</CardTitle>
          <CardDescription className="text-xs">Manage dynamic impact categories and points.</CardDescription>
        </div>
        <Button size="sm" onClick={addItem} className="gap-2 h-9 text-[10px] font-bold uppercase tracking-widest">
          <Plus className="h-4 w-4" /> Add Impact Category
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-6">
          {formData.items.map((item: any, i: number) => (
            <div key={i} className="p-4 border rounded-xl border-primary/20 bg-muted/5 relative group">
              <Button 
                size="icon" 
                variant="destructive" 
                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeItem(i)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Category Title</Label>
                  <Input 
                    className="h-9 text-xs font-bold" 
                    value={item.title} 
                    onChange={e => updateItem(i, 'title', e.target.value)} 
                    placeholder="Impact Category Title" 
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Icon Identifier</Label>
                  <Input 
                    className="h-9 text-xs" 
                    value={item.icon} 
                    onChange={e => updateItem(i, 'icon', e.target.value)} 
                    placeholder="e.g. leaf, check, heart, scale" 
                  />
                </div>
              </div>
              <RichTextEditor 
                label="Impact Points" 
                value={item.points?.join("")} 
                onChange={html => {
                  updateItem(i, 'points', [html]); // Store as single HTML block in array
                }} 
              />
            </div>
          ))}
        </div>
        {formData.items.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed rounded-xl">
            <p className="text-muted-foreground text-sm">No impact items configured. Click 'Add Impact Category' to start.</p>
          </div>
        )}
        <Button onClick={() => onSave(formData)} className="h-10 text-[10px] font-bold uppercase tracking-widest w-full bg-primary text-black">
          <Save className="h-4 w-4 mr-2" /> Save Impact Configuration
        </Button>
      </CardContent>
    </Card>
  );
}

function MilestonesEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = React.useState({ 
    title: initialData?.title || "Who We Are", 
    description: initialData?.description || "",
    items: initialData?.items || [] 
  });

  React.useEffect(() => { 
    if (initialData) {
      setFormData({ 
        title: initialData.title || "Who We Are",
        description: initialData.description || "",
        items: initialData.items || [] 
      });
    }
  }, [initialData]);
  
  const updateItem = (i: number, f: string, v: any) => {
    const ni = [...formData.items]; 
    ni[i] = { ...ni[i], [f]: v }; 
    setFormData({ ...formData, items: ni });
  };

  const removeItem = (index: number) => {
    const ni = formData.items.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, items: ni });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { year: "202X", title: "New Milestone", description: "<p></p>", icon: "clock" }]
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Who We Are / Evolution</CardTitle>
          <CardDescription className="text-xs">Manage section headers and growth milestones.</CardDescription>
        </div>
        <Button size="sm" onClick={addItem} className="gap-2 h-9 text-[10px] font-bold uppercase tracking-widest">
          <Plus className="h-4 w-4" /> Add Milestone
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 p-4 border rounded-xl bg-primary/5">
          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Section Title</Label>
            <Input 
              className="h-9 text-sm font-bold" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>
          <RichTextEditor 
            label="Who We Are Introduction" 
            value={formData.description} 
            onChange={html => setFormData({...formData, description: html})} 
          />
        </div>

        <div className="grid grid-cols-1 gap-5">
          {formData.items.map((item: any, i: number) => (
            <div key={i} className="p-4 border rounded-xl relative bg-muted/5 group border-primary/10">
              <Button 
                size="icon" 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" 
                onClick={() => removeItem(i)}
                title="Remove Milestone"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Year</Label>
                  <Input className="h-9 text-xs" value={item.year} onChange={e => updateItem(i, 'year', e.target.value)} placeholder="Year" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Title</Label>
                  <Input className="h-9 text-xs font-bold" value={item.title} onChange={e => updateItem(i, 'title', e.target.value)} placeholder="Milestone Title" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Icon Identifier</Label>
                  <Input className="h-9 text-xs" value={item.icon} onChange={e => updateItem(i, 'icon', e.target.value)} placeholder="e.g. clock, rocket, shield" />
                </div>
              </div>
              <RichTextEditor 
                label="Item Details"
                value={item.description} 
                onChange={val => updateItem(i, 'description', val)} 
                placeholder="Describe the milestone event..."
              />
            </div>
          ))}
          {formData.items.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed rounded-xl">
              <p className="text-muted-foreground text-sm">No milestones listed. Click 'Add Milestone' to begin.</p>
            </div>
          )}
        </div>
        <Button onClick={() => onSave(formData)} className="h-11 text-[10px] font-bold uppercase tracking-widest w-full bg-primary text-black mt-4">
          <Save className="h-4 w-4 mr-2" /> Save Who We Are Configuration
        </Button>
      </CardContent>
    </Card>
  );
}

function RegionalEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = React.useState(initialData || { items: [] });
  React.useEffect(() => { if (initialData) setFormData(initialData); }, [initialData]);
  return (
    <Card>
      <CardHeader><CardTitle className="text-xl">Our Presence</CardTitle></CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formData.items.map((item: any, i: number) => (
            <div key={i} className="p-4 border rounded border-primary/20 bg-muted/5">
              <Input className="h-9 text-xs font-bold mb-2" value={item.name} onChange={e => {
                const ni = [...formData.items]; ni[i].name = e.target.value; setFormData({...formData, items: ni});
              }} placeholder="City Name" />
              <Input className="h-9 text-xs mb-2" value={item.status} onChange={e => {
                const ni = [...formData.items]; ni[i].status = e.target.value; setFormData({...formData, items: ni});
              }} placeholder="Operational Status" />
              <Input className="h-9 text-xs" value={item.capacity} onChange={e => {
                const ni = [...formData.items]; ni[i].capacity = e.target.value; setFormData({...formData, items: ni});
              }} placeholder="Capacity/Fleet info" />
            </div>
          ))}
        </div>
        <Button onClick={() => onSave(formData)} className="h-10 text-[10px] font-bold uppercase tracking-widest w-full bg-primary text-black"><Save className="h-4 w-4 mr-2" /> Save Presence Config</Button>
      </CardContent>
    </Card>
  );
}

function GalleryManager({ photos, loading }: { photos: any, loading: boolean }) {
  const { user } = useUser();
  const functions = useFunctions();
  const { toast } = useToast();
  const [photoUrl, setPhotoUrl] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [width, setWidth] = React.useState(800);
  const [height, setHeight] = React.useState(600);
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !photoUrl) return;
    setIsAdding(true);
    try {
      const token = await user.getIdToken();
      
      const response = await fetch('https://us-central1-studio-9595184890-5bb3c.cloudfunctions.net/adminAddGalleryItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          imageUrl: photoUrl,
          description: description.trim(),
          width: width,
          height: height
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
      
      setPhotoUrl(""); setDescription("");
      toast({ title: "Success", description: "Photo added to gallery." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!functions || !confirm("Delete this photo?")) return;
    try {
      const delFunc = httpsCallable(functions, 'adminDeleteGalleryItem');
      await delFunc({ id });
      toast({ title: "Deleted", description: "Photo removed from gallery." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <Card className="lg:col-span-1 h-fit">
        <CardHeader><CardTitle className="text-xl">Add to Gallery</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="space-y-4">
            <MediaPicker value={photoUrl} onChange={setPhotoUrl} />
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Caption</Label>
              <Input className="h-9 text-xs" value={description} onChange={e => setDescription(e.target.value)} placeholder="Service description..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Width (px)</Label>
                <Input type="number" className="h-9 text-xs" value={width} onChange={e => setWidth(Number(e.target.value))} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Height (px)</Label>
                <Input type="number" className="h-9 text-xs" value={height} onChange={e => setHeight(Number(e.target.value))} />
              </div>
            </div>
            <Button className="w-full h-10 text-[10px] font-bold uppercase tracking-widest bg-primary text-black" disabled={isAdding}>
              {isAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Add Photo
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader><CardTitle className="text-xl">Photos</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {loading ? <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /> : photos?.map((p: any) => (
              <div key={p.id} className="group relative aspect-video rounded-lg overflow-hidden border border-primary/10">
                <Image src={p.imageUrl} alt="" fill className="object-cover" />
                <Button 
                  size="icon" 
                  variant="destructive" 
                  className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDelete(p.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-[8px] text-white font-medium line-clamp-1">{p.description} ({p.width}x{p.height})</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


"use client";

import React from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, Calendar, ChevronLeft, User, Share2, Twitter, Linkedin, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArticleDetailPage() {
  const params = useParams();
  const articleId = params.articleId as string;
  const db = useFirestore();

  const articleRef = React.useMemo(() => (db && articleId ? doc(db, "articles", articleId) : null), [db, articleId]);
  const { data: article, loading } = useDoc(articleRef);

  const handleShare = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    const url = window.location.href;
    const title = article?.title || "Check out this article from SANEX";
    
    let shareUrl = "";
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <h1 className="text-[16px] font-bold mb-4">Article Not Found</h1>
          <Button asChild className="bg-primary text-black font-bold">
            <Link href="/articles">Back to Articles</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-arial">
      <Navbar />
      <main className="flex-grow py-5">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex justify-between items-center mb-5">
            <Button asChild variant="ghost" className="gap-2 text-primary font-bold -ml-4">
              <Link href="/articles"><ChevronLeft className="h-4 w-4" /> Back to Articles</Link>
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-2 flex items-center gap-1">
                <Share2 className="h-3 w-3" /> Share:
              </span>
              <Button size="icon" variant="outline" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary" onClick={() => handleShare('twitter')}>
                <Twitter className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="outline" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary" onClick={() => handleShare('linkedin')}>
                <Linkedin className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="outline" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary" onClick={() => handleShare('facebook')}>
                <Facebook className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <header className="mb-5 space-y-4">
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-primary" /> {new Date(article.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-1"><User className="h-3 w-3 text-primary" /> {article.author || 'SANEX Team'}</span>
              <span className="px-2 py-0.5 rounded bg-primary text-black">{article.category}</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold font-headline leading-tight">
              {article.title}
            </h1>
            <p className="text-[14px] text-muted-foreground italic leading-relaxed">
              {article.excerpt}
            </p>
          </header>

          {article.imageUrl && (
            <div className="relative rounded-2xl overflow-hidden mb-5 shadow-xl border border-primary/10 bg-muted flex justify-center">
              <Image 
                src={article.imageUrl} 
                alt={article.title} 
                width={article.imageWidth || 1200}
                height={article.imageHeight || 600}
                className="object-contain h-auto w-full max-w-full" 
              />
            </div>
          )}

          <article className="prose prose-sm lg:prose-lg max-w-none prose-headings:font-headline prose-primary">
            <div 
              className="text-foreground/80 font-normal text-[14px] leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: article.content }} 
            />
          </article>

          <div className="mt-10 pt-5 border-t border-primary/20">
            <h3 className="text-[16px] font-bold font-headline mb-4">Want to learn more?</h3>
            <div className="flex flex-wrap gap-x-[5px] gap-y-[20px]">
              <Button asChild className="h-12 px-8 bg-primary text-black font-bold text-[14px] uppercase tracking-widest rounded-full shadow-md">
                <Link href="/book">Schedule a Consultation</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 px-8 border-primary text-primary font-bold text-[14px] uppercase tracking-widest rounded-full">
                <Link href="/articles">Browse Other Stories</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

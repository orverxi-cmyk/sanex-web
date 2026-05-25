
"use client";

import React from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, Calendar, ChevronLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArticleDetailPage() {
  const params = useParams();
  const articleId = params.articleId as string;
  const db = useFirestore();

  const articleRef = React.useMemo(() => (db && articleId ? doc(db, "articles", articleId) : null), [db, articleId]);
  const { data: article, loading } = useDoc(articleRef);

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
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <Button asChild className="bg-primary text-black font-bold">
            <Link href="/articles">Back to Articles</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-5">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button asChild variant="ghost" className="mb-5 -ml-4 gap-2 text-primary font-bold">
            <Link href="/articles"><ChevronLeft className="h-4 w-4" /> Back to Articles</Link>
          </Button>

          <header className="mb-5 space-y-4">
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-primary" /> {new Date(article.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-1"><User className="h-3 w-3 text-primary" /> {article.author || 'SANEX Team'}</span>
              <span className="px-2 py-0.5 rounded bg-primary text-black">{article.category}</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold font-headline leading-tight">
              {article.title}
            </h1>
            <p className="text-lg text-muted-foreground italic leading-relaxed">
              {article.excerpt}
            </p>
          </header>

          {article.imageUrl && (
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-5 shadow-xl border border-primary/10">
              <Image src={article.imageUrl} alt={article.title} fill className="object-cover" />
            </div>
          )}

          <article className="prose prose-sm lg:prose-lg max-w-none prose-headings:font-headline prose-primary">
            <div className="whitespace-pre-wrap leading-relaxed text-foreground/80 font-medium">
              {article.content}
            </div>
          </article>

          <div className="mt-10 pt-5 border-t border-primary/20">
            <h3 className="text-xl font-bold font-headline mb-4">Want to learn more?</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="h-12 px-8 bg-primary text-black font-bold text-base rounded-full">
                <Link href="/book">Schedule a Consultation</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 px-8 border-primary text-primary font-bold text-base rounded-full">
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


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

  const { data: article, loading } = useDoc(
    db ? doc(db, "articles", articleId) : null
  );

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
          <Button asChild>
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
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button asChild variant="ghost" className="mb-8 -ml-4 gap-2">
            <Link href="/articles"><ChevronLeft className="h-4 w-4" /> Back to Articles</Link>
          </Button>

          <header className="mb-10 space-y-6">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(article.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-1"><User className="h-4 w-4" /> {article.author || 'SANEX Team'}</span>
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-[10px] uppercase">{article.category}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold font-headline leading-tight">
              {article.title}
            </h1>
            <p className="text-xl text-muted-foreground italic">
              {article.excerpt}
            </p>
          </header>

          {article.imageUrl && (
            <div className="relative aspect-video rounded-3xl overflow-hidden mb-12 shadow-xl">
              <Image src={article.imageUrl} alt={article.title} fill className="object-cover" />
            </div>
          )}

          <article className="prose prose-lg max-w-none prose-headings:font-headline prose-primary">
            <div className="whitespace-pre-wrap leading-relaxed text-foreground/80">
              {article.content}
            </div>
          </article>

          <div className="mt-20 pt-10 border-t">
            <h3 className="text-2xl font-bold font-headline mb-6">Want to learn more?</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="h-12 px-8">
                <Link href="/book">Schedule a Consultation</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 px-8">
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

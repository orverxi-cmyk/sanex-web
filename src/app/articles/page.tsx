
"use client";

import React from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { Loader2, FileText, ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArticlesPage() {
  const db = useFirestore();
  const articlesQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, "articles"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: articles, loading } = useCollection(articlesQuery);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FileText className="h-6 w-6" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold font-headline">Impact & Case Studies</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Read about how SANEX is transforming waste management and protecting the environment across Rwanda.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article: any) => (
                <div key={article.id} className="group bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition-all flex flex-col">
                  <div className="relative h-56 w-full bg-muted">
                    {article.imageUrl && (
                      <Image src={article.imageUrl} alt={article.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    )}
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {article.category || 'Impact'}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold font-headline mb-3 group-hover:text-primary transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="mt-auto">
                      <Button asChild variant="ghost" className="p-0 h-auto hover:bg-transparent text-primary gap-2 font-bold">
                        <Link href={`/articles/${article.id}`}>Read Full Article <ArrowRight className="h-4 w-4" /></Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
              <h3 className="text-xl font-bold">No Articles Found</h3>
              <p className="text-muted-foreground">Detailed impact stories will appear here soon.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

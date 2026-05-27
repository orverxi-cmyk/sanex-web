
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Droplets, Menu, X, Calendar } from "lucide-react";
import { useUser, useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { UserNav } from "./UserNav";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user } = useUser();
  const db = useFirestore();

  const generalRef = React.useMemo(() => (db ? doc(db, "settings", "general") : null), [db]);
  const { data: generalData } = useDoc(generalRef);

  const defaultNavLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Articles", href: "/articles" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  const navLinks = generalData?.navLinks || defaultNavLinks;
  const siteName = generalData?.siteName || "SANEX Company Ltd";
  const logoUrl = generalData?.logoUrl;
  const logoWidth = generalData?.logoWidth || 160;
  const logoHeight = generalData?.logoHeight || 40;
  const logoSpacing = generalData?.logoSpacing ?? 8;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center" style={{ gap: `${logoSpacing}px` }}>
            {logoUrl ? (
              <div className="relative overflow-hidden" style={{ width: logoWidth, height: logoHeight }}>
                <Image src={logoUrl} alt={siteName} width={logoWidth} height={logoHeight} className="object-contain w-full h-full" />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-black">
                <Droplets className="h-6 w-6" />
              </div>
            )}
            <span className="text-[16px] font-bold tracking-tight text-primary">
              {siteName.split(' ')[0]} <span className="text-foreground">{siteName.split(' ').slice(1).join(' ')}</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link: any) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[14px] font-bold uppercase tracking-widest hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            <div className="flex items-center gap-4 ml-4">
              <UserNav />
              <Button asChild className="bg-primary hover:bg-primary/90 text-black font-bold uppercase tracking-widest h-10 px-5 text-[14px] gap-2">
                <Link href="/book"><Calendar className="h-4 w-4 text-black" /> Book a Service</Link>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:hidden">
            <UserNav />
            <button className="p-2 text-primary" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden border-t bg-background animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-4 p-6">
            {navLinks.map((link: any) => (
              <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-[14px] font-bold uppercase tracking-widest">
                {link.name}
              </Link>
            ))}
            <Button asChild className="w-full bg-primary text-black font-bold h-11 text-[14px] uppercase tracking-widest gap-2">
              <Link href="/book"><Calendar className="h-4 w-4 text-black" /> Book a Service</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

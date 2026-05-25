
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

  const { data: userProfile } = useDoc(
    db && user ? doc(db, "users", user.uid) : null
  );

  const { data: generalData } = useDoc(
    db ? doc(db, "settings", "general") : null
  );

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Articles", href: "/articles" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  const siteName = generalData?.siteName || "SANEX Company Ltd";
  const logoUrl = generalData?.logoUrl;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {logoUrl ? (
              <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                <Image src={logoUrl} alt={siteName} fill className="object-contain" />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Droplets className="h-6 w-6 text-black" />
              </div>
            )}
            <span className="text-xl font-bold tracking-tight font-headline text-primary">
              {siteName.split(' ')[0]} <span className="text-foreground">{siteName.split(' ').slice(1).join(' ')}</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            <div className="flex items-center gap-4 ml-4">
              <UserNav />
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Link href="/book"><Calendar className="h-4 w-4 text-black" /> Book a Service</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 lg:hidden">
            <UserNav />
            <button
              className="p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t bg-background animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-4 p-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium"
              >
                {link.name}
              </Link>
            ))}
            <Button asChild className="w-full bg-primary text-primary-foreground gap-2">
              <Link href="/book"><Calendar className="h-4 w-4 text-black" /> Book a Service</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

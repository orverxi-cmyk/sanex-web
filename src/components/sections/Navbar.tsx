
"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Droplets, Menu, X, LayoutDashboard } from "lucide-react";
import { useUser, useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user } = useUser();
  const db = useFirestore();

  const { data: userProfile } = useDoc(
    db && user ? doc(db, "users", user.uid) : null
  );

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Services", href: "/#services" },
    { name: "Impact", href: "/#impact" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/#contact" },
  ];

  const isAdmin = userProfile?.role === "admin";

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Droplets className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight font-headline text-primary">
              SANEX <span className="text-foreground">Ltd</span>
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
            
            {isAdmin && (
              <Link href="/admin" className="text-sm font-bold text-secondary hover:underline flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" /> Admin Portal
              </Link>
            )}
            
            <div className="flex items-center gap-4 ml-4">
              <Button size="sm" className="bg-secondary hover:bg-secondary/90">Get a Quote</Button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 lg:hidden">
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
            {isAdmin && (
              <Link href="/admin" onClick={() => setIsOpen(false)} className="text-lg font-bold text-secondary flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" /> Admin Portal
              </Link>
            )}
            <Button className="w-full bg-secondary">Get a Quote</Button>
          </div>
        </div>
      )}
    </nav>
  );
}

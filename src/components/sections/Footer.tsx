
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Droplets, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";

export function Footer() {
  const db = useFirestore();
  const { data: generalData } = useDoc(
    db ? doc(db, "settings", "general") : null
  );

  const siteName = generalData?.siteName || "SANEX Company Ltd";
  const logoUrl = generalData?.logoUrl;
  const phone = generalData?.phone || "+250 788303628";
  const email = generalData?.email || "info@sanex.rw";

  return (
    <footer id="contact" className="bg-primary text-black py-5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              {logoUrl ? (
                <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-white">
                  <Image src={logoUrl} alt={siteName} fill className="object-contain p-1" />
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-primary">
                  <Droplets className="h-5 w-5" />
                </div>
              )}
              <span className="text-xl font-bold font-headline tracking-tight text-black">{siteName.split(' ')[0]}</span>
            </Link>
            <p className="text-sm text-black/70 leading-relaxed font-medium">
              Transforming Waste into Opportunity since 2017.
            </p>
            <div className="flex gap-3">
              <Link href="#" className="h-8 w-8 rounded-full bg-black/10 flex items-center justify-center hover:bg-black hover:text-primary transition-colors">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="#" className="h-8 w-8 rounded-full bg-black/10 flex items-center justify-center hover:bg-black hover:text-primary transition-colors">
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold font-headline uppercase tracking-wider text-black">Links</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="text-black/70 hover:text-black font-medium transition-colors">About Us</Link></li>
              <li><Link href="/services" className="text-black/70 hover:text-black font-medium transition-colors">Solutions</Link></li>
              <li><Link href="/articles" className="text-black/70 hover:text-black font-medium transition-colors">Impact</Link></li>
              <li><Link href="/contact" className="text-black/70 hover:text-black font-medium transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold font-headline uppercase tracking-wider text-black">Services</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link href="/services" className="text-black/70 hover:text-black">Waste Collection</Link></li>
              <li><Link href="/services" className="text-black/70 hover:text-black">DWTS Installation</Link></li>
              <li><Link href="/services" className="text-black/70 hover:text-black">Maintenance</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold font-headline uppercase tracking-wider text-black">Contact</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex gap-2 text-black/70 font-medium">
                <MapPin className="h-4 w-4 flex-shrink-0 text-black" />
                <span>Kigali, Rwanda</span>
              </li>
              <li className="flex gap-2 text-black/70 font-medium">
                <Phone className="h-4 w-4 flex-shrink-0 text-black" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-black transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex gap-2 text-black/70 font-medium">
                <Mail className="h-4 w-4 flex-shrink-0 text-black" />
                <a href={`mailto:${email}`} className="hover:text-black transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-black/10 pt-4 text-center text-[10px] text-black/50 font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

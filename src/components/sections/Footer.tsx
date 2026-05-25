
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Droplets, Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";

export function Footer() {
  const db = useFirestore();
  const { data: generalData } = useDoc(
    db ? doc(db, "settings", "general") : null
  );

  const siteName = generalData?.siteName || "SANEX Company Ltd";
  const logoUrl = generalData?.logoUrl;
  const phone = generalData?.phone || "+250 788 303 628";
  const email = generalData?.email || "info@sanex.rw";

  return (
    <footer id="contact" className="bg-primary text-black pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              {logoUrl ? (
                <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white">
                  <Image src={logoUrl} alt={siteName} fill className="object-contain p-1" />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary">
                  <Droplets className="h-6 w-6" />
                </div>
              )}
              <span className="text-2xl font-bold font-headline tracking-tight text-black">{siteName.split(' ')[0]}</span>
            </Link>
            <p className="text-black/70 leading-relaxed font-medium">
              Founded in 2017, {siteName} is Rwanda's leading provider of sustainable liquid waste management solutions.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="h-10 w-10 rounded-full bg-black/10 flex items-center justify-center hover:bg-black hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full bg-black/10 flex items-center justify-center hover:bg-black hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full bg-black/10 flex items-center justify-center hover:bg-black hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold font-headline uppercase tracking-wider text-black">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="#about" className="text-black/70 hover:text-black font-medium transition-colors">About Our Journey</Link></li>
              <li><Link href="#services" className="text-black/70 hover:text-black font-medium transition-colors">Our Solutions</Link></li>
              <li><Link href="#impact" className="text-black/70 hover:text-black font-medium transition-colors">Our Impact</Link></li>
              <li><Link href="#contact" className="text-black/70 hover:text-black font-medium transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold font-headline uppercase tracking-wider text-black">Services</h4>
            <ul className="space-y-4 font-medium">
              <li><span className="text-black/70">Liquid Waste Collection and Transport</span></li>
              <li><span className="text-black/70">Installation of DWTS</span></li>
              <li><span className="text-black/70">Maintenance & Consultancy</span></li>
              <li><span className="text-black/70">Sanitation Projects</span></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold font-headline uppercase tracking-wider text-black">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-black/70 font-medium">
                <MapPin className="h-5 w-5 flex-shrink-0 text-black" />
                <span>Kigali, Rwanda<br/>Main Operational Office</span>
              </li>
              <li className="flex gap-3 text-black/70 font-medium">
                <Phone className="h-5 w-5 flex-shrink-0 text-black" />
                <a href={`mailto:${email}?subject=Inquiry from Website&body=Hello, I would like to inquire about...`} className="hover:text-black transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex gap-3 text-black/70 font-medium">
                <Mail className="h-5 w-5 flex-shrink-0 text-black" />
                <a href={`mailto:${email}`} className="hover:text-black transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-black/10 pt-8 text-center text-sm text-black/50 font-bold">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved. Transforming Waste into Opportunity.</p>
        </div>
      </div>
    </footer>
  );
}

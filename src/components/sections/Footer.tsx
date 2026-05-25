
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

  return (
    <footer id="contact" className="bg-primary text-primary-foreground pt-20 pb-10">
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
              <span className="text-2xl font-bold font-headline tracking-tight text-white">{siteName.split(' ')[0]}</span>
            </Link>
            <p className="text-primary-foreground/70 leading-relaxed">
              Founded in 2017, {siteName} is Rwanda's leading provider of sustainable liquid waste management solutions.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold font-headline uppercase tracking-wider text-secondary">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="#about" className="text-primary-foreground/70 hover:text-white transition-colors">About Our Journey</Link></li>
              <li><Link href="#services" className="text-primary-foreground/70 hover:text-white transition-colors">Our Solutions</Link></li>
              <li><Link href="#impact" className="text-primary-foreground/70 hover:text-white transition-colors">Our Impact</Link></li>
              <li><Link href="#contact" className="text-primary-foreground/70 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold font-headline uppercase tracking-wider text-secondary">Services</h4>
            <ul className="space-y-4">
              <li><span className="text-primary-foreground/70">Liquid Waste Collection and Transport</span></li>
              <li><span className="text-primary-foreground/70">Installation of Decentralized Wastewater Treatment Systems (DWTS)</span></li>
              <li><span className="text-primary-foreground/70">Maintenance & Consultancy</span></li>
              <li><span className="text-primary-foreground/70">Sanitation Projects and Partnerships</span></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold font-headline uppercase tracking-wider text-secondary">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-primary-foreground/70">
                <MapPin className="h-5 w-5 flex-shrink-0 text-secondary" />
                <span>Kigali, Rwanda<br/>Main Operational Office</span>
              </li>
              <li className="flex gap-3 text-primary-foreground/70">
                <Phone className="h-5 w-5 flex-shrink-0 text-secondary" />
                <span>+250 000 000 000</span>
              </li>
              <li className="flex gap-3 text-primary-foreground/70">
                <Mail className="h-5 w-5 flex-shrink-0 text-secondary" />
                <span>info@sanex.rw</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center text-sm text-primary-foreground/50">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved. Transforming Waste into Opportunity.</p>
        </div>
      </div>
    </footer>
  );
}

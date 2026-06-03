
"use client";

import React from "react";
import Link from "next/link";
import { Linkedin, Twitter, Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";

export function Footer() {
  const db = useFirestore();
  const { data: generalData } = useDoc(React.useMemo(() => (db ? doc(db, "settings", "general") : null), [db]));

  const phone = generalData?.phone || "+250 788303628";
  const email = generalData?.email || "sanexcompany@gmail.com";
  const navLinks = generalData?.navLinks || [
    { name: "About Us", href: "/about" },
    { name: "Solutions", href: "/services" },
    { name: "Impact", href: "/articles" },
    { name: "Contact", href: "/contact" },
  ];

  const socials = generalData?.socials || {};

  return (
    <footer id="contact" className="bg-black text-white py-5">
      <div className="container mx-auto px-4 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
          <div className="space-y-4">
            <h4 className="text-[16px] font-bold uppercase tracking-wider text-primary">Links</h4>
            <ul className="space-y-2 text-[14px] font-normal">
              {navLinks.map((link: any) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/70 hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[16px] font-bold uppercase tracking-wider text-primary">Services</h4>
            <ul className="space-y-2 text-[14px] font-normal text-white/70">
              <li>Waste Collection</li>
              <li>DWTS Installation</li>
              <li>Maintenance</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[16px] font-bold uppercase tracking-wider text-primary">Contact</h4>
            <ul className="space-y-2 text-[14px] font-normal text-white/70">
              <li className="flex gap-2 justify-center md:justify-start">
                <MapPin className="h-3.5 w-3.5 text-primary" /> Kigali, Rwanda
              </li>
              <li className="flex gap-2 justify-center md:justify-start">
                <Phone className="h-3.5 w-3.5 text-primary" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-primary transition-colors">{phone}</a>
              </li>
              <li className="flex gap-2 justify-center md:justify-start">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <a href={`mailto:${email}`} className="hover:text-primary transition-colors">{email}</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-5 flex flex-col md:flex-row items-center justify-between gap-4 text-[14px] font-normal text-white/50">
          <span>© {new Date().getFullYear()}. SANEX Company Ltd. All rights reserved.</span>
          <div className="flex gap-3">
            {socials.twitter && (
              <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-black transition-all text-white">
                <Twitter className="h-4 w-4" />
              </a>
            )}
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-black transition-all text-white">
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {socials.facebook && (
              <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-black transition-all text-white">
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {socials.instagram && (
              <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-black transition-all text-white">
                <Instagram className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

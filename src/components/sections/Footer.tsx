
"use client";

import React from "react";
import Link from "next/link";
import { Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";

export function Footer() {
  const db = useFirestore();
  const { data: generalData } = useDoc(React.useMemo(() => (db ? doc(db, "settings", "general") : null), [db]));

  const phone = generalData?.phone || "+250 788303628";
  const email = generalData?.email || "info@sanex.rw";
  const navLinks = generalData?.navLinks || [
    { name: "About Us", href: "/about" },
    { name: "Solutions", href: "/services" },
    { name: "Impact", href: "/articles" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer id="contact" className="bg-black text-white py-2.5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5 text-center md:text-left">
          <div className="space-y-3">
            <h4 className="text-[16px] font-bold uppercase tracking-wider text-primary">Links</h4>
            <ul className="space-y-1.5 text-[14px] font-normal">
              {navLinks.map((link: any) => (
                <li key={link.name}><Link href={link.href} className="text-white/70 hover:text-primary">{link.name}</Link></li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-[16px] font-bold uppercase tracking-wider text-primary">Services</h4>
            <ul className="space-y-1.5 text-[14px] font-normal text-white/70">
              <li>Waste Collection</li>
              <li>DWTS Installation</li>
              <li>Maintenance</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-[16px] font-bold uppercase tracking-wider text-primary">Contact</h4>
            <ul className="space-y-1.5 text-[14px] font-normal text-white/70">
              <li className="flex gap-2 justify-center md:justify-start"><MapPin className="h-3.5 w-3.5 text-primary" /> Kigali, Rwanda</li>
              <li className="flex gap-2 justify-center md:justify-start"><Phone className="h-3.5 w-3.5 text-primary" /><a href={`tel:${phone}`} className="hover:text-primary">{phone}</a></li>
              <li className="flex gap-2 justify-center md:justify-start"><Mail className="h-3.5 w-3.5 text-primary" /><a href={`mailto:${email}`} className="hover:text-primary">{email}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-2.5 flex items-center justify-between gap-4 text-[14px] font-normal text-white/50">
          <span>© {new Date().getFullYear()}. All rights reserved.</span>
          <div className="flex gap-2">
            <Link href="#" className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-black transition-colors text-white"><Twitter className="h-3.5 w-3.5" /></Link>
            <Link href="#" className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-black transition-colors text-white"><Linkedin className="h-3.5 w-3.5" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

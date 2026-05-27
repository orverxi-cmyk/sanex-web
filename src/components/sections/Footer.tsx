
"use client";

import React from "react";
import Link from "next/link";
import { Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";

export function Footer() {
  const db = useFirestore();
  const { data: generalData } = useDoc(
    React.useMemo(() => (db ? doc(db, "settings", "general") : null), [db])
  );

  const phone = generalData?.phone || "+250 788303628";
  const email = generalData?.email || "info@sanex.rw";

  const defaultNavLinks = [
    { name: "About Us", href: "/about" },
    { name: "Solutions", href: "/services" },
    { name: "Impact", href: "/articles" },
    { name: "Contact", href: "/contact" },
  ];

  const navLinks = generalData?.navLinks || defaultNavLinks;

  return (
    <footer id="contact" className="bg-primary text-black py-2.5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5 text-center md:text-left">
          <div className="space-y-3 flex flex-col items-center md:items-start">
            <p className="text-[11px] text-black/70 leading-relaxed font-medium">
              Transforming Waste into Opportunity since 2017.
            </p>
            <div className="flex gap-2">
              <Link href="#" className="h-7 w-7 rounded-full bg-black/10 flex items-center justify-center hover:bg-black hover:text-primary transition-colors">
                <Twitter className="h-3.5 w-3.5" />
              </Link>
              <Link href="#" className="h-7 w-7 rounded-full bg-black/10 flex items-center justify-center hover:bg-black hover:text-primary transition-colors">
                <Linkedin className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-bold font-headline uppercase tracking-wider text-black">Links</h4>
            <ul className="space-y-1.5 text-[10px]">
              {navLinks.map((link: any) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-black/70 hover:text-black font-medium transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-bold font-headline uppercase tracking-wider text-black">Services</h4>
            <ul className="space-y-1.5 text-[10px] font-medium">
              <li><Link href="/services" className="text-black/70 hover:text-black">Waste Collection</Link></li>
              <li><Link href="/services" className="text-black/70 hover:text-black">DWTS Installation</Link></li>
              <li><Link href="/services" className="text-black/70 hover:text-black">Maintenance</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-bold font-headline uppercase tracking-wider text-black">Contact</h4>
            <ul className="space-y-1.5 text-[10px]">
              <li className="flex gap-2 text-black/70 font-medium justify-center md:justify-start">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-black" />
                <span>Kigali, Rwanda</span>
              </li>
              <li className="flex gap-2 text-black/70 font-medium justify-center md:justify-start">
                <Phone className="h-3.5 w-3.5 flex-shrink-0 text-black" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-black transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex gap-2 text-black/70 font-medium justify-center md:justify-start">
                <Mail className="h-3.5 w-3.5 flex-shrink-0 text-black" />
                <a href={`mailto:${email}`} className="hover:text-black transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-black/10 pt-2.5 flex flex-col md:flex-row items-center justify-center gap-4 text-[9px] text-black/50 font-bold uppercase tracking-widest">
          <span>© {new Date().getFullYear()}. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

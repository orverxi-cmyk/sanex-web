
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

  const [newsletterEmail, setNewsletterEmail] = React.useState("");
  const [newsletterFirstName, setNewsletterFirstName] = React.useState("");
  const [newsletterLastName, setNewsletterLastName] = React.useState("");
  const [newsletterAddress, setNewsletterAddress] = React.useState("");
  const [newsletterStatus, setNewsletterStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [newsletterMessage, setNewsletterMessage] = React.useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus("loading");
    setNewsletterMessage("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newsletterEmail,
          firstName: newsletterFirstName,
          lastName: newsletterLastName,
          address: newsletterAddress,
        }),
      });
      const data = await res.json();
      if (!res.ok && res.status !== 200) {
        throw new Error(data.error || "Failed to subscribe");
      }
      setNewsletterStatus("success");
      setNewsletterMessage(data.message || "Subscribed successfully!");
      setNewsletterEmail("");
      setNewsletterFirstName("");
      setNewsletterLastName("");
      setNewsletterAddress("");
    } catch (err: any) {
      setNewsletterStatus("error");
      setNewsletterMessage(err.message || "Failed to subscribe");
    }
  };

  return (
    <footer id="contact" className="bg-black text-white py-5">
      <div className="container mx-auto px-4 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 text-center md:text-left">
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
          <div className="space-y-4">
            <h4 className="text-[16px] font-bold uppercase tracking-wider text-primary">Newsletter</h4>
            <p className="text-[14px] text-white/70">
              Subscribe to get the latest news and updates directly to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="First Name"
                  value={newsletterFirstName}
                  onChange={(e) => setNewsletterFirstName(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded px-3 py-1.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary w-full"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={newsletterLastName}
                  onChange={(e) => setNewsletterLastName(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded px-3 py-1.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary w-full"
                />
              </div>
              <input
                type="text"
                placeholder="Address"
                value={newsletterAddress}
                onChange={(e) => setNewsletterAddress(e.target.value)}
                className="bg-white/10 border border-white/20 rounded px-3 py-1.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary w-full"
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Your email address *"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary flex-1"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === "loading"}
                  className="bg-primary text-black font-semibold px-4 py-2 rounded text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
                >
                  {newsletterStatus === "loading" ? "..." : "Subscribe"}
                </button>
              </div>
              {newsletterMessage && (
                <p className={`text-xs ${newsletterStatus === "success" ? "text-primary" : "text-red-400"}`}>
                  {newsletterMessage}
                </p>
              )}
            </form>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-5 flex flex-col md:flex-row items-center justify-between gap-4 text-[14px] font-normal text-white/50">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>© {new Date().getFullYear()}. SANEX Company Ltd. All rights reserved.</span>
            <span className="hidden sm:inline text-white/30">•</span>
            <Link href="/privacy" className="hover:text-primary transition-colors text-white/70 underline sm:no-underline">
              Privacy Policy
            </Link>
            <span className="hidden sm:inline text-white/30">•</span>
            <Link href="/terms" className="hover:text-primary transition-colors text-white/70 underline sm:no-underline">
              Terms of Service
            </Link>
          </div>
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

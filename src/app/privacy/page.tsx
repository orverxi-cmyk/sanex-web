"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Phone, Mail, ArrowRight, Lock, CheckCircle2 } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col font-arial bg-muted/10">
      <Navbar />
      
      {/* Top Banner */}
      <div className="bg-primary py-4">
        <div className="container mx-auto px-4 md:px-16 text-center">
          <h1 className="text-xl md:text-2xl font-bold text-black uppercase tracking-widest font-headline">
            Privacy & Data Usage Policy
          </h1>
          <p className="mt-1 text-black/80 max-w-2xl mx-auto font-medium text-xs md:text-sm">
            How SANEX Company Ltd protects and responsibly handles your shared contact information.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="border bg-white shadow-sm overflow-hidden">
            <CardHeader className="border-b bg-muted/10 pb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <ShieldCheck className="h-6 w-6 text-black" />
                </div>
                <div>
                  <CardTitle className="text-lg md:text-xl font-bold font-headline text-black">
                    Use of Shared Contact Information
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Last updated: {new Date().getFullYear()} • SANEX Company Ltd
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 md:p-8 space-y-6 text-sm text-foreground leading-relaxed">
              {/* Paragraph 1 */}
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-2 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" /> Purpose of Data Collection
                </h2>
                <p className="text-muted-foreground">
                  At SANEX Company Ltd, we value your privacy and are committed to transparency in how your personal data is handled. When you submit a service request through our website or booking portal, we collect contact information including your full name, phone number, email address, physical location, and service requirements. This shared contact information is collected for the sole purpose of contacting you—the service requester—to confirm appointment details, schedule liquid waste collection or environmental sanitation services, communicate operational status updates, and dispatch our field teams directly to your site.
                </p>
              </div>

              {/* Paragraph 2 */}
              <div className="border-t pt-5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Strict Confidentiality & No Third-Party Sharing
                </h2>
                <p className="text-muted-foreground">
                  We treat your information with the highest standard of care and confidentiality. Your shared contact details will never be sold, rented, leased, or disclosed to third-party advertisers or external organizations for promotional purposes. The data remains strictly internal to SANEX Company Ltd and is utilized exclusively as necessary to fulfill your requested sanitation operations, coordinate logistical routing, ensure service excellence, and provide direct client support.
                </p>
              </div>

              {/* Key Commitments Box */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-black">Our Privacy Commitments</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-black shrink-0 mt-0.5" />
                    <span><strong className="text-black">Service Requester Contact:</strong> Contact numbers and emails are used solely to confirm and manage your service request.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-black shrink-0 mt-0.5" />
                    <span><strong className="text-black">Safe Location Routing:</strong> Location coordinates or maps links are accessed only by dispatch drivers to locate your premises.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-black shrink-0 mt-0.5" />
                    <span><strong className="text-black">Zero Commercial Marketing:</strong> We never sell or share client contact directories with third parties.</span>
                  </div>
                </div>
              </div>

              {/* Contact and Next Steps */}
              <div className="border-t pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-muted-foreground text-center sm:text-left">
                  Have questions about our privacy practices?{" "}
                  <Link href="/contact" className="font-bold text-black underline hover:text-primary transition-colors">
                    Contact our support team
                  </Link>.
                </div>
                <Button asChild className="h-10 px-5 text-xs font-bold uppercase tracking-wider bg-primary text-black hover:bg-primary/90 rounded-full shrink-0">
                  <Link href="/book">
                    Book a Service <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

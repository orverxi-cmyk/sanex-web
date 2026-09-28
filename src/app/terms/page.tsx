"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, ShieldAlert, ArrowRight, Scale, Clock, MapPin } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col font-arial bg-muted/10">
      <Navbar />
      
      {/* Top Banner */}
      <div className="bg-primary py-4">
        <div className="container mx-auto px-4 md:px-16 text-center">
          <h1 className="text-xl md:text-2xl font-bold text-black uppercase tracking-widest font-headline">
            Terms of Service
          </h1>
          <p className="mt-1 text-black/80 max-w-2xl mx-auto font-medium text-xs md:text-sm">
            Guidelines and conditions governing sanitation and liquid waste management services by SANEX Company Ltd.
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
                  <Scale className="h-6 w-6 text-black" />
                </div>
                <div>
                  <CardTitle className="text-lg md:text-xl font-bold font-headline text-black">
                    Service Agreement & Terms
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Effective date: {new Date().getFullYear()} • SANEX Company Ltd (Kigali, Rwanda)
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 md:p-8 space-y-6 text-sm text-foreground leading-relaxed">
              {/* Introduction */}
              <div>
                <p className="text-muted-foreground">
                  Welcome to SANEX Company Ltd. These Terms of Service outline the agreement between you (the &quot;Service Requester&quot; or &quot;Client&quot;) and SANEX Company Ltd (&quot;SANEX&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) regarding the provision of liquid waste collection, Decentralized Wastewater Treatment Systems (DWTS) installation, system maintenance, and related environmental sanitation solutions.
                </p>
              </div>

              {/* 1. Scope of Services */}
              <div className="border-t pt-5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> 1. Scope of Services
                </h2>
                <p className="text-muted-foreground">
                  SANEX provides professional liquid waste removal, desludging, wastewater transport, DWTS construction and maintenance, and regulatory compliance consulting across Rwanda. Every service request submitted via our digital portal or customer service line constitutes a preliminary request subject to operational feasibility, physical accessibility, and operator confirmation.
                </p>
              </div>

              {/* 2. Service Requests & Site Accessibility */}
              <div className="border-t pt-5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> 2. Booking Accuracy & Site Access
                </h2>
                <p className="text-muted-foreground">
                  When submitting a request, you agree to provide accurate contact details, service descriptions, and location pins or addresses. The client is responsible for ensuring clear, safe access to the premises, septic infrastructure, or treatment plants for SANEX vacuum trucks and operational technicians during scheduled appointment windows.
                </p>
              </div>

              {/* 3. Safety, Environmental Compliance & Regulations */}
              <div className="border-t pt-5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> 3. Environmental Standards & RURA Compliance
                </h2>
                <p className="text-muted-foreground">
                  All waste collected by SANEX is transported and discharged exclusively at legally authorized treatment facilities in strict compliance with Rwanda Utilities Regulatory Authority (RURA) standards and Rwanda Environment Management Authority (REMA) directives. Hazardous or prohibited industrial chemicals must be declared prior to booking.
                </p>
              </div>

              {/* 4. Scheduling, Rescheduling & Cancellations */}
              <div className="border-t pt-5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> 4. Scheduling & Cancellations
                </h2>
                <p className="text-muted-foreground">
                  Appointments are confirmed by our dispatch team via phone or email based on vehicle availability and route optimization. If you need to reschedule or cancel a service request, please notify SANEX at least 12 hours prior to the scheduled service time to prevent unnecessary dispatch.
                </p>
              </div>

              {/* 5. Privacy & Data Handling */}
              <div className="border-t pt-5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-2 flex items-center gap-2">
                  <Scale className="h-4 w-4 text-primary" /> 5. Data Privacy
                </h2>
                <p className="text-muted-foreground">
                  Your shared contact information is handled in accordance with our{" "}
                  <Link href="/privacy" className="font-bold text-black underline hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>. It is used solely to contact you regarding service execution, scheduling, status notifications, and customer support.
                </p>
              </div>

              {/* Quick Summary Highlights Box */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-black">Client Responsibilities Summary</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-black shrink-0 mt-0.5" />
                    <span><strong className="text-black">Clear Access:</strong> Ensure unobstructed vehicle access to septic tanks and wastewater facilities.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-black shrink-0 mt-0.5" />
                    <span><strong className="text-black">Contact Availability:</strong> Be reachable on the phone number provided for dispatch arrival coordination.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-black shrink-0 mt-0.5" />
                    <span><strong className="text-black">Prompt Notice:</strong> Advise our team in advance of any specific site hazards or delays.</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-muted-foreground text-center sm:text-left">
                  Have inquiries about our terms or services?{" "}
                  <Link href="/contact" className="font-bold text-black underline hover:text-primary transition-colors">
                    Contact us
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

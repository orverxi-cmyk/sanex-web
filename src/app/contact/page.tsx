
"use client";

import React from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";

export default function ContactPage() {
  const db = useFirestore();
  const { data: generalData } = useDoc(
    React.useMemo(() => (db ? doc(db, "settings", "general") : null), [db])
  );

  const phone = generalData?.phone || "+250 788303628";
  const email = generalData?.email || "info@sanex.rw";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-muted/10 py-5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-5">
              <h1 className="text-4xl lg:text-5xl font-bold font-headline mb-4">Get in Touch</h1>
              <p className="text-muted-foreground">We're here to solve your liquid waste management challenges.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-primary text-black">
                  <CardTitle className="text-xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Phone</div>
                      <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-lg font-bold hover:text-primary transition-colors">
                        {phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Email</div>
                      <a href={`mailto:${email}`} className="text-lg font-bold hover:text-primary transition-colors">
                        {email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Office</div>
                      <p className="text-lg font-bold">Kigali, Rwanda</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col justify-center space-y-5">
                <Card className="border-primary border-2 bg-primary/5">
                  <CardContent className="p-8 text-center space-y-5">
                    <Calendar className="h-12 w-12 mx-auto text-primary" />
                    <h3 className="text-2xl font-bold font-headline">Need a Service?</h3>
                    <p className="text-muted-foreground">Book a liquid waste collection or consultancy directly through our booking portal.</p>
                    <Button asChild className="w-full h-12 text-lg">
                      <Link href="/book">Schedule Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

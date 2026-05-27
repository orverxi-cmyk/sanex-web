
"use client";

import React from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin, Send, CheckCircle2, Navigation, Link as LinkIcon } from "lucide-react";

export default function BookingPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isLocating, setIsLocating] = React.useState(false);
  const [locationMethod, setLocationMethod] = React.useState<'manual' | 'auto' | null>(null);

  const [formData, setFormData] = React.useState({
    customerName: "",
    email: "",
    phone: "",
    serviceType: "",
    locationUrl: "",
    description: ""
  });

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Geolocation is not supported by your browser."
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setFormData({ ...formData, locationUrl: mapsUrl });
        setLocationMethod('auto');
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        setLocationMethod('manual');
        toast({
          variant: "destructive",
          title: "Location Failed",
          description: "Could not retrieve your location. Please enter it manually."
        });
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.locationUrl) {
      toast({
        variant: "destructive",
        title: "Location Required",
        description: "Please provide a location link."
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('https://us-central1-studio-9595184890-5bb3c.cloudfunctions.net/createBooking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit booking');
      }

      setIsSubmitted(true);
      toast({ title: "Booking Successful", description: "Your request has been received." });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-muted/30 px-4 py-5">
          <Card className="w-full max-w-md text-center py-5">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl mb-1">Thank You!</CardTitle>
            <CardDescription className="text-sm">
              Your request for <strong>{formData.serviceType}</strong> has been received. Our team will contact you shortly.
            </CardDescription>
            <Button className="mt-5 bg-primary text-black font-bold" onClick={() => window.location.href = "/"}>Return Home</Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-5 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto space-y-5">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold font-headline">Book a Service</h1>
              <p className="text-muted-foreground text-sm">
                Professional liquid waste management services across Rwanda.
              </p>
            </div>

            <Card className="shadow-lg border-none overflow-hidden">
              <CardHeader className="bg-primary text-black p-4">
                <CardTitle className="text-lg">Request Form</CardTitle>
                <CardDescription className="text-black/70">Please fill in your details</CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="name" className="text-xs font-bold uppercase">Full Name *</Label>
                      <Input id="name" placeholder="John Doe" required className="h-10 text-sm" value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="phone" className="text-xs font-bold uppercase">Phone *</Label>
                      <Input id="phone" placeholder="+250..." required className="h-10 text-sm" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-xs font-bold uppercase">Email *</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required className="h-10 text-sm" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="service" className="text-xs font-bold uppercase">Service *</Label>
                    <Select onValueChange={(val) => setFormData({...formData, serviceType: val})} required>
                      <SelectTrigger id="service" className="h-10 text-sm">
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Liquid Waste Collection">Liquid Waste Collection</SelectItem>
                        <SelectItem value="Installation of DWTS">DWTS Installation</SelectItem>
                        <SelectItem value="Maintenance & Consultancy">Maintenance & Consultancy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase">Location *</Label>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" className="h-9 text-xs gap-2" disabled={isLocating} onClick={handleGetLocation}>
                        {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />} Detect Current Location
                      </Button>
                      <Button type="button" variant="outline" size="sm" className="h-9 text-xs gap-2" onClick={() => setLocationMethod('manual')}>
                        <LinkIcon className="h-4 w-4" /> Enter Manually
                      </Button>
                    </div>
                    {(locationMethod === 'manual' || formData.locationUrl) && (
                      <Input 
                        placeholder="Paste Google Maps URL" 
                        required 
                        className="h-10 text-sm" 
                        value={formData.locationUrl} 
                        onChange={(e) => setFormData({...formData, locationUrl: e.target.value})} 
                      />
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="desc" className="text-xs font-bold uppercase">Details (Optional)</Label>
                    <Textarea id="desc" placeholder="Please provide any additional details about your request..." className="min-h-[80px] text-sm" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                  </div>

                  <Button type="submit" className="w-full h-12 text-base font-bold uppercase tracking-widest gap-2 bg-primary text-black" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />} Submit Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

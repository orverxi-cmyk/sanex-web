"use client";

import React from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { useFunctions } from "@/firebase";
import { httpsCallable } from "firebase/functions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin, Send, CheckCircle2, Navigation, Link as LinkIcon, AlertCircle } from "lucide-react";

export default function BookingPage() {
  const functions = useFunctions();
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
        toast({
          title: "Location Detected",
          description: "Your current coordinates have been added successfully."
        });
      },
      (error) => {
        setIsLocating(false);
        toast({
          variant: "destructive",
          title: "Location Error",
          description: "Could not retrieve your location. Please enter it manually."
        });
        setLocationMethod('manual');
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!functions) return;

    if (!formData.locationUrl) {
      toast({
        variant: "destructive",
        title: "Location Required",
        description: "Please provide a location link so our team can find you."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const createBookingFunc = httpsCallable(functions, 'createBooking');
      await createBookingFunc(formData);
      setIsSubmitted(true);
      toast({
        title: "Booking Received",
        description: "Our team will contact you shortly to confirm your service request."
      });
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
        <main className="flex-grow flex items-center justify-center bg-muted/30 px-4">
          <Card className="w-full max-w-md text-center py-12 animate-in fade-in zoom-in duration-500">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl mb-2">Thank You!</CardTitle>
            <CardDescription className="text-lg">
              Your request for <strong>{formData.serviceType}</strong> has been successfully submitted.
            </CardDescription>
            <Button className="mt-8" onClick={() => window.location.href = "/"}>Return Home</Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-20 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold font-headline">Book a Service</h1>
              <p className="text-muted-foreground text-lg">
                Request professional liquid waste management services. Provide your details and location to help us reach you faster.
              </p>
            </div>

            <Card className="shadow-xl border-none">
              <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
                <CardTitle>Service Request Form</CardTitle>
                <CardDescription className="text-primary-foreground/80">All fields are mandatory</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input 
                        id="name" 
                        placeholder="John Doe" 
                        required 
                        value={formData.customerName}
                        onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input 
                        id="phone" 
                        placeholder="+250..." 
                        required 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service">Service Required *</Label>
                    <Select onValueChange={(val) => setFormData({...formData, serviceType: val})} required>
                      <SelectTrigger id="service">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Liquid Waste Collection">Liquid Waste Collection & Transport</SelectItem>
                        <SelectItem value="DWTS Installation">DWTS Installation</SelectItem>
                        <SelectItem value="Septic Tank Emptying">Septic Tank Emptying</SelectItem>
                        <SelectItem value="Maintenance">Maintenance & Consultancy</SelectItem>
                        <SelectItem value="Industrial Waste">Industrial Waste Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Label className="flex items-center gap-1">Location * <AlertCircle className="h-3 w-3 text-destructive" /></Label>
                    </div>
                    
                    <div className="space-y-4 p-4 border-2 border-dashed rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-2">
                        We need a map link to locate your site. Use the button to detect it automatically or paste a link from Google Maps.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          type="button" 
                          variant={locationMethod === 'auto' ? 'default' : 'outline'} 
                          size="sm" 
                          className="gap-2"
                          disabled={isLocating}
                          onClick={handleGetLocation}
                        >
                          {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                          Detect My Location
                        </Button>
                        <Button 
                          type="button" 
                          variant={locationMethod === 'manual' ? 'default' : 'outline'} 
                          size="sm" 
                          className="gap-2"
                          onClick={() => setLocationMethod('manual')}
                        >
                          <LinkIcon className="h-4 w-4" />
                          Paste Link Manually
                        </Button>
                      </div>

                      {(locationMethod === 'manual' || formData.locationUrl) && (
                        <div className="space-y-2 mt-4">
                          <Input 
                            placeholder="Paste Google Maps URL here" 
                            required
                            value={formData.locationUrl}
                            onChange={(e) => {
                              setFormData({...formData, locationUrl: e.target.value});
                              setLocationMethod('manual');
                            }}
                          />
                          {formData.locationUrl && (
                            <p className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Location link captured.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="desc">Additional Details</Label>
                    <Textarea 
                      id="desc" 
                      placeholder="Tell us more about your requirements..." 
                      className="min-h-[100px]"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 text-lg gap-2" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-5 w-5" /> Submit Request</>}
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
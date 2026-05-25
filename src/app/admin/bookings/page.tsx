
"use client";

import React from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { useUser, useDoc, useFirestore, useCollection, useFunctions } from "@/firebase";
import { doc, collection, query, orderBy } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  ChevronLeft, 
  ClipboardList, 
  ExternalLink, 
  Phone, 
  Mail, 
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function BookingsManagementPage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const functions = useFunctions();
  const { toast } = useToast();
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const userDocRef = React.useMemo(() => (db && user ? doc(db, "users", user.uid) : null), [db, user]);
  const { data: userProfile, loading: profileLoading } = useDoc(userDocRef);

  const bookingsQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, "bookings"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: bookings, loading: bookingsLoading } = useCollection(bookingsQuery);

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    if (!functions) return;
    setUpdatingId(bookingId);
    try {
      const updateFunc = httpsCallable(functions, 'adminUpdateBookingStatus');
      await updateFunc({ bookingId, status });
      toast({ title: "Status Updated", description: `Booking marked as ${status}.` });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <Badge className="bg-blue-500 text-white">Confirmed</Badge>;
      case 'completed': return <Badge className="bg-green-500 text-black">Completed</Badge>;
      case 'cancelled': return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isAuthorized = userProfile?.role === "admin";

  if (!user || !isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4">
          <Card className="w-full max-w-md text-center py-12">
            <ShieldAlert className="mx-auto h-12 w-12 text-destructive mb-4" />
            <CardTitle>Unauthorized Access</CardTitle>
            <p className="mt-2 text-muted-foreground">You do not have permission to view bookings.</p>
            <Button asChild className="mt-6">
              <Link href="/admin">Return to Dashboard</Link>
            </Button>
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
          <Button asChild variant="ghost" className="mb-5 -ml-2">
            <Link href="/admin"><ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
          </Button>
          
          <div className="flex justify-between items-end mb-5">
            <div>
              <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
                <ClipboardList className="h-8 w-8 text-primary" /> Service Requests
              </h1>
              <p className="text-muted-foreground">Manage incoming bookings and track service status.</p>
            </div>
            <Badge variant="outline" className="text-sm px-4 py-1">
              {bookings?.length || 0} Requests
            </Badge>
          </div>

          <div className="space-y-5">
            {bookingsLoading ? (
              <div className="py-20 text-center">
                <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
              </div>
            ) : bookings && bookings.length > 0 ? (
              bookings.map((booking: any) => (
                <Card key={booking.id} className="overflow-hidden border-l-4 border-l-primary hover:shadow-md transition-shadow">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 p-5">
                    <div className="space-y-2 lg:col-span-1">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(booking.status)}
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-bold">
                          <Calendar className="h-3 w-3" /> 
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold font-headline">{booking.customerName}</h3>
                      <div className="flex flex-col gap-1 text-sm text-muted-foreground font-medium">
                        <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> {booking.email}</span>
                        <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> {booking.phone}</span>
                      </div>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">Requested Service</div>
                        <div className="text-lg font-bold">{booking.serviceType}</div>
                      </div>
                      
                      {booking.description && (
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Details</div>
                          <p className="text-xs bg-muted/50 p-3 rounded-lg leading-relaxed">{booking.description}</p>
                        </div>
                      )}

                      {booking.locationUrl && (
                        <Button asChild variant="outline" size="sm" className="gap-2 h-8 text-[10px] uppercase font-bold tracking-widest border-primary text-primary">
                          <a href={booking.locationUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" /> View Location Link
                          </a>
                        </Button>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 justify-center border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 text-center">Actions</div>
                      {booking.status === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="gap-2 bg-primary text-black font-bold h-9"
                          onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                          disabled={updatingId === booking.id}
                        >
                          {updatingId === booking.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4" />} Confirm Request
                        </Button>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button 
                          size="sm" 
                          variant="default" 
                          className="bg-green-500 hover:bg-green-600 text-black font-bold gap-2 h-9"
                          onClick={() => handleUpdateStatus(booking.id, 'completed')}
                          disabled={updatingId === booking.id}
                        >
                          {updatingId === booking.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />} Mark Completed
                        </Button>
                      )}
                      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 h-9 text-[10px] font-bold uppercase tracking-widest"
                          onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                          disabled={updatingId === booking.id}
                        >
                          <XCircle className="h-4 w-4" /> Cancel Request
                        </Button>
                      )}
                      {(booking.status === 'completed' || booking.status === 'cancelled') && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-9 text-[10px] font-bold uppercase tracking-widest"
                          onClick={() => handleUpdateStatus(booking.id, 'pending')}
                          disabled={updatingId === booking.id}
                        >
                          Reset to Pending
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed">
                <ClipboardList className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                <h3 className="text-xl font-bold">No Bookings Yet</h3>
                <p className="text-muted-foreground">When customers request services, they will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

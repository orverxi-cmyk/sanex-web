
"use client";

import React from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { useUser, useDoc, useFirestore, useCollection } from "@/firebase";
import { doc, collection, query, orderBy } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Users, 
  ChevronLeft, 
  UserCheck, 
  UserX, 
  Loader2, 
  ShieldAlert,
  Search,
  Mail,
  Calendar
} from "lucide-react";
import { updateUserRole } from "@/app/actions/admin";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

export default function UserManagementPage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const { data: userProfile, loading: profileLoading } = useDoc(
    db && user ? doc(db, "users", user.uid) : null
  );

  const usersQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, "users"), orderBy("lastLogin", "desc"));
  }, [db]);

  const { data: allUsers, loading: usersLoading } = useCollection(usersQuery);

  const filteredUsers = React.useMemo(() => {
    if (!allUsers) return [];
    return allUsers.filter(u => 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allUsers, searchTerm]);

  const handleToggleRole = async (targetUser: any) => {
    if (!user) return;
    setUpdatingId(targetUser.id);
    const newRole = targetUser.role === "admin" ? "user" : "admin";
    try {
      await updateUserRole(user.uid, targetUser.id, newRole);
      toast({ title: "Updated", description: `Role for ${targetUser.displayName} changed to ${newRole}.` });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Action Failed", description: err.message });
    } finally {
      setUpdatingId(null);
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
            <p className="mt-2 text-muted-foreground">You do not have permission to view this page.</p>
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
      <main className="flex-grow py-12 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <Button asChild variant="ghost" className="mb-2 -ml-2">
                <Link href="/admin"><ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
              </Button>
              <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" /> User Management
              </h1>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search users..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Card className="shadow-sm border-none">
            <CardHeader className="border-b bg-white/50">
              <CardTitle>System Users</CardTitle>
              <CardDescription>Promote or demote users. Master Admin status is permanent.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                    <tr>
                      <th className="px-6 py-4 text-left">User Profile</th>
                      <th className="px-6 py-4 text-left">Current Role</th>
                      <th className="px-6 py-4 text-left">Last Seen</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {usersLoading ? (
                      <tr>
                        <td colSpan={4} className="py-20 text-center">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                          <p className="mt-2 text-muted-foreground">Loading users...</p>
                        </td>
                      </tr>
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {u.displayName?.charAt(0) || <Users className="h-4 w-4" />}
                              </div>
                              <div>
                                <div className="font-bold flex items-center gap-2">
                                  {u.displayName}
                                  {u.isMaster && <Badge variant="secondary" className="text-[10px] h-4">Master</Badge>}
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Mail className="h-3 w-3" /> {u.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={u.role === "admin" ? "default" : "outline"} className={u.role === "admin" ? "bg-primary" : ""}>
                              {u.role?.toUpperCase() || "USER"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "Never"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button 
                              variant={u.role === "admin" ? "destructive" : "secondary"} 
                              size="sm"
                              disabled={u.isMaster || updatingId === u.id}
                              onClick={() => handleToggleRole(u)}
                              className="gap-2"
                            >
                              {updatingId === u.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 
                               u.role === "admin" ? <><UserX className="h-3 w-3" /> Demote</> : <><UserCheck className="h-3 w-3" /> Promote</>}
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-20 text-center text-muted-foreground">
                          No users found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

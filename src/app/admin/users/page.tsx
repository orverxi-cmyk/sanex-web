
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Calendar,
  UserPlus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UserManagementPage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const functions = useFunctions();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = React.useState("");
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);
  const [isAdding, setIsAdding] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  // New User Form State
  const [newUser, setNewUser] = React.useState({
    email: "",
    displayName: "",
    isAdmin: false
  });

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
    if (!functions) return;
    setUpdatingId(targetUser.id);
    const newRole = targetUser.role === "admin" ? "user" : "admin";
    try {
      const updateRoleFunc = httpsCallable(functions, 'adminUpdateUserRole');
      await updateRoleFunc({ targetUserId: targetUser.id, newRole });
      toast({ title: "Updated", description: `Role for ${targetUser.displayName} changed to ${newRole}.` });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Action Failed", description: err.message });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!functions) return;
    
    setIsAdding(true);
    try {
      const addFunc = httpsCallable(functions, 'adminCreateUser');
      await addFunc({
        email: newUser.email,
        displayName: newUser.displayName,
        role: newUser.isAdmin ? 'admin' : 'user'
      });
      
      toast({ title: "User Added", description: `${newUser.displayName || newUser.email} has been provisioned.` });
      setIsDialogOpen(false);
      setNewUser({ email: "", displayName: "", isAdmin: false });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Failed to Add User", description: err.message });
    } finally {
      setIsAdding(false);
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
          <Card className="w-full max-w-md text-center py-5">
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
    <div className="min-h-screen flex flex-col font-arial">
      <Navbar />
      <main className="flex-grow py-5 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-4">
            <div>
              <Button asChild variant="ghost" className="mb-2 -ml-2">
                <Link href="/admin"><ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
              </Button>
              <h1 className="text-[16px] font-bold font-headline flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" /> System User Directory
              </h1>
            </div>
            
            <div className="flex flex-wrap gap-x-[5px] gap-y-[20px] w-full md:w-auto items-center">
              <div className="relative flex-grow md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search users..." 
                  className="pl-10 h-10 text-xs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="h-10 text-[10px] font-bold uppercase tracking-widest gap-2 bg-primary text-black">
                    <UserPlus className="h-4 w-4" /> Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={handleAddUser}>
                    <DialogHeader>
                      <DialogTitle>Provision New User</DialogTitle>
                      <DialogDescription>
                        Enter details to create a new system account.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[10px] font-bold uppercase">Email Address *</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          required 
                          className="h-10 text-sm"
                          value={newUser.email}
                          onChange={e => setNewUser({...newUser, email: e.target.value})}
                          placeholder="user@sanex.rw"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-[10px] font-bold uppercase">Full Name</Label>
                        <Input 
                          id="name" 
                          className="h-10 text-sm"
                          value={newUser.displayName}
                          onChange={e => setNewUser({...newUser, displayName: e.target.value})}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-2">
                        <Checkbox 
                          id="admin-role" 
                          checked={newUser.isAdmin}
                          onCheckedChange={(checked) => setNewUser({...newUser, isAdmin: !!checked})}
                        />
                        <Label htmlFor="admin-role" className="text-sm font-medium leading-none cursor-pointer">
                          Grant Administrative Access
                        </Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <div className="flex flex-wrap gap-x-[5px] gap-y-[20px] w-full pt-4">
                        <Button type="submit" className="flex-grow h-12 text-[12px] font-bold uppercase tracking-widest bg-primary text-black" disabled={isAdding}>
                          {isAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                          Create User
                        </Button>
                      </div>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card className="shadow-sm border-none overflow-hidden">
            <CardHeader className="border-b bg-white/50">
              <CardTitle className="text-sm font-bold">Manage Permissions</CardTitle>
              <CardDescription className="text-xs">Secure role promotion via Cloud Functions & Custom Claims.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-[14px] font-normal">
                  <thead className="bg-muted/50 text-muted-foreground font-bold border-b text-[10px] uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4 text-left">User Profile</th>
                      <th className="px-6 py-4 text-left">Current Role</th>
                      <th className="px-6 py-4 text-left">Last Activity</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y bg-white">
                    {usersLoading ? (
                      <tr>
                        <td colSpan={4} className="py-20 text-center">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                          <p className="mt-2 text-muted-foreground">Syncing directory...</p>
                        </td>
                      </tr>
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-muted/10 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {u.displayName?.charAt(0) || <Users className="h-4 w-4" />}
                              </div>
                              <div>
                                <div className="font-bold text-black flex items-center gap-2">
                                  {u.displayName}
                                  {u.isMaster && <Badge variant="secondary" className="text-[8px] h-4 font-bold uppercase tracking-widest px-1">Master</Badge>}
                                </div>
                                <div className="text-[12px] text-muted-foreground flex items-center gap-1">
                                  <Mail className="h-3 w-3" /> {u.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={u.role === "admin" ? "default" : "outline"} className={u.role === "admin" ? "bg-primary text-black font-bold text-[8px] tracking-widest uppercase" : "text-[8px] tracking-widest uppercase"}>
                              {u.role || "USER"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-muted-foreground text-[12px]">
                              <Calendar className="h-3 w-3" />
                              {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "Never"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex flex-wrap gap-x-[5px] gap-y-[20px] justify-end">
                              <Button 
                                variant={u.role === "admin" ? "destructive" : "secondary"} 
                                size="sm"
                                disabled={u.isMaster || updatingId === u.id || u.email === 'sanexcompany@gmail.com'}
                                onClick={() => handleToggleRole(u)}
                                className="h-8 text-[10px] font-bold uppercase tracking-widest"
                              >
                                {updatingId === u.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 
                                 u.role === "admin" ? "Demote" : "Promote"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-20 text-center text-muted-foreground italic">
                          No matches found for your search.
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

"use client";

import React from "react";
import { 
  signOut 
} from "firebase/auth";
import { useAuth, useUser } from "@/firebase";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User as UserIcon, LayoutDashboard, Loader2, Globe } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export function UserNav() {
  const { auth } = useAuth();
  const { user, loading } = useUser();
  const { toast } = useToast();

  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out.",
      });
    }
  };

  if (loading) {
    return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
  }

  // If not logged in, we return null to hide the "Sign In" link from the public front end.
  // Administrative login is handled exclusively on the /admin route.
  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full border">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
            <AvatarFallback>{user.displayName?.charAt(0) || <UserIcon />}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/" className="cursor-pointer flex items-center gap-2">
            <Globe className="h-4 w-4" /> Public Portal
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin" className="cursor-pointer flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" /> Admin Portal
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer flex items-center gap-2 font-medium">
          <LogOut className="h-4 w-4" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
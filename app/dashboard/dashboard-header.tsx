"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface DashboardHeaderProps {
  userEmail: string;
}

const DashboardHeader = ({ userEmail }: DashboardHeaderProps) => {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground hidden sm:inline">{userEmail}</span>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        <LogOut className="h-4 w-4 mr-2" />
        Sign out
      </Button>
    </div>
  );
};

export { DashboardHeader };

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Menu from "lucide-react/dist/esm/icons/menu";
import Home from "lucide-react/dist/esm/icons/home";
import CreditCard from "lucide-react/dist/esm/icons/credit-card";
import Settings from "lucide-react/dist/esm/icons/settings";
import BarChart3 from "lucide-react/dist/esm/icons/bar-chart-3";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "#", label: "Billing", icon: CreditCard },
  { href: "#", label: "Analytics", icon: BarChart3 },
  { href: "#", label: "Settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="px-4 py-4">
        <div className="text-lg font-semibold tracking-tight">Dashboard</div>
        <p className="text-sm text-muted-foreground">Manage and monitor</p>
      </div>
      <Separator />
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} className="block">
              <Button
                variant={active ? "secondary" : "ghost"}
                className="w-full justify-start gap-2"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-3 text-xs text-muted-foreground">
        v1.0 • All systems normal
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile */}
      <div className="flex items-center gap-2 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Open menu">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <div className="text-base font-semibold">Dashboard</div>
      </div>

      {/* Desktop */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col md:border-r">
        <SidebarContent />
      </aside>
    </>
  );
}



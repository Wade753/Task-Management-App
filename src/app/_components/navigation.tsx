"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Code, Users, Building2, Newspaper } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import AdminNavBar from "./admin-navigation";
//import { useSession } from "next-auth/react";

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const isDashboard = pathname.startsWith("/dashboard");
  const isLogin = pathname.startsWith("/login");
  const isSignup = pathname.startsWith("/register");
  const isCommentView = pathname.startsWith("/commetsView");
  //const { data: session } = useSession();

  if (isLogin || isSignup || isCommentView) {
    return null;
  }

  if (isDashboard || isCommentView) {
    return <AdminNavBar />;
  }

  //DASHBOARD BUTTON CHECK BEFORE ACCESS
  // const handleDashboardClick = () => {
  //   if (session?.user?.role === "ADMIN" || session?.user?.role === "WRITER") {
  //     router.push("/dashboard");
  //   } else {
  //     alert("You do not have permission to access the dashboard.");
  //   }
  // };

  return (
    <header className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-semibold">
            Kind of Wordpress Library
          </Link>
          <div className="hidden gap-6 md:flex">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-muted-foreground outline-none hover:text-foreground">
                Product
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[300px]">
                <DropdownMenuItem className="flex flex-col items-start p-3 focus:bg-muted">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-pink-500" />
                    <span className="font-semibold">For Creators</span>
                  </div>
                  <p className="ml-7 mt-1 text-sm text-muted-foreground">
                    YouTubers, bloggers, podcasters, musicians & artists
                  </p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start p-3 focus:bg-muted">
                  <div className="flex items-center gap-2">
                    <Newspaper className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold">For Publishers</span>
                  </div>
                  <p className="ml-7 mt-1 text-sm text-muted-foreground">
                    Writers, journalists, local news and new media outlets
                  </p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start p-3 focus:bg-muted">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-purple-500" />
                    <span className="font-semibold">For Business</span>
                  </div>
                  <p className="ml-7 mt-1 text-sm text-muted-foreground">
                    Modern brands & companies with ambitious content marketing
                  </p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start p-3 focus:bg-muted">
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-green-500" />
                    <span className="font-semibold">For Developers</span>
                  </div>
                  <p className="ml-7 mt-1 text-sm text-muted-foreground">
                    Source code, documentation, guides and tutorials
                  </p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/explore"
              className="text-muted-foreground hover:text-foreground"
            >
              Explore
            </Link>
            <Link
              href="/resources"
              className="text-muted-foreground hover:text-foreground"
            >
              Resources
            </Link>
            <Link
              href="/pricing"
              className="text-muted-foreground hover:text-foreground"
            >
              Pricing
            </Link>
          </div>
        </div>
        <div className="ml-auto flex gap-4">
          <Button onClick={() => router.push("/login")}>Login</Button>
          <Button onClick={() => router.push("/dashboard")}>Dashboard</Button>
        </div>
      </nav>
    </header>
  );
}

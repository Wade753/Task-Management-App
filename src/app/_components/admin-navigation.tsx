"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, SessionProvider } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { signOut } from "next-auth/react";
import { type Session } from "next-auth";

const Navbar = ({ session }: { session: Session }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleDisconnect = (): void => {
    setIsLoading(true);
    if (typeof window !== "undefined") {
      // document.cookie = `${
      //   !!process.env.VERCEL_URL ? "__Secure-" : ""
      // }next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      document.cookie =
        "next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "__Secure-next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    signOut({
      callbackUrl: `${window.location.origin}/`,
      redirect: true,
    }).catch((err) => {
      console.error(err);
      setIsLoading(false);
    });
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="text-xl font-bold text-gray-900">MyApp</div>
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-gray-700">
              {session?.user?.name} ({session?.user?.role})
            </span>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Button variant="destructive" onClick={handleDisconnect}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              <span className="ml-2">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const AdminNav = () => {
  const { data: session } = useSession();
  console.log("🚀 ~ Dashboard ~ session:", session);
  if (!session) {
    return;
  }

  return (
    <div>
      <Navbar session={session} />
      <div className="p-4">Dashboard Content</div>
    </div>
  );
};

const AdminNavBar = () => {
  return (
    <SessionProvider>
      <AdminNav />
    </SessionProvider>
  );
};

export default AdminNavBar;

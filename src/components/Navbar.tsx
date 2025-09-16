"use client"
import Link from "next/link";
import SignupButton from "./SignupButton";
import { ModeToggle } from "./ModeToggle";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <nav className="flex items-center justify-between p-4 bg-background border-b mx-auto px-40">
      <div className="text-lg font-semibold">Blogs</div>
      <div className="flex items-center space-x-4">
        <Link
          href="/"
          className="hover:border-b-2 border-current transition-all"
        >
          Home
        </Link>
        {isAdmin && (
          <Link
            href="/admin/create"
            className="hover:border-b-2 border-current transition-all"
          >
            create
          </Link>
        )}
        <ModeToggle />
        <SignupButton />
      </div>
    </nav>
  );
};

export default Navbar;

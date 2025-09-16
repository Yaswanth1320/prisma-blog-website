"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession, signIn, signOut } from "next-auth/react";

const SignupButton = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Skeleton className="h-10 w-24" />
    );
  }

  if (session) {
    return (
      <>
        <Button onClick={() => signOut()} className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl">Sign out</Button>
      </>
    );
  }
  return (
    <>
      <Button onClick={() => signIn()} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">Sign in</Button>
    </>
  );
};

export default SignupButton;

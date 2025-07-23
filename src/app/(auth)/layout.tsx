"use client";
import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";
import React from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  if (session) {
    return null;
  }

  return (
    <BackgroundBeamsWithCollision>
      <div className="">
        <div className="">{children}</div>
      </div>
    </BackgroundBeamsWithCollision>
  );
};

export default AuthLayout;

"use client";

import { ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAllowed(true);
      } else {
        setIsAllowed(false);
        router.replace("/login");
      }

      setChecking(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl">
          Memeriksa akses...
        </div>
      </div>
    );
  }

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
}

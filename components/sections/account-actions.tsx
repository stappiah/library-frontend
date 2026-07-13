"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/store/slices/authSlice";

export function AccountActions() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await dispatch(logoutUser());
    router.push("/login");
  };

  return (
    <Button variant="secondary" onClick={handleLogout} disabled={isLoggingOut}>
      {isLoggingOut ? "Signing out..." : "Log out"}
    </Button>
  );
}

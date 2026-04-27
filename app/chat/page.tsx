"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// AI chat not enabled in this deployment — redirect to calculator
export default function ChatRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/profile");
  }, [router]);
  return null;
}

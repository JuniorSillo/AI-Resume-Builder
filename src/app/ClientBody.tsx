"use client";

import { useState, useEffect, ReactNode } from "react";
import { MainLayout } from "@/components/layout/MainLayout";

interface ClientBodyProps {
  children: ReactNode;
}

export function ClientBody({ children }: ClientBodyProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <MainLayout>{children}</MainLayout>;
}

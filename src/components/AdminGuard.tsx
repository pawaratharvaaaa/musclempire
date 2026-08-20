import { useEffect } from "react";
import { useLocation } from "wouter";
import { isLoggedIn } from "@/lib/adminAuth";
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [, navigate] = useLocation();
  useEffect(() => { if (!isLoggedIn()) navigate("/sagarkharat"); }, []);
  if (!isLoggedIn()) return null;
  return <>{children}</>;
}
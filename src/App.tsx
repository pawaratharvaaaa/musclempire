import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import FloatingContact from "@/components/FloatingContact";
import DemoBar from "@/components/DemoBar";

const NotFound = lazy(() => import("@/pages/not-found"));
const Home = lazy(() => import("@/pages/Home"));
const Products = lazy(() => import("@/pages/Products"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const NutritionAssessment = lazy(() => import("@/pages/NutritionAssessment"));
const Offers = lazy(() => import("@/pages/Offers"));
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const AdminCustomer = lazy(() => import("@/pages/AdminCustomer"));
const AdminTrackRecord = lazy(() => import("@/pages/AdminTrackRecord"));

const queryClient = new QueryClient();

// Ctrl+Shift+A opens admin login
function AdminShortcut() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        window.location.href = "/pronectar-admin-2026";
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  return null;
}

function PublicWidgets() {
  const [location] = useLocation();
  if (location.startsWith("/pronectar-admin-2026")) return null;
  return (
    <>
      <FloatingContact />
      <DemoBar />
    </>
  );
}

function Router() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/products/:id" component={ProductDetail} />
        <Route path="/nutrition" component={NutritionAssessment} />
        <Route path="/offers" component={Offers} />
        {/* Private admin routes */}
        <Route path="/pronectar-admin-2026" component={AdminLogin} />
        <Route path="/pronectar-admin-2026/dashboard" component={AdminDashboard} />
        <Route path="/pronectar-admin-2026/customer/:id" component={AdminCustomer} />
        <Route path="/pronectar-admin-2026/track/:phone" component={AdminTrackRecord} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AdminShortcut />
          <Router />
          <PublicWidgets />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

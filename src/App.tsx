
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Coupons from "./pages/Coupons";
import Users from "./pages/Users";
import Affiliates from "./pages/Affiliates";
import PublicAffiliateRegistration from "./pages/PublicAffiliateRegistration";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro-afiliado" element={<PublicAffiliateRegistration />} />
              
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/cupons" element={<Coupons />} />
                <Route path="/afiliados" element={<Affiliates />} />
                <Route path="/usuarios" element={<Users />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

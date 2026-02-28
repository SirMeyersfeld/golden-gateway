import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Deals from "./pages/Deals";
import Portfolio from "./pages/Portfolio";
import Documents from "./pages/Documents";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import InvestWizard from "./pages/InvestWizard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageDeals from "./pages/admin/ManageDeals";
import DealForm from "./pages/admin/DealForm";
import Investors from "./pages/admin/Investors";
import CapitalCalls from "./pages/admin/CapitalCalls";
import Studio from "./pages/admin/Studio";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/deals" element={<Deals />} />
                      <Route path="/portfolio" element={<Portfolio />} />
                      <Route path="/documents" element={<Documents />} />
                      <Route path="/invest" element={<InvestWizard />} />

                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/admin/deals" element={<ManageDeals />} />
                      <Route path="/admin/deals/new" element={<DealForm />} />
                      <Route path="/admin/deals/:id/edit" element={<DealForm />} />
                      <Route path="/admin/investors" element={<Investors />} />
                      <Route path="/admin/capital-calls" element={<CapitalCalls />} />
                      <Route path="/admin/studio" element={<Studio />} />

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

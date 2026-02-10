import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Publications from "./pages/Publications";
import PDFViewer from "./pages/PDFViewer";
import Conferences from "./pages/Conferences";
import Standards from "./pages/Standards";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SubmitPaper from "./pages/SubmitPaper";
import VerifyCertificate from "./pages/VerifyCertificate";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AuthorDashboard from "./pages/author/AuthorDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="/publications/:type" element={<Publications />} />
            <Route path="/view-pdf" element={<PDFViewer />} />
            <Route path="/conferences" element={<Conferences />} />
            <Route path="/standards" element={<Standards />} />
            <Route path="/guidelines" element={<Standards />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/submit" element={<SubmitPaper />} />
            <Route path="/verify" element={<VerifyCertificate />} />
            <Route path="/verify/:id" element={<VerifyCertificate />} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <AuthorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

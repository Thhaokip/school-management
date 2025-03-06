
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import SchoolProfile from "./pages/SchoolProfile";
import AcademicSessions from "./pages/AcademicSessions";
import Students from "./pages/Students";
import Accountants from "./pages/Accountants";
import FeeManagement from "./pages/FeeManagement";
import Payments from "./pages/Payments";
import Classes from "./pages/Classes";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes - Accessible by all authenticated users */}
            <Route element={<ProtectedRoute />}>
              <Route path="/payments" element={<Payments />} />
            </Route>

            {/* Admin Only Routes */}
            <Route element={<ProtectedRoute requiredRoles={['admin']} />}>
              <Route path="/" element={<Index />} />
              <Route path="/school-profile" element={<SchoolProfile />} />
              <Route path="/academic-sessions" element={<AcademicSessions />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/students" element={<Students />} />
              <Route path="/accountants" element={<Accountants />} />
              <Route path="/fee-management" element={<FeeManagement />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Redirect to login if not found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;

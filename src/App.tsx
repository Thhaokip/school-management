
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SchoolProfile from "./pages/SchoolProfile";
import AcademicSessions from "./pages/AcademicSessions";
import Students from "./pages/Students";
import Accountants from "./pages/Accountants";
import FeeManagement from "./pages/FeeManagement";
import Payments from "./pages/Payments";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/school-profile" element={<SchoolProfile />} />
          <Route path="/academic-sessions" element={<AcademicSessions />} />
          <Route path="/students" element={<Students />} />
          <Route path="/accountants" element={<Accountants />} />
          <Route path="/fee-management" element={<FeeManagement />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

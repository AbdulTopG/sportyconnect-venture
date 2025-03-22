
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";
import Matches from "./pages/Matches";
import MatchDetail from "./pages/MatchDetail";
import CreateMatch from "./pages/CreateMatch";
import Tournaments from "./pages/Tournaments";
import TournamentDetail from "./pages/TournamentDetail";
import Leaderboards from "./pages/Leaderboards";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Venues from "./pages/Venues";
import VenueDetail from "./pages/VenueDetail";
import RequestVenue from "./pages/RequestVenue";
import Bookings from "./pages/Bookings";
import Admin from "./pages/Admin";
import AdminAddVenue from "./pages/AdminAddVenue";
import AdminEditVenue from "./pages/AdminEditVenue";
import UserDashboard from "./pages/UserDashboard";
import WatchMatches from "./pages/WatchMatches";
import Messages from "./pages/Messages";

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
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/matches/create" element={<CreateMatch />} />
            <Route path="/matches/:id" element={<MatchDetail />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/tournaments/:id" element={<TournamentDetail />} />
            <Route path="/leaderboards" element={<Leaderboards />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/venues/:id" element={<VenueDetail />} />
            <Route path="/venues/request" element={<RequestVenue />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/add-venue" element={<AdminAddVenue />} />
            <Route path="/admin/edit-venue/:id" element={<AdminEditVenue />} />
            <Route path="/watch" element={<WatchMatches />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

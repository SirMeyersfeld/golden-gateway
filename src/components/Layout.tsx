import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Briefcase, PieChart, FileText, Menu, X, LogOut, User, Settings } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const navItems = [
  { label: "Overview", path: "/", icon: LayoutDashboard },
  { label: "Deals", path: "/deals", icon: Briefcase },
  { label: "Portfolio", path: "/portfolio", icon: PieChart },
  { label: "Documents", path: "/documents", icon: FileText },
];

const adminNavItem = { label: "Admin", path: "/admin", icon: Settings };

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, role, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  const roleLabel = role === "fund_manager" ? "Fund Manager" : "Investor";
  const allNav = [...navItems, ...(role === "fund_manager" ? [adminNavItem] : [])];

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-gold" />
            <span className="font-display text-lg font-semibold gradient-gold-text tracking-tight">
              Vanguard Capital
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {allNav.map((item) => {
              const active = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2.5">
            <span className="text-[11px] font-medium text-muted-foreground border border-border/60 rounded-md px-2 py-0.5 uppercase tracking-wider">
              {roleLabel}
            </span>
            <div className="w-px h-5 bg-border/60" />
            <div className="flex items-center gap-1.5 text-sm text-foreground">
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <span className="max-w-[120px] truncate text-[13px]">{user?.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted/50"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <button
            className="md:hidden text-foreground p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-border/60 overflow-hidden bg-background/95 backdrop-blur-xl"
            >
              <nav className="px-4 py-3 flex flex-col gap-0.5">
                {allNav.map((item) => {
                  const active = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
                <div className="divider-gold my-2" />
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm text-muted-foreground truncate">{user?.email}</span>
                  <button onClick={handleSignOut} className="text-muted-foreground hover:text-foreground p-2">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main content */}
      <main className="pt-16">{children}</main>
    </div>
  );
}

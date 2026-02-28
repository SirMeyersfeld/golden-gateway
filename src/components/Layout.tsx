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
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="w-8 h-8 rounded-lg bg-brand-teal"
            />
            <span className="text-lg font-bold text-foreground tracking-tight group-hover:text-brand-teal transition-colors">
              Capital Harbour
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 relative">
            {allNav.map((item) => {
              const active = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                    active
                      ? "text-brand-teal"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-active-bg"
                      className="absolute inset-0 bg-brand-teal/8 rounded-lg border border-brand-teal/15"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2.5">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[11px] font-semibold text-muted-foreground border border-border rounded-md px-2.5 py-1 uppercase tracking-wider bg-secondary"
            >
              {roleLabel}
            </motion.span>
            <div className="w-px h-5 bg-border" />
            <div className="flex items-center gap-1.5 text-sm text-foreground">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center"
              >
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </motion.div>
              <span className="max-w-[120px] truncate text-[13px]">{user?.email}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-secondary"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </motion.button>
          </div>

          <button
            className="md:hidden text-foreground p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="md:hidden border-t border-border overflow-hidden bg-card/95 backdrop-blur-xl"
            >
              <nav className="px-4 py-3 flex flex-col gap-0.5">
                {allNav.map((item, i) => {
                  const active = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          active
                            ? "bg-brand-teal/10 text-brand-teal"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    </motion.div>
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
      </motion.header>

      {/* Main content */}
      <main className="pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)", transition: { duration: 0.2 } }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

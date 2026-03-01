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
      {/* Top nav — Stripe/DD pill-style */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-3">
          <div className="flex items-center justify-between h-14 px-4 rounded-2xl bg-background/60 backdrop-blur-2xl border border-border/50 shadow-[0_2px_16px_hsl(0_0%_0%/0.15)]">
            <Link to="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: 12, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="w-7 h-7 rounded-lg gradient-gold"
              />
              <span className="font-display text-[15px] font-semibold gradient-gold-text tracking-tight group-hover:opacity-80 transition-opacity">
                Vanguard Capital
              </span>
            </Link>

            {/* Desktop nav — pill container */}
            <nav className="hidden md:flex items-center gap-0.5 bg-muted/40 rounded-xl p-1 border border-border/30">
              {allNav.map((item) => {
                const active = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-all duration-200 ${
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-background/80 rounded-lg shadow-sm border border-border/40"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <item.icon className="w-3.5 h-3.5" />
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
                className="pill-badge text-[10px]"
              >
                {roleLabel}
              </motion.span>
              <div className="w-px h-5 bg-border/60" />
              <div className="flex items-center gap-1.5 text-sm text-foreground">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-7 h-7 rounded-full bg-muted flex items-center justify-center"
                >
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                </motion.div>
                <span className="max-w-[120px] truncate text-[12.5px]">{user?.email}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted/50"
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
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              className="md:hidden mx-4 mt-2 overflow-hidden rounded-2xl bg-background/95 backdrop-blur-2xl border border-border/50 shadow-lg"
            >
              <nav className="px-3 py-3 flex flex-col gap-0.5">
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
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                          active
                            ? "bg-primary/10 text-primary"
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
      <main className="pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const } }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)", transition: { duration: 0.2 } }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

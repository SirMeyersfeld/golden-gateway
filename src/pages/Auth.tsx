import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Briefcase, TrendingUp, Mail, Lock, User, Shield, CheckCircle2, ArrowRight } from "lucide-react";

type Mode = "login" | "signup" | "forgot";
type AppRole = "investor" | "fund_manager";

const trustIndicators = [
  { icon: Shield, text: "SEC-compliant SPV structures" },
  { icon: CheckCircle2, text: "Built by Liam Meyersfeld" },
  { icon: TrendingUp, text: "$2.4B+ assets under management" },
];

export default function Auth() {
  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<AppRole>("investor");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
        toast.success("Welcome back!");
        navigate("/");
      } else if (mode === "signup") {
        await signUp(email, password, fullName, role);
        toast.success("Account created! Check your email to confirm.");
      } else {
        await resetPassword(email);
        toast.success("Password reset email sent!");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel -- branding & trust */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden">
        <div className="absolute inset-0 bg-foreground" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-teal/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-brand-teal/5 blur-[100px]" />

        <div className="relative flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-teal" />
            <span className="text-xl font-bold text-primary-foreground tracking-tight">
              Capital Harbour
            </span>
          </div>

          {/* Hero text */}
          <div className="max-w-md">
            <h1 className="text-4xl xl:text-5xl font-extrabold leading-[1.15] mb-6 text-balance text-primary-foreground">
              Institutional-Grade
              <br />
              <span className="text-brand-teal">Private Equity</span>
              <br />
              Access
            </h1>
            <p className="text-primary-foreground/60 leading-relaxed text-[15px]">
              Join 2,400+ accredited investors deploying capital into
              top-quartile opportunities through our regulated platform.
            </p>

            {/* Trust indicators */}
            <div className="mt-10 space-y-4">
              {trustIndicators.map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.12 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-teal/15 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-brand-teal" />
                  </div>
                  <span className="text-sm text-primary-foreground/70">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-6 text-xs text-primary-foreground/40">
            <span>SEC Registered</span>
            <span className="w-1 h-1 rounded-full bg-primary-foreground/20" />
            <span>SOC 2 Type II</span>
            <span className="w-1 h-1 rounded-full bg-primary-foreground/20" />
            <span>FINRA Member</span>
          </div>
        </div>
      </div>

      {/* Right panel -- form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[400px] relative"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="w-10 h-10 rounded-lg bg-brand-teal mx-auto mb-3" />
            <h1 className="text-xl font-bold text-foreground">
              Capital Harbour
            </h1>
          </div>

          {/* Form header */}
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold mb-1.5 text-foreground">
              {mode === "login" && "Welcome back"}
              {mode === "signup" && "Create your account"}
              {mode === "forgot" && "Reset password"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {mode === "login" && "Sign in to access your portfolio and deals."}
              {mode === "signup" && "Get started with institutional-grade investing."}
              {mode === "forgot" && "We'll send you a link to reset your password."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5"
                >
                  <Label htmlFor="name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Smith"
                      className="pl-11 h-11 bg-secondary border-border focus:border-brand-teal/40 transition-colors"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-11 h-11 bg-secondary border-border focus:border-brand-teal/40 transition-colors"
                  required
                />
              </div>
            </div>

            {mode !== "forgot" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Password
                  </Label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-xs text-brand-teal hover:text-brand-teal/80 transition-colors"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-11 h-11 bg-secondary border-border focus:border-brand-teal/40 transition-colors"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div
                  key="role"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5"
                >
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Account Type
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "investor" as AppRole, label: "Investor", icon: TrendingUp, desc: "Browse & invest" },
                      { value: "fund_manager" as AppRole, label: "Fund Manager", icon: Briefcase, desc: "Manage deals" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setRole(opt.value)}
                        className={`flex flex-col items-start gap-1 p-3.5 rounded-lg border text-left transition-all duration-200 ${
                          role === opt.value
                            ? "border-brand-teal/40 bg-brand-teal/5 ring-1 ring-brand-teal/20"
                            : "border-border bg-secondary hover:border-muted-foreground/20"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <opt.icon className={`w-4 h-4 ${role === opt.value ? "text-brand-teal" : "text-muted-foreground"}`} />
                          <span className={`text-sm font-medium ${role === opt.value ? "text-foreground" : "text-foreground"}`}>
                            {opt.label}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-teal h-11 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2 glow-gold"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Mode switcher */}
          <div className="mt-8 text-center">
            <div className="divider-gold mb-6" />
            {mode === "login" && (
              <p className="text-sm text-muted-foreground">
                {"Don't have an account? "}
                <button onClick={() => setMode("signup")} className="text-brand-teal font-semibold hover:text-brand-teal/80 transition-colors">
                  Create one
                </button>
              </p>
            )}
            {mode === "signup" && (
              <p className="text-sm text-muted-foreground">
                {"Already have an account? "}
                <button onClick={() => setMode("login")} className="text-brand-teal font-semibold hover:text-brand-teal/80 transition-colors">
                  Sign in
                </button>
              </p>
            )}
            {mode === "forgot" && (
              <button
                onClick={() => setMode("login")}
                className="text-sm text-brand-teal font-semibold hover:text-brand-teal/80 transition-colors"
              >
                Back to sign in
              </button>
            )}
          </div>

          {/* Mobile trust bar */}
          <div className="lg:hidden mt-10 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
            <span>SEC Registered</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            <span>SOC 2 Type II</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            <span>FINRA</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

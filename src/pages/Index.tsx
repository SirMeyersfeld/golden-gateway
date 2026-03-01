import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Users, BarChart3, Lock, CheckCircle2, Zap, Globe } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

type CmsBlock = {
  key: string;
  title: string | null;
  body: string | null;
  data: any | null;
};

const defaultStats = [
  { label: "Assets Under Management", value: "$2.4B", key: "aum" },
  { label: "Active Deals", value: "47", key: "active_deals" },
  { label: "Avg. Net IRR", value: "28.3%", key: "net_irr" },
  { label: "Portfolio Companies", value: "186", key: "companies" },
];

const features = [
  {
    icon: TrendingUp,
    title: "Deal Flow",
    desc: "Access curated private equity opportunities with institutional-grade due diligence and transparent structures.",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Shield,
    title: "SPV Investing",
    desc: "Invest through Special Purpose Vehicles with transparent fee structures, governance, and regulatory compliance.",
    gradient: "from-violet-500/20 to-purple-500/20",
  },
  {
    icon: Users,
    title: "Co-Investment",
    desc: "Join alongside top-tier General Partners with lower minimums and aligned incentive structures.",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: BarChart3,
    title: "Portfolio Analytics",
    desc: "Real-time performance tracking with benchmarking against public and private market indices.",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
];

const trustItems = [
  { icon: Lock, text: "Bank-grade 256-bit encryption" },
  { icon: Shield, text: "SEC-registered investment advisor" },
  { icon: CheckCircle2, text: "SOC 2 Type II certified" },
];

const tickerItems = [
  { label: "Aether Robotics", metric: "Series C", tag: "AI Robotics" },
  { label: "NovaPay", metric: "Fintech SPV", tag: "Payments" },
  { label: "BioSphere Health", metric: "Growth Equity", tag: "Healthcare" },
  { label: "Helios Energy", metric: "Infra Fund II", tag: "Energy" },
  { label: "Stratos Cloud", metric: "Co-invest", tag: "Cloud Infra" },
  { label: "Quantum Ledger", metric: "Digital Assets", tag: "Ledger Tech" },
];

const logos = ["Sequoia", "a16z", "Tiger Global", "Coatue", "Insight Partners"];

const fade = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function Index() {
  const prefersReducedMotion = useReducedMotion();
  const brand = "Vanguard Capital";

  const { data: cmsBlocks } = useQuery<CmsBlock[]>({
    queryKey: ["cms-landing"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("cms_blocks")
        .select("*")
        .in("key", ["landing_hero", "landing_stats"]);
      if (error) throw error;
      return (data ?? []) as CmsBlock[];
    },
  });

  const byKey = (cmsBlocks ?? []).reduce<Record<string, CmsBlock>>((acc, block) => {
    acc[block.key] = block;
    return acc;
  }, {});

  const heroBlock = byKey["landing_hero"];
  const statsBlock = byKey["landing_stats"];

  const heroBadge = heroBlock?.data?.badge ?? "Private Equity Reimagined";
  const heroBody =
    heroBlock?.body ??
    "Institutional access to premium private equity deals, delivered through a seamless, regulated digital platform. Browse, commit, and track — all in one place.";

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 30,
      scale: prefersReducedMotion ? 1 : 0.88,
      rotateX: prefersReducedMotion ? 0 : -70,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: prefersReducedMotion
        ? { duration: 0.2 }
        : {
            delay: 0.3 + i * 0.04,
            type: "spring" as const,
            stiffness: 720,
            damping: 38,
          },
    }),
  };

  return (
    <div>
      {/* Hero — Stripe-inspired gradient mesh + large type */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card/50" />
        <div aria-hidden className="pointer-events-none absolute inset-0 gradient-mesh" />
        <div aria-hidden className="pointer-events-none absolute inset-0 aurora" />
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-overlay" />
        <div className="absolute inset-0 texture-noise" />

        {/* Floating glass cards — DirectDebit style */}
        <div className="pointer-events-none absolute inset-y-24 right-6 hidden xl:flex flex-col gap-5">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            style={{ animation: "float 8s ease-in-out infinite" }}
            className="bento-card px-5 py-4 min-w-[240px]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="section-label text-[10px]">Live Allocation</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-[10px] text-emerald-300 font-medium">
                Auto-updating
              </span>
            </div>
            <p className="font-display text-xl font-bold">+3.2%</p>
            <p className="text-xs text-muted-foreground mt-0.5">this quarter</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            style={{ animation: "float 10s ease-in-out infinite 2s" }}
            className="bento-card px-5 py-4 min-w-[240px]"
          >
            <p className="section-label text-[10px] mb-2">Next Capital Call</p>
            <p className="text-sm font-medium">Helios Energy Fund II</p>
            <p className="text-xs text-muted-foreground mt-0.5">Due Jun 28, 2026</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            style={{ animation: "float 9s ease-in-out infinite 4s" }}
            className="bento-card px-5 py-4 min-w-[240px]"
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="section-label text-[10px]">New Deal</span>
            </div>
            <p className="text-sm font-medium">Aether Robotics — Series C</p>
            <div className="mt-2 h-1 rounded-full bg-secondary overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "68%" }}
                transition={{ delay: 2.2, duration: 1.2 }}
                className="h-full rounded-full gradient-gold"
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">68% funded</p>
          </motion.div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.div variants={fade} custom={0} className="pill-badge mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {heroBadge}
            </motion.div>

            <motion.h1
              variants={fade}
              custom={1}
              className="mb-5 text-balance"
            >
              <span className="sr-only">
                Vanguard Capital — Institutional access, modern infrastructure for private markets.
              </span>
              <span
                aria-hidden
                className="block font-display text-4xl sm:text-5xl lg:text-[4rem] xl:text-[4.5rem] font-bold leading-[1.05] hero-wordmark"
              >
                {brand.split("").map((char, i) => (
                  <motion.span
                    key={`${char}-${i}`}
                    custom={i}
                    variants={letterVariants}
                    className="inline-block hero-letter"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </span>
            </motion.h1>

            {!prefersReducedMotion && (
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 1.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="h-[2px] w-[min(520px,90%)] origin-left rounded-full gradient-gold opacity-80 mb-8"
              />
            )}

            <motion.p
              variants={fade}
              custom={2}
              className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-xl mb-12 leading-relaxed"
            >
              {heroBody}
            </motion.p>

            <motion.div variants={fade} custom={3} className="flex gap-4 flex-wrap">
              <motion.div whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/deals"
                  className="gradient-gold text-primary-foreground px-8 py-4 rounded-xl font-semibold inline-flex items-center gap-2.5 hover:opacity-90 transition-all glow-gold text-sm shadow-lg"
                >
                  Explore Deals <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/portfolio"
                  className="border border-border/60 bg-background/50 backdrop-blur-sm px-8 py-4 rounded-xl font-semibold text-foreground hover:bg-muted/50 hover:border-border transition-all text-sm"
                >
                  View Portfolio
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              variants={fade}
              custom={4}
              className="flex flex-wrap items-center gap-6 mt-14 pt-8 border-t border-border/30"
            >
              {trustItems.map((item) => (
                <div key={item.text} className="flex items-center gap-2">
                  <item.icon className="w-3.5 h-3.5 text-primary/70" />
                  <span className="text-xs text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Logo bar — Stripe style */}
      <section className="border-y border-border/30 bg-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] text-center mb-4">
            Trusted by leading institutional investors
          </p>
          <div className="flex items-center justify-center gap-10 flex-wrap">
            {logos.map((logo, i) => (
              <motion.span
                key={logo}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.5 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-sm font-display font-semibold text-muted-foreground/60 tracking-wide"
              >
                {logo}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Deal ticker */}
      <section className="border-b border-border/30 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="section-label">Live Deal Flow</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />
            <motion.div
              className="flex gap-4 whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            >
              {[...tickerItems, ...tickerItems].map((item, idx) => (
                <div
                  key={`${item.label}-${idx}`}
                  className="bento-card rounded-full px-4 py-2 flex items-center gap-3 !shadow-none"
                >
                  <span className="text-xs font-medium">{item.label}</span>
                  <span className="text-[11px] text-muted-foreground">{item.metric}</span>
                  <span className="pill-badge !py-0.5 !px-2 !text-[10px]">
                    {item.tag}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-border/30 bg-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {defaultStats.map((s, i) => {
            const override = (statsBlock?.data as any)?.[s.key];
            const value = typeof override === "string" && override.trim() ? override : s.value;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl font-display font-bold gradient-gold-text">
                  {value}
                </p>
                <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">{s.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features — Bento grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="section-label mb-4">Platform</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 text-balance">
            End-to-End Infrastructure
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Everything you need to discover, evaluate, and manage private market investments
            — from deal sourcing to portfolio monitoring.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bento-card p-8 group relative overflow-hidden"
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${f.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center mb-6 shadow-lg">
                  <f.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bento-card rounded-3xl p-12 sm:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 gradient-mesh opacity-50" />
          <div className="relative">
            <p className="section-label mb-4">Get Started</p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-5 text-balance">
              Ready to Access Premium Deal Flow?
            </h2>
            <p className="text-muted-foreground mb-10 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
              Join a network of 2,400+ accredited investors deploying capital
              into top-quartile private equity opportunities.
            </p>
            <motion.div whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link
                to="/deals"
                className="gradient-gold text-primary-foreground px-10 py-4 rounded-xl font-semibold inline-flex items-center gap-2.5 hover:opacity-90 transition-all glow-gold text-sm shadow-lg"
              >
                Start Investing <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded gradient-gold" />
            <p className="text-sm text-muted-foreground">
              © 2026 Vanguard Capital. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

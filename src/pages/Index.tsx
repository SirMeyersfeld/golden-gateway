import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Users, BarChart3, Lock, CheckCircle2 } from "lucide-react";
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
  },
  {
    icon: Shield,
    title: "SPV Investing",
    desc: "Invest through Special Purpose Vehicles with transparent fee structures, governance, and regulatory compliance.",
  },
  {
    icon: Users,
    title: "Co-Investment",
    desc: "Join alongside top-tier General Partners with lower minimums and aligned incentive structures.",
  },
  {
    icon: BarChart3,
    title: "Portfolio Analytics",
    desc: "Real-time performance tracking with benchmarking against public and private market indices.",
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

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function Index() {
  const prefersReducedMotion = useReducedMotion();
  const brand = "Vanguard Capital";

  const { data: cmsBlocks } = useQuery<CmsBlock[]>({
    queryKey: ["cms-landing"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_blocks")
        .select("*")
        .in("key", ["landing_hero", "landing_stats"]);
      if (error) throw error;
      return data as CmsBlock[];
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
      y: prefersReducedMotion ? 0 : 26,
      scale: prefersReducedMotion ? 1 : 0.9,
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
            delay: 0.3 + i * 0.05,
            type: "spring",
            stiffness: 720,
            damping: 40,
          },
    }),
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card/50" />
        <div aria-hidden className="pointer-events-none absolute inset-0 aurora" />
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-overlay" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[140px]" />
        <div className="absolute bottom-1/3 left-1/5 w-[350px] h-[350px] rounded-full bg-primary/[0.02] blur-[100px]" />
        <div className="absolute inset-0 texture-noise" />

        {/* Floating badges on the right for extra motion */}
        <div className="pointer-events-none absolute inset-y-24 right-6 hidden xl:flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: [0, -6, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="glass-card px-4 py-3 rounded-xl border border-primary/20 shadow-lg min-w-[220px]"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Live Allocation
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-[10px] text-emerald-300">
                Auto-updating
              </span>
            </div>
            <p className="font-display text-lg font-semibold">+3.2% this quarter</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: [0, 6, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="glass-card px-4 py-3 rounded-xl border border-border/60 min-w-[220px]"
          >
            <p className="text-[11px] text-muted-foreground mb-1 uppercase tracking-widest">
              Next Capital Call
            </p>
            <p className="text-sm font-medium">Helios Energy Fund II · Jun 28</p>
          </motion.div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.div
              variants={fade}
              custom={0}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/[0.06] mb-8"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-primary text-xs font-medium tracking-wide uppercase">
                {heroBadge}
              </span>
            </motion.div>

            <motion.h1
              variants={fade}
              custom={1}
              className="mb-4 text-balance"
            >
              <span className="sr-only">
                Vanguard Capital — Institutional access, modern infrastructure for private markets.
              </span>
              <span
                aria-hidden
                className="block font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-bold leading-[1.08] hero-wordmark"
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

            {/* Underline reveal for extra “product launch” polish */}
            {!prefersReducedMotion && (
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 1.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="h-[2px] w-[min(520px,90%)] origin-left rounded-full gradient-gold opacity-90 mb-8"
              />
            )}

            <motion.p
              variants={fade}
              custom={2}
              className="text-base sm:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed"
            >
              {heroBody}
            </motion.p>

            <motion.div variants={fade} custom={3} className="flex gap-4 flex-wrap">
              <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/deals"
                  className="gradient-gold text-primary-foreground px-8 py-3.5 rounded-lg font-semibold inline-flex items-center gap-2 hover:opacity-90 transition-opacity glow-gold text-sm"
                >
                  Explore Deals <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <Link
                to="/portfolio"
                className="border border-border/60 px-8 py-3.5 rounded-lg font-semibold text-foreground hover:bg-muted/50 transition-colors text-sm"
              >
                View Portfolio
              </Link>
            </motion.div>

            {/* Trust badges inline */}
            <motion.div
              variants={fade}
              custom={4}
              className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-border/40"
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

      {/* Animated deal ticker */}
      <section className="border-b border-border/40 bg-card/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
              Sample Deal Flow
            </span>
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-card to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-card to-transparent" />
            <motion.div
              className="flex gap-4 whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              {[...tickerItems, ...tickerItems].map((item, idx) => (
                <div
                  key={`${item.label}-${idx}`}
                  className="glass rounded-full px-4 py-2 flex items-center gap-3 border border-border/60"
                >
                  <span className="text-xs font-medium">{item.label}</span>
                  <span className="text-[11px] text-muted-foreground">{item.metric}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {item.tag}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border/50 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {defaultStats.map((s, i) => {
            const override = (statsBlock?.data as any)?.[s.key];
            const value = typeof override === "string" && override.trim() ? override : s.value;
            return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-2xl sm:text-3xl font-display font-bold gradient-gold-text">
                {value}
              </p>
              <p className="text-xs text-muted-foreground mt-1.5 uppercase tracking-wider">{s.label}</p>
            </motion.div>
          );})}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs text-primary font-medium uppercase tracking-widest mb-3">Platform</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            End-to-End Infrastructure
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
            Everything you need to discover, evaluate, and manage private market investments
            — from deal sourcing to portfolio monitoring.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
              className="glass-hover rounded-xl p-6 group"
            >
              <div className="w-11 h-11 rounded-lg gradient-gold flex items-center justify-center mb-5 group-hover:glow-gold transition-shadow">
                <f.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="glass-card rounded-2xl p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] via-transparent to-primary/[0.03]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/[0.02] blur-[80px] rounded-full" />
          <div className="relative">
            <p className="text-xs text-primary font-medium uppercase tracking-widest mb-4">Get Started</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4 text-balance">
              Ready to Access Premium Deal Flow?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm leading-relaxed">
              Join a network of 2,400+ accredited investors deploying capital
              into top-quartile private equity opportunities.
            </p>
            <Link
              to="/deals"
              className="gradient-gold text-primary-foreground px-10 py-3.5 rounded-lg font-semibold inline-flex items-center gap-2 hover:opacity-90 transition-opacity glow-gold text-sm"
            >
              Start Investing <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded gradient-gold" />
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

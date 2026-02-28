import { motion, useReducedMotion, useInView } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Users, BarChart3, Lock, CheckCircle2, ChevronRight, Globe, Zap, LineChart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";

type CmsBlock = {
  key: string;
  title: string | null;
  body: string | null;
  data: any | null;
};

/* ---------- Animated counter ---------- */
function AnimatedCounter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

const defaultStats = [
  { label: "Assets Under Management", value: "$2.4B", numericValue: 2.4, prefix: "$", suffix: "B", key: "aum" },
  { label: "Active Campaigns", value: "47", numericValue: 47, prefix: "", suffix: "+", key: "active_deals" },
  { label: "Avg. Net IRR", value: "28.3%", numericValue: 28, prefix: "", suffix: "%", key: "net_irr" },
  { label: "Verified Investors", value: "2,400+", numericValue: 2400, prefix: "", suffix: "+", key: "investors" },
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

const journeySteps = [
  { step: "01", title: "Browse Opportunities", desc: "Explore curated deals across sectors with full transparency on terms and structure.", icon: Globe },
  { step: "02", title: "Commit Capital", desc: "Invest through regulated SPVs with institutional-grade documentation and compliance.", icon: Zap },
  { step: "03", title: "Track Performance", desc: "Monitor your portfolio in real-time with detailed analytics and reporting dashboards.", icon: LineChart },
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

const testimonials = [
  {
    quote: "Capital Harbour transformed how we access private markets. The platform's transparency and deal quality are unmatched.",
    name: "Sarah Chen",
    role: "Managing Director, Apex Ventures",
  },
  {
    quote: "The institutional-grade infrastructure combined with an elegant user experience makes this the gold standard for equity crowdfunding.",
    name: "Michael Torres",
    role: "Partner, Meridian Capital",
  },
  {
    quote: "Finally, a platform that treats accredited investors with the professionalism and rigor we expect from tier-one institutions.",
    name: "David Okafor",
    role: "CIO, Sterling Family Office",
  },
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
  const brand = "Capital Harbour";

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

  const heroBadge = heroBlock?.data?.badge ?? "Premium Equity Crowdfunding";
  const heroBody =
    heroBlock?.body ??
    "Institutional access to premium private equity deals, delivered through a seamless, regulated digital platform. Browse, commit, and track — all in one place.";

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 26,
      scale: prefersReducedMotion ? 1 : 0.9,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: prefersReducedMotion
        ? { duration: 0.2 }
        : {
            delay: 0.3 + i * 0.04,
            type: "spring" as const,
            stiffness: 720,
            damping: 40,
          },
    }),
  };

  return (
    <div className="bg-background">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-secondary/30" />
        <div aria-hidden className="pointer-events-none absolute inset-0 aurora" />
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-overlay" />
        <div className="absolute inset-0 texture-noise" />

        {/* Floating cards on right */}
        <div className="pointer-events-none absolute inset-y-24 right-8 hidden xl:flex flex-col gap-5">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: [0, -6, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="bg-card px-5 py-4 rounded-xl border border-border shadow-lg min-w-[240px]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Portfolio Growth
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] text-emerald-600 font-medium">
                Live
              </span>
            </div>
            <p className="text-xl font-bold text-foreground">+3.2% this quarter</p>
            <div className="mt-2 h-1 rounded-full bg-secondary overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "72%" }}
                transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                className="h-full rounded-full bg-brand-teal"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: [0, 6, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="bg-card px-5 py-4 rounded-xl border border-border min-w-[240px]"
          >
            <p className="text-[11px] text-muted-foreground mb-1 uppercase tracking-widest">
              Campaign Progress
            </p>
            <p className="text-sm font-semibold text-foreground">Helios Energy Fund II</p>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>$1.2M raised</span>
              <span>$2M target</span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "60%" }}
                transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
                className="h-full rounded-full bg-brand-teal"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: [0, -4, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="bg-card px-5 py-4 rounded-xl border border-border min-w-[240px]"
          >
            <p className="text-[11px] text-muted-foreground mb-1 uppercase tracking-widest">
              Investors Joined
            </p>
            <p className="text-xl font-bold text-foreground">142 this month</p>
            <p className="text-xs text-emerald-600 mt-1">+18% from last month</p>
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card mb-8 shadow-sm"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
              <span className="text-foreground text-xs font-medium tracking-wide">
                {heroBadge}
              </span>
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            </motion.div>

            <motion.h1
              variants={fade}
              custom={1}
              className="mb-6 text-balance"
            >
              <span className="sr-only">
                Capital Harbour — Institutional access, modern infrastructure for private markets.
              </span>
              <span
                aria-hidden
                className="block text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.08] text-foreground tracking-tight"
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

            {/* Accent underline */}
            {!prefersReducedMotion && (
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 1.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="h-[3px] w-[min(320px,60%)] origin-left rounded-full bg-brand-teal mb-8"
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
                  className="btn-teal px-8 py-3.5 rounded-lg font-semibold inline-flex items-center gap-2 transition-all glow-gold text-sm"
                >
                  Explore Deals <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <Link
                to="/portfolio"
                className="border border-border px-8 py-3.5 rounded-lg font-semibold text-foreground hover:bg-secondary transition-colors text-sm bg-card"
              >
                View Portfolio
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              variants={fade}
              custom={4}
              className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-border"
            >
              {trustItems.map((item) => (
                <div key={item.text} className="flex items-center gap-2">
                  <item.icon className="w-3.5 h-3.5 text-brand-teal" />
                  <span className="text-xs text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== DEAL TICKER ===== */}
      <section className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
              Sample Deal Flow
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
          </div>
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-card to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-card to-transparent z-10" />
            <motion.div
              className="flex gap-4 whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              {[...tickerItems, ...tickerItems].map((item, idx) => (
                <div
                  key={`${item.label}-${idx}`}
                  className="rounded-full px-4 py-2 flex items-center gap-3 border border-border bg-secondary/50"
                >
                  <span className="text-xs font-medium text-foreground">{item.label}</span>
                  <span className="text-[11px] text-muted-foreground">{item.metric}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-teal/10 text-brand-teal font-medium">
                    {item.tag}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR with Animated Counters ===== */}
      <section className="border-b border-border bg-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {defaultStats.map((s, i) => {
            const override = (statsBlock?.data as any)?.[s.key];
            const displayValue = typeof override === "string" && override.trim() ? override : s.value;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-2xl sm:text-3xl font-extrabold text-primary-foreground">
                  {override ? displayValue : (
                    <AnimatedCounter target={s.numericValue} prefix={s.prefix} suffix={s.suffix} />
                  )}
                </p>
                <p className="text-xs text-primary-foreground/60 mt-1.5 uppercase tracking-wider">{s.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===== HOW IT WORKS / INVESTOR JOURNEY ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs text-brand-teal font-semibold uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-foreground text-balance">
            Your Investor Journey
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
            Three simple steps from discovery to portfolio management — built for speed, clarity, and confidence.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6">
          {journeySteps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative bg-card border border-border rounded-2xl p-8 group hover:border-brand-teal/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-brand-teal/10 flex items-center justify-center group-hover:bg-brand-teal group-hover:text-white transition-colors duration-300">
                  <item.icon className="w-5 h-5 text-brand-teal group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-3xl font-extrabold text-secondary/80 text-muted-foreground/20">{item.step}</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES / PLATFORM ===== */}
      <section className="bg-secondary/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs text-brand-teal font-semibold uppercase tracking-widest mb-3">Platform</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-foreground">
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
                className="bg-card border border-border rounded-xl p-6 group hover:border-brand-teal/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-lg bg-brand-teal flex items-center justify-center mb-5 group-hover:shadow-lg transition-shadow">
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INVESTOR DASHBOARD PREVIEW ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs text-brand-teal font-semibold uppercase tracking-widest mb-3">Dashboard</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-foreground text-balance">
            Portfolio Intelligence at a Glance
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
            Real-time analytics, live funding progress, and performance benchmarking — all in a single view.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-card border border-border rounded-2xl p-8 shadow-lg"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total Invested", value: "$1.24M" },
              { label: "Current Value", value: "$1.82M", change: "+46.8%" },
              { label: "Net IRR", value: "28.3%", change: "+2.1%" },
              { label: "Distributions", value: "$340K" },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="bg-secondary/50 rounded-xl p-5 border border-border"
              >
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">{card.label}</p>
                <p className="text-2xl font-extrabold text-foreground">{card.value}</p>
                {card.change && (
                  <p className="text-xs text-emerald-600 mt-1 font-medium">{card.change} from last quarter</p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Simulated chart area */}
          <div className="bg-secondary/30 rounded-xl border border-border p-6 h-48 flex items-end gap-1.5">
            {[40, 55, 45, 60, 50, 70, 65, 80, 75, 85, 78, 92].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease: "easeOut" }}
                className="flex-1 bg-brand-teal/20 rounded-t-md relative group"
              >
                <div className="absolute inset-x-0 bottom-0 bg-brand-teal rounded-t-md" style={{ height: "60%" }} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== TESTIMONIALS / SOCIAL PROOF ===== */}
      <section className="bg-secondary/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs text-brand-teal font-semibold uppercase tracking-widest mb-3">Trusted By</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-foreground text-balance">
              What Our Investors Say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-6">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Partner logos placeholder row */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-10"
          >
            {["TechCrunch", "Bloomberg", "Forbes", "Financial Times", "Reuters"].map((name) => (
              <span key={name} className="text-sm font-semibold text-muted-foreground/40 uppercase tracking-widest">
                {name}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CTA / GET STARTED ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-foreground rounded-2xl p-10 sm:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-brand-teal/10 blur-[80px] rounded-full" />
          <div className="relative">
            <p className="text-xs text-brand-teal font-semibold uppercase tracking-widest mb-4">Get Started</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4 text-primary-foreground text-balance">
              Ready to Access Premium Deal Flow?
            </h2>
            <p className="text-primary-foreground/60 mb-8 max-w-md mx-auto text-sm leading-relaxed">
              Join a network of 2,400+ accredited investors deploying capital
              into top-quartile private equity opportunities.
            </p>
            <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
              <Link
                to="/deals"
                className="btn-teal px-10 py-3.5 rounded-lg font-semibold inline-flex items-center gap-2 transition-all text-sm"
              >
                Start Investing <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border bg-card py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-md bg-brand-teal" />
                <span className="text-lg font-bold text-foreground tracking-tight">
                  Capital Harbour
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Premium equity crowdfunding platform for accredited investors.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Platform</span>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Deals</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Portfolio</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documents</a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Company</span>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Legal</span>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Disclosures</a>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; 2026 Capital Harbour. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <span>SEC Registered</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/30 self-center" />
              <span>SOC 2 Type II</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/30 self-center" />
              <span>FINRA Member</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

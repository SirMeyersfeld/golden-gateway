import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Users, BarChart3, Lock, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Assets Under Management", value: "$2.4B" },
  { label: "Active Deals", value: "47" },
  { label: "Avg. Net IRR", value: "28.3%" },
  { label: "Portfolio Companies", value: "186" },
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

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card/50" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[140px]" />
        <div className="absolute bottom-1/3 left-1/5 w-[350px] h-[350px] rounded-full bg-primary/[0.02] blur-[100px]" />
        <div className="absolute inset-0 texture-noise" />

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
                Private Equity Reimagined
              </span>
            </motion.div>

            <motion.h1
              variants={fade}
              custom={1}
              className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-bold leading-[1.1] mb-6 text-balance"
            >
              Institutional Access,{" "}
              <span className="gradient-gold-text">Modern Infrastructure</span>
            </motion.h1>

            <motion.p
              variants={fade}
              custom={2}
              className="text-base sm:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed"
            >
              Vanguard Capital connects accredited investors to premium private
              equity deals through a seamless, regulated digital platform. Browse, invest,
              and track — all in one place.
            </motion.p>

            <motion.div variants={fade} custom={3} className="flex gap-4 flex-wrap">
              <Link
                to="/deals"
                className="gradient-gold text-primary-foreground px-8 py-3.5 rounded-lg font-semibold inline-flex items-center gap-2 hover:opacity-90 transition-opacity glow-gold text-sm"
              >
                Explore Deals <ArrowRight className="w-4 h-4" />
              </Link>
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

      {/* Stats bar */}
      <section className="border-y border-border/50 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-2xl sm:text-3xl font-display font-bold gradient-gold-text">
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1.5 uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
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

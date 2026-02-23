import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Users, BarChart3 } from "lucide-react";
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
    desc: "Access curated private equity opportunities with institutional-grade due diligence.",
  },
  {
    icon: Shield,
    title: "SPV Investing",
    desc: "Invest through Special Purpose Vehicles with transparent fee structures and governance.",
  },
  {
    icon: Users,
    title: "Co-Investment",
    desc: "Join alongside top-tier GPs with lower minimums and aligned incentives.",
  },
  {
    icon: BarChart3,
    title: "Portfolio Analytics",
    desc: "Real-time performance tracking with benchmarking against public and private indices.",
  },
];

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-navy-light" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/3 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.p
              variants={fade}
              custom={0}
              className="text-primary font-medium text-sm tracking-widest uppercase mb-4"
            >
              Private Equity Reimagined
            </motion.p>
            <motion.h1
              variants={fade}
              custom={1}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            >
              Institutional Access,{" "}
              <span className="gradient-gold-text">Modern Infrastructure</span>
            </motion.h1>
            <motion.p
              variants={fade}
              custom={2}
              className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed"
            >
              Vanguard Capital connects accredited investors to premium private
              equity deals through a seamless digital platform. Browse, invest,
              and track — all in one place.
            </motion.p>
            <motion.div variants={fade} custom={3} className="flex gap-4 flex-wrap">
              <Link
                to="/deals"
                className="gradient-gold text-primary-foreground px-8 py-3.5 rounded-lg font-semibold inline-flex items-center gap-2 hover:opacity-90 transition-opacity glow-gold"
              >
                Explore Deals <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/portfolio"
                className="border border-border px-8 py-3.5 rounded-lg font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                View Portfolio
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
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
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
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
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            The Platform
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            End-to-end infrastructure for private market investing.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-hover rounded-xl p-6 group"
            >
              <div className="w-12 h-12 rounded-lg gradient-gold flex items-center justify-center mb-4 group-hover:glow-gold transition-shadow">
                <f.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="glass rounded-2xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold mb-4">
              Ready to Access Premium Deal Flow?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Join a network of 2,400+ accredited investors deploying capital
              into top-quartile opportunities.
            </p>
            <Link
              to="/deals"
              className="gradient-gold text-primary-foreground px-10 py-4 rounded-lg font-semibold inline-flex items-center gap-2 hover:opacity-90 transition-opacity glow-gold"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Vanguard Capital. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

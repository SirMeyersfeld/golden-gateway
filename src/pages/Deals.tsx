import { motion } from "framer-motion";
import { ArrowUpRight, Clock, TrendingUp, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const deals = [
  {
    name: "Aether Robotics",
    sector: "Deep Tech",
    stage: "Series C",
    targetIrr: "32%",
    raised: 18_500_000,
    target: 25_000_000,
    minimum: "$100K",
    status: "open" as const,
    closing: "Mar 15, 2026",
  },
  {
    name: "NovaPay",
    sector: "Fintech",
    stage: "Growth Equity",
    targetIrr: "26%",
    raised: 42_000_000,
    target: 50_000_000,
    minimum: "$250K",
    status: "open" as const,
    closing: "Apr 1, 2026",
  },
  {
    name: "BioSphere Health",
    sector: "Healthcare",
    stage: "Series B",
    targetIrr: "35%",
    raised: 12_000_000,
    target: 20_000_000,
    minimum: "$50K",
    status: "open" as const,
    closing: "Mar 28, 2026",
  },
  {
    name: "Helios Energy",
    sector: "CleanTech",
    stage: "Late Stage",
    targetIrr: "22%",
    raised: 80_000_000,
    target: 80_000_000,
    minimum: "$500K",
    status: "closed" as const,
    closing: "Feb 10, 2026",
  },
  {
    name: "Stratos Cloud",
    sector: "Enterprise SaaS",
    stage: "Series D",
    targetIrr: "28%",
    raised: 30_000_000,
    target: 60_000_000,
    minimum: "$100K",
    status: "open" as const,
    closing: "May 5, 2026",
  },
  {
    name: "Quantum Ledger",
    sector: "Infrastructure",
    stage: "Series A",
    targetIrr: "40%",
    raised: 5_000_000,
    target: 15_000_000,
    minimum: "$25K",
    status: "upcoming" as const,
    closing: "Jun 1, 2026",
  },
];

const statusConfig = {
  open: { label: "Open", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  closed: { label: "Closed", className: "bg-red-500/10 text-red-400 border-red-500/20" },
  upcoming: { label: "Upcoming", className: "bg-primary/10 text-primary border-primary/20" },
};

function formatCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${(n / 1_000).toFixed(0)}K`;
}

export default function Deals() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
          Deal Flow
        </h1>
        <p className="text-muted-foreground">
          Curated private equity opportunities across sectors and stages.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal, i) => {
          const pct = Math.round((deal.raised / deal.target) * 100);
          const st = statusConfig[deal.status];
          return (
            <motion.div
              key={deal.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-hover rounded-xl overflow-hidden group cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors">
                      {deal.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {deal.sector} · {deal.stage}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border ${st.className}`}
                  >
                    {st.label}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Target IRR
                    </p>
                    <p className="text-sm font-semibold text-primary">{deal.targetIrr}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> Minimum
                    </p>
                    <p className="text-sm font-semibold">{deal.minimum}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Closing
                    </p>
                    <p className="text-sm font-semibold">{deal.closing}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">
                      {formatCurrency(deal.raised)} raised
                    </span>
                    <span className="text-muted-foreground">
                      {formatCurrency(deal.target)} target
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full gradient-gold transition-all duration-500"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>

                {deal.status === "open" && (
                  <Link
                    to={`/invest?deal=${encodeURIComponent(deal.name)}`}
                    className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-primary/30 text-primary text-sm font-medium hover:bg-primary/10 transition-colors"
                  >
                    Invest via SPV <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Clock, TrendingUp, DollarSign, Loader2, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const statusConfig: Record<string, { label: string; className: string }> = {
  open: { label: "Open", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  closed: { label: "Closed", className: "bg-red-50 text-red-700 border-red-200" },
  upcoming: { label: "Upcoming", className: "bg-brand-teal/10 text-brand-teal border-brand-teal/20" },
};

function formatCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${(n / 1_000).toFixed(0)}K`;
}

type SortOption = "newest" | "oldest" | "target_high" | "target_low" | "raised";

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.07,
      duration: 0.45,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

export default function Deals() {
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState<SortOption>("newest");

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ["deals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const sectors = useMemo(
    () => [...new Set(deals.map((d) => d.sector))].sort(),
    [deals]
  );

  const filtered = useMemo(() => {
    let result = deals.filter((d) => {
      const matchesSearch =
        !search ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.sector.toLowerCase().includes(search.toLowerCase()) ||
        d.stage.toLowerCase().includes(search.toLowerCase());
      const matchesSector = sectorFilter === "all" || d.sector === sectorFilter;
      const matchesStatus = statusFilter === "all" || d.status === statusFilter;
      return matchesSearch && matchesSector && matchesStatus;
    });

    result.sort((a, b) => {
      switch (sort) {
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "target_high":
          return b.target_amount - a.target_amount;
        case "target_low":
          return a.target_amount - b.target_amount;
        case "raised":
          return b.raised_amount - a.raised_amount;
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return result;
  }, [deals, search, sectorFilter, statusFilter, sort]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-brand-teal" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-10"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-foreground">
          Deal Flow
        </h1>
        <p className="text-muted-foreground">
          Curated private equity opportunities across sectors and stages.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="flex flex-col sm:flex-row gap-3 mb-8"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search deals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
        <Select value={sectorFilter} onValueChange={setSectorFilter}>
          <SelectTrigger className="w-full sm:w-[160px] bg-card">
            <SelectValue placeholder="Sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sectors</SelectItem>
            {sectors.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[140px] bg-card">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
          <SelectTrigger className="w-full sm:w-[170px] bg-card">
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="target_high">{"Target: High -> Low"}</SelectItem>
            <SelectItem value="target_low">{"Target: Low -> High"}</SelectItem>
            <SelectItem value="raised">Most Raised</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-16 text-muted-foreground"
          >
            No deals match your filters.
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((deal, i) => {
              const pct = deal.target_amount ? Math.round((deal.raised_amount / deal.target_amount) * 100) : 0;
              const st = statusConfig[deal.status] ?? statusConfig.upcoming;
              return (
                <motion.div
                  key={deal.id}
                  variants={cardVariants}
                  custom={i}
                  whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-card border border-border rounded-xl overflow-hidden group cursor-pointer hover:shadow-lg hover:border-border transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold group-hover:text-brand-teal transition-colors text-foreground">
                          {deal.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {deal.sector} &middot; {deal.stage}
                        </p>
                      </div>
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.07 + 0.2 }}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${st.className}`}
                      >
                        {st.label}
                      </motion.span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-5">
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> Target IRR
                        </p>
                        <p className="text-sm font-bold text-brand-teal">{deal.target_irr}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <DollarSign className="w-3 h-3" /> Minimum
                        </p>
                        <p className="text-sm font-bold text-foreground">{formatCurrency(deal.minimum_investment)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Closing
                        </p>
                        <p className="text-sm font-bold text-foreground">{deal.closing_date ?? "TBD"}</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">
                          {formatCurrency(deal.raised_amount)} raised
                        </span>
                        <span className="text-muted-foreground">
                          {formatCurrency(deal.target_amount)} target
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(pct, 100)}%` }}
                          transition={{ delay: i * 0.07 + 0.3, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="h-full rounded-full bg-brand-teal"
                        />
                      </div>
                    </div>

                    {deal.status === "open" && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Link
                          to={`/invest?deal=${encodeURIComponent(deal.name)}`}
                          className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-brand-teal/30 text-brand-teal text-sm font-semibold hover:bg-brand-teal/5 transition-all duration-200 hover:border-brand-teal/50"
                        >
                          Invest via SPV <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

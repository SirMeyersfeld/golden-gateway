import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, TrendingUp, DollarSign, Loader2, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const statusConfig: Record<string, { label: string; className: string }> = {
  open: { label: "Open", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  closed: { label: "Closed", className: "bg-red-500/10 text-red-400 border-red-500/20" },
  upcoming: { label: "Upcoming", className: "bg-primary/10 text-primary border-primary/20" },
};

function formatCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${(n / 1_000).toFixed(0)}K`;
}

type SortOption = "newest" | "oldest" | "target_high" | "target_low" | "raised";

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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search deals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sectorFilter} onValueChange={setSectorFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
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
          <SelectTrigger className="w-full sm:w-[140px]">
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
          <SelectTrigger className="w-full sm:w-[170px]">
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="target_high">Target: High → Low</SelectItem>
            <SelectItem value="target_low">Target: Low → High</SelectItem>
            <SelectItem value="raised">Most Raised</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No deals match your filters.
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((deal, i) => {
          const pct = deal.target_amount ? Math.round((deal.raised_amount / deal.target_amount) * 100) : 0;
          const st = statusConfig[deal.status] ?? statusConfig.upcoming;
          return (
            <motion.div
              key={deal.id}
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
                    <p className="text-sm font-semibold text-primary">{deal.target_irr}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> Minimum
                    </p>
                    <p className="text-sm font-semibold">{formatCurrency(deal.minimum_investment)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Closing
                    </p>
                    <p className="text-sm font-semibold">{deal.closing_date ?? "TBD"}</p>
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

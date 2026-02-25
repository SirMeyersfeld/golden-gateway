import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, Briefcase, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const chartData = [
  { month: "Jan", raised: 2400000 },
  { month: "Feb", raised: 3200000 },
  { month: "Mar", raised: 4100000 },
  { month: "Apr", raised: 5800000 },
  { month: "May", raised: 7200000 },
  { month: "Jun", raised: 8900000 },
];

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 } }),
};

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: deals = [] } = useQuery({
    queryKey: ["admin-deals", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .eq("created_by", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: investments = [] } = useQuery({
    queryKey: ["admin-investments", user?.id],
    queryFn: async () => {
      const dealIds = deals.map((d) => d.id);
      if (!dealIds.length) return [];
      const { data, error } = await supabase
        .from("investments")
        .select("*")
        .in("deal_id", dealIds);
      if (error) throw error;
      return data;
    },
    enabled: deals.length > 0,
  });

  const { data: capitalCalls = [] } = useQuery({
    queryKey: ["admin-capital-calls", user?.id],
    queryFn: async () => {
      const dealIds = deals.map((d) => d.id);
      if (!dealIds.length) return [];
      const { data, error } = await supabase
        .from("capital_calls")
        .select("*")
        .in("deal_id", dealIds);
      if (error) throw error;
      return data;
    },
    enabled: deals.length > 0,
  });

  const totalRaised = deals.reduce((s, d) => s + Number(d.raised_amount), 0);
  const totalInvestors = new Set(investments.map((i) => i.investor_id)).size;
  const pendingCalls = capitalCalls.filter((c) => c.status === "pending").length;

  const formatCurrency = (n: number) =>
    n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : `$${(n / 1e3).toFixed(0)}K`;

  const stats = [
    { label: "Active Deals", value: deals.filter((d) => d.status === "open").length, icon: Briefcase, color: "text-primary" },
    { label: "Total Raised", value: formatCurrency(totalRaised), icon: DollarSign, color: "text-emerald-400" },
    { label: "Total Investors", value: totalInvestors, icon: Users, color: "text-sky-400" },
    { label: "Pending Calls", value: pendingCalls, icon: TrendingUp, color: "text-amber-400" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Fund Manager Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your deals, investors, and capital calls.</p>
        </div>
        <Link
          to="/admin/deals/new"
          className="gradient-gold text-primary-foreground px-5 py-2.5 rounded-lg font-semibold inline-flex items-center gap-2 hover:opacity-90 transition-opacity text-sm"
        >
          <Plus className="w-4 h-4" /> New Deal
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            variants={fade}
            initial="hidden"
            animate="visible"
            custom={i}
            className="glass rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-2xl font-display font-bold">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="visible"
        custom={4}
        className="glass rounded-xl p-6 mb-8"
      >
        <h2 className="font-display text-lg font-semibold mb-4">Capital Raised Over Time</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="brandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 20% 18%)" />
              <XAxis dataKey="month" stroke="hsl(220 15% 55%)" fontSize={12} />
              <YAxis stroke="hsl(220 15% 55%)" fontSize={12} tickFormatter={(v) => `$${v / 1e6}M`} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(v: number) => [formatCurrency(v), "Raised"]}
              />
              <Area type="monotone" dataKey="raised" stroke="hsl(var(--primary))" fill="url(#brandGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: "Manage Deals", to: "/admin/deals", desc: `${deals.length} deals` },
          { label: "View Investors", to: "/admin/investors", desc: `${totalInvestors} investors` },
          { label: "Capital Calls", to: "/admin/capital-calls", desc: `${pendingCalls} pending` },
          { label: "Content Studio", to: "/admin/studio", desc: "Landing & marketing copy" },
        ].map((link, i) => (
          <motion.div key={link.to} variants={fade} initial="hidden" animate="visible" custom={5 + i}>
            <Link
              to={link.to}
              className="glass-hover rounded-xl p-5 flex items-center justify-between group"
            >
              <div>
                <p className="font-semibold">{link.label}</p>
                <p className="text-sm text-muted-foreground">{link.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

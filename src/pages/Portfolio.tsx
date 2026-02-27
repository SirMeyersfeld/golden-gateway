import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const summaryCards = [
  { label: "Total Invested", value: "$1.24M", icon: DollarSign, change: null },
  { label: "Current Value", value: "$1.82M", icon: BarChart3, change: "+46.8%" },
  { label: "Net IRR", value: "28.3%", icon: TrendingUp, change: "+2.1%" },
  { label: "Distributions", value: "$340K", icon: DollarSign, change: null },
];

const chartData = [
  { month: "Jul", value: 1240 }, { month: "Aug", value: 1280 },
  { month: "Sep", value: 1350 }, { month: "Oct", value: 1310 },
  { month: "Nov", value: 1420 }, { month: "Dec", value: 1480 },
  { month: "Jan", value: 1560 }, { month: "Feb", value: 1650 },
  { month: "Mar", value: 1620 }, { month: "Apr", value: 1710 },
  { month: "May", value: 1750 }, { month: "Jun", value: 1820 },
];

const holdings = [
  { name: "Aether Robotics", invested: "$200K", current: "$340K", irr: "32.1%", up: true, vintage: "2024" },
  { name: "NovaPay", invested: "$250K", current: "$380K", irr: "26.4%", up: true, vintage: "2023" },
  { name: "BioSphere Health", invested: "$150K", current: "$245K", irr: "35.2%", up: true, vintage: "2024" },
  { name: "Helios Energy", invested: "$350K", current: "$480K", irr: "22.0%", up: true, vintage: "2022" },
  { name: "Stratos Cloud", invested: "$190K", current: "$275K", irr: "28.8%", up: true, vintage: "2024" },
  { name: "Quantum Ledger", invested: "$100K", current: "$98K", irr: "-2.0%", up: false, vintage: "2025" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: 0.5 + i * 0.06, duration: 0.35 },
  }),
};

export default function Portfolio() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-10"
      >
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Portfolio</h1>
        <p className="text-muted-foreground">Track your investments and performance in real time.</p>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {summaryCards.map((c, i) => (
          <motion.div
            key={c.label}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={i}
            whileHover={{ y: -4, scale: 1.02, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            className="glass rounded-xl p-5 cursor-default"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.08 + 0.2, type: "spring", stiffness: 400 }}
              >
                <c.icon className="w-4 h-4 text-primary" />
              </motion.div>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 + 0.15 }}
              className="text-2xl font-display font-bold"
            >
              {c.value}
            </motion.p>
            {c.change && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.08 + 0.3 }}
                className="text-xs text-emerald-400 mt-1"
              >
                {c.change} from last quarter
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="glass rounded-xl p-6 mb-10"
      >
        <h2 className="font-display text-lg font-semibold mb-6">Portfolio Value (in $K)</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="brandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.26} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 20% 18%)" />
              <XAxis dataKey="month" stroke="hsl(220 15% 55%)" fontSize={12} />
              <YAxis stroke="hsl(220 15% 55%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
              />
              <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#brandGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Holdings table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="glass rounded-xl overflow-hidden"
      >
        <div className="p-6 border-b border-border">
          <h2 className="font-display text-lg font-semibold">Holdings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-3 px-6 font-medium">Company</th>
                <th className="text-right py-3 px-6 font-medium">Vintage</th>
                <th className="text-right py-3 px-6 font-medium">Invested</th>
                <th className="text-right py-3 px-6 font-medium">Current</th>
                <th className="text-right py-3 px-6 font-medium">Net IRR</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h, i) => (
                <motion.tr
                  key={h.name}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                  whileHover={{ backgroundColor: "hsl(222 22% 14%)", transition: { duration: 0.15 } }}
                  className="border-b border-border/50 transition-colors cursor-default"
                >
                  <td className="py-4 px-6 font-medium">{h.name}</td>
                  <td className="py-4 px-6 text-right text-muted-foreground">{h.vintage}</td>
                  <td className="py-4 px-6 text-right">{h.invested}</td>
                  <td className="py-4 px-6 text-right">{h.current}</td>
                  <td className="py-4 px-6 text-right">
                    <span className={`inline-flex items-center gap-1 ${h.up ? "text-emerald-400" : "text-red-400"}`}>
                      {h.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {h.irr}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

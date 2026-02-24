import { motion } from "framer-motion";
import { ArrowLeft, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  committed: "bg-sky-500/20 text-sky-400",
  funded: "bg-emerald-500/20 text-emerald-400",
  cancelled: "bg-red-500/20 text-red-400",
};

const formatCurrency = (n: number) =>
  n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : `$${(n / 1e3).toFixed(0)}K`;

export default function Investors() {
  const { user } = useAuth();

  const { data: deals = [] } = useQuery({
    queryKey: ["admin-deals", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .eq("created_by", user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: investments = [], isLoading } = useQuery({
    queryKey: ["admin-investments", user?.id, deals],
    queryFn: async () => {
      const dealIds = deals.map((d) => d.id);
      if (!dealIds.length) return [];
      const { data, error } = await supabase
        .from("investments")
        .select("*")
        .in("deal_id", dealIds)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: deals.length > 0,
  });

  const dealMap = Object.fromEntries(deals.map((d) => [d.id, d.name]));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold">Investors</h1>
          <p className="text-muted-foreground mt-1">{investments.length} investments across your deals</p>
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead>Investor ID</TableHead>
              <TableHead>Deal</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investments.map((inv) => (
              <TableRow key={inv.id} className="border-border">
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {inv.investor_id.slice(0, 8)}…
                </TableCell>
                <TableCell className="font-medium">{dealMap[inv.deal_id] ?? "—"}</TableCell>
                <TableCell>{formatCurrency(Number(inv.amount))}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[inv.status] ?? ""}`}>
                    {inv.status}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(inv.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && investments.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  No investments yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

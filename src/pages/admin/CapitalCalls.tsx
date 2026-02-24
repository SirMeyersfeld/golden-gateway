import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  paid: "bg-emerald-500/20 text-emerald-400",
  overdue: "bg-red-500/20 text-red-400",
};

const formatCurrency = (n: number) =>
  n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : `$${(n / 1e3).toFixed(0)}K`;

export default function CapitalCalls() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [newCall, setNewCall] = useState({ deal_id: "", amount: "", due_date: "", notes: "" });

  const { data: deals = [] } = useQuery({
    queryKey: ["admin-deals", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("deals").select("*").eq("created_by", user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: capitalCalls = [], isLoading } = useQuery({
    queryKey: ["admin-capital-calls", user?.id, deals],
    queryFn: async () => {
      const dealIds = deals.map((d) => d.id);
      if (!dealIds.length) return [];
      const { data, error } = await supabase
        .from("capital_calls")
        .select("*")
        .in("deal_id", dealIds)
        .order("due_date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: deals.length > 0,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const existingCalls = capitalCalls.filter((c) => c.deal_id === newCall.deal_id);
      const { error } = await supabase.from("capital_calls").insert({
        deal_id: newCall.deal_id,
        created_by: user!.id,
        amount: parseInt(newCall.amount),
        due_date: newCall.due_date,
        notes: newCall.notes || null,
        call_number: existingCalls.length + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-capital-calls"] });
      toast.success("Capital call created");
      setOpen(false);
      setNewCall({ deal_id: "", amount: "", due_date: "", notes: "" });
    },
    onError: (e) => toast.error(e.message),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("capital_calls").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-capital-calls"] });
      toast.success("Status updated");
    },
    onError: (e) => toast.error(e.message),
  });

  const dealMap = Object.fromEntries(deals.map((d) => [d.id, d.name]));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display text-3xl font-bold">Capital Calls</h1>
            <p className="text-muted-foreground mt-1">{capitalCalls.length} calls total</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-gold text-primary-foreground hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" /> New Call
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Capital Call</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Deal</Label>
                <Select value={newCall.deal_id} onValueChange={(v) => setNewCall({ ...newCall, deal_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select deal" /></SelectTrigger>
                  <SelectContent>
                    {deals.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Amount ($)</Label>
                <Input type="number" value={newCall.amount} onChange={(e) => setNewCall({ ...newCall, amount: e.target.value })} />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input type="date" value={newCall.due_date} onChange={(e) => setNewCall({ ...newCall, due_date: e.target.value })} />
              </div>
              <div>
                <Label>Notes (optional)</Label>
                <Input value={newCall.notes} onChange={(e) => setNewCall({ ...newCall, notes: e.target.value })} />
              </div>
              <Button
                onClick={() => createMutation.mutate()}
                disabled={!newCall.deal_id || !newCall.amount || !newCall.due_date || createMutation.isPending}
                className="w-full gradient-gold text-primary-foreground hover:opacity-90"
              >
                {createMutation.isPending ? "Creating..." : "Create Call"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead>Deal</TableHead>
              <TableHead>Call #</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {capitalCalls.map((call) => (
              <TableRow key={call.id} className="border-border">
                <TableCell className="font-medium">{dealMap[call.deal_id] ?? "—"}</TableCell>
                <TableCell>{call.call_number}</TableCell>
                <TableCell>{formatCurrency(Number(call.amount))}</TableCell>
                <TableCell className="text-muted-foreground">{call.due_date}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[call.status] ?? ""}`}>
                    {call.status}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                  {call.notes ?? "—"}
                </TableCell>
                <TableCell className="text-right">
                  <Select
                    value={call.status}
                    onValueChange={(v) => updateStatusMutation.mutate({ id: call.id, status: v })}
                  >
                    <SelectTrigger className="w-28 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && capitalCalls.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                  No capital calls yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const schema = z.object({
  name: z.string().min(1, "Required"),
  sector: z.string().min(1, "Required"),
  stage: z.string().min(1, "Required"),
  target_irr: z.string().min(1, "Required"),
  target_amount: z.coerce.number().min(1, "Required"),
  minimum_investment: z.coerce.number().min(1, "Required"),
  status: z.enum(["open", "closed", "upcoming"]),
  closing_date: z.string().optional(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function DealForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      sector: "",
      stage: "Series A",
      target_irr: "20-25%",
      target_amount: 0,
      minimum_investment: 100000,
      status: "upcoming",
      closing_date: "",
      description: "",
    },
  });

  const { data: existingDeal } = useQuery({
    queryKey: ["deal", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("deals").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (existingDeal) {
      form.reset({
        name: existingDeal.name,
        sector: existingDeal.sector,
        stage: existingDeal.stage,
        target_irr: existingDeal.target_irr,
        target_amount: Number(existingDeal.target_amount),
        minimum_investment: Number(existingDeal.minimum_investment),
        status: existingDeal.status as "open" | "closed" | "upcoming",
        closing_date: existingDeal.closing_date ?? "",
        description: existingDeal.description ?? "",
      });
    }
  }, [existingDeal, form]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        ...values,
        closing_date: values.closing_date || null,
        description: values.description || null,
        created_by: user!.id,
      };
      if (isEdit) {
        const { error } = await supabase.from("deals").update(payload).eq("id", id!);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("deals").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-deals"] });
      toast.success(isEdit ? "Deal updated" : "Deal created");
      navigate("/admin/deals");
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/admin/deals" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-display text-3xl font-bold">{isEdit ? "Edit Deal" : "Create Deal"}</h1>
      </div>

      <div className="glass rounded-xl p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-5">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Deal Name</FormLabel>
                <FormControl><Input placeholder="Acme Corp Series B" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="sector" render={({ field }) => (
                <FormItem>
                  <FormLabel>Sector</FormLabel>
                  <FormControl><Input placeholder="Technology" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="stage" render={({ field }) => (
                <FormItem>
                  <FormLabel>Stage</FormLabel>
                  <FormControl><Input placeholder="Series A" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="target_irr" render={({ field }) => (
                <FormItem>
                  <FormLabel>Target IRR</FormLabel>
                  <FormControl><Input placeholder="20-25%" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="target_amount" render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Amount ($)</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="minimum_investment" render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Investment ($)</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="closing_date" render={({ field }) => (
              <FormItem>
                <FormLabel>Closing Date</FormLabel>
                <FormControl><Input type="date" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea placeholder="Deal description..." rows={4} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={mutation.isPending} className="gradient-gold text-primary-foreground hover:opacity-90">
                {mutation.isPending ? "Saving..." : isEdit ? "Update Deal" : "Create Deal"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/deals")}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

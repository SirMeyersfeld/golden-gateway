import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  ArrowLeft, ArrowRight, Check, FileText, DollarSign,
  Shield, CheckCircle2, Briefcase, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const STEPS = [
  { label: "Select Deal", icon: Briefcase },
  { label: "Investment Amount", icon: DollarSign },
  { label: "Review Terms", icon: FileText },
  { label: "Sign Documents", icon: Shield },
  { label: "Confirm", icon: CheckCircle2 },
];

const formatCurrency = (n: number) =>
  n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `$${(n / 1e3).toFixed(0)}K` : `$${n}`;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

export default function InvestWizard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const preselectedDeal = searchParams.get("deal");
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(preselectedDeal);
  const [amount, setAmount] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [signedDocs, setSignedDocs] = useState({ subscription: false, ppm: false, operating: false });
  const [submitted, setSubmitted] = useState(false);

  const { data: deals = [] } = useQuery({
    queryKey: ["open-deals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const selectedDeal = deals.find((d) => d.id === selectedDealId);

  // Auto-advance if deal is preselected
  useEffect(() => {
    if (preselectedDeal && deals.length > 0 && deals.some((d) => d.id === preselectedDeal)) {
      setStep(1);
    }
  }, [preselectedDeal, deals]);

  const investMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("investments").insert([{
        deal_id: selectedDealId!,
        investor_id: user!.id,
        amount: parseInt(amount),
        status: "committed",
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["open-deals"] });
      toast.success("Investment committed successfully!");
    },
    onError: (e) => toast.error(e.message),
  });

  const goNext = () => { setDirection(1); setStep((s) => Math.min(s + 1, 4)); };
  const goBack = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 0)); };

  const canProceed = () => {
    if (step === 0) return !!selectedDealId;
    if (step === 1) return !!amount && parseInt(amount) >= Number(selectedDeal?.minimum_investment ?? 0);
    if (step === 2) return acceptedTerms;
    if (step === 3) return signedDocs.subscription && signedDocs.ppm && signedDocs.operating;
    return false;
  };

  const allDocsSigned = signedDocs.subscription && signedDocs.ppm && signedDocs.operating;

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.6 }}>
          <div className="w-20 h-20 rounded-full bg-brand-teal flex items-center justify-center mx-auto mb-6 glow-gold">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
        </motion.div>
        <h1 className="font-display text-3xl font-bold text-foreground">Investment Committed</h1>
        <p className="text-muted-foreground mb-2">
          You've committed <span className="text-foreground font-semibold">{formatCurrency(parseInt(amount))}</span> to{" "}
          <span className="text-foreground font-semibold">{selectedDeal?.name}</span>
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          You'll receive confirmation and next steps via email. Capital call notices will be sent before due dates.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => navigate("/portfolio")} className="btn-teal hover:opacity-90">
            View Portfolio
          </Button>
          <Button variant="outline" onClick={() => navigate("/deals")}>
            Browse Deals
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link to="/deals" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">SPV Investment</h1>
          <p className="text-sm text-muted-foreground">Step {step + 1} of 5 — {STEPS[step].label}</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-1 mb-10">
        {STEPS.map((s, i) => (
          <div key={s.label} className="flex items-center flex-1">
            <div className={`flex items-center justify-center w-9 h-9 rounded-full shrink-0 transition-all duration-300 ${
              i < step ? "bg-brand-teal text-white" :
              i === step ? "border-2 border-brand-teal text-brand-teal" :
              "border border-border text-muted-foreground"
            }`}>
              {i < step ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 rounded transition-colors duration-300 ${
                i < step ? "bg-brand-teal" : "bg-border"
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25 }}
        >
          {/* Step 0: Select Deal */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold mb-2">Select a Deal</h2>
              <p className="text-sm text-muted-foreground mb-4">Choose an open deal to invest in through an SPV.</p>
              {deals.length === 0 && (
                <div className="glass rounded-xl p-8 text-center text-muted-foreground">
                  No open deals available right now.
                </div>
              )}
              <div className="grid gap-3">
                {deals.map((deal) => (
                  <button
                    key={deal.id}
                    onClick={() => setSelectedDealId(deal.id)}
                    className={`glass rounded-xl p-5 text-left transition-all duration-200 w-full ${
                      selectedDealId === deal.id
                        ? "border border-primary bg-primary/5 glow-gold"
                        : "border border-transparent hover:border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{deal.name}</p>
                        <p className="text-sm text-muted-foreground">{deal.sector} · {deal.stage}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-brand-teal">{deal.target_irr} IRR</p>
                        <p className="text-xs text-muted-foreground">Min {formatCurrency(Number(deal.minimum_investment))}</p>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full gradient-gold"
                        style={{ width: `${Math.min(Math.round(Number(deal.raised_amount) / Number(deal.target_amount) * 100), 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{formatCurrency(Number(deal.raised_amount))} raised</span>
                      <span>{formatCurrency(Number(deal.target_amount))} target</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Amount */}
          {step === 1 && selectedDeal && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-semibold mb-2">Investment Amount</h2>
                <p className="text-sm text-muted-foreground">
                  Enter the amount you'd like to invest in <span className="text-foreground">{selectedDeal.name}</span>.
                  Minimum investment: <span className="text-brand-teal font-medium">{formatCurrency(Number(selectedDeal.minimum_investment))}</span>
                </p>
              </div>
              <div className="glass rounded-xl p-6">
                <Label className="text-sm text-muted-foreground mb-2 block">Amount (USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="pl-10 text-lg h-14 bg-background"
                    min={Number(selectedDeal.minimum_investment)}
                  />
                </div>
                {amount && parseInt(amount) < Number(selectedDeal.minimum_investment) && (
                  <p className="text-sm text-destructive flex items-center gap-1 mt-2">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Below minimum of {formatCurrency(Number(selectedDeal.minimum_investment))}
                  </p>
                )}
                <div className="flex gap-2 mt-4">
                  {[100000, 250000, 500000, 1000000].filter(v => v >= Number(selectedDeal.minimum_investment)).map((v) => (
                    <button
                      key={v}
                      onClick={() => setAmount(String(v))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        amount === String(v)
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {formatCurrency(v)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Review Terms */}
          {step === 2 && selectedDeal && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-semibold mb-2">Review Terms</h2>
                <p className="text-sm text-muted-foreground">Review the SPV terms before proceeding.</p>
              </div>
              <div className="glass rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Deal", value: selectedDeal.name },
                    { label: "Investment", value: formatCurrency(parseInt(amount)) },
                    { label: "Target IRR", value: selectedDeal.target_irr },
                    { label: "Stage", value: selectedDeal.stage },
                    { label: "Sector", value: selectedDeal.sector },
                    { label: "Closing Date", value: selectedDeal.closing_date ?? "TBD" },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4">
                  <h3 className="text-sm font-semibold mb-3">SPV Terms & Conditions</h3>
                  <div className="text-xs text-muted-foreground space-y-2 max-h-48 overflow-y-auto pr-2">
                    <p>1. <strong>Structure.</strong> The investment will be made through a Special Purpose Vehicle (SPV) organized as a limited liability company.</p>
                    <p>2. <strong>Management Fee.</strong> An annual management fee of 2% of committed capital will be charged, payable quarterly.</p>
                    <p>3. <strong>Carried Interest.</strong> The fund manager is entitled to 20% of profits above an 8% preferred return hurdle.</p>
                    <p>4. <strong>Capital Calls.</strong> Capital will be called as needed. Investors will receive at least 10 business days notice prior to each call.</p>
                    <p>5. <strong>Lock-up Period.</strong> Investments are subject to a minimum 3-year lock-up period with limited secondary transfer rights.</p>
                    <p>6. <strong>Distributions.</strong> Distributions will be made on a pro-rata basis as portfolio companies achieve liquidity events.</p>
                    <p>7. <strong>Reporting.</strong> Quarterly NAV reports and annual audited financial statements will be provided.</p>
                    <p>8. <strong>Risks.</strong> Private equity investments are illiquid, speculative, and involve a high degree of risk including potential loss of entire investment.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(v) => setAcceptedTerms(v === true)}
                  />
                  <Label htmlFor="terms" className="text-sm cursor-pointer">
                    I have read and accept the SPV terms and conditions
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Sign Documents */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-semibold mb-2">Sign Documents</h2>
                <p className="text-sm text-muted-foreground">Review and sign each required document to proceed.</p>
              </div>
              <div className="space-y-3">
                {[
                  { key: "subscription" as const, title: "Subscription Agreement", desc: "Agreement to subscribe for membership interests in the SPV." },
                  { key: "ppm" as const, title: "Private Placement Memorandum", desc: "Detailed disclosure document outlining risks, terms, and investment strategy." },
                  { key: "operating" as const, title: "Operating Agreement", desc: "LLC operating agreement governing the SPV's management and operations." },
                ].map((doc) => (
                  <div key={doc.key} className={`glass rounded-xl p-5 transition-all duration-200 ${
                    signedDocs[doc.key] ? "border border-emerald-500/30" : "border border-transparent"
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          signedDocs[doc.key] ? "bg-emerald-500/20" : "bg-secondary"
                        }`}>
                          {signedDocs[doc.key]
                            ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            : <FileText className="w-5 h-5 text-muted-foreground" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-sm">{doc.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{doc.desc}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={signedDocs[doc.key] ? "outline" : "default"}
                        onClick={() => setSignedDocs({ ...signedDocs, [doc.key]: !signedDocs[doc.key] })}
                        className={signedDocs[doc.key] ? "" : "btn-teal hover:opacity-90"}
                      >
                        {signedDocs[doc.key] ? "Signed ✓" : "Sign"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {!allDocsSigned && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> All documents must be signed to proceed.
                </p>
              )}
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && selectedDeal && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-semibold mb-2">Confirm Investment</h2>
                <p className="text-sm text-muted-foreground">Review your investment details and submit.</p>
              </div>
              <div className="glass rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Deal</p>
                    <p className="font-display text-lg font-semibold">{selectedDeal.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Investment Amount</p>
                    <p className="font-display text-lg font-semibold gradient-gold-text">{formatCurrency(parseInt(amount))}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Target IRR</p>
                    <p className="font-medium text-primary">{selectedDeal.target_irr}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Sector</p>
                    <p className="font-medium">{selectedDeal.sector}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Documents</p>
                    <p className="font-medium text-emerald-400">3/3 Signed</p>
                  </div>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-sm">
                  <p className="font-medium mb-1">By confirming, you agree to:</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Commit the above amount to the SPV</li>
                    <li>Respond to capital calls within the specified notice period</li>
                    <li>Comply with the terms of all signed documents</li>
                  </ul>
                </div>
              </div>
              <Button
                onClick={() => investMutation.mutate()}
                disabled={investMutation.isPending}
                className="w-full h-12 btn-teal text-base font-semibold glow-gold"
              >
                {investMutation.isPending ? "Processing..." : "Confirm & Commit Investment"}
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons (not shown on confirm step) */}
      {step < 4 && (
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={goBack} disabled={step === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button
            onClick={goNext}
            disabled={!canProceed()}
            className="btn-teal hover:opacity-90"
          >
            Continue <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

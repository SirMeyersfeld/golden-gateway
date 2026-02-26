import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { FileText, AlertTriangle, Save, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type CmsBlock = {
  id?: string;
  key: string;
  title: string | null;
  body: string | null;
  data: any | null;
  updated_at?: string;
};

const DEFAULT_BLOCKS: CmsBlock[] = [
  {
    key: "landing_hero",
    title: "Landing — Hero",
    body: "Hero strapline and supporting copy on the Vanguard Capital landing page.",
    data: {
      badge: "Private Equity Reimagined",
      eyebrow: "Institutional access, modern infrastructure.",
    },
  },
  {
    key: "landing_stats",
    title: "Landing — Stats Bar",
    body: "Headline metrics shown beneath the hero (AUM, IRR, # of portfolio companies).",
    data: {
      aum: "$2.4B",
      active_deals: "47",
      net_irr: "28.3%",
      companies: "186",
    },
  },
  {
    key: "landing_features",
    title: "Landing — Feature Grid",
    body: "Four core feature tiles describing platform capabilities.",
    data: {
      items: [
        { title: "Deal Flow", badge: "Sourcing", description: "Curated, manager-led private equity deals." },
        { title: "SPV Investing", badge: "Structure", description: "Institutional SPV wrappers with transparent fees." },
      ],
    },
  },
];

export default function Studio() {
  const queryClient = useQueryClient();
  const [selectedKey, setSelectedKey] = useState<string>("landing_hero");

  const { data, isLoading, error } = useQuery({
    queryKey: ["cms-blocks"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("cms_blocks")
        .select("*")
        .order("key", { ascending: true });
      if (error) throw error;
      return (data ?? []) as CmsBlock[];
    },
  });

  const blocks = (data && data.length > 0 ? data : DEFAULT_BLOCKS).sort((a, b) =>
    a.key.localeCompare(b.key),
  );
  const active = blocks.find((b) => b.key === selectedKey) ?? blocks[0];

  const [draftTitle, setDraftTitle] = useState(active?.title ?? "");
  const [draftBody, setDraftBody] = useState(active?.body ?? "");
  const [draftJson, setDraftJson] = useState(
    active?.data ? JSON.stringify(active.data, null, 2) : "{\n  \n}",
  );

  const resetDraftFromActive = (block: CmsBlock) => {
    setDraftTitle(block.title ?? "");
    setDraftBody(block.body ?? "");
    setDraftJson(block.data ? JSON.stringify(block.data, null, 2) : "{\n  \n}");
  };

  const upsertMutation = useMutation({
    mutationFn: async () => {
      let parsed: any = null;
      if (draftJson.trim()) {
        try {
          parsed = JSON.parse(draftJson);
        } catch (e) {
          throw new Error("JSON data is invalid. Please fix it before saving.");
        }
      }

      const payload = {
        key: active.key,
        title: draftTitle || active.title,
        body: draftBody,
        data: parsed,
      };

      const { error } = await (supabase as any).from("cms_blocks").upsert(payload, {
        onConflict: "key",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Content saved");
      queryClient.invalidateQueries({ queryKey: ["cms-blocks"] });
    },
    onError: (e: any) => {
      toast.error(e.message ?? "Failed to save content");
    },
  });

  const isMissingTable =
    (error as any)?.code === "42P01" ||
    (error as any)?.message?.toLowerCase?.().includes("relation \"cms_blocks\" does not exist");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Content Studio</h1>
          <p className="text-muted-foreground mt-1">
            Central place to manage marketing copy and landing-page content.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={upsertMutation.isPending}
          onClick={() => {
            if (active) resetDraftFromActive(active);
          }}
        >
          <Plus className="w-4 h-4" />
          New Block (coming soon)
        </Button>
      </div>

      {isMissingTable && (
        <div className="glass rounded-xl border border-amber-500/30 p-5 mb-6 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div className="text-sm text-amber-100/90">
            <p className="font-medium mb-1">Supabase CMS table not found.</p>
            <p className="mb-2">
              To enable the studio, create a <code className="font-mono text-xs">cms_blocks</code> table in Supabase
              with at least these columns:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-amber-100/90">
              <li>
                <span className="font-mono">key (text, primary key)</span> — unique identifier such as{" "}
                <span className="font-mono">landing_hero</span>
              </li>
              <li>
                <span className="font-mono">title (text)</span> — human-readable name
              </li>
              <li>
                <span className="font-mono">body (text)</span> — description or longer copy
              </li>
              <li>
                <span className="font-mono">data (jsonb, nullable)</span> — arbitrary structured fields
              </li>
              <li>
                <span className="font-mono">updated_at (timestamp with time zone, default now())</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[260px,1fr] gap-6">
        {/* Left rail: block list */}
        <div className="glass rounded-xl p-3 h-fit">
          <p className="text-xs text-muted-foreground px-2 pb-2 uppercase tracking-widest">
            Content Blocks
          </p>
          <div className="space-y-1">
            {blocks.map((block) => (
              <button
                key={block.key}
                type="button"
                onClick={() => {
                  setSelectedKey(block.key);
                  resetDraftFromActive(block);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                  block.key === active.key
                    ? "bg-primary/10 text-foreground border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span className="truncate">{block.title ?? block.key}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right side: editor */}
        <motion.div
          key={active?.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-mono text-primary/80 uppercase tracking-widest">
                {active?.key}
              </p>
              <h2 className="font-display text-xl font-semibold">
                {active?.title ?? "Untitled block"}
              </h2>
            </div>
            <Button
              size="sm"
              className="gap-2 gradient-gold text-primary-foreground hover:opacity-90"
              disabled={upsertMutation.isPending || isLoading}
              onClick={() => upsertMutation.mutate()}
            >
              {upsertMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              )}
            </Button>
          </div>

          {isLoading && !data && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading content…
            </div>
          )}

          <div className="grid gap-4 mt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Block Title
              </label>
              <Input
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                placeholder="Landing — Hero"
                className="bg-muted/40 border-border/60"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Description / Body
              </label>
              <Textarea
                value={draftBody}
                onChange={(e) => setDraftBody(e.target.value)}
                rows={4}
                placeholder="Short description of how this block is used."
                className="bg-muted/40 border-border/60 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Structured Data (JSON)
                </label>
                <span className="text-[10px] text-muted-foreground">
                  This powers specific fields on the site.
                </span>
              </div>
              <Textarea
                value={draftJson}
                onChange={(e) => setDraftJson(e.target.value)}
                rows={10}
                spellCheck={false}
                className="font-mono text-xs leading-relaxed bg-background border-border/70"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


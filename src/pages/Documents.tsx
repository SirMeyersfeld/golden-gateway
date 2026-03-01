import { motion } from "framer-motion";
import { FileText, Download, Eye, Clock, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const documents = [
  { name: "Aether Robotics — Subscription Agreement", type: "Legal", date: "Feb 12, 2026", status: "Signed" },
  { name: "NovaPay — PPM", type: "Offering", date: "Jan 28, 2026", status: "Signed" },
  { name: "Q4 2025 Portfolio Report", type: "Report", date: "Jan 15, 2026", status: "Available" },
  { name: "BioSphere Health — Side Letter", type: "Legal", date: "Dec 20, 2025", status: "Pending" },
  { name: "Helios Energy — K-1 Tax Document", type: "Tax", date: "Mar 1, 2026", status: "Available" },
  { name: "Stratos Cloud — Due Diligence Pack", type: "Offering", date: "Feb 5, 2026", status: "Available" },
];

const statusStyle: Record<string, string> = {
  Signed: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Available: "text-primary bg-primary/10 border-primary/20",
  Pending: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function Documents() {
  const [search, setSearch] = useState("");
  const filtered = documents.filter(
    (doc) =>
      !search ||
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className="mb-10"
      >
        <p className="section-label mb-3">Vault</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">Documents</h1>
        <p className="text-muted-foreground text-base sm:text-lg">Manage subscription agreements, reports, and tax documents.</p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="mb-8"
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-muted/40 border-border/50 rounded-xl focus:border-primary/40"
          />
        </div>
      </motion.div>

      <div className="space-y-3">
        {filtered.map((doc, i) => (
          <motion.div
            key={doc.name}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            custom={i}
            whileHover={{ y: -2, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            className="bento-card p-5 flex items-center gap-4"
          >
            <motion.div
              whileHover={{ rotate: 6, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"
            >
              <FileText className="w-5 h-5 text-primary" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-[15px]">{doc.name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                <span className="pill-badge !py-0 !px-2 !text-[10px] !border-border/40 !bg-muted/40 !text-muted-foreground">{doc.type}</span>
                <Clock className="w-3 h-3" />
                <span>{doc.date}</span>
              </p>
            </div>
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.07 + 0.2 }}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-full border shrink-0 ${statusStyle[doc.status]}`}
            >
              {doc.status}
            </motion.span>
            <div className="flex gap-1 shrink-0">
              <motion.button
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-xl hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
              >
                <Eye className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-xl hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
              >
                <Download className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-muted-foreground"
          >
            No documents found.
          </motion.p>
        )}
      </div>
    </div>
  );
}

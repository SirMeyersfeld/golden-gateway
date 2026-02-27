import { motion } from "framer-motion";
import { FileText, Download, Eye, Clock } from "lucide-react";

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
  hidden: { opacity: 0, x: -16, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1, x: 0, scale: 1,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function Documents() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-10"
      >
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Documents</h1>
        <p className="text-muted-foreground">Manage subscription agreements, reports, and tax documents.</p>
      </motion.div>

      <div className="space-y-3">
        {documents.map((doc, i) => (
          <motion.div
            key={doc.name}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            custom={i}
            whileHover={{ x: 4, scale: 1.01, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            className="glass-hover rounded-xl p-5 flex items-center gap-4"
          >
            <motion.div
              whileHover={{ rotate: 8, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0"
            >
              <FileText className="w-5 h-5 text-primary" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{doc.name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                <span>{doc.type}</span>
                <span>·</span>
                <Clock className="w-3 h-3" />
                <span>{doc.date}</span>
              </p>
            </div>
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.06 + 0.2 }}
              className={`text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${statusStyle[doc.status]}`}
            >
              {doc.status}
            </motion.span>
            <div className="flex gap-1.5 shrink-0">
              <motion.button
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <Eye className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <Download className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

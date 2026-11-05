import { motion } from "framer-motion";

export default function KpiCardAnimated({ label, value, icon: Icon, tone = "neutral" }) {
  const tones = {
    income: "text-[color:var(--color-success)]",
    expense: "text-[color:var(--color-danger)]",
    neutral: "text-[color:var(--color-foreground)]",
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-5 shadow-sm"
    >
      <header className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
        {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
        <h3 className="text-xs font-medium uppercase tracking-widest">{label}</h3>
      </header>
      <p className={`mt-3 text-2xl font-semibold tabular-nums ${tones[tone]}`}>
        {value}
      </p>
    </motion.article>
  );
}

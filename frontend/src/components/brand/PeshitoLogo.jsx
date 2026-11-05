export default function PeshitoLogo({ className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-1 shrink-0 shadow-sm">
        <img src="/peshi_logo_fin.png" alt="PESHI" className="h-full w-full object-contain" />
      </div>
      <span className="text-xl font-black tracking-wider text-[color:var(--color-foreground)]">
        PESHITO
      </span>
    </div>
  );
}

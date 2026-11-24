import React from "react";

export function SkeletonCard({ className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-[#cac4ce]/40 dark:border-white/10 bg-white dark:bg-[#1c182d] p-6 shadow-sm animate-pulse ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="h-3 w-24 bg-slate-200 dark:bg-white/10 rounded-full" />
        <div className="h-8 w-8 bg-slate-200 dark:bg-white/10 rounded-xl" />
      </div>
      <div className="h-7 w-36 bg-slate-200 dark:bg-white/10 rounded-lg mb-2" />
      <div className="h-3 w-48 bg-slate-200 dark:bg-white/10 rounded-full" />
    </div>
  );
}

export function SkeletonTableRows({ rows = 5 }) {
  return (
    <tbody className="divide-y divide-[#cac4ce]/30 dark:divide-white/5 animate-pulse">
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index}>
          <td className="py-4 px-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-white/10" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-32 bg-slate-200 dark:bg-white/10 rounded-full" />
                <div className="h-2.5 w-20 bg-slate-200 dark:bg-white/10 rounded-full" />
              </div>
            </div>
          </td>
          <td className="py-4 px-5">
            <div className="h-5 w-20 bg-slate-200 dark:bg-white/10 rounded-full" />
          </td>
          <td className="py-4 px-5">
            <div className="h-3.5 w-20 bg-slate-200 dark:bg-white/10 rounded-full" />
          </td>
          <td className="py-4 px-5 text-right">
            <div className="h-4 w-16 bg-slate-200 dark:bg-white/10 rounded-full ml-auto" />
          </td>
          <td className="py-4 px-5 text-center">
            <div className="h-6 w-6 bg-slate-200 dark:bg-white/10 rounded-lg mx-auto" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export function SkeletonChart() {
  return (
    <div className="rounded-2xl border border-[#cac4ce]/40 dark:border-white/10 bg-white dark:bg-[#1c182d] p-6 shadow-sm animate-pulse flex flex-col items-center justify-center">
      <div className="w-full flex items-center justify-between mb-6">
        <div className="h-4 w-40 bg-slate-200 dark:bg-white/10 rounded-full" />
        <div className="h-4 w-12 bg-slate-200 dark:bg-white/10 rounded-full" />
      </div>
      <div className="w-44 h-44 rounded-full border-8 border-slate-200 dark:border-white/10 my-4" />
      <div className="w-full space-y-2 mt-4">
        <div className="h-3 w-full bg-slate-200 dark:bg-white/10 rounded-full" />
        <div className="h-3 w-3/4 bg-slate-200 dark:bg-white/10 rounded-full" />
      </div>
    </div>
  );
}

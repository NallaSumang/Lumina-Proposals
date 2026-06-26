import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-secondary lg:block">
        <div className="absolute inset-0 grid-pattern opacity-[0.15]" />
        <div className="absolute -left-32 top-1/3 h-[500px] w-[500px] rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-accent/30 blur-3xl" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-secondary-foreground">
          <Link href="/" className="flex items-center gap-2 text-secondary-foreground">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-white shadow-soft">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-base font-semibold tracking-tight">TenderDox</span>
          </Link>
          <div className="max-w-md">
            <blockquote className="text-2xl font-medium leading-snug tracking-tight">
              “TenderDox cut our average RFP turnaround from three weeks to four days. The answer quality is uncanny.”
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-white">JM</div>
              <div>
                <p className="text-sm font-semibold">Jamie Mendez</p>
                <p className="text-xs text-secondary-foreground/70">VP, Proposals · Northwind Health</p>
              </div>
            </div>
          </div>
          <div className="text-xs text-secondary-foreground/60">SOC 2 Type II · ISO 27001 · GDPR</div>
        </div>
      </div>
      <div className="flex items-center justify-center bg-background p-6 md:p-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}

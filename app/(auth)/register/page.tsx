"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Create your workspace</h1>
        <p className="text-sm text-muted-foreground">Start your 14-day trial. No credit card.</p>
      </div>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Workspace created"); setTimeout(() => router.push("/dashboard"), 400); }}>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5"><Label>First name</Label><Input placeholder="Alex" defaultValue="Alex" /></div>
          <div className="space-y-1.5"><Label>Last name</Label><Input placeholder="Morgan" defaultValue="Morgan" /></div>
        </div>
        <div className="space-y-1.5"><Label>Work email</Label><Input type="email" placeholder="you@company.com" defaultValue="alex@company.com" /></div>
        <div className="space-y-1.5"><Label>Company</Label><Input placeholder="Acme Inc." defaultValue="Acme Inc." /></div>
        <div className="space-y-1.5"><Label>Password</Label><Input type="password" placeholder="••••••••" defaultValue="demopass" /></div>
        <Button type="submit" className="w-full" size="lg">Create workspace</Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account? <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

"use client";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
<p className="text-sm text-muted-foreground">We&apos;ll email you a secure reset link.</p>
      </div>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Reset link sent (demo)"); }}>
        <div className="space-y-1.5"><Label>Email</Label><Input type="email" placeholder="you@company.com" /></div>
        <Button type="submit" className="w-full" size="lg">Send reset link</Button>
      </form>
      <Link href="/login" className="block text-center text-sm text-muted-foreground hover:text-foreground">← Back to sign in</Link>
    </div>
  );
}

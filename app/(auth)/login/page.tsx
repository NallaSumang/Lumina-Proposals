"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
  remember: z.boolean().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "alex@tenderdox.com", password: "demopass" } });

  const onSubmit = (v: FormValues) => {
    toast.success("Welcome back, Alex");
    setTimeout(() => router.push("/dashboard"), 350);
    void v;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in to TenderDox</h1>
        <p className="text-sm text-muted-foreground">Welcome back. Enter your details to continue.</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" type="button" onClick={() => toast.message("Google SSO (demo)")}><GoogleIcon /> Google</Button>
        <Button variant="outline" type="button" onClick={() => toast.message("Microsoft SSO (demo)")}><MsIcon /> Microsoft</Button>
      </div>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" /><span className="text-[10px] uppercase tracking-wider text-muted-foreground">or</span><Separator className="flex-1" />
      </div>

      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" placeholder="you@company.com" {...form.register("email")} />
          {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">Forgot?</Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" {...form.register("password")} />
          {form.formState.errors.password && <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>}
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox id="remember" defaultChecked /> Remember me for 30 days
        </label>
        <Button type="submit" className="w-full" size="lg">Sign in</Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        New to TenderDox? <Link href="/register" className="font-medium text-primary hover:underline">Create an account</Link>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.11V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.2 1.65l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
  );
}
function MsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="#F25022" d="M2 2h9v9H2z"/><path fill="#7FBA00" d="M13 2h9v9h-9z"/><path fill="#00A4EF" d="M2 13h9v9H2z"/><path fill="#FFB900" d="M13 13h9v9h-9z"/></svg>
  );
}

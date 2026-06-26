"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/common/page-header";
import { users } from "@/lib/mock";
import { initials } from "@/lib/utils";
import { Copy, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Workspace, team, security and integrations." />
      <Tabs defaultValue="workspace">
        <TabsList>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API & keys</TabsTrigger>
          <TabsTrigger value="security">Security & SSO</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="workspace">
          <Card>
            <CardHeader><CardTitle>Workspace</CardTitle><CardDescription>Branding and defaults for your team.</CardDescription></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5"><Label>Workspace name</Label><Input defaultValue="Acme Inc." /></div>
              <div className="space-y-1.5"><Label>Domain</Label><Input defaultValue="acme.tenderdox.com" /></div>
              <div className="space-y-1.5"><Label>Default language</Label><Input defaultValue="English (US)" /></div>
              <div className="space-y-1.5"><Label>Time zone</Label><Input defaultValue="America/New_York" /></div>
              <div className="md:col-span-2"><Button onClick={() => toast.success("Saved")}>Save changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div><CardTitle>Team members</CardTitle><CardDescription>{users.length} active users · Enterprise seats</CardDescription></div>
              <Button><Plus className="h-4 w-4" /> Invite</Button>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {users.map((u) => (
                  <li key={u.id} className="flex items-center gap-4 py-3">
                    <Avatar><AvatarFallback>{initials(u.name)}</AvatarFallback></Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">{u.role}</Badge>
                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle>Notification preferences</CardTitle><CardDescription>Choose how you receive alerts.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              {["RFP processing completed", "Review requested", "Low confidence detected", "Document indexed", "Weekly digest"].map((label) => (
                <div key={label} className="flex items-center justify-between rounded-lg border p-3">
                  <div><p className="text-sm font-medium">{label}</p><p className="text-xs text-muted-foreground">Email · In-app</p></div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div><CardTitle>API keys</CardTitle><CardDescription>Use the TenderDox API for ingestion and exports.</CardDescription></div>
              <Button><Plus className="h-4 w-4" /> New key</Button>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {[{ name: "Production", value: "td_live_••••••••3f9a" }, { name: "Staging", value: "td_test_••••••••b21c" }].map((k) => (
                  <li key={k.name} className="flex items-center gap-3 py-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{k.name}</p>
                      <code className="text-xs text-muted-foreground">{k.value}</code>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toast.success("Copied")}><Copy className="h-3.5 w-3.5" /> Copy</Button>
                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader><CardTitle>Security & SSO</CardTitle><CardDescription>SAML, OIDC, audit logs and session control.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div><p className="text-sm font-medium">SAML SSO</p><p className="text-xs text-muted-foreground">Connected to Okta · enforce for all members</p></div>
                <Badge variant="success">Connected</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div><p className="text-sm font-medium">Two-factor authentication</p><p className="text-xs text-muted-foreground">Require 2FA for all admins</p></div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div><p className="text-sm font-medium">Audit logs</p><p className="text-xs text-muted-foreground">Stream to SIEM via webhook</p></div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader><CardTitle>Billing</CardTitle><CardDescription>Plan, seats and invoices.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-accent/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-primary">Enterprise</p>
                    <p className="mt-1 text-2xl font-semibold">$2,400 <span className="text-sm font-normal text-muted-foreground">/ month</span></p>
                    <p className="text-xs text-muted-foreground">24 seats · unlimited RFPs · SSO · audit logs</p>
                  </div>
                  <Button variant="outline">Manage plan</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

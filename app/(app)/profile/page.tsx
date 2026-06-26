"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/page-header";
import { currentUser, activity } from "@/lib/mock";
import { initials, formatRelative } from "@/lib/utils";
import { Monitor, Smartphone } from "lucide-react";

const sessions = [
  { device: "MacBook Pro · Chrome", location: "New York, US", lastActive: new Date(Date.now() - 1000 * 60 * 4).toISOString(), current: true, Icon: Monitor },
  { device: "iPhone 15 · Safari", location: "New York, US", lastActive: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), current: false, Icon: Smartphone },
  { device: "Windows · Edge", location: "London, UK", lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), current: false, Icon: Monitor },
];

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Your personal account and security." />

      <Card>
        <CardContent className="flex flex-col items-start gap-5 p-6 md:flex-row md:items-center">
          <Avatar className="h-20 w-20 text-base"><AvatarFallback className="text-lg">{initials(currentUser.name)}</AvatarFallback></Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2"><h2 className="text-xl font-semibold">{currentUser.name}</h2><Badge variant="outline" className="capitalize">{currentUser.role}</Badge></div>
            <p className="text-sm text-muted-foreground">{currentUser.title} · {currentUser.email}</p>
          </div>
          <Button variant="outline">Change avatar</Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader><CardTitle>Account details</CardTitle><CardDescription>Update your personal information.</CardDescription></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5"><Label>Full name</Label><Input defaultValue={currentUser.name} /></div>
              <div className="space-y-1.5"><Label>Job title</Label><Input defaultValue={currentUser.title} /></div>
              <div className="space-y-1.5 md:col-span-2"><Label>Email</Label><Input type="email" defaultValue={currentUser.email} /></div>
              <div className="md:col-span-2"><Button>Save changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader><CardTitle>Preferences</CardTitle><CardDescription>Personalize your TenderDox experience.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              {["Compact density", "Auto-save drafts", "Show keyboard shortcuts", "Smart citations in editor"].map((label) => (
                <div key={label} className="flex items-center justify-between rounded-lg border p-3">
                  <p className="text-sm font-medium">{label}</p>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader><CardTitle>Active sessions</CardTitle><CardDescription>Devices currently signed in.</CardDescription></CardHeader>
            <CardContent>
              <ul className="divide-y">
                {sessions.map((s) => (
                  <li key={s.device} className="flex items-center gap-4 py-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-muted-foreground"><s.Icon className="h-4 w-4" /></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{s.device} {s.current && <Badge variant="success" className="ml-2">This device</Badge>}</p>
                      <p className="text-xs text-muted-foreground">{s.location} · {formatRelative(s.lastActive)}</p>
                    </div>
                    {!s.current && <Button variant="outline" size="sm">Revoke</Button>}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader><CardTitle>Your activity</CardTitle><CardDescription>Recent actions across the workspace.</CardDescription></CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {activity.map((a) => (
                  <li key={a.id} className="flex items-start gap-3 border-l-2 border-primary/30 pl-3">
                    <div>
                      <p className="text-sm"><span className="font-medium">{a.actor.name}</span> <span className="text-muted-foreground">{a.type}</span> <span className="font-medium">{a.target}</span></p>
                      <p className="text-xs text-muted-foreground">{formatRelative(a.timestamp)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

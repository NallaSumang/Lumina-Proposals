"use client";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";

const tooltipStyle = {
  contentStyle: { background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12, boxShadow: "0 10px 30px -10px rgb(15 23 42 / 0.12)" },
  labelStyle: { fontWeight: 600, color: "hsl(var(--foreground))" },
};

export function ActivityChart({ data }: { data: { day: string; uploads: number; answers: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} /><stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient>
          <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.3} /><stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} /></linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        <Tooltip {...tooltipStyle} />
        <Area type="monotone" dataKey="answers" stroke="hsl(var(--primary))" fill="url(#g1)" strokeWidth={2} />
        <Area type="monotone" dataKey="uploads" stroke="hsl(var(--accent))" fill="url(#g2)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ConfidenceChart({ data }: { data: { bucket: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="bucket" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="hsl(var(--primary))" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MonthlyChart({ data }: { data: { month: string; rfps: number; hours: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="rfps" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="hours" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

const PIE_COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))"];
export function StatusPie({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2} strokeWidth={0}>
          {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
        </Pie>
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
}

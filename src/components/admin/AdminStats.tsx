import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CreditCard, Award, Clock, CheckCircle, XCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

const DOMAIN_COLORS: Record<string, string> = {
  computer_science: "hsl(var(--primary))",
  engineering: "hsl(var(--info))",
  medicine: "hsl(var(--success))",
  physics: "hsl(var(--warning))",
  chemistry: "hsl(var(--accent))",
  biology: "hsl(142, 76%, 36%)",
  mathematics: "hsl(280, 65%, 60%)",
  social_sciences: "hsl(340, 75%, 55%)",
  humanities: "hsl(45, 93%, 47%)",
  other: "hsl(var(--muted-foreground))",
};

const STATUS_COLORS = {
  submitted: "hsl(var(--info))",
  under_review: "hsl(var(--warning))",
  approved: "hsl(var(--success))",
  published: "hsl(var(--primary))",
  rejected: "hsl(var(--destructive))",
  revision_requested: "hsl(var(--accent))",
};

export function AdminStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [papersRes, paymentsRes, certificatesRes] = await Promise.all([
        supabase.from("papers").select("status, domain, submitted_at, created_at"),
        supabase.from("payments").select("status, total_amount, created_at"),
        supabase.from("certificates").select("id, created_at"),
      ]);

      const papers = papersRes.data || [];
      const payments = paymentsRes.data || [];
      const certificates = certificatesRes.data || [];

      // Calculate submissions over last 6 months
      const submissionsByMonth = [];
      for (let i = 5; i >= 0; i--) {
        const monthStart = startOfMonth(subMonths(new Date(), i));
        const monthEnd = endOfMonth(subMonths(new Date(), i));
        const count = papers.filter((p) => {
          const date = new Date(p.submitted_at);
          return date >= monthStart && date <= monthEnd;
        }).length;
        submissionsByMonth.push({
          month: format(monthStart, "MMM"),
          submissions: count,
        });
      }

      // Calculate domain distribution
      const domainCounts: Record<string, number> = {};
      papers.forEach((p) => {
        const domain = p.domain || "other";
        domainCounts[domain] = (domainCounts[domain] || 0) + 1;
      });
      const domainData = Object.entries(domainCounts).map(([name, value]) => ({
        name: name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        value,
        color: DOMAIN_COLORS[name] || DOMAIN_COLORS.other,
      }));

      // Calculate status distribution
      const statusCounts: Record<string, number> = {};
      papers.forEach((p) => {
        statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
      });
      const statusData = Object.entries(statusCounts).map(([name, value]) => ({
        name: name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        value,
        color: STATUS_COLORS[name as keyof typeof STATUS_COLORS] || "hsl(var(--muted-foreground))",
      }));

      return {
        totalPapers: papers.length,
        pendingPapers: papers.filter((p) => p.status === "submitted" || p.status === "under_review").length,
        approvedPapers: papers.filter((p) => p.status === "approved" || p.status === "published").length,
        rejectedPapers: papers.filter((p) => p.status === "rejected").length,
        totalPayments: payments.length,
        pendingPayments: payments.filter((p) => p.status === "pending").length,
        verifiedPayments: payments.filter((p) => p.status === "verified").length,
        totalRevenue: payments
          .filter((p) => p.status === "verified")
          .reduce((sum, p) => sum + (p.total_amount || 0), 0),
        totalCertificates: certificates.length,
        submissionsByMonth,
        domainData,
        statusData,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Papers",
      value: stats?.totalPapers || 0,
      icon: FileText,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Pending Review",
      value: stats?.pendingPapers || 0,
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      title: "Approved",
      value: stats?.approvedPapers || 0,
      icon: CheckCircle,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      title: "Rejected",
      value: stats?.rejectedPapers || 0,
      icon: XCircle,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      title: "Total Payments",
      value: stats?.totalPayments || 0,
      icon: CreditCard,
      color: "text-info",
      bg: "bg-info/10",
    },
    {
      title: "Pending Payments",
      value: stats?.pendingPayments || 0,
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      title: "Total Revenue",
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: CreditCard,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      title: "Certificates Issued",
      value: stats?.totalCertificates || 0,
      icon: Award,
      color: "text-accent",
      bg: "bg-accent/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-semibold mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">Monitor submissions, payments, and certificates at a glance.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Submissions Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Submissions Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.submissionsByMonth || []}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="month" 
                    className="text-xs fill-muted-foreground"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Bar 
                    dataKey="submissions" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                    name="Submissions"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Domain Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Domain Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.domainData || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {(stats?.domainData || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Paper Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.statusData || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                  <XAxis 
                    type="number"
                    className="text-xs fill-muted-foreground"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    allowDecimals={false}
                  />
                  <YAxis 
                    type="category"
                    dataKey="name" 
                    className="text-xs fill-muted-foreground"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    width={120}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Papers">
                    {(stats?.statusData || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

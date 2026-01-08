import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CreditCard, Award, Clock, CheckCircle, XCircle } from "lucide-react";

export function AdminStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [papersRes, paymentsRes, certificatesRes] = await Promise.all([
        supabase.from("papers").select("status"),
        supabase.from("payments").select("status, total_amount"),
        supabase.from("certificates").select("id"),
      ]);

      const papers = papersRes.data || [];
      const payments = paymentsRes.data || [];
      const certificates = certificatesRes.data || [];

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
    </div>
  );
}

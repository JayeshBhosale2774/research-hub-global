import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, Calendar, ExternalLink, FileText } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  submitted: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  verified: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

interface PaymentWithPaper {
  id: string;
  paper_id: string;
  base_amount: number;
  extra_author_fee: number | null;
  hardcopy_fee: number | null;
  total_amount: number;
  status: string;
  transaction_id: string | null;
  wants_hardcopy: boolean | null;
  shipping_address: string | null;
  payment_proof_path: string | null;
  created_at: string;
  paid_at: string | null;
  verified_at: string | null;
  paper: {
    title: string;
    status: string;
  } | null;
}

export function MyPayments() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ["my-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          paper:papers(title, status)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PaymentWithPaper[];
    },
  });

  const handleViewProof = async (proofPath: string) => {
    const { data } = await supabase.storage
      .from("payment-proofs")
      .createSignedUrl(proofPath, 3600);
    
    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No payments yet</h3>
          <p className="text-muted-foreground text-center">
            Payment records will appear here once your paper is approved
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Payments</h2>

      <div className="grid gap-4">
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {payment.paper?.title || "Unknown Paper"}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Created {format(new Date(payment.created_at), "PPP")}
                  </CardDescription>
                </div>
                <Badge className={statusColors[payment.status] || ""}>
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Base Amount:</span>
                  <p className="font-medium">₹{payment.base_amount}</p>
                </div>
                {payment.extra_author_fee && payment.extra_author_fee > 0 && (
                  <div>
                    <span className="text-muted-foreground">Extra Authors:</span>
                    <p className="font-medium">₹{payment.extra_author_fee}</p>
                  </div>
                )}
                {payment.wants_hardcopy && payment.hardcopy_fee && (
                  <div>
                    <span className="text-muted-foreground">Hardcopy Fee:</span>
                    <p className="font-medium">₹{payment.hardcopy_fee}</p>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Total:</span>
                  <p className="font-bold text-lg">₹{payment.total_amount}</p>
                </div>
              </div>

              {payment.transaction_id && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Transaction ID:</span>{" "}
                  <span className="font-mono">{payment.transaction_id}</span>
                </div>
              )}

              {payment.wants_hardcopy && payment.shipping_address && (
                <div className="p-3 bg-muted rounded-lg text-sm">
                  <p className="font-medium mb-1">Shipping Address:</p>
                  <p className="text-muted-foreground">{payment.shipping_address}</p>
                </div>
              )}

              {payment.verified_at && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  Verified on {format(new Date(payment.verified_at), "PPP")}
                </p>
              )}

              {payment.payment_proof_path && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewProof(payment.payment_proof_path!)}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Payment Proof
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

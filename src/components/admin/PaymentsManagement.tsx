import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Eye, CheckCircle, XCircle, Search, CreditCard, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type Payment = Database["public"]["Tables"]["payments"]["Row"];

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  submitted: "bg-info/10 text-info border-info/20",
  verified: "bg-success/10 text-success border-success/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

export function PaymentsManagement() {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const queryClient = useQueryClient();

  const { data: payments, isLoading } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Payment[];
    },
  });

  const updatePaymentMutation = useMutation({
    mutationFn: async ({ paymentId, status }: { paymentId: string; status: string }) => {
      const updateData: Partial<Payment> = { status };
      if (status === "verified") {
        updateData.verified_at = new Date().toISOString();
      }

      const { error } = await supabase.from("payments").update(updateData).eq("id", paymentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Payment status updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update payment: " + error.message);
    },
  });

  const getPaymentProofUrl = async (path: string) => {
    const { data } = await supabase.storage.from("payment-proofs").createSignedUrl(path, 3600);
    return data?.signedUrl;
  };

  const handleViewProof = async (payment: Payment) => {
    if (payment.payment_proof_path) {
      const url = await getPaymentProofUrl(payment.payment_proof_path);
      if (url) {
        window.open(url, "_blank");
      }
    }
  };

  const filteredPayments = payments?.filter((payment) => {
    const matchesSearch = payment.transaction_id
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return (matchesSearch || !searchTerm) && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-semibold">Payments Management</h2>
          <p className="text-muted-foreground">Verify and manage payment submissions</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading payments...</div>
          ) : filteredPayments?.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No payments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Base</TableHead>
                    <TableHead>Extras</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments?.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-sm">
                        {payment.transaction_id || "—"}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₹{payment.total_amount.toLocaleString()}
                      </TableCell>
                      <TableCell>₹{payment.base_amount.toLocaleString()}</TableCell>
                      <TableCell>
                        {payment.extra_author_fee || payment.hardcopy_fee ? (
                          <span className="text-sm text-muted-foreground">
                            +₹{((payment.extra_author_fee || 0) + (payment.hardcopy_fee || 0)).toLocaleString()}
                          </span>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[payment.status]} variant="outline">
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(payment.created_at), "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedPayment(payment);
                              setViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {payment.payment_proof_path && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewProof(payment)}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          {(payment.status === "pending" || payment.status === "submitted") && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-success hover:text-success"
                                onClick={() =>
                                  updatePaymentMutation.mutate({
                                    paymentId: payment.id,
                                    status: "verified",
                                  })
                                }
                                disabled={updatePaymentMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() =>
                                  updatePaymentMutation.mutate({
                                    paymentId: payment.id,
                                    status: "rejected",
                                  })
                                }
                                disabled={updatePaymentMutation.isPending}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Transaction ID
                  </label>
                  <p className="font-mono">{selectedPayment.transaction_id || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge className={statusColors[selectedPayment.status]} variant="outline">
                    {selectedPayment.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Base Amount</label>
                  <p>₹{selectedPayment.base_amount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
                  <p className="font-semibold">₹{selectedPayment.total_amount.toLocaleString()}</p>
                </div>
                {selectedPayment.extra_author_fee && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Extra Author Fee
                    </label>
                    <p>₹{selectedPayment.extra_author_fee.toLocaleString()}</p>
                  </div>
                )}
                {selectedPayment.hardcopy_fee && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Hardcopy Fee</label>
                    <p>₹{selectedPayment.hardcopy_fee.toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Wants Hardcopy</label>
                  <p>{selectedPayment.wants_hardcopy ? "Yes" : "No"}</p>
                </div>
              </div>
              {selectedPayment.shipping_address && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Shipping Address
                  </label>
                  <p className="text-sm mt-1 whitespace-pre-wrap">
                    {selectedPayment.shipping_address}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {selectedPayment?.payment_proof_path && (
              <Button variant="outline" onClick={() => handleViewProof(selectedPayment)}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View Payment Proof
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

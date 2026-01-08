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
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Award, Search, Plus, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type Certificate = Database["public"]["Tables"]["certificates"]["Row"];
type Paper = Database["public"]["Tables"]["papers"]["Row"];

export function CertificatesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [selectedPaperId, setSelectedPaperId] = useState<string>("");

  const queryClient = useQueryClient();

  const { data: certificates, isLoading } = useQuery({
    queryKey: ["admin-certificates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("issued_at", { ascending: false });

      if (error) throw error;
      return data as Certificate[];
    },
  });

  const { data: eligiblePapers } = useQuery({
    queryKey: ["eligible-papers"],
    queryFn: async () => {
      // Get papers that are approved/published and don't have a certificate yet
      const { data: papers, error } = await supabase
        .from("papers")
        .select("id, title, domain, author_id")
        .in("status", ["approved", "published"]);

      if (error) throw error;

      // Get papers that already have certificates
      const { data: existingCerts } = await supabase
        .from("certificates")
        .select("paper_id");

      const certifiedPaperIds = new Set(existingCerts?.map((c) => c.paper_id) || []);

      return (papers as Paper[]).filter((p) => !certifiedPaperIds.has(p.id));
    },
  });

  const generateCertificateMutation = useMutation({
    mutationFn: async (paperId: string) => {
      // Generate certificate number using database function
      const { data: certNumber, error: certNumError } = await supabase.rpc(
        "generate_certificate_number"
      );

      if (certNumError) throw certNumError;

      // Create QR code data (URL for verification)
      const qrCodeData = `${window.location.origin}/verify/${certNumber}`;

      // Insert certificate
      const { error } = await supabase.from("certificates").insert({
        paper_id: paperId,
        certificate_number: certNumber,
        qr_code_data: qrCodeData,
        is_valid: true,
      });

      if (error) throw error;

      // Update paper status to published
      await supabase.from("papers").update({ 
        status: "published",
        published_at: new Date().toISOString()
      }).eq("id", paperId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
      queryClient.invalidateQueries({ queryKey: ["eligible-papers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-papers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Certificate generated successfully");
      setGenerateDialogOpen(false);
      setSelectedPaperId("");
    },
    onError: (error) => {
      toast.error("Failed to generate certificate: " + error.message);
    },
  });

  const toggleValidityMutation = useMutation({
    mutationFn: async ({ certId, isValid }: { certId: string; isValid: boolean }) => {
      const { error } = await supabase
        .from("certificates")
        .update({ is_valid: isValid })
        .eq("id", certId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
      toast.success("Certificate validity updated");
    },
    onError: (error) => {
      toast.error("Failed to update certificate: " + error.message);
    },
  });

  const filteredCertificates = certificates?.filter((cert) =>
    cert.certificate_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-semibold">Certificates Management</h2>
          <p className="text-muted-foreground">Generate and manage publication certificates</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => setGenerateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Generate Certificate
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading certificates...</div>
          ) : filteredCertificates?.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No certificates found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certificate Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Issued Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCertificates?.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell className="font-mono font-medium">
                        {cert.certificate_number}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            cert.is_valid
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-destructive/10 text-destructive border-destructive/20"
                          }
                        >
                          {cert.is_valid ? "Valid" : "Revoked"}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(cert.issued_at), "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          {cert.is_valid ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() =>
                                toggleValidityMutation.mutate({
                                  certId: cert.id,
                                  isValid: false,
                                })
                              }
                              disabled={toggleValidityMutation.isPending}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-success hover:text-success"
                              onClick={() =>
                                toggleValidityMutation.mutate({
                                  certId: cert.id,
                                  isValid: true,
                                })
                              }
                              disabled={toggleValidityMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
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

      {/* Generate Dialog */}
      <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Generate Certificate</DialogTitle>
            <DialogDescription>
              Select an approved paper to generate a publication certificate.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {eligiblePapers?.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No eligible papers available. Papers must be approved first.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {eligiblePapers?.map((paper) => (
                  <div
                    key={paper.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPaperId === paper.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedPaperId(paper.id)}
                  >
                    <p className="font-medium text-sm">{paper.title}</p>
                    <Badge variant="outline" className="mt-1">
                      {paper.domain}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => generateCertificateMutation.mutate(selectedPaperId)}
              disabled={!selectedPaperId || generateCertificateMutation.isPending}
            >
              {generateCertificateMutation.isPending ? "Generating..." : "Generate Certificate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

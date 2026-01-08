import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Eye, CheckCircle, XCircle, Clock, Search, FileText } from "lucide-react";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type Paper = Database["public"]["Tables"]["papers"]["Row"];
type PaperStatus = Database["public"]["Enums"]["paper_status"];

const statusColors: Record<PaperStatus, string> = {
  submitted: "bg-info/10 text-info border-info/20",
  under_review: "bg-warning/10 text-warning border-warning/20",
  revision_requested: "bg-accent/10 text-accent-foreground border-accent/20",
  approved: "bg-success/10 text-success border-success/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  published: "bg-primary/10 text-primary border-primary/20",
};

export function PapersManagement() {
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | "revision" | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [plagiarismScore, setPlagiarismScore] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const queryClient = useQueryClient();

  const { data: papers, isLoading } = useQuery({
    queryKey: ["admin-papers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("papers")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (error) throw error;
      return data as Paper[];
    },
  });

  const updatePaperMutation = useMutation({
    mutationFn: async ({
      paperId,
      status,
      notes,
      score,
    }: {
      paperId: string;
      status: PaperStatus;
      notes?: string;
      score?: number;
    }) => {
      const updateData: Partial<Paper> = {
        status,
        reviewed_at: new Date().toISOString(),
      };

      if (notes) updateData.admin_notes = notes;
      if (score !== undefined) updateData.plagiarism_score = score;
      if (status === "approved") updateData.approved_at = new Date().toISOString();

      const { error } = await supabase.from("papers").update(updateData).eq("id", paperId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-papers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Paper status updated successfully");
      setActionDialogOpen(false);
      setAdminNotes("");
      setPlagiarismScore("");
    },
    onError: (error) => {
      toast.error("Failed to update paper: " + error.message);
    },
  });

  const handleAction = (paper: Paper, action: "approve" | "reject" | "revision") => {
    setSelectedPaper(paper);
    setActionType(action);
    setAdminNotes(paper.admin_notes || "");
    setPlagiarismScore(paper.plagiarism_score?.toString() || "");
    setActionDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedPaper || !actionType) return;

    const statusMap: Record<string, PaperStatus> = {
      approve: "approved",
      reject: "rejected",
      revision: "revision_requested",
    };

    updatePaperMutation.mutate({
      paperId: selectedPaper.id,
      status: statusMap[actionType],
      notes: adminNotes,
      score: plagiarismScore ? parseFloat(plagiarismScore) : undefined,
    });
  };

  const filteredPapers = papers?.filter((paper) => {
    const matchesSearch =
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || paper.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-semibold">Papers Management</h2>
          <p className="text-muted-foreground">Review and manage submitted papers</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search papers..."
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
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="revision_requested">Revision Requested</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading papers...</div>
          ) : filteredPapers?.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No papers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPapers?.map((paper) => (
                    <TableRow key={paper.id}>
                      <TableCell className="font-medium max-w-xs truncate">
                        {paper.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{paper.domain}</Badge>
                      </TableCell>
                      <TableCell className="capitalize">
                        {paper.publication_type.replace("_", " ")}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[paper.status]} variant="outline">
                          {paper.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(paper.submitted_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedPaper(paper);
                              setViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {(paper.status === "submitted" || paper.status === "under_review") && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-success hover:text-success"
                                onClick={() => handleAction(paper, "approve")}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-warning hover:text-warning"
                                onClick={() => handleAction(paper, "revision")}
                              >
                                <Clock className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleAction(paper, "reject")}
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
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">{selectedPaper?.title}</DialogTitle>
          </DialogHeader>
          {selectedPaper && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Domain</label>
                  <p>{selectedPaper.domain}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <p className="capitalize">{selectedPaper.publication_type.replace("_", " ")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge className={statusColors[selectedPaper.status]} variant="outline">
                    {selectedPaper.status.replace("_", " ")}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Plagiarism Score
                  </label>
                  <p>{selectedPaper.plagiarism_score ?? "Not checked"}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Abstract</label>
                <p className="text-sm mt-1 whitespace-pre-wrap">{selectedPaper.abstract}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Keywords</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedPaper.keywords?.map((keyword, i) => (
                    <Badge key={i} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
              {selectedPaper.admin_notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Admin Notes</label>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{selectedPaper.admin_notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif capitalize">
              {actionType === "revision" ? "Request Revision" : `${actionType} Paper`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Plagiarism Score (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={plagiarismScore}
                onChange={(e) => setPlagiarismScore(e.target.value)}
                placeholder="Enter plagiarism score"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Admin Notes</label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes for the author..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              disabled={updatePaperMutation.isPending}
              className={
                actionType === "approve"
                  ? "bg-success hover:bg-success/90"
                  : actionType === "reject"
                  ? "bg-destructive hover:bg-destructive/90"
                  : ""
              }
            >
              {updatePaperMutation.isPending ? "Updating..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

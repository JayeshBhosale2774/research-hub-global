import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Calendar, ExternalLink, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  under_review: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  revision_requested: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  published: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

const statusLabels: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  revision_requested: "Revision Requested",
  approved: "Approved",
  rejected: "Rejected",
  published: "Published",
};

export function MyPapers() {
  const { data: papers, isLoading } = useQuery({
    queryKey: ["my-papers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("papers")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleViewPaper = async (filePath: string) => {
    const { data } = await supabase.storage
      .from("papers")
      .createSignedUrl(filePath, 3600);
    
    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!papers || papers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No papers submitted yet</h3>
          <p className="text-muted-foreground text-center mb-4">
            Start by submitting your first research paper
          </p>
          <Button asChild>
            <Link to="/submit">
              <Plus className="mr-2 h-4 w-4" />
              Submit Paper
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Papers</h2>
        <Button asChild>
          <Link to="/submit">
            <Plus className="mr-2 h-4 w-4" />
            Submit New Paper
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {papers.map((paper) => (
          <Card key={paper.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{paper.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Submitted {format(new Date(paper.submitted_at), "PPP")}
                  </CardDescription>
                </div>
                <Badge className={statusColors[paper.status] || ""}>
                  {statusLabels[paper.status] || paper.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Domain:</span>{" "}
                  <span className="font-medium capitalize">{paper.domain.replace(/_/g, " ")}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>{" "}
                  <span className="font-medium capitalize">{paper.publication_type.replace(/_/g, " ")}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {paper.abstract}
              </p>

              {paper.admin_notes && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Admin Notes:</p>
                  <p className="text-sm text-muted-foreground">{paper.admin_notes}</p>
                </div>
              )}

              {paper.revision_deadline && paper.status === "revision_requested" && (
                <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <p className="text-sm text-orange-800 dark:text-orange-200">
                    <strong>Revision Deadline:</strong>{" "}
                    {format(new Date(paper.revision_deadline), "PPP")}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                {paper.file_path && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewPaper(paper.file_path!)}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Paper
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

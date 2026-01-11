import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Calendar, Download, ExternalLink, QrCode } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface CertificateWithPaper {
  id: string;
  certificate_number: string;
  qr_code_data: string;
  is_valid: boolean;
  issued_at: string;
  pdf_path: string | null;
  paper: {
    id: string;
    title: string;
  } | null;
}

export function MyCertificates() {
  const { user } = useAuth();

  const { data: certificates, isLoading } = useQuery({
    queryKey: ["my-certificates", user?.id],
    queryFn: async () => {
      // First get user's papers
      const { data: papers, error: papersError } = await supabase
        .from("papers")
        .select("id, title")
        .eq("status", "published");

      if (papersError) throw papersError;
      if (!papers || papers.length === 0) return [];

      // Get certificates for those papers
      const paperIds = papers.map((p) => p.id);
      const { data: certs, error: certsError } = await supabase
        .from("certificates")
        .select("*")
        .in("paper_id", paperIds)
        .order("issued_at", { ascending: false });

      if (certsError) throw certsError;

      // Combine certificate data with paper info
      return (certs || []).map((cert) => ({
        ...cert,
        paper: papers.find((p) => p.id === cert.paper_id) || null,
      })) as CertificateWithPaper[];
    },
    enabled: !!user?.id,
  });

  const handleDownloadCertificate = async (pdfPath: string) => {
    const { data } = await supabase.storage
      .from("certificates")
      .getPublicUrl(pdfPath);
    
    if (data?.publicUrl) {
      window.open(data.publicUrl, "_blank");
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

  if (!certificates || certificates.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Award className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No certificates yet</h3>
          <p className="text-muted-foreground text-center">
            Certificates will be available once your paper is published
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Certificates</h2>

      <div className="grid gap-4">
        {certificates.map((cert) => (
          <Card key={cert.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    {cert.paper?.title || "Unknown Paper"}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Issued {format(new Date(cert.issued_at), "PPP")}
                  </CardDescription>
                </div>
                <Badge 
                  className={cert.is_valid 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  }
                >
                  {cert.is_valid ? "Valid" : "Revoked"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Certificate Number:</span>
                <span className="font-mono font-medium">{cert.certificate_number}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {cert.pdf_path && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleDownloadCertificate(cert.pdf_path!)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Certificate
                  </Button>
                )}
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/verify/${cert.certificate_number}`}>
                    <QrCode className="mr-2 h-4 w-4" />
                    Verify Certificate
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

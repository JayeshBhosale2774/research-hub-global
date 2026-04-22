import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Download, Loader2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { toast } from "sonner";

// Load worker from CDN matching pdfjs version
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);

  const filePath = searchParams.get("file");
  const title = searchParams.get("title") || "Document";

  useEffect(() => {
    const loadPDF = async () => {
      if (!filePath) {
        setError("No file path provided");
        setLoading(false);
        return;
      }
      try {
        const { data, error: dlErr } = await supabase.storage
          .from("papers")
          .download(filePath);
        if (dlErr) throw dlErr;
        const buf = new Uint8Array(await data.arrayBuffer());
        setPdfData(buf);
      } catch (err) {
        console.error("Error loading PDF:", err);
        setError("Failed to load PDF. Please try again.");
        toast.error("Failed to load PDF");
      } finally {
        setLoading(false);
      }
    };
    loadPDF();
  }, [filePath]);

  const handleDownload = async () => {
    if (!filePath) return;
    try {
      const { data, error } = await supabase.storage.from("papers").download(filePath);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded!");
    } catch (err) {
      console.error("Error downloading PDF:", err);
      toast.error("Failed to download PDF");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b border-border sticky top-16 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <h1 className="font-serif text-lg font-semibold text-foreground truncate max-w-md">
                  {title}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                {numPages > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                      disabled={pageNumber <= 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground min-w-[80px] text-center">
                      {pageNumber} / {numPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
                      disabled={pageNumber >= numPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setScale((s) => Math.min(3, s + 0.2))}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm" onClick={handleDownload} disabled={!pdfData}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading PDF...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-destructive mb-4">{error}</p>
              <Button variant="outline" onClick={() => navigate(-1)}>
                Go Back
              </Button>
            </div>
          ) : pdfData ? (
            <div className="flex justify-center bg-muted/30 rounded-xl border border-border p-4 overflow-auto max-h-[85vh]">
              <Document
                file={{ data: pdfData }}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                onLoadError={(e) => {
                  console.error(e);
                  setError("Failed to render PDF");
                }}
                loading={
                  <div className="flex items-center gap-2 py-10">
                    <Loader2 className="w-5 h-5 animate-spin" /> Rendering...
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-lg"
                />
              </Document>
            </div>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Download, Loader2, ZoomIn, ZoomOut } from "lucide-react";
import { toast } from "sonner";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function PDFViewer() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const filePath = searchParams.get("file");
  const title = searchParams.get("title") || "Document";

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const loadPDF = async () => {
      if (!filePath) {
        setError("No file path provided");
        setLoading(false);
        return;
      }

      try {
        // Download the file as blob
        const { data, error: downloadError } = await supabase.storage
          .from("papers")
          .download(filePath);

        if (downloadError) throw downloadError;

        // Convert blob to Uint8Array for react-pdf-viewer
        const arrayBuffer = await data.arrayBuffer();
        setPdfData(new Uint8Array(arrayBuffer));
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
      const { data, error } = await supabase.storage
        .from("papers")
        .download(filePath);

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
        {/* Header */}
        <div className="bg-card border-b border-border sticky top-16 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <h1 className="font-serif text-lg font-semibold text-foreground truncate max-w-md">
                  {title}
                </h1>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload}
                disabled={!pdfData}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>

        {/* PDF Viewer */}
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
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-lg h-[80vh]">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@5.4.530/build/pdf.worker.min.mjs">
                <Viewer
                  fileUrl={pdfData}
                  plugins={[defaultLayoutPluginInstance]}
                />
              </Worker>
            </div>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}

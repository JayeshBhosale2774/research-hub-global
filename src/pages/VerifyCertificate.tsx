import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRCodeSVG } from "qrcode.react";
import { 
  Search, CheckCircle, XCircle, Award, 
  Calendar, User, BookOpen, FileText, AlertCircle 
} from "lucide-react";

interface CertificateData {
  valid: boolean;
  certificateId: string;
  paperTitle: string;
  paperId: string;
  authors: string[];
  domain: string;
  publicationDate: string;
  email: string;
}

// Mock data for demonstration
const mockCertificate: CertificateData = {
  valid: true,
  certificateId: "IRPCERT-2024-001234",
  paperTitle: "Deep Learning Approaches for Medical Image Analysis: A Comprehensive Review",
  paperId: "IRP-2024-001234",
  authors: ["Dr. Priya Sharma", "Rahul Gupta", "Anita Desai"],
  domain: "Computer Science (CSE)",
  publicationDate: "January 15, 2024",
  email: "p.sharma@university.edu",
};

export default function VerifyCertificate() {
  const [searchId, setSearchId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<CertificateData | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    if (!searchId.trim()) return;

    setIsSearching(true);
    setNotFound(false);
    setResult(null);

    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
      if (searchId.toUpperCase().includes("IRP") || searchId.toUpperCase().includes("CERT")) {
        setResult(mockCertificate);
      } else {
        setNotFound(true);
      }
    }, 1500);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center mx-auto mb-6 shadow-gold">
              <Award className="w-8 h-8 text-accent-foreground" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Verify Certificate
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto">
              Verify the authenticity of IRP Publication certificates using 
              the certificate ID or paper ID.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl border border-border p-6 mb-8"
            >
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Enter Certificate ID or Paper ID (e.g., IRPCERT-2024-001234)"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Button 
                  variant="academic" 
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? "Verifying..." : "Verify"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                You can also scan the QR code on the certificate to verify authenticity.
              </p>
            </motion.div>

            {/* Results */}
            {isSearching && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="mt-4 text-muted-foreground">Verifying certificate...</p>
              </motion.div>
            )}

            {notFound && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-destructive/10 border border-destructive/20 rounded-xl p-8 text-center"
              >
                <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Certificate Not Found
                </h2>
                <p className="text-muted-foreground mb-4">
                  No certificate was found with the provided ID. Please check the ID and try again.
                </p>
                <p className="text-sm text-muted-foreground">
                  If you believe this is an error, please{" "}
                  <a href="/contact" className="text-primary hover:underline">contact us</a>.
                </p>
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Verification Status */}
                <div className={`rounded-xl p-6 text-center ${
                  result.valid 
                    ? "bg-success/10 border border-success/20" 
                    : "bg-destructive/10 border border-destructive/20"
                }`}>
                  {result.valid ? (
                    <>
                      <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        Certificate Verified ✓
                      </h2>
                      <p className="text-muted-foreground">
                        This is a valid certificate issued by IRP Publication.
                      </p>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        Invalid Certificate
                      </h2>
                      <p className="text-muted-foreground">
                        This certificate is not valid or has been revoked.
                      </p>
                    </>
                  )}
                </div>

                {/* Certificate Details */}
                {result.valid && (
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="bg-primary p-4">
                      <h3 className="font-semibold text-primary-foreground text-center">
                        Certificate Details
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Details */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start gap-3">
                            <Award className="w-5 h-5 text-accent mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground">Certificate ID</p>
                              <p className="font-semibold text-foreground">{result.certificateId}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground">Paper Title</p>
                              <p className="font-semibold text-foreground">{result.paperTitle}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <User className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground">Authors</p>
                              <p className="font-medium text-foreground">{result.authors.join(", ")}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                              <BookOpen className="w-5 h-5 text-primary mt-0.5" />
                              <div>
                                <p className="text-sm text-muted-foreground">Domain</p>
                                <p className="font-medium text-foreground">{result.domain}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <Calendar className="w-5 h-5 text-primary mt-0.5" />
                              <div>
                                <p className="text-sm text-muted-foreground">Published</p>
                                <p className="font-medium text-foreground">{result.publicationDate}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* QR Code */}
                        <div className="flex-shrink-0 text-center">
                          <div className="bg-background p-4 rounded-lg border border-border inline-block">
                            <QRCodeSVG
                              value={`https://irppublication.org/verify/${result.certificateId}`}
                              size={120}
                              level="H"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Scan to verify
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 bg-muted/50 rounded-lg p-4"
            >
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">About Certificate Verification</p>
                  <p>
                    All IRP Publication certificates include a unique ID and QR code that can be 
                    used to verify authenticity. If a paper is removed or retracted, the associated 
                    certificate becomes invalid.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

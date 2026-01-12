import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload, FileText, User, Plus, X, 
  ArrowRight, ArrowLeft, CheckCircle, AlertCircle, LogIn
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type PaperDomain = Database["public"]["Enums"]["paper_domain"];
type PublicationType = Database["public"]["Enums"]["publication_type"];

const domains: { value: PaperDomain; label: string }[] = [
  { value: "CSE", label: "Computer Science (CSE)" },
  { value: "ECE", label: "Electronics (ECE)" },
  { value: "IT", label: "Information Technology" },
  { value: "Mechanical", label: "Mechanical Engineering" },
  { value: "Civil", label: "Civil Engineering" },
  { value: "Electrical", label: "Electrical Engineering" },
  { value: "Aerospace", label: "Aerospace Engineering" },
];

const types: { value: PublicationType; label: string }[] = [
  { value: "journal", label: "Journal Article" },
  { value: "magazine", label: "Magazine Article" },
  { value: "research_paper", label: "Research Paper" },
];

interface Author {
  name: string;
  email: string;
  institution: string;
}

export default function SubmitPaper() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    keywords: "",
    domain: "" as PaperDomain | "",
    type: "" as PublicationType | "",
    file: null as File | null,
  });
  const [authors, setAuthors] = useState<Author[]>([
    { name: "", email: "", institution: "" },
  ]);

  const addAuthor = () => {
    if (authors.length < 6) {
      setAuthors([...authors, { name: "", email: "", institution: "" }]);
    }
  };

  const removeAuthor = (index: number) => {
    if (authors.length > 1) {
      setAuthors(authors.filter((_, i) => i !== index));
    }
  };

  const updateAuthor = (index: number, field: keyof Author, value: string) => {
    const updated = [...authors];
    updated[index][field] = value;
    setAuthors(updated);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file only");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Maximum file size is 10MB");
        return;
      }
      setFormData({ ...formData, file });
    }
  };

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!formData.title.trim()) {
        toast.error("Please enter a paper title");
        return false;
      }
      if (!formData.abstract.trim()) {
        toast.error("Please enter an abstract");
        return false;
      }
      if (!formData.keywords.trim()) {
        toast.error("Please enter keywords");
        return false;
      }
      if (!formData.domain) {
        toast.error("Please select a domain");
        return false;
      }
      if (!formData.type) {
        toast.error("Please select a paper type");
        return false;
      }
    }
    if (currentStep === 2) {
      for (let i = 0; i < authors.length; i++) {
        if (!authors[i].name.trim() || !authors[i].email.trim() || !authors[i].institution.trim()) {
          toast.error(`Please fill all details for Author ${i + 1}`);
          return false;
        }
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login to submit a paper");
      return;
    }

    if (!formData.file) {
      toast.error("Please upload your paper");
      return;
    }

    if (!formData.domain || !formData.type) {
      toast.error("Please complete all required fields");
      return;
    }

    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload file to storage
      const fileExt = formData.file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("papers")
        .upload(fileName, formData.file);

      if (uploadError) throw uploadError;

      // Parse keywords
      const keywordsArray = formData.keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);

      // Insert paper record
      const { error: insertError } = await supabase
        .from("papers")
        .insert([{
          author_id: user.id,
          title: formData.title.trim(),
          abstract: formData.abstract.trim(),
          keywords: keywordsArray,
          domain: formData.domain,
          publication_type: formData.type,
          authors: authors as unknown as Database["public"]["Tables"]["papers"]["Insert"]["authors"],
          file_path: fileName,
        }]);

      if (insertError) throw insertError;

      toast.success("Paper submitted successfully! You'll receive an email within 3 days.");
      navigate("/");
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to submit paper. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show login prompt if not authenticated
  if (!authLoading && !user) {
    return (
      <Layout>
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-md mx-auto text-center">
              <div className="bg-card rounded-xl border border-border p-8">
                <LogIn className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="font-serif text-2xl font-semibold mb-2">Login Required</h2>
                <p className="text-muted-foreground mb-6">
                  Please login or create an account to submit your paper.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => navigate("/register")}>
                    Register
                  </Button>
                  <Button onClick={() => navigate("/login")}>
                    Login
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
              Submit Your Paper
            </h1>
            <p className="text-primary-foreground/80">
              Complete the form below to submit your research paper for review
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="bg-card border-b border-border py-6">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                    step >= s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                <span className={`hidden sm:block text-sm ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>
                  {s === 1 ? "Paper Details" : s === 2 ? "Authors" : "Upload & Review"}
                </span>
                {s < 3 && <div className="w-8 sm:w-16 h-0.5 bg-border" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-xl border border-border p-8"
            >
              {/* Step 1: Paper Details */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                    Paper Details
                  </h2>

                  <div className="space-y-2">
                    <Label htmlFor="title">Paper Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter the full title of your paper"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="abstract">Abstract * (200-300 words)</Label>
                    <Textarea
                      id="abstract"
                      placeholder="Provide a concise summary of your research..."
                      rows={6}
                      value={formData.abstract}
                      onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.abstract.split(/\s+/).filter(Boolean).length} words
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords * (4-6 keywords, comma separated)</Label>
                    <Input
                      id="keywords"
                      placeholder="machine learning, deep learning, neural networks, ..."
                      value={formData.keywords}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Domain *</Label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        value={formData.domain}
                        onChange={(e) => setFormData({ ...formData, domain: e.target.value as PaperDomain })}
                        required
                      >
                        <option value="">Select domain</option>
                        {domains.map((d) => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Paper Type *</Label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as PublicationType })}
                        required
                      >
                        <option value="">Select type</option>
                        {types.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Authors */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-xl font-semibold text-foreground">
                      Author Details
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      {authors.length > 4 && (
                        <span className="text-warning">
                          ₹200 extra for each author beyond 4
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="space-y-6">
                    {authors.map((author, index) => (
                      <div
                        key={index}
                        className="p-4 bg-muted/50 rounded-lg relative"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-foreground flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Author {index + 1}
                            {index === 0 && <span className="text-xs text-accent">(Corresponding)</span>}
                          </span>
                          {authors.length > 1 && (
                            <button
                              onClick={() => removeAuthor(index)}
                              className="text-destructive hover:text-destructive/80"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid sm:grid-cols-3 gap-3">
                          <Input
                            placeholder="Full Name *"
                            value={author.name}
                            onChange={(e) => updateAuthor(index, "name", e.target.value)}
                            required
                          />
                          <Input
                            type="email"
                            placeholder="Email *"
                            value={author.email}
                            onChange={(e) => updateAuthor(index, "email", e.target.value)}
                            required
                          />
                          <Input
                            placeholder="Institution *"
                            value={author.institution}
                            onChange={(e) => updateAuthor(index, "institution", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {authors.length < 6 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addAuthor}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Another Author
                    </Button>
                  )}
                </div>
              )}

              {/* Step 3: Upload & Review */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                    Upload & Review
                  </h2>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label>Upload Paper (PDF only, max 10MB) *</Label>
                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="paper-upload"
                      />
                      <label htmlFor="paper-upload" className="cursor-pointer">
                        {formData.file ? (
                          <div className="flex items-center justify-center gap-3">
                            <FileText className="w-10 h-10 text-success" />
                            <div className="text-left">
                              <p className="font-medium text-foreground">{formData.file.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-foreground font-medium">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-sm text-muted-foreground">PDF only (max 10MB)</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-foreground">Submission Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Paper Title:</span>
                        <span className="text-foreground font-medium truncate max-w-[200px]">{formData.title || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Domain:</span>
                        <span className="text-foreground">{domains.find(d => d.value === formData.domain)?.label || "Not selected"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="text-foreground">{types.find(t => t.value === formData.type)?.label || "Not selected"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Authors:</span>
                        <span className="text-foreground">{authors.length} author(s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">File:</span>
                        <span className="text-foreground">{formData.file ? "Uploaded" : "Not uploaded"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Important Notes */}
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
                      <div className="text-sm text-foreground">
                        <p className="font-medium mb-1">Important Notes:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Review process takes up to 3 working days</li>
                          <li>• Plagiarism must be below 40%</li>
                          <li>• Payment (₹1000) is required only after approval</li>
                          <li>• You'll receive email updates on your submission status</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Terms Agreement Checkbox */}
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <div className="text-sm">
                        <p className="text-foreground">
                          I agree to the{" "}
                          <span className="font-semibold text-primary">Terms and Conditions</span>
                        </p>
                        <p className="text-muted-foreground mt-1">
                          By submitting this paper, I confirm that the work is original, authored by me/us, 
                          and I accept the publication policies of this private limited organization. 
                          I understand that plagiarism or copyright violations may result in rejection and further action.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                {step > 1 ? (
                  <Button variant="outline" onClick={() => setStep(step - 1)} disabled={isSubmitting}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <Button onClick={handleNext}>
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isSubmitting || !agreedToTerms}>
                    {isSubmitting ? "Submitting..." : "Submit Paper"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

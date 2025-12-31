import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload, FileText, User, Plus, X, 
  ArrowRight, ArrowLeft, CheckCircle, AlertCircle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const domains = [
  { value: "cse", label: "Computer Science (CSE)" },
  { value: "ece", label: "Electronics (ECE)" },
  { value: "it", label: "Information Technology" },
  { value: "mechanical", label: "Mechanical Engineering" },
  { value: "civil", label: "Civil Engineering" },
  { value: "electrical", label: "Electrical Engineering" },
  { value: "aerospace", label: "Aerospace Engineering" },
];

const types = [
  { value: "journal", label: "Journal Article" },
  { value: "magazine", label: "Magazine Article" },
  { value: "research", label: "Research Paper" },
  { value: "conference", label: "Conference Paper" },
];

interface Author {
  name: string;
  email: string;
  institution: string;
}

export default function SubmitPaper() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    keywords: "",
    domain: "",
    type: "",
    file: null as File | null,
  });
  const [authors, setAuthors] = useState<Author[]>([
    { name: "", email: "", institution: "" },
  ]);
  const { toast } = useToast();

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
        toast({
          title: "Invalid File",
          description: "Please upload a PDF file only",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Maximum file size is 10MB",
          variant: "destructive",
        });
        return;
      }
      setFormData({ ...formData, file });
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Paper Submitted!",
      description: "Your paper has been submitted for review. You'll receive an email within 3 days.",
    });
  };

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
                        onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
                        <span className="text-foreground font-medium">{formData.title || "Not provided"}</span>
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
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                {step > 1 ? (
                  <Button variant="outline" onClick={() => setStep(step - 1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <Button variant="academic" onClick={() => setStep(step + 1)}>
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button variant="hero" onClick={handleSubmit}>
                    Submit Paper
                    <ArrowRight className="w-4 h-4" />
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

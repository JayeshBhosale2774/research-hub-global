import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, FileText, CheckCircle, AlertCircle, 
  Download, ArrowRight, List 
} from "lucide-react";

const formatGuidelines = [
  {
    title: "Paper Structure",
    items: [
      "Abstract (200-300 words)",
      "Keywords (4-6 keywords)",
      "Introduction with clear objectives",
      "Literature Review / Background",
      "Methodology / Proposed System",
      "Results and Discussion",
      "Conclusion and Future Scope",
      "References (IEEE format)",
    ],
  },
  {
    title: "Formatting Requirements",
    items: [
      "Paper size: A4",
      "Font: Times New Roman",
      "Title: 14pt Bold",
      "Body text: 10pt",
      "Single-spaced, two-column layout",
      "Margins: 1 inch on all sides",
      "Page limit: 6-12 pages",
    ],
  },
  {
    title: "Figures & Tables",
    items: [
      "High resolution (300 DPI minimum)",
      "Numbered sequentially (Fig. 1, Table 1)",
      "Captions below figures, above tables",
      "Referenced in the text",
      "Color figures accepted",
    ],
  },
];

const referenceStyle = [
  {
    type: "Journal Article",
    example: 'A. Author, "Title of Article," Name of Journal, vol. x, no. x, pp. xxx-xxx, Month Year.',
  },
  {
    type: "Conference Paper",
    example: 'A. Author, "Title of Paper," in Proc. Name of Conf., City, Country, Year, pp. xxx-xxx.',
  },
  {
    type: "Book",
    example: 'A. Author, Title of Book. City, Country: Publisher, Year.',
  },
  {
    type: "Website",
    example: 'A. Author. "Title of Page." Website Name. URL (accessed Date).',
  },
];

export default function Standards() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Publication Standards
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Follow our IEEE-style guidelines to ensure your paper meets 
              publication standards and is accepted without revisions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#format" className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors">
              <FileText className="w-4 h-4" />
              Paper Format
            </a>
            <a href="#references" className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors">
              <List className="w-4 h-4" />
              Reference Style
            </a>
            <a href="#plagiarism" className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors">
              <AlertCircle className="w-4 h-4" />
              Plagiarism Policy
            </a>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
          </div>
        </div>
      </section>

      {/* Format Guidelines */}
      <section id="format" className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
            Paper Format Guidelines
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {formatGuidelines.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reference Style */}
      <section id="references" className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
            IEEE Reference Style
          </h2>

          <div className="space-y-4">
            {referenceStyle.map((ref, index) => (
              <motion.div
                key={ref.type}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <h3 className="font-semibold text-foreground mb-2">{ref.type}</h3>
                <code className="block text-sm bg-muted p-3 rounded-lg text-muted-foreground font-mono">
                  {ref.example}
                </code>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plagiarism Policy */}
      <section id="plagiarism" className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
              Plagiarism Policy
            </h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl border border-border p-8"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Maximum Allowed: 40%</h3>
                  <p className="text-muted-foreground">
                    All submitted papers undergo AI-powered plagiarism detection. 
                    Papers exceeding 40% similarity will be rejected.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">What counts as plagiarism?</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Copying text without proper citation</li>
                    <li>• Self-plagiarism (reusing your own published work)</li>
                    <li>• Paraphrasing without attribution</li>
                    <li>• Using figures/tables without permission</li>
                  </ul>
                </div>

                <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                  <h4 className="font-medium text-foreground mb-2">Important Note</h4>
                  <p className="text-sm text-muted-foreground">
                    Even if plagiarism is below 40%, the admin may reject a paper 
                    if the original content is insufficient or if there are quality concerns.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Language Policy */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-primary-foreground mb-4">
            Language Requirement
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-6">
            All papers must be written in <strong className="text-accent">English only</strong>. 
            Ensure proper grammar, spelling, and technical writing standards.
          </p>
          <Link to="/submit">
            <Button variant="hero" size="xl">
              Start Your Submission
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}

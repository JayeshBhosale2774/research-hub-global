import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { FileText, Type, AlignLeft, List, BookOpen, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const formatSections = [
  {
    icon: Type,
    title: "Title & Authors",
    items: [
      "Title: Bold, 14pt, centered, Title Case",
      "Author names: 12pt, centered, below title",
      "Include affiliation and email for each author",
      "Corresponding author should be marked with an asterisk (*)",
    ],
  },
  {
    icon: AlignLeft,
    title: "Abstract & Keywords",
    items: [
      "Abstract: 150–300 words, single paragraph",
      "Must summarize objective, methodology, results, and conclusion",
      "Keywords: 4–6 relevant terms, separated by commas",
      "Place keywords immediately after the abstract",
    ],
  },
  {
    icon: List,
    title: "Body Structure",
    items: [
      "Introduction – background, problem statement, objectives",
      "Literature Review – relevant prior work",
      "Methodology – research design and data collection",
      "Results & Discussion – findings with analysis",
      "Conclusion – summary and future scope",
    ],
  },
  {
    icon: BookOpen,
    title: "References",
    items: [
      "Follow IEEE citation format",
      "Minimum 10 references for journals, 5 for magazines",
      "Use numbered references in square brackets [1]",
      "List references in order of appearance in the text",
    ],
  },
];

const generalRules = [
  { label: "Font", value: "Times New Roman" },
  { label: "Body Font Size", value: "12pt" },
  { label: "Line Spacing", value: "1.5" },
  { label: "Margins", value: "1 inch (2.54 cm) on all sides" },
  { label: "Page Size", value: "A4" },
  { label: "File Format", value: ".doc or .docx" },
  { label: "Max Pages", value: "15 pages (journals), 8 pages (magazines)" },
  { label: "Language", value: "English (British or American, consistent)" },
];

export default function PaperFormat() {
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
              Paper Format Guidelines
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Follow these formatting requirements to ensure your manuscript meets
              IRP Publication standards.
            </p>
          </motion.div>
        </div>
      </section>

      {/* General Formatting */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
            General Formatting
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {generalRules.map((rule) => (
              <div
                key={rule.label}
                className="bg-card rounded-xl border border-border p-4"
              >
                <p className="text-xs text-muted-foreground mb-1">{rule.label}</p>
                <p className="font-semibold text-foreground">{rule.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Detailed Sections */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
            Manuscript Structure
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {formatSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    {section.title}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download & CTA */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-primary-foreground mb-4">
            Ready to Submit?
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-6">
            Download our manuscript template or submit your paper directly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/paper-template.docx.txt" download>
              <Button variant="hero" size="xl">
                <Download className="w-5 h-5" />
                Download Template
              </Button>
            </a>
            <Link to="/submit">
              <Button
                variant="outline"
                size="xl"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Submit Paper
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

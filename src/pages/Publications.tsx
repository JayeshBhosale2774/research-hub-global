import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Search, Calendar, User, 
  ExternalLink, FileText, ChevronLeft, ChevronRight, Loader2 
} from "lucide-react";

const domains = ["All", "CSE", "ECE", "IT", "Mechanical", "Civil", "Electrical", "Aerospace"];
const types = ["All", "Journal", "Magazine", "Research Paper"];

const getDomainColor = (domain: string) => {
  const colors: Record<string, string> = {
    CSE: "bg-info/10 text-info",
    ECE: "bg-success/10 text-success",
    IT: "bg-purple-100 text-purple-600",
    Mechanical: "bg-orange-100 text-orange-600",
    Civil: "bg-warning/10 text-warning",
    Electrical: "bg-yellow-100 text-yellow-600",
    Aerospace: "bg-primary/10 text-primary",
  };
  return colors[domain] || "bg-muted text-muted-foreground";
};

const getTypeLabel = (type: string | null) => {
  const labels: Record<string, string> = {
    journal: "Journal",
    magazine: "Magazine",
    research_paper: "Research Paper",
  };
  return type ? labels[type] || type : "Research Paper";
};

export default function Publications() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  const { data: publications, isLoading } = useQuery({
    queryKey: ["published-papers"],
    queryFn: async () => {
      // Fetch from papers table to get file_path for downloads
      const { data, error } = await supabase
        .from("papers")
        .select("id, title, abstract, domain, publication_type, keywords, authors, published_at, created_at, file_path, status")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const handleViewPDF = (filePath: string | null, title: string) => {
    if (!filePath) {
      toast.error("PDF file not available for this paper");
      return;
    }

    // Navigate to PDF viewer page (avoids popup blockers)
    navigate(`/view-pdf?file=${encodeURIComponent(filePath)}&title=${encodeURIComponent(title)}`);
  };

  // Helper to extract author names from the authors JSON
  const getAuthorNames = (authors: any): string[] => {
    if (!authors || !Array.isArray(authors)) return ["Unknown Author"];
    return authors.map((a: any) => {
      if (typeof a === "string") return a;
      if (a.name) return a.name;
      return "Unknown";
    });
  };

  const filteredPublications = (publications || []).filter((pub) => {
    const authorNames = getAuthorNames(pub.authors);
    const matchesSearch = 
      pub.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      authorNames.some((a: string) => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      pub.keywords?.some((k: string) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDomain = selectedDomain === "All" || pub.domain === selectedDomain;
    
    const typeMap: Record<string, string> = {
      "Journal": "journal",
      "Magazine": "magazine",
      "Research Paper": "research_paper",
    };
    const matchesType = selectedType === "All" || pub.publication_type === typeMap[selectedType];
    
    return matchesSearch && matchesDomain && matchesType;
  });

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
              Publications
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Browse our collection of peer-reviewed journals, magazines, and research papers 
              across multiple engineering domains.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-card border-b border-border sticky top-16 z-40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title, author, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Domain Filter */}
            <div className="flex flex-wrap gap-2">
              {domains.map((domain) => (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    selectedDomain === domain
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {domain}
                </button>
              ))}
            </div>

            {/* Type Filter */}
            <div className="flex gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    selectedType === type
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Publications List */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredPublications.length}</span> publications
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredPublications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No publications found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPublications.map((pub, index) => (
                <motion.article
                  key={pub.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-card rounded-xl border border-border p-6 hover-lift"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="flex-1">
                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`domain-badge ${getDomainColor(pub.domain || "")}`}>
                          {pub.domain}
                        </span>
                        <span className="domain-badge bg-muted text-muted-foreground">
                          {getTypeLabel(pub.publication_type)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ID: {pub.id?.slice(0, 8)}
                        </span>
                      </div>

                      {/* Title */}
                      <Link to={`/publications/${pub.id}`}>
                        <h2 className="font-serif text-xl font-semibold text-foreground hover:text-primary transition-colors mb-2">
                          {pub.title}
                        </h2>
                      </Link>

                      {/* Authors */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <User className="w-4 h-4" />
                        <span>{getAuthorNames(pub.authors).join(", ")}</span>
                      </div>

                      {/* Abstract */}
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {pub.abstract}
                      </p>

                      {/* Keywords */}
                      {pub.keywords && pub.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {pub.keywords.slice(0, 5).map((keyword: string, i: number) => (
                            <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Published: {pub.published_at ? new Date(pub.published_at).toLocaleDateString('en-IN', { 
                            day: 'numeric', month: 'short', year: 'numeric' 
                          }) : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2">
                      <Link to={`/publications/${pub.id}`}>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewPDF(pub.file_path, pub.title)}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* Pagination - simplified for now */}
          {filteredPublications.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <div className="flex gap-1">
                <Button variant="default" size="sm">1</Button>
              </div>
              <Button variant="outline" size="sm" disabled>
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

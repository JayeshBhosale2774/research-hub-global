import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, Filter, BookOpen, Calendar, User, 
  ExternalLink, Download, ChevronLeft, ChevronRight 
} from "lucide-react";

const domains = ["All", "CSE", "ECE", "IT", "Mechanical", "Civil", "Electrical", "Aerospace"];
const types = ["All", "Journal", "Magazine", "Research Paper"];

// Mock data for publications
const mockPublications = [
  {
    id: "IRP-2024-001234",
    title: "Deep Learning Approaches for Medical Image Analysis: A Comprehensive Review",
    authors: ["Dr. Priya Sharma", "Rahul Gupta", "Anita Desai"],
    domain: "CSE",
    type: "Journal",
    publishedDate: "2024-01-15",
    abstract: "This paper presents a comprehensive review of deep learning techniques applied to medical image analysis, covering convolutional neural networks, transfer learning, and emerging architectures...",
    downloads: 245,
  },
  {
    id: "IRP-2024-001235",
    title: "IoT-Based Smart Agriculture System Using Machine Learning for Crop Prediction",
    authors: ["Suresh Kumar", "Meena Patel"],
    domain: "ECE",
    type: "Research Paper",
    publishedDate: "2024-01-12",
    abstract: "An innovative IoT-based smart agriculture system that leverages machine learning algorithms for accurate crop yield prediction and automated irrigation management...",
    downloads: 189,
  },
  {
    id: "IRP-2024-001236",
    title: "Blockchain Technology for Secure Cloud Data Storage: Challenges and Solutions",
    authors: ["Vikram Singh", "Pooja Mehta", "Arjun Reddy", "Sneha Iyer"],
    domain: "IT",
    type: "Journal",
    publishedDate: "2024-01-10",
    abstract: "This research explores the integration of blockchain technology with cloud storage systems to enhance data security and integrity...",
    downloads: 312,
  },
  {
    id: "IRP-2024-001237",
    title: "Sustainable Manufacturing Practices in Indian Automotive Industry",
    authors: ["Ramesh Verma", "Kavita Joshi"],
    domain: "Mechanical",
    type: "Research Paper",
    publishedDate: "2024-01-08",
    abstract: "An analysis of sustainable manufacturing practices adopted by the Indian automotive industry, focusing on waste reduction and energy efficiency...",
    downloads: 156,
  },
  {
    id: "IRP-2024-001238",
    title: "Seismic Analysis of High-Rise Buildings Using Advanced Computational Methods",
    authors: ["Dr. Anil Saxena"],
    domain: "Civil",
    type: "Journal",
    publishedDate: "2024-01-05",
    abstract: "Advanced computational methods for seismic analysis of high-rise buildings, incorporating non-linear dynamic analysis and performance-based design...",
    downloads: 198,
  },
  {
    id: "IRP-2024-001239",
    title: "Renewable Energy Integration in Smart Grid Systems",
    authors: ["Sunita Rao", "Manoj Kumar", "Deepa Nair"],
    domain: "Electrical",
    type: "Magazine",
    publishedDate: "2024-01-03",
    abstract: "Strategies for effective integration of renewable energy sources into smart grid systems, addressing challenges of intermittency and grid stability...",
    downloads: 278,
  },
];

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

export default function Publications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  const filteredPublications = mockPublications.filter((pub) => {
    const matchesSearch = pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDomain = selectedDomain === "All" || pub.domain === selectedDomain;
    const matchesType = selectedType === "All" || pub.type === selectedType;
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
                      <span className={`domain-badge ${getDomainColor(pub.domain)}`}>
                        {pub.domain}
                      </span>
                      <span className="domain-badge bg-muted text-muted-foreground">
                        {pub.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ID: {pub.id}
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
                      <span>{pub.authors.join(", ")}</span>
                    </div>

                    {/* Abstract */}
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {pub.abstract}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Published: {new Date(pub.publishedDate).toLocaleDateString('en-IN', { 
                          day: 'numeric', month: 'short', year: 'numeric' 
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {pub.downloads} downloads
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
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <div className="flex gap-1">
              <Button variant="default" size="sm">1</Button>
              <Button variant="ghost" size="sm">2</Button>
              <Button variant="ghost" size="sm">3</Button>
            </div>
            <Button variant="outline" size="sm">
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

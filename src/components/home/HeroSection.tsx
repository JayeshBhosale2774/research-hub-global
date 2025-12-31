import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Award, Users, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Published Papers", value: "10,000+", icon: BookOpen },
  { label: "Authors Worldwide", value: "25,000+", icon: Users },
  { label: "Certificates Issued", value: "15,000+", icon: Award },
  { label: "Review Time", value: "3 Days", icon: FileCheck },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-primary">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-info rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              Trusted Research Publication Platform
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Publish Your Research with
              <span className="block text-accent mt-2">IRP Publication</span>
            </h1>
            
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl">
              A premier platform for researchers and academics to publish journals, 
              magazines, and research papers across multiple engineering and science domains. 
              Fast review, verified certificates, global reach.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/submit">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  Submit Your Paper
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/publications">
                <Button variant="outline" size="xl" className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Browse Publications
                </Button>
              </Link>
            </div>

            {/* Quick Info */}
            <div className="mt-10 pt-8 border-t border-primary-foreground/10 flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-primary-foreground/70 text-sm">
                <FileCheck className="w-4 h-4 text-accent" />
                <span>3-Day Review Process</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/70 text-sm">
                <Award className="w-4 h-4 text-accent" />
                <span>Verified E-Certificates</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/70 text-sm">
                <BookOpen className="w-4 h-4 text-accent" />
                <span>Open Access</span>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/10 hover:bg-primary-foreground/15 transition-colors"
              >
                <stat.icon className="w-8 h-8 text-accent mb-3" />
                <div className="text-3xl font-bold text-primary-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/70">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path 
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Calendar, MapPin, Users, Clock, 
  ArrowRight, ExternalLink, CheckCircle 
} from "lucide-react";

const upcomingConferences = [
  {
    id: "ICRTEC-2024",
    name: "International Conference on Recent Trends in Engineering & Computing",
    shortName: "ICRTEC 2024",
    date: "March 15-16, 2024",
    venue: "Virtual Conference",
    domains: ["CSE", "IT", "ECE"],
    deadline: "February 28, 2024",
    status: "open",
    description: "A premier platform for researchers to present innovative work in computing, electronics, and emerging technologies.",
  },
  {
    id: "ICMCE-2024",
    name: "International Conference on Mechanical & Civil Engineering",
    shortName: "ICMCE 2024",
    date: "April 20-21, 2024",
    venue: "Bangalore, India",
    domains: ["Mechanical", "Civil"],
    deadline: "March 31, 2024",
    status: "open",
    description: "Bringing together experts in mechanical and civil engineering to discuss sustainable infrastructure and manufacturing.",
  },
  {
    id: "ICREE-2024",
    name: "International Conference on Renewable Energy & Electrical Systems",
    shortName: "ICREE 2024",
    date: "May 10-11, 2024",
    venue: "Chennai, India",
    domains: ["Electrical", "Aerospace"],
    deadline: "April 15, 2024",
    status: "upcoming",
    description: "Focus on renewable energy integration, smart grids, and advanced electrical systems for sustainable future.",
  },
];

const pastConferences = [
  {
    id: "ICDATA-2023",
    name: "International Conference on Data Analytics & AI",
    date: "December 2023",
    papers: 156,
  },
  {
    id: "ICIOT-2023",
    name: "International Conference on IoT & Smart Systems",
    date: "October 2023",
    papers: 142,
  },
];

export default function Conferences() {
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
              Conferences
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Present your research at our international conferences and connect 
              with researchers from around the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Conferences */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
            Upcoming Conferences
          </h2>

          <div className="space-y-6">
            {upcomingConferences.map((conf, index) => (
              <motion.div
                key={conf.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card rounded-xl border border-border overflow-hidden hover-lift"
              >
                <div className="p-6 lg:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Date Badge */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-xl bg-primary flex flex-col items-center justify-center text-primary-foreground">
                        <span className="text-2xl font-bold">
                          {conf.date.split(' ')[0].split('-')[0]}
                        </span>
                        <span className="text-xs uppercase">
                          {conf.date.split(' ')[0].split(',')[0].replace(/\d+/g, '').slice(0, 3)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {conf.status === 'open' ? (
                          <span className="px-2 py-0.5 bg-success/10 text-success text-xs font-medium rounded-full">
                            Submissions Open
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-warning/10 text-warning text-xs font-medium rounded-full">
                            Coming Soon
                          </span>
                        )}
                        {conf.domains.map((domain) => (
                          <span key={domain} className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                            {domain}
                          </span>
                        ))}
                      </div>

                      <h3 className="font-serif text-xl lg:text-2xl font-semibold text-foreground mb-2">
                        {conf.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {conf.description}
                      </p>

                      <div className="grid sm:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{conf.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{conf.venue}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 text-destructive" />
                          <span>Deadline: {conf.deadline}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2">
                      <Link to={`/conferences/${conf.id}`}>
                        <Button variant="academic">
                          Submit Paper
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="outline">
                        View Details
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Conferences */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
            Past Conferences
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {pastConferences.map((conf, index) => (
              <motion.div
                key={conf.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <h3 className="font-semibold text-foreground mb-2">{conf.name}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {conf.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-success" />
                    {conf.papers} papers published
                  </span>
                </div>
                <Link to={`/conferences/${conf.id}/proceedings`}>
                  <Button variant="ghost" size="sm">
                    View Proceedings
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call for Papers */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-primary-foreground mb-4">
            Submit Your Research
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-6">
            Present your work at our conferences and get published in conference proceedings. 
            Same review process and certification as regular publications.
          </p>
          <Link to="/submit?type=conference">
            <Button variant="hero" size="xl">
              Submit Conference Paper
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}

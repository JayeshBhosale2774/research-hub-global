import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Cpu, CircuitBoard, Code2, Cog, Building2, Zap, Plane } from "lucide-react";

const domains = [
  { 
    name: "Computer Science (CSE)", 
    icon: Code2, 
    color: "domain-cse",
    description: "AI, ML, Data Science, Networking, Cybersecurity",
    papers: 2450
  },
  { 
    name: "Electronics (ECE)", 
    icon: CircuitBoard, 
    color: "domain-ece",
    description: "VLSI, Embedded Systems, Signal Processing",
    papers: 1890
  },
  { 
    name: "Information Technology", 
    icon: Cpu, 
    color: "domain-it",
    description: "Cloud Computing, Big Data, IoT",
    papers: 1650
  },
  { 
    name: "Mechanical Engineering", 
    icon: Cog, 
    color: "domain-mechanical",
    description: "Thermal, Manufacturing, Robotics",
    papers: 1420
  },
  { 
    name: "Civil Engineering", 
    icon: Building2, 
    color: "domain-civil",
    description: "Structural, Environmental, Transportation",
    papers: 980
  },
  { 
    name: "Electrical Engineering", 
    icon: Zap, 
    color: "domain-electrical",
    description: "Power Systems, Control, Renewable Energy",
    papers: 1120
  },
  { 
    name: "Aerospace Engineering", 
    icon: Plane, 
    color: "domain-aerospace",
    description: "Aerodynamics, Propulsion, Space Technology",
    papers: 560
  },
];

export function DomainsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Research Domains
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We accept research papers across seven major engineering and technology domains, 
            ensuring comprehensive coverage of academic disciplines.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {domains.map((domain, index) => (
            <motion.div
              key={domain.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                to={`/publications?domain=${domain.name.toLowerCase().split(' ')[0]}`}
                className="block h-full bg-card rounded-xl p-6 border border-border hover-lift group"
              >
                <div className={`w-12 h-12 rounded-lg bg-${domain.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <domain.icon className={`w-6 h-6 text-${domain.color}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {domain.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {domain.description}
                </p>
                <div className="text-xs text-accent font-medium">
                  {domain.papers.toLocaleString()} papers published
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

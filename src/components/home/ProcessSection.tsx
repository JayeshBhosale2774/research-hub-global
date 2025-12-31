import { motion } from "framer-motion";
import { FileUp, Search, CheckCircle2, CreditCard, Award, BookOpen } from "lucide-react";

const steps = [
  {
    icon: FileUp,
    title: "Submit Paper",
    description: "Register and submit your research paper (PDF) with author details and domain selection.",
    time: "Day 1",
  },
  {
    icon: Search,
    title: "Review & Check",
    description: "AI-powered plagiarism check and manual review by our admin team for quality assurance.",
    time: "Days 1-3",
  },
  {
    icon: CheckCircle2,
    title: "Revision (if needed)",
    description: "If issues are found, you get 2 days to correct and re-upload your paper.",
    time: "+2 Days",
  },
  {
    icon: CreditCard,
    title: "Payment",
    description: "Pay ₹1000 publication fee via UPI after approval. Extra charges for additional authors.",
    time: "After Approval",
  },
  {
    icon: BookOpen,
    title: "Publication",
    description: "Your paper is published with a unique ID and becomes publicly accessible.",
    time: "Same Day",
  },
  {
    icon: Award,
    title: "Certificate",
    description: "Receive your e-certificate with QR verification. Optional hardcopy available for ₹500.",
    time: "Immediate",
  },
];

export function ProcessSection() {
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
            Publication Process
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A streamlined 6-step process from submission to certification, 
            designed for efficiency and transparency.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent" />
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative text-center"
              >
                {/* Step Number */}
                <div className="relative inline-flex">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg mb-4">
                    <step.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                
                <h3 className="font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {step.description}
                </p>
                <span className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded">
                  {step.time}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

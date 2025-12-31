import { motion } from "framer-motion";
import { 
  Clock, Shield, FileCheck, Award, 
  Globe, CreditCard, QrCode, Mail 
} from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Fast Review Process",
    description: "Get your paper reviewed within 3 working days by our expert team and AI-assisted plagiarism detection.",
  },
  {
    icon: Shield,
    title: "Plagiarism Check",
    description: "Comprehensive plagiarism detection with 40% maximum limit to ensure original research content.",
  },
  {
    icon: FileCheck,
    title: "IEEE-Style Format",
    description: "All papers follow IEEE formatting standards for structure, references, and citations.",
  },
  {
    icon: Award,
    title: "Verified Certificates",
    description: "E-certificates with unique ID and QR code for instant verification. Optional hardcopy available.",
  },
  {
    icon: Globe,
    title: "Open Access",
    description: "All published papers are freely accessible to readers worldwide without any login required.",
  },
  {
    icon: CreditCard,
    title: "Affordable Pricing",
    description: "Publication fee of ₹1000 with up to 4 authors free. Pay only after paper approval.",
  },
  {
    icon: QrCode,
    title: "QR Verification",
    description: "Each certificate includes a QR code linking to a public verification page for authenticity.",
  },
  {
    icon: Mail,
    title: "Email Notifications",
    description: "Stay updated with real-time email notifications for submission status and review feedback.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose IRP Publication?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We provide a streamlined, transparent, and reliable publication process 
            for researchers and academics worldwide.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-card rounded-xl p-6 border border-border hover-lift"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

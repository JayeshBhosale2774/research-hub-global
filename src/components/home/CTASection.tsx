import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Quick 3-day review process",
  "Verified e-certificates with QR",
  "Open access for all readers",
  "Affordable publication fee",
];

export function CTASection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Publish Your Research?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of researchers who have successfully published their work 
            with IRP Publication. Start your submission today.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {benefits.map((benefit) => (
              <div 
                key={benefit}
                className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full"
              >
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm text-foreground">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/submit">
              <Button variant="academic" size="xl">
                Submit Your Paper
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/guidelines">
              <Button variant="outline" size="xl">
                View Author Guidelines
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

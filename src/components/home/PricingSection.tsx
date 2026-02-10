import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const pricingFeatures = [
  "Publication in IRP Journal",
  "Unique Paper ID & DOI-like Reference",
  "Open Access (Free for Readers)",
  "E-Certificate with QR Verification",
  "Up to 4 Authors Included",
  "Lifetime Access to Paper",
  "Email Notifications",
  "Author Dashboard Access",
];

const additionalCharges = [
  { item: "Extra Author (beyond 4)", price: "₹200/author" },
  { item: "Hardcopy Certificate", price: "₹500" },
];

export function PricingSection() {
  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Simple & Transparent Pricing
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Pay only after your paper is approved. No hidden charges, no surprises.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-accent fill-accent" />
                    <span className="text-sm font-medium text-accent">Standard Publication</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-foreground">₹1,000</span>
                    <span className="text-muted-foreground">per paper</span>
                  </div>
                </div>
                <Link to="/submit">
                  <Button variant="academic" size="xl">
                    Submit Your Paper
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-4">What's Included</h3>
                  <ul className="space-y-3">
                    {pricingFeatures.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Check className="w-5 h-5 text-success flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-4">Additional Charges</h3>
                  <div className="space-y-3">
                    {additionalCharges.map((charge) => (
                      <div key={charge.item} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm text-foreground">{charge.item}</span>
                        <span className="text-sm font-semibold text-primary">{charge.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
                    <p className="text-sm text-foreground">
                      <strong className="text-accent">Note:</strong> Payment is collected 
                      only after your paper is approved. No refunds after approval and payment.
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Scale, FileText, Ban, AlertTriangle, CreditCard, Award, BookOpen, Gavel } from "lucide-react";

const sections = [
  {
    icon: BookOpen,
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using the IRP Publication platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services. We reserve the right to update these terms at any time, and continued use constitutes acceptance of changes.",
  },
  {
    icon: FileText,
    title: "2. Paper Submission & Review",
    content:
      "Authors must ensure that submitted papers are original work and have not been published or submitted elsewhere simultaneously. All submissions undergo our internal peer-review process. IRP Publication reserves the right to reject submissions that do not meet our quality standards, formatting guidelines, or originality requirements. Plagiarism in any form will result in immediate rejection and potential blacklisting.",
  },
  {
    icon: Scale,
    title: "3. Intellectual Property",
    content:
      "Authors retain the copyright of their published work. By submitting a paper, you grant IRP Publication a non-exclusive license to publish, distribute, and display the work on our platform. Published papers may be cited and referenced by others in accordance with standard academic practices. You warrant that your submission does not infringe upon any third-party intellectual property rights.",
  },
  {
    icon: CreditCard,
    title: "4. Publication Fees & Payments",
    content:
      "Publication fees are charged upon acceptance of a paper and must be paid before the paper is published. Fee amounts are displayed at the time of submission and may vary based on publication type and additional services (e.g., hard copy). Payments are non-refundable once the paper has been published. Refunds for rejected papers will be processed if payment was made prior to the review decision.",
  },
  {
    icon: Award,
    title: "5. Certificates",
    content:
      "Publication certificates are issued digitally upon successful publication and payment verification. Each certificate contains a unique verification number and QR code for authenticity. Certificates are non-transferable and represent the specific paper and authors listed. Tampering with or forging certificates is strictly prohibited and may result in legal action.",
  },
  {
    icon: Ban,
    title: "6. Prohibited Conduct",
    content:
      "Users must not: submit plagiarized, fraudulent, or misleading content; attempt to manipulate the review process; share login credentials with unauthorized parties; use automated systems to scrape or access platform data; harass or impersonate other users or staff; or violate any applicable laws while using our platform.",
  },
  {
    icon: AlertTriangle,
    title: "7. Disclaimer",
    content:
      "IRP Publication is an independent research publication platform and is not affiliated with IEEE, Scopus, UGC, or any other indexing body. All publications are peer-reviewed through our internal review process. We make no guarantees regarding indexing by external databases. The platform is provided \"as is\" without warranties of any kind, express or implied.",
  },
  {
    icon: Gavel,
    title: "8. Limitation of Liability",
    content:
      "IRP Publication shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform. Our total liability is limited to the amount of fees paid by you in the twelve months preceding the claim. We are not responsible for delays caused by technical issues, force majeure, or circumstances beyond our reasonable control.",
  },
];

export default function TermsOfService() {
  return (
    <Layout>
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Terms of Service</h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Please read these terms carefully before using our platform.
            </p>
            <p className="text-sm text-primary-foreground/60 mt-4">Last updated: February 2026</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="space-y-10">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-card rounded-xl border border-border p-6 lg:p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-serif text-xl font-semibold text-foreground">{section.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-12">{section.content}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 bg-muted/50 rounded-xl border border-border p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Questions about these terms? Contact us at{" "}
              <a href="mailto:contact@irppublication.org" className="text-primary hover:underline">
                contact@irppublication.org
              </a>.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}

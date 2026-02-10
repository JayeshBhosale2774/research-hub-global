import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Shield, Eye, Database, Lock, Mail, UserCheck, Globe, FileText } from "lucide-react";

const sections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: [
      "**Personal Information:** When you register, we collect your name, email address, phone number, and institutional affiliation.",
      "**Submission Data:** Research papers, abstracts, author details, and related metadata submitted through our platform.",
      "**Payment Information:** Transaction IDs and payment proof for publication fees. We do not store credit/debit card numbers.",
      "**Usage Data:** Browser type, IP address, pages visited, and interaction patterns for analytics and improvement purposes.",
    ],
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    content: [
      "To process and manage your paper submissions and publications.",
      "To verify payments and issue certificates upon successful publication.",
      "To communicate updates about your submissions, reviews, and publication status.",
      "To improve our platform, services, and user experience.",
      "To comply with legal obligations and enforce our terms.",
    ],
  },
  {
    icon: UserCheck,
    title: "Information Sharing",
    content: [
      "**Published Papers:** Author names and paper details are made publicly available upon publication.",
      "**Reviewers:** Submitted papers are shared with our review panel for evaluation. Reviewer identities remain confidential.",
      "**Legal Requirements:** We may disclose information if required by law or to protect our rights and safety.",
      "We do **not** sell, trade, or rent your personal information to third parties for marketing purposes.",
    ],
  },
  {
    icon: Lock,
    title: "Data Security",
    content: [
      "We use industry-standard encryption (SSL/TLS) to protect data in transit.",
      "Access to personal data is restricted to authorized personnel only.",
      "Paper files are stored securely and access is controlled based on publication status.",
      "While we strive to protect your data, no method of electronic transmission is 100% secure.",
    ],
  },
  {
    icon: Globe,
    title: "Cookies & Tracking",
    content: [
      "We use essential cookies to maintain your session and authentication state.",
      "Analytics cookies help us understand how visitors interact with our platform.",
      "You can disable cookies through your browser settings, though some features may not work properly.",
    ],
  },
  {
    icon: Mail,
    title: "Your Rights",
    content: [
      "**Access:** You can request a copy of the personal data we hold about you.",
      "**Correction:** You can update or correct your profile information at any time.",
      "**Deletion:** You can request deletion of your account and associated data, subject to legal retention requirements.",
      "**Withdrawal:** You can withdraw consent for non-essential data processing at any time.",
      "To exercise these rights, contact us at **contact@irppublication.org**.",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <Layout>
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Privacy Policy</h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              How we collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-primary-foreground/60 mt-4">Last updated: February 2026</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="bg-card rounded-xl border border-border p-6 lg:p-8 mb-8">
            <p className="text-muted-foreground">
              IRP Publication ("we", "our", "us") is committed to protecting your privacy. This policy explains how we handle your personal information when you use our research publication platform.
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-serif text-xl font-semibold text-foreground">{section.title}</h2>
                </div>
                <ul className="space-y-3 pl-12">
                  {section.content.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 bg-muted/50 rounded-xl border border-border p-6 text-center">
            <p className="text-sm text-muted-foreground">
              If you have any questions about this privacy policy, please contact us at{" "}
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

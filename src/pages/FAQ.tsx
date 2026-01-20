import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HelpCircle, FileText, CreditCard, Award, Clock, Shield, ArrowRight } from "lucide-react";

const faqCategories = [
  {
    title: "Submission Process",
    icon: FileText,
    faqs: [
      {
        question: "How do I submit a paper?",
        answer: "To submit a paper, create an account or log in, then navigate to the 'Submit Paper' page. Fill in the required details including title, abstract, authors, and upload your paper in PDF format. Once submitted, you'll receive a confirmation and can track your submission status from your dashboard."
      },
      {
        question: "What file formats are accepted?",
        answer: "We only accept papers in PDF format. Please ensure your PDF is well-formatted following our author guidelines, with all fonts embedded and images at 300 DPI or higher resolution."
      },
      {
        question: "Can I submit multiple papers?",
        answer: "Yes, you can submit multiple papers. Each paper will be reviewed independently, and separate publication fees apply to each accepted paper."
      },
      {
        question: "How can I track my submission status?",
        answer: "After logging in, go to your Author Dashboard and click on 'My Papers'. You'll see the current status of all your submissions including: Submitted, Under Review, Revision Requested, Approved, Rejected, or Published."
      },
      {
        question: "Can I withdraw my submission?",
        answer: "Yes, you can withdraw your submission before it is published. Contact us through the Contact page with your paper details and withdrawal request."
      }
    ]
  },
  {
    title: "Review Process",
    icon: Clock,
    faqs: [
      {
        question: "How long does the review process take?",
        answer: "The review process typically takes 3-7 business days. However, this may vary depending on the complexity of the paper and reviewer availability. You will be notified via your dashboard when there's an update."
      },
      {
        question: "What happens if my paper is rejected?",
        answer: "If your paper is rejected, you will receive feedback explaining the reasons. You may revise and resubmit your paper addressing the concerns raised. A new review process will begin for resubmitted papers."
      },
      {
        question: "What if revision is requested?",
        answer: "If revisions are requested, you'll see the admin's notes in your dashboard. Make the necessary changes to your paper and resubmit it through your dashboard. You'll typically have a deadline to submit revisions."
      },
      {
        question: "Is the review process peer-reviewed?",
        answer: "Yes, all submissions undergo a thorough review process by our editorial team and subject matter experts to ensure quality and originality of the research."
      }
    ]
  },
  {
    title: "Publication & Fees",
    icon: CreditCard,
    faqs: [
      {
        question: "What is the publication fee?",
        answer: "The base publication fee is ₹1,000 for papers with up to 3 authors. Additional authors beyond 3 incur an extra fee of ₹200 per author. Optional hardcopy certificates are available for an additional ₹500."
      },
      {
        question: "When should I pay the publication fee?",
        answer: "Payment is required only after your paper has been approved for publication. You will not be charged if your paper is rejected. Once approved, you can proceed to payment from your dashboard."
      },
      {
        question: "What payment methods are accepted?",
        answer: "We accept UPI payments. After your paper is approved, you'll see a QR code for payment. Upload your payment screenshot/proof for verification. Once verified, your paper will be published."
      },
      {
        question: "Can I get a refund?",
        answer: "Refunds are processed on a case-by-case basis. If you've paid but your paper hasn't been published yet, contact us for refund assistance. Once a paper is published, refunds are generally not available."
      }
    ]
  },
  {
    title: "Certificates",
    icon: Award,
    faqs: [
      {
        question: "How do I get my publication certificate?",
        answer: "Once your paper is published and payment is verified, a digital certificate will be automatically generated. You can download it from the 'My Certificates' section in your Author Dashboard."
      },
      {
        question: "How can I verify a certificate?",
        answer: "Each certificate includes a unique certificate number and QR code. Scan the QR code or visit our Verify Certificate page and enter the certificate number to verify its authenticity."
      },
      {
        question: "Can I get a hardcopy certificate?",
        answer: "Yes, hardcopy certificates are available for an additional fee of ₹500. Select this option during the payment process and provide your shipping address. Delivery typically takes 7-14 business days."
      },
      {
        question: "What information is on the certificate?",
        answer: "The certificate includes the paper title, all author names, publication date, unique certificate number, and a QR code for verification. It serves as official proof of publication."
      }
    ]
  },
  {
    title: "Guidelines & Policies",
    icon: Shield,
    faqs: [
      {
        question: "What is the plagiarism policy?",
        answer: "All papers undergo AI-powered plagiarism detection. Papers with more than 40% similarity to existing content will be rejected. This includes self-plagiarism. Ensure proper citations for all referenced material."
      },
      {
        question: "What format should my paper follow?",
        answer: "Papers should follow IEEE format guidelines: A4 size, Times New Roman font, two-column layout, single-spaced, with proper sections including Abstract, Introduction, Methodology, Results, Conclusion, and References. Download our template from the Guidelines page."
      },
      {
        question: "Are there any topic restrictions?",
        answer: "We accept papers across various engineering domains including ECE, CSE, IT, Mechanical, Civil, Electrical, and Aerospace. Papers must be original research and not previously published elsewhere."
      },
      {
        question: "What is the page limit?",
        answer: "Papers should be between 6-12 pages in length, including references, figures, and tables. Papers outside this range may be asked to be revised."
      }
    ]
  }
];

export default function FAQ() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Find answers to common questions about paper submission, review process, 
              publication fees, and certificates.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-10">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    {category.title}
                  </h2>
                </div>
                
                <Accordion type="single" collapsible className="bg-card rounded-xl border border-border">
                  {category.faqs.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`${category.title}-${index}`}
                      className="border-b border-border last:border-0"
                    >
                      <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-muted/50">
                        <span className="font-medium text-foreground">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4 text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
              Still Have Questions?
            </h2>
            <p className="text-muted-foreground mb-6">
              Can't find the answer you're looking for? Feel free to reach out to our 
              support team and we'll get back to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg">
                  Contact Support
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/guidelines">
                <Button variant="outline" size="lg">
                  View Guidelines
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

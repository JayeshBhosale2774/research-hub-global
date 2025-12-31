import { Link } from "react-router-dom";
import { BookOpen, Mail, MapPin, Phone, ExternalLink } from "lucide-react";

const footerLinks = {
  publications: [
    { name: "Journals", href: "/publications/journals" },
    { name: "Magazines", href: "/publications/magazines" },
    { name: "Research Papers", href: "/publications/papers" },
    { name: "Browse by Domain", href: "/publications" },
  ],
  resources: [
    { name: "Author Guidelines", href: "/guidelines" },
    { name: "Paper Format", href: "/format" },
    { name: "Submit Paper", href: "/submit" },
    { name: "Check Status", href: "/dashboard" },
  ],
  support: [
    { name: "Verify Certificate", href: "/verify" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact Us", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
};

const domains = [
  "CSE", "ECE", "IT", "Mechanical", "Civil", "Electrical", "Aerospace"
];

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center shadow-gold">
                <BookOpen className="w-7 h-7 text-accent-foreground" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold">IRP Publication</h2>
                <p className="text-sm text-primary-foreground/70">
                  International Research Paper Publication
                </p>
              </div>
            </Link>
            <p className="text-sm text-primary-foreground/80 mb-4 max-w-sm">
              A trusted platform for researchers and academics to publish their work
              and contribute to the global knowledge base.
            </p>
            <div className="space-y-2 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contact@irppublication.org</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+91 XXXXX XXXXX</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-accent mb-4">Publications</h3>
            <ul className="space-y-2">
              {footerLinks.publications.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-accent mb-4">For Authors</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-accent mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Domains */}
        <div className="mt-10 pt-8 border-t border-primary-foreground/10">
          <h3 className="font-semibold text-accent mb-4">Research Domains</h3>
          <div className="flex flex-wrap gap-2">
            {domains.map((domain) => (
              <span
                key={domain}
                className="px-3 py-1 bg-primary-foreground/10 rounded-full text-xs font-medium text-primary-foreground/80"
              >
                {domain}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer & Copyright */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="bg-primary-foreground/5 rounded-lg p-4 mb-4">
            <p className="text-xs text-primary-foreground/60 text-center">
              <strong className="text-primary-foreground/80">Disclaimer:</strong> IRP Publication is an independent research publication platform 
              and is not affiliated with IEEE, Scopus, UGC, or any other indexing body. All publications are peer-reviewed 
              through our internal review process.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
            <p>© {new Date().getFullYear()} IRP Publication. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/terms" className="hover:text-primary-foreground transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="hover:text-primary-foreground transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

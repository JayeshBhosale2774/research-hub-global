import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BookOpen, Users, FileText, Award, LogIn, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Home", href: "/" },
  { 
    name: "Publications", 
    href: "/publications",
    submenu: [
      { name: "Journals", href: "/publications/journals" },
      { name: "Magazines", href: "/publications/magazines" },
      { name: "Research Papers", href: "/publications/papers" },
    ]
  },
  { name: "Conferences", href: "/conferences" },
  { name: "Standards", href: "/standards" },
  { name: "Verify Certificate", href: "/verify" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-serif text-lg font-bold text-foreground leading-tight">
                IRP Publication
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">
                International Research Paper Publication
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.submenu && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.href}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                    location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.name}
                  {item.submenu && <ChevronDown className="w-3 h-3" />}
                </Link>
                
                {/* Dropdown */}
                <AnimatePresence>
                  {item.submenu && activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-48 bg-card rounded-lg shadow-lg border border-border overflow-hidden"
                    >
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                <LogIn className="w-4 h-4 mr-1" />
                Login
              </Button>
            </Link>
            <Link to="/submit">
              <Button variant="academic" size="sm">
                Submit Paper
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-border"
            >
              <div className="py-4 space-y-1">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-2.5 text-sm font-medium rounded-md ${
                        location.pathname === item.href
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {item.name}
                    </Link>
                    {item.submenu && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-4 px-4 flex flex-col gap-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/submit" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="academic" className="w-full">
                      Submit Paper
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

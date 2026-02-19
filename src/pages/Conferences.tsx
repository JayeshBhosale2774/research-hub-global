import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Calendar, MapPin, Clock, 
  ArrowRight, ExternalLink, Loader2 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Conferences() {
  const { data: conferences, isLoading } = useQuery({
    queryKey: ["conferences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conferences")
        .select("*")
        .eq("is_active", true)
        .order("start_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const now = new Date();
  const upcoming = conferences?.filter(c => new Date(c.end_date) >= now) ?? [];
  const past = conferences?.filter(c => new Date(c.end_date) < now) ?? [];

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Conferences
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Present your research at our international conferences and connect 
              with researchers from around the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Loading */}
      {isLoading && (
        <div className="py-24 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && (
        <>
          {/* Upcoming Conferences */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4 lg:px-8">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
                Upcoming Conferences
              </h2>

              {upcoming.length === 0 ? (
                <p className="text-muted-foreground">No upcoming conferences at the moment. Check back soon!</p>
              ) : (
                <div className="space-y-6">
                  {upcoming.map((conf, index) => {
                    const deadlinePassed = new Date(conf.submission_deadline) < now;
                    return (
                      <motion.div
                        key={conf.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="bg-card rounded-xl border border-border overflow-hidden"
                      >
                        <div className="p-6 lg:p-8">
                          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                            {/* Date Badge */}
                            <div className="flex-shrink-0">
                              <div className="w-20 h-20 rounded-xl bg-primary flex flex-col items-center justify-center text-primary-foreground">
                                <span className="text-2xl font-bold">
                                  {new Date(conf.start_date).getDate()}
                                </span>
                                <span className="text-xs uppercase">
                                  {new Date(conf.start_date).toLocaleString("en", { month: "short" })}
                                </span>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                {!deadlinePassed ? (
                                  <span className="px-2 py-0.5 bg-success/10 text-success text-xs font-medium rounded-full">
                                    Submissions Open
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-warning/10 text-warning text-xs font-medium rounded-full">
                                    Deadline Passed
                                  </span>
                                )}
                                {conf.domains?.map((domain) => (
                                  <span key={domain} className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                                    {domain}
                                  </span>
                                ))}
                              </div>

                              <h3 className="font-serif text-xl lg:text-2xl font-semibold text-foreground mb-2">
                                {conf.title}
                              </h3>
                              {conf.description && (
                                <p className="text-sm text-muted-foreground mb-4">
                                  {conf.description}
                                </p>
                              )}

                              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="w-4 h-4 text-primary" />
                                  <span>
                                    {new Date(conf.start_date).toLocaleDateString("en", { month: "short", day: "numeric" })}
                                    {" – "}
                                    {new Date(conf.end_date).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="w-4 h-4 text-primary" />
                                  <span>{conf.venue}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="w-4 h-4 text-destructive" />
                                  <span>Deadline: {new Date(conf.submission_deadline).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}</span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            {!deadlinePassed && (
                              <div className="flex lg:flex-col gap-2">
                                <Link to="/submit?type=conference">
                                  <Button variant="academic">
                                    Submit Paper
                                    <ArrowRight className="w-4 h-4" />
                                  </Button>
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Past Conferences */}
          {past.length > 0 && (
            <section className="py-16 bg-muted/50">
              <div className="container mx-auto px-4 lg:px-8">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
                  Past Conferences
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {past.map((conf, index) => (
                    <motion.div
                      key={conf.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-card rounded-xl border border-border p-6"
                    >
                      <h3 className="font-semibold text-foreground mb-2">{conf.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(conf.start_date).toLocaleDateString("en", { month: "long", year: "numeric" })}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {conf.venue}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Call for Papers */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-primary-foreground mb-4">
            Submit Your Research
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-6">
            Present your work at our conferences and get published in conference proceedings. 
            Same review process and certification as regular publications.
          </p>
          <Link to="/submit?type=conference">
            <Button variant="hero" size="xl">
              Submit Conference Paper
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}

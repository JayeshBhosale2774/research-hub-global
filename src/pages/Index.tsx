import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { DomainsSection } from "@/components/home/DomainsSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { PricingSection } from "@/components/home/PricingSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <DomainsSection />
      <FeaturesSection />
      <ProcessSection />
      <PricingSection />
      <CTASection />
    </Layout>
  );
};

export default Index;

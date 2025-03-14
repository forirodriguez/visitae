import HeroSection from "@/components/home/HeroSection";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import InteractiveMap from "@/components/properties/InteractiveMap";
import BuyerTools from "@/components/tools/BuyerTools";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/common/CallToAction";
import ProblemSolution from "@/components/home/ProblemSolution";
import HowItWorks from "@/components/home/HowItWorks";
import Features from "@/components/home/Features";
import Faq from "@/components/common/Faq";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProblemSolution />
      <Features />
      <HowItWorks />
      <FeaturedProperties />
      <InteractiveMap />
      <BuyerTools />
      <Testimonials />
      <Faq />
      <CallToAction />
    </>
  );
}

import LandingNav from "@/components/landing/nav";
import Hero from "@/components/landing/hero";
import Problem from "@/components/landing/problem";
import HowItWorks from "@/components/landing/how-it-works";
import Testimonials from "@/components/landing/testimonials";
import CTA from "@/components/landing/cta";
import Footer from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <LandingNav />
      <Hero />
      <Problem />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}

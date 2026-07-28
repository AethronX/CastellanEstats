import dynamic from "next/dynamic";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Preloader from "@/components/ui/Preloader";
import CustomCursor from "@/components/ui/CustomCursor";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import CinematicJourney from "@/components/sections/CinematicJourney";

/* Below-the-fold acts are code-split; the opening scene ships first. */
const Story = dynamic(() => import("@/components/sections/Story"));
const FeaturedProjects = dynamic(() => import("@/components/sections/FeaturedProjects"));
const Showcase = dynamic(() => import("@/components/sections/Showcase"));
const Pillars = dynamic(() => import("@/components/sections/Pillars"));
const Services = dynamic(() => import("@/components/sections/Services"));
const Investment = dynamic(() => import("@/components/sections/Investment"));
const Timeline = dynamic(() => import("@/components/sections/Timeline"));
const Stats = dynamic(() => import("@/components/sections/Stats"));
const Awards = dynamic(() => import("@/components/sections/Awards"));
const Testimonials = dynamic(() => import("@/components/sections/Testimonials"));
const FAQ = dynamic(() => import("@/components/sections/FAQ"));
const Contact = dynamic(() => import("@/components/sections/Contact"));
const Footer = dynamic(() => import("@/components/layout/Footer"));

export default function Home() {
  return (
    <SmoothScroll>
      <Preloader />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <CinematicJourney />
        <Story />
        <Stats />
        <FeaturedProjects />
        <Showcase />
        <Pillars />
        <Services />
        <Investment />
        <Timeline />
        <Awards />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </SmoothScroll>
  );
}

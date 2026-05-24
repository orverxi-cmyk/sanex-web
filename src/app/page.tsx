
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Highlights } from "@/components/sections/Highlights";
import { Services } from "@/components/sections/Services";
import { ImpactDashboard } from "@/components/sections/ImpactDashboard";
import { MilestoneTracker } from "@/components/sections/MilestoneTracker";
import { RegionalPortal } from "@/components/sections/RegionalPortal";
import { VideoHighlight } from "@/components/sections/VideoHighlight";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Highlights />
        <VideoHighlight />
        <Services />
        <ImpactDashboard />
        <MilestoneTracker />
        <RegionalPortal />
      </main>
      <Footer />
    </div>
  );
}

import { Navbar } from "@/components/sections/Navbar";
import { HomeSlider } from "@/components/sections/HomeSlider";
import { Services } from "@/components/sections/Services";
import { ImpactDashboard } from "@/components/sections/ImpactDashboard";
import { VideoHighlight } from "@/components/sections/VideoHighlight";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-arial">
      <Navbar />
      <main className="flex-grow">
        <HomeSlider />
        <Services />
        <VideoHighlight />
        <ImpactDashboard />
      </main>
      <Footer />
    </div>
  );
}

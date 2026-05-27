import { Navbar } from "@/components/sections/Navbar";
import { HomeSlider } from "@/components/sections/HomeSlider";
import { Highlights } from "@/components/sections/Highlights";
import { Services } from "@/components/sections/Services";
import { ImpactDashboard } from "@/components/sections/ImpactDashboard";
import { VideoHighlight } from "@/components/sections/VideoHighlight";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HomeSlider />
        <Highlights />
        <Services />
        <VideoHighlight />
        <ImpactDashboard />
      </main>
      <Footer />
    </div>
  );
}

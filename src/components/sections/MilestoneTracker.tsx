
import { Clock, Rocket, Shield, Globe } from "lucide-react";

export function MilestoneTracker() {
  const milestones = [
    {
      year: "2017",
      title: "Founding",
      description: "SANEX Company Ltd was established to address Rwanda's liquid waste challenges.",
      icon: <Clock className="h-6 w-6" />
    },
    {
      year: "2021",
      title: "Licensing",
      description: "Achieved official licensing for liquid waste collection and transportation.",
      icon: <Shield className="h-6 w-6" />
    },
    {
      year: "2024",
      title: "Expansion",
      description: "Expanded services to decentralized wastewater treatment systems (DWTS).",
      icon: <Rocket className="h-6 w-6" />
    },
    {
      year: "Beyond",
      title: "Nationwide Reach",
      description: "Establishing offices in Musanze, Huye, Nyagatare, and Rwamagana.",
      icon: <Globe className="h-6 w-6" />
    }
  ];

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl lg:text-5xl font-bold font-headline mb-4">Our Growth Journey</h2>
          <p className="text-muted-foreground text-lg max-w-[700px] mx-auto">
            From a small startup to a key player in Rwanda's liquid waste management sector.
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-border hidden lg:block" />

          <div className="space-y-12 lg:space-y-0">
            {milestones.map((milestone, i) => (
              <div key={i} className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-0 ${i % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="w-full lg:w-1/2 flex lg:justify-start">
                  <div className={`p-8 rounded-2xl bg-background border shadow-sm max-w-[450px] transition-all hover:shadow-md ${i % 2 === 0 ? 'lg:mr-12' : 'lg:ml-12'}`}>
                    <span className="text-primary font-bold text-lg mb-2 block">{milestone.year}</span>
                    <h3 className="text-2xl font-bold font-headline mb-3">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>

                {/* Center Circle */}
                <div className="relative z-10">
                  <div className="h-16 w-16 rounded-full bg-primary border-4 border-white shadow-lg flex items-center justify-center text-white">
                    {milestone.icon}
                  </div>
                </div>

                <div className="w-full lg:w-1/2 hidden lg:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

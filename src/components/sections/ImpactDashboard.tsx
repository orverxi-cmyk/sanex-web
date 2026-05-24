
import { CheckCircle, Leaf, Users, Globe, Building2, Sparkles } from "lucide-react";

export function ImpactDashboard() {
  const impacts = [
    {
      title: "Environmental Preservation",
      points: [
        "We have successfully treated and managed thousands of cubic meters of liquid waste, preventing harmful pollutants from contaminating natural ecosystems.",
        "Our decentralized wastewater treatment systems (DWTS) have contributed to cleaner water sources, promoting biodiversity and reducing environmental degradation."
      ],
      icon: <Leaf className="h-6 w-6 text-secondary" />
    },
    {
      title: "Public Health Improvement",
      points: [
        "By reducing the risks associated with poor liquid waste management, we have helped to mitigate waterborne diseases, improving the overall health and well-being of the communities we serve.",
        "Our awareness campaigns on waste management have empowered local populations to adopt safer practices, fostering healthier living environments."
      ],
      icon: <CheckCircle className="h-6 w-6 text-primary" />
    },
    {
      title: "Community Development",
      points: [
        "SANEX has directly created jobs for skilled and unskilled workers, contributing to local economic growth.",
        "Our training programs have enhanced the capacities of local communities in managing liquid waste and understanding sustainable practices."
      ],
      icon: <Users className="h-6 w-6 text-secondary" />
    },
    {
      title: "Expansion and Accessibility",
      points: [
        "We have extended our services to multiple regions across Rwanda, ensuring that both urban and rural areas have access to reliable and efficient waste management solutions."
      ],
      icon: <Globe className="h-6 w-6 text-primary" />
    },
    {
      title: "Sustainable Urbanization",
      points: [
        "Our work supports Rwanda's vision for sustainable urban growth by providing essential infrastructure for wastewater management in growing towns and cities."
      ],
      icon: <Building2 className="h-6 w-6 text-secondary" />
    }
  ];

  return (
    <section id="impact" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-6">
          <h2 className="text-4xl lg:text-5xl font-bold font-headline leading-tight">Impact Since Our Inception</h2>
          <p className="text-xl text-primary-foreground/80 leading-relaxed">
            Since its establishment in 2017, SANEX Company Ltd has made a significant impact in addressing the challenges of liquid waste management across Rwanda. Our commitment to sustainable and innovative solutions has resulted in measurable outcomes that benefit communities, the environment, and the economy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {impacts.map((impact, i) => (
            <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-6 hover:bg-white/10 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center">
                {impact.icon}
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-bold font-headline">{impact.title}</h4>
                <ul className="space-y-3">
                  {impact.points.map((point, pi) => (
                    <li key={pi} className="text-sm text-primary-foreground/70 leading-relaxed flex gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto p-8 lg:p-12 rounded-3xl bg-white/10 border border-white/20 text-center relative overflow-hidden">
          <Sparkles className="absolute top-4 right-4 h-12 w-12 opacity-10" />
          <p className="text-lg lg:text-xl font-medium leading-relaxed italic mb-6">
            SANEX Company Ltd is proud of these achievements and remains committed to driving further positive change in Rwanda's liquid waste management sector. Together, we are building a cleaner, healthier, and more sustainable future.
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="h-0.5 w-8 bg-secondary" />
            <span className="font-bold tracking-widest uppercase text-xs">Transforming Waste into Opportunity</span>
            <div className="h-0.5 w-8 bg-secondary" />
          </div>
        </div>
      </div>
    </section>
  );
}

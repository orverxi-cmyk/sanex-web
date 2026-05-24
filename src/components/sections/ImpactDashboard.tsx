
import { BarChart, CheckCircle, Leaf, Users } from "lucide-react";

export function ImpactDashboard() {
  const stats = [
    {
      label: "Waste Treated",
      value: "15k+",
      unit: "m³",
      icon: <Leaf className="h-6 w-6 text-secondary" />,
      description: "Thousands of cubic meters of liquid waste treated and managed safely."
    },
    {
      label: "Health Impact",
      value: "Mitigated",
      unit: "Risks",
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      description: "Significantly reduced waterborne disease risks in served communities."
    },
    {
      label: "Local Jobs",
      value: "300+",
      unit: "Positions",
      icon: <Users className="h-6 w-6 text-secondary" />,
      description: "Direct employment created for skilled and unskilled Rwandan workers."
    },
    {
      label: "Client Base",
      value: "114+",
      unit: "Partners",
      icon: <BarChart className="h-6 w-6 text-primary" />,
      description: "Serving a growing portfolio of industries, institutions, and government."
    }
  ];

  return (
    <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold font-headline leading-tight">Measurable Impact Since Our Inception</h2>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              Since its establishment in 2017, SANEX Company Ltd has made a significant impact in addressing the challenges of liquid waste management across Rwanda.
            </p>
            <div className="space-y-6">
              <div className="flex gap-4 p-4 rounded-xl bg-white/10 border border-white/20">
                <Leaf className="h-8 w-8 flex-shrink-0 text-secondary" />
                <div>
                  <h4 className="font-bold">Environmental Preservation</h4>
                  <p className="text-sm opacity-80">Our systems contribute to cleaner water sources and promote biodiversity.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl bg-white/10 border border-white/20">
                <Users className="h-8 w-8 flex-shrink-0 text-secondary" />
                <div>
                  <h4 className="font-bold">Sustainable Urbanization</h4>
                  <p className="text-sm opacity-80">Providing essential infrastructure for growing Rwandan towns and cities.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-4 hover:bg-white/10 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center mb-2">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-4xl font-bold font-headline">{stat.value}</div>
                  <div className="text-sm font-medium text-secondary uppercase tracking-widest">{stat.label}</div>
                </div>
                <p className="text-sm text-primary-foreground/70">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

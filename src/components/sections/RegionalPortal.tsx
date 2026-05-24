
import { MapPin } from "lucide-react";

export function RegionalPortal() {
  const regions = [
    { name: "Kigali", status: "Operational Headquarters", capacity: "Full Fleet" },
    { name: "Musanze", status: "Strategic Hub", capacity: "Service Center" },
    { name: "Huye", status: "Planned Expansion", capacity: "Regional Office" },
    { name: "Nyagatare", status: "Industrial Focus", capacity: "Specialized Unit" },
    { name: "Rwamagana", status: "Community Outreach", capacity: "Local Support" }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/3 space-y-6">
            <h2 className="text-4xl font-bold font-headline leading-tight">Regional Availability Portal</h2>
            <p className="text-lg text-muted-foreground">
              To better serve our valued customers, SANEX is establishing operational offices in key towns across Rwanda, ensuring reliable, high-quality, and timely services are always within reach.
            </p>
            <div className="p-6 rounded-2xl bg-secondary/5 border border-secondary/20">
              <div className="flex gap-4 items-center">
                <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold">Rwanda Nationwide</div>
                  <div className="text-sm text-muted-foreground">Urban & Rural Connectivity</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {regions.map((region, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-white border shadow-sm hover:border-primary/50 transition-all cursor-default">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold font-headline group-hover:text-primary transition-colors">{region.name}</h3>
                  <div className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary">
                    ACTIVE
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    {region.status}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {region.capacity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

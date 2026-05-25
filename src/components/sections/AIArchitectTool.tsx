
"use client";

import React from "react";
import { getWasteSolutionArchitectRecommendation, type WasteSolutionArchitectOutput } from "@/ai/flows/ai-waste-solution-architect-recommendation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, ClipboardCheck, Clock, Lightbulb } from "lucide-react";

export function AIArchitectTool() {
  const [sector, setSector] = React.useState("");
  const [capacity, setCapacity] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<WasteSolutionArchitectOutput | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sector || !capacity) return;
    
    setLoading(true);
    try {
      const recommendation = await getWasteSolutionArchitectRecommendation({
        businessSector: sector,
        capacityData: capacity,
      });
      setResult(recommendation);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-5 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-[1000px] mx-auto bg-muted/30 rounded-2xl p-6 lg:p-8 border shadow-sm">
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="lg:w-2/5 space-y-4">
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="h-3 w-3" /> GenAI Powered
              </div>
              <h2 className="text-2xl font-bold font-headline leading-tight">AI Waste Architect</h2>
              <p className="text-sm text-muted-foreground">
                Get an immediate intelligent recommendation for your specific facility requirements.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <Label htmlFor="sector" className="text-xs">Facility Sector</Label>
                  <Select onValueChange={setSector} value={sector}>
                    <SelectTrigger id="sector" className="bg-white h-9 text-xs">
                      <SelectValue placeholder="Select business sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hospital">Hospital / Healthcare</SelectItem>
                      <SelectItem value="School">School / Educational</SelectItem>
                      <SelectItem value="Hotel">Hotel / Hospitality</SelectItem>
                      <SelectItem value="Residential">Residential Complex</SelectItem>
                      <SelectItem value="Industrial">Industrial / Factory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="capacity" className="text-xs">Current Capacity / Size</Label>
                  <Input 
                    id="capacity" 
                    placeholder="e.g. 100 rooms" 
                    className="bg-white h-9 text-xs"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full bg-secondary h-10 text-xs" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Generate Recommendation"}
                </Button>
              </form>
            </div>

            <div className="lg:w-3/5 flex items-center justify-center min-h-[250px]">
              {result ? (
                <div className="w-full space-y-4 animate-in fade-in zoom-in duration-500">
                  <Card className="border-primary/20 shadow-md bg-white overflow-hidden">
                    <CardHeader className="bg-primary/5 border-b p-4">
                      <div className="flex items-center gap-2 text-primary font-bold text-sm">
                        <ClipboardCheck className="h-4 w-4" /> Recommendation Result
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div className="grid gap-4">
                        <div className="flex gap-3">
                          <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
                            <Lightbulb className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">System</div>
                            <div className="text-base font-bold text-foreground leading-tight">{result.recommendedSystem}</div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            <Clock className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Schedule</div>
                            <div className="text-base font-bold text-foreground leading-tight">{result.recommendedSchedule}</div>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-muted border text-xs leading-relaxed text-muted-foreground">
                          <span className="font-bold text-foreground">Justification:</span> {result.justification}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full border-primary text-primary" onClick={() => setResult(null)}>Reset Tool</Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center space-y-2 opacity-50">
                  <Sparkles className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-xs">Architect results will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

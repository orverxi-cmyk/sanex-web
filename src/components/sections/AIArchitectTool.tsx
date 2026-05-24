
"use client";

import React from "react";
import { getWasteSolutionArchitectRecommendation, type WasteSolutionArchitectOutput } from "@/ai/flows/ai-waste-solution-architect-recommendation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-[1000px] mx-auto bg-muted/30 rounded-3xl p-8 lg:p-12 border shadow-sm">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3 w-3" /> GenAI Powered
              </div>
              <h2 className="text-3xl font-bold font-headline">AI Waste Solutions Architect</h2>
              <p className="text-muted-foreground">
                Get an immediate intelligent recommendation for your specific facility requirements using our advanced architectural tool.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="sector">Facility Sector</Label>
                  <Select onValueChange={setSector} value={sector}>
                    <SelectTrigger id="sector" className="bg-white">
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
                <div className="space-y-2">
                  <Label htmlFor="capacity">Current Capacity / Size</Label>
                  <Input 
                    id="capacity" 
                    placeholder="e.g. 100 rooms, 500 students, 50m³ daily" 
                    className="bg-white"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full bg-secondary h-12" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Generate Recommendation"}
                </Button>
              </form>
            </div>

            <div className="lg:w-3/5 flex items-center justify-center min-h-[300px]">
              {result ? (
                <div className="w-full space-y-6 animate-in fade-in zoom-in duration-500">
                  <Card className="border-primary/20 shadow-lg bg-white overflow-hidden">
                    <CardHeader className="bg-primary/5 border-b pb-4">
                      <div className="flex items-center gap-2 text-primary font-bold">
                        <ClipboardCheck className="h-5 w-5" /> Optimal System Recommendation
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                      <div className="grid gap-6">
                        <div className="flex gap-4">
                          <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
                            <Lightbulb className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Recommended System</div>
                            <div className="text-xl font-bold text-foreground leading-tight">{result.recommendedSystem}</div>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            <Clock className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Maintenance Schedule</div>
                            <div className="text-xl font-bold text-foreground leading-tight">{result.recommendedSchedule}</div>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-muted border text-sm leading-relaxed text-muted-foreground">
                          <span className="font-bold text-foreground">Justification:</span> {result.justification}
                        </div>
                      </div>
                      <Button variant="outline" className="w-full border-primary text-primary" onClick={() => setResult(null)}>Reset Tool</Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center space-y-4 opacity-50">
                  <div className="h-20 w-20 rounded-full bg-muted border-2 border-dashed flex items-center justify-center mx-auto">
                    <Sparkles className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Architect result will appear here</p>
                    <p className="text-sm">Complete the form to see your specialized solution</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

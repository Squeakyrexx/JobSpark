import { generateInsights, type GenerateInsightsInput } from '@/ai/flows/generate-insights';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Job } from '@/lib/types';
import { Lightbulb } from 'lucide-react';

interface InsightsSidebarProps {
  jobs: Job[];
}

export async function InsightsSidebar({ jobs }: InsightsSidebarProps) {
  const insightsInput: GenerateInsightsInput = { jobs };
  const insights = await generateInsights(insightsInput);

  return (
    <Card className="shadow-lg rounded-2xl border-accent bg-accent/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Lightbulb className="h-6 w-6 text-accent-foreground" />
          AI Insights
        </CardTitle>
        <CardDescription>Key takeaways from these listings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3 text-foreground">Top Skills</h3>
          <div className="flex flex-wrap gap-2">
            {insights.topSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="bg-background border-primary/50">{skill}</Badge>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-3 text-foreground">Common Education</h3>
          <div className="flex flex-wrap gap-2">
            {insights.commonEducationRequirements.map((edu) => (
              <Badge key={edu} variant="secondary" className="bg-background border-primary/50">{edu}</Badge>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-3 text-foreground">Salary Trends</h3>
          <p className="text-sm text-muted-foreground">{insights.salaryTrends}</p>
        </div>
      </CardContent>
    </Card>
  );
}

InsightsSidebar.Skeleton = function InsightsSidebarSkeleton() {
    return (
        <Card className="shadow-lg rounded-2xl border-accent bg-accent/10">
            <CardHeader>
                <Skeleton className="h-7 w-32 rounded-md" />
                <Skeleton className="h-4 w-48 mt-2 rounded-md" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Skeleton className="h-5 w-20 mb-3 rounded-md" />
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-16 rounded-md" />
                        <Skeleton className="h-6 w-24 rounded-md" />
                        <Skeleton className="h-6 w-20 rounded-md" />
                    </div>
                </div>
                 <div>
                    <Skeleton className="h-5 w-32 mb-3 rounded-md" />
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-28 rounded-md" />
                        <Skeleton className="h-6 w-40 rounded-md" />
                    </div>
                </div>
                 <div>
                    <Skeleton className="h-5 w-28 mb-3 rounded-md" />
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-2/3 mt-2 rounded-md" />
                </div>
            </CardContent>
        </Card>
    );
}

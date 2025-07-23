'use client';

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Job } from '@/lib/types';
import { ExternalLink, FileText } from 'lucide-react';

interface JobCardProps {
  job: Job;
  showMatchScore: boolean;
}

export function JobCard({ job, showMatchScore }: JobCardProps) {
  const { toast } = useToast();

  const handleGenerateCoverLetter = () => {
    toast({
      title: 'Coming Soon!',
      description: 'AI-powered cover letter generation is on its way.',
    });
  };

  const createJobMarkup = () => {
    let markup = `<span class="text-muted-foreground">{</span>\n`;
    markup += `  "job_title": "<span class="text-foreground font-semibold">${job.job_title}</span>",\n`;
    markup += `  "company": "<span class="text-foreground">${job.company}</span>",\n`;
    markup += `  "location": "<span class="text-foreground">${job.location}</span>",\n`;
    markup += `  "salary": "<span class="text-accent-foreground/80 font-medium">${job.salary}</span>",\n`;
    markup += `  "requirements": [\n`;
    markup += job.requirements.map((req, i) => `    "<span class="text-foreground">${req}</span>"${i < job.requirements.length - 1 ? ',' : ''}`).join('\n');
    markup += `\n  ]`;

    if (showMatchScore && job.match_score) {
      markup += `,\n  "match_score": "<span class="text-accent-foreground font-bold">${job.match_score}</span>"`;
    }

    markup += `\n<span class="text-muted-foreground">}</span>`;
    return { __html: markup };
  };

  return (
    <div className="font-code text-sm p-6 rounded-2xl shadow-lg bg-card border">
        <pre className="leading-relaxed whitespace-pre-wrap">
            <code dangerouslySetInnerHTML={createJobMarkup()} />
        </pre>
        <div className="mt-6 flex flex-wrap gap-2 items-center">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Posting
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Full job details coming soon</DialogTitle>
                        <DialogDescription>
                            This feature is under construction. Soon you'll be able to see the full job posting here.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" onClick={handleGenerateCoverLetter}>
                <FileText className="mr-2 h-4 w-4" />
                Generate Cover Letter
            </Button>
        </div>
    </div>
  );
}

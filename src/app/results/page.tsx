import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { JobCard } from '@/components/job-card';
import { InsightsSidebar } from '@/components/insights-sidebar';
import { Button } from '@/components/ui/button';
import type { Job } from '@/lib/types';

// Mock data as per proposal
const mockJobs: Job[] = [
  {
    job_title: "Frontend Developer",
    company: "PixelSpark",
    location: "Remote",
    salary: "$70,000",
    requirements: ["HTML", "CSS", "React"],
    match_score: "88%",
  },
  {
    job_title: "UX/UI Designer",
    company: "CreativeMinds Inc.",
    location: "New York, NY",
    salary: "$85,000",
    requirements: ["Figma", "Adobe XD", "User Research"],
    match_score: "92%",
  },
  {
    job_title: "Full-Stack Engineer",
    company: "InnovateTech",
    location: "San Francisco, CA",
    salary: "$120,000",
    requirements: ["Node.js", "React", "PostgreSQL", "AWS"],
    match_score: "85%",
  },
  {
    job_title: "Product Manager",
    company: "DataDriven Co.",
    location: "Austin, TX",
    salary: "$110,000",
    requirements: ["Agile", "Roadmapping", "Market Analysis"],
    match_score: "78%",
  },
  {
    job_title: "Data Scientist",
    company: "QuantumLeap AI",
    location: "Remote",
    salary: "$135,000",
    requirements: ["Python", "Machine Learning", "SQL", "Statistics"],
    match_score: "95%",
  },
  {
    job_title: "DevOps Engineer",
    company: "CloudNine Solutions",
    location: "Seattle, WA",
    salary: "$115,000",
    requirements: ["Docker", "Kubernetes", "CI/CD", "Terraform"],
    match_score: "89%",
  },
];

export default function ResultsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const showMatchScore = searchParams?.useResume === 'true';

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 fade-in">
        <Button asChild variant="ghost" className="mb-8">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Search
            </Link>
        </Button>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div className="lg:col-span-3 space-y-6">
          {mockJobs.map((job, index) => (
            <JobCard key={index} job={job} showMatchScore={showMatchScore} />
          ))}
        </div>
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <Suspense fallback={<InsightsSidebar.Skeleton />}>
              <InsightsSidebar jobs={mockJobs} />
            </Suspense>
          </div>
        </aside>
      </div>
    </div>
  );
}

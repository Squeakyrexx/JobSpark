
'use client';
import { useSearchParams } from 'next/navigation';
import { JobCard } from '@/components/job-card';
import type { Job } from '@/lib/types';

interface ResultsContainerProps {
    jobs: Job[];
}

export function ResultsContainer({ jobs }: ResultsContainerProps) {
  const searchParams = useSearchParams();
  const showMatchScore = searchParams.get('useResume') === 'true';

  return (
    <>
      {jobs.map((job, index) => (
        <JobCard key={index} job={job} showMatchScore={showMatchScore} />
      ))}
    </>
  );
}

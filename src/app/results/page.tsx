
'use client';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { JobCard } from '@/components/job-card';
import { InsightsSidebar } from '@/components/insights-sidebar';
import { Button } from '@/components/ui/button';
import type { Job } from '@/lib/types';
import { ResultsContainer } from '@/components/results-container';


export default function ResultsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(() => {
        const storedJobs = sessionStorage.getItem('jobResults');
        if (storedJobs) {
            try {
                setJobs(JSON.parse(storedJobs));
            } catch (error) {
                console.error("Failed to parse job results from session storage", error);
                setJobs([]);
            }
        }
    }, []);

    if (jobs.length === 0) {
        // You might want a better loading or empty state here
        return (
            <div className="container mx-auto py-8 px-4 md:px-6 fade-in text-center">
                 <p>No job results found. Try a different search.</p>
                 <Button asChild variant="ghost" className="mt-4">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Search
                    </Link>
                </Button>
            </div>
        )
    }

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
                    <Suspense fallback={<div>Loading jobs...</div>}>
                        <ResultsContainer jobs={jobs} />
                    </Suspense>
                </div>
                <aside className="lg:col-span-1">
                <div className="sticky top-24">
                    <Suspense fallback={<InsightsSidebar.Skeleton />}>
                    <InsightsSidebar jobs={jobs} />
                    </Suspense>
                </div>
                </aside>
            </div>
        </div>
    )
}

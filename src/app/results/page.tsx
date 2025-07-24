
'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { JobCard } from '@/components/job-card';
import { InsightsSidebar } from '@/components/insights-sidebar';
import { Button } from '@/components/ui/button';
import type { Job } from '@/lib/types';
import { ResultsContainer } from '@/components/results-container';
import { sendToZapier } from '@/services/zapier';
import { useToast } from '@/hooks/use-toast';
import { saveSearchToHistory } from '@/lib/history';

const POLLING_INTERVAL = 5000; // 5 seconds
const POLLING_TIMEOUT = 180000; // 3 minutes
const STILL_WORKING_ERROR = 'The Zapier agent returned an invalid response. It must return a JSON object with a key "jobs" containing an array.';

export default function ResultsPage() {
    const [jobs, setJobs] = useState<Job[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPolling, setIsPolling] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const storedJobs = sessionStorage.getItem('jobResults');
        if (storedJobs) {
            try {
                const parsedJobs = JSON.parse(storedJobs);
                setJobs(parsedJobs);
                sessionStorage.removeItem('jobResults'); // Clear after loading
            } catch (error) {
                console.error("Failed to parse job results from session storage", error);
                setJobs([]);
            }
            return;
        }

        const searchQuery = sessionStorage.getItem('searchQuery');
        if (!searchQuery) {
            setError("No search query found. Please start a new search.");
            return;
        }

        const parsedQuery = JSON.parse(searchQuery);
        let pollTimeoutId: NodeJS.Timeout | null = null;
        const startTime = Date.now();
        setIsPolling(true);

        const pollForResults = async () => {
             if (Date.now() - startTime > POLLING_TIMEOUT) {
                setIsPolling(false);
                setError("The search timed out. The agent took too long to respond.");
                toast({
                    title: 'Search Timeout',
                    description: 'The AI agent did not return results within 3 minutes.',
                    variant: 'destructive',
                });
                if (pollTimeoutId) clearTimeout(pollTimeoutId);
                return;
            }

            try {
                console.log("Polling for results...");
                const results = await sendToZapier(parsedQuery);
                
                // Success case: We got a valid response with a jobs array.
                setIsPolling(false);
                if (pollTimeoutId) clearTimeout(pollTimeoutId);

                toast({
                    title: 'Search complete!',
                    description: `Found ${results.jobs.length} jobs.`,
                });

                setJobs(results.jobs);
                // Only save to session storage if there are results to show
                if (results.jobs.length > 0) {
                    sessionStorage.setItem('jobResults', JSON.stringify(results.jobs));
                }
                saveSearchToHistory({
                    jobTitle: parsedQuery.title || 'Any',
                    address: parsedQuery.location,
                    resultsCount: results.jobs.length,
                });

            } catch (err: any) {
                // This is the key change: We check if the error is the one we expect
                // when the agent is still working.
                if (err.message && err.message.includes(STILL_WORKING_ERROR)) {
                    console.log("Still waiting for results from agent...");
                    pollTimeoutId = setTimeout(pollForResults, POLLING_INTERVAL);
                } else {
                    // This is a real, unexpected error.
                    console.error('Error during polling:', err);
                    setError(err.message || 'An unexpected error occurred while polling for results.');
                    toast({
                        title: 'Search Error',
                        description: err.message || 'Could not get results. Please check the console.',
                        variant: 'destructive',
                    });
                    setIsPolling(false);
                    if (pollTimeoutId) clearTimeout(pollTimeoutId);
                }
            }
        };

        pollForResults();

        return () => {
            if (pollTimeoutId) {
                clearTimeout(pollTimeoutId);
            }
        };
        
    // We only want this to run once on mount, so we disable the lint warning.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (error) {
         return (
            <div className="container mx-auto py-8 px-4 md:px-6 fade-in text-center">
                 <p className="text-destructive">{error}</p>
                 <Button asChild variant="ghost" className="mt-4">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Search
                    </Link>
                </Button>
            </div>
        )
    }

    if (jobs === null) {
        return (
            <div className="container mx-auto py-8 px-4 md:px-6 flex flex-col items-center justify-center text-center fade-in space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-accent-foreground" />
                <h2 className="text-2xl font-headline">Searching for jobs...</h2>
                <p className="text-muted-foreground max-w-md">Your AI agent is searching the web. This may take a few minutes. Please don't close this page.</p>
            </div>
        );
    }
    
    if (jobs.length === 0) {
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
                    New Search
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

import { SearchForm } from '@/components/search-form';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function SearchFormSkeleton() {
  return <Skeleton className="w-full h-[550px] rounded-2xl" />;
}

export default function Home() {
  return (
    <div className="fade-in">
       <Suspense fallback={<SearchFormSkeleton />}>
        <SearchForm />
      </Suspense>
    </div>
  );
}

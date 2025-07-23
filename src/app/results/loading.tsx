import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Skeleton className="h-8 w-36 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div className="lg:col-span-3 space-y-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-60 rounded-2xl" />
          ))}
        </div>
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <Skeleton className="h-[450px] w-full rounded-2xl" />
          </div>
        </aside>
      </div>
    </div>
  );
}

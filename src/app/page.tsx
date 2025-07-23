import { SearchForm } from '@/components/search-form';

export default function Home() {
  return (
    <div className="flex justify-center items-start pt-12 md:pt-20 fade-in">
      <div className="w-full max-w-2xl">
        <SearchForm />
      </div>
    </div>
  );
}

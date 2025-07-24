'use client';
import Link from 'next/link';
import { Sparkles, PanelLeft } from 'lucide-react';
import { SidebarTrigger, useSidebar } from './ui/sidebar';

export function Header() {
  const { isMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {isMobile && <SidebarTrigger className="mr-4" />}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-accent-foreground/80" />
          <span className="font-bold font-headline sm:inline-block">JobSpark</span>
        </Link>
      </div>
    </header>
  );
}

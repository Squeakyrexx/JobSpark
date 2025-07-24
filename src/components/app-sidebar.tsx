'use client';
import { usePathname } from 'next/navigation';
import { FileText, History, Search } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { RecentSearches } from './recent-searches';

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        {/* Can add a logo or title here */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/" onClick={handleLinkClick}>
              <SidebarMenuButton
                isActive={pathname === '/'}
                tooltip={{ children: 'Search' }}
              >
                <Search />
                <span>Search</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <Link href="/resume" onClick={handleLinkClick}>
              <SidebarMenuButton
                isActive={pathname === '/resume'}
                tooltip={{ children: 'My Resume' }}
              >
                <FileText />
                <span>My Resume</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <RecentSearches />
      </SidebarContent>
    </Sidebar>
  );
}

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
            <Link href="/" passHref legacyBehavior>
              <SidebarMenuButton
                as="a"
                isActive={pathname === '/'}
                onClick={handleLinkClick}
                tooltip={{ children: 'Search' }}
              >
                <Search />
                <span>Search</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <Link href="/resume" passHref legacyBehavior>
              <SidebarMenuButton
                as="a"
                isActive={pathname === '/resume'}
                onClick={handleLinkClick}
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

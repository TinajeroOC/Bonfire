import { Flame, Home, SearchIcon } from 'lucide-react'
import Link from 'next/link'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/Sidebar'
import { siteConfig } from '@/config/site'

const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Discover',
    url: '/discover',
    icon: SearchIcon,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className='flex flex-row flex-nowrap items-center justify-start gap-1'>
        <Flame className='h-6 w-6 fill-orange-600 stroke-orange-600 stroke-[3px]' />
        <span className='text-2xl font-semibold'>
          <Link href='/'>{siteConfig.name}</Link>
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
      </SidebarContent>
    </Sidebar>
  )
}
